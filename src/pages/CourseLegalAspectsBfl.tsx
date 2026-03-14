import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useEffect, useMemo, useState } from "react";
import { Award, BookOpenCheck, Files, Minus, Plus, ShieldCheck, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LeadFormContent } from "@/components/LeadFormSection";
import CourseInstallmentBlock from "@/components/course/CourseInstallmentBlock";
import { api, Course, StudentCase, Teacher } from "@/lib/api";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/hooks/use-toast";

const highlights = [
  "Правильный вход в процедуру и снижение рисков на сложных делах",
  "Умение видеть дело глазами судьи, кредитора, АУ, должника и юриста",
  "Стандарты подготовки документов, взаимодействия с АУ, тестирование и сертификация",
];

const audience = [
  "Юристам по БФЛ, которые хотят поднять качество ведения дел и снизить ошибки входа в процедуру.",
  "Руководителям юридических компаний, которые строят производство по БФЛ: стандарты, взаимодействие с АУ, документооборот, управляемый результат.",
  "Специалистам, кто вошёл на рынок без подготовки и хочет быстро закрыть пробелы в теории и практике.",
];

const lessons = [
  {
    title: "Занятие 1. Вводное",
    points: [
      "Что даст курс, правила обучения, формат курс как игра",
      "Компетенции юриста по финансовому оздоровлению: технические, организационные, коммуникационные",
    ],
  },
  {
    title: "Занятие 2. Общие положения о банкротстве граждан",
    points: ["Несостоятельность, долги", "Что можно и нельзя списать и почему"],
  },
  {
    title: "Занятие 3. Основные игроки и их роли",
    points: [
      "Ролевые модели: суд, АУ, должник, представитель, кредиторы, уполномоченные органы",
      "Права и обязанности должника, ключевые юридические требования",
    ],
  },
  {
    title: "Занятие 4. Процедуры в банкротстве: как выбрать правильную",
    points: [
      "Судебные процедуры: реструктуризация, реализация имущества, мировое",
      "Внесудебная процедура",
      "Что нужно сделать, чтобы войти правильно",
    ],
  },
  {
    title: "Занятие 5. Упрощённое банкротство",
    points: ["Когда подходит и кому", "Логика отбора кейсов"],
  },
  {
    title: "Занятие 6. Бизнес на банкротстве и риски игроков",
    points: ["Процедура как бизнес", "Риски и ответственность юриста, ФУ, кредитора"],
  },
  {
    title: "Занятие 7. Торги в банкротстве: как защищать доверителя",
    points: [
      "Что подлежит реализации, как устроено положение о торгах",
      "Практическая логика сохранения имущества и минимизации потерь",
    ],
  },
  {
    title: "Занятие 8. Технология подготовки дела к процедуре",
    points: [
      "Карта аудита, сбор документов, пакет в суд",
      "Круги восприятия и упаковка юридической позиции",
    ],
  },
  {
    title: "Занятие 9. Взаимодействие с арбитражным управляющим",
    points: [
      "Тонкая настройка на общий результат",
      "Регламент: чаты, почта, совещания, инструменты партнёрства",
      "Лайфхаки работы с судами и процессом",
    ],
  },
  {
    title: "Занятие 10. Оспаривание сделок",
    points: ["Имущество и сделки", "Когда входить в процедуру и как оценивать риски/перспективу"],
  },
  {
    title: "Занятие 11. Образцы документов и стандарты",
    points: ["Стандарты подготовки пакета документов", "Шаблоны и материалы по программе"],
  },
  {
    title: "Занятие 12. Тестирование и сертификация",
    points: ["Порог 80% для сертификата", "Фиксация пробелов и план дальнейшего развития"],
  },
];

const sellingPoints = [
  "От старта до торгов — закрывает весь цикл дела",
  "Судебная логика + практика регионов и судей, а не вакуумная теория",
  "Технология подготовки дела и стандарты для масштабирования качества",
  "Взаимодействие с АУ как система: регламент, инструменты, партнёрская модель",
];

const faqItems = [
  {
    question: "Как проходит обучение?",
    answer:
      "Обучение проходит в записи: вы получаете доступ к материалам и можете смотреть уроки в любое удобное время, в своем темпе. В программе предусмотрены практические разборы, задания и тесты по темам для закрепления результата.",
  },
  {
    question: "Какой документ я получу после обучения?",
    answer:
      "После итогового тестирования можно получить удостоверение о повышении квалификации. По правилам курса порог успешного прохождения теста — от 80%.",
  },
  {
    question: "Смогу ли я пользоваться учебными материалами после окончания программы?",
    answer:
      "Да, по курсу предусмотрен неограниченный доступ к материалам: шаблонам документов, конспектам и рабочим чек-листам для практического применения.",
  },
  {
    question: "Можно ли задавать вопросы экспертам?",
    answer:
      "Да. Участники задают вопросы в процессе обучения и на разборах, чтобы адаптировать инструменты курса под свои реальные кейсы и рабочие задачи.",
  },
  {
    question: "Как организована практика на курсе?",
    answer:
      "Практика строится на разборе реальных ситуаций: аудит дела на входе, подготовка пакета документов, взаимодействие с АУ, стратегия по сложным случаям и оспариванию сделок.",
  },
  {
    question: "Что делать, если я пропущу занятие?",
    answer:
      "Можно посмотреть занятие в записи и пройти материалы модуля в удобном темпе. Затем выполнить задание и тест, чтобы не выпадать из общего прогресса.",
  },
  {
    question: "Можно ли совмещать обучение с работой?",
    answer:
      "Да, программа рассчитана на практикующих юристов и руководителей: занятия проводятся в рабочем ритме, а внедрение инструментов сразу идет в вашу текущую практику.",
  },
];

const teamOrderFallback = ["артин", "абукаев", "герасимов"];

const teamFallback: Teacher[] = [
  {
    id: "fallback-artin",
    full_name: "Василий Алексеевич Артин",
    position: "Ведущий эксперт курса",
    bio: "Эксперт по банкротству физлиц и руководитель практики.",
    expertise: "Стратегия ведения дел БФЛ, сложные кейсы, взаимодействие с АУ.",
    experience: "Практикующий эксперт",
    photo_url: "",
    display_order: 1,
    is_published: true,
    created_at: "",
    updated_at: "",
  },
  {
    id: "fallback-abukaev",
    full_name: "Абукаев",
    position: "Эксперт курса",
    bio: "Практикующий специалист по сопровождению процедур БФЛ.",
    expertise: "Подготовка документов, процессуальная стратегия, судебная практика.",
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
    bio: "Специалист по анализу судебной практики и оценке рисков.",
    expertise: "Анализ судебной практики по БФЛ, оценка рисков на входе в процедуру.",
    experience: "Практикующий эксперт",
    photo_url: "",
    display_order: 3,
    is_published: true,
    created_at: "",
    updated_at: "",
  },
];

const teamExpertiseByName: Record<string, string> = {
  артин:
    "Стратегия ведения дел БФЛ, правовой аудит на входе в процедуру, взаимодействие с арбитражными управляющими и судами.",
  абукаев:
    "Подготовка процессуальных документов по БФЛ, оценка рисков по кейсам, сопровождение клиента на всех этапах процедуры.",
  герасимов:
    "Анализ судебной практики по БФЛ, оценка рисков на входе в процедуру, стратегия защиты должника.",
};

const getTeamExpertise = (fullName: string) => {
  const lower = fullName.toLowerCase();
  if (lower.includes("артин")) return teamExpertiseByName.артин;
  if (lower.includes("абукаев")) return teamExpertiseByName.абукаев;
  if (lower.includes("герасимов")) return teamExpertiseByName.герасимов;
  return "Практическая экспертиза в сопровождении дел о банкротстве физических лиц.";
};

const fallbackStudentCases: StudentCase[] = [
  {
    id: "fallback-case-1",
    course_id: "",
    student_name: "Александр М.",
    student_role: "Выпускник курса",
    case_text:
      "После внедрения карты аудита и чек-листов сократил срок подготовки дела к подаче в суд с 5 дней до 2 дней. Снизил количество процессуальных доработок и повысил предсказуемость результата по делам БФЛ.",
    result_text: "Результат: рост конверсии в договор на 27%",
    is_published: true,
    display_order: 1,
    created_at: "",
    updated_at: "",
  },
  {
    id: "fallback-case-2",
    course_id: "",
    student_name: "Ольга К.",
    student_role: "Руководитель практики",
    case_text:
      "Перестроила работу команды по модульной схеме курса: отдельно аудит входа, отдельно сбор доказательств и сопровождение процедуры. Команда начала работать по единому стандарту, без просадок в качестве.",
    result_text: "Результат: +35% к производительности команды",
    is_published: true,
    display_order: 2,
    created_at: "",
    updated_at: "",
  },
  {
    id: "fallback-case-3",
    course_id: "",
    student_name: "Петр Н.",
    student_role: "Юрист по БФЛ",
    case_text:
      "Применил из курса модель взаимодействия с АУ и стандартизировал коммуникацию с доверителями. Это позволило закрыть частые возражения до суда и улучшить клиентский опыт без увеличения нагрузки.",
    result_text: "Результат: снижение отказов клиентов на 22%",
    is_published: true,
    display_order: 3,
    created_at: "",
    updated_at: "",
  },
  {
    id: "fallback-case-4",
    course_id: "",
    student_name: "Мария Л.",
    student_role: "Старший юрист",
    case_text:
      "После блока по торгам и оспариванию сделок улучшила стратегию по сложным делам с имуществом. Перешла от реактивной тактики к планированию рисков на входе в процедуру.",
    result_text: "Результат: +18% успешных кейсов в сложных делах",
    is_published: true,
    display_order: 4,
    created_at: "",
    updated_at: "",
  },
  {
    id: "fallback-case-5",
    course_id: "",
    student_name: "Сергей Д.",
    student_role: "Юрист по БФЛ",
    case_text:
      "Использовал модуль по реализации имущества и торгам. Правильно выстроил стратегию защиты единственного жилья клиента. Суд признал квартиру единственным жильём, должник сохранил недвижимость стоимостью 3,5 млн.",
    result_text: "Результат: сохранили единственное жильё на 3,5 млн",
    is_published: true,
    display_order: 5,
    created_at: "",
    updated_at: "",
  },
  {
    id: "fallback-case-6",
    course_id: "",
    student_name: "Наталья Р.",
    student_role: "Руководитель отдела",
    case_text:
      "Внедрила в отдел систему контроля качества на базе чек-листов из курса. Создала регламенты по каждому этапу процедуры БФЛ. Сократили количество ошибок на 68%, время обучения новых сотрудников уменьшилось с 3 месяцев до 5 недель.",
    result_text: "Результат: −68% ошибок, время обучения −46%",
    is_published: true,
    display_order: 6,
    created_at: "",
    updated_at: "",
  },
];

export default function CourseLegalAspectsBfl() {
  const [course, setCourse] = useState<Course | null>(null);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [studentCases, setStudentCases] = useState<StudentCase[]>(fallbackStudentCases);
  const [openLessonIndex, setOpenLessonIndex] = useState<number | null>(0);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDiscountFormOpen, setIsDiscountFormOpen] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [bookBannerUrl, setBookBannerUrl] = useState("");
  const [bookDownloadUrl, setBookDownloadUrl] = useState("");
  const [bookTitle, setBookTitle] = useState("Получите книгу по банкротству физических лиц 2026");
  const [bookDescription, setBookDescription] = useState(
    "Краткое практическое руководство по актуальным изменениям, судебной логике и безопасной стратегии ведения дел БФЛ."
  );

  const [bookFullName, setBookFullName] = useState("");
  const [bookPhone, setBookPhone] = useState("");
  const [bookEmail, setBookEmail] = useState("");
  const [bookConsentPolicy, setBookConsentPolicy] = useState(false);
  const [bookConsentOffers, setBookConsentOffers] = useState(true);
  const [bookSubmitting, setBookSubmitting] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);

    const fetchTeam = async () => {
      try {
        const data = await api.teachers.list(true);
        setTeachers(data || []);
      } catch {
        setTeachers([]);
      }
    };

    const fetchCases = async () => {
      try {
        const courses = await api.courses.list();
        const legalCourse =
          courses.find((course) => course.slug === "yuridicheskie-aspekty-bfl") ||
          courses.find((course) => {
            const title = course.title.toLowerCase();
            return title.includes("юридические аспекты") && title.includes("банкрот");
          });

        if (!legalCourse) {
          setStudentCases(fallbackStudentCases);
          return;
        }

        setCourse(legalCourse);

        const data = await api.studentCases.list(true, legalCourse?.id);
        setStudentCases(data?.length ? data : fallbackStudentCases);
      } catch {
        setStudentCases(fallbackStudentCases);
      }
    };

    const fetchSettings = async () => {
      try {
        const settings = await api.settings.list();
        const map = new Map(settings.map((item) => [item.setting_key, item.setting_value || ""]));
        setBookBannerUrl(map.get("bfl_book_banner_url") || map.get("hero_background_url") || "");
        setBookDownloadUrl(map.get("bfl_book_download_url") || "");
        setBookTitle(map.get("bfl_book_title") || "Получите книгу по банкротству физических лиц 2026");
        setBookDescription(
          map.get("bfl_book_description") ||
            "Краткое практическое руководство по актуальным изменениям, судебной логике и безопасной стратегии ведения дел БФЛ."
        );
      } catch {
        setBookBannerUrl("");
        setBookDownloadUrl("");
      }
    };

    fetchTeam();
    fetchCases();
    fetchSettings();
  }, []);

  const heroTitle = course?.hero_title || "Юридические аспекты БФЛ";
  const heroSubtitle = course?.hero_subtitle || course?.description || "Курс для старта юридической практики БФЛ";
  const heroDescription = course?.hero_description || course?.benefits || "";
  const heroHighlights = course?.hero_highlights?.length ? course.hero_highlights : highlights;
  const introTitle =
    course?.intro_title || "Быть квалифицированным специалистом в области БФЛ — значит управлять результатом, а не надеяться на случай";
  const introDescription =
    course?.intro_description ||
    "Квалифицированный юрист по банкротству физлиц видит дело системно: оценивает риски до входа в процедуру, выстраивает стратегию под позицию суда и кредиторов, грамотно взаимодействует с арбитражным управляющим и ведёт доверителя к прогнозируемому итогу. Это уровень, на котором вы снижаете процессуальные ошибки, экономите время команды, усиливаете доверие клиентов и формируете устойчивую профессиональную репутацию.";
  const learningResults = course?.learning_results?.length ? course.learning_results : [
    { title: "Удостоверение о повышении квалификации", text: "После обучения и итогового тестирования можно получить удостоверение о повышении квалификации." },
    { title: "Неограниченный доступ к материалам", text: "Конспекты, шаблоны, чек-листы и другие материалы курса остаются у вас без ограничения по времени." },
    { title: "Готовые шаблоны документов и чек-листы", text: "Практические инструменты для работы по БФЛ: от подготовки дела до сопровождения процедуры." },
    { title: "Алгоритмы снижения рисков в процедурах БФЛ", text: "Системные подходы к сложным кейсам, торгам, взаимодействию с АУ и оценке рисков на входе." },
  ];
  const programBadge = course?.program_badge || "Последние обновления курса";
  const programFeatures = course?.program_features?.length
    ? course.program_features
    : ["Дистанционное обучение в удобном формате", "Живые онлайн-вебинары с доступом к записи"];
  const programFormatTitle = course?.program_format_title || "Что будет на курсе";
  const programFormatDescription = course?.program_format_description || "Занятия по теории, практические вебинары, тесты и задания онлайн.";
  const lessonsList = course?.lessons?.length ? course.lessons : lessons;
  const audienceList = course?.target_audience?.length ? course.target_audience : audience;
  const sellingPointsList = course?.selling_points?.length ? course.selling_points : sellingPoints;
  const faqList = course?.faq_items?.length ? course.faq_items : faqItems;
  const materialsIncludes = course?.materials_includes?.length
    ? course.materials_includes
    : [
        "Актуальные изменения и практика 2026 года по банкротству граждан",
        "Чек-листы по подготовке дела и оценке рисков до подачи в суд",
        "Рабочие рекомендации по взаимодействию с АУ, кредиторами и доверителем",
      ];
  const specialOfferTitle = course?.special_offer_title || "Специальное предложение для комплексного обучения";
  const specialOfferDescription = course?.special_offer_description || "При покупке всех курсов сразу, скидка 20% на все";
  const specialOfferBadge = course?.special_offer_badge || "-20%";
  const specialOfferButtonText = course?.special_offer_button_text || "Забронировать цену со скидкой";
  const ctaTitle = course?.cta_title || "Готовы усилить юридическую практику БФЛ?";
  const ctaDescription = course?.cta_description || "Оставьте заявку — пришлём программу, формат участия и условия потока.";
  const ctaButtonText = course?.cta_button_text || "Открыть форму заявки";
  const teamOrder = course?.team_order?.length ? course.team_order : teamOrderFallback;

  const teamMembers = useMemo(() => {
    const found = teamOrder
      .map((query) =>
        teachers.find((t) => {
          const value = `${t.full_name} ${t.position ?? ""} ${t.bio ?? ""}`.toLowerCase();
          return value.includes(query);
        })
      )
      .filter(Boolean) as Teacher[];

    if (found.length === teamOrder.length) return found;

    return teamOrder.map((query, index) => {
      const match = found.find((t) => `${t.full_name} ${t.position ?? ""} ${t.bio ?? ""}`.toLowerCase().includes(query));
      return match ?? teamFallback[index];
    });
  }, [teachers]);

  const toggleLesson = (index: number) => {
    setOpenLessonIndex((prev) => (prev === index ? null : index));
  };

  const toggleFaq = (index: number) => {
    setOpenFaqIndex((prev) => (prev === index ? null : index));
  };

  const handleBookLeadSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!bookFullName.trim() || !bookPhone.trim()) {
      toast({ title: "Заполните поля", description: "Укажите имя и телефон.", variant: "destructive" });
      return;
    }

    if (!bookConsentPolicy) {
      toast({
        title: "Требуется согласие",
        description: "Подтвердите обработку персональных данных.",
        variant: "destructive",
      });
      return;
    }

    try {
      setBookSubmitting(true);
      await api.leads.create({
        full_name: bookFullName.trim(),
        phone: bookPhone.trim(),
        email: bookEmail.trim() || undefined,
        consent_policy: bookConsentPolicy,
        consent_offers: bookConsentOffers,
        source: "book_bfl_2026",
      });

      if (bookDownloadUrl) {
        const link = document.createElement("a");
        link.href = bookDownloadUrl;
        link.download = "";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast({ title: "Готово", description: "Заявка отправлена, книга скачивается." });
      } else {
        toast({
          title: "Заявка отправлена",
          description: "Файл книги еще не загружен в админке. Добавьте его в Настройках.",
        });
      }

      setBookFullName("");
      setBookPhone("");
      setBookEmail("");
      setBookConsentPolicy(false);
      setBookConsentOffers(true);
    } catch (error: any) {
      toast({ title: "Ошибка отправки", description: error.message, variant: "destructive" });
    } finally {
      setBookSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="animate-page-enter">
        <section className="py-16 sm:py-20">
          <div className="container max-w-6xl">
            <div className="grid gap-6 rounded-3xl bg-gradient-to-br from-primary via-primary-glow to-emerald-500 p-6 sm:p-8 lg:grid-cols-2 lg:p-10">
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

        <section className="pb-8">
          <div className="container max-w-6xl space-y-4">
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <article className="rounded-2xl border bg-card p-5">
                <div className="flex items-start gap-3">
                  <Award className="mt-0.5 h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">После обучения</p>
                    <p className="mt-1 text-base font-semibold text-foreground">{learningResults[0]?.title}</p>
                  </div>
                </div>
              </article>

              <article className="rounded-2xl border bg-card p-5">
                <div className="flex items-start gap-3">
                  <BookOpenCheck className="mt-0.5 h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Материалы курса</p>
                    <p className="mt-1 text-base font-semibold text-foreground">{learningResults[1]?.title}</p>
                  </div>
                </div>
              </article>

              <article className="rounded-2xl border bg-card p-5">
                <div className="flex items-start gap-3">
                  <Files className="mt-0.5 h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Практика в работе</p>
                    <p className="mt-1 text-base font-semibold text-foreground">{learningResults[2]?.title}</p>
                  </div>
                </div>
              </article>

              <article className="rounded-2xl border bg-card p-5">
                <div className="flex items-start gap-3">
                  <ShieldCheck className="mt-0.5 h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Сложные кейсы</p>
                    <p className="mt-1 text-base font-semibold text-foreground">{learningResults[3]?.title}</p>
                  </div>
                </div>
              </article>
            </div>

            <article className="relative overflow-hidden rounded-3xl border bg-card p-6 sm:p-8">
              <div className="pointer-events-none absolute inset-0">
                <span className="absolute left-[6%] top-[12%] h-[120%] w-6 -rotate-12 bg-primary/10" />
                <span className="absolute left-[38%] top-[-10%] h-[130%] w-4 rotate-6 bg-primary/10" />
                <span className="absolute left-[62%] top-[5%] h-[120%] w-5 -rotate-[18deg] bg-primary/10" />
                <span className="absolute left-[83%] top-[-6%] h-[140%] w-3 rotate-12 bg-primary/10" />
              </div>

              <div className="relative grid gap-6 lg:grid-cols-2 lg:gap-10">
                <h2 className="font-heading text-2xl font-semibold text-foreground sm:text-3xl">{introTitle}</h2>
                <p className="text-base leading-relaxed text-foreground sm:text-lg">{introDescription}</p>
              </div>
            </article>
          </div>
        </section>

        <section className="py-10">
          <div className="container max-w-6xl space-y-6">
            <h2 className="font-heading text-3xl font-bold">Команда курса — практикующие эксперты</h2>
            <div className="grid gap-4 lg:grid-cols-3">
              {teamMembers.map((member) => (
                <article key={member.id} className="rounded-2xl border bg-card p-5 h-full">
                  <div className="flex items-center gap-4">
                    <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-full bg-muted aspect-square">
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
                  <p className="mt-3 text-sm text-foreground">
                    <span className="font-semibold text-primary">Экспертиза:</span>{" "}
                    {member.expertise?.trim() || getTeamExpertise(member.full_name)}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="py-10">
          <div className="container max-w-6xl space-y-5">
            <div className="flex items-start justify-between gap-4">
              <h2 className="font-heading text-3xl font-bold">Программа обучения</h2>
              <p className="text-sm font-medium text-primary">{programBadge}</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <article className="rounded-2xl border bg-card p-5">
                <div className="flex items-start gap-3">
                  <Sparkles className="mt-0.5 h-5 w-5 text-primary" />
                  <div className="space-y-2 text-muted-foreground">
                    {programFeatures.map((item) => (
                      <p key={item}>{item}</p>
                    ))}
                  </div>
                </div>
              </article>
              <article className="rounded-2xl border bg-card p-5">
                <h3 className="text-lg font-semibold text-primary">{programFormatTitle}</h3>
                <p className="mt-2 text-muted-foreground">{programFormatDescription}</p>
              </article>
            </div>

            <div className="space-y-3">
              {lessonsList.map((lesson, index) => {
                const isOpen = openLessonIndex === index;
                const isLastLesson = index === lessonsList.length - 1;
                const materials = [
                  "Конспект и чек-лист по теме",
                  "Шаблоны документов для практики",
                  "Разбор типовых ошибок и вопросов",
                ];

                return (
                  <article key={lesson.title} className="overflow-hidden rounded-2xl border bg-card">
                    <button
                      type="button"
                      onClick={() => toggleLesson(index)}
                      className="flex w-full items-center justify-between gap-4 p-5 text-left"
                    >
                      <h3 className="font-heading text-xl font-semibold text-foreground">{lesson.title}</h3>
                      <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                        {isOpen ? <Minus className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
                      </span>
                    </button>

                    {isOpen ? (
                      <div className={`border-t bg-muted/20 p-5 ${isLastLesson ? "grid gap-6 md:grid-cols-2" : ""}`}>
                        <ul className="list-disc space-y-2 pl-5 text-muted-foreground">
                          {lesson.points.map((point) => (
                            <li key={point}>{point}</li>
                          ))}
                        </ul>

                        {isLastLesson ? (
                          <div>
                            <p className="font-semibold text-foreground">Материалы:</p>
                            <ul className="mt-2 space-y-2 text-muted-foreground">
                              {materials.map((material) => (
                                <li key={`${lesson.title}-${material}`}>{material}</li>
                              ))}
                            </ul>
                          </div>
                        ) : null}
                      </div>
                    ) : null}
                  </article>
                );
              })}
            </div>
          </div>
        </section>

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
                <p className="mt-3 text-center text-lg font-semibold text-primary">{specialOfferDescription}</p>

                <div className="mx-auto mt-6 flex max-w-3xl flex-wrap justify-center gap-3">
                  <div className="rounded-xl bg-primary px-6 py-4 text-lg font-bold text-primary-foreground">{specialOfferBadge}</div>
                </div>

                <div className="mt-8">
                  <Button className="h-14 w-full text-base font-semibold" onClick={() => setIsDiscountFormOpen(true)}>
                    {specialOfferButtonText}
                  </Button>
                </div>
              </div>
            </article>
          </div>
        </section>

        <section className="py-10">
          <div className="container max-w-6xl space-y-5">
            <h2 className="font-heading text-3xl font-bold">Кому подойдет программа</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <article className="relative overflow-hidden rounded-2xl border bg-card p-6">
                <span className="pointer-events-none absolute -left-6 top-0 h-full w-4 -rotate-12 bg-primary/10" />
                <span className="pointer-events-none absolute right-10 top-0 h-full w-3 rotate-6 bg-primary/10" />
                <span className="absolute right-4 top-4 h-8 w-8 rounded-lg bg-primary/15" />
                <h3 className="pr-12 text-2xl font-semibold text-foreground">Юристам по БФЛ</h3>
                <p className="mt-4 text-muted-foreground">{audienceList[0] || audience[0]}</p>
              </article>

              <article className="relative overflow-hidden rounded-2xl border bg-card p-6">
                <span className="pointer-events-none absolute -left-4 top-0 h-full w-3 -rotate-[16deg] bg-primary/10" />
                <span className="pointer-events-none absolute right-16 top-0 h-full w-4 rotate-12 bg-primary/10" />
                <span className="absolute right-4 top-4 h-8 w-8 rounded-lg bg-primary/15" />
                <h3 className="pr-12 text-2xl font-semibold text-foreground">Руководителям юридических компаний</h3>
                <p className="mt-4 text-muted-foreground">{audienceList[1] || audience[1]}</p>
              </article>

              <article className="relative overflow-hidden rounded-2xl border bg-card p-6 md:col-span-2">
                <span className="pointer-events-none absolute left-[8%] top-0 h-full w-4 -rotate-[10deg] bg-primary/10" />
                <span className="pointer-events-none absolute left-[58%] top-0 h-full w-3 rotate-[9deg] bg-primary/10" />
                <span className="absolute right-4 top-4 h-8 w-8 rounded-lg bg-primary/15" />
                <h3 className="pr-12 text-2xl font-semibold text-foreground">Специалистам без системной подготовки</h3>
                <p className="mt-4 text-muted-foreground">{audienceList[2] || audience[2]}</p>
              </article>
            </div>
          </div>
        </section>

        <section className="py-10">
          <div className="container max-w-6xl space-y-5">
            <h2 className="font-heading text-3xl font-bold">Кейсы наших студентов</h2>
            <div className="grid gap-4 lg:grid-cols-3">
              {studentCases.map((item) => (
                <article key={item.id} className="flex flex-col overflow-hidden rounded-3xl border bg-muted/30 p-6">
                  <div className="flex items-center gap-3">
                    {item.case_image_url ? (
                      <img src={item.case_image_url} alt={item.student_name} className="h-12 w-12 flex-shrink-0 rounded-full object-cover" />
                    ) : null}
                    <div>
                      <h3 className="text-lg font-semibold text-foreground">{item.student_name}</h3>
                      {item.student_role ? <p className="mt-0.5 text-sm text-muted-foreground">{item.student_role}</p> : null}
                    </div>
                  </div>
                  {item.case_text ? <p className="mt-4 flex-1 text-base leading-relaxed text-foreground/80">{item.case_text}</p> : null}
                  {item.result_text ? (
                    <p className="mt-4 rounded-xl bg-primary/10 px-4 py-2 text-sm font-semibold text-primary">{item.result_text}</p>
                  ) : null}
                  {item.case_video_url ? (
                    <video src={item.case_video_url} controls preload="metadata" className="mt-4 aspect-video w-full rounded-xl bg-black" />
                  ) : null}
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="py-10">
          <div className="container max-w-6xl space-y-5">
            <h2 className="font-heading text-3xl font-bold">Полезный материал по БФЛ</h2>
            <div className="grid gap-4 lg:grid-cols-2">
              <article
                className="relative overflow-hidden rounded-3xl border p-8 text-white sm:p-10"
                style={
                  bookBannerUrl
                    ? {
                        backgroundImage: `linear-gradient(rgba(4, 60, 46, 0.50), rgba(4, 60, 46, 0.60)), url(${bookBannerUrl})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                      }
                    : {
                        background: "linear-gradient(135deg, #16a34a 0%, #0d9488 50%, #34d399 100%)",
                      }
                }
              >
                <h3 className="font-heading text-3xl font-bold leading-tight">{bookTitle}</h3>
                <p className="mt-5 text-lg leading-relaxed text-white/90">{bookDescription}</p>
                <ul className="mt-7 list-disc space-y-2 pl-5 text-base text-white/90">
                  {materialsIncludes.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </article>

              <div className="rounded-3xl border border-border bg-card p-6 sm:p-8">
                <form className="space-y-4" onSubmit={handleBookLeadSubmit}>
                  <Input
                    className="h-14 rounded-xl bg-muted/40 text-base"
                    placeholder="Имя и фамилия"
                    value={bookFullName}
                    onChange={(e) => setBookFullName(e.target.value)}
                    required
                  />
                  <Input
                    className="h-14 rounded-xl bg-muted/40 text-base"
                    placeholder="+7 (000) 000-00-00"
                    value={bookPhone}
                    onChange={(e) => setBookPhone(e.target.value)}
                    required
                  />
                  <Input
                    className="h-14 rounded-xl bg-muted/40 text-base"
                    placeholder="Email"
                    type="email"
                    value={bookEmail}
                    onChange={(e) => setBookEmail(e.target.value)}
                  />

                  <label className="flex items-start gap-3 text-sm text-muted-foreground">
                    <Checkbox
                      checked={bookConsentPolicy}
                      onCheckedChange={(v) => setBookConsentPolicy(Boolean(v))}
                      className="mt-0.5"
                    />
                    <span>Я согласен с обработкой персональных данных в соответствии с политикой обработки и офертой</span>
                  </label>

                  <label className="flex items-start gap-3 text-sm text-muted-foreground">
                    <Checkbox
                      checked={bookConsentOffers}
                      onCheckedChange={(v) => setBookConsentOffers(Boolean(v))}
                      className="mt-0.5"
                    />
                    <span>Я соглашаюсь получать уведомления о новых продуктах и предложениях</span>
                  </label>

                  <Button
                    type="submit"
                    className="mt-2 h-14 w-full rounded-xl bg-foreground text-base font-semibold text-background hover:bg-foreground/90"
                    disabled={!bookConsentPolicy || bookSubmitting}
                  >
                    {bookSubmitting ? "Отправка..." : "Получить книгу и скачать"}
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </section>
        <section className="py-10">
          <div className="container max-w-6xl space-y-5">
            <h2 className="font-heading text-3xl font-bold">Преимущества курса</h2>
            <div className="grid gap-4 md:grid-cols-2">
              {sellingPointsList.map((item) => (
                <article key={item} className="relative overflow-hidden rounded-2xl border bg-card p-6">
                  <span className="pointer-events-none absolute -left-5 top-0 h-full w-3 -rotate-12 bg-primary/10" />
                  <span className="pointer-events-none absolute right-10 top-0 h-full w-2 rotate-6 bg-primary/10" />
                  <span className="absolute right-4 top-4 h-8 w-8 rounded-lg bg-primary/15" />
                  <p className="pr-12 text-2xl font-semibold text-foreground">{item}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="py-10">
          <div className="container max-w-6xl space-y-5">
            <h2 className="font-heading text-3xl font-bold">Отвечаем на вопросы</h2>
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
                      <h3 className="text-2xl font-semibold text-foreground">{faq.question}</h3>
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

        <CourseInstallmentBlock courseName="Юридические аспекты процедуры банкротства граждан 2.0" />

        <section id="apply" className="py-14">
          <div className="container max-w-6xl">
            <div className="relative overflow-hidden rounded-2xl border bg-card p-6 sm:p-8">
              <span className="pointer-events-none absolute left-[5%] top-0 h-full w-4 -rotate-12 bg-primary/10" />
              <span className="pointer-events-none absolute left-[42%] top-0 h-full w-3 rotate-[8deg] bg-primary/10" />
              <span className="pointer-events-none absolute right-[12%] top-0 h-full w-4 -rotate-[6deg] bg-primary/10" />
              <h2 className="relative font-heading text-3xl font-bold">{ctaTitle}</h2>
              <p className="relative mt-3 text-muted-foreground">{ctaDescription}</p>
              <div className="relative mt-6"><Button className="h-12 px-8 text-base" onClick={() => setIsFormOpen(true)}>{ctaButtonText}</Button></div>
            </div>
          </div>
        </section>
      </main>

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="w-[96vw] max-w-[760px] p-4 sm:p-6">
          <DialogTitle className="sr-only">Запись на курс</DialogTitle>
          <LeadFormContent compact />
        </DialogContent>
      </Dialog>

      <Dialog open={isDiscountFormOpen} onOpenChange={setIsDiscountFormOpen}>
        <DialogContent className="w-[96vw] max-w-[760px] p-4 sm:p-6">
          <DialogTitle className="sr-only">Заявка со скидкой</DialogTitle>
          <LeadFormContent compact />
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
}
