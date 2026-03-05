// API клиент — замена Supabase SDK
// Все запросы идут на Express-бэкенд, который работает с PostgreSQL

const API_URL = import.meta.env.VITE_API_URL || '/api';

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    ...options,
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(body.error || `HTTP ${res.status}`);
  }

  return res.json();
}

// ============ Типы (бывшие Supabase интерфейсы) ============

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
  benefits?: string;
  cover_image_url?: string;
  cover_image_id?: string;
  price: number;
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

export interface Teacher {
  id: string;
  full_name: string;
  position?: string;
  bio?: string;
  expertise?: string;
  experience?: string;
  photo_url?: string;
  display_order?: number;
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

export interface Lead {
  id: string;
  full_name: string;
  phone: string;
  email?: string;
  promo_code?: string;
  consent_policy: boolean;
  consent_offers: boolean;
  source?: string;
  created_at: string;
}

export interface SiteSetting {
  id: string;
  setting_key: string;
  setting_value: string;
  updated_at: string;
}

// ============ API методы ============

export const api = {
  // --- Courses ---
  courses: {
    list: () => request<Course[]>('/courses'),
    get: (id: string) => request<Course>(`/courses/${id}`),
    create: (data: Partial<Course>) =>
      request<Course>('/courses', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: Partial<Course>) =>
      request<Course>(`/courses/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id: string) =>
      request<{ success: boolean }>(`/courses/${id}`, { method: 'DELETE' }),
  },

  // --- Teachers ---
  teachers: {
    list: (published?: boolean) =>
      request<Teacher[]>(`/teachers${published !== undefined ? `?published=${published}` : ''}`),
    create: (data: Partial<Teacher>) =>
      request<Teacher>('/teachers', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: Partial<Teacher>) =>
      request<Teacher>(`/teachers/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    togglePublish: (id: string, is_published: boolean) =>
      request<Teacher>(`/teachers/${id}/publish`, {
        method: 'PATCH',
        body: JSON.stringify({ is_published }),
      }),
    delete: (id: string) =>
      request<{ success: boolean }>(`/teachers/${id}`, { method: 'DELETE' }),
  },

  // --- Reviews ---
  reviews: {
    list: (published?: boolean) =>
      request<Review[]>(`/reviews${published !== undefined ? `?published=${published}` : ''}`),
    create: (data: Partial<Review>) =>
      request<Review>('/reviews', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: Partial<Review>) =>
      request<Review>(`/reviews/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    togglePublish: (id: string, is_published: boolean) =>
      request<Review>(`/reviews/${id}/publish`, {
        method: 'PATCH',
        body: JSON.stringify({ is_published }),
      }),
    delete: (id: string) =>
      request<{ success: boolean }>(`/reviews/${id}`, { method: 'DELETE' }),
  },

  // --- Leads ---
  leads: {
    list: () => request<Lead[]>('/leads'),
    create: (data: Partial<Lead>) =>
      request<Lead>('/leads', { method: 'POST', body: JSON.stringify(data) }),
  },

  // --- Users ---
  users: {
    list: () => request<User[]>('/users'),
    create: (data: Partial<User>) =>
      request<User>('/users', { method: 'POST', body: JSON.stringify(data) }),
    delete: (id: string) =>
      request<{ success: boolean }>(`/users/${id}`, { method: 'DELETE' }),
  },

  // --- Site Settings ---
  settings: {
    list: () => request<SiteSetting[]>('/settings'),
    update: (key: string, value: string) =>
      request<SiteSetting>(`/settings/${key}`, {
        method: 'PUT',
        body: JSON.stringify({ setting_value: value }),
      }),
  },

  // --- Media ---
  media: {
    list: () => request<Media[]>('/media'),
    upload: async (file: File): Promise<Media> => {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch(`${API_URL}/media/upload`, {
        method: 'POST',
        body: formData,
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({ error: res.statusText }));
        throw new Error(body.error || `HTTP ${res.status}`);
      }
      return res.json();
    },
    uploadToPath: async (file: File): Promise<{ publicUrl: string; filename: string }> => {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch(`${API_URL}/media/upload-to-path`, {
        method: 'POST',
        body: formData,
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({ error: res.statusText }));
        throw new Error(body.error || `HTTP ${res.status}`);
      }
      return res.json();
    },
    delete: (id: string) =>
      request<{ success: boolean }>(`/media/${id}`, { method: 'DELETE' }),
  },

  // --- Health ---
  health: () => request<{ status: string; database: string; timestamp: string }>('/health'),
};
