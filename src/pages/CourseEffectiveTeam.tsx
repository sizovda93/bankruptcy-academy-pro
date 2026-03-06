import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useEffect, useMemo, useState } from "react";
import { Award, BookOpenCheck, Files, Minus, Plus, ShieldCheck, Sparkles, Users, Target, Settings, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LeadFormContent } from "@/components/LeadFormSection";
import { api, StudentCase, Teacher } from "@/lib/api";
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

const teamOrder = ["артин", "сизов", "герасимов", "лященко"];

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

export default function CourseEffectiveTeam() {
  const [openModuleIndex, setOpenModuleIndex] = useState<number | null>(0);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loadingTeachers, setLoadingTeachers] = useState(true);
  const [studentCases, setStudentCases] = useState<StudentCase[]>([]);
  const [loadingCases, setLoadingCases] = useState(true);

  // Download form states
  const [isDownloadFormOpen, setIsDownloadFormOpen] = useState(false);
  const [downloadName, setDownloadName] = useState("");
  const [downloadEmail, setDownloadEmail] = useState("");
  const [downloadPhone, setDownloadPhone] = useState("");
  const [downloadConsent, setDownloadConsent] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

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
        const allCases = await api.studentCases.list();
        const filtered = allCases.filter(
          (c) => {
            // Проверяем по course_id, если есть связь
            if (c.course_id) {
              // Здесь можно добавить проверку по ID курса, когда он будет загружен
              return false; // пока фильтруем по названию ниже
            }
            // Или по тексту кейса, если содержит ключевые слова
            const text = (c.case_text || '').toLowerCase();
            return text.includes('команд') || text.includes('руководи') || text.includes('kpi') || text.includes('наним');
          }
        );
        setStudentCases(filtered || []);
      } catch {
        setStudentCases([]);
      } finally {
        setLoadingCases(false);
      }
    };

    fetchTeachers();
    fetchCases();
  }, []);

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
  }, [teachers, loadingTeachers]);

  const toggleModule = (index: number) => {
    setOpenModuleIndex((prev) => (prev === index ? null : index));
  };

  const toggleFaq = (index: number) => {
    setOpenFaqIndex((prev) => (prev === index ? null : index));
  };

  const handleDownloadMaterials = async () => {
    if (!downloadName || !downloadEmail || !downloadPhone || !downloadConsent) {
      toast({
        title: "Заполните все поля",
        description: "Пожалуйста, заполните все обязательные поля и дайте согласие на обработку данных",
        variant: "destructive",
      });
      return;
    }

    setIsDownloading(true);

    try {
      await api.leads.create({
        full_name: downloadName,
        email: downloadEmail,
        phone: downloadPhone,
        source: "course_materials_effective_team",
        consent_given: downloadConsent,
      });

      toast({
        title: "Материалы отправлены",
        description: "Ссылка на скачивание материалов курса отправлена на вашу почту",
      });

      // Simulate download link
      const link = document.createElement("a");
      link.href = "#";
      link.download = "effective-team-materials.pdf";
      link.click();

      setIsDownloadFormOpen(false);
      setDownloadName("");
      setDownloadEmail("");
      setDownloadPhone("");
      setDownloadConsent(false);
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось отправить заявку. Попробуйте позже.",
        variant: "destructive",
      });
    } finally {
      setIsDownloading(false);
    }
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
                <p className="text-sm font-semibold uppercase tracking-wider text-white/70">Практический курс</p>
                <h1 className="mt-2 font-heading text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
                  Эффективная команда
                </h1>
                <p className="mt-6 text-lg leading-relaxed text-white/90 sm:text-xl">
                  Практический курс для руководителей, которые хотят собрать эффективную команду и выйти из
                  операционки: оргструктура и роли, KPI и мотивация, процессы и регламенты, управление задачами и
                  контроль качества, найм и адаптация.
                </p>
                <div className="mt-8 grid gap-3">
                  {highlights.map((item) => (
                    <div key={item} className="flex items-start gap-2">
                      <div className="mt-1 h-5 w-5 flex-shrink-0 rounded-full bg-white/20 p-1">
                        <div className="h-full w-full rounded-full bg-white" />
                      </div>
                      <span className="text-sm font-medium text-white">{item}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-8 flex flex-wrap gap-3">
                  <Button
                    size="lg"
                    className="bg-white text-primary hover:bg-white/90"
                    onClick={() => setIsFormOpen(true)}
                  >
                    Записаться на курс
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-white/40 bg-white/10 text-white hover:bg-white/20"
                    onClick={() => setIsDownloadFormOpen(true)}
                  >
                    <Files className="mr-2 h-4 w-4" />
                    Скачать программу
                  </Button>
                </div>
              </div>
              <div className="relative">
                <div className="aspect-square overflow-hidden rounded-2xl border-4 border-white/20 bg-white/10 backdrop-blur">
                  <div className="flex h-full items-center justify-center">
                    <Users className="h-32 w-32 text-white/40" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Для кого курс */}
        <section className="py-10">
          <div className="container max-w-6xl space-y-5">
            <h2 className="font-heading text-3xl font-bold">Для кого этот курс</h2>
            <div className="grid gap-4 md:grid-cols-2">
              {audience.map((item) => (
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
              {sellingPoints.map((item, index) => {
                const icons = [Target, Settings, TrendingUp, Users, Sparkles];
                const Icon = icons[index % icons.length];
                return (
                  <article key={item} className="relative overflow-hidden rounded-2xl border bg-card p-6">
                    <span className="pointer-events-none absolute -left-5 top-0 h-full w-3 -rotate-12 bg-primary/10" />
                    <div className="flex items-start gap-3">
                      <div className="rounded-lg bg-primary/10 p-2">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      <p className="text-base font-medium text-foreground">{item}</p>
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
              <p className="text-sm font-medium text-primary">{lessons.length} модулей</p>
            </div>

            <div className="space-y-3">
              {lessons.map((lesson, index) => {
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
              {practicalTasks.map((task) => (
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
            <h2 className="font-heading text-3xl font-bold">Материалы курса (шаблоны)</h2>
            <p className="text-lg text-muted-foreground">
              Все участники получают готовые шаблоны и инструменты для внедрения:
            </p>
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              {materials.map((material) => (
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
          <div className="container max-w-6xl space-y-5">
            <h2 className="font-heading text-3xl font-bold">Команда преподавателей</h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {sortedTeachers.map((teacher) => (
                <article key={teacher.id} className="overflow-hidden rounded-2xl border bg-card">
                  <div className="aspect-square overflow-hidden bg-muted">
                    {teacher.photo_url ? (
                      <img
                        src={teacher.photo_url}
                        alt={teacher.full_name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-primary/10">
                        <span className="text-4xl font-bold text-primary">
                          {teacher.full_name.charAt(0)}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-heading text-lg font-semibold text-foreground">
                      {teacher.full_name}
                    </h3>
                    <p className="mt-1 text-sm text-primary">{teacher.position}</p>
                    {teacher.expertise && (
                      <p className="mt-2 text-sm text-muted-foreground">{teacher.expertise}</p>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Кейсы студентов */}
        {!loadingCases && studentCases.length > 0 && (
          <section className="py-10">
            <div className="container max-w-6xl space-y-5">
              <h2 className="font-heading text-3xl font-bold">Результаты студентов</h2>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {studentCases.map((studentCase) => (
                  <article key={studentCase.id} className="rounded-2xl border bg-card p-6">
                    <div className="mb-4 flex items-center gap-2">
                      <Award className="h-5 w-5 text-primary" />
                      <p className="font-semibold text-primary">{studentCase.student_name}</p>
                    </div>
                    <p className="text-base leading-relaxed text-foreground">{studentCase.case_text}</p>
                    {studentCase.result_text && (
                      <p className="mt-4 text-sm font-medium text-primary">
                        Результат: {studentCase.result_text}
                      </p>
                    )}
                  </article>
                ))}
              </div>
            </div>
          </section>
        )}

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
                  Готовы построить эффективную команду?
                </h2>
                <p className="mt-3 text-center text-lg text-muted-foreground">
                  Записывайтесь на курс и получите готовую систему управления за 8–10 недель
                </p>

                <div className="mt-8 flex flex-wrap justify-center gap-4">
                  <Button size="lg" onClick={() => setIsFormOpen(true)}>
                    Записаться на курс
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={() => setIsDownloadFormOpen(true)}
                  >
                    <Files className="mr-2 h-4 w-4" />
                    Скачать программу
                  </Button>
                </div>
              </div>
            </article>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-10">
          <div className="container max-w-6xl space-y-5">
            <h2 className="font-heading text-3xl font-bold">Часто задаваемые вопросы</h2>
            <div className="space-y-3">
              {faqItems.map((faq, index) => {
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
                Начните строить команду, которая приносит результат
              </h2>
              <p className="relative mt-3 text-muted-foreground">
                Оставьте заявку — получите программу курса, условия участия и консультацию по подбору формата
                обучения.
              </p>
              <div className="relative mt-6">
                <Button size="lg" onClick={() => setIsFormOpen(true)}>
                  Записаться на курс
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

      {/* Download Materials Dialog */}
      <Dialog open={isDownloadFormOpen} onOpenChange={setIsDownloadFormOpen}>
        <DialogContent className="w-[96vw] max-w-[500px] p-6">
          <DialogTitle className="text-2xl font-bold">Скачать программу курса</DialogTitle>
          <div className="mt-4 space-y-4">
            <div className="space-y-2">
              <label htmlFor="download-name" className="text-sm font-medium">
                Ваше имя <span className="text-destructive">*</span>
              </label>
              <Input
                id="download-name"
                placeholder="Введите ваше имя"
                value={downloadName}
                onChange={(e) => setDownloadName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="download-email" className="text-sm font-medium">
                Email <span className="text-destructive">*</span>
              </label>
              <Input
                id="download-email"
                type="email"
                placeholder="your@email.com"
                value={downloadEmail}
                onChange={(e) => setDownloadEmail(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="download-phone" className="text-sm font-medium">
                Телефон <span className="text-destructive">*</span>
              </label>
              <Input
                id="download-phone"
                type="tel"
                placeholder="+7 (___) ___-__-__"
                value={downloadPhone}
                onChange={(e) => setDownloadPhone(e.target.value)}
              />
            </div>

            <div className="flex items-start gap-2">
              <Checkbox
                id="download-consent"
                checked={downloadConsent}
                onCheckedChange={(checked) => setDownloadConsent(checked === true)}
              />
              <label htmlFor="download-consent" className="text-sm text-muted-foreground">
                Я даю согласие на обработку персональных данных <span className="text-destructive">*</span>
              </label>
            </div>

            <Button
              className="w-full"
              size="lg"
              onClick={handleDownloadMaterials}
              disabled={isDownloading}
            >
              {isDownloading ? "Отправка..." : "Скачать материалы"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
}
