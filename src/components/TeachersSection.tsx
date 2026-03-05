import { useEffect, useMemo, useState } from "react";
import { api, Teacher } from "@/lib/api";

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

  if (loading) {
    return <div className="py-12 text-center">Загрузка преподавателей...</div>;
  }

  return (
    <section id="teachers" className="bg-white py-16">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-4xl font-bold text-gray-900">Преподаватели</h2>
          <p className="mx-auto max-w-3xl text-xl text-gray-600">
            Эксперты-практики, которые ежедневно работают с кейсами по банкротству
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
          {items.map((teacher) => (
            <article key={teacher.id} className="overflow-hidden rounded-2xl border border-gray-200 bg-gray-50">
              {teacher.photo_url ? (
                <img
                  src={teacher.photo_url}
                  alt={teacher.full_name}
                  className="h-64 w-full bg-gray-100 object-contain"
                />
              ) : (
                <div className="h-64 w-full bg-gray-200" />
              )}

              <div className="space-y-5 p-6">
                <h3 className="text-2xl font-bold leading-tight text-gray-900 break-normal sm:text-3xl">
                  {teacher.full_name}
                </h3>

                <div className="space-y-4">
                  {teacher.position ? <p className="text-[22px] leading-snug text-primary">{teacher.position}</p> : null}
                  {teacher.bio ? <p className="text-[22px] leading-snug text-primary">{teacher.bio}</p> : null}
                </div>

                <p className="text-[24px] leading-tight text-gray-900">
                  Стаж работы: {teacher.experience ? teacher.experience : "не указан"}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TeachersSection;
