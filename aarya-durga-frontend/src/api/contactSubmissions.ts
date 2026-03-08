import client from './client';

export interface ContactSubmission {
  id: number;
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
  status: 'new' | 'read' | 'resolved';
  created_at: string;
  updated_at: string;
}

const contactSubmissions = {
  getAll: async (): Promise<ContactSubmission[]> => {
    const response = await client.get('/admin/contact-submissions');
    return Array.isArray(response.data) ? response.data : [response.data];
  },

  getOne: async (id: number): Promise<ContactSubmission> => {
    const response = await client.get(`/admin/contact-submissions/${id}`);
    return response.data;
  },

  updateStatus: async (id: number, status: 'new' | 'read' | 'resolved'): Promise<ContactSubmission> => {
    const response = await client.patch(`/admin/contact-submissions/${id}/status`, { status });
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await client.delete(`/admin/contact-submissions/${id}`);
  },

  submit: async (data: {
    name: string;
    email: string;
    phone?: string;
    subject?: string;
    message: string;
  }): Promise<ContactSubmission> => {
    const response = await client.post('/public/contact', data);
    return response.data.submission;
  },
};

export default contactSubmissions;
