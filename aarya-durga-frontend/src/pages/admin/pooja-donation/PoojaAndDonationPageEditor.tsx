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

interface Service {
  key: string;
  name_en: string;
  name_hi: string;
  name_mr: string;
  time_en: string;
  time_hi: string;
  time_mr: string;
  description_en: string;
  description_hi: string;
  description_mr: string;
  amount_type: 'free' | 'paid';
  amount: string;
  icon: string;
}

interface ServicesContent {
  title_en: string;
  title_hi: string;
  title_mr: string;
  subtitle_en: string;
  subtitle_hi: string;
  subtitle_mr: string;
  services: Service[];
}

interface ScheduleItem {
  key: string;
  time: string;
  description_en: string;
  description_hi: string;
  description_mr: string;
}

interface BannerContent {
  quote_en: string;
  quote_hi: string;
  quote_mr: string;
  image_id?: number;
  existingImageUrl?: string;
}

interface DonationItem {
  key: string;
  name_en: string;
  name_hi: string;
  name_mr: string;
  description_en: string;
  description_hi: string;
  description_mr: string;
  suggested_amount: string;
  icon: string;
}

const PoojaAndDonationPageEditor = () => {
  const { setLoading: setGlobalLoading } = useLoader();
  const [activeSection, setActiveSection] = useState<'hero' | 'services' | 'schedule' | 'donation' | 'banner'>('hero');
  const [heroContent, setHeroContent] = useState<HeroContent>({
    title_en: '', title_hi: '', title_mr: '',
    subtitle_en: '', subtitle_hi: '', subtitle_mr: '',
  });
  const [servicesContent, setServicesContent] = useState<ServicesContent>({
    title_en: '', title_hi: '', title_mr: '',
    subtitle_en: '', subtitle_hi: '', subtitle_mr: '',
    services: [],
  });
  const [scheduleItems, setScheduleItems] = useState<ScheduleItem[]>([]);
  const [donationItems, setDonationItems] = useState<DonationItem[]>([]);
  const [bannerContent, setBannerContent] = useState<BannerContent>({
    quote_en: '', quote_hi: '', quote_mr: '',
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const imageUrls = [heroContent.existingImageUrl, bannerContent.existingImageUrl].filter(Boolean);
  const imagesLoaded = useImagesLoaded(imageUrls);

  useEffect(() => {
    if (!loading && imagesLoaded) {
      setGlobalLoading(false);
    }
  }, [loading, imagesLoaded, setGlobalLoading]);

  const sections = [
    { id: 'hero' as const, title: 'Hero Section', description: 'Title, subtitle, background image' },
    { id: 'services' as const, title: 'Services', description: 'Pooja services with details and pricing' },
    { id: 'schedule' as const, title: 'Schedule', description: 'Daily temple schedule and timings' },
    { id: 'donation' as const, title: 'Donations', description: 'Donation categories and amounts' },
    { id: 'banner' as const, title: 'Banner', description: 'Quote banner with background image' },
  ];

  useEffect(() => {
    fetchContent();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchContent = async () => {
    setLoading(true);
    setGlobalLoading(true);
    try {
      const response = await client.get('/public/page-content/pooja_donation');
      const data = response.data;

      const findContent = (key: string) => data.find((item: any) => item.section_key === key);
      const getImage = (key: string) => {
        const item = findContent(key);
        return item?.image?.file_url ? constructImageUrl(item.image.file_url) : undefined;
      };

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

      // Services - Dynamically detect all services from API response
      const serviceNumbers = new Set<number>();
      data.forEach((item: { section_key: string }) => {
        const match = item.section_key.match(/^service_(\d+)_/);
        if (match) {
          serviceNumbers.add(parseInt(match[1], 10));
        }
      });

      const sortedServiceNumbers = Array.from(serviceNumbers).sort((a, b) => a - b);
      const services = sortedServiceNumbers.map((num) => ({
        key: `service_${num}`,
        name_en: findContent(`service_${num}_name`)?.content_en || '',
        name_hi: findContent(`service_${num}_name`)?.content_hi || '',
        name_mr: findContent(`service_${num}_name`)?.content_mr || '',
        time_en: findContent(`service_${num}_time`)?.content_en || '',
        time_hi: findContent(`service_${num}_time`)?.content_hi || '',
        time_mr: findContent(`service_${num}_time`)?.content_mr || '',
        description_en: findContent(`service_${num}_description`)?.content_en || '',
        description_hi: findContent(`service_${num}_description`)?.content_hi || '',
        description_mr: findContent(`service_${num}_description`)?.content_mr || '',
        amount_type: (findContent(`service_${num}_amount_type`)?.content_en || 'free') as 'free' | 'paid',
        amount: findContent(`service_${num}_amount`)?.content_en || '',
        icon: findContent(`service_${num}_icon`)?.content_en || 'flame',
      }));

      setServicesContent({
        title_en: findContent('services_title')?.content_en || '',
        title_hi: findContent('services_title')?.content_hi || '',
        title_mr: findContent('services_title')?.content_mr || '',
        subtitle_en: findContent('services_subtitle')?.content_en || '',
        subtitle_hi: findContent('services_subtitle')?.content_hi || '',
        subtitle_mr: findContent('services_subtitle')?.content_mr || '',
        services,
      });

      // Schedule - Dynamically detect all schedule items
      const scheduleNumbers = new Set<number>();
      data.forEach((item: { section_key: string }) => {
        const match = item.section_key.match(/^schedule_(\d+)_/);
        if (match) {
          scheduleNumbers.add(parseInt(match[1], 10));
        }
      });

      const sortedScheduleNumbers = Array.from(scheduleNumbers).sort((a, b) => a - b);
      const schedule = sortedScheduleNumbers.map((num) => ({
        key: `schedule_${num}`,
        time: findContent(`schedule_${num}_time`)?.content_en || '',
        description_en: findContent(`schedule_${num}_description`)?.content_en || '',
        description_hi: findContent(`schedule_${num}_description`)?.content_hi || '',
        description_mr: findContent(`schedule_${num}_description`)?.content_mr || '',
      }));

      setScheduleItems(schedule);

      // Donations - Dynamically detect all donation items
      const donationNumbers = new Set<number>();
      data.forEach((item: { section_key: string }) => {
        const match = item.section_key.match(/^donation_(\d+)_/);
        if (match) {
          donationNumbers.add(parseInt(match[1], 10));
        }
      });

      const sortedDonationNumbers = Array.from(donationNumbers).sort((a, b) => a - b);
      const donations = sortedDonationNumbers.map((num) => ({
        key: `donation_${num}`,
        name_en: findContent(`donation_${num}_name`)?.content_en || '',
        name_hi: findContent(`donation_${num}_name`)?.content_hi || '',
        name_mr: findContent(`donation_${num}_name`)?.content_mr || '',
        description_en: findContent(`donation_${num}_description`)?.content_en || '',
        description_hi: findContent(`donation_${num}_description`)?.content_hi || '',
        description_mr: findContent(`donation_${num}_description`)?.content_mr || '',
        suggested_amount: findContent(`donation_${num}_suggested_amount`)?.content_en || '',
        icon: findContent(`donation_${num}_icon`)?.content_en || 'gift',
      }));

      setDonationItems(donations);

      // Banner - Fetch banner quote and image
      setBannerContent({
        quote_en: findContent('banner_quote')?.content_en || '',
        quote_hi: findContent('banner_quote')?.content_hi || '',
        quote_mr: findContent('banner_quote')?.content_mr || '',
        image_id: findContent('banner_image')?.image_id,
        existingImageUrl: getImage('banner_image'),
      });
    } catch (error) {
      toast.error('Failed to load content');
    } finally {
      setLoading(false);
    }
  };

  const addService = () => {
    const serviceNumbers = servicesContent.services.map((s) => {
      const match = s.key.match(/^service_(\d+)$/);
      return match ? parseInt(match[1], 10) : 0;
    });
    const nextNum = serviceNumbers.length > 0 ? Math.max(...serviceNumbers) + 1 : 1;
    const newService: Service = {
      key: `service_${nextNum}`,
      name_en: '', name_hi: '', name_mr: '',
      time_en: '', time_hi: '', time_mr: '',
      description_en: '', description_hi: '', description_mr: '',
      amount_type: 'free',
      amount: '',
      icon: 'flame',
    };
    setServicesContent({ ...servicesContent, services: [...servicesContent.services, newService] });
  };

  const deleteService = (idx: number) => {
    const newServices = servicesContent.services.filter((_, i) => i !== idx);
    setServicesContent({ ...servicesContent, services: newServices });
  };

  const addScheduleItem = () => {
    const scheduleNumbers = scheduleItems.map((s) => {
      const match = s.key.match(/^schedule_(\d+)$/);
      return match ? parseInt(match[1], 10) : 0;
    });
    const nextNum = scheduleNumbers.length > 0 ? Math.max(...scheduleNumbers) + 1 : 1;
    const newItem: ScheduleItem = {
      key: `schedule_${nextNum}`,
      time: '',
      description_en: '',
      description_hi: '',
      description_mr: '',
    };
    setScheduleItems([...scheduleItems, newItem]);
  };

  const deleteScheduleItem = (idx: number) => {
    const newSchedule = scheduleItems.filter((_, i) => i !== idx);
    setScheduleItems(newSchedule);
  };

  const addDonationItem = () => {
    const donationNumbers = donationItems.map((d) => {
      const match = d.key.match(/^donation_(\d+)$/);
      return match ? parseInt(match[1], 10) : 0;
    });
    const nextNum = donationNumbers.length > 0 ? Math.max(...donationNumbers) + 1 : 1;
    const newItem: DonationItem = {
      key: `donation_${nextNum}`,
      name_en: '',
      name_hi: '',
      name_mr: '',
      description_en: '',
      description_hi: '',
      description_mr: '',
      suggested_amount: '',
      icon: 'gift',
    };
    setDonationItems([...donationItems, newItem]);
  };

  const deleteDonationItem = (idx: number) => {
    const newDonations = donationItems.filter((_, i) => i !== idx);
    setDonationItems(newDonations);
  };

  const convertTo24Hour = (time12: string): string => {
    if (!time12) return '';
    const [time, period] = time12.split(' ');
    let [hours, minutes] = time.split(':').map(Number);

    if (period === 'PM' && hours !== 12) hours += 12;
    if (period === 'AM' && hours === 12) hours = 0;

    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
  };

  const convertTo12Hour = (time24: string): string => {
    if (!time24) return '';
    const [hoursStr, minutesStr] = time24.split(':');
    const hoursNum = parseInt(hoursStr, 10);
    const minutes = parseInt(minutesStr, 10);
    const period = hoursNum >= 12 ? 'PM' : 'AM';
    const displayHours = hoursNum % 12 || 12;

    return `${String(displayHours).padStart(2, '0')}:${String(minutes).padStart(2, '0')} ${period}`;
  };

  const validateScheduleTimes = (): boolean => {
    for (let i = 0; i < scheduleItems.length - 1; i++) {
      const current = convertTo24Hour(scheduleItems[i].time);
      const next = convertTo24Hour(scheduleItems[i + 1].time);
      if (current >= next) {
        toast.error(`Schedule times must be in increasing order. Check times at position ${i + 1} and ${i + 2}`);
        return false;
      }
    }
    return true;
  };

  const saveSection = async (sectionName: string) => {
    setSaving(true);
    try {
      if (sectionName === 'schedule') {
        if (!validateScheduleTimes()) {
          setSaving(false);
          return;
        }
        const promises = scheduleItems.map((item) =>
          client.post('/admin/page-content', {
            page_key: 'pooja_donation',
            section_key: `${item.key}_time`,
            content_en: item.time,
          }),
        );
        scheduleItems.forEach((item) => {
          promises.push(
            client.post('/admin/page-content', {
              page_key: 'pooja_donation',
              section_key: `${item.key}_description`,
              content_en: item.description_en,
              content_hi: item.description_hi,
              content_mr: item.description_mr,
            }),
          );
        });
        await Promise.all(promises);
      } else if (sectionName === 'hero') {
        await Promise.all([
          client.post('/admin/page-content', { page_key: 'pooja_donation', section_key: 'hero_title', content_en: heroContent.title_en, content_hi: heroContent.title_hi, content_mr: heroContent.title_mr }),
          client.post('/admin/page-content', { page_key: 'pooja_donation', section_key: 'hero_subtitle', content_en: heroContent.subtitle_en, content_hi: heroContent.subtitle_hi, content_mr: heroContent.subtitle_mr }),
          heroContent.image_id ? client.post('/admin/page-content', { page_key: 'pooja_donation', section_key: 'hero_image', image_id: heroContent.image_id }) : Promise.resolve(),
        ]);
      } else if (sectionName === 'services') {
        const promises = [
          client.post('/admin/page-content', { page_key: 'pooja_donation', section_key: 'services_title', content_en: servicesContent.title_en, content_hi: servicesContent.title_hi, content_mr: servicesContent.title_mr }),
          client.post('/admin/page-content', { page_key: 'pooja_donation', section_key: 'services_subtitle', content_en: servicesContent.subtitle_en, content_hi: servicesContent.subtitle_hi, content_mr: servicesContent.subtitle_mr }),
        ];

        servicesContent.services.forEach((service) => {
          promises.push(
            client.post('/admin/page-content', { page_key: 'pooja_donation', section_key: `${service.key}_name`, content_en: service.name_en, content_hi: service.name_hi, content_mr: service.name_mr }),
            client.post('/admin/page-content', { page_key: 'pooja_donation', section_key: `${service.key}_time`, content_en: service.time_en, content_hi: service.time_hi, content_mr: service.time_mr }),
            client.post('/admin/page-content', { page_key: 'pooja_donation', section_key: `${service.key}_description`, content_en: service.description_en, content_hi: service.description_hi, content_mr: service.description_mr }),
            client.post('/admin/page-content', { page_key: 'pooja_donation', section_key: `${service.key}_amount_type`, content_en: service.amount_type }),
            client.post('/admin/page-content', { page_key: 'pooja_donation', section_key: `${service.key}_icon`, content_en: service.icon }),
          );
          if (service.amount_type === 'paid' && service.amount) {
            promises.push(
              client.post('/admin/page-content', { page_key: 'pooja_donation', section_key: `${service.key}_amount`, content_en: service.amount })
            );
          }
        });

        await Promise.all(promises);
      } else if (sectionName === 'donation') {
        const promises = donationItems.map((item) =>
          Promise.all([
            client.post('/admin/page-content', { page_key: 'pooja_donation', section_key: `${item.key}_name`, content_en: item.name_en, content_hi: item.name_hi, content_mr: item.name_mr }),
            client.post('/admin/page-content', { page_key: 'pooja_donation', section_key: `${item.key}_description`, content_en: item.description_en, content_hi: item.description_hi, content_mr: item.description_mr }),
            client.post('/admin/page-content', { page_key: 'pooja_donation', section_key: `${item.key}_suggested_amount`, content_en: item.suggested_amount }),
            client.post('/admin/page-content', { page_key: 'pooja_donation', section_key: `${item.key}_icon`, content_en: item.icon }),
          ]),
        );
        await Promise.all(promises);
      } else if (sectionName === 'banner') {
        await Promise.all([
          client.post('/admin/page-content', { page_key: 'pooja_donation', section_key: 'banner_quote', content_en: bannerContent.quote_en, content_hi: bannerContent.quote_hi, content_mr: bannerContent.quote_mr }),
          bannerContent.image_id ? client.post('/admin/page-content', { page_key: 'pooja_donation', section_key: 'banner_image', image_id: bannerContent.image_id }) : Promise.resolve(),
        ]);
      }
      toast.success('Content saved successfully');
    } catch (error) {
      toast.error('Failed to save content');
    } finally {
      setSaving(false);
    }
  };

  const renderLanguageTabs = (label: string, en: string, hi: string, mr: string, onChange: (lang: string, value: string) => void, isTextarea = false) => (
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
            <Textarea value={en} onChange={(e) => onChange('en', e.target.value)} placeholder={`Enter ${label} in English`} disabled={loading} rows={3} />
          ) : (
            <Input value={en} onChange={(e) => onChange('en', e.target.value)} placeholder={`Enter ${label} in English`} disabled={loading} />
          )}
        </TabsContent>

        <TabsContent value="hi" className="space-y-2 mt-4">
          {isTextarea ? (
            <Textarea value={hi} onChange={(e) => onChange('hi', e.target.value)} placeholder={`हिंदी में ${label} दर्ज करें`} disabled={loading} rows={3} />
          ) : (
            <Input value={hi} onChange={(e) => onChange('hi', e.target.value)} placeholder={`हिंदी में ${label} दर्ज करें`} disabled={loading} />
          )}
        </TabsContent>

        <TabsContent value="mr" className="space-y-2 mt-4">
          {isTextarea ? (
            <Textarea value={mr} onChange={(e) => onChange('mr', e.target.value)} placeholder={`मराठीत ${label} प्रविष्ट करा`} disabled={loading} rows={3} />
          ) : (
            <Input value={mr} onChange={(e) => onChange('mr', e.target.value)} placeholder={`मराठीत ${label} प्रविष्ट करा`} disabled={loading} />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-3xl font-bold text-foreground">Pooja & Donation Page Editor</h1>
        <p className="text-muted-foreground mt-1">Manage all Pooja & Donation page sections in multiple languages</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {sections.map((section) => (
          <Card key={section.id} className={`cursor-pointer transition-all ${activeSection === section.id ? 'ring-2 ring-primary' : ''}`} onClick={() => setActiveSection(section.id)}>
            <CardContent className="pt-6">
              <p className="font-semibold text-sm text-foreground">{section.title}</p>
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
              <ImageUpload onUpload={(mediaId) => setHeroContent({ ...heroContent, image_id: mediaId })} existingImageUrl={heroContent.existingImageUrl} section="pooja-donation-hero" />
            </div>
            {renderLanguageTabs('Title', heroContent.title_en, heroContent.title_hi, heroContent.title_mr, (lang, value) => setHeroContent({ ...heroContent, [`title_${lang}`]: value }))}
            {renderLanguageTabs('Subtitle', heroContent.subtitle_en, heroContent.subtitle_hi, heroContent.subtitle_mr, (lang, value) => setHeroContent({ ...heroContent, [`subtitle_${lang}`]: value }), true)}
            <Button onClick={() => saveSection('hero')} disabled={saving} className="w-full">
              {saving ? 'Saving...' : 'Save Hero Section'}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Services Section */}
      {activeSection === 'services' && (
        <Card>
          <CardHeader>
            <CardTitle>Pooja Services</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {renderLanguageTabs('Section Title', servicesContent.title_en, servicesContent.title_hi, servicesContent.title_mr, (lang, value) => setServicesContent({ ...servicesContent, [`title_${lang}`]: value }))}
            {renderLanguageTabs('Section Subtitle', servicesContent.subtitle_en, servicesContent.subtitle_hi, servicesContent.subtitle_mr, (lang, value) => setServicesContent({ ...servicesContent, [`subtitle_${lang}`]: value }), true)}

            <div className="space-y-8 mt-8">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-lg text-foreground">Services</h3>
                <Button onClick={addService} variant="outline" size="sm" className="gap-2">
                  <Plus className="w-4 h-4" />
                  Add Service
                </Button>
              </div>
              {servicesContent.services.map((service, idx) => (
                <div key={service.key} className="border rounded-lg p-6 bg-muted/30 space-y-4">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-semibold text-foreground">Service {idx + 1}</h4>
                    <Button
                      onClick={() => deleteService(idx)}
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>

                  {renderLanguageTabs(`Name`, service.name_en, service.name_hi, service.name_mr, (lang, value) => {
                    const newServices = servicesContent.services.map((s, i) => i === idx ? { ...s, [`name_${lang}`]: value } : s);
                    setServicesContent({ ...servicesContent, services: newServices });
                  })}

                  {renderLanguageTabs(`Time/Schedule`, service.time_en, service.time_hi, service.time_mr, (lang, value) => {
                    const newServices = servicesContent.services.map((s, i) => i === idx ? { ...s, [`time_${lang}`]: value } : s);
                    setServicesContent({ ...servicesContent, services: newServices });
                  })}

                  {renderLanguageTabs(`Description`, service.description_en, service.description_hi, service.description_mr, (lang, value) => {
                    const newServices = servicesContent.services.map((s, i) => i === idx ? { ...s, [`description_${lang}`]: value } : s);
                    setServicesContent({ ...servicesContent, services: newServices });
                  }, true)}

                  <div>
                    <label className="text-sm font-semibold text-foreground block mb-2">Icon</label>
                    <select
                      value={service.icon}
                      onChange={(e) => {
                        const newServices = servicesContent.services.map((s, i) => i === idx ? { ...s, icon: e.target.value } : s);
                        setServicesContent({ ...servicesContent, services: newServices });
                      }}
                      className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
                    >
                      <option value="flame">Flame</option>
                      <option value="star">Star</option>
                      <option value="sparkles">Sparkles</option>
                      <option value="calendar">Calendar</option>
                      <option value="gift">Gift</option>
                      <option value="heart">Heart</option>
                    </select>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-semibold text-foreground block mb-2">Amount Type</label>
                      <select
                        value={service.amount_type}
                        onChange={(e) => {
                          const newServices = servicesContent.services.map((s, i) => i === idx ? { ...s, amount_type: e.target.value as 'free' | 'paid' } : s);
                          setServicesContent({ ...servicesContent, services: newServices });
                        }}
                        className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
                      >
                        <option value="free">Free</option>
                        <option value="paid">Paid</option>
                      </select>
                    </div>

                    {service.amount_type === 'paid' && (
                      <div>
                        <label className="text-sm font-semibold text-foreground block mb-2">Amount (₹)</label>
                        <Input
                          type="number"
                          value={service.amount}
                          onChange={(e) => {
                            const newServices = servicesContent.services.map((s, i) => i === idx ? { ...s, amount: e.target.value } : s);
                            setServicesContent({ ...servicesContent, services: newServices });
                          }}
                          placeholder="Enter amount"
                          disabled={loading}
                        />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <Button onClick={() => saveSection('services')} disabled={saving} className="w-full">
              {saving ? 'Saving...' : 'Save Services Section'}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Schedule Section */}
      {activeSection === 'schedule' && (
        <Card>
          <CardHeader>
            <CardTitle>Daily Schedule</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-8 mt-8">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-lg text-foreground">Schedule Items</h3>
                <Button onClick={addScheduleItem} variant="outline" size="sm" className="gap-2">
                  <Plus className="w-4 h-4" />
                  Add Time Slot
                </Button>
              </div>
              {scheduleItems.map((item, idx) => (
                <div key={item.key} className="border rounded-lg p-6 bg-muted/30 space-y-4">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-semibold text-foreground">Time Slot {idx + 1}</h4>
                    <Button
                      onClick={() => deleteScheduleItem(idx)}
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-foreground block mb-2">Time (12-hour format)</label>
                    <Input
                      type="time"
                      value={item.time ? convertTo24Hour(item.time) : ''}
                      onChange={(e) => {
                        const newSchedule = scheduleItems.map((s, i) =>
                          i === idx ? { ...s, time: convertTo12Hour(e.target.value) } : s,
                        );
                        setScheduleItems(newSchedule);
                      }}
                      placeholder="HH:MM"
                      disabled={loading}
                    />
                    <p className="text-xs text-muted-foreground mt-1">Displayed as: {item.time}</p>
                  </div>

                  {renderLanguageTabs(
                    'Description',
                    item.description_en,
                    item.description_hi,
                    item.description_mr,
                    (lang, value) => {
                      const newSchedule = scheduleItems.map((s, i) =>
                        i === idx ? { ...s, [`description_${lang}`]: value } : s,
                      );
                      setScheduleItems(newSchedule);
                    },
                    true,
                  )}
                </div>
              ))}
            </div>

            <Button onClick={() => saveSection('schedule')} disabled={saving} className="w-full">
              {saving ? 'Saving...' : 'Save Schedule'}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Donation Section */}
      {activeSection === 'donation' && (
        <Card>
          <CardHeader>
            <CardTitle>Donations</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-8 mt-8">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-lg text-foreground">Donation Items</h3>
                <Button onClick={addDonationItem} variant="outline" size="sm" className="gap-2">
                  <Plus className="w-4 h-4" />
                  Add Donation
                </Button>
              </div>
              {donationItems.map((item, idx) => (
                <div key={item.key} className="border rounded-lg p-6 bg-muted/30 space-y-4">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-semibold text-foreground">Donation {idx + 1}</h4>
                    <Button
                      onClick={() => deleteDonationItem(idx)}
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>

                  {renderLanguageTabs(`Name`, item.name_en, item.name_hi, item.name_mr, (lang, value) => {
                    const newDonations = donationItems.map((d, i) => i === idx ? { ...d, [`name_${lang}`]: value } : d);
                    setDonationItems(newDonations);
                  })}

                  {renderLanguageTabs(`Description`, item.description_en, item.description_hi, item.description_mr, (lang, value) => {
                    const newDonations = donationItems.map((d, i) => i === idx ? { ...d, [`description_${lang}`]: value } : d);
                    setDonationItems(newDonations);
                  }, true)}

                  <div>
                    <label className="text-sm font-semibold text-foreground block mb-2">Suggested Amount (₹)</label>
                    <Input
                      type="text"
                      value={item.suggested_amount}
                      onChange={(e) => {
                        const newDonations = donationItems.map((d, i) => i === idx ? { ...d, suggested_amount: e.target.value } : d);
                        setDonationItems(newDonations);
                      }}
                      placeholder="e.g., 1,100"
                      disabled={loading}
                    />
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-foreground block mb-2">Icon</label>
                    <select
                      value={item.icon}
                      onChange={(e) => {
                        const newDonations = donationItems.map((d, i) => i === idx ? { ...d, icon: e.target.value } : d);
                        setDonationItems(newDonations);
                      }}
                      className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
                    >
                      <option value="flame">Flame</option>
                      <option value="star">Star</option>
                      <option value="sparkles">Sparkles</option>
                      <option value="calendar">Calendar</option>
                      <option value="gift">Gift</option>
                      <option value="heart">Heart</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>

            <Button onClick={() => saveSection('donation')} disabled={saving} className="w-full">
              {saving ? 'Saving...' : 'Save Donations'}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Banner Section */}
      {activeSection === 'banner' && (
        <Card>
          <CardHeader>
            <CardTitle>Banner</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="font-semibold mb-4">Banner Image</h3>
              <ImageUpload onUpload={(mediaId) => setBannerContent({ ...bannerContent, image_id: mediaId })} existingImageUrl={bannerContent.existingImageUrl} section="pooja-donation-banner" />
            </div>
            {renderLanguageTabs('Quote', bannerContent.quote_en, bannerContent.quote_hi, bannerContent.quote_mr, (lang, value) => setBannerContent({ ...bannerContent, [`quote_${lang}`]: value }), true)}
            <Button onClick={() => saveSection('banner')} disabled={saving} className="w-full">
              {saving ? 'Saving...' : 'Save Banner'}
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PoojaAndDonationPageEditor;
