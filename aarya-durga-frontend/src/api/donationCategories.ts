import client from './client';

export interface DonationCategory {
  id: number;
  title_en: string;
  title_hi: string;
  title_mr: string;
  description_en: string;
  description_hi: string;
  description_mr: string;
  suggested_amount: string;
  is_active: boolean;
  sort_order: number;
}

const donationCategories = {
  getAll: async (): Promise<DonationCategory[]> => {
    const response = await client.get('/admin/donation-categories');
    return response.data;
  },

  getOne: async (id: number): Promise<DonationCategory> => {
    const response = await client.get(`/admin/donation-categories/${id}`);
    return response.data;
  },

  create: async (data: Partial<DonationCategory>): Promise<DonationCategory> => {
    const response = await client.post('/admin/donation-categories', data);
    return response.data;
  },

  update: async (id: number, data: Partial<DonationCategory>): Promise<DonationCategory> => {
    const response = await client.put(`/admin/donation-categories/${id}`, data);
    return response.data;
  },

  remove: async (id: number): Promise<void> => {
    await client.delete(`/admin/donation-categories/${id}`);
  },

  reorder: async (items: Array<{ id: number; sort_order: number }>): Promise<void> => {
    await client.post('/admin/donation-categories/reorder', items);
  },
};

export default donationCategories;
