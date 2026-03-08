import client from './client';

export interface Event {
  id: number;
  title_en: string;
  title_hi: string;
  title_mr: string;
  date_label_en?: string;
  date_label_hi?: string;
  date_label_mr?: string;
  event_date?: string;
  description_en?: string;
  description_hi?: string;
  description_mr?: string;
  category: 'Festival' | 'Yatra' | 'Pooja';
  image_id?: number;
  is_active: boolean;
  sort_order: number;
}

const events = {
  getAll: async (): Promise<Event[]> => {
    const response = await client.get('/admin/events');
    return response.data;
  },

  getOne: async (id: number): Promise<Event> => {
    const response = await client.get(`/admin/events/${id}`);
    return response.data;
  },

  create: async (data: Partial<Event>): Promise<Event> => {
    const response = await client.post('/admin/events', data);
    return response.data;
  },

  update: async (id: number, data: Partial<Event>): Promise<Event> => {
    const response = await client.put(`/admin/events/${id}`, data);
    return response.data;
  },

  remove: async (id: number): Promise<void> => {
    await client.delete(`/admin/events/${id}`);
  },

  reorder: async (items: Array<{ id: number; sort_order: number }>): Promise<void> => {
    await client.post('/admin/events/reorder', items);
  },
};

export default events;
