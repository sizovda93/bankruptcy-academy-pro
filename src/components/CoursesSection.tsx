import { useEffect, useMemo, useState } from "react";
import { BookOpen, CheckCircle2, ShieldCheck, Award, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { api, Course } from "@/lib/api";
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

const formatPrice = (value: number | string | null | undefined) => {
  const numValue = typeof value === "string" ? parseFloat(value) : value;
  if (typeof numValue !== "number" || Number.isNaN(numValue) || numValue === 0) return "По запросу";
  return `${new Intl.NumberFormat("ru-RU").format(numValue)} ${RUB}`;
};

const parseBenefits = (value: string | null | undefined) => {
  if (!value) return [];
  return value
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
};

const toDisplayCourse = (course: Course, fallbackPrice?: string): DisplayCourse => {
  const priceValue = formatPrice(course.price);
  return {
    id: course.id,
    title: course.title,
    type: course.level || "Курс",
    price: priceValue !== "По запросу" ? priceValue : (fallbackPrice || "По запросу"),
    description: course.description || undefined,
    benefits: parseBenefits(course.benefits),
    coverImageUrl: course.cover_image_url || undefined,
  };
};

const CoursesSection = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState<DisplayCourse | null>(null);
  const [showExpertsModal, setShowExpertsModal] = useState(false);

  const handleCourseClick = (course: DisplayCourse) => {
    const normalizedTitle = course.title.toLowerCase();
    if (normalizedTitle.includes("эксперт") && normalizedTitle.includes("бфл")) {
      setShowExpertsModal(true);
      return;
    }
    if (normalizedTitle.includes("продвижение без вложений")) {
      navigate("/courses/promotion-without-ads");
      return;
    }
    if (normalizedTitle.includes("юридические аспекты бфл") || normalizedTitle.includes("юридические аспекты процедуры банкротства")) {
      navigate("/courses/legal-aspects-bfl");
      return;
    }
    if (normalizedTitle.includes("продаж") || normalizedTitle.includes("продавать") || normalizedTitle.includes("1,5 млн")) {
      navigate("/courses/sales-promotion");
      return;
    }
    if (normalizedTitle.includes("оспаривание") || normalizedTitle.includes("сделок")) {
      navigate("/courses/transaction-disputes");
      return;
    }
    if (normalizedTitle.includes("неосвобождение") || normalizedTitle.includes("обязательств")) {
      navigate("/courses/non-discharge");
      return;
    }
    if (normalizedTitle.includes("эффективная команда") || normalizedTitle.includes("команд")) {
      navigate("/courses/effective-team");
      return;
    }

    setSelectedCourse(course);
  };

  const fetchCourses = async () => {
    try {
      const data = await api.courses.list();
      setCourses(data || []);
    } catch {
      setCourses([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const items = useMemo(() => {
    if (courses.length > 0) {
      return courses.map(course => {
        // Попробуем найти дефолтный курс с похожим названием
        const normalizedTitle = course.title.toLowerCase();
        const fallback = defaultCourses.find(dc => {
          const dcTitle = dc.title.toLowerCase();
          return normalizedTitle.includes("юридич") && dcTitle.includes("юридич") ||
                 normalizedTitle.includes("маркетинг") && dcTitle.includes("маркетинг") ||
                 normalizedTitle.includes("команд") && dcTitle.includes("команд");
        });
        return toDisplayCourse(course, fallback?.price);
      });
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

      {/* Модал для экспертного курса */}
      <Dialog open={showExpertsModal} onOpenChange={setShowExpertsModal}>
        <DialogContent className="w-[96vw] max-w-[640px] p-0 overflow-hidden">
          <DialogTitle className="sr-only">Экспертный курс БФЛ</DialogTitle>

          {/* Градиентная шапка */}
          <div className="relative bg-gradient-to-br from-primary/90 via-primary to-primary/80 px-6 py-8 text-primary-foreground sm:px-10 sm:py-10">
            <Lock className="absolute right-6 top-6 h-8 w-8 opacity-20" />
            <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-widest opacity-80">
              <ShieldCheck className="h-4 w-4" />
              Закрытая программа
            </div>
            <h3 className="mt-3 font-heading text-2xl font-bold leading-tight sm:text-3xl">
              Эксперты БФЛ
            </h3>
            <p className="mt-1 text-sm opacity-80">Продвинутый курс для юристов с опытом в БФЛ</p>
          </div>

          {/* Контент */}
          <div className="px-6 py-6 sm:px-10 sm:py-8">
            <div className="flex items-center gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 dark:border-amber-900/50 dark:bg-amber-950/30">
              <Award className="h-5 w-5 flex-shrink-0 text-amber-600 dark:text-amber-400" />
              <p className="text-sm font-semibold text-amber-800 dark:text-amber-200">
                Только для действующих партнёров, прошедших все курсы
              </p>
            </div>

            <div className="mt-6 space-y-4 text-sm leading-relaxed text-muted-foreground">
              <p>
                Данная программа представляет собой <span className="font-semibold text-foreground">высшую ступень профессиональной
                сертификации</span> в рамках экосистемы Академии Банкротства. Допуск осуществляется исключительно
                по результатам внутренней аттестации и при наличии подтверждённого статуса действующего партнёра.
              </p>
              <p>
                Курс охватывает углублённую аналитику судебной практики Верховного Суда РФ, нестандартные
                стратегии ведения процедур реструктуризации долгов, методологию работы с оспариванием
                цепочек сделок в делах повышенной сложности, а также тактику взаимодействия с арбитражными
                управляющими и кредиторами на уровне экспертного консалтинга.
              </p>
              <p>
                Выпускники получают статус <span className="font-semibold text-foreground">«Сертифицированный
                эксперт БФЛ»</span> и приоритетный доступ к реферальной сети Академии с повышенной комиссионной ставкой.
              </p>
            </div>

            <ul className="mt-6 space-y-2">
              {[
                "Разбор прецедентных дел ВС РФ 2024–2025",
                "Стратегии защиты при субсидиарной ответственности",
                "Экспертный нетворкинг с ведущими практиками отрасли",
                "Персональное менторство от основателей Академии",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-foreground/90">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <button
              type="button"
              onClick={() => setShowExpertsModal(false)}
              className="mt-8 w-full rounded-xl bg-muted px-6 py-3 text-sm font-semibold text-muted-foreground transition-colors hover:bg-muted/80"
            >
              Понятно
            </button>
          </div>
        </DialogContent>
      </Dialog>

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
