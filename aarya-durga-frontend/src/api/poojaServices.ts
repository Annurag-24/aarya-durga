import client from './client';

export interface PoojaService {
  id: number;
  title_en: string;
  title_hi: string;
  title_mr: string;
  schedule_en: string;
  schedule_hi: string;
  schedule_mr: string;
  description_en?: string;
  description_hi?: string;
  description_mr?: string;
  price: string;
  is_active: boolean;
  sort_order: number;
}

const poojaServices = {
  getAll: async (): Promise<PoojaService[]> => {
    const response = await client.get('/admin/pooja-services');
    return response.data;
  },

  getOne: async (id: number): Promise<PoojaService> => {
    const response = await client.get(`/admin/pooja-services/${id}`);
    return response.data;
  },

  create: async (data: Partial<PoojaService>): Promise<PoojaService> => {
    const response = await client.post('/admin/pooja-services', data);
    return response.data;
  },

  update: async (id: number, data: Partial<PoojaService>): Promise<PoojaService> => {
    const response = await client.put(`/admin/pooja-services/${id}`, data);
    return response.data;
  },

  remove: async (id: number): Promise<void> => {
    await client.delete(`/admin/pooja-services/${id}`);
  },

  reorder: async (items: Array<{ id: number; sort_order: number }>): Promise<void> => {
    await client.post('/admin/pooja-services/reorder', items);
  },
};

export default poojaServices;
