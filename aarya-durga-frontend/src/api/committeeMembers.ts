import client from './client';

export interface CommitteeMember {
  id: number;
  name: string;
  role_en: string;
  role_hi: string;
  role_mr: string;
  bio_en?: string;
  bio_hi?: string;
  bio_mr?: string;
  media_id?: number;
  sort_order: number;
}

const committeeMembers = {
  getAll: async (): Promise<CommitteeMember[]> => {
    const response = await client.get('/admin/committee-members');
    return response.data;
  },

  getOne: async (id: number): Promise<CommitteeMember> => {
    const response = await client.get(`/admin/committee-members/${id}`);
    return response.data;
  },

  create: async (data: Partial<CommitteeMember>): Promise<CommitteeMember> => {
    const response = await client.post('/admin/committee-members', data);
    return response.data;
  },

  update: async (id: number, data: Partial<CommitteeMember>): Promise<CommitteeMember> => {
    const response = await client.put(`/admin/committee-members/${id}`, data);
    return response.data;
  },

  remove: async (id: number): Promise<void> => {
    await client.delete(`/admin/committee-members/${id}`);
  },

  reorder: async (items: Array<{ id: number; sort_order: number }>): Promise<void> => {
    await client.post('/admin/committee-members/reorder', items);
  },
};

export default committeeMembers;
