import client from './client';

export interface Quote {
  id: number;
  quote_en: string;
  quote_hi: string;
  quote_mr: string;
  placement: string;
  is_active: boolean;
  sort_order: number;
}

const quotes = {
  getAll: async (): Promise<Quote[]> => {
    const response = await client.get('/admin/quotes');
    return response.data;
  },

  getOne: async (id: number): Promise<Quote> => {
    const response = await client.get(`/admin/quotes/${id}`);
    return response.data;
  },

  create: async (data: Partial<Quote>): Promise<Quote> => {
    const response = await client.post('/admin/quotes', data);
    return response.data;
  },

  update: async (id: number, data: Partial<Quote>): Promise<Quote> => {
    const response = await client.put(`/admin/quotes/${id}`, data);
    return response.data;
  },

  remove: async (id: number): Promise<void> => {
    await client.delete(`/admin/quotes/${id}`);
  },

  reorder: async (items: Array<{ id: number; sort_order: number }>): Promise<void> => {
    await client.post('/admin/quotes/reorder', items);
  },
};

export default quotes;
