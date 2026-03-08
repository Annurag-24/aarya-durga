import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import client from '@/api/client';
import { ImageUpload } from '@/components/admin/ImageUpload';
import { useLoader } from '@/contexts/LoaderContext';
import { Trash2, Plus } from 'lucide-react';
import { constructImageUrl } from '@/api/imageUrl';
import { useImagesLoaded } from '@/hooks/useImagesLoaded';

interface HeroContent {
  title_en: string;
  title_hi: string;
  title_mr: string;
  subtitle_en: string;
  subtitle_hi: string;
  subtitle_mr: string;
  image_id?: number;
  existingImageUrl?: string;
}

interface TempleEvent {
  key: string;
  name_en: string;
  name_hi: string;
  name_mr: string;
  date: string;
  description_en: string;
  description_hi: string;
  description_mr: string;
  tag_en: string;
  tag_hi: string;
  tag_mr: string;
  image_id?: number;
  existingImageUrl?: string;
}

interface EventsContent {
  title_en: string;
  title_hi: string;
  title_mr: string;
  events: TempleEvent[];
}

interface GalleryImage {
  key: string;
  image_id?: number;
  existingImageUrl?: string;
}

interface GalleryContent {
  title_en: string;
  title_hi: string;
  title_mr: string;
  subtitle_en: string;
  subtitle_hi: string;
  subtitle_mr: string;
  images: GalleryImage[];
}

interface BannerContent {
  quote_en: string;
  quote_hi: string;
  quote_mr: string;
  image_id?: number;
  existingImageUrl?: string;
}

const EventsGalleryPageEditor = () => {
  const { setLoading: setGlobalLoading } = useLoader();
  const [activeSection, setActiveSection] = useState<'hero' | 'events' | 'gallery' | 'banner'>('hero');

  const [heroContent, setHeroContent] = useState<HeroContent>({
    title_en: '', title_hi: '', title_mr: '',
    subtitle_en: '', subtitle_hi: '', subtitle_mr: '',
  });

  const [eventsContent, setEventsContent] = useState<EventsContent>({
    title_en: '', title_hi: '', title_mr: '',
    events: [],
  });

  const [galleryContent, setGalleryContent] = useState<GalleryContent>({
    title_en: '', title_hi: '', title_mr: '',
    subtitle_en: '', subtitle_hi: '', subtitle_mr: '',
    images: [],
  });

  const [bannerContent, setBannerContent] = useState<BannerContent>({
    quote_en: '',
    quote_hi: '',
    quote_mr: '',
  });

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const imageUrls = [
    heroContent.existingImageUrl,
    bannerContent.existingImageUrl,
    ...eventsContent.events.map(e => e.existingImageUrl),
    ...galleryContent.images.map(img => img.existingImageUrl)
  ].filter(Boolean);
  const imagesLoaded = useImagesLoaded(imageUrls);

  useEffect(() => {
    if (!loading && imagesLoaded) {
      setGlobalLoading(false);
    }
  }, [loading, imagesLoaded, setGlobalLoading]);

  const sections = [
    { key: 'hero', label: 'Hero Section', description: 'Title, subtitle, background image' },
    { key: 'events', label: 'Temple Events', description: 'Events title and dynamic event cards' },
    { key: 'gallery', label: 'Gallery Images', description: 'Gallery title, subtitle & dynamic images' },
    { key: 'banner', label: 'Banner Section', description: 'Banner quote and background image' },
  ] as const;

  useEffect(() => {
    fetchContent();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchContent = async () => {
    setLoading(true);
    setGlobalLoading(true);
    try {
      const response = await client.get('/public/page-content/events_gallery');
      const data = response.data;

      const findContent = (key: string) => data.find((item: any) => item.section_key === key);
      const getImage = (key: string) => {
        const item = findContent(key);
        if (item?.image?.file_url) {
          return constructImageUrl(item.image.file_url);
        }
        return undefined;
      };

      // Hero content
      setHeroContent({
        title_en: findContent('hero_title')?.content_en || '',
        title_hi: findContent('hero_title')?.content_hi || '',
        title_mr: findContent('hero_title')?.content_mr || '',
        subtitle_en: findContent('hero_subtitle')?.content_en || '',
        subtitle_hi: findContent('hero_subtitle')?.content_hi || '',
        subtitle_mr: findContent('hero_subtitle')?.content_mr || '',
        image_id: findContent('hero_image')?.image_id,
        existingImageUrl: getImage('hero_image'),
      });

      // Events content - dynamically detect all events
      const eventNumbers = new Set<number>();
      data.forEach((item: any) => {
        const match = item.section_key.match(/^event_(\d+)_/);
        if (match) {
          eventNumbers.add(parseInt(match[1], 10));
        }
      });

      const sortedEventNumbers = Array.from(eventNumbers).sort((a, b) => a - b);
      const eventsFromAPI = sortedEventNumbers.map((num) => {
        const imageItem = findContent(`event_${num}_image`);
        let imageUrl: string | undefined;
        if (imageItem?.image?.file_url) {
          imageUrl = constructImageUrl(imageItem.image.file_url);
        }

        return {
          key: `event_${num}`,
          name_en: findContent(`event_${num}_name`)?.content_en || '',
          name_hi: findContent(`event_${num}_name`)?.content_hi || '',
          name_mr: findContent(`event_${num}_name`)?.content_mr || '',
          date: findContent(`event_${num}_date`)?.content_en || '',
          description_en: findContent(`event_${num}_description`)?.content_en || '',
          description_hi: findContent(`event_${num}_description`)?.content_hi || '',
          description_mr: findContent(`event_${num}_description`)?.content_mr || '',
          tag_en: findContent(`event_${num}_tag`)?.content_en || '',
          tag_hi: findContent(`event_${num}_tag`)?.content_hi || '',
          tag_mr: findContent(`event_${num}_tag`)?.content_mr || '',
          image_id: imageItem?.image_id,
          existingImageUrl: imageUrl,
        };
      });

      const eventsTitleData = findContent('events_title');
      setEventsContent({
        title_en: eventsTitleData?.content_en || '',
        title_hi: eventsTitleData?.content_hi || '',
        title_mr: eventsTitleData?.content_mr || '',
        events: eventsFromAPI,
      });

      // Gallery content - dynamically detect all gallery images
      const galleryImageNumbers = new Set<number>();
      data.forEach((item: any) => {
        const match = item.section_key.match(/^gallery_(\d+)_/);
        if (match) {
          galleryImageNumbers.add(parseInt(match[1], 10));
        }
      });

      const sortedGalleryNumbers = Array.from(galleryImageNumbers).sort((a, b) => a - b);
      const galleryImagesFromAPI = sortedGalleryNumbers.map((num) => {
        const imageItem = findContent(`gallery_${num}_image`);
        let imageUrl: string | undefined;
        if (imageItem?.image?.file_url) {
          imageUrl = constructImageUrl(imageItem.image.file_url);
        }
        return {
          key: `gallery_${num}`,
          image_id: imageItem?.image_id,
          existingImageUrl: imageUrl,
        };
      });

      const galleryTitleData = findContent('gallery_title');
      const gallerySubtitleData = findContent('gallery_subtitle');
      setGalleryContent({
        title_en: galleryTitleData?.content_en || '',
        title_hi: galleryTitleData?.content_hi || '',
        title_mr: galleryTitleData?.content_mr || '',
        subtitle_en: gallerySubtitleData?.content_en || '',
        subtitle_hi: gallerySubtitleData?.content_hi || '',
        subtitle_mr: gallerySubtitleData?.content_mr || '',
        images: galleryImagesFromAPI,
      });

      // Banner content
      const bannerQuoteData = findContent('banner_quote');
      const bannerImageData = findContent('banner_image');
      let bannerImageUrl: string | undefined;
      if (bannerImageData?.image?.file_url) {
        bannerImageUrl = constructImageUrl(bannerImageData.image.file_url);
      }

      setBannerContent({
        quote_en: bannerQuoteData?.content_en || '',
        quote_hi: bannerQuoteData?.content_hi || '',
        quote_mr: bannerQuoteData?.content_mr || '',
        image_id: bannerImageData?.image_id,
        existingImageUrl: bannerImageUrl,
      });
    } catch (error) {
      toast.error('Failed to load content');
    } finally {
      setLoading(false);
    }
  };

  const saveHeroSection = async () => {
    setSaving(true);
    try {
      await Promise.all([
        client.post('/admin/page-content', {
          page_key: 'events_gallery',
          section_key: 'hero_title',
          content_en: heroContent.title_en,
          content_hi: heroContent.title_hi,
          content_mr: heroContent.title_mr,
        }),
        client.post('/admin/page-content', {
          page_key: 'events_gallery',
          section_key: 'hero_subtitle',
          content_en: heroContent.subtitle_en,
          content_hi: heroContent.subtitle_hi,
          content_mr: heroContent.subtitle_mr,
        }),
        heroContent.image_id
          ? client.post('/admin/page-content', {
              page_key: 'events_gallery',
              section_key: 'hero_image',
              image_id: heroContent.image_id,
            })
          : Promise.resolve(),
      ]);
      toast.success('Hero section saved successfully');
    } catch (error) {
      toast.error('Failed to save content');
    } finally {
      setSaving(false);
    }
  };

  const addEvent = () => {
    const newEventNum = (eventsContent.events.length || 0) + 1;
    const newEvent: TempleEvent = {
      key: `event_${newEventNum}`,
      name_en: '', name_hi: '', name_mr: '',
      date: '',
      description_en: '', description_hi: '', description_mr: '',
      tag_en: '', tag_hi: '', tag_mr: '',
      image_id: undefined,
      existingImageUrl: undefined,
    };
    setEventsContent({ ...eventsContent, events: [...eventsContent.events, newEvent] });
  };

  const removeEvent = (index: number) => {
    setEventsContent({ ...eventsContent, events: eventsContent.events.filter((_, i) => i !== index) });
  };

  const addGalleryImage = () => {
    const newImageNum = (galleryContent.images.length || 0) + 1;
    const newImage: GalleryImage = {
      key: `gallery_${newImageNum}`,
      image_id: undefined,
      existingImageUrl: undefined,
    };
    setGalleryContent({ ...galleryContent, images: [...galleryContent.images, newImage] });
  };

  const removeGalleryImage = (index: number) => {
    setGalleryContent({ ...galleryContent, images: galleryContent.images.filter((_, i) => i !== index) });
  };

  const saveEventsSection = async () => {
    setSaving(true);
    try {
      const updates: any[] = [
        eventsContent.title_en && { endpoint: 'events_title', data: { language: 'en', content: eventsContent.title_en } },
        eventsContent.title_hi && { endpoint: 'events_title', data: { language: 'hi', content: eventsContent.title_hi } },
        eventsContent.title_mr && { endpoint: 'events_title', data: { language: 'mr', content: eventsContent.title_mr } },
      ];

      for (let i = 0; i < eventsContent.events.length; i++) {
        const event = eventsContent.events[i];
        const eventNum = i + 1;
        if (event.name_en) updates.push({ endpoint: `event_${eventNum}_name`, data: { language: 'en', content: event.name_en } });
        if (event.name_hi) updates.push({ endpoint: `event_${eventNum}_name`, data: { language: 'hi', content: event.name_hi } });
        if (event.name_mr) updates.push({ endpoint: `event_${eventNum}_name`, data: { language: 'mr', content: event.name_mr } });
        if (event.date) updates.push({ endpoint: `event_${eventNum}_date`, data: { language: 'en', content: event.date } });
        if (event.description_en) updates.push({ endpoint: `event_${eventNum}_description`, data: { language: 'en', content: event.description_en } });
        if (event.description_hi) updates.push({ endpoint: `event_${eventNum}_description`, data: { language: 'hi', content: event.description_hi } });
        if (event.description_mr) updates.push({ endpoint: `event_${eventNum}_description`, data: { language: 'mr', content: event.description_mr } });
        if (event.tag_en) updates.push({ endpoint: `event_${eventNum}_tag`, data: { language: 'en', content: event.tag_en } });
        if (event.tag_hi) updates.push({ endpoint: `event_${eventNum}_tag`, data: { language: 'hi', content: event.tag_hi } });
        if (event.tag_mr) updates.push({ endpoint: `event_${eventNum}_tag`, data: { language: 'mr', content: event.tag_mr } });
        if (event.image_id) updates.push({ endpoint: `event_${eventNum}_image`, data: { image_id: event.image_id } });
      }

      await Promise.all(updates.filter(Boolean).map((update) => client.put(`/admin/page-content/events_gallery/${update.endpoint}`, update.data)));
      toast.success('Temple Events section saved successfully');
    } catch (error) {
      toast.error('Failed to save Temple Events section');
    } finally {
      setSaving(false);
    }
  };

  const saveGallerySection = async () => {
    setSaving(true);
    try {
      const updates: Array<{ endpoint: string; data: Record<string, string | number> }> = [];
      if (galleryContent.title_en) updates.push({ endpoint: 'gallery_title', data: { language: 'en', content: galleryContent.title_en } });
      if (galleryContent.title_hi) updates.push({ endpoint: 'gallery_title', data: { language: 'hi', content: galleryContent.title_hi } });
      if (galleryContent.title_mr) updates.push({ endpoint: 'gallery_title', data: { language: 'mr', content: galleryContent.title_mr } });
      if (galleryContent.subtitle_en) updates.push({ endpoint: 'gallery_subtitle', data: { language: 'en', content: galleryContent.subtitle_en } });
      if (galleryContent.subtitle_hi) updates.push({ endpoint: 'gallery_subtitle', data: { language: 'hi', content: galleryContent.subtitle_hi } });
      if (galleryContent.subtitle_mr) updates.push({ endpoint: 'gallery_subtitle', data: { language: 'mr', content: galleryContent.subtitle_mr } });

      // Save gallery images - extract number from key (e.g., gallery_1 -> 1)
      for (let i = 0; i < galleryContent.images.length; i++) {
        const image = galleryContent.images[i];
        const imageNumMatch = image.key.match(/gallery_(\d+)/);
        const imageNum = imageNumMatch ? imageNumMatch[1] : i + 1;
        if (image.image_id) updates.push({ endpoint: `gallery_${imageNum}_image`, data: { image_id: image.image_id } });
      }

      await Promise.all(updates.map((update) => client.put(`/admin/page-content/events_gallery/${update.endpoint}`, update.data)));
      toast.success('Gallery section saved successfully');
    } catch (error) {
      toast.error('Failed to save Gallery section');
    } finally {
      setSaving(false);
    }
  };

  const saveBannerSection = async () => {
    setSaving(true);
    try {
      await Promise.all([
        client.post('/admin/page-content', {
          page_key: 'events_gallery',
          section_key: 'banner_quote',
          content_en: bannerContent.quote_en,
          content_hi: bannerContent.quote_hi,
          content_mr: bannerContent.quote_mr,
        }),
        bannerContent.image_id
          ? client.post('/admin/page-content', {
              page_key: 'events_gallery',
              section_key: 'banner_image',
              image_id: bannerContent.image_id,
            })
          : Promise.resolve(),
      ]);
      toast.success('Banner section saved successfully');
    } catch (error) {
      toast.error('Failed to save Banner section');
    } finally {
      setSaving(false);
    }
  };

  const renderLanguageTabs = (
    label: string,
    en: string,
    hi: string,
    mr: string,
    onChange: (lang: string, value: string) => void,
    isTextarea = false,
  ) => (
    <div className="space-y-4">
      <h3 className="font-semibold text-foreground">{label}</h3>
      <Tabs defaultValue="en" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="en">English</TabsTrigger>
          <TabsTrigger value="hi">हिंदी</TabsTrigger>
          <TabsTrigger value="mr">मराठी</TabsTrigger>
        </TabsList>

        <TabsContent value="en" className="space-y-2 mt-4">
          {isTextarea ? (
            <Textarea
              value={en}
              onChange={(e) => onChange('en', e.target.value)}
              placeholder={`Enter ${label} in English`}
              disabled={loading}
              rows={3}
            />
          ) : (
            <Input
              value={en}
              onChange={(e) => onChange('en', e.target.value)}
              placeholder={`Enter ${label} in English`}
              disabled={loading}
            />
          )}
        </TabsContent>

        <TabsContent value="hi" className="space-y-2 mt-4">
          {isTextarea ? (
            <Textarea
              value={hi}
              onChange={(e) => onChange('hi', e.target.value)}
              placeholder={`हिंदी में ${label} दर्ज करें`}
              disabled={loading}
              rows={3}
            />
          ) : (
            <Input
              value={hi}
              onChange={(e) => onChange('hi', e.target.value)}
              placeholder={`हिंदी में ${label} दर्ज करें`}
              disabled={loading}
            />
          )}
        </TabsContent>

        <TabsContent value="mr" className="space-y-2 mt-4">
          {isTextarea ? (
            <Textarea
              value={mr}
              onChange={(e) => onChange('mr', e.target.value)}
              placeholder={`मराठीत ${label} प्रविष्ट करा`}
              disabled={loading}
              rows={3}
            />
          ) : (
            <Input
              value={mr}
              onChange={(e) => onChange('mr', e.target.value)}
              placeholder={`मराठीत ${label} प्रविष्ट करा`}
              disabled={loading}
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );

  return (
    <div className="max-w-6xl space-y-6">
      <div>
        <h1 className="font-heading text-3xl font-bold text-foreground">Events & Gallery Page Editor</h1>
        <p className="text-muted-foreground mt-1">Manage all Events & Gallery page sections in multiple languages</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sections.map((section) => (
          <Card key={section.key} className={`cursor-pointer transition-all ${activeSection === section.key ? 'ring-2 ring-primary' : ''}`} onClick={() => setActiveSection(section.key)}>
            <CardContent className="pt-6">
              <p className="font-semibold text-sm text-foreground">{section.label}</p>
              <p className="text-xs text-muted-foreground mt-1">{section.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Hero Section */}
      {activeSection === 'hero' && (
        <Card>
          <CardHeader>
            <CardTitle>Hero Section</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="font-semibold mb-4">Hero Image</h3>
              <ImageUpload
                onUpload={(mediaId) => setHeroContent({ ...heroContent, image_id: mediaId })}
                existingImageUrl={heroContent.existingImageUrl}
                section="events-gallery-hero"
              />
            </div>
            {renderLanguageTabs(
              'Title',
              heroContent.title_en,
              heroContent.title_hi,
              heroContent.title_mr,
              (lang, value) => setHeroContent({ ...heroContent, [`title_${lang}`]: value }),
            )}
            {renderLanguageTabs(
              'Subtitle',
              heroContent.subtitle_en,
              heroContent.subtitle_hi,
              heroContent.subtitle_mr,
              (lang, value) => setHeroContent({ ...heroContent, [`subtitle_${lang}`]: value }),
              true,
            )}
            <Button onClick={saveHeroSection} disabled={saving} className="w-full">
              {saving ? 'Saving...' : 'Save Hero Section'}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Temple Events Section */}
      {activeSection === 'events' && (
        <Card>
          <CardHeader>
            <CardTitle>Temple Events Section</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {renderLanguageTabs(
              'Section Title',
              eventsContent.title_en,
              eventsContent.title_hi,
              eventsContent.title_mr,
              (lang, value) => setEventsContent({ ...eventsContent, [`title_${lang}`]: value }),
            )}

            <div className="space-y-6 mt-8">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold text-lg text-foreground">Events</h3>
                <Button onClick={addEvent} variant="outline" size="sm" className="gap-2">
                  <Plus size={16} /> Add Event
                </Button>
              </div>

              {eventsContent.events.map((event, index) => (
                <div key={event.key} className="border rounded-lg p-6 bg-muted/30 space-y-4">
                  <div className="flex justify-between items-start">
                    <h4 className="font-semibold text-foreground">Event {index + 1}</h4>
                    <Button onClick={() => removeEvent(index)} variant="destructive" size="sm">
                      <Trash2 size={16} />
                    </Button>
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-semibold text-foreground">Event Image</h3>
                    <ImageUpload
                      onUpload={(mediaId: number) => {
                        const newEvents = eventsContent.events.map((e, i) => i === index ? { ...e, image_id: mediaId } : e);
                        setEventsContent({ ...eventsContent, events: newEvents });
                      }}
                      existingImageUrl={event.existingImageUrl}
                      section={`event-${index + 1}`}
                    />
                  </div>

                  {renderLanguageTabs(
                    `Event ${index + 1} Name`,
                    event.name_en,
                    event.name_hi,
                    event.name_mr,
                    (lang, val) => {
                      const newEvents = eventsContent.events.map((e, i) => i === index ? { ...e, [`name_${lang}`]: val } : e);
                      setEventsContent({ ...eventsContent, events: newEvents });
                    },
                  )}

                  <div className="space-y-2">
                    <h3 className="font-semibold text-foreground">Date</h3>
                    <Input
                      type="date"
                      value={event.date}
                      onChange={(e) => {
                        const newEvents = eventsContent.events.map((ev, i) => i === index ? { ...ev, date: e.target.value } : ev);
                        setEventsContent({ ...eventsContent, events: newEvents });
                      }}
                      disabled={loading}
                    />
                  </div>

                  {renderLanguageTabs(
                    `Event ${index + 1} Description`,
                    event.description_en,
                    event.description_hi,
                    event.description_mr,
                    (lang, val) => {
                      const newEvents = eventsContent.events.map((e, i) => i === index ? { ...e, [`description_${lang}`]: val } : e);
                      setEventsContent({ ...eventsContent, events: newEvents });
                    },
                    true,
                  )}

                  {renderLanguageTabs(
                    `Event ${index + 1} Tag`,
                    event.tag_en,
                    event.tag_hi,
                    event.tag_mr,
                    (lang, val) => {
                      const newEvents = eventsContent.events.map((e, i) => i === index ? { ...e, [`tag_${lang}`]: val } : e);
                      setEventsContent({ ...eventsContent, events: newEvents });
                    },
                  )}
                </div>
              ))}

              {eventsContent.events.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  No events added yet. Click "Add Event" to create one.
                </div>
              )}
            </div>

            <Button onClick={saveEventsSection} disabled={saving} className="w-full mt-6">
              {saving ? 'Saving...' : 'Save Temple Events Section'}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Gallery Section */}
      {activeSection === 'gallery' && (
        <Card>
          <CardHeader>
            <CardTitle>Gallery Images Section</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {renderLanguageTabs(
              'Gallery Title',
              galleryContent.title_en,
              galleryContent.title_hi,
              galleryContent.title_mr,
              (lang, value) => setGalleryContent({ ...galleryContent, [`title_${lang}`]: value }),
            )}

            {renderLanguageTabs(
              'Gallery Subtitle',
              galleryContent.subtitle_en,
              galleryContent.subtitle_hi,
              galleryContent.subtitle_mr,
              (lang, value) => setGalleryContent({ ...galleryContent, [`subtitle_${lang}`]: value }),
              true,
            )}

            <div className="space-y-6 mt-8">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold text-lg text-foreground">Gallery Images</h3>
                <Button onClick={addGalleryImage} variant="outline" size="sm" className="gap-2">
                  <Plus size={16} /> Add Image
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {galleryContent.images.map((image, index) => (
                  <div key={image.key} className="border rounded-lg p-4 bg-muted/30 space-y-3">
                    <div className="flex justify-between items-center">
                      <h4 className="font-semibold text-foreground">Image {index + 1}</h4>
                      <Button onClick={() => removeGalleryImage(index)} variant="destructive" size="sm">
                        <Trash2 size={16} />
                      </Button>
                    </div>
                    <div className="space-y-2">
                      <h3 className="font-semibold text-sm text-foreground">Upload Image</h3>
                      <ImageUpload
                        onUpload={(mediaId: number) => {
                          const newImages = galleryContent.images.map((img, i) =>
                            i === index ? { ...img, image_id: mediaId } : img
                          );
                          setGalleryContent({ ...galleryContent, images: newImages });
                        }}
                        existingImageUrl={image.existingImageUrl}
                        section={`gallery-${index + 1}`}
                      />
                    </div>
                  </div>
                ))}
              </div>
              {galleryContent.images.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  No gallery images added yet. Click "Add Image" to create one.
                </div>
              )}
            </div>

            <Button onClick={saveGallerySection} disabled={saving} className="w-full mt-6">
              {saving ? 'Saving...' : 'Save Gallery Section'}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Banner Section */}
      {activeSection === 'banner' && (
        <Card>
          <CardHeader>
            <CardTitle>Banner Section</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="font-semibold mb-4">Banner Image</h3>
              <ImageUpload
                onUpload={(mediaId) => setBannerContent({ ...bannerContent, image_id: mediaId })}
                existingImageUrl={bannerContent.existingImageUrl}
                section="events-gallery-banner"
              />
            </div>

            {renderLanguageTabs(
              'Banner Quote',
              bannerContent.quote_en,
              bannerContent.quote_hi,
              bannerContent.quote_mr,
              (lang, value) => setBannerContent({ ...bannerContent, [`quote_${lang}`]: value }),
              true,
            )}

            <Button onClick={saveBannerSection} disabled={saving} className="w-full">
              {saving ? 'Saving...' : 'Save Banner Section'}
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default EventsGalleryPageEditor;
