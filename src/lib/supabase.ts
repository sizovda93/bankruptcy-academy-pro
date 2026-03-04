import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

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
