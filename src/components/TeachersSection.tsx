import { useEffect, useMemo, useState } from "react";
import { supabase, Teacher } from "@/lib/supabase";

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
      const { data, error } = await supabase
        .from("teachers")
        .select("*")
        .eq("is_published", true)
        .order("display_order", { ascending: true, nullsFirst: false })
        .order("created_at", { ascending: false });

      if (error) throw error;
      setTeachers(data || []);
    } catch {
      setTeachers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeachers();

    const channel = supabase
      .channel("public-teachers-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "teachers" },
        () => {
          fetchTeachers();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
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
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-4xl font-bold text-gray-900">Преподаватели</h2>
          <p className="mx-auto max-w-3xl text-xl text-gray-600">
            Эксперты-практики, которые ежедневно работают с кейсами по банкротству
          </p>
        </div>

        <div className="space-y-8">
          {items.map((teacher) => (
            <article key={teacher.id} className="rounded-3xl border border-gray-200 bg-gray-50 p-8 sm:p-10">
              <div className="flex items-start gap-6">
                {teacher.photo_url ? (
                  <img
                    src={teacher.photo_url}
                    alt={teacher.full_name}
                    className="h-24 w-24 flex-shrink-0 rounded-2xl bg-white object-cover"
                  />
                ) : (
                  <div className="h-24 w-24 flex-shrink-0 rounded-2xl bg-gray-200" />
                )}

                <div className="pt-1">
                  <h3 className="text-3xl font-bold leading-tight text-gray-900 sm:text-4xl">{teacher.full_name}</h3>
                </div>
              </div>

              <div className="mt-8 space-y-5 text-xl leading-relaxed text-gray-700 sm:text-2xl">
                {teacher.position ? <p>{teacher.position}</p> : null}
                {teacher.bio ? <p>{teacher.bio}</p> : null}
                {teacher.expertise ? (
                  <p>
                    <span className="font-semibold text-gray-900">Экспертиза:</span> {teacher.expertise}
                  </p>
                ) : null}
                {teacher.experience ? <p>{teacher.experience}</p> : null}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TeachersSection;
