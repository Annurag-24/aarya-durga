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

interface SectionContent {
  title_en: string;
  title_hi: string;
  title_mr: string;
  subtitle_en?: string;
  subtitle_hi?: string;
  subtitle_mr?: string;
  description_en: string;
  description_hi: string;
  description_mr: string;
  image_id?: number;
  existingImageUrl?: string;
}

interface BlessingContent {
  title_en: string;
  title_hi: string;
  title_mr: string;
  content_en: string;
  content_hi: string;
  content_mr: string;
  image_id?: number;
  existingImageUrl?: string;
}

interface HistoryContent {
  title_en: string;
  title_hi: string;
  title_mr: string;
  description_en: string;
  description_hi: string;
  description_mr: string;
  card1_title_en: string;
  card1_title_hi: string;
  card1_title_mr: string;
  card1_description_en: string;
  card1_description_hi: string;
  card1_description_mr: string;
  card2_title_en: string;
  card2_title_hi: string;
  card2_title_mr: string;
  card2_description_en: string;
  card2_description_hi: string;
  card2_description_mr: string;
  card3_title_en: string;
  card3_title_hi: string;
  card3_title_mr: string;
  card3_description_en: string;
  card3_description_hi: string;
  card3_description_mr: string;
}

interface EventsContent {
  title_en: string;
  title_hi: string;
  title_mr: string;
  description_en: string;
  description_hi: string;
  description_mr: string;
}

interface VisitContent {
  darshan_morning_start_en: string;
  darshan_morning_start_hi: string;
  darshan_morning_start_mr: string;
  darshan_morning_end_en: string;
  darshan_morning_end_hi: string;
  darshan_morning_end_mr: string;
  darshan_evening_start_en: string;
  darshan_evening_start_hi: string;
  darshan_evening_start_mr: string;
  darshan_evening_end_en: string;
  darshan_evening_end_hi: string;
  darshan_evening_end_mr: string;
  temple_name_en: string;
  temple_name_hi: string;
  temple_name_mr: string;
  address_en: string;
  address_hi: string;
  address_mr: string;
  phone_en: string;
  phone_hi: string;
  phone_mr: string;
  email_en: string;
  email_hi: string;
  email_mr: string;
  latitude_en: string;
  latitude_hi: string;
  latitude_mr: string;
  longitude_en: string;
  longitude_hi: string;
  longitude_mr: string;
  image_id?: string;
  existingImageUrl?: string;
}

interface FooterContent {
  title_en: string;
  title_hi: string;
  title_mr: string;
  social_label_en: string;
  social_label_hi: string;
  social_label_mr: string;
  facebook_link_en: string;
  facebook_link_hi: string;
  facebook_link_mr: string;
  youtube_link_en: string;
  youtube_link_hi: string;
  youtube_link_mr: string;
  copyright_en: string;
  copyright_hi: string;
  copyright_mr: string;
}

const HomePageEditor = () => {
  const { setLoading: setGlobalLoading } = useLoader();

  // Helper functions for time conversion
  const convertTo24Hour = (time12: string): string => {
    if (!time12) return '';
    const [time, period] = time12.trim().split(' ');
    let [hours, minutes] = time.split(':');
    let hour = parseInt(hours);

    if (period === 'PM' && hour !== 12) hour += 12;
    if (period === 'AM' && hour === 12) hour = 0;

    return `${String(hour).padStart(2, '0')}:${minutes}`;
  };

  const convertTo12Hour = (time24: string): string => {
    if (!time24) return '';
    const [hoursStr, minutes] = time24.split(':');
    let hour = parseInt(hoursStr);
    const period = hour >= 12 ? 'PM' : 'AM';

    if (hour > 12) hour -= 12;
    if (hour === 0) hour = 12;

    return `${hour}:${minutes} ${period}`;
  };

  const [activeSection, setActiveSection] = useState('hero');
  const [heroContent, setHeroContent] = useState<SectionContent>({
    title_en: '',
    title_hi: '',
    title_mr: '',
    subtitle_en: '',
    subtitle_hi: '',
    subtitle_mr: '',
    description_en: '',
    description_hi: '',
    description_mr: '',
  });
  const [aboutContent, setAboutContent] = useState<SectionContent>({
    title_en: '',
    title_hi: '',
    title_mr: '',
    description_en: '',
    description_hi: '',
    description_mr: '',
  });
  const [blessingContent, setBlessingContent] = useState<BlessingContent>({
    title_en: '',
    title_hi: '',
    title_mr: '',
    content_en: '',
    content_hi: '',
    content_mr: '',
  });
  const [historyContent, setHistoryContent] = useState<HistoryContent>({
    title_en: '',
    title_hi: '',
    title_mr: '',
    description_en: '',
    description_hi: '',
    description_mr: '',
    card1_title_en: '',
    card1_title_hi: '',
    card1_title_mr: '',
    card1_description_en: '',
    card1_description_hi: '',
    card1_description_mr: '',
    card2_title_en: '',
    card2_title_hi: '',
    card2_title_mr: '',
    card2_description_en: '',
    card2_description_hi: '',
    card2_description_mr: '',
    card3_title_en: '',
    card3_title_hi: '',
    card3_title_mr: '',
    card3_description_en: '',
    card3_description_hi: '',
    card3_description_mr: '',
  });
  const [eventsContent, setEventsContent] = useState<EventsContent>({
    title_en: '',
    title_hi: '',
    title_mr: '',
    description_en: '',
    description_hi: '',
    description_mr: '',
  });
  const [visitContent, setVisitContent] = useState<VisitContent>({
    darshan_morning_start_en: '',
    darshan_morning_start_hi: '',
    darshan_morning_start_mr: '',
    darshan_morning_end_en: '',
    darshan_morning_end_hi: '',
    darshan_morning_end_mr: '',
    darshan_evening_start_en: '',
    darshan_evening_start_hi: '',
    darshan_evening_start_mr: '',
    darshan_evening_end_en: '',
    darshan_evening_end_hi: '',
    darshan_evening_end_mr: '',
    temple_name_en: '',
    temple_name_hi: '',
    temple_name_mr: '',
    phone_en: '',
    phone_hi: '',
    phone_mr: '',
    email_en: '',
    email_hi: '',
    email_mr: '',
    address_en: '',
    address_hi: '',
    address_mr: '',
    latitude_en: '',
    latitude_hi: '',
    latitude_mr: '',
    longitude_en: '',
    longitude_hi: '',
    longitude_mr: '',
    image_id: undefined,
    existingImageUrl: undefined,
  });
  const [footerContent, setFooterContent] = useState<FooterContent>({
    title_en: '',
    title_hi: '',
    title_mr: '',
    social_label_en: '',
    social_label_hi: '',
    social_label_mr: '',
    facebook_link_en: '',
    facebook_link_hi: '',
    facebook_link_mr: '',
    youtube_link_en: '',
    youtube_link_hi: '',
    youtube_link_mr: '',
    copyright_en: '',
    copyright_hi: '',
    copyright_mr: '',
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const imagesLoaded = useImagesLoaded([
    heroContent.existingImageUrl,
    aboutContent.existingImageUrl,
    blessingContent.existingImageUrl,
  ]);

  const sections = [
    { label: 'Hero Section', key: 'hero', description: 'Homepage hero title, subtitle, and background' },
    { label: 'About Section', key: 'about', description: 'About temple content' },
    { label: 'Blessing Banner', key: 'blessing', description: 'Blessing message and quote' },
    { label: 'History Section', key: 'history', description: 'History title, description, and 3 cards' },
    { label: 'Events Section', key: 'events', description: 'Temple events title and description' },
    { label: 'Visit Section', key: 'visit', description: 'Visit information and heading' },
    { label: 'Footer Section', key: 'footer', description: 'Footer title, social links, and copyright' },
  ];

  // Hide global loader once local loading is done AND images are loaded
  useEffect(() => {
    if (!loading && imagesLoaded) {
      setGlobalLoading(false);
    }
  }, [loading, imagesLoaded, setGlobalLoading]);

  useEffect(() => {
    loadSectionContent(activeSection);
  }, [activeSection]);

  const loadSectionContent = async (sectionKey: string) => {
    setLoading(true);
    setGlobalLoading(true);
    try {
      const response = await client.get(`/public/page-content/home`);

      if (sectionKey === 'hero') {
        const titleData = response.data.find((item: any) => item.section_key === 'hero_title');
        const subtitleData = response.data.find((item: any) => item.section_key === 'hero_subtitle');
        const descriptionData = response.data.find((item: any) => item.section_key === 'hero_description');
        const imageData = response.data.find((item: any) => item.section_key === 'hero_image');

        // Construct image URL if image exists
        let existingImageUrl: string | undefined;
        if (imageData?.image?.file_url) {
          existingImageUrl = constructImageUrl(imageData.image.file_url);
        }

        setHeroContent({
          title_en: titleData?.content_en || '',
          title_hi: titleData?.content_hi || '',
          title_mr: titleData?.content_mr || '',
          subtitle_en: subtitleData?.content_en || '',
          subtitle_hi: subtitleData?.content_hi || '',
          subtitle_mr: subtitleData?.content_mr || '',
          description_en: descriptionData?.content_en || '',
          description_hi: descriptionData?.content_hi || '',
          description_mr: descriptionData?.content_mr || '',
          image_id: imageData?.image_id,
          existingImageUrl,
        });
      } else if (sectionKey === 'about') {
        const titleData = response.data.find((item: any) => item.section_key === 'about_title');
        const descriptionData = response.data.find((item: any) => item.section_key === 'about_description');
        const imageData = response.data.find((item: any) => item.section_key === 'about_image');

        // Construct image URL if image exists
        let existingImageUrl: string | undefined;
        if (imageData?.image?.file_url) {
          existingImageUrl = constructImageUrl(imageData.image.file_url);
        }

        setAboutContent({
          title_en: titleData?.content_en || '',
          title_hi: titleData?.content_hi || '',
          title_mr: titleData?.content_mr || '',
          description_en: descriptionData?.content_en || '',
          description_hi: descriptionData?.content_hi || '',
          description_mr: descriptionData?.content_mr || '',
          image_id: imageData?.image_id,
          existingImageUrl,
        });
      } else if (sectionKey === 'blessing') {
        const titleData = response.data.find((item: any) => item.section_key === 'blessing_title');
        const contentData = response.data.find((item: any) => item.section_key === 'blessing_content');
        const imageData = response.data.find((item: any) => item.section_key === 'blessing_image');

        // Construct image URL if image exists
        let existingImageUrl: string | undefined;
        if (imageData?.image?.file_url) {
          existingImageUrl = constructImageUrl(imageData.image.file_url);
        }

        setBlessingContent({
          title_en: titleData?.content_en || '',
          title_hi: titleData?.content_hi || '',
          title_mr: titleData?.content_mr || '',
          content_en: contentData?.content_en || '',
          content_hi: contentData?.content_hi || '',
          content_mr: contentData?.content_mr || '',
          image_id: imageData?.image_id,
          existingImageUrl,
        });
      } else if (sectionKey === 'history') {
        const titleData = response.data.find((item: any) => item.section_key === 'history_title');
        const descriptionData = response.data.find((item: any) => item.section_key === 'history_description');
        const card1TitleData = response.data.find((item: any) => item.section_key === 'history_card1_title');
        const card1DescData = response.data.find((item: any) => item.section_key === 'history_card1_description');
        const card2TitleData = response.data.find((item: any) => item.section_key === 'history_card2_title');
        const card2DescData = response.data.find((item: any) => item.section_key === 'history_card2_description');
        const card3TitleData = response.data.find((item: any) => item.section_key === 'history_card3_title');
        const card3DescData = response.data.find((item: any) => item.section_key === 'history_card3_description');

        setHistoryContent({
          title_en: titleData?.content_en || '',
          title_hi: titleData?.content_hi || '',
          title_mr: titleData?.content_mr || '',
          description_en: descriptionData?.content_en || '',
          description_hi: descriptionData?.content_hi || '',
          description_mr: descriptionData?.content_mr || '',
          card1_title_en: card1TitleData?.content_en || '',
          card1_title_hi: card1TitleData?.content_hi || '',
          card1_title_mr: card1TitleData?.content_mr || '',
          card1_description_en: card1DescData?.content_en || '',
          card1_description_hi: card1DescData?.content_hi || '',
          card1_description_mr: card1DescData?.content_mr || '',
          card2_title_en: card2TitleData?.content_en || '',
          card2_title_hi: card2TitleData?.content_hi || '',
          card2_title_mr: card2TitleData?.content_mr || '',
          card2_description_en: card2DescData?.content_en || '',
          card2_description_hi: card2DescData?.content_hi || '',
          card2_description_mr: card2DescData?.content_mr || '',
          card3_title_en: card3TitleData?.content_en || '',
          card3_title_hi: card3TitleData?.content_hi || '',
          card3_title_mr: card3TitleData?.content_mr || '',
          card3_description_en: card3DescData?.content_en || '',
          card3_description_hi: card3DescData?.content_hi || '',
          card3_description_mr: card3DescData?.content_mr || '',
        });
      } else if (sectionKey === 'events') {
        const titleData = response.data.find((item: any) => item.section_key === 'events_title');
        const descriptionData = response.data.find((item: any) => item.section_key === 'events_description');

        setEventsContent({
          title_en: titleData?.content_en || '',
          title_hi: titleData?.content_hi || '',
          title_mr: titleData?.content_mr || '',
          description_en: descriptionData?.content_en || '',
          description_hi: descriptionData?.content_hi || '',
          description_mr: descriptionData?.content_mr || '',
        });
      } else if (sectionKey === 'visit') {
        const morningStartData = response.data.find((item: any) => item.section_key === 'visit_darshan_morning_start');
        const morningEndData = response.data.find((item: any) => item.section_key === 'visit_darshan_morning_end');
        const eveningStartData = response.data.find((item: any) => item.section_key === 'visit_darshan_evening_start');
        const eveningEndData = response.data.find((item: any) => item.section_key === 'visit_darshan_evening_end');
        const locationData = response.data.find((item: any) => item.section_key === 'visit_temple_name');
        const phoneData = response.data.find((item: any) => item.section_key === 'visit_phone');
        const emailData = response.data.find((item: any) => item.section_key === 'visit_email');
        const addressData = response.data.find((item: any) => item.section_key === 'visit_address');
        const latitudeData = response.data.find((item: any) => item.section_key === 'visit_latitude');
        const longitudeData = response.data.find((item: any) => item.section_key === 'visit_longitude');
        const imageData = response.data.find((item: any) => item.section_key === 'visit_image');

        // Construct image URL if image exists
        let existingImageUrl: string | undefined;
        if (imageData?.image?.file_url) {
          existingImageUrl = constructImageUrl(imageData.image.file_url);
        }

        setVisitContent({
          darshan_morning_start_en: morningStartData?.content_en || '',
          darshan_morning_start_hi: morningStartData?.content_hi || '',
          darshan_morning_start_mr: morningStartData?.content_mr || '',
          darshan_morning_end_en: morningEndData?.content_en || '',
          darshan_morning_end_hi: morningEndData?.content_hi || '',
          darshan_morning_end_mr: morningEndData?.content_mr || '',
          darshan_evening_start_en: eveningStartData?.content_en || '',
          darshan_evening_start_hi: eveningStartData?.content_hi || '',
          darshan_evening_start_mr: eveningStartData?.content_mr || '',
          darshan_evening_end_en: eveningEndData?.content_en || '',
          darshan_evening_end_hi: eveningEndData?.content_hi || '',
          darshan_evening_end_mr: eveningEndData?.content_mr || '',
          temple_name_en: locationData?.content_en || '',
          temple_name_hi: locationData?.content_hi || '',
          temple_name_mr: locationData?.content_mr || '',
          phone_en: phoneData?.content_en || '',
          phone_hi: phoneData?.content_hi || '',
          phone_mr: phoneData?.content_mr || '',
          email_en: emailData?.content_en || '',
          email_hi: emailData?.content_hi || '',
          email_mr: emailData?.content_mr || '',
          address_en: addressData?.content_en || '',
          address_hi: addressData?.content_hi || '',
          address_mr: addressData?.content_mr || '',
          latitude_en: latitudeData?.content_en || '',
          latitude_hi: latitudeData?.content_hi || '',
          latitude_mr: latitudeData?.content_mr || '',
          longitude_en: longitudeData?.content_en || '',
          longitude_hi: longitudeData?.content_hi || '',
          longitude_mr: longitudeData?.content_mr || '',
          image_id: imageData?.image_id,
          existingImageUrl,
        });
      } else if (sectionKey === 'footer') {
        const titleData = response.data.find((item: any) => item.section_key === 'footer_title');
        const socialLabelData = response.data.find((item: any) => item.section_key === 'footer_social_label');
        const facebookData = response.data.find((item: any) => item.section_key === 'footer_facebook_link');
        const youtubeData = response.data.find((item: any) => item.section_key === 'footer_youtube_link');
        const copyrightData = response.data.find((item: any) => item.section_key === 'footer_copyright');

        setFooterContent({
          title_en: titleData?.content_en || '',
          title_hi: titleData?.content_hi || '',
          title_mr: titleData?.content_mr || '',
          social_label_en: socialLabelData?.content_en || '',
          social_label_hi: socialLabelData?.content_hi || '',
          social_label_mr: socialLabelData?.content_mr || '',
          facebook_link_en: facebookData?.content_en || '',
          facebook_link_hi: facebookData?.content_hi || '',
          facebook_link_mr: facebookData?.content_mr || '',
          youtube_link_en: youtubeData?.content_en || '',
          youtube_link_hi: youtubeData?.content_hi || '',
          youtube_link_mr: youtubeData?.content_mr || '',
          copyright_en: copyrightData?.content_en || '',
          copyright_hi: copyrightData?.content_hi || '',
          copyright_mr: copyrightData?.content_mr || '',
        });
      }
    } catch {
      setHeroContent({
        title_en: '',
        title_hi: '',
        title_mr: '',
        subtitle_en: '',
        subtitle_hi: '',
        subtitle_mr: '',
        description_en: '',
        description_hi: '',
        description_mr: '',
      });
      setAboutContent({
        title_en: '',
        title_hi: '',
        title_mr: '',
        description_en: '',
        description_hi: '',
        description_mr: '',
      });
      setBlessingContent({
        title_en: '',
        title_hi: '',
        title_mr: '',
        content_en: '',
        content_hi: '',
        content_mr: '',
      });
      setHistoryContent({
        title_en: '',
        title_hi: '',
        title_mr: '',
        description_en: '',
        description_hi: '',
        description_mr: '',
        card1_title_en: '',
        card1_title_hi: '',
        card1_title_mr: '',
        card1_description_en: '',
        card1_description_hi: '',
        card1_description_mr: '',
        card2_title_en: '',
        card2_title_hi: '',
        card2_title_mr: '',
        card2_description_en: '',
        card2_description_hi: '',
        card2_description_mr: '',
        card3_title_en: '',
        card3_title_hi: '',
        card3_title_mr: '',
        card3_description_en: '',
        card3_description_hi: '',
        card3_description_mr: '',
      });
      setEventsContent({
        title_en: '',
        title_hi: '',
        title_mr: '',
        description_en: '',
        description_hi: '',
        description_mr: '',
      });
      setVisitContent({
        darshan_morning_start_en: '',
        darshan_morning_start_hi: '',
        darshan_morning_start_mr: '',
        darshan_morning_end_en: '',
        darshan_morning_end_hi: '',
        darshan_morning_end_mr: '',
        darshan_evening_start_en: '',
        darshan_evening_start_hi: '',
        darshan_evening_start_mr: '',
        darshan_evening_end_en: '',
        darshan_evening_end_hi: '',
        darshan_evening_end_mr: '',
        temple_name_en: '',
        temple_name_hi: '',
        temple_name_mr: '',
        phone_en: '',
        phone_hi: '',
        phone_mr: '',
        email_en: '',
        email_hi: '',
        email_mr: '',
        address_en: '',
        address_hi: '',
        address_mr: '',
        latitude_en: '',
        latitude_hi: '',
        latitude_mr: '',
        longitude_en: '',
        longitude_hi: '',
        longitude_mr: '',
        image_id: undefined,
        existingImageUrl: undefined,
      });
      setFooterContent({
        title_en: '',
        title_hi: '',
        title_mr: '',
        social_label_en: '',
        social_label_hi: '',
        social_label_mr: '',
        facebook_link_en: '',
        facebook_link_hi: '',
        facebook_link_mr: '',
        youtube_link_en: '',
        youtube_link_hi: '',
        youtube_link_mr: '',
        copyright_en: '',
        copyright_hi: '',
        copyright_mr: '',
      });
    } finally {
      setLoading(false);
      // Global loading is now handled by useEffect that waits for images
    }
  };

  const saveHeroSection = async () => {
    setSaving(true);
    try {
      // Save title
      if (heroContent.title_en || heroContent.title_hi || heroContent.title_mr) {
        await Promise.all([
          heroContent.title_en && client.put(`/admin/page-content/home/hero_title`, {
            language: 'en',
            content: heroContent.title_en,
          }),
          heroContent.title_hi && client.put(`/admin/page-content/home/hero_title`, {
            language: 'hi',
            content: heroContent.title_hi,
          }),
          heroContent.title_mr && client.put(`/admin/page-content/home/hero_title`, {
            language: 'mr',
            content: heroContent.title_mr,
          }),
        ].filter(Boolean));
      }

      // Save subtitle
      if (heroContent.subtitle_en || heroContent.subtitle_hi || heroContent.subtitle_mr) {
        await Promise.all([
          heroContent.subtitle_en && client.put(`/admin/page-content/home/hero_subtitle`, {
            language: 'en',
            content: heroContent.subtitle_en,
          }),
          heroContent.subtitle_hi && client.put(`/admin/page-content/home/hero_subtitle`, {
            language: 'hi',
            content: heroContent.subtitle_hi,
          }),
          heroContent.subtitle_mr && client.put(`/admin/page-content/home/hero_subtitle`, {
            language: 'mr',
            content: heroContent.subtitle_mr,
          }),
        ].filter(Boolean));
      }

      // Save description
      if (heroContent.description_en || heroContent.description_hi || heroContent.description_mr) {
        await Promise.all([
          heroContent.description_en && client.put(`/admin/page-content/home/hero_description`, {
            language: 'en',
            content: heroContent.description_en,
          }),
          heroContent.description_hi && client.put(`/admin/page-content/home/hero_description`, {
            language: 'hi',
            content: heroContent.description_hi,
          }),
          heroContent.description_mr && client.put(`/admin/page-content/home/hero_description`, {
            language: 'mr',
            content: heroContent.description_mr,
          }),
        ].filter(Boolean));
      }

      // Save image - handle both new image and image removal
      if (heroContent.image_id !== undefined) {
        await client.put(`/admin/page-content/home/hero_image`, {
          image_id: heroContent.image_id || null,
        });
      }

      toast.success('Hero section saved successfully');
    } catch (error) {
      toast.error('Failed to save hero section');
    } finally {
      setSaving(false);
    }
  };

  const handleRemoveImage = async () => {
    try {
      await client.put(`/admin/page-content/home/hero_image`, {
        image_id: null,
      });
      setHeroContent({
        ...heroContent,
        image_id: undefined,
        existingImageUrl: undefined,
      });
      toast.success('Image removed successfully');
    } catch (error) {
      toast.error('Failed to remove image');
    }
  };

  const saveAboutSection = async () => {
    setSaving(true);
    try {
      // Save title
      if (aboutContent.title_en || aboutContent.title_hi || aboutContent.title_mr) {
        await Promise.all([
          aboutContent.title_en && client.put(`/admin/page-content/home/about_title`, {
            language: 'en',
            content: aboutContent.title_en,
          }),
          aboutContent.title_hi && client.put(`/admin/page-content/home/about_title`, {
            language: 'hi',
            content: aboutContent.title_hi,
          }),
          aboutContent.title_mr && client.put(`/admin/page-content/home/about_title`, {
            language: 'mr',
            content: aboutContent.title_mr,
          }),
        ].filter(Boolean));
      }

      // Save description with image
      if (aboutContent.description_en || aboutContent.description_hi || aboutContent.description_mr || aboutContent.image_id !== undefined) {
        await client.put(`/admin/page-content/home/about_description`, {
          language: 'en',
          content: aboutContent.description_en,
          image_id: aboutContent.image_id || null,
        });
        await client.put(`/admin/page-content/home/about_description`, {
          language: 'hi',
          content: aboutContent.description_hi,
          image_id: aboutContent.image_id || null,
        });
        await client.put(`/admin/page-content/home/about_description`, {
          language: 'mr',
          content: aboutContent.description_mr,
          image_id: aboutContent.image_id || null,
        });
      }

      toast.success('About section saved successfully');
    } catch (error) {
      toast.error('Failed to save about section');
    } finally {
      setSaving(false);
    }
  };

  const handleRemoveAboutImage = async () => {
    try {
      await client.put(`/admin/page-content/home/about_description`, {
        image_id: null,
      });
      setAboutContent({
        ...aboutContent,
        image_id: undefined,
        existingImageUrl: undefined,
      });
      toast.success('Image removed successfully');
    } catch {
      toast.error('Failed to remove image');
    }
  };

  const saveBlessing = async () => {
    setSaving(true);
    try {
      // Save title
      if (blessingContent.title_en || blessingContent.title_hi || blessingContent.title_mr) {
        await Promise.all([
          blessingContent.title_en && client.put(`/admin/page-content/home/blessing_title`, {
            language: 'en',
            content: blessingContent.title_en,
          }),
          blessingContent.title_hi && client.put(`/admin/page-content/home/blessing_title`, {
            language: 'hi',
            content: blessingContent.title_hi,
          }),
          blessingContent.title_mr && client.put(`/admin/page-content/home/blessing_title`, {
            language: 'mr',
            content: blessingContent.title_mr,
          }),
        ].filter(Boolean));
      }

      // Save content
      if (blessingContent.content_en || blessingContent.content_hi || blessingContent.content_mr) {
        await Promise.all([
          blessingContent.content_en && client.put(`/admin/page-content/home/blessing_content`, {
            language: 'en',
            content: blessingContent.content_en,
          }),
          blessingContent.content_hi && client.put(`/admin/page-content/home/blessing_content`, {
            language: 'hi',
            content: blessingContent.content_hi,
          }),
          blessingContent.content_mr && client.put(`/admin/page-content/home/blessing_content`, {
            language: 'mr',
            content: blessingContent.content_mr,
          }),
        ].filter(Boolean));
      }

      // Save image
      if (blessingContent.image_id !== undefined) {
        await client.put(`/admin/page-content/home/blessing_image`, {
          image_id: blessingContent.image_id || null,
        });
      }

      toast.success('Blessing section saved successfully');
    } catch {
      toast.error('Failed to save blessing section');
    } finally {
      setSaving(false);
    }
  };

  const handleRemoveBlessingImage = async () => {
    try {
      await client.put(`/admin/page-content/home/blessing_image`, {
        image_id: null,
      });
      setBlessingContent({
        ...blessingContent,
        image_id: undefined,
        existingImageUrl: undefined,
      });
      toast.success('Image removed successfully');
    } catch {
      toast.error('Failed to remove image');
    }
  };

  const saveHistory = async () => {
    setSaving(true);
    try {
      // Save title
      if (historyContent.title_en || historyContent.title_hi || historyContent.title_mr) {
        await Promise.all([
          historyContent.title_en && client.put(`/admin/page-content/home/history_title`, {
            language: 'en',
            content: historyContent.title_en,
          }),
          historyContent.title_hi && client.put(`/admin/page-content/home/history_title`, {
            language: 'hi',
            content: historyContent.title_hi,
          }),
          historyContent.title_mr && client.put(`/admin/page-content/home/history_title`, {
            language: 'mr',
            content: historyContent.title_mr,
          }),
        ].filter(Boolean));
      }

      // Save description
      if (historyContent.description_en || historyContent.description_hi || historyContent.description_mr) {
        await Promise.all([
          historyContent.description_en && client.put(`/admin/page-content/home/history_description`, {
            language: 'en',
            content: historyContent.description_en,
          }),
          historyContent.description_hi && client.put(`/admin/page-content/home/history_description`, {
            language: 'hi',
            content: historyContent.description_hi,
          }),
          historyContent.description_mr && client.put(`/admin/page-content/home/history_description`, {
            language: 'mr',
            content: historyContent.description_mr,
          }),
        ].filter(Boolean));
      }

      // Save card 1
      if (historyContent.card1_title_en || historyContent.card1_title_hi || historyContent.card1_title_mr) {
        await Promise.all([
          historyContent.card1_title_en && client.put(`/admin/page-content/home/history_card1_title`, {
            language: 'en',
            content: historyContent.card1_title_en,
          }),
          historyContent.card1_title_hi && client.put(`/admin/page-content/home/history_card1_title`, {
            language: 'hi',
            content: historyContent.card1_title_hi,
          }),
          historyContent.card1_title_mr && client.put(`/admin/page-content/home/history_card1_title`, {
            language: 'mr',
            content: historyContent.card1_title_mr,
          }),
        ].filter(Boolean));
      }

      if (historyContent.card1_description_en || historyContent.card1_description_hi || historyContent.card1_description_mr) {
        await Promise.all([
          historyContent.card1_description_en && client.put(`/admin/page-content/home/history_card1_description`, {
            language: 'en',
            content: historyContent.card1_description_en,
          }),
          historyContent.card1_description_hi && client.put(`/admin/page-content/home/history_card1_description`, {
            language: 'hi',
            content: historyContent.card1_description_hi,
          }),
          historyContent.card1_description_mr && client.put(`/admin/page-content/home/history_card1_description`, {
            language: 'mr',
            content: historyContent.card1_description_mr,
          }),
        ].filter(Boolean));
      }

      // Save card 2
      if (historyContent.card2_title_en || historyContent.card2_title_hi || historyContent.card2_title_mr) {
        await Promise.all([
          historyContent.card2_title_en && client.put(`/admin/page-content/home/history_card2_title`, {
            language: 'en',
            content: historyContent.card2_title_en,
          }),
          historyContent.card2_title_hi && client.put(`/admin/page-content/home/history_card2_title`, {
            language: 'hi',
            content: historyContent.card2_title_hi,
          }),
          historyContent.card2_title_mr && client.put(`/admin/page-content/home/history_card2_title`, {
            language: 'mr',
            content: historyContent.card2_title_mr,
          }),
        ].filter(Boolean));
      }

      if (historyContent.card2_description_en || historyContent.card2_description_hi || historyContent.card2_description_mr) {
        await Promise.all([
          historyContent.card2_description_en && client.put(`/admin/page-content/home/history_card2_description`, {
            language: 'en',
            content: historyContent.card2_description_en,
          }),
          historyContent.card2_description_hi && client.put(`/admin/page-content/home/history_card2_description`, {
            language: 'hi',
            content: historyContent.card2_description_hi,
          }),
          historyContent.card2_description_mr && client.put(`/admin/page-content/home/history_card2_description`, {
            language: 'mr',
            content: historyContent.card2_description_mr,
          }),
        ].filter(Boolean));
      }

      // Save card 3
      if (historyContent.card3_title_en || historyContent.card3_title_hi || historyContent.card3_title_mr) {
        await Promise.all([
          historyContent.card3_title_en && client.put(`/admin/page-content/home/history_card3_title`, {
            language: 'en',
            content: historyContent.card3_title_en,
          }),
          historyContent.card3_title_hi && client.put(`/admin/page-content/home/history_card3_title`, {
            language: 'hi',
            content: historyContent.card3_title_hi,
          }),
          historyContent.card3_title_mr && client.put(`/admin/page-content/home/history_card3_title`, {
            language: 'mr',
            content: historyContent.card3_title_mr,
          }),
        ].filter(Boolean));
      }

      if (historyContent.card3_description_en || historyContent.card3_description_hi || historyContent.card3_description_mr) {
        await Promise.all([
          historyContent.card3_description_en && client.put(`/admin/page-content/home/history_card3_description`, {
            language: 'en',
            content: historyContent.card3_description_en,
          }),
          historyContent.card3_description_hi && client.put(`/admin/page-content/home/history_card3_description`, {
            language: 'hi',
            content: historyContent.card3_description_hi,
          }),
          historyContent.card3_description_mr && client.put(`/admin/page-content/home/history_card3_description`, {
            language: 'mr',
            content: historyContent.card3_description_mr,
          }),
        ].filter(Boolean));
      }

      toast.success('History section saved successfully');
    } catch {
      toast.error('Failed to save history section');
    } finally {
      setSaving(false);
    }
  };

  const saveEvents = async () => {
    setSaving(true);
    try {
      // Save title
      if (eventsContent.title_en || eventsContent.title_hi || eventsContent.title_mr) {
        await Promise.all([
          eventsContent.title_en && client.put(`/admin/page-content/home/events_title`, {
            language: 'en',
            content: eventsContent.title_en,
          }),
          eventsContent.title_hi && client.put(`/admin/page-content/home/events_title`, {
            language: 'hi',
            content: eventsContent.title_hi,
          }),
          eventsContent.title_mr && client.put(`/admin/page-content/home/events_title`, {
            language: 'mr',
            content: eventsContent.title_mr,
          }),
        ].filter(Boolean));
      }

      // Save description
      if (eventsContent.description_en || eventsContent.description_hi || eventsContent.description_mr) {
        await Promise.all([
          eventsContent.description_en && client.put(`/admin/page-content/home/events_description`, {
            language: 'en',
            content: eventsContent.description_en,
          }),
          eventsContent.description_hi && client.put(`/admin/page-content/home/events_description`, {
            language: 'hi',
            content: eventsContent.description_hi,
          }),
          eventsContent.description_mr && client.put(`/admin/page-content/home/events_description`, {
            language: 'mr',
            content: eventsContent.description_mr,
          }),
        ].filter(Boolean));
      }

      toast.success('Events section saved successfully');
    } catch {
      toast.error('Failed to save events section');
    } finally {
      setSaving(false);
    }
  };

  const saveVisit = async () => {
    setSaving(true);
    try {
      // Save morning darshan times
      await Promise.all([
        visitContent.darshan_morning_start_en && client.put(`/admin/page-content/home/visit_darshan_morning_start`, {
          language: 'en',
          content: visitContent.darshan_morning_start_en,
        }),
        visitContent.darshan_morning_start_hi && client.put(`/admin/page-content/home/visit_darshan_morning_start`, {
          language: 'hi',
          content: visitContent.darshan_morning_start_hi,
        }),
        visitContent.darshan_morning_start_mr && client.put(`/admin/page-content/home/visit_darshan_morning_start`, {
          language: 'mr',
          content: visitContent.darshan_morning_start_mr,
        }),
      ].filter(Boolean));

      await Promise.all([
        visitContent.darshan_morning_end_en && client.put(`/admin/page-content/home/visit_darshan_morning_end`, {
          language: 'en',
          content: visitContent.darshan_morning_end_en,
        }),
        visitContent.darshan_morning_end_hi && client.put(`/admin/page-content/home/visit_darshan_morning_end`, {
          language: 'hi',
          content: visitContent.darshan_morning_end_hi,
        }),
        visitContent.darshan_morning_end_mr && client.put(`/admin/page-content/home/visit_darshan_morning_end`, {
          language: 'mr',
          content: visitContent.darshan_morning_end_mr,
        }),
      ].filter(Boolean));

      // Save evening darshan times
      await Promise.all([
        visitContent.darshan_evening_start_en && client.put(`/admin/page-content/home/visit_darshan_evening_start`, {
          language: 'en',
          content: visitContent.darshan_evening_start_en,
        }),
        visitContent.darshan_evening_start_hi && client.put(`/admin/page-content/home/visit_darshan_evening_start`, {
          language: 'hi',
          content: visitContent.darshan_evening_start_hi,
        }),
        visitContent.darshan_evening_start_mr && client.put(`/admin/page-content/home/visit_darshan_evening_start`, {
          language: 'mr',
          content: visitContent.darshan_evening_start_mr,
        }),
      ].filter(Boolean));

      await Promise.all([
        visitContent.darshan_evening_end_en && client.put(`/admin/page-content/home/visit_darshan_evening_end`, {
          language: 'en',
          content: visitContent.darshan_evening_end_en,
        }),
        visitContent.darshan_evening_end_hi && client.put(`/admin/page-content/home/visit_darshan_evening_end`, {
          language: 'hi',
          content: visitContent.darshan_evening_end_hi,
        }),
        visitContent.darshan_evening_end_mr && client.put(`/admin/page-content/home/visit_darshan_evening_end`, {
          language: 'mr',
          content: visitContent.darshan_evening_end_mr,
        }),
      ].filter(Boolean));

      // Save temple name
      await Promise.all([
        visitContent.temple_name_en && client.put(`/admin/page-content/home/visit_temple_name`, {
          language: 'en',
          content: visitContent.temple_name_en,
        }),
        visitContent.temple_name_hi && client.put(`/admin/page-content/home/visit_temple_name`, {
          language: 'hi',
          content: visitContent.temple_name_hi,
        }),
        visitContent.temple_name_mr && client.put(`/admin/page-content/home/visit_temple_name`, {
          language: 'mr',
          content: visitContent.temple_name_mr,
        }),
      ].filter(Boolean));

      // Save phone
      await Promise.all([
        visitContent.phone_en && client.put(`/admin/page-content/home/visit_phone`, {
          language: 'en',
          content: visitContent.phone_en,
        }),
        visitContent.phone_hi && client.put(`/admin/page-content/home/visit_phone`, {
          language: 'hi',
          content: visitContent.phone_hi,
        }),
        visitContent.phone_mr && client.put(`/admin/page-content/home/visit_phone`, {
          language: 'mr',
          content: visitContent.phone_mr,
        }),
      ].filter(Boolean));

      // Save email
      await Promise.all([
        visitContent.email_en && client.put(`/admin/page-content/home/visit_email`, {
          language: 'en',
          content: visitContent.email_en,
        }),
        visitContent.email_hi && client.put(`/admin/page-content/home/visit_email`, {
          language: 'hi',
          content: visitContent.email_hi,
        }),
        visitContent.email_mr && client.put(`/admin/page-content/home/visit_email`, {
          language: 'mr',
          content: visitContent.email_mr,
        }),
      ].filter(Boolean));

      // Save address
      await Promise.all([
        visitContent.address_en && client.put(`/admin/page-content/home/visit_address`, {
          language: 'en',
          content: visitContent.address_en,
        }),
        visitContent.address_hi && client.put(`/admin/page-content/home/visit_address`, {
          language: 'hi',
          content: visitContent.address_hi,
        }),
        visitContent.address_mr && client.put(`/admin/page-content/home/visit_address`, {
          language: 'mr',
          content: visitContent.address_mr,
        }),
      ].filter(Boolean));

      // Save latitude
      await Promise.all([
        visitContent.latitude_en && client.put(`/admin/page-content/home/visit_latitude`, {
          language: 'en',
          content: visitContent.latitude_en,
        }),
        visitContent.latitude_hi && client.put(`/admin/page-content/home/visit_latitude`, {
          language: 'hi',
          content: visitContent.latitude_hi,
        }),
        visitContent.latitude_mr && client.put(`/admin/page-content/home/visit_latitude`, {
          language: 'mr',
          content: visitContent.latitude_mr,
        }),
      ].filter(Boolean));

      // Save longitude
      await Promise.all([
        visitContent.longitude_en && client.put(`/admin/page-content/home/visit_longitude`, {
          language: 'en',
          content: visitContent.longitude_en,
        }),
        visitContent.longitude_hi && client.put(`/admin/page-content/home/visit_longitude`, {
          language: 'hi',
          content: visitContent.longitude_hi,
        }),
        visitContent.longitude_mr && client.put(`/admin/page-content/home/visit_longitude`, {
          language: 'mr',
          content: visitContent.longitude_mr,
        }),
      ].filter(Boolean));

      // Save background image if present
      if (visitContent.image_id) {
        await client.put(`/admin/page-content/home/visit_image`, {
          image_id: visitContent.image_id,
        });
      }

      toast.success('Visit section saved successfully');
    } catch {
      toast.error('Failed to save visit section');
    } finally {
      setSaving(false);
    }
  };

  const saveFooter = async () => {
    setSaving(true);
    try {
      // Save title
      await Promise.all([
        footerContent.title_en && client.put(`/admin/page-content/home/footer_title`, {
          language: 'en',
          content: footerContent.title_en,
        }),
        footerContent.title_hi && client.put(`/admin/page-content/home/footer_title`, {
          language: 'hi',
          content: footerContent.title_hi,
        }),
        footerContent.title_mr && client.put(`/admin/page-content/home/footer_title`, {
          language: 'mr',
          content: footerContent.title_mr,
        }),
      ].filter(Boolean));

      // Save social label
      await Promise.all([
        footerContent.social_label_en && client.put(`/admin/page-content/home/footer_social_label`, {
          language: 'en',
          content: footerContent.social_label_en,
        }),
        footerContent.social_label_hi && client.put(`/admin/page-content/home/footer_social_label`, {
          language: 'hi',
          content: footerContent.social_label_hi,
        }),
        footerContent.social_label_mr && client.put(`/admin/page-content/home/footer_social_label`, {
          language: 'mr',
          content: footerContent.social_label_mr,
        }),
      ].filter(Boolean));

      // Save facebook link
      await Promise.all([
        footerContent.facebook_link_en && client.put(`/admin/page-content/home/footer_facebook_link`, {
          language: 'en',
          content: footerContent.facebook_link_en,
        }),
        footerContent.facebook_link_hi && client.put(`/admin/page-content/home/footer_facebook_link`, {
          language: 'hi',
          content: footerContent.facebook_link_hi,
        }),
        footerContent.facebook_link_mr && client.put(`/admin/page-content/home/footer_facebook_link`, {
          language: 'mr',
          content: footerContent.facebook_link_mr,
        }),
      ].filter(Boolean));

      // Save youtube link
      await Promise.all([
        footerContent.youtube_link_en && client.put(`/admin/page-content/home/footer_youtube_link`, {
          language: 'en',
          content: footerContent.youtube_link_en,
        }),
        footerContent.youtube_link_hi && client.put(`/admin/page-content/home/footer_youtube_link`, {
          language: 'hi',
          content: footerContent.youtube_link_hi,
        }),
        footerContent.youtube_link_mr && client.put(`/admin/page-content/home/footer_youtube_link`, {
          language: 'mr',
          content: footerContent.youtube_link_mr,
        }),
      ].filter(Boolean));

      // Save copyright
      await Promise.all([
        footerContent.copyright_en && client.put(`/admin/page-content/home/footer_copyright`, {
          language: 'en',
          content: footerContent.copyright_en,
        }),
        footerContent.copyright_hi && client.put(`/admin/page-content/home/footer_copyright`, {
          language: 'hi',
          content: footerContent.copyright_hi,
        }),
        footerContent.copyright_mr && client.put(`/admin/page-content/home/footer_copyright`, {
          language: 'mr',
          content: footerContent.copyright_mr,
        }),
      ].filter(Boolean));

      toast.success('Footer section saved successfully');
    } catch {
      toast.error('Failed to save footer section');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-6xl space-y-6">
      <div>
        <h1 className="font-heading text-3xl font-bold text-foreground">Home Page Editor</h1>
        <p className="text-muted-foreground mt-1">Manage all home page sections in multiple languages</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {sections.map((section) => (
          <Card
            key={section.key}
            className={`cursor-pointer transition-all ${
              activeSection === section.key ? 'ring-2 ring-primary' : ''
            }`}
            onClick={() => setActiveSection(section.key)}
          >
            <CardContent className="pt-6">
              <p className="font-semibold text-sm text-foreground">{section.label}</p>
              <p className="text-xs text-muted-foreground mt-1">{section.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {activeSection === 'hero' && (
        <Card>
          <CardHeader>
            <CardTitle>Hero Section</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Hero Title */}
            <div className="space-y-4">
              <h3 className="font-semibold text-foreground">Hero Title</h3>
              <Tabs defaultValue="en" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="en">English</TabsTrigger>
                  <TabsTrigger value="hi">हिंदी</TabsTrigger>
                  <TabsTrigger value="mr">मराठी</TabsTrigger>
                </TabsList>

                <TabsContent value="en" className="space-y-2 mt-4">
                  <Label htmlFor="title_en">Title</Label>
                  <Input
                    id="title_en"
                    value={heroContent.title_en}
                    onChange={(e) =>
                      setHeroContent({ ...heroContent, title_en: e.target.value })
                    }
                    placeholder="Enter hero title in English"
                    disabled={loading}
                  />
                </TabsContent>

                <TabsContent value="hi" className="space-y-2 mt-4">
                  <Label htmlFor="title_hi">शीर्षक</Label>
                  <Input
                    id="title_hi"
                    value={heroContent.title_hi}
                    onChange={(e) =>
                      setHeroContent({ ...heroContent, title_hi: e.target.value })
                    }
                    placeholder="हिंदी में शीर्षक दर्ज करें"
                    disabled={loading}
                  />
                </TabsContent>

                <TabsContent value="mr" className="space-y-2 mt-4">
                  <Label htmlFor="title_mr">शीर्षक</Label>
                  <Input
                    id="title_mr"
                    value={heroContent.title_mr}
                    onChange={(e) =>
                      setHeroContent({ ...heroContent, title_mr: e.target.value })
                    }
                    placeholder="मराठीत शीर्षक प्रविष्ट करा"
                    disabled={loading}
                  />
                </TabsContent>
              </Tabs>
            </div>

            {/* Hero Subtitle */}
            <div className="space-y-4">
              <h3 className="font-semibold text-foreground">Hero Subtitle</h3>
              <Tabs defaultValue="en" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="en">English</TabsTrigger>
                  <TabsTrigger value="hi">हिंदी</TabsTrigger>
                  <TabsTrigger value="mr">मराठी</TabsTrigger>
                </TabsList>

                <TabsContent value="en" className="space-y-2 mt-4">
                  <Label htmlFor="subtitle_en">Subtitle</Label>
                  <Input
                    id="subtitle_en"
                    value={heroContent.subtitle_en}
                    onChange={(e) =>
                      setHeroContent({ ...heroContent, subtitle_en: e.target.value })
                    }
                    placeholder="Enter hero subtitle in English"
                    disabled={loading}
                  />
                </TabsContent>

                <TabsContent value="hi" className="space-y-2 mt-4">
                  <Label htmlFor="subtitle_hi">उपशीर्षक</Label>
                  <Input
                    id="subtitle_hi"
                    value={heroContent.subtitle_hi}
                    onChange={(e) =>
                      setHeroContent({ ...heroContent, subtitle_hi: e.target.value })
                    }
                    placeholder="हिंदी में उपशीर्षक दर्ज करें"
                    disabled={loading}
                  />
                </TabsContent>

                <TabsContent value="mr" className="space-y-2 mt-4">
                  <Label htmlFor="subtitle_mr">उपशीर्षक</Label>
                  <Input
                    id="subtitle_mr"
                    value={heroContent.subtitle_mr}
                    onChange={(e) =>
                      setHeroContent({ ...heroContent, subtitle_mr: e.target.value })
                    }
                    placeholder="मराठीत उपशीर्षक प्रविष्ट करा"
                    disabled={loading}
                  />
                </TabsContent>
              </Tabs>
            </div>

            {/* Hero Description */}
            <div className="space-y-4">
              <h3 className="font-semibold text-foreground">Hero Description</h3>
              <Tabs defaultValue="en" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="en">English</TabsTrigger>
                  <TabsTrigger value="hi">हिंदी</TabsTrigger>
                  <TabsTrigger value="mr">मराठी</TabsTrigger>
                </TabsList>

                <TabsContent value="en" className="space-y-2 mt-4">
                  <Label htmlFor="desc_en">Description</Label>
                  <Textarea
                    id="desc_en"
                    value={heroContent.description_en}
                    onChange={(e) =>
                      setHeroContent({ ...heroContent, description_en: e.target.value })
                    }
                    placeholder="Enter hero description in English"
                    rows={3}
                    disabled={loading}
                  />
                </TabsContent>

                <TabsContent value="hi" className="space-y-2 mt-4">
                  <Label htmlFor="desc_hi">विवरण</Label>
                  <Textarea
                    id="desc_hi"
                    value={heroContent.description_hi}
                    onChange={(e) =>
                      setHeroContent({ ...heroContent, description_hi: e.target.value })
                    }
                    placeholder="हिंदी में विवरण दर्ज करें"
                    rows={3}
                    disabled={loading}
                  />
                </TabsContent>

                <TabsContent value="mr" className="space-y-2 mt-4">
                  <Label htmlFor="desc_mr">विवरण</Label>
                  <Textarea
                    id="desc_mr"
                    value={heroContent.description_mr}
                    onChange={(e) =>
                      setHeroContent({ ...heroContent, description_mr: e.target.value })
                    }
                    placeholder="मराठीत विवरण प्रविष्ट करा"
                    rows={3}
                    disabled={loading}
                  />
                </TabsContent>
              </Tabs>
            </div>

            {/* Background Image */}
            <div className="space-y-4">
              <h3 className="font-semibold text-foreground">Background Image</h3>
              <ImageUpload
                onUpload={(mediaId) => {
                  setHeroContent({ ...heroContent, image_id: mediaId });
                }}
                existingImageUrl={heroContent.existingImageUrl}
                onRemove={handleRemoveImage}
                section="hero"
              />
            </div>

            <Button onClick={saveHeroSection} disabled={saving} className="w-full">
              {saving ? 'Saving...' : 'Save Hero Section'}
            </Button>
          </CardContent>
        </Card>
      )}

      {activeSection === 'about' && (
        <Card>
          <CardHeader>
            <CardTitle>About Section</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* About Section Image */}
            <div className="space-y-4">
              <h3 className="font-semibold text-foreground">Section Image</h3>
              <ImageUpload
                onUpload={(mediaId) => {
                  setAboutContent({ ...aboutContent, image_id: mediaId });
                }}
                existingImageUrl={aboutContent.existingImageUrl}
                onRemove={handleRemoveAboutImage}
                section="about"
              />
            </div>

            {/* About Title */}
            <div className="space-y-4">
              <h3 className="font-semibold text-foreground">Section Title</h3>
              <Tabs defaultValue="en" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="en">English</TabsTrigger>
                  <TabsTrigger value="hi">हिंदी</TabsTrigger>
                  <TabsTrigger value="mr">मराठी</TabsTrigger>
                </TabsList>

                <TabsContent value="en" className="space-y-2 mt-4">
                  <Label htmlFor="about_title_en">Title</Label>
                  <Input
                    id="about_title_en"
                    value={aboutContent.title_en}
                    onChange={(e) =>
                      setAboutContent({ ...aboutContent, title_en: e.target.value })
                    }
                    placeholder="Enter about section title in English"
                    disabled={loading}
                  />
                </TabsContent>

                <TabsContent value="hi" className="space-y-2 mt-4">
                  <Label htmlFor="about_title_hi">शीर्षक</Label>
                  <Input
                    id="about_title_hi"
                    value={aboutContent.title_hi}
                    onChange={(e) =>
                      setAboutContent({ ...aboutContent, title_hi: e.target.value })
                    }
                    placeholder="हिंदी में शीर्षक दर्ज करें"
                    disabled={loading}
                  />
                </TabsContent>

                <TabsContent value="mr" className="space-y-2 mt-4">
                  <Label htmlFor="about_title_mr">शीर्षक</Label>
                  <Input
                    id="about_title_mr"
                    value={aboutContent.title_mr}
                    onChange={(e) =>
                      setAboutContent({ ...aboutContent, title_mr: e.target.value })
                    }
                    placeholder="मराठीत शीर्षक प्रविष्ट करा"
                    disabled={loading}
                  />
                </TabsContent>
              </Tabs>
            </div>

            {/* About Description */}
            <div className="space-y-4">
              <h3 className="font-semibold text-foreground">Description</h3>
              <Tabs defaultValue="en" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="en">English</TabsTrigger>
                  <TabsTrigger value="hi">हिंदी</TabsTrigger>
                  <TabsTrigger value="mr">मराठी</TabsTrigger>
                </TabsList>

                <TabsContent value="en" className="space-y-2 mt-4">
                  <Label htmlFor="about_desc_en">Description</Label>
                  <Textarea
                    id="about_desc_en"
                    value={aboutContent.description_en}
                    onChange={(e) =>
                      setAboutContent({ ...aboutContent, description_en: e.target.value })
                    }
                    placeholder="Enter about section description in English"
                    rows={6}
                    disabled={loading}
                  />
                </TabsContent>

                <TabsContent value="hi" className="space-y-2 mt-4">
                  <Label htmlFor="about_desc_hi">विवरण</Label>
                  <Textarea
                    id="about_desc_hi"
                    value={aboutContent.description_hi}
                    onChange={(e) =>
                      setAboutContent({ ...aboutContent, description_hi: e.target.value })
                    }
                    placeholder="हिंदी में विवरण दर्ज करें"
                    rows={6}
                    disabled={loading}
                  />
                </TabsContent>

                <TabsContent value="mr" className="space-y-2 mt-4">
                  <Label htmlFor="about_desc_mr">विवरण</Label>
                  <Textarea
                    id="about_desc_mr"
                    value={aboutContent.description_mr}
                    onChange={(e) =>
                      setAboutContent({ ...aboutContent, description_mr: e.target.value })
                    }
                    placeholder="मराठीत विवरण प्रविष्ट करा"
                    rows={6}
                    disabled={loading}
                  />
                </TabsContent>
              </Tabs>
            </div>

            <Button onClick={saveAboutSection} disabled={saving} className="w-full">
              {saving ? 'Saving...' : 'Save About Section'}
            </Button>
          </CardContent>
        </Card>
      )}

      {activeSection === 'blessing' && (
        <Card>
          <CardHeader>
            <CardTitle>Blessing Section</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Blessing Section Image */}
            <div className="space-y-4">
              <h3 className="font-semibold text-foreground">Background Image</h3>
              <ImageUpload
                onUpload={(mediaId) => {
                  setBlessingContent({ ...blessingContent, image_id: mediaId });
                }}
                existingImageUrl={blessingContent.existingImageUrl}
                onRemove={handleRemoveBlessingImage}
                section="blessing"
              />
            </div>

            {/* Blessing Title */}
            <div className="space-y-4">
              <h3 className="font-semibold text-foreground">Section Title</h3>
              <Tabs defaultValue="en" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="en">English</TabsTrigger>
                  <TabsTrigger value="hi">हिंदी</TabsTrigger>
                  <TabsTrigger value="mr">मराठी</TabsTrigger>
                </TabsList>

                <TabsContent value="en" className="space-y-2 mt-4">
                  <Label htmlFor="blessing_title_en">Title</Label>
                  <Input
                    id="blessing_title_en"
                    value={blessingContent.title_en}
                    onChange={(e) =>
                      setBlessingContent({ ...blessingContent, title_en: e.target.value })
                    }
                    placeholder="Enter blessing section title in English"
                    disabled={loading}
                  />
                </TabsContent>

                <TabsContent value="hi" className="space-y-2 mt-4">
                  <Label htmlFor="blessing_title_hi">शीर्षक</Label>
                  <Input
                    id="blessing_title_hi"
                    value={blessingContent.title_hi}
                    onChange={(e) =>
                      setBlessingContent({ ...blessingContent, title_hi: e.target.value })
                    }
                    placeholder="हिंदी में शीर्षक दर्ज करें"
                    disabled={loading}
                  />
                </TabsContent>

                <TabsContent value="mr" className="space-y-2 mt-4">
                  <Label htmlFor="blessing_title_mr">शीर्षक</Label>
                  <Input
                    id="blessing_title_mr"
                    value={blessingContent.title_mr}
                    onChange={(e) =>
                      setBlessingContent({ ...blessingContent, title_mr: e.target.value })
                    }
                    placeholder="मराठीत शीर्षक प्रविष्ट करा"
                    disabled={loading}
                  />
                </TabsContent>
              </Tabs>
            </div>

            {/* Blessing Content */}
            <div className="space-y-4">
              <h3 className="font-semibold text-foreground">Blessing Message</h3>
              <Tabs defaultValue="en" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="en">English</TabsTrigger>
                  <TabsTrigger value="hi">हिंदी</TabsTrigger>
                  <TabsTrigger value="mr">मराठी</TabsTrigger>
                </TabsList>

                <TabsContent value="en" className="space-y-2 mt-4">
                  <Label htmlFor="blessing_content_en">Message</Label>
                  <Textarea
                    id="blessing_content_en"
                    value={blessingContent.content_en}
                    onChange={(e) =>
                      setBlessingContent({ ...blessingContent, content_en: e.target.value })
                    }
                    placeholder="Enter blessing message in English"
                    rows={4}
                    disabled={loading}
                  />
                </TabsContent>

                <TabsContent value="hi" className="space-y-2 mt-4">
                  <Label htmlFor="blessing_content_hi">संदेश</Label>
                  <Textarea
                    id="blessing_content_hi"
                    value={blessingContent.content_hi}
                    onChange={(e) =>
                      setBlessingContent({ ...blessingContent, content_hi: e.target.value })
                    }
                    placeholder="हिंदी में संदेश दर्ज करें"
                    rows={4}
                    disabled={loading}
                  />
                </TabsContent>

                <TabsContent value="mr" className="space-y-2 mt-4">
                  <Label htmlFor="blessing_content_mr">संदेश</Label>
                  <Textarea
                    id="blessing_content_mr"
                    value={blessingContent.content_mr}
                    onChange={(e) =>
                      setBlessingContent({ ...blessingContent, content_mr: e.target.value })
                    }
                    placeholder="मराठीत संदेश प्रविष्ट करा"
                    rows={4}
                    disabled={loading}
                  />
                </TabsContent>
              </Tabs>
            </div>

            <Button onClick={saveBlessing} disabled={saving} className="w-full">
              {saving ? 'Saving...' : 'Save Blessing Section'}
            </Button>
          </CardContent>
        </Card>
      )}

      {activeSection === 'history' && (
        <Card>
          <CardHeader>
            <CardTitle>History Section</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* History Title */}
            <div className="space-y-4">
              <h3 className="font-semibold text-foreground">Section Title</h3>
              <Tabs defaultValue="en" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="en">English</TabsTrigger>
                  <TabsTrigger value="hi">हिंदी</TabsTrigger>
                  <TabsTrigger value="mr">मराठी</TabsTrigger>
                </TabsList>

                <TabsContent value="en" className="space-y-2 mt-4">
                  <Label htmlFor="history_title_en">Title</Label>
                  <Input
                    id="history_title_en"
                    value={historyContent.title_en}
                    onChange={(e) =>
                      setHistoryContent({ ...historyContent, title_en: e.target.value })
                    }
                    placeholder="Enter history section title in English"
                    disabled={loading}
                  />
                </TabsContent>

                <TabsContent value="hi" className="space-y-2 mt-4">
                  <Label htmlFor="history_title_hi">शीर्षक</Label>
                  <Input
                    id="history_title_hi"
                    value={historyContent.title_hi}
                    onChange={(e) =>
                      setHistoryContent({ ...historyContent, title_hi: e.target.value })
                    }
                    placeholder="हिंदी में शीर्षक दर्ज करें"
                    disabled={loading}
                  />
                </TabsContent>

                <TabsContent value="mr" className="space-y-2 mt-4">
                  <Label htmlFor="history_title_mr">शीर्षक</Label>
                  <Input
                    id="history_title_mr"
                    value={historyContent.title_mr}
                    onChange={(e) =>
                      setHistoryContent({ ...historyContent, title_mr: e.target.value })
                    }
                    placeholder="मराठीत शीर्षक प्रविष्ट करा"
                    disabled={loading}
                  />
                </TabsContent>
              </Tabs>
            </div>

            {/* History Description */}
            <div className="space-y-4">
              <h3 className="font-semibold text-foreground">Description</h3>
              <Tabs defaultValue="en" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="en">English</TabsTrigger>
                  <TabsTrigger value="hi">हिंदी</TabsTrigger>
                  <TabsTrigger value="mr">मराठी</TabsTrigger>
                </TabsList>

                <TabsContent value="en" className="space-y-2 mt-4">
                  <Label htmlFor="history_desc_en">Description</Label>
                  <Textarea
                    id="history_desc_en"
                    value={historyContent.description_en}
                    onChange={(e) =>
                      setHistoryContent({ ...historyContent, description_en: e.target.value })
                    }
                    placeholder="Enter history section description in English"
                    rows={4}
                    disabled={loading}
                  />
                </TabsContent>

                <TabsContent value="hi" className="space-y-2 mt-4">
                  <Label htmlFor="history_desc_hi">विवरण</Label>
                  <Textarea
                    id="history_desc_hi"
                    value={historyContent.description_hi}
                    onChange={(e) =>
                      setHistoryContent({ ...historyContent, description_hi: e.target.value })
                    }
                    placeholder="हिंदी में विवरण दर्ज करें"
                    rows={4}
                    disabled={loading}
                  />
                </TabsContent>

                <TabsContent value="mr" className="space-y-2 mt-4">
                  <Label htmlFor="history_desc_mr">विवरण</Label>
                  <Textarea
                    id="history_desc_mr"
                    value={historyContent.description_mr}
                    onChange={(e) =>
                      setHistoryContent({ ...historyContent, description_mr: e.target.value })
                    }
                    placeholder="मराठीत विवरण प्रविष्ट करा"
                    rows={4}
                    disabled={loading}
                  />
                </TabsContent>
              </Tabs>
            </div>

            {/* Card 1 */}
            <div className="border-t pt-6">
              <h3 className="font-semibold text-foreground mb-4">Card 1</h3>

              <div className="space-y-4 mb-6">
                <h4 className="text-sm font-medium text-foreground">Title</h4>
                <Tabs defaultValue="en" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="en">English</TabsTrigger>
                    <TabsTrigger value="hi">हिंदी</TabsTrigger>
                    <TabsTrigger value="mr">मराठी</TabsTrigger>
                  </TabsList>

                  <TabsContent value="en" className="space-y-2 mt-4">
                    <Input
                      value={historyContent.card1_title_en}
                      onChange={(e) =>
                        setHistoryContent({ ...historyContent, card1_title_en: e.target.value })
                      }
                      placeholder="Enter card title in English"
                      disabled={loading}
                    />
                  </TabsContent>

                  <TabsContent value="hi" className="space-y-2 mt-4">
                    <Input
                      value={historyContent.card1_title_hi}
                      onChange={(e) =>
                        setHistoryContent({ ...historyContent, card1_title_hi: e.target.value })
                      }
                      placeholder="हिंदी में शीर्षक दर्ज करें"
                      disabled={loading}
                    />
                  </TabsContent>

                  <TabsContent value="mr" className="space-y-2 mt-4">
                    <Input
                      value={historyContent.card1_title_mr}
                      onChange={(e) =>
                        setHistoryContent({ ...historyContent, card1_title_mr: e.target.value })
                      }
                      placeholder="मराठीत शीर्षक प्रविष्ट करा"
                      disabled={loading}
                    />
                  </TabsContent>
                </Tabs>
              </div>

              <div className="space-y-4">
                <h4 className="text-sm font-medium text-foreground">Description</h4>
                <Tabs defaultValue="en" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="en">English</TabsTrigger>
                    <TabsTrigger value="hi">हिंदी</TabsTrigger>
                    <TabsTrigger value="mr">मराठी</TabsTrigger>
                  </TabsList>

                  <TabsContent value="en" className="space-y-2 mt-4">
                    <Textarea
                      value={historyContent.card1_description_en}
                      onChange={(e) =>
                        setHistoryContent({ ...historyContent, card1_description_en: e.target.value })
                      }
                      placeholder="Enter card description in English"
                      rows={3}
                      disabled={loading}
                    />
                  </TabsContent>

                  <TabsContent value="hi" className="space-y-2 mt-4">
                    <Textarea
                      value={historyContent.card1_description_hi}
                      onChange={(e) =>
                        setHistoryContent({ ...historyContent, card1_description_hi: e.target.value })
                      }
                      placeholder="हिंदी में विवरण दर्ज करें"
                      rows={3}
                      disabled={loading}
                    />
                  </TabsContent>

                  <TabsContent value="mr" className="space-y-2 mt-4">
                    <Textarea
                      value={historyContent.card1_description_mr}
                      onChange={(e) =>
                        setHistoryContent({ ...historyContent, card1_description_mr: e.target.value })
                      }
                      placeholder="मराठीत विवरण प्रविष्ट करा"
                      rows={3}
                      disabled={loading}
                    />
                  </TabsContent>
                </Tabs>
              </div>
            </div>

            {/* Card 2 */}
            <div className="border-t pt-6">
              <h3 className="font-semibold text-foreground mb-4">Card 2</h3>

              <div className="space-y-4 mb-6">
                <h4 className="text-sm font-medium text-foreground">Title</h4>
                <Tabs defaultValue="en" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="en">English</TabsTrigger>
                    <TabsTrigger value="hi">हिंदी</TabsTrigger>
                    <TabsTrigger value="mr">मराठी</TabsTrigger>
                  </TabsList>

                  <TabsContent value="en" className="space-y-2 mt-4">
                    <Input
                      value={historyContent.card2_title_en}
                      onChange={(e) =>
                        setHistoryContent({ ...historyContent, card2_title_en: e.target.value })
                      }
                      placeholder="Enter card title in English"
                      disabled={loading}
                    />
                  </TabsContent>

                  <TabsContent value="hi" className="space-y-2 mt-4">
                    <Input
                      value={historyContent.card2_title_hi}
                      onChange={(e) =>
                        setHistoryContent({ ...historyContent, card2_title_hi: e.target.value })
                      }
                      placeholder="हिंदी में शीर्षक दर्ज करें"
                      disabled={loading}
                    />
                  </TabsContent>

                  <TabsContent value="mr" className="space-y-2 mt-4">
                    <Input
                      value={historyContent.card2_title_mr}
                      onChange={(e) =>
                        setHistoryContent({ ...historyContent, card2_title_mr: e.target.value })
                      }
                      placeholder="मराठीत शीर्षक प्रविष्ट करा"
                      disabled={loading}
                    />
                  </TabsContent>
                </Tabs>
              </div>

              <div className="space-y-4">
                <h4 className="text-sm font-medium text-foreground">Description</h4>
                <Tabs defaultValue="en" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="en">English</TabsTrigger>
                    <TabsTrigger value="hi">हिंदी</TabsTrigger>
                    <TabsTrigger value="mr">मराठी</TabsTrigger>
                  </TabsList>

                  <TabsContent value="en" className="space-y-2 mt-4">
                    <Textarea
                      value={historyContent.card2_description_en}
                      onChange={(e) =>
                        setHistoryContent({ ...historyContent, card2_description_en: e.target.value })
                      }
                      placeholder="Enter card description in English"
                      rows={3}
                      disabled={loading}
                    />
                  </TabsContent>

                  <TabsContent value="hi" className="space-y-2 mt-4">
                    <Textarea
                      value={historyContent.card2_description_hi}
                      onChange={(e) =>
                        setHistoryContent({ ...historyContent, card2_description_hi: e.target.value })
                      }
                      placeholder="हिंदी में विवरण दर्ज करें"
                      rows={3}
                      disabled={loading}
                    />
                  </TabsContent>

                  <TabsContent value="mr" className="space-y-2 mt-4">
                    <Textarea
                      value={historyContent.card2_description_mr}
                      onChange={(e) =>
                        setHistoryContent({ ...historyContent, card2_description_mr: e.target.value })
                      }
                      placeholder="मराठीत विवरण प्रविष्ट करा"
                      rows={3}
                      disabled={loading}
                    />
                  </TabsContent>
                </Tabs>
              </div>
            </div>

            {/* Card 3 */}
            <div className="border-t pt-6">
              <h3 className="font-semibold text-foreground mb-4">Card 3</h3>

              <div className="space-y-4 mb-6">
                <h4 className="text-sm font-medium text-foreground">Title</h4>
                <Tabs defaultValue="en" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="en">English</TabsTrigger>
                    <TabsTrigger value="hi">हिंदी</TabsTrigger>
                    <TabsTrigger value="mr">मराठी</TabsTrigger>
                  </TabsList>

                  <TabsContent value="en" className="space-y-2 mt-4">
                    <Input
                      value={historyContent.card3_title_en}
                      onChange={(e) =>
                        setHistoryContent({ ...historyContent, card3_title_en: e.target.value })
                      }
                      placeholder="Enter card title in English"
                      disabled={loading}
                    />
                  </TabsContent>

                  <TabsContent value="hi" className="space-y-2 mt-4">
                    <Input
                      value={historyContent.card3_title_hi}
                      onChange={(e) =>
                        setHistoryContent({ ...historyContent, card3_title_hi: e.target.value })
                      }
                      placeholder="हिंदी में शीर्षक दर्ज करें"
                      disabled={loading}
                    />
                  </TabsContent>

                  <TabsContent value="mr" className="space-y-2 mt-4">
                    <Input
                      value={historyContent.card3_title_mr}
                      onChange={(e) =>
                        setHistoryContent({ ...historyContent, card3_title_mr: e.target.value })
                      }
                      placeholder="मराठीत शीर्षक प्रविष्ट करा"
                      disabled={loading}
                    />
                  </TabsContent>
                </Tabs>
              </div>

              <div className="space-y-4">
                <h4 className="text-sm font-medium text-foreground">Description</h4>
                <Tabs defaultValue="en" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="en">English</TabsTrigger>
                    <TabsTrigger value="hi">हिंदी</TabsTrigger>
                    <TabsTrigger value="mr">मराठी</TabsTrigger>
                  </TabsList>

                  <TabsContent value="en" className="space-y-2 mt-4">
                    <Textarea
                      value={historyContent.card3_description_en}
                      onChange={(e) =>
                        setHistoryContent({ ...historyContent, card3_description_en: e.target.value })
                      }
                      placeholder="Enter card description in English"
                      rows={3}
                      disabled={loading}
                    />
                  </TabsContent>

                  <TabsContent value="hi" className="space-y-2 mt-4">
                    <Textarea
                      value={historyContent.card3_description_hi}
                      onChange={(e) =>
                        setHistoryContent({ ...historyContent, card3_description_hi: e.target.value })
                      }
                      placeholder="हिंदी में विवरण दर्ज करें"
                      rows={3}
                      disabled={loading}
                    />
                  </TabsContent>

                  <TabsContent value="mr" className="space-y-2 mt-4">
                    <Textarea
                      value={historyContent.card3_description_mr}
                      onChange={(e) =>
                        setHistoryContent({ ...historyContent, card3_description_mr: e.target.value })
                      }
                      placeholder="मराठीत विवरण प्रविष्ट करा"
                      rows={3}
                      disabled={loading}
                    />
                  </TabsContent>
                </Tabs>
              </div>
            </div>

            <Button onClick={saveHistory} disabled={saving} className="w-full">
              {saving ? 'Saving...' : 'Save History Section'}
            </Button>
          </CardContent>
        </Card>
      )}

      {activeSection === 'events' && (
        <Card>
          <CardHeader>
            <CardTitle>Events Section</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Events Title */}
            <div className="space-y-4">
              <h3 className="font-semibold text-foreground">Section Title</h3>
              <Tabs defaultValue="en" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="en">English</TabsTrigger>
                  <TabsTrigger value="hi">हिंदी</TabsTrigger>
                  <TabsTrigger value="mr">मराठी</TabsTrigger>
                </TabsList>

                <TabsContent value="en" className="space-y-2 mt-4">
                  <Label htmlFor="events_title_en">Title</Label>
                  <Input
                    id="events_title_en"
                    value={eventsContent.title_en}
                    onChange={(e) =>
                      setEventsContent({ ...eventsContent, title_en: e.target.value })
                    }
                    placeholder="Enter events section title in English"
                    disabled={loading}
                  />
                </TabsContent>

                <TabsContent value="hi" className="space-y-2 mt-4">
                  <Label htmlFor="events_title_hi">शीर्षक</Label>
                  <Input
                    id="events_title_hi"
                    value={eventsContent.title_hi}
                    onChange={(e) =>
                      setEventsContent({ ...eventsContent, title_hi: e.target.value })
                    }
                    placeholder="हिंदी में शीर्षक दर्ज करें"
                    disabled={loading}
                  />
                </TabsContent>

                <TabsContent value="mr" className="space-y-2 mt-4">
                  <Label htmlFor="events_title_mr">शीर्षक</Label>
                  <Input
                    id="events_title_mr"
                    value={eventsContent.title_mr}
                    onChange={(e) =>
                      setEventsContent({ ...eventsContent, title_mr: e.target.value })
                    }
                    placeholder="मराठीत शीर्षक प्रविष्ट करा"
                    disabled={loading}
                  />
                </TabsContent>
              </Tabs>
            </div>

            {/* Events Description */}
            <div className="space-y-4">
              <h3 className="font-semibold text-foreground">Description</h3>
              <Tabs defaultValue="en" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="en">English</TabsTrigger>
                  <TabsTrigger value="hi">हिंदी</TabsTrigger>
                  <TabsTrigger value="mr">मराठी</TabsTrigger>
                </TabsList>

                <TabsContent value="en" className="space-y-2 mt-4">
                  <Label htmlFor="events_desc_en">Description</Label>
                  <Textarea
                    id="events_desc_en"
                    value={eventsContent.description_en}
                    onChange={(e) =>
                      setEventsContent({ ...eventsContent, description_en: e.target.value })
                    }
                    placeholder="Enter events section description in English"
                    rows={4}
                    disabled={loading}
                  />
                </TabsContent>

                <TabsContent value="hi" className="space-y-2 mt-4">
                  <Label htmlFor="events_desc_hi">विवरण</Label>
                  <Textarea
                    id="events_desc_hi"
                    value={eventsContent.description_hi}
                    onChange={(e) =>
                      setEventsContent({ ...eventsContent, description_hi: e.target.value })
                    }
                    placeholder="हिंदी में विवरण दर्ज करें"
                    rows={4}
                    disabled={loading}
                  />
                </TabsContent>

                <TabsContent value="mr" className="space-y-2 mt-4">
                  <Label htmlFor="events_desc_mr">विवरण</Label>
                  <Textarea
                    id="events_desc_mr"
                    value={eventsContent.description_mr}
                    onChange={(e) =>
                      setEventsContent({ ...eventsContent, description_mr: e.target.value })
                    }
                    placeholder="मराठीत विवरण प्रविष्ट करा"
                    rows={4}
                    disabled={loading}
                  />
                </TabsContent>
              </Tabs>
            </div>

            <Button onClick={saveEvents} disabled={saving} className="w-full">
              {saving ? 'Saving...' : 'Save Events Section'}
            </Button>
          </CardContent>
        </Card>
      )}

      {activeSection === 'visit' && (
        <Card>
          <CardHeader>
            <CardTitle>Visit Section</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Darshan Morning Start */}
            <div className="space-y-2">
              <Label htmlFor="darshan_morning_start">Morning Darshan - Start Time</Label>
              <input
                id="darshan_morning_start"
                type="time"
                value={convertTo24Hour(visitContent.darshan_morning_start_en)}
                onChange={(e) =>
                  setVisitContent({
                    ...visitContent,
                    darshan_morning_start_en: convertTo12Hour(e.target.value),
                    darshan_morning_start_hi: convertTo12Hour(e.target.value),
                    darshan_morning_start_mr: convertTo12Hour(e.target.value),
                  })
                }
                disabled={loading}
                className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground disabled:opacity-50"
              />
              <p className="text-xs text-muted-foreground">Selected: {visitContent.darshan_morning_start_en || '—'}</p>
            </div>

            {/* Darshan Morning End */}
            <div className="space-y-2">
              <Label htmlFor="darshan_morning_end">Morning Darshan - End Time</Label>
              <input
                id="darshan_morning_end"
                type="time"
                value={convertTo24Hour(visitContent.darshan_morning_end_en)}
                onChange={(e) =>
                  setVisitContent({
                    ...visitContent,
                    darshan_morning_end_en: convertTo12Hour(e.target.value),
                    darshan_morning_end_hi: convertTo12Hour(e.target.value),
                    darshan_morning_end_mr: convertTo12Hour(e.target.value),
                  })
                }
                disabled={loading}
                className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground disabled:opacity-50"
              />
              <p className="text-xs text-muted-foreground">Selected: {visitContent.darshan_morning_end_en || '—'}</p>
            </div>

            {/* Darshan Evening Start */}
            <div className="space-y-2">
              <Label htmlFor="darshan_evening_start">Evening Darshan - Start Time</Label>
              <input
                id="darshan_evening_start"
                type="time"
                value={convertTo24Hour(visitContent.darshan_evening_start_en)}
                onChange={(e) =>
                  setVisitContent({
                    ...visitContent,
                    darshan_evening_start_en: convertTo12Hour(e.target.value),
                    darshan_evening_start_hi: convertTo12Hour(e.target.value),
                    darshan_evening_start_mr: convertTo12Hour(e.target.value),
                  })
                }
                disabled={loading}
                className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground disabled:opacity-50"
              />
              <p className="text-xs text-muted-foreground">Selected: {visitContent.darshan_evening_start_en || '—'}</p>
            </div>

            {/* Darshan Evening End */}
            <div className="space-y-2">
              <Label htmlFor="darshan_evening_end">Evening Darshan - End Time</Label>
              <input
                id="darshan_evening_end"
                type="time"
                value={convertTo24Hour(visitContent.darshan_evening_end_en)}
                onChange={(e) =>
                  setVisitContent({
                    ...visitContent,
                    darshan_evening_end_en: convertTo12Hour(e.target.value),
                    darshan_evening_end_hi: convertTo12Hour(e.target.value),
                    darshan_evening_end_mr: convertTo12Hour(e.target.value),
                  })
                }
                disabled={loading}
                className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground disabled:opacity-50"
              />
              <p className="text-xs text-muted-foreground">Selected: {visitContent.darshan_evening_end_en || '—'}</p>
            </div>

            {/* Temple Name */}
            <div className="space-y-4">
              <h3 className="font-semibold text-foreground">Temple Name</h3>
              <Tabs defaultValue="en" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="en">English</TabsTrigger>
                  <TabsTrigger value="hi">हिंदी</TabsTrigger>
                  <TabsTrigger value="mr">मराठी</TabsTrigger>
                </TabsList>

                <TabsContent value="en" className="space-y-2 mt-4">
                  <Input
                    value={visitContent.temple_name_en}
                    onChange={(e) =>
                      setVisitContent({ ...visitContent, temple_name_en: e.target.value })
                    }
                    placeholder="Temple name"
                    disabled={loading}
                  />
                </TabsContent>

                <TabsContent value="hi" className="space-y-2 mt-4">
                  <Input
                    value={visitContent.temple_name_hi}
                    onChange={(e) =>
                      setVisitContent({ ...visitContent, temple_name_hi: e.target.value })
                    }
                    placeholder="मंदिर का नाम"
                    disabled={loading}
                  />
                </TabsContent>

                <TabsContent value="mr" className="space-y-2 mt-4">
                  <Input
                    value={visitContent.temple_name_mr}
                    onChange={(e) =>
                      setVisitContent({ ...visitContent, temple_name_mr: e.target.value })
                    }
                    placeholder="मंदिराचे नाव"
                    disabled={loading}
                  />
                </TabsContent>
              </Tabs>
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                value={visitContent.phone_en}
                onChange={(e) =>
                  setVisitContent({
                    ...visitContent,
                    phone_en: e.target.value,
                    phone_hi: e.target.value,
                    phone_mr: e.target.value,
                  })
                }
                placeholder="+91 (555) 123-4567"
                disabled={loading}
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                value={visitContent.email_en}
                onChange={(e) =>
                  setVisitContent({
                    ...visitContent,
                    email_en: e.target.value,
                    email_hi: e.target.value,
                    email_mr: e.target.value,
                  })
                }
                placeholder="contact@temple.com"
                disabled={loading}
              />
            </div>

            {/* Address */}
            <div className="space-y-4">
              <h3 className="font-semibold text-foreground">Address</h3>
              <Tabs defaultValue="en" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="en">English</TabsTrigger>
                  <TabsTrigger value="hi">हिंदी</TabsTrigger>
                  <TabsTrigger value="mr">मराठी</TabsTrigger>
                </TabsList>

                <TabsContent value="en" className="space-y-2 mt-4">
                  <Textarea
                    value={visitContent.address_en}
                    onChange={(e) =>
                      setVisitContent({ ...visitContent, address_en: e.target.value })
                    }
                    placeholder="Full address"
                    rows={2}
                    disabled={loading}
                  />
                </TabsContent>

                <TabsContent value="hi" className="space-y-2 mt-4">
                  <Textarea
                    value={visitContent.address_hi}
                    onChange={(e) =>
                      setVisitContent({ ...visitContent, address_hi: e.target.value })
                    }
                    placeholder="पूरा पता"
                    rows={2}
                    disabled={loading}
                  />
                </TabsContent>

                <TabsContent value="mr" className="space-y-2 mt-4">
                  <Textarea
                    value={visitContent.address_mr}
                    onChange={(e) =>
                      setVisitContent({ ...visitContent, address_mr: e.target.value })
                    }
                    placeholder="पूर्ण पता"
                    rows={2}
                    disabled={loading}
                  />
                </TabsContent>
              </Tabs>
            </div>

            {/* Latitude */}
            <div className="space-y-2">
              <Label htmlFor="latitude">Latitude</Label>
              <Input
                id="latitude"
                value={visitContent.latitude_en}
                onChange={(e) =>
                  setVisitContent({
                    ...visitContent,
                    latitude_en: e.target.value,
                    latitude_hi: e.target.value,
                    latitude_mr: e.target.value,
                  })
                }
                placeholder="28.6139"
                disabled={loading}
              />
            </div>

            {/* Longitude */}
            <div className="space-y-2">
              <Label htmlFor="longitude">Longitude</Label>
              <Input
                id="longitude"
                value={visitContent.longitude_en}
                onChange={(e) =>
                  setVisitContent({
                    ...visitContent,
                    longitude_en: e.target.value,
                    longitude_hi: e.target.value,
                    longitude_mr: e.target.value,
                  })
                }
                placeholder="77.2090"
                disabled={loading}
              />
            </div>

            {/* Background Image */}
            <div className="space-y-4">
              <h3 className="font-semibold text-foreground">Background Image</h3>
              <ImageUpload
                onUpload={(mediaId: number) =>
                  setVisitContent({
                    ...visitContent,
                    image_id: String(mediaId),
                  })
                }
                existingImageUrl={visitContent.existingImageUrl}
                section="visit-section"
              />
            </div>

            <Button onClick={saveVisit} disabled={saving} className="w-full">
              {saving ? 'Saving...' : 'Save Visit Section'}
            </Button>
          </CardContent>
        </Card>
      )}

      {activeSection === 'footer' && (
        <Card>
          <CardHeader>
            <CardTitle>Footer Section</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Footer Title */}
            <div className="space-y-4">
              <h3 className="font-semibold text-foreground">Footer Title</h3>
              <Tabs defaultValue="en" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="en">English</TabsTrigger>
                  <TabsTrigger value="hi">हिंदी</TabsTrigger>
                  <TabsTrigger value="mr">मराठी</TabsTrigger>
                </TabsList>

                <TabsContent value="en" className="space-y-2 mt-4">
                  <Input
                    value={footerContent.title_en}
                    onChange={(e) =>
                      setFooterContent({ ...footerContent, title_en: e.target.value })
                    }
                    placeholder="Follow Devotion"
                    disabled={loading}
                  />
                </TabsContent>

                <TabsContent value="hi" className="space-y-2 mt-4">
                  <Input
                    value={footerContent.title_hi}
                    onChange={(e) =>
                      setFooterContent({ ...footerContent, title_hi: e.target.value })
                    }
                    placeholder="भक्ति का अनुसरण करें"
                    disabled={loading}
                  />
                </TabsContent>

                <TabsContent value="mr" className="space-y-2 mt-4">
                  <Input
                    value={footerContent.title_mr}
                    onChange={(e) =>
                      setFooterContent({ ...footerContent, title_mr: e.target.value })
                    }
                    placeholder="भक्तीचे अनुसरण करा"
                    disabled={loading}
                  />
                </TabsContent>
              </Tabs>
            </div>

            {/* Social Section Label */}
            <div className="space-y-4">
              <h3 className="font-semibold text-foreground">Social Section Label</h3>
              <Tabs defaultValue="en" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="en">English</TabsTrigger>
                  <TabsTrigger value="hi">हिंदी</TabsTrigger>
                  <TabsTrigger value="mr">मराठी</TabsTrigger>
                </TabsList>

                <TabsContent value="en" className="space-y-2 mt-4">
                  <Input
                    value={footerContent.social_label_en}
                    onChange={(e) =>
                      setFooterContent({ ...footerContent, social_label_en: e.target.value })
                    }
                    placeholder="Follow Us"
                    disabled={loading}
                  />
                </TabsContent>

                <TabsContent value="hi" className="space-y-2 mt-4">
                  <Input
                    value={footerContent.social_label_hi}
                    onChange={(e) =>
                      setFooterContent({ ...footerContent, social_label_hi: e.target.value })
                    }
                    placeholder="हमें फॉलो करें"
                    disabled={loading}
                  />
                </TabsContent>

                <TabsContent value="mr" className="space-y-2 mt-4">
                  <Input
                    value={footerContent.social_label_mr}
                    onChange={(e) =>
                      setFooterContent({ ...footerContent, social_label_mr: e.target.value })
                    }
                    placeholder="आमचे फॉलो करा"
                    disabled={loading}
                  />
                </TabsContent>
              </Tabs>
            </div>

            {/* Facebook Link */}
            <div className="space-y-2">
              <Label htmlFor="facebook_link">Facebook Link</Label>
              <Input
                id="facebook_link"
                value={footerContent.facebook_link_en}
                onChange={(e) =>
                  setFooterContent({
                    ...footerContent,
                    facebook_link_en: e.target.value,
                    facebook_link_hi: e.target.value,
                    facebook_link_mr: e.target.value,
                  })
                }
                placeholder="https://www.facebook.com/aaryadurgatemple"
                disabled={loading}
              />
            </div>

            {/* YouTube Link */}
            <div className="space-y-2">
              <Label htmlFor="youtube_link">YouTube Link</Label>
              <Input
                id="youtube_link"
                value={footerContent.youtube_link_en}
                onChange={(e) =>
                  setFooterContent({
                    ...footerContent,
                    youtube_link_en: e.target.value,
                    youtube_link_hi: e.target.value,
                    youtube_link_mr: e.target.value,
                  })
                }
                placeholder="https://www.youtube.com/@aaryadurgatemple"
                disabled={loading}
              />
            </div>

            {/* Copyright Text */}
            <div className="space-y-4">
              <h3 className="font-semibold text-foreground">Copyright Text</h3>
              <Tabs defaultValue="en" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="en">English</TabsTrigger>
                  <TabsTrigger value="hi">हिंदी</TabsTrigger>
                  <TabsTrigger value="mr">मराठी</TabsTrigger>
                </TabsList>

                <TabsContent value="en" className="space-y-2 mt-4">
                  <Textarea
                    value={footerContent.copyright_en}
                    onChange={(e) =>
                      setFooterContent({ ...footerContent, copyright_en: e.target.value })
                    }
                    placeholder="© Aarya Durga Temple, Wagde, Kankavli. All rights reserved."
                    disabled={loading}
                    rows={2}
                  />
                </TabsContent>

                <TabsContent value="hi" className="space-y-2 mt-4">
                  <Textarea
                    value={footerContent.copyright_hi}
                    onChange={(e) =>
                      setFooterContent({ ...footerContent, copyright_hi: e.target.value })
                    }
                    placeholder="© आर्य दुर्गा मंदिर, वाघडे, कांकवली। सर्वाधिकार सुरक्षित।"
                    disabled={loading}
                    rows={2}
                  />
                </TabsContent>

                <TabsContent value="mr" className="space-y-2 mt-4">
                  <Textarea
                    value={footerContent.copyright_mr}
                    onChange={(e) =>
                      setFooterContent({ ...footerContent, copyright_mr: e.target.value })
                    }
                    placeholder="© आर्य दुर्गा मंदिर, वाघडे, कांकवली. सर्व हक्क राखीव."
                    disabled={loading}
                    rows={2}
                  />
                </TabsContent>
              </Tabs>
            </div>

            <Button onClick={saveFooter} disabled={saving} className="w-full">
              {saving ? 'Saving...' : 'Save Footer Section'}
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default HomePageEditor;
