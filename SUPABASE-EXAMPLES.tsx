// ======================================
// ПРИМЕРЫ ИСПОЛЬЗОВАНИЯ SUPABASE В КОМПОНЕНТАХ
// ======================================

// ======================================
// 1️⃣ ЗАГРУЗИТЬ КУРСЫ И ПОКАЗАТЬ НА САЙТЕ
// ======================================

import { supabase, Course, Review } from '@/lib/supabase';
import { useEffect, useState } from 'react';

export function CoursesSection() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCourses(data || []);
    } catch (error) {
      console.error('Ошибка загрузки курсов:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Загрузка курсов...</p>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {courses.map(course => (
        <div key={course.id} className="border rounded-lg overflow-hidden">
          {course.cover_image_url && (
            <img 
              src={course.cover_image_url} 
              alt={course.title} 
              className="w-full h-40 object-cover"
            />
          )}
          <div className="p-4">
            <h3 className="font-bold text-lg">{course.title}</h3>
            <p className="text-gray-600 mb-2">{course.description}</p>
            <div className="flex justify-between">
              <span>💰 {course.price}₽</span>
              <span>⏱️ {course.duration_hours}ч</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ======================================
// 2️⃣ ЗАГРУЗИТЬ И ПОКАЗАТЬ ОТЗЫВЫ
// ======================================

export function ReviewsSection() {
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    const fetchReviews = async () => {
      const { data } = await supabase
        .from('reviews')
        .select('*')
        .eq('is_published', true)
        .order('created_at', { ascending: false })
        .limit(6);

      setReviews(data || []);
    };

    fetchReviews();
  }, []);

  return (
    <div className="space-y-4">
      {reviews.map(review => (
        <div key={review.id} className="border rounded-lg p-4">
          <div className="flex items-start gap-4">
            {review.author_avatar_url && (
              <img 
                src={review.author_avatar_url} 
                alt={review.author_name}
                className="w-12 h-12 rounded-full object-cover"
              />
            )}
            <div className="flex-1">
              <h4 className="font-bold">{review.author_name}</h4>
              <p className="text-yellow-500">{'⭐'.repeat(review.rating)}</p>
              <p className="text-gray-700 mt-2">{review.comment}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ======================================
// 3️⃣ ФОРМА РЕГИСТРАЦИИ НА КУРС
// ======================================

export function CourseRegistrationForm({ courseId }: { courseId: string }) {
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Получи данные из формы
      const formData = new FormData(e.currentTarget);
      const email = formData.get('email') as string;
      const fullName = formData.get('full_name') as string;

      // Создай или найди пользователя
      let user;
      const { data: existingUser } = await supabase
        .from('users')
        .select('id')
        .eq('email', email)
        .single();

      if (existingUser) {
        user = existingUser;
      } else {
        const { data: newUser, error: userError } = await supabase
          .from('users')
          .insert([{ email, full_name: fullName }])
          .select()
          .single();

        if (userError) throw userError;
        user = newUser;
      }

      // Зарегистрируй на курс
      const { error: registrationError } = await supabase
        .from('course_registrations')
        .insert([
          {
            user_id: user.id,
            course_id: courseId,
          }
        ]);

      if (registrationError) throw registrationError;

      alert('✅ Вы зарегистрированы на курс!');
    } catch (error: any) {
      alert('❌ Ошибка регистрации: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleRegister} className="space-y-4">
      <input 
        type="email" 
        name="email" 
        placeholder="Email" 
        required
        className="w-full border rounded px-3 py-2"
      />
      <input 
        type="text" 
        name="full_name" 
        placeholder="Полное имя" 
        required
        className="w-full border rounded px-3 py-2"
      />
      <button 
        type="submit" 
        disabled={loading}
        className="w-full bg-blue-500 text-white px-4 py-2 rounded"
      >
        {loading ? 'Регистрация...' : 'Зарегистрироваться'}
      </button>
    </form>
  );
}

// ======================================
// 4️⃣ ФОРМА ДЛЯ ДОБАВЛЕНИЯ ОТЗЫВА
// ======================================

export function ReviewForm({ courseId }: { courseId: string }) {
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const { error } = await supabase
      .from('reviews')
      .insert([
        {
          course_id: courseId,
          author_name: formData.get('author_name'),
          rating: parseInt(formData.get('rating') as string),
          comment: formData.get('comment'),
          is_published: false, // Админ опубликует позже
        }
      ]);

    if (error) {
      alert('❌ Ошибка отправки отзыва');
    } else {
      alert('✅ Ваш отзыв отправлен!');
      e.currentTarget.reset();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input 
        type="text" 
        name="author_name" 
        placeholder="Ваше имя" 
        required
        className="w-full border rounded px-3 py-2"
      />
      <select 
        name="rating" 
        className="w-full border rounded px-3 py-2"
      >
        <option value="5">⭐⭐⭐⭐⭐ 5 звёзд</option>
        <option value="4">⭐⭐⭐⭐ 4 звёзды</option>
        <option value="3">⭐⭐⭐ 3 звёзды</option>
        <option value="2">⭐⭐ 2 звёзды</option>
        <option value="1">⭐ 1 звезда</option>
      </select>
      <textarea 
        name="comment" 
        placeholder="Ваш отзыв" 
        required
        className="w-full border rounded px-3 py-2 h-24"
      />
      <button 
        type="submit"
        className="w-full bg-green-500 text-white px-4 py-2 rounded"
      >
        Отправить отзыв
      </button>
    </form>
  );
}

// ======================================
// 5️⃣ ХУКИ ДЛЯ ПЕРЕИСПОЛЬЗОВАНИЯ
// ======================================

// Хук для загрузки курсов
export function useCourses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      const { data } = await supabase
        .from('courses')
        .select('*')
        .order('created_at', { ascending: false });

      setCourses(data || []);
      setLoading(false);
    };

    fetchCourses();
  }, []);

  return { courses, loading };
}

// Хук для загрузки отзывов
export function usePublishedReviews(limit = 10) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      const { data } = await supabase
        .from('reviews')
        .select('*')
        .eq('is_published', true)
        .order('created_at', { ascending: false })
        .limit(limit);

      setReviews(data || []);
      setLoading(false);
    };

    fetchReviews();
  }, [limit]);

  return { reviews, loading };
}

// ======================================
// 6️⃣ ПРИМЕРЫ ИСПОЛЬЗОВАНИЯ ХУКОВ
// ======================================

// В компоненте CoursesSection.tsx:
/*
import { useCourses } from '@/lib/supabase-hooks';

export function CoursesSection() {
  const { courses, loading } = useCourses();

  if (loading) return <p>Загрузка...</p>;

  return (
    <div className="grid gap-6">
      {courses.map(course => (
        <CourseCard key={course.id} course={course} />
      ))}
    </div>
  );
}
*/

// ======================================
// 7️⃣ ПРЯМЫЕ ЗАПРОСЫ К БД
// ======================================

// Получить конкретный курс
async function getCourseById(id: string) {
  const { data } = await supabase
    .from('courses')
    .select('*')
    .eq('id', id)
    .single();
  return data;
}

// Получить всех пользователей (только админ)
async function getAllUsers() {
  const { data } = await supabase
    .from('users')
    .select('*');
  return data;
}

// Получить регистрации пользователя
async function getUserRegistrations(userId: string) {
  const { data } = await supabase
    .from('course_registrations')
    .select(`
      id,
      registered_at,
      courses (id, title, cover_image_url)
    `)
    .eq('user_id', userId);
  return data;
}

// Получить статистику курса
async function getCourseStats(courseId: string) {
  const registrations = await supabase
    .from('course_registrations')
    .select('*')
    .eq('course_id', courseId);

  const reviews = await supabase
    .from('reviews')
    .select('rating')
    .eq('course_id', courseId)
    .eq('is_published', true);

  return {
    registrationCount: registrations.data?.length || 0,
    averageRating: 
      reviews.data && reviews.data.length > 0
        ? (reviews.data.reduce((sum: number, r: any) => sum + r.rating, 0) / reviews.data.length).toFixed(1)
        : 0,
  };
}

export {
  getCourseById,
  getAllUsers,
  getUserRegistrations,
  getCourseStats,
};
