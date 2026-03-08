import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LanguageTabForm } from '@/components/admin/LanguageTabForm';
import { toast } from 'sonner';
import { useQuote, useCreateQuote, useUpdateQuote } from '@/hooks/content/useQuotes';
import type { Quote } from '@/api/quotes';

export const QuoteForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { data: item } = useQuote(id ? parseInt(id) : 0);
  const create = useCreateQuote();
  const update = useUpdateQuote();

  const [formData, setFormData] = useState<Partial<Quote>>({
    quote_en: '',
    quote_hi: '',
    quote_mr: '',
    placement: 'home_blessing',
    is_active: true,
    sort_order: 0,
  });

  useEffect(() => {
    if (item) setFormData(item);
  }, [item]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (id) {
        await update.mutateAsync({ id: parseInt(id), data: formData });
        toast.success('Quote updated');
      } else {
        await create.mutateAsync(formData);
        toast.success('Quote created');
      }
      navigate('/admin/quotes');
    } catch {
      toast.error('Failed to save');
    }
  };

  return (
    <div className="max-w-3xl space-y-6">
      <h1 className="font-heading text-3xl font-bold">{id ? 'Edit Quote' : 'Create Quote'}</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Quotes</CardTitle>
          </CardHeader>
          <CardContent>
            <LanguageTabForm>
              {(lang) => (
                <Textarea
                  value={formData[`quote_${lang}` as keyof Quote] || ''}
                  onChange={(e) => setFormData({ ...formData, [`quote_${lang}`]: e.target.value })}
                  rows={3}
                  required
                />
              )}
            </LanguageTabForm>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Placement & Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="placement">Placement</Label>
              <Select value={formData.placement || ''} onValueChange={(v) => setFormData({ ...formData, placement: v })}>
                <SelectTrigger id="placement">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="home_blessing">Home - Blessing</SelectItem>
                  <SelectItem value="home_motivation">Home - Motivation</SelectItem>
                  <SelectItem value="about_intro">About - Intro</SelectItem>
                  <SelectItem value="events_header">Events - Header</SelectItem>
                  <SelectItem value="gallery_intro">Gallery - Intro</SelectItem>
                  <SelectItem value="footer">Footer</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-3">
              <Switch checked={formData.is_active || false} onCheckedChange={(c) => setFormData({ ...formData, is_active: c })} />
              <Label>{formData.is_active ? 'Published' : 'Draft'}</Label>
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-3">
          <Button type="submit" disabled={create.isPending || update.isPending}>
            {id ? 'Update' : 'Create'}
          </Button>
          <Button type="button" variant="outline" onClick={() => navigate('/admin/quotes')}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
};
