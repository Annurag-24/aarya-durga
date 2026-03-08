import client from './client';

export interface PageContent {
  id: number;
  page_key: string;
  section_key: string;
  language: 'en' | 'hi' | 'mr';
  content: string;
}

const pageContent = {
  getAll: async (): Promise<PageContent[]> => {
    const response = await client.get('/admin/page-content');
    return response.data;
  },

  getOne: async (id: number): Promise<PageContent> => {
    const response = await client.get(`/admin/page-content/${id}`);
    return response.data;
  },

  create: async (data: Partial<PageContent>): Promise<PageContent> => {
    const response = await client.post('/admin/page-content', data);
    return response.data;
  },

  update: async (id: number, data: Partial<PageContent>): Promise<PageContent> => {
    const response = await client.put(`/admin/page-content/${id}`, data);
    return response.data;
  },

  remove: async (id: number): Promise<void> => {
    await client.delete(`/admin/page-content/${id}`);
  },
};

export default pageContent;
