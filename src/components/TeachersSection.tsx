import { useEffect, useMemo, useState } from "react";
import { api, Teacher } from "@/lib/api";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";

const defaultTeachers: Teacher[] = [
  {
    id: "default-1",
    full_name: "Александр Воронов",
    position: "Адвокат, партнер практики банкротства",
    bio: "Преподаватель-практик по сопровождению сложных банкротных процедур.",
    expertise: "Судебные споры, оспаривание сделок, защита контролирующих лиц.",
    experience: "15+ лет практики в арбитражных судах и корпоративных конфликтах.",
    photo_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Voronov",
    display_order: 1,
    is_published: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "default-2",
    full_name: "Екатерина Белова",
    position: "Арбитражный юрист",
    bio: "Эксперт по стратегической защите в делах о банкротстве.",
    expertise: "Субсидиарная ответственность, реструктуризация долгов, судебная аналитика.",
    experience: "Более 10 лет консультирования собственников и топ-менеджмента компаний.",
    photo_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Belova",
    display_order: 2,
    is_published: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "default-3",
    full_name: "Илья Смирнов",
    position: "Руководитель образовательных программ",
    bio: "Куратор программ для senior-специалистов юридического рынка.",
    expertise: "Проектирование юридических практик, стандарты качества, управление кейсами.",
    experience: "Практикующий юрист и методолог отраслевых образовательных программ.",
    photo_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Smirnov",
    display_order: 3,
    is_published: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

const TeachersSection = () => {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTeachers = async () => {
    try {
      const data = await api.teachers.list(true);
      setTeachers(data || []);
    } catch {
      setTeachers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  const items = useMemo(() => {
    if (teachers.length > 0) return teachers;
    return defaultTeachers;
  }, [teachers]);

  // Группируем преподавателей по 3
  const groupedTeachers = useMemo(() => {
    const groups: Teacher[][] = [];
    for (let i = 0; i < items.length; i += 3) {
      groups.push(items.slice(i, i + 3));
    }
    return groups;
  }, [items]);

  if (loading) {
    return <div className="py-12 text-center">Загрузка преподавателей...</div>;
  }

  return (
    <section id="teachers" className="bg-[#F5F5F5] py-12 md:py-16 lg:py-20">
      <div className="container mx-auto px-4">
        <h2 className="mb-8 text-center text-3xl font-bold text-gray-900 md:mb-12 md:text-4xl lg:text-5xl">
          Преподаватели
        </h2>
        <Carousel className="mx-auto w-full max-w-[1200px]">
          <CarouselContent>
            {groupedTeachers.map((group, groupIndex) => (
              <CarouselItem key={groupIndex}>
                <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
                  {group.map((teacher) => (
                    <article key={teacher.id} className="flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-gray-50">
                      {teacher.photo_url ? (
                        <div className="h-72 w-full overflow-hidden bg-gray-100">
                          <img
                            src={teacher.photo_url}
                            alt={teacher.full_name}
                            className="h-full w-full object-cover object-top"
                          />
                        </div>
                      ) : (
                        <div className="h-72 w-full bg-gray-200" />
                      )}

                      <div className="flex flex-1 flex-col p-6">
                        <div className="space-y-2">
                          <h3 className="text-2xl font-bold leading-tight text-gray-900 break-normal sm:text-3xl">
                            {teacher.full_name}
                          </h3>
                          {teacher.position ? <p className="text-[22px] leading-snug text-primary">{teacher.position}</p> : null}
                        </div>

                        <div className="mt-5 flex flex-1 flex-col">
                          {teacher.bio ? <p className="text-[22px] leading-snug text-primary">{teacher.bio}</p> : null}
                          <p className="mt-auto pt-4 text-[24px] leading-tight text-gray-900">
                            Стаж работы: {teacher.experience ? teacher.experience : "не указан"}
                          </p>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
    </section>
  );
};

export default TeachersSection;
