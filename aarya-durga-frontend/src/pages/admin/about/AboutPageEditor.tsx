import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import client from '@/api/client';
import { ImageUpload } from '@/components/admin/ImageUpload';
import { useLoader } from '@/contexts/LoaderContext';
import { constructImageUrl } from '@/api/imageUrl';
import { useImagesLoaded } from '@/hooks/useImagesLoaded';

interface HeroContent {
  title_en: string;
  title_hi: string;
  title_mr: string;
  subtitle_en: string;
  subtitle_hi: string;
  subtitle_mr: string;
  image_id?: string;
  existingImageUrl?: string;
}

interface MissionContent {
  title_en: string;
  title_hi: string;
  title_mr: string;
  description_en: string;
  description_hi: string;
  description_mr: string;
}

interface CoreValue {
  key: string;
  title_en: string;
  title_hi: string;
  title_mr: string;
  description_en: string;
  description_hi: string;
  description_mr: string;
}

interface CoreValuesContent {
  title_en: string;
  title_hi: string;
  title_mr: string;
  values: CoreValue[];
}

interface CommitteeCard {
  key: string;
  title_en: string;
  title_hi: string;
  title_mr: string;
  subtitle_en: string;
  subtitle_hi: string;
  subtitle_mr: string;
}

interface CommitteeContent {
  title_en: string;
  title_hi: string;
  title_mr: string;
  description_en: string;
  description_hi: string;
  description_mr: string;
  cards: CommitteeCard[];
}

interface BannerContent {
  title_en: string;
  title_hi: string;
  title_mr: string;
  image_id?: string;
  existingImageUrl?: string;
}

const AboutPageEditor = () => {
  const { setLoading: setGlobalLoading } = useLoader();
  const [activeSection, setActiveSection] = useState<'hero' | 'mission' | 'values' | 'banner' | 'committee'>('hero');

  const [heroContent, setHeroContent] = useState<HeroContent>({
    title_en: '', title_hi: '', title_mr: '',
    subtitle_en: '', subtitle_hi: '', subtitle_mr: '',
  });

  const [missionContent, setMissionContent] = useState<MissionContent>({
    title_en: '', title_hi: '', title_mr: '',
    description_en: '', description_hi: '', description_mr: '',
  });

  const [valuesContent, setValuesContent] = useState<CoreValuesContent>({
    title_en: '', title_hi: '', title_mr: '',
    values: [
      { key: 'devotion', title_en: '', title_hi: '', title_mr: '', description_en: '', description_hi: '', description_mr: '' },
      { key: 'community', title_en: '', title_hi: '', title_mr: '', description_en: '', description_hi: '', description_mr: '' },
      { key: 'tradition', title_en: '', title_hi: '', title_mr: '', description_en: '', description_hi: '', description_mr: '' },
      { key: 'service', title_en: '', title_hi: '', title_mr: '', description_en: '', description_hi: '', description_mr: '' },
    ],
  });

  const [committeeContent, setCommitteeContent] = useState<CommitteeContent>({
    title_en: '', title_hi: '', title_mr: '',
    description_en: '', description_hi: '', description_mr: '',
    cards: [
      { key: 'member1', title_en: '', title_hi: '', title_mr: '', subtitle_en: '', subtitle_hi: '', subtitle_mr: '' },
      { key: 'member2', title_en: '', title_hi: '', title_mr: '', subtitle_en: '', subtitle_hi: '', subtitle_mr: '' },
      { key: 'member3', title_en: '', title_hi: '', title_mr: '', subtitle_en: '', subtitle_hi: '', subtitle_mr: '' },
    ],
  });

  const [bannerContent, setBannerContent] = useState<BannerContent>({
    title_en: '', title_hi: '', title_mr: '',
  });

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const imagesLoaded = useImagesLoaded([heroContent.existingImageUrl, bannerContent.existingImageUrl]);

  useEffect(() => {
    if (!loading && imagesLoaded) {
      setGlobalLoading(false);
    }
  }, [loading, imagesLoaded, setGlobalLoading]);

  const sections = [
    { key: 'hero', label: 'Hero Section', description: 'Title, subtitle, background image' },
    { key: 'mission', label: 'Mission & Vision', description: 'Mission title and description' },
    { key: 'values', label: 'Core Values', description: '4 core value cards' },
    { key: 'banner', label: 'Banner Section', description: 'Title, background image' },
    { key: 'committee', label: 'Committee', description: 'Committee title, description & members' },
  ] as const;

  useEffect(() => {
    loadAboutContent();
  }, []);

  const loadAboutContent = async () => {
    setLoading(true);
    setGlobalLoading(true);
    try {
      const response = await client.get(`/public/page-content/about`);
      const data = response.data as Array<{ section_key: string; content_en?: string; content_hi?: string; content_mr?: string; image_id?: number; image?: { file_url: string } }>;

      const contentKey = (lang: 'en' | 'hi' | 'mr') => `content_${lang}`;

      // Hero
      const heroTitleData = data.find((item) => item.section_key === 'hero_title');
      const heroSubtitleData = data.find((item) => item.section_key === 'hero_subtitle');
      const heroImageData = data.find((item) => item.section_key === 'hero_image');
      let heroImageUrl: string | undefined;
      if (heroImageData?.image?.file_url) {
        heroImageUrl = constructImageUrl(heroImageData.image.file_url);
      }
      setHeroContent({
        title_en: heroTitleData?.content_en || '',
        title_hi: heroTitleData?.content_hi || '',
        title_mr: heroTitleData?.content_mr || '',
        subtitle_en: heroSubtitleData?.content_en || '',
        subtitle_hi: heroSubtitleData?.content_hi || '',
        subtitle_mr: heroSubtitleData?.content_mr || '',
        image_id: heroImageData?.image_id ? String(heroImageData.image_id) : undefined,
        existingImageUrl: heroImageUrl,
      });

      // Mission
      const missionTitleData = data.find((item) => item.section_key === 'mission_title');
      const missionDescData = data.find((item) => item.section_key === 'mission_description');
      setMissionContent({
        title_en: missionTitleData?.content_en || '',
        title_hi: missionTitleData?.content_hi || '',
        title_mr: missionTitleData?.content_mr || '',
        description_en: missionDescData?.content_en || '',
        description_hi: missionDescData?.content_hi || '',
        description_mr: missionDescData?.content_mr || '',
      });

      // Core Values
      const valuesTitleData = data.find((item) => item.section_key === 'values_title');
      const newValues = valuesContent.values.map((value) => {
        const titleData = data.find((item) => item.section_key === `${value.key}_title`);
        const descData = data.find((item) => item.section_key === `${value.key}_description`);
        return {
          ...value,
          title_en: titleData?.content_en || '',
          title_hi: titleData?.content_hi || '',
          title_mr: titleData?.content_mr || '',
          description_en: descData?.content_en || '',
          description_hi: descData?.content_hi || '',
          description_mr: descData?.content_mr || '',
        };
      });
      setValuesContent({
        title_en: valuesTitleData?.content_en || '',
        title_hi: valuesTitleData?.content_hi || '',
        title_mr: valuesTitleData?.content_mr || '',
        values: newValues,
      });

      // Banner
      const bannerTitleData = data.find((item) => item.section_key === 'banner_title');
      const bannerImageData = data.find((item) => item.section_key === 'banner_image');
      let bannerImageUrl: string | undefined;
      if (bannerImageData?.image?.file_url) {
        bannerImageUrl = constructImageUrl(bannerImageData.image.file_url);
      }
      setBannerContent({
        title_en: bannerTitleData?.content_en || '',
        title_hi: bannerTitleData?.content_hi || '',
        title_mr: bannerTitleData?.content_mr || '',
        image_id: bannerImageData?.image_id ? String(bannerImageData.image_id) : undefined,
        existingImageUrl: bannerImageUrl,
      });

      // Committee
      const committeeTitleData = data.find((item) => item.section_key === 'committee_title');
      const committeeDescData = data.find((item) => item.section_key === 'committee_description');
      const newCards = committeeContent.cards.map((card) => {
        const titleData = data.find((item) => item.section_key === `${card.key}_title`);
        const subtitleData = data.find((item) => item.section_key === `${card.key}_subtitle`);
        return {
          ...card,
          title_en: titleData?.content_en || '',
          title_hi: titleData?.content_hi || '',
          title_mr: titleData?.content_mr || '',
          subtitle_en: subtitleData?.content_en || '',
          subtitle_hi: subtitleData?.content_hi || '',
          subtitle_mr: subtitleData?.content_mr || '',
        };
      });
      setCommitteeContent({
        title_en: committeeTitleData?.content_en || '',
        title_hi: committeeTitleData?.content_hi || '',
        title_mr: committeeTitleData?.content_mr || '',
        description_en: committeeDescData?.content_en || '',
        description_hi: committeeDescData?.content_hi || '',
        description_mr: committeeDescData?.content_mr || '',
        cards: newCards,
      });
    } catch (error) {
      toast.error('Failed to load about page content');
    } finally {
      setLoading(false);
    }
  };

  const saveSectionContent = async (sectionName: string, updates: Array<{ endpoint: string; data: any }>) => {
    setSaving(true);
    try {
      await Promise.all(updates.map((update) => client.put(`/admin/page-content/about/${update.endpoint}`, update.data)));
      toast.success(`${sectionName} saved successfully`);
    } catch (error) {
      toast.error(`Failed to save ${sectionName}`);
    } finally {
      setSaving(false);
    }
  };

  const renderLanguageTabs = (label: string, enValue: string, hiValue: string, mrValue: string, onChange: (lang: 'en' | 'hi' | 'mr', value: string) => void, isTextarea = false) => (
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
            <Textarea value={enValue} onChange={(e) => onChange('en', e.target.value)} placeholder={`Enter ${label} in English`} disabled={loading} rows={3} />
          ) : (
            <Input value={enValue} onChange={(e) => onChange('en', e.target.value)} placeholder={`Enter ${label} in English`} disabled={loading} />
          )}
        </TabsContent>

        <TabsContent value="hi" className="space-y-2 mt-4">
          {isTextarea ? (
            <Textarea value={hiValue} onChange={(e) => onChange('hi', e.target.value)} placeholder={`हिंदी में ${label} दर्ज करें`} disabled={loading} rows={3} />
          ) : (
            <Input value={hiValue} onChange={(e) => onChange('hi', e.target.value)} placeholder={`हिंदी में ${label} दर्ज करें`} disabled={loading} />
          )}
        </TabsContent>

        <TabsContent value="mr" className="space-y-2 mt-4">
          {isTextarea ? (
            <Textarea value={mrValue} onChange={(e) => onChange('mr', e.target.value)} placeholder={`मराठीत ${label} प्रविष्ट करा`} disabled={loading} rows={3} />
          ) : (
            <Input value={mrValue} onChange={(e) => onChange('mr', e.target.value)} placeholder={`मराठीत ${label} प्रविष्ट करा`} disabled={loading} />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );

  return (
    <div className="max-w-6xl space-y-6">
      <div>
        <h1 className="font-heading text-3xl font-bold text-foreground">About Us Page Editor</h1>
        <p className="text-muted-foreground mt-1">Manage all About Us page sections in multiple languages</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
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
            {renderLanguageTabs('Hero Title', heroContent.title_en, heroContent.title_hi, heroContent.title_mr, (lang, val) => setHeroContent({ ...heroContent, [`title_${lang}`]: val }))}
            {renderLanguageTabs('Hero Subtitle', heroContent.subtitle_en, heroContent.subtitle_hi, heroContent.subtitle_mr, (lang, val) => setHeroContent({ ...heroContent, [`subtitle_${lang}`]: val }), true)}

            <div className="space-y-4">
              <h3 className="font-semibold text-foreground">Hero Background Image</h3>
              <ImageUpload onUpload={(mediaId: number) => setHeroContent({ ...heroContent, image_id: String(mediaId) })} existingImageUrl={heroContent.existingImageUrl} section="about-hero" />
            </div>

            <Button onClick={() => saveSectionContent('Hero Section', [
              heroContent.title_en && { endpoint: 'hero_title', data: { language: 'en', content: heroContent.title_en } },
              heroContent.title_hi && { endpoint: 'hero_title', data: { language: 'hi', content: heroContent.title_hi } },
              heroContent.title_mr && { endpoint: 'hero_title', data: { language: 'mr', content: heroContent.title_mr } },
              heroContent.subtitle_en && { endpoint: 'hero_subtitle', data: { language: 'en', content: heroContent.subtitle_en } },
              heroContent.subtitle_hi && { endpoint: 'hero_subtitle', data: { language: 'hi', content: heroContent.subtitle_hi } },
              heroContent.subtitle_mr && { endpoint: 'hero_subtitle', data: { language: 'mr', content: heroContent.subtitle_mr } },
              heroContent.image_id && { endpoint: 'hero_image', data: { image_id: heroContent.image_id } },
            ].filter(Boolean) as any)} disabled={saving} className="w-full">
              {saving ? 'Saving...' : 'Save Hero Section'}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Mission Section */}
      {activeSection === 'mission' && (
        <Card>
          <CardHeader>
            <CardTitle>Mission & Vision Section</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {renderLanguageTabs('Mission Title', missionContent.title_en, missionContent.title_hi, missionContent.title_mr, (lang, val) => setMissionContent({ ...missionContent, [`title_${lang}`]: val }))}
            {renderLanguageTabs('Mission Description', missionContent.description_en, missionContent.description_hi, missionContent.description_mr, (lang, val) => setMissionContent({ ...missionContent, [`description_${lang}`]: val }), true)}

            <Button onClick={() => saveSectionContent('Mission Section', [
              missionContent.title_en && { endpoint: 'mission_title', data: { language: 'en', content: missionContent.title_en } },
              missionContent.title_hi && { endpoint: 'mission_title', data: { language: 'hi', content: missionContent.title_hi } },
              missionContent.title_mr && { endpoint: 'mission_title', data: { language: 'mr', content: missionContent.title_mr } },
              missionContent.description_en && { endpoint: 'mission_description', data: { language: 'en', content: missionContent.description_en } },
              missionContent.description_hi && { endpoint: 'mission_description', data: { language: 'hi', content: missionContent.description_hi } },
              missionContent.description_mr && { endpoint: 'mission_description', data: { language: 'mr', content: missionContent.description_mr } },
            ].filter(Boolean) as any)} disabled={saving} className="w-full">
              {saving ? 'Saving...' : 'Save Mission Section'}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Core Values Section */}
      {activeSection === 'values' && (
        <Card>
          <CardHeader>
            <CardTitle>Core Values Section</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {renderLanguageTabs('Section Title', valuesContent.title_en, valuesContent.title_hi, valuesContent.title_mr, (lang, val) => setValuesContent({ ...valuesContent, [`title_${lang}`]: val }))}

            <div className="space-y-8 mt-6">
              {valuesContent.values.map((value, index) => (
                <div key={value.key} className="border rounded-lg p-4 bg-muted/30">
                  <h4 className="font-semibold text-foreground mb-4 capitalize">{value.key} Value</h4>
                  {renderLanguageTabs(`${value.key.charAt(0).toUpperCase() + value.key.slice(1)} Title`, value.title_en, value.title_hi, value.title_mr, (lang, val) => {
                    const newValues = valuesContent.values.map((v, i) => i === index ? { ...v, [`title_${lang}`]: val } : v);
                    setValuesContent({ ...valuesContent, values: newValues });
                  })}
                  {renderLanguageTabs(`${value.key.charAt(0).toUpperCase() + value.key.slice(1)} Description`, value.description_en, value.description_hi, value.description_mr, (lang, val) => {
                    const newValues = valuesContent.values.map((v, i) => i === index ? { ...v, [`description_${lang}`]: val } : v);
                    setValuesContent({ ...valuesContent, values: newValues });
                  }, true)}
                </div>
              ))}
            </div>

            <Button onClick={() => {
              const updates: any[] = [
                valuesContent.title_en && { endpoint: 'values_title', data: { language: 'en', content: valuesContent.title_en } },
                valuesContent.title_hi && { endpoint: 'values_title', data: { language: 'hi', content: valuesContent.title_hi } },
                valuesContent.title_mr && { endpoint: 'values_title', data: { language: 'mr', content: valuesContent.title_mr } },
              ];
              for (const value of valuesContent.values) {
                if (value.title_en) updates.push({ endpoint: `${value.key}_title`, data: { language: 'en', content: value.title_en } });
                if (value.title_hi) updates.push({ endpoint: `${value.key}_title`, data: { language: 'hi', content: value.title_hi } });
                if (value.title_mr) updates.push({ endpoint: `${value.key}_title`, data: { language: 'mr', content: value.title_mr } });
                if (value.description_en) updates.push({ endpoint: `${value.key}_description`, data: { language: 'en', content: value.description_en } });
                if (value.description_hi) updates.push({ endpoint: `${value.key}_description`, data: { language: 'hi', content: value.description_hi } });
                if (value.description_mr) updates.push({ endpoint: `${value.key}_description`, data: { language: 'mr', content: value.description_mr } });
              }
              saveSectionContent('Core Values Section', updates.filter(Boolean));
            }} disabled={saving} className="w-full">
              {saving ? 'Saving...' : 'Save Core Values Section'}
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
            {renderLanguageTabs('Banner Title', bannerContent.title_en, bannerContent.title_hi, bannerContent.title_mr, (lang, val) => setBannerContent({ ...bannerContent, [`title_${lang}`]: val }))}

            <div className="space-y-4">
              <h3 className="font-semibold text-foreground">Banner Background Image</h3>
              <ImageUpload onUpload={(mediaId: number) => setBannerContent({ ...bannerContent, image_id: String(mediaId) })} existingImageUrl={bannerContent.existingImageUrl} section="about-banner" />
            </div>

            <Button onClick={() => {
              const updates: Array<{ endpoint: string; data: Record<string, string> }> = [];
              if (bannerContent.title_en) updates.push({ endpoint: 'banner_title', data: { language: 'en', content: bannerContent.title_en } });
              if (bannerContent.title_hi) updates.push({ endpoint: 'banner_title', data: { language: 'hi', content: bannerContent.title_hi } });
              if (bannerContent.title_mr) updates.push({ endpoint: 'banner_title', data: { language: 'mr', content: bannerContent.title_mr } });
              if (bannerContent.image_id) updates.push({ endpoint: 'banner_image', data: { image_id: bannerContent.image_id } });
              saveSectionContent('Banner Section', updates);
            }} disabled={saving} className="w-full">
              {saving ? 'Saving...' : 'Save Banner Section'}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Committee Section */}
      {activeSection === 'committee' && (
        <Card>
          <CardHeader>
            <CardTitle>Committee Section</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {renderLanguageTabs('Committee Title', committeeContent.title_en, committeeContent.title_hi, committeeContent.title_mr, (lang, val) => setCommitteeContent({ ...committeeContent, [`title_${lang}`]: val }))}
            {renderLanguageTabs('Committee Description', committeeContent.description_en, committeeContent.description_hi, committeeContent.description_mr, (lang, val) => setCommitteeContent({ ...committeeContent, [`description_${lang}`]: val }), true)}

            <div className="space-y-8 mt-6">
              {committeeContent.cards.map((card, index) => (
                <div key={card.key} className="border rounded-lg p-4 bg-muted/30">
                  <h4 className="font-semibold text-foreground mb-4">Member {index + 1}</h4>
                  {renderLanguageTabs(`Member ${index + 1} Title`, card.title_en, card.title_hi, card.title_mr, (lang, val) => {
                    const newCards = committeeContent.cards.map((c, i) => i === index ? { ...c, [`title_${lang}`]: val } : c);
                    setCommitteeContent({ ...committeeContent, cards: newCards });
                  })}
                  {renderLanguageTabs(`Member ${index + 1} Subtitle`, card.subtitle_en, card.subtitle_hi, card.subtitle_mr, (lang, val) => {
                    const newCards = committeeContent.cards.map((c, i) => i === index ? { ...c, [`subtitle_${lang}`]: val } : c);
                    setCommitteeContent({ ...committeeContent, cards: newCards });
                  })}
                </div>
              ))}
            </div>

            <Button onClick={() => {
              const updates: any[] = [
                committeeContent.title_en && { endpoint: 'committee_title', data: { language: 'en', content: committeeContent.title_en } },
                committeeContent.title_hi && { endpoint: 'committee_title', data: { language: 'hi', content: committeeContent.title_hi } },
                committeeContent.title_mr && { endpoint: 'committee_title', data: { language: 'mr', content: committeeContent.title_mr } },
                committeeContent.description_en && { endpoint: 'committee_description', data: { language: 'en', content: committeeContent.description_en } },
                committeeContent.description_hi && { endpoint: 'committee_description', data: { language: 'hi', content: committeeContent.description_hi } },
                committeeContent.description_mr && { endpoint: 'committee_description', data: { language: 'mr', content: committeeContent.description_mr } },
              ];
              for (const card of committeeContent.cards) {
                if (card.title_en) updates.push({ endpoint: `${card.key}_title`, data: { language: 'en', content: card.title_en } });
                if (card.title_hi) updates.push({ endpoint: `${card.key}_title`, data: { language: 'hi', content: card.title_hi } });
                if (card.title_mr) updates.push({ endpoint: `${card.key}_title`, data: { language: 'mr', content: card.title_mr } });
                if (card.subtitle_en) updates.push({ endpoint: `${card.key}_subtitle`, data: { language: 'en', content: card.subtitle_en } });
                if (card.subtitle_hi) updates.push({ endpoint: `${card.key}_subtitle`, data: { language: 'hi', content: card.subtitle_hi } });
                if (card.subtitle_mr) updates.push({ endpoint: `${card.key}_subtitle`, data: { language: 'mr', content: card.subtitle_mr } });
              }
              saveSectionContent('Committee Section', updates.filter(Boolean));
            }} disabled={saving} className="w-full">
              {saving ? 'Saving...' : 'Save Committee Section'}
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AboutPageEditor;
