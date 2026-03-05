import { useEffect, useMemo, useState } from "react";
import { BookOpen, CheckCircle2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase, Course } from "@/lib/supabase";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { LeadFormContent } from "@/components/LeadFormSection";

type DisplayCourse = {
  id: string;
  title: string;
  type: string;
  price: string;
  description?: string;
  benefits?: string[];
  coverImageUrl?: string;
};

const RUB = "\u20BD";

const defaultCourses: DisplayCourse[] = [
  {
    id: "default-1",
    title: "Юридические аспекты процедуры банкротства",
    type: "Продвинутый",
    price: `14 500 ${RUB}`,
    benefits: ["Практические кейсы", "Готовые алгоритмы по делам о банкротстве"],
  },
  {
    id: "default-2",
    title: "Маркетинг в сфере банкротства",
    type: "Средний",
    price: `11 200 ${RUB}`,
    benefits: ["Привлечение целевых клиентов", "Юридически корректные рекламные связки"],
  },
  {
    id: "default-3",
    title: "Построение эффективной команды",
    type: "Начинающий",
    price: `8 900 ${RUB}`,
    benefits: ["Роли и KPI команды", "Контроль качества сопровождения"],
  },
];

const formatPrice = (value: number | null | undefined) => {
  if (typeof value !== "number" || Number.isNaN(value)) return "По запросу";
  return `${new Intl.NumberFormat("ru-RU").format(value)} ${RUB}`;
};

const parseBenefits = (value: string | null | undefined) => {
  if (!value) return [];
  return value
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
};

const toDisplayCourse = (course: Course): DisplayCourse => ({
  id: course.id,
  title: course.title,
  type: course.level || "Курс",
  price: formatPrice(course.price),
  description: course.description || undefined,
  benefits: parseBenefits(course.benefits),
  coverImageUrl: course.cover_image_url || undefined,
});

const CoursesSection = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState<DisplayCourse | null>(null);

  const handleCourseClick = (course: DisplayCourse) => {
    const normalizedTitle = course.title.toLowerCase();
    if (normalizedTitle.includes("продвижение без вложений")) {
      navigate("/courses/promotion-without-ads");
      return;
    }

    setSelectedCourse(course);
  };

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
        <h2 className="font-heading text-3xl font-bold text-foreground sm:text-4xl">Наши курсы</h2>

        {loading ? <p className="mt-6 text-muted-foreground">Загрузка курсов...</p> : null}

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((course) => (
            <button
              key={course.id}
              type="button"
              onClick={() => handleCourseClick(course)}
              className="group relative flex flex-col rounded-2xl border border-border bg-card p-6 text-left shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
            >
              {course.coverImageUrl ? (
                <img src={course.coverImageUrl} alt={course.title} className="mb-4 h-40 w-full rounded-xl object-cover" />
              ) : null}

              <div className="flex items-center gap-2 text-xs text-primary">
                <BookOpen className="h-3.5 w-3.5" />
                <span className="font-medium">{course.type}</span>
              </div>

              <h3 className="mt-4 font-heading text-lg font-bold leading-snug text-foreground transition-colors group-hover:text-primary">
                {course.title}
              </h3>

              {course.description ? <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">{course.description}</p> : null}

              <div className="mt-auto pt-6">
                <p className="font-heading text-xl font-bold text-foreground">{course.price}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      <Dialog open={Boolean(selectedCourse)} onOpenChange={(open) => !open && setSelectedCourse(null)}>
        <DialogContent className="w-[96vw] max-w-[1280px] p-4 sm:p-6">
          <DialogTitle className="sr-only">Заявка на курс</DialogTitle>
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-3xl border border-border bg-card p-6 sm:p-8">
              <h3 className="font-heading text-2xl font-bold text-foreground">{selectedCourse?.title}</h3>
              {selectedCourse?.description ? <p className="mt-3 text-muted-foreground">{selectedCourse.description}</p> : null}

              <div className="mt-6">
                <h4 className="font-heading text-lg font-semibold text-foreground">Преимущества курса</h4>
                <ul className="mt-4 space-y-3">
                  {(selectedCourse?.benefits && selectedCourse.benefits.length > 0
                    ? selectedCourse.benefits
                    : [
                        "Практический фокус: применяете знания сразу в работе",
                        "Актуальные подходы и кейсы по банкротным делам",
                        "Материалы и структура для самостоятельной работы",
                      ]
                  ).map((benefit, index) => (
                    <li key={`${benefit}-${index}`} className="flex items-start gap-2 text-sm text-foreground/90">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div>
              <LeadFormContent compact />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default CoursesSection;
