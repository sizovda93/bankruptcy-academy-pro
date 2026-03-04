import { useEffect, useMemo, useState } from "react";
import { supabase, Teacher } from "@/lib/supabase";

const defaultTeachers: Teacher[] = [
  {
    id: "default-1",
    full_name: "Александр Воронов",
    position: "Адвокат, партнер практики банкротства",
    bio: "15+ лет в сопровождении банкротных процедур и судебных споров.",
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
    bio: "Специализация: оспаривание сделок и защита контролирующих лиц.",
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
    bio: "Практикующий юрист и методолог программ для senior-специалистов.",
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
    return <div className="text-center py-12">Загрузка преподавателей...</div>;
  }

  return (
    <section id="teachers" className="py-16 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Преподаватели</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Практикующие юристы и адвокаты с реальным опытом ведения банкротных дел
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((teacher) => (
            <div
              key={teacher.id}
              className="bg-white rounded-lg shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow"
            >
              <div className="flex items-center gap-4 mb-4">
                {teacher.photo_url ? (
                  <img
                    src={teacher.photo_url}
                    alt={teacher.full_name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-gray-200" />
                )}
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{teacher.full_name}</h3>
                  {teacher.position ? (
                    <p className="text-sm text-green-700 font-medium">{teacher.position}</p>
                  ) : null}
                </div>
              </div>

              {teacher.bio ? <p className="text-gray-700">{teacher.bio}</p> : null}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TeachersSection;

