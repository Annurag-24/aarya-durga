import client from './client';

export interface GalleryImage {
  id: number;
  image_id: number;
  alt_en?: string;
  alt_hi?: string;
  alt_mr?: string;
  caption_en?: string;
  caption_hi?: string;
  caption_mr?: string;
  sort_order: number;
}

const gallery = {
  getAll: async (): Promise<GalleryImage[]> => {
    const response = await client.get('/admin/gallery');
    return response.data;
  },

  getOne: async (id: number): Promise<GalleryImage> => {
    const response = await client.get(`/admin/gallery/${id}`);
    return response.data;
  },

  create: async (data: Partial<GalleryImage>): Promise<GalleryImage> => {
    const response = await client.post('/admin/gallery', data);
    return response.data;
  },

  update: async (id: number, data: Partial<GalleryImage>): Promise<GalleryImage> => {
    const response = await client.put(`/admin/gallery/${id}`, data);
    return response.data;
  },

  remove: async (id: number): Promise<void> => {
    await client.delete(`/admin/gallery/${id}`);
  },

  reorder: async (items: Array<{ id: number; sort_order: number }>): Promise<void> => {
    await client.post('/admin/gallery/reorder', items);
  },
};

export default gallery;
