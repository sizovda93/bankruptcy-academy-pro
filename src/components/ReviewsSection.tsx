import { useEffect, useState } from "react";
import { supabase, Review } from "@/lib/supabase";

const ReviewsSection = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      // Сначала пробуем загрузить из БД
      const { data } = await supabase
        .from("reviews")
        .select("*")
        .eq("is_published", true)
        .order("created_at", { ascending: false });

      if (data && data.length > 0) {
        setReviews(data);
      } else {
        // Если в БД нет, показываем примеры
        setReviews(defaultReviews);
      }
    } catch (error) {
      // Если Supabase не настроен, показываем примеры
      console.log("Используются примеры отзывов");
      setReviews(defaultReviews);
    } finally {
      setLoading(false);
    }
  };

  const defaultReviews: Review[] = [
    {
      id: "1",
      author_name: "Иван Петров",
      rating: 5,
      comment:
        "Отличный курс! Очень полезная информация по налогообложению и способам защиты активов. Преподаватель объясняет сложные вещи просто и понятно. Рекомендую!",
      author_avatar_url:
        "https://api.dicebear.com/7.x/avataaars/svg?seed=Ivan",
      is_published: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: "2",
      author_name: "Мария Сидорова",
      rating: 5,
      comment:
        "Просто супер! После этого курса я разобралась со всеми нюансами банкротства и как его избежать. Теперь спокойно спалю по ночам!",
      author_avatar_url:
        "https://api.dicebear.com/7.x/avataaars/svg?seed=Maria",
      is_published: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: "3",
      author_name: "Алексей Иванов",
      rating: 4,
      comment:
        "Хороший курс, много практической информации. Единственное - хотелось бы больше практических примеров. Но в целом очень доволен покупкой.",
      author_avatar_url:
        "https://api.dicebear.com/7.x/avataaars/svg?seed=Alexey",
      is_published: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: "4",
      author_name: "Елена Смирнова",
      rating: 5,
      comment:
        "Спасибо авторам за такой подробный и актуальный курс! Все материалы легко доступны, понятно объяснены. Прошла за неделю и уже применяю знания!",
      author_avatar_url:
        "https://api.dicebear.com/7.x/avataaars/svg?seed=Elena",
      is_published: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: "5",
      author_name: "Дмитрий Козлов",
      rating: 5,
      comment:
        "Это то, что мне нужно было! Курс помог мне избежать множество ошибок в ведении бизнеса. Стоимость оправдана сполна. Спасибо!!!",
      author_avatar_url:
        "https://api.dicebear.com/7.x/avataaars/svg?seed=Dmitry",
      is_published: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ];

  if (loading) {
    return <div className="text-center py-12">Загрузка отзывов...</div>;
  }

  return (
    <section id="reviews" className="py-16 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Отзывы Студентов
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Узнай, что говорят о нашем курсе люди, которые уже прошли
            обучение и изменили свою жизнь
          </p>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow"
            >
              {/* Rating Stars */}
              <div className="flex items-center mb-4">
                <div className="text-yellow-400 text-lg">
                  {"⭐".repeat(review.rating)}
                </div>
              </div>

              {/* Comment */}
              <p className="text-gray-700 mb-6 line-clamp-4">
                "{review.comment}"
              </p>

              {/* Author Info */}
              <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                {review.author_avatar_url && (
                  <img
                    src={review.author_avatar_url}
                    alt={review.author_name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                )}
                <div>
                  <p className="font-semibold text-gray-900">
                    {review.author_name}
                  </p>
                  <p className="text-sm text-gray-500">Студент курса</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Button */}
        <div className="text-center mt-12">
          <p className="text-gray-600 mb-4">
            Готов присоединиться к сотням успешных студентов?
          </p>
          <button className="bg-gradient-to-r from-green-400 to-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:shadow-lg transition-shadow inline-block">
            Начать Обучение
          </button>
        </div>
      </div>
    </section>
  );
};

export default ReviewsSection;
