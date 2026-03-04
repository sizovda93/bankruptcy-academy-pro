import { useEffect, useMemo, useState } from "react";
import { supabase, Review } from "@/lib/supabase";

const defaultReviews: Review[] = [
  {
    id: "default-1",
    author_name: "Иван Петров",
    rating: 5,
    comment: "Отличный курс! Очень полезная информация и понятная подача.",
    author_avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ivan",
    is_published: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "default-2",
    author_name: "Мария Сидорова",
    rating: 5,
    comment: "Разобралась в теме банкротства и применяю знания на практике.",
    author_avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Maria",
    is_published: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "default-3",
    author_name: "Алексей Иванов",
    rating: 4,
    comment: "Хороший курс, много практических примеров.",
    author_avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alexey",
    is_published: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

const ReviewsSection = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchReviews = async () => {
    try {
      const { data, error } = await supabase
        .from("reviews")
        .select("*")
        .eq("is_published", true)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setReviews(data || []);
    } catch {
      setReviews([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();

    const channel = supabase
      .channel("public-reviews-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "reviews" },
        () => {
          fetchReviews();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const items = useMemo(() => {
    if (reviews.length > 0) return reviews;
    return defaultReviews;
  }, [reviews]);

  if (loading) {
    return <div className="text-center py-12">Загрузка отзывов...</div>;
  }

  return (
    <section id="reviews" className="py-16 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Отзывы студентов</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Что говорят люди, которые уже прошли обучение
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((review) => (
            <div
              key={review.id}
              className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow"
            >
              <div className="flex items-center mb-4">
                <div className="text-yellow-400 text-lg">{"?".repeat(review.rating)}</div>
              </div>

              <p className="text-gray-700 mb-6 line-clamp-4">"{review.comment}"</p>

              <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                {review.author_avatar_url ? (
                  <img
                    src={review.author_avatar_url}
                    alt={review.author_name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                ) : null}
                <div>
                  <p className="font-semibold text-gray-900">{review.author_name}</p>
                  <p className="text-sm text-gray-500">Студент курса</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-600 mb-4">Готов присоединиться к студентам?</p>
          <button className="bg-gradient-to-r from-green-400 to-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:shadow-lg transition-shadow inline-block">
            Начать обучение
          </button>
        </div>
      </div>
    </section>
  );
};

export default ReviewsSection;

