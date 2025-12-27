import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Section = {
  id: string;
  title_ar: string;
  title_en: string;
  description_ar: string;
  description_en: string;
  slug: string;
  icon: string;
  order_index: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type Category = {
  id: string;
  section_id: string;
  title_ar: string;
  title_en: string;
  description_ar: string;
  description_en: string;
  slug: string;
  order_index: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type Article = {
  id: string;
  category_id: string;
  author_id: string;
  title_ar: string;
  title_en: string;
  content_ar: string;
  content_en: string;
  excerpt_ar: string;
  excerpt_en: string;
  slug: string;
  featured_image: string;
  is_featured: boolean;
  views_count: number;
  published_at: string;
  created_at: string;
  updated_at: string;
};

export type User = {
  id: string;
  full_name_ar: string;
  full_name_en: string;
  bio_ar: string;
  bio_en: string;
  avatar_url: string;
  role: 'admin' | 'editor' | 'author' | 'user';
  is_active: boolean;
  created_at: string;
  updated_at: string;
};
