import { useEffect, useMemo, useState } from "react";
import { BookOpen } from "lucide-react";
import { supabase, Course } from "@/lib/supabase";

type DisplayCourse = {
  id: string;
  title: string;
  type: string;
  price: string;
  description?: string;
  coverImageUrl?: string;
};

const defaultCourses: DisplayCourse[] = [
  {
    id: "default-1",
    title: "Юридические аспекты процедуры банкротства",
    type: "Продвинутый",
    price: "14 500 ₽",
  },
  {
    id: "default-2",
    title: "Маркетинг в сфере банкротства",
    type: "Средний",
    price: "11 200 ₽",
  },
  {
    id: "default-3",
    title: "Построение эффективной команды",
    type: "Начинающий",
    price: "8 900 ₽",
  },
];

const formatPrice = (value: number | null | undefined) => {
  if (typeof value !== "number" || Number.isNaN(value)) return "По запросу";
  return `${new Intl.NumberFormat("ru-RU").format(value)} ₽`;
};

const toDisplayCourse = (course: Course): DisplayCourse => ({
  id: course.id,
  title: course.title,
  type: course.level || "Курс",
  price: formatPrice(course.price),
  description: course.description || undefined,
  coverImageUrl: course.cover_image_url || undefined,
});

const CoursesSection = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCourses = async () => {
    try {
      const { data, error } = await supabase
        .from("courses")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setCourses(data || []);
    } catch {
      setCourses([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();

    const channel = supabase
      .channel("public-courses-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "courses" },
        () => {
          fetchCourses();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const items = useMemo(() => {
    if (courses.length > 0) {
      return courses.map(toDisplayCourse);
    }
    return defaultCourses;
  }, [courses]);

  return (
    <section id="courses" className="py-16 sm:py-24">
      <div className="container">
        <h2 className="font-heading text-3xl font-bold text-foreground sm:text-4xl">
          Наши курсы
        </h2>

        {loading ? (
          <p className="mt-6 text-muted-foreground">Загрузка курсов...</p>
        ) : null}

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((course) => (
            <div
              key={course.id}
              className="group relative flex flex-col rounded-2xl border border-border bg-card p-6 shadow-sm transition-all hover:shadow-lg hover:-translate-y-1"
            >
              {course.coverImageUrl ? (
                <img
                  src={course.coverImageUrl}
                  alt={course.title}
                  className="mb-4 h-40 w-full rounded-xl object-cover"
                />
              ) : null}

              <div className="flex items-center gap-2 text-xs text-primary">
                <BookOpen className="h-3.5 w-3.5" />
                <span className="font-medium">{course.type}</span>
              </div>

              <h3 className="mt-4 font-heading text-lg font-bold leading-snug text-foreground group-hover:text-primary transition-colors">
                {course.title}
              </h3>

              {course.description ? (
                <p className="mt-2 text-sm text-muted-foreground line-clamp-3">
                  {course.description}
                </p>
              ) : null}

              <div className="mt-auto pt-6">
                <p className="font-heading text-xl font-bold text-foreground">
                  {course.price}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CoursesSection;

