import client from './client';

export interface Media {
  id: number;
  filename: string;
  original_name: string;
  file_path: string;
  file_url: string;
  file_size?: number;
  mime_type?: string;
  width?: number;
  height?: number;
}

export interface SiteSetting {
  id: number;
  temple_name_en: string;
  temple_name_hi: string;
  temple_name_mr: string;
  address_line1_en: string;
  address_line1_hi: string;
  address_line1_mr: string;
  address_line2_en: string;
  address_line2_hi: string;
  address_line2_mr: string;
  address_line3_en: string;
  address_line3_hi: string;
  address_line3_mr: string;
  phone_primary: string;
  phone_secondary: string;
  email_general: string;
  email_pooja: string;
  google_maps_embed_url?: string;
  darshan_morning: string;
  darshan_evening: string;
  facebook_url: string;
  instagram_url: string;
  youtube_url: string;
  copyright_en: string;
  copyright_hi: string;
  copyright_mr: string;
  site_title?: string;
  website_name_en?: string;
  website_name_hi?: string;
  website_name_mr?: string;
  favicon_id?: number;
  favicon?: Media;
  logo_id?: number;
  logo?: Media;
  bank_account_name?: string;
  bank_name?: string;
  bank_branch?: string;
  bank_account_number?: string;
  bank_ifsc?: string;
  upi_id?: string;
}

const settings = {
  get: async (): Promise<SiteSetting> => {
    const response = await client.get('/admin/site-settings');
    return Array.isArray(response.data) ? response.data[0] : response.data;
  },

  getPublic: async (): Promise<SiteSetting> => {
    const response = await client.get('/public/settings');
    return Array.isArray(response.data) ? response.data[0] : response.data;
  },

  update: async (data: Partial<SiteSetting>): Promise<SiteSetting> => {
    const response = await client.put('/admin/site-settings', data);
    return response.data;
  },
};

export default settings;
