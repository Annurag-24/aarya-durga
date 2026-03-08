import client from './client';

export interface MediaFile {
  id: number;
  filename: string;
  file_path: string;
  file_size: number;
  mime_type: string;
}

const media = {
  getAll: async (): Promise<MediaFile[]> => {
    const response = await client.get('/admin/media');
    return response.data;
  },

  upload: async (file: File, section?: string): Promise<MediaFile> => {
    const formData = new FormData();
    formData.append('file', file);
    if (section) {
      formData.append('section', section);
    }
    const response = await client.post('/admin/media/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  remove: async (id: number): Promise<void> => {
    await client.delete(`/admin/media/${id}`);
  },
};

export default media;
