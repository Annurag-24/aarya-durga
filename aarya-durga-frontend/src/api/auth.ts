import client from './client';

export interface AuthResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  admin: {
    id: number;
    name: string;
    email: string;
  };
}

export interface AdminUser {
  id: number;
  name: string;
  email: string;
}

const auth = {
  login: async (email: string, password: string): Promise<AuthResponse> => {
    const response = await client.post('/admin/auth/login', { email, password });
    return response.data;
  },

  logout: async (): Promise<void> => {
    await client.post('/admin/auth/logout');
  },

  me: async (): Promise<AdminUser> => {
    const response = await client.get('/admin/auth/me');
    return response.data;
  },

  refresh: async (): Promise<AuthResponse> => {
    const response = await client.post('/admin/auth/refresh');
    return response.data;
  },
};

export default auth;
