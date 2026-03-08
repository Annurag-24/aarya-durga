import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RichTextEditor } from '@/components/admin/RichTextEditor';
import { toast } from 'sonner';
import client from '@/api/client';

const PageContentEditor = () => {
  const [activeSection, setActiveSection] = useState('about_title');
  const [content, setContent] = useState<Record<string, string>>({
    en: '',
    hi: '',
    mr: '',
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const sections = [
    { label: 'About - Title', key: 'about_title' },
    { label: 'About - Paragraph 1', key: 'about_p1' },
    { label: 'About - Paragraph 2', key: 'about_p2' },
    { label: 'Blessing Banner - Title', key: 'blessing_title' },
    { label: 'Blessing Banner - Content', key: 'blessing_content' },
    { label: 'Hero - Subtitle', key: 'hero_subtitle' },
    { label: 'Visit - Heading', key: 'visit_heading' },
  ];

  const loadContent = async (sectionKey: string) => {
    setLoading(true);
    try {
      const response = await client.get(`/public/page-content/home/${sectionKey}`);
      const newContent: Record<string, string> = { en: '', hi: '', mr: '' };

      if (Array.isArray(response.data)) {
        response.data.forEach((item: any) => {
          newContent[item.language] = item.content;
        });
      } else if (response.data?.content) {
        newContent[response.data.language] = response.data.content;
      }

      setContent(newContent);
    } catch (error) {
      setContent({ en: '', hi: '', mr: '' });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (language: 'en' | 'hi' | 'mr') => {
    setSaving(true);
    try {
      await client.put(`/admin/page-content/home/${activeSection}`, {
        page_key: 'home',
        section_key: activeSection,
        language,
        content: content[language],
      });
      toast.success('Content saved successfully');
    } catch (error) {
      toast.error('Failed to save content');
    } finally {
      setSaving(false);
    }
  };

  const handleSectionChange = (sectionKey: string) => {
    setActiveSection(sectionKey);
    loadContent(sectionKey);
  };

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h1 className="font-heading text-3xl font-bold text-foreground">Page Content Editor</h1>
        <p className="text-muted-foreground mt-1">Manage home page text content in multiple languages</p>
      </div>

      <div className="grid md:grid-cols-4 gap-4">
        {sections.map((section) => (
          <Button
            key={section.key}
            variant={activeSection === section.key ? 'default' : 'outline'}
            onClick={() => handleSectionChange(section.key)}
            className="justify-start text-left"
          >
            {section.label}
          </Button>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Content for: {sections.find((s) => s.key === activeSection)?.label}</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="en" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="en">English</TabsTrigger>
              <TabsTrigger value="hi">हिंदी</TabsTrigger>
              <TabsTrigger value="mr">मराठी</TabsTrigger>
            </TabsList>

            {(['en', 'hi', 'mr'] as const).map((lang) => (
              <TabsContent key={lang} value={lang} className="space-y-4">
                <div>
                  <Label htmlFor={`content_${lang}`}>Content</Label>
                  <Textarea
                    id={`content_${lang}`}
                    value={content[lang]}
                    onChange={(e) => setContent({ ...content, [lang]: e.target.value })}
                    placeholder="Enter content..."
                    rows={6}
                    disabled={loading}
                  />
                  <p className="text-xs text-muted-foreground mt-2">
                    {content[lang].length} characters
                  </p>
                </div>
                <Button
                  onClick={() => handleSave(lang)}
                  disabled={saving || loading}
                  className="w-full"
                >
                  Save {lang.toUpperCase()} Content
                </Button>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>

      <Card className="border-blue-200 bg-blue-50">
        <CardHeader>
          <CardTitle className="text-sm">Available Sections</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground space-y-2">
          <p>✓ <strong>About Section</strong> - Edit temple description</p>
          <p>✓ <strong>Blessing Banner</strong> - Edit blessing message</p>
          <p>✓ <strong>Hero Section</strong> - Edit hero subtitle</p>
          <p>✓ <strong>Visit Section</strong> - Edit visit information heading</p>
          <p className="text-xs mt-4 italic">More sections can be added based on your needs</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default PageContentEditor;
