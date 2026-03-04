import { createClient } from '@supabase/supabase-js';

const FALLBACK_SUPABASE_URL = 'https://tyepcnakzyfdgryrdeqd.supabase.co';
const FALLBACK_SUPABASE_ANON_KEY = 'sb_publishable_968O3rZYMHg8vOqyuGz9kw_9PPxV1n9';

const envUrl = import.meta.env.VITE_SUPABASE_URL || '';
const envAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || '';

const isPlaceholderKey = (key: string) => {
  const normalized = key.toLowerCase();
  return normalized.includes('your-project') || normalized.includes('your-anon-key') || normalized.includes('your-publishable-key');
};

const supabaseUrl = !envUrl || envUrl.includes('your-project.supabase.co') ? FALLBACK_SUPABASE_URL : envUrl;
const supabaseAnonKey = !envAnonKey || isPlaceholderKey(envAnonKey) ? FALLBACK_SUPABASE_ANON_KEY : envAnonKey;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase credentials are missing. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Типы для БД
export interface User {
  id: string;
  email: string;
  full_name: string;
  phone?: string;
  created_at: string;
  updated_at: string;
}

export interface Media {
  id: string;
  file_name: string;
  file_url: string;
  file_type?: string;
  file_size?: number;
  uploaded_by?: string;
  created_at: string;
}

export interface Course {
  id: string;
  title: string;
  description?: string;
  cover_image_url?: string;
  cover_image_id?: string;
  price: number;
  duration_hours?: number;
  level?: string;
  created_at: string;
  updated_at: string;
}

export interface Review {
  id: string;
  user_id?: string;
  course_id?: string;
  rating: number;
  comment?: string;
  author_name: string;
  author_avatar_url?: string;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface CourseRegistration {
  id: string;
  user_id: string;
  course_id: string;
  registered_at: string;
  completed: boolean;
}

export interface SiteSetting {
  id: string;
  setting_key: string;
  setting_value: string | null;
  updated_at: string;
}
