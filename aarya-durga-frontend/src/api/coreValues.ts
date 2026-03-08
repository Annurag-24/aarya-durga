import client from './client';

export interface CoreValue {
  id: number;
  title_en: string;
  title_hi: string;
  title_mr: string;
  description_en: string;
  description_hi: string;
  description_mr: string;
  sort_order: number;
}

const coreValues = {
  getAll: async (): Promise<CoreValue[]> => {
    const response = await client.get('/admin/core-values');
    return response.data;
  },

  getOne: async (id: number): Promise<CoreValue> => {
    const response = await client.get(`/admin/core-values/${id}`);
    return response.data;
  },

  create: async (data: Partial<CoreValue>): Promise<CoreValue> => {
    const response = await client.post('/admin/core-values', data);
    return response.data;
  },

  update: async (id: number, data: Partial<CoreValue>): Promise<CoreValue> => {
    const response = await client.put(`/admin/core-values/${id}`, data);
    return response.data;
  },

  remove: async (id: number): Promise<void> => {
    await client.delete(`/admin/core-values/${id}`);
  },

  reorder: async (items: Array<{ id: number; sort_order: number }>): Promise<void> => {
    await client.post('/admin/core-values/reorder', items);
  },
};

export default coreValues;
