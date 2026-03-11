import { useEffect, useMemo, useState } from "react";
import { Star } from "lucide-react";
import { api, Review } from "@/lib/api";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { LeadFormContent } from "@/components/LeadFormSection";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";

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
  const [openLeadForm, setOpenLeadForm] = useState(false);

  const fetchReviews = async () => {
    try {
      const data = await api.reviews.list(true);
      setReviews(data || []);
    } catch {
      setReviews([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const items = useMemo(() => {
    if (reviews.length > 0) return reviews;
    return defaultReviews;
  }, [reviews]);

  if (loading) {
    return <div className="py-12 text-center">Загрузка отзывов...</div>;
  }

  return (
    <section id="reviews" className="bg-gradient-to-b from-white to-gray-50 py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-4xl font-bold text-gray-900">Отзывы студентов</h2>
          <p className="mx-auto max-w-2xl text-xl text-gray-600">Что говорят люди, которые уже прошли обучение</p>
        </div>

        <Carousel
          className="mx-auto w-full max-w-[1160px]"
          opts={{
            align: "start",
            loop: items.length > 3,
          }}
        >
          <CarouselContent>
            {items.map((review) => (
              <CarouselItem key={review.id} className="md:basis-1/2 lg:basis-1/3">
                <div className="h-full rounded-lg bg-white p-6 shadow-lg transition-shadow hover:shadow-xl">
                  <div className="mb-4 flex items-center gap-3">
                    {review.author_avatar_url ? (
                      <img src={review.author_avatar_url} alt={review.author_name} className="h-12 w-12 rounded-full object-cover" />
                    ) : null}
                    <div>
                      <p className="font-semibold text-gray-900">{review.author_name}</p>
                      <p className="text-sm text-gray-500">Студент курса</p>
                    </div>
                  </div>

                  <div className="mb-4 flex items-center gap-1">
                    {Array.from({ length: review.rating }).map((_, idx) => (
                      <Star key={`${review.id}-star-${idx}`} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>

                  <p className="mb-4 line-clamp-4 text-gray-700">"{review.comment}"</p>

                  {review.review_image_url ? (
                    <img
                      src={review.review_image_url}
                      alt={`Фото к отзыву ${review.author_name}`}
                      className="mt-2 h-40 w-full rounded-lg object-cover"
                    />
                  ) : null}

                  {review.review_video_url ? (
                    <video
                      src={review.review_video_url}
                      controls
                      preload="metadata"
                      className="mt-2 h-40 w-full rounded-lg bg-black"
                    />
                  ) : null}
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-2 top-[42%] border-gray-200 bg-white text-gray-900 hover:bg-gray-50 md:-left-4" />
          <CarouselNext className="right-2 top-[42%] border-gray-200 bg-white text-gray-900 hover:bg-gray-50 md:-right-4" />
        </Carousel>

        <div className="mt-12 text-center">
          <p className="mb-4 text-gray-600">Готовы усилить экспертизу в банкротстве и повысить ценность вашей юридической практики?</p>
          <button
            onClick={() => setOpenLeadForm(true)}
            className="inline-block rounded-lg bg-gradient-to-r from-green-400 to-green-600 px-8 py-3 font-semibold text-white transition-shadow hover:shadow-lg"
          >
            Начать обучение
          </button>
        </div>
      </div>

      <Dialog open={openLeadForm} onOpenChange={setOpenLeadForm}>
        <DialogContent className="w-[96vw] max-w-[1280px] p-4 sm:p-6">
          <LeadFormContent />
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default ReviewsSection;
