import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { DataTable, Column } from '@/components/admin/DataTable';
import { useQuotes, useDeleteQuote } from '@/hooks/content/useQuotes';
import type { Quote } from '@/api/quotes';

export const QuotesList = () => {
  const navigate = useNavigate();
  const { data = [], isLoading } = useQuotes();
  const deleteItem = useDeleteQuote();

  const columns: Column<Quote>[] = [
    { header: 'Quote (EN)', accessor: 'quote_en', width: '50%' },
    { header: 'Placement', accessor: 'placement', width: '25%' },
    {
      header: 'Actions',
      accessor: 'id',
      render: (_, item) => (
        <Button size="sm" variant="ghost" onClick={() => deleteItem.mutate(item.id)}>
          Delete
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-3xl font-bold">Quotes</h1>
          <p className="text-muted-foreground mt-1">Inspirational quotes</p>
        </div>
        <Button onClick={() => navigate('new')} className="gap-2">
          <Plus size={18} /> Add Quote
        </Button>
      </div>
      <Card>
        <CardContent className="pt-6">
          <DataTable columns={columns} data={data} loading={isLoading} />
        </CardContent>
      </Card>
    </div>
  );
};
