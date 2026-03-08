import client from './client';

export interface ContactSubject {
  id: number;
  label_en: string;
  label_hi: string;
  label_mr: string;
  sort_order: number;
}

const contactSubjects = {
  getAll: async (): Promise<ContactSubject[]> => {
    const response = await client.get('/admin/contact-subjects');
    return response.data;
  },

  getOne: async (id: number): Promise<ContactSubject> => {
    const response = await client.get(`/admin/contact-subjects/${id}`);
    return response.data;
  },

  create: async (data: Partial<ContactSubject>): Promise<ContactSubject> => {
    const response = await client.post('/admin/contact-subjects', data);
    return response.data;
  },

  update: async (id: number, data: Partial<ContactSubject>): Promise<ContactSubject> => {
    const response = await client.put(`/admin/contact-subjects/${id}`, data);
    return response.data;
  },

  remove: async (id: number): Promise<void> => {
    await client.delete(`/admin/contact-subjects/${id}`);
  },

  reorder: async (items: Array<{ id: number; sort_order: number }>): Promise<void> => {
    await client.post('/admin/contact-subjects/reorder', items);
  },
};

export default contactSubjects;
