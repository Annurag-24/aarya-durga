import client from './client';

export interface DailyScheduleItem {
  id: number;
  time_label: string;
  event_en: string;
  event_hi: string;
  event_mr: string;
  sort_order: number;
}

const dailySchedule = {
  getAll: async (): Promise<DailyScheduleItem[]> => {
    const response = await client.get('/admin/daily-schedule');
    return response.data;
  },

  getOne: async (id: number): Promise<DailyScheduleItem> => {
    const response = await client.get(`/admin/daily-schedule/${id}`);
    return response.data;
  },

  create: async (data: Partial<DailyScheduleItem>): Promise<DailyScheduleItem> => {
    const response = await client.post('/admin/daily-schedule', data);
    return response.data;
  },

  update: async (id: number, data: Partial<DailyScheduleItem>): Promise<DailyScheduleItem> => {
    const response = await client.put(`/admin/daily-schedule/${id}`, data);
    return response.data;
  },

  remove: async (id: number): Promise<void> => {
    await client.delete(`/admin/daily-schedule/${id}`);
  },

  reorder: async (items: Array<{ id: number; sort_order: number }>): Promise<void> => {
    await client.post('/admin/daily-schedule/reorder', items);
  },
};

export default dailySchedule;
