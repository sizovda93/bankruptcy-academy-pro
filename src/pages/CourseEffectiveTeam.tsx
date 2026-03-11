import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useEffect, useMemo, useState } from "react";
import { Award, BookOpenCheck, Files, Minus, Plus, ShieldCheck, Sparkles, Users, Target, Settings, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LeadFormContent } from "@/components/LeadFormSection";
import CourseInstallmentBlock from "@/components/course/CourseInstallmentBlock";
import { api, Course, StudentCase, Teacher } from "@/lib/api";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/hooks/use-toast";

const highlights = [
  "Оргструктура и роли под разный размер команды (3/7/15/30 человек)",
  "KPI и мотивация, которые работают без токсичности",
  "Система найма, адаптации и контроля качества как конвейер",
];

const audience = [
  "Руководителям-одиночкам, которые нанимают первых сотрудников и хотят, чтобы они приносили результат без постоянного надзора.",
  "Владельцам команд 4–10 человек с хаосом в задачах, срывами сроков и необходимостью всё тащить на себе.",
  "Руководителям команд 10–30+ человек, которым нужны управленческие уровни, система найма, KPI и отделы.",
  "Собственникам юридических компаний в сфере БФЛ и смежных услуг, где критичны сроки, качество и массовое производство.",
];

const lessons = [
  {
    title: "Модуль 1. Диагностика команды и точка «А»",
    points: [
      "Почему «людей много — результата мало»",
      "Где теряется эффективность: роли, процессы, контроль, мотивация",
      "Диагностика: скорость, качество, загрузка, узкие места",
      "Карта проблем: «операционка съела руководителя»",
    ],
  },
  {
    title: "Модуль 2. Роли и оргструктура (скелет управления)",
    points: [
      "Оргструктура для команды 3/7/15/30 человек",
      "Роли в юр. бизнесе: продажи, аудит/консультации, производство, сервис, юрконтроль, документооборот",
      "Зоны ответственности (RACI): кто делает, кто согласует, кто отвечает",
      "Как не допускать «двойной ответственности» и «безответственных задач»",
    ],
  },
  {
    title: "Модуль 3. Процессы и регламенты: чтобы было повторяемо",
    points: [
      "Какие процессы нужно зафиксировать первыми",
      "Регламент как инструмент свободы, а не бюрократии",
      "Чек-листы по этапам производства в БФЛ: анкета → аудит → договор → документы → суд → процедура",
      "Шаблоны коммуникации внутри команды и с клиентами",
    ],
  },
  {
    title: "Модуль 4. Постановка задач и управление исполнением",
    points: [
      "Как ставить задачу, чтобы её не «перепоняли»",
      "Стандарты: «что такое хорошо сделано»",
      "Система статусов: очередь/в работе/проверка/готово",
      "Дедлайны, SLA, контроль «без микроменеджмента»",
      "Ежедневные/еженедельные ритмы: планёрки, отчётность, ретро",
    ],
  },
  {
    title: "Модуль 5. KPI и метрики эффективности",
    points: [
      "KPI по ролям: продажи, производство, сервис",
      "Баланс «скорость–качество–удовлетворенность клиента»",
      "Метрики: конверсия, срок цикла, просрочки, ошибки, NPS, повторные обращения",
      "Как считать и как внедрять без сопротивления",
      "Управленческий дашборд руководителя",
    ],
  },
  {
    title: "Модуль 6. Мотивация: деньги + смыслы + правила",
    points: [
      "Фикс/бонус/грейды/премии за качество",
      "Мотивация, которая не убивает инициативу",
      "Система штрафов: когда допустима, когда разрушает",
      "Нематериальная мотивация: признание, рост, роль, автономность",
    ],
  },
  {
    title: "Модуль 7. Найм «под результат»",
    points: [
      "Портреты кандидатов на ключевые роли",
      "Воронка найма: где искать и как фильтровать",
      "Вопросы на собеседовании, которые реально раскрывают кандидата",
      "Тестовые задания (простые, но показательные)",
      "3 красных флага: токсичность, безответственность, «я не про правила»",
    ],
  },
  {
    title: "Модуль 8. Адаптация и обучение",
    points: [
      "План адаптации на 7/14/30 дней",
      "«Книга сотрудника»: правила, регламенты, стандарты",
      "Наставничество и контроль",
      "Проверка понимания: мини-экзамены/практика",
    ],
  },
  {
    title: "Модуль 9. Контроль качества и разбор ошибок",
    points: [
      "Что контролировать, а что доверить",
      "Контроль качества документов/коммуникаций/сроков",
      "Работа с ошибками: разбор без «виноватых», но с выводами",
      "Как предотвращать повторение ошибок (обновление регламентов)",
    ],
  },
  {
    title: "Модуль 10. Коммуникации внутри команды",
    points: [
      "Конфликты: причины и сценарии решения",
      "Границы ответственности и «кто кому должен»",
      "Культура обратной связи: как говорить, чтобы улучшалось, а не разрушалось",
      "«Единая инфолиния» для клиента: никто не говорит разное",
    ],
  },
  {
    title: "Модуль 11. Управленческий уровень",
    points: [
      "Когда нужен тимлид",
      "Как делегировать без потери контроля",
      "Система отчётности руководителей",
      "Как выращивать управленцев внутри команды",
    ],
  },
  {
    title: "Модуль 12. Антикризис: что делать, когда всё горит",
    points: [
      "Срыв сроков, текучка, падение качества",
      "«Пожарный» режим на 2 недели: стабилизация",
      "Восстановление стандартов и доверия клиентов",
      "План предотвращения повторения кризиса",
    ],
  },
  {
    title: "Модуль 13. Команда как актив",
    points: [
      "Как удерживать сильных",
      "Грейды и карьерные треки",
      "Кадровый резерв",
      "Культура «мы делаем результат» (не «мы просто работаем»)",
    ],
  },
  {
    title: "Модуль 14. Итог: сборка вашей системы",
    points: [
      "Оргструктура + роли + KPI",
      "Регламенты по ключевым процессам",
      "Найм и адаптация",
      "Ритмы управления",
      "План внедрения на 30 дней",
    ],
  },
];

const sellingPoints = [
  "Перестанете тащить всё на себе: система ролей и ответственности",
  "Качество и сроки станут управляемыми: чек-листы и контроль",
  "Команда начнёт давать результат: KPI + мотивация без хаоса",
  "Найм станет предсказуемым: воронка + адаптация",
  "Можно масштабировать: структура «под рост», а не «на удаче»",
];

const practicalTasks = [
  "Диагностика команды: «где теряется результат»",
  "Построение оргструктуры под ваш размер",
  "Описание 5–10 ключевых ролей (ответственность + KPI)",
  "Создание 3 регламентов и 5 чек-листов",
  "Настройка ритмов управления (планёрки, отчётность, контроль качества)",
  "Подготовка пакета найма: вакансия + вопросы + тестовое",
  "План адаптации сотрудника на 30 дней",
  "Финальная сборка «Командного стандарта компании»",
];

const materials = [
  "Оргструктуры для команд 3/7/15/30 человек",
  "Карточка роли (обязанности, KPI, компетенции)",
  "RACI-матрица ответственности",
  "Шаблоны регламентов и чек-листов",
  "Скрипт собеседования + тестовые задания",
  "План адаптации 7/14/30 дней",
  "Дашборд руководителя (метрики команды)",
];

const faqItems = [
  {
    question: "Для каких команд подходит этот курс?",
    answer:
      "Курс подходит для команд от 1 до 30+ человек. Программа включает решения для разных этапов роста: от найма первых сотрудников до создания управленческих уровней и отделов.",
  },
  {
    question: "Как проходит обучение?",
    answer:
      "Обучение проходит в формате 8–10 недель: 1–2 занятия в неделю по 90–120 минут. Включает теорию, домашние задания, разборы кейсов участников и чат поддержки.",
  },
  {
    question: "Подойдёт ли курс для юридических компаний?",
    answer:
      "Да, курс специально адаптирован для юридических компаний в сфере БФЛ и смежных услуг, где важны массовое производство, сроки, документы и коммуникации с клиентами.",
  },
  {
    question: "Какие материалы я получу?",
    answer:
      "Вы получите шаблоны оргструктур, карточки ролей, RACI-матрицы, регламенты, чек-листы, скрипты собеседований, планы адаптации и дашборд руководителя для отслеживания метрик команды.",
  },
  {
    question: "Можно ли применять инструменты курса сразу?",
    answer:
      "Да, программа построена так, чтобы вы внедряли инструменты параллельно с обучением. Каждое задание — это практический шаг к построению вашей системы управления командой.",
  },
  {
    question: "Что будет на выходе?",
    answer:
      "Готовая система управления командой: оргструктура, роли с KPI, регламенты, процессы найма и адаптации, ритмы управления. Всё это можно внедрить за 30 дней после курса.",
  },
  {
    question: "Нужен ли опыт управления командой?",
    answer:
      "Нет, курс подходит как для начинающих руководителей, так и для опытных. Программа структурирована от базовых принципов до продвинутых управленческих инструментов.",
  },
];

const teamOrderFallback = ["артин", "сизов", "герасимов", "лященко"];

const teamFallback: Teacher[] = [
  {
    id: "fallback-artin",
    full_name: "Василий Алексеевич Артин",
    position: "Ведущий эксперт курса",
    bio: "Эксперт по построению и масштабированию команд в сфере банкротства.",
    expertise: "Организационное развитие, управление командами, построение систем.",
    experience: "15+ лет в управлении",
    photo_url: "",
    display_order: 1,
    is_published: true,
    created_at: "",
    updated_at: "",
  },
  {
    id: "fallback-sizov",
    full_name: "Сизов",
    position: "Эксперт курса",
    bio: "Специалист по операционному управлению и стандартизации процессов.",
    expertise: "Операционное управление, регламенты, контроль качества.",
    experience: "Практикующий эксперт",
    photo_url: "",
    display_order: 2,
    is_published: true,
    created_at: "",
    updated_at: "",
  },
  {
    id: "fallback-gerasimov",
    full_name: "Герасимов Александр Валерьевич",
    position: "Эксперт курса",
    bio: "Специалист по KPI и системам мотивации.",
    expertise: "Управление эффективностью, KPI, мотивационные системы.",
    experience: "Практикующий эксперт",
    photo_url: "",
    display_order: 3,
    is_published: true,
    created_at: "",
    updated_at: "",
  },
  {
    id: "fallback-lyashchenko",
    full_name: "Лященко Елена Юрьевна",
    position: "Эксперт курса",
    bio: "Специалист по HR и найму в юридических компаниях.",
    expertise: "Подбор персонала, адаптация, корпоративная культура.",
    experience: "Практикующий эксперт",
    photo_url: "",
    display_order: 4,
    is_published: true,
    created_at: "",
    updated_at: "",
  },
];

const fallbackStudentCases: StudentCase[] = [
  {
    id: "fallback-case-1",
    course_id: "",
    student_name: "Дмитрий К.",
    student_role: "Руководитель юридической компании",
    case_text:
      "Руководил командой из 5 человек, постоянно всё делал сам, срывались сроки. После курса построил оргструктуру, внедрил KPI, команда выросла до 12 человек.",
    result_text: "Результат: освободил 60% времени на развитие бизнеса",
    is_published: true,
    display_order: 1,
    created_at: "",
    updated_at: "",
  },
  {
    id: "fallback-case-2",
    course_id: "",
    student_name: "Елена М.",
    student_role: "Владелец практики БФЛ",
    case_text:
      "Юридическая компания, 8 сотрудников, хаос в задачах, качество «прыгало». Внедрила регламенты и чек-листы по всем этапам БФЛ.",
    result_text: "Результат: просрочки −80%, повторные обращения +40%",
    is_published: true,
    display_order: 2,
    created_at: "",
    updated_at: "",
  },
  {
    id: "fallback-case-3",
    course_id: "",
    student_name: "Александр В.",
    student_role: "Руководитель отдела",
    case_text:
      "Не мог нанять нужных людей, 3 из 5 кандидатов уходили в первый месяц. Создал систему найма и адаптации по модели из курса.",
    result_text: "Результат: удержание новых сотрудников выросло до 90%",
    is_published: true,
    display_order: 3,
    created_at: "",
    updated_at: "",
  },
  {
    id: "fallback-case-4",
    course_id: "",
    student_name: "Ирина С.",
    student_role: "Собственник агентства",
    case_text:
      "Команда 15 человек, падение мотивации, текучка, конфликты между отделами. Внедрила систему KPI без токсичности, прозрачную мотивацию, культуру обратной связи.",
    result_text: "Результат: текучка снизилась с 40% до 12% в год",
    is_published: true,
    display_order: 4,
    created_at: "",
    updated_at: "",
  },
  {
    id: "fallback-case-5",
    course_id: "",
    student_name: "Михаил Т.",
    student_role: "Директор компании",
    case_text:
      "Компания на грани кризиса: срывы сроков, недовольство клиентов, 3 ключевых сотрудника уволились. Применил антикризисный модуль курса.",
    result_text: "Результат: за 2 недели стабилизация, за 3 месяца — новая система",
    is_published: true,
    display_order: 5,
    created_at: "",
    updated_at: "",
  },
  {
    id: "fallback-case-6",
    course_id: "",
    student_name: "Анна П.",
    student_role: "Основатель практики",
    case_text:
      "Хотела масштабировать бизнес, но боялась нанимать: непонятно, кого искать и как контролировать. Получила портреты ролей, воронку найма, план адаптации.",
    result_text: "Результат: за 4 месяца наняла 6 человек, все дают результат",
    is_published: true,
    display_order: 6,
    created_at: "",
    updated_at: "",
  },
];

export default function CourseEffectiveTeam() {
  const [course, setCourse] = useState<Course | null>(null);
  const [openModuleIndex, setOpenModuleIndex] = useState<number | null>(0);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loadingTeachers, setLoadingTeachers] = useState(true);
  const [studentCases, setStudentCases] = useState<StudentCase[]>(fallbackStudentCases);
  const [loadingCases, setLoadingCases] = useState(true);

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const data = await api.teachers.list(true);
        setTeachers(data || []);
      } catch {
        setTeachers([]);
      } finally {
        setLoadingTeachers(false);
      }
    };

    const fetchCases = async () => {
      try {
        const courses = await api.courses.list();
        const teamCourse = courses.find((course) => {
          const title = course.title.toLowerCase();
          return title.includes("эффективная команда") || title.includes("команд");
        });

        if (!teamCourse) {
          setStudentCases(fallbackStudentCases);
          return;
        }

        setCourse(teamCourse);

        const data = await api.studentCases.list(true, teamCourse?.id);
        setStudentCases(data?.length ? data : fallbackStudentCases);
      } catch {
        setStudentCases(fallbackStudentCases);
      } finally {
        setLoadingCases(false);
      }
    };

    fetchTeachers();
    fetchCases();
  }, []);

  const heroTitle = course?.hero_title || "Эффективная команда";
  const heroSubtitle = course?.hero_subtitle || course?.description || "Курс для руководителей юридического бизнеса";
  const heroDescription = course?.hero_description || course?.benefits || "";
  const heroHighlights = course?.hero_highlights?.length ? course.hero_highlights : highlights;
  const audienceList = course?.target_audience?.length ? course.target_audience : audience;
  const learningResults = course?.learning_results?.length ? course.learning_results : sellingPoints.map((item) => ({ title: item, text: "" }));
  const lessonsList = course?.lessons?.length ? course.lessons : lessons;
  const programBadge = course?.program_badge || `${lessons.length} модулей`;
  const practiceTasks = course?.practice_tasks?.length ? course.practice_tasks : practicalTasks;
  const materialsList = course?.materials_includes?.length ? course.materials_includes : materials;
  const faqList = course?.faq_items?.length ? course.faq_items : faqItems;
  const teamOrder = course?.team_order?.length ? course.team_order : teamOrderFallback;
  const specialOfferTitle = course?.special_offer_title || "Готовы построить эффективную команду?";
  const specialOfferDescription = course?.special_offer_description || "Записывайтесь на курс и получите готовую систему управления за 8–10 недель";
  const specialOfferButtonText = course?.special_offer_button_text || "Открыть форму заявки";
  const ctaTitle = course?.cta_title || "Начните строить команду, которая приносит результат";
  const ctaDescription =
    course?.cta_description || "Оставьте заявку — получите программу курса, условия участия и консультацию по подбору формата обучения.";
  const ctaButtonText = course?.cta_button_text || "Записаться на курс";

  const sortedTeachers = useMemo(() => {
    const allTeachers = loadingTeachers ? teamFallback : teachers.length > 0 ? teachers : teamFallback;

    const sorted = [...allTeachers].sort((a, b) => {
      const aIndex = teamOrder.findIndex((name) => a.full_name.toLowerCase().includes(name));
      const bIndex = teamOrder.findIndex((name) => b.full_name.toLowerCase().includes(name));

      if (aIndex === -1 && bIndex === -1) return 0;
      if (aIndex === -1) return 1;
      if (bIndex === -1) return -1;
      return aIndex - bIndex;
    });

    return sorted.filter((_, index) => index < teamOrder.length);
  }, [teachers, loadingTeachers, teamOrder]);

  const toggleModule = (index: number) => {
    setOpenModuleIndex((prev) => (prev === index ? null : index));
  };

  const toggleFaq = (index: number) => {
    setOpenFaqIndex((prev) => (prev === index ? null : index));
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="animate-page-enter">
        {/* Hero */}
        <section className="py-16 sm:py-20">
          <div className="container max-w-6xl">
            <div className="grid gap-6 rounded-3xl bg-gradient-to-br from-primary via-primary-glow to-blue-500 p-6 sm:p-8 lg:grid-cols-2 lg:p-10">
              <div className="text-white">
                <h1 className="font-heading text-4xl font-bold leading-tight sm:text-5xl">{heroTitle}</h1>
                <p className="mt-2 text-lg font-medium text-white/90">{heroSubtitle}</p>
                <p className="mt-6 text-lg leading-relaxed text-white/90 sm:text-xl">{heroDescription}</p>
                <div className="mt-8 grid gap-3">
                  {heroHighlights.map((item) => (
                    <div key={item} className="rounded-xl border border-white/20 bg-white/10 p-3 text-sm font-medium text-white">
                      {item}
                    </div>
                  ))}
                </div>
              </div>
              <div id="course-form">
                <LeadFormContent compact />
              </div>
            </div>
          </div>
        </section>

        {/* Для кого курс */}
        <section className="py-10">
          <div className="container max-w-6xl space-y-5">
            <h2 className="font-heading text-3xl font-bold">Для кого этот курс</h2>
            <div className="grid gap-4 md:grid-cols-2">
              {audienceList.map((item) => (
                <article key={item} className="relative overflow-hidden rounded-2xl border bg-card p-6">
                  <span className="pointer-events-none absolute -left-6 top-0 h-full w-4 -rotate-12 bg-primary/10" />
                  <span className="pointer-events-none absolute right-10 top-0 h-full w-3 rotate-6 bg-primary/10" />
                  <span className="absolute right-4 top-4 h-8 w-8 rounded-lg bg-primary/15" />
                  <p className="text-lg leading-relaxed text-foreground">{item}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Что получите на выходе */}
        <section className="py-10">
          <div className="container max-w-6xl space-y-5">
            <h2 className="font-heading text-3xl font-bold">Что будет на выходе</h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {learningResults.map((item, index) => {
                const icons = [Target, Settings, TrendingUp, Users, Sparkles];
                const Icon = icons[index % icons.length];
                return (
                  <article key={item.title} className="relative overflow-hidden rounded-2xl border bg-card p-6">
                    <span className="pointer-events-none absolute -left-5 top-0 h-full w-3 -rotate-12 bg-primary/10" />
                    <div className="flex items-start gap-3">
                      <div className="rounded-lg bg-primary/10 p-2">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-base font-medium text-foreground">{item.title}</p>
                        {item.text ? <p className="mt-2 text-sm text-muted-foreground">{item.text}</p> : null}
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        {/* Программа курса */}
        <section className="py-10">
          <div className="container max-w-6xl space-y-5">
            <div className="flex items-start justify-between gap-4">
              <h2 className="font-heading text-3xl font-bold">Программа курса</h2>
              <p className="text-sm font-medium text-primary">{programBadge}</p>
            </div>

            <div className="space-y-3">
              {lessonsList.map((lesson, index) => {
                const isOpen = openModuleIndex === index;
                return (
                  <article key={lesson.title} className="overflow-hidden rounded-2xl border bg-card">
                    <button
                      type="button"
                      onClick={() => toggleModule(index)}
                      className="flex w-full items-center justify-between gap-4 p-5 text-left"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 font-semibold text-primary">
                          {index + 1}
                        </div>
                        <h3 className="font-heading text-xl font-semibold text-foreground">{lesson.title}</h3>
                      </div>
                      <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                        {isOpen ? <Minus className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
                      </span>
                    </button>

                    {isOpen ? (
                      <div className="border-t bg-muted/20 p-5">
                        <ul className="space-y-2">
                            {lesson.points.map((point) => (
                            <li key={point} className="flex items-start gap-3 text-muted-foreground">
                              <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary" />
                              <span>{point}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : null}
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        {/* Практические задания */}
        <section className="py-10">
          <div className="container max-w-6xl space-y-5">
            <h2 className="font-heading text-3xl font-bold">Практика и задания</h2>
            <p className="text-lg text-muted-foreground">
              Курс построен на практике — вы не просто слушаете теорию, а создаёте инструменты для своей команды:
            </p>
            <div className="grid gap-3 md:grid-cols-2">
              {practiceTasks.map((task) => (
                <article
                  key={task}
                  className="flex items-start gap-3 rounded-xl border bg-card p-4"
                >
                  <BookOpenCheck className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
                  <p className="text-base text-foreground">{task}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Материалы курса */}
        <section className="py-10">
          <div className="container max-w-6xl space-y-5">
            <h2 className="font-heading text-3xl font-bold">Материалы курса</h2>
            <p className="text-lg text-muted-foreground">
              Все участники получают готовые шаблоны и инструменты для внедрения:
            </p>
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              {materialsList.map((material) => (
                <article
                  key={material}
                  className="flex items-start gap-3 rounded-xl border bg-card p-4"
                >
                  <Files className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
                  <p className="text-sm font-medium text-foreground">{material}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Команда преподавателей */}
        <section className="py-10">
          <div className="container max-w-6xl space-y-6">
            <h2 className="font-heading text-3xl font-bold">Команда курса — практикующие эксперты</h2>
            <div className="grid gap-4 lg:grid-cols-3">
              {sortedTeachers.map((member) => (
                <article key={member.id} className="h-full rounded-2xl border bg-card p-5">
                  <div className="flex items-center gap-4">
                    <div className="aspect-square h-24 w-24 flex-shrink-0 overflow-hidden rounded-full bg-muted">
                      {member.photo_url ? (
                        <img
                          src={member.photo_url}
                          alt={member.full_name}
                          className={`h-full w-full ${
                            member.full_name.includes("Артин")
                              ? "object-contain object-center p-1"
                              : "object-cover object-center"
                          }`}
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-primary/15 text-2xl font-bold text-primary">
                          {member.full_name
                            .split(" ")
                            .filter(Boolean)
                            .slice(0, 2)
                            .map((part) => part[0])
                            .join("")
                            .toUpperCase()}
                        </div>
                      )}
                    </div>
                    <div>
                      <h3 className="font-heading text-2xl font-bold leading-tight text-foreground">{member.full_name}</h3>
                      <p className="mt-1 text-sm font-medium text-primary">Эксперт курса</p>
                    </div>
                  </div>

                  {member.position && member.position !== "Эксперт курса" ? (
                    <p className="mt-5 text-foreground">{member.position}</p>
                  ) : null}
                  {member.bio ? <p className="mt-3 text-foreground">{member.bio}</p> : null}
                  {member.expertise ? (
                    <p className="mt-3 text-sm text-foreground">
                      <span className="font-semibold text-primary">Экспертиза:</span>{" "}
                      {member.expertise}
                    </p>
                  ) : null}
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-6">
          <div className="container max-w-6xl">
            <article className="relative overflow-hidden rounded-3xl border bg-card p-6 sm:p-8">
              <div className="pointer-events-none absolute inset-0">
                <span className="absolute -left-20 top-10 h-52 w-52 rounded-full bg-primary/10 blur-2xl" />
                <span className="absolute right-10 top-0 h-40 w-40 rounded-full bg-primary/10 blur-2xl" />
              </div>

              <div className="relative">
                <h2 className="text-center font-heading text-3xl font-bold text-foreground">
                  {specialOfferTitle}
                </h2>
                <p className="mt-3 text-center text-lg text-muted-foreground">
                  {specialOfferDescription}
                </p>

                <div className="mt-8">
                  <Button 
                    className="h-14 w-full text-base font-semibold"
                    onClick={() => setIsFormOpen(true)}
                  >
                    {specialOfferButtonText}
                  </Button>
                </div>
              </div>
            </article>
          </div>
        </section>

        {/* Кейсы студентов */}
        <section className="py-10">
          <div className="container max-w-6xl space-y-5">
            <h2 className="font-heading text-3xl font-bold">Кейсы наших студентов</h2>
            <div className="grid gap-4 lg:grid-cols-3">
              {studentCases.map((item) => (
                <article key={item.id} className="rounded-3xl border bg-muted/30 p-6">
                  <h3 className="text-2xl font-semibold text-foreground">{item.student_name}</h3>
                  {item.student_role ? <p className="mt-2 text-muted-foreground">{item.student_role}</p> : null}
                  <p className="mt-6 text-lg leading-relaxed text-foreground/80">{item.case_text}</p>
                  {item.case_image_url ? (
                    <img
                      src={item.case_image_url}
                      alt={`Фото кейса ${item.student_name}`}
                      className="mt-4 h-44 w-full rounded-xl object-cover"
                    />
                  ) : null}
                  {item.case_video_url ? (
                    <video
                      src={item.case_video_url}
                      controls
                      preload="metadata"
                      className="mt-4 h-44 w-full rounded-xl bg-black"
                    />
                  ) : null}
                  {item.result_text ? <p className="mt-5 text-base font-semibold text-primary">{item.result_text}</p> : null}
                </article>
              ))}
            </div>
          </div>
        </section>

        <CourseInstallmentBlock courseName="Построение эффективной команды" />

        {/* FAQ */}
        <section className="py-10">
          <div className="container max-w-6xl space-y-5">
            <h2 className="font-heading text-3xl font-bold">Часто задаваемые вопросы</h2>
            <div className="space-y-3">
              {faqList.map((faq, index) => {
                const isOpen = openFaqIndex === index;
                return (
                  <article key={faq.question} className="overflow-hidden rounded-2xl border bg-card">
                    <button
                      type="button"
                      onClick={() => toggleFaq(index)}
                      className="flex w-full items-center justify-between gap-4 p-5 text-left"
                    >
                      <h3 className="text-xl font-semibold text-foreground">{faq.question}</h3>
                      <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                        {isOpen ? <Minus className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
                      </span>
                    </button>
                    {isOpen ? (
                      <div className="relative border-t bg-muted/20 p-5">
                        <span className="pointer-events-none absolute left-6 top-0 h-full w-2 -rotate-12 bg-primary/10" />
                        <p className="relative pl-3 text-muted-foreground">{faq.answer}</p>
                      </div>
                    ) : null}
                  </article>
                );
              })}
            </div>
          </div>
        </section>


        {/* Bottom CTA */}
        <section id="apply" className="py-14">
          <div className="container max-w-6xl">
            <div className="relative overflow-hidden rounded-2xl border bg-card p-6 sm:p-8">
              <span className="pointer-events-none absolute left-[5%] top-0 h-full w-4 -rotate-12 bg-primary/10" />
              <span className="pointer-events-none absolute left-[42%] top-0 h-full w-3 rotate-[8deg] bg-primary/10" />
              <span className="pointer-events-none absolute right-[12%] top-0 h-full w-4 -rotate-[6deg] bg-primary/10" />
              <h2 className="relative font-heading text-3xl font-bold">
                {ctaTitle}
              </h2>
              <p className="relative mt-3 text-muted-foreground">
                {ctaDescription}
              </p>
              <div className="relative mt-6">
                <Button size="lg" onClick={() => setIsFormOpen(true)}>
                  {ctaButtonText}
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Form Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="w-[96vw] max-w-[760px] p-4 sm:p-6">
          <DialogTitle className="sr-only">Запись на курс</DialogTitle>
          <LeadFormContent compact />
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
}
