import client from './client';

export interface HistoryTimeline {
  id: number;
  era_label_en: string;
  era_label_hi: string;
  era_label_mr: string;
  title_en: string;
  title_hi: string;
  title_mr: string;
  description_en: string;
  description_hi: string;
  description_mr: string;
  sort_order: number;
}

const historyTimeline = {
  getAll: async (): Promise<HistoryTimeline[]> => {
    const response = await client.get('/admin/history-timeline');
    return response.data;
  },

  getOne: async (id: number): Promise<HistoryTimeline> => {
    const response = await client.get(`/admin/history-timeline/${id}`);
    return response.data;
  },

  create: async (data: Partial<HistoryTimeline>): Promise<HistoryTimeline> => {
    const response = await client.post('/admin/history-timeline', data);
    return response.data;
  },

  update: async (id: number, data: Partial<HistoryTimeline>): Promise<HistoryTimeline> => {
    const response = await client.put(`/admin/history-timeline/${id}`, data);
    return response.data;
  },

  remove: async (id: number): Promise<void> => {
    await client.delete(`/admin/history-timeline/${id}`);
  },

  reorder: async (items: Array<{ id: number; sort_order: number }>): Promise<void> => {
    await client.post('/admin/history-timeline/reorder', items);
  },
};

export default historyTimeline;
