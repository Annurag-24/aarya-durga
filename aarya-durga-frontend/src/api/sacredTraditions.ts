import client from './client';

export interface SacredTradition {
  id: number;
  title_en: string;
  title_hi: string;
  title_mr: string;
  description_en: string;
  description_hi: string;
  description_mr: string;
  sort_order: number;
}

const sacredTraditions = {
  getAll: async (): Promise<SacredTradition[]> => {
    const response = await client.get('/admin/sacred-traditions');
    return response.data;
  },

  getOne: async (id: number): Promise<SacredTradition> => {
    const response = await client.get(`/admin/sacred-traditions/${id}`);
    return response.data;
  },

  create: async (data: Partial<SacredTradition>): Promise<SacredTradition> => {
    const response = await client.post('/admin/sacred-traditions', data);
    return response.data;
  },

  update: async (id: number, data: Partial<SacredTradition>): Promise<SacredTradition> => {
    const response = await client.put(`/admin/sacred-traditions/${id}`, data);
    return response.data;
  },

  remove: async (id: number): Promise<void> => {
    await client.delete(`/admin/sacred-traditions/${id}`);
  },

  reorder: async (items: Array<{ id: number; sort_order: number }>): Promise<void> => {
    await client.post('/admin/sacred-traditions/reorder', items);
  },
};

export default sacredTraditions;
