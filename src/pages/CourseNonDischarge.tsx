import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useEffect, useMemo, useState } from "react";
import { BookOpenCheck, Files, ShieldCheck, Sparkles, Minus, Plus, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LeadFormContent } from "@/components/LeadFormSection";
import CourseInstallmentBlock from "@/components/course/CourseInstallmentBlock";
import { api, Course, StudentCase, Teacher } from "@/lib/api";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/hooks/use-toast";

const highlights = [
  "Предбанкротный аудит: выявляем «красные флаги» риска неосвобождения",
  "Доказательства добросовестности должника и стратегия защиты",
  "Готовые ответы на возражения кредиторов и ФНС",
];

const audience = [
  "Юристам по БФЛ — чтобы перестать брать «минные» кейсы без защиты и повысить % списаний.",
  "Финансовым управляющим / помощникам АУ — чтобы понимать, какие действия должника критичны, как фиксировать добросовестность и не попадать в конфликт интересов.",
  "Руководителям юр. компаний — чтобы внедрить стандарты предбанкротного аудита и снизить репутационные/финансовые риски по «провальным» делам.",
  "Юристам кредиторов — чтобы понимать, в каких случаях реально «срезать» списание и какие доказательства требуются.",
];

const modules = [
  {
    title: "Модуль 1. Что такое «неосвобождение»: виды и последствия",
    points: [
      "Полное/частичное неосвобождение от обязательств",
      "Когда суд может «не списать» даже после формального окончания процедуры",
      "Последствия для должника и как это влияет на стратегию входа в процедуру",
      "Типовые источники риска: поведение до банкротства, поведение в банкротстве, позиция кредиторов",
    ],
  },
  {
    title: "Модуль 2. Логика суда: «добросовестный должник» глазами практики",
    points: [
      "Какие критерии добросовестности реально работают",
      "Что суд считает «нормальными жизненными обстоятельствами»",
      "Где начинается злоупотребление правом",
      "Почему одинаковые факты могут трактоваться по-разному (и как уменьшить вариативность)",
    ],
  },
  {
    title: "Модуль 3. Предбанкротный аудит: матрица риска неосвобождения",
    points: [
      "Быстрый скрининг клиента на входе",
      "«Красные флаги» (критические), «жёлтые» (управляемые), «зелёные» (безопасные)",
      "Итог: скоринг + решение: берём/не берём/берём с условиями",
      "Как фиксировать риски в договоре и информировании клиента",
    ],
  },
  {
    title: "Модуль 4. Самые частые основания неосвобождения",
    points: [
      "Сокрытие имущества / недостоверные сведения",
      "Нераскрытие счетов/доходов/активов",
      "Фиктивные долги и «рисованные кредиторы»",
      "Вывод активов, оспариваемые сделки (дарения, продажи «в минус», раздел имущества)",
      "Предпочтение одному кредитору",
      "Неправомерное поведение с кредитами: намеренное наращивание долгов",
      "Игнорирование требований суда/ФУ, срыв процедуры",
    ],
  },
  {
    title: "Модуль 5. Кредиты, займы, МФО: недобросовестное заимствование",
    points: [
      "«Набирал кредиты без намерения возвращать» — какие факты подтверждают",
      "Крупные покупки перед банкротством, снятие наличных, «разброс» по МФО",
      "Как объяснять экономику: доходы/расходы/семейная ситуация/форс-мажор",
      "Какие документы и объяснения снижают риск",
    ],
  },
  {
    title: "Модуль 6. Доходы, работа, ИП, самозанятость: прозрачность финансов",
    points: [
      "Белые/серые доходы и позиция суда",
      "ИП: смешение личного/делового, кассовая дисциплина, активы",
      "Алименты, обязательные платежи, «скрытые» источники",
      "Как готовить финансовую картину, чтобы она не выглядела противоречиво",
    ],
  },
  {
    title: "Модуль 7. Имущество: что нельзя «терять» и как правильно раскрывать",
    points: [
      "Недвижимость/доли/ипотека/единственное жильё",
      "Автомобили, техника, предметы роскоши",
      "Банковские счета, электронные кошельки, крипта",
      "Совместная собственность и конфликты с супругами",
      "Главная мысль: не «прятать», а управлять раскрытием и доказательствами",
    ],
  },
  {
    title: "Модуль 8. Поведение должника в процедуре: что убивает списание",
    points: [
      "Неявка, игнор запросов, затягивание, отсутствие коммуникации",
      "«Пассивность» должника как маркер недобросовестности",
      "Ошибки в заявлениях/анкете/объяснениях",
      "Как выстроить регламент: документы, сроки, ответы, дисциплина",
    ],
  },
  {
    title: "Модуль 9. Возражения кредиторов и ФНС: как готовиться заранее",
    points: [
      "Типовые позиции кредиторов: злоупотребление, сокрытие, фиктивность",
      "Позиция уполномоченного органа (налоги/взносы)",
      "Тактика: как закрывать аргументы документами и логикой",
      "«Пакет защитной позиции» до первого заседания",
    ],
  },
  {
    title: "Модуль 10. Стратегия сложных кейсов",
    points: [
      "Что делать, если у клиента были «сомнительные» действия до банкротства",
      "Когда разумнее: ждать/перестраивать/выбирать иную стратегию",
      "Мировое/реструктуризация/реализация — как выбор процедуры влияет на риски",
      "Как работать, если уже начались споры/оспаривание сделок",
    ],
  },
  {
    title: "Модуль 11. Судебная тактика и доказательства добросовестности",
    points: [
      "Как выстраивать «историю дела» для суда: причинно-следственная связь",
      "Базовый пакет доказательств: доходы/расходы/семья/болезни/увольнение/падение бизнеса",
      "Объяснения должника: структура, тональность, что нельзя писать",
      "Свидетели, переписка, документы, экспертиза — когда уместно",
    ],
  },
  {
    title: "Модуль 12. Кейсбук: практика по категориям",
    points: [
      "Разборы 10–15 кейсов: кредитный «перекредит», массовые МФО",
      "Покупка авто/техники перед банкротством",
      "Дарение/раздел имущества",
      "Сокрытие дохода/работы",
      "ИП с выводом активов",
      "Конфликт с ФНС",
      "Непредоставление документов ФУ",
      "На каждом кейсе: факты → риск → позиция кредитора → позиция должника → решение суда → выводы",
    ],
  },
  {
    title: "Модуль 13. Документы и шаблоны (что забирают в работу)",
    points: [
      "Анкета клиента «риски неосвобождения»",
      "Чек-лист «что нельзя делать до/во время банкротства»",
      "Матрица риска (скоринг)",
      "Шаблон объяснений должника для суда",
      "Шаблон ответа на возражения кредитора/ФНС",
      "Регламент коммуникации должник ↔ юрист ↔ ФУ",
    ],
  },
  {
    title: "Модуль 14. Итоговая аттестация",
    points: [
      "Тест + практическая задача: оценить кейс и собрать «пакет добросовестности»",
      "Критерии: выявление рисков, доказательства, стратегия, процессуальная логика",
      "Получение сертификата о прохождении курса",
    ],
  },
];

const results = [
  {
    icon: Target,
    title: "Предбанкротный комплаенс",
    text: "Выявляете факторы риска неосвобождения и даёте честный прогноз клиенту. Собираете доказательства добросовестности должника и правильно формируете позицию в суде.",
  },
  {
    icon: ShieldCheck,
    title: "Понимание логики суда",
    text: "Знаете, какие действия/события суд квалифицирует как недобросовестность, злоупотребление правом, фиктивность долгов, вывод активов, сокрытие имущества/доходов.",
  },
  {
    icon: BookOpenCheck,
    title: "Коммуникация с должником",
    text: "Выстраиваете правильные коммуникации: что можно/нельзя делать до и во время процедуры. Умеете отбивать типовые возражения кредиторов/ФНС.",
  },
  {
    icon: Files,
    title: "Готовые инструменты",
    text: "Чек-листы поведения, анкеты риска, шаблоны объяснений в суд, сценарии поведения в процедуре, матрица скоринга клиента.",
  },
];

const sellingPoints = [
  "Полный обзор судебной практики БФЛ по неосвобождению",
  "Система предбанкротного аудита и скоринга риска",
  "Чек-лист поведения должника (что нельзя делать до/во время процедуры)",
  "Пакет доказательств добросовестности (шаблоны, структура, логика)",
  "Готовые ответы на возражения кредиторов/ФНС",
  "Кейсбук 10–15 типовых сценариев из реальной практики",
];

const faqItems = [
  {
    question: "Как проходит обучение?",
    answer:
      "Обучение проходит в формате: 8–12 занятий по 90–120 минут, видео-уроки доступны в любое время. После каждого модуля — домашнее задание (мини-кейс + сбор документов/позиции). Предусмотрены 2–3 живых разборных сессии «принеси своё дело» и чат сопровождения.",
  },
  {
    question: "Какой документ я получу после обучения?",
    answer:
      "После успешной сдачи итоговой аттестации (тест + практическая задача: оценить кейс и собрать «пакет добросовестности») вы получаете сертификат о прохождении курса.",
  },
  {
    question: "Смогу ли я пользоваться материалами после окончания?",
    answer:
      "Да, по курсу предусмотрен неограниченный доступ к базе шаблонов: анкета клиента, чек-листы, матрица риска, шаблоны объяснений, ответы на возражения, регламенты коммуникации.",
  },
  {
    question: "Можно ли задавать вопросы по своим кейсам?",
    answer:
      "Да. В программе предусмотрены разборные сессии по реальным кейсам участников («принеси своё дело»), а также чат сопровождения для вопросов экспертам курса.",
  },
  {
    question: "Подойдет ли курс начинающим юристам?",
    answer:
      "Да, курс построен от основ (виды неосвобождения, логика суда) до продвинутых тактик (сложные кейсы, судебная стратегия). Подходит как начинающим юристам по БФЛ, так и опытным специалистам.",
  },
  {
    question: "Что делать, если я пропущу занятие?",
    answer:
      "Все занятия доступны в записи, вы можете посмотреть их в удобное время. Главное — выполнять домашние задания для закрепления материала.",
  },
  {
    question: "Можно ли совмещать обучение с работой?",
    answer:
      "Да, программа рассчитана на практикующих юристов. Занятия в записи, домашние задания и кейсы помогают сразу применять знания в текущих делах.",
  },
];

const teamOrderFallback = ["артин", "герасимов", "абукаев", "лященко"];

const teamFallback: Teacher[] = [
  {
    id: "fallback-nondischarge-1",
    full_name: "Василий Алексеевич Артин",
    position: "Ведущий эксперт курса",
    bio: "Эксперт по банкротству физических лиц и стратегии защиты от неосвобождения.",
    expertise: "Предбанкротный аудит, стратегия защиты должника, построение доказательственной базы добросовестности.",
    experience: "Практикующий эксперт",
    photo_url: "",
    display_order: 1,
    is_published: true,
    created_at: "",
    updated_at: "",
  },
  {
    id: "fallback-nondischarge-2",
    full_name: "Герасимов Александр Валерьевич",
    position: "Эксперт курса",
    bio: "Специалист по анализу рисков и судебной практике в банкротстве.",
    expertise: "Матрица риска неосвобождения, скоринг клиентов, анализ судебной практики по добросовестности.",
    experience: "Практикующий эксперт",
    photo_url: "",
    display_order: 2,
    is_published: true,
    created_at: "",
    updated_at: "",
  },
  {
    id: "fallback-nondischarge-3",
    full_name: "Абукаев Андрей Александрович",
    position: "Эксперт курса",
    bio: "Эксперт по процессуальной работе и отработке возражений кредиторов.",
    expertise: "Судебная тактика защиты от неосвобождения, возражения ФНС и кредиторов, процессуальные документы.",
    experience: "Практикующий эксперт",
    photo_url: "",
    display_order: 3,
    is_published: true,
    created_at: "",
    updated_at: "",
  },
  {
    id: "fallback-nondischarge-4",
    full_name: "Лященко Елена Юрьевна",
    position: "Арбитражный управляющий",
    bio: "Эксперт по стандартизации процессов и коммуникации в банкротстве.",
    expertise: "Регламенты поведения должника, взаимодействие с финансовым управляющим, контроль процедуры.",
    experience: "15 лет",
    photo_url: "",
    display_order: 4,
    is_published: true,
    created_at: "",
    updated_at: "",
  },
];

const teamExpertiseByName: Record<string, string> = {
  артин:
    "Предбанкротный аудит и скоринг рисков, стратегия защиты должника от неосвобождения, построение доказательственной базы добросовестности.",
  герасимов:
    "Матрица риска неосвобождения, анализ судебной практики, скоринг клиентов и оценка перспектив списания долгов.",
  абукаев:
    "Судебная тактика и процессуальная работа, отработка возражений ФНС и кредиторов, подготовка процессуальных документов.",
  лященко:
    "Регламенты поведения должника в процедуре, взаимодействие с финансовым управляющим, контроль и стандарты коммуникации.",
};

const getTeamExpertise = (fullName: string) => {
  const lower = fullName.toLowerCase();
  if (lower.includes("артин")) return teamExpertiseByName.артин;
  if (lower.includes("герасимов")) return teamExpertiseByName.герасимов;
  if (lower.includes("абукаев")) return teamExpertiseByName.абукаев;
  if (lower.includes("лященко")) return teamExpertiseByName.лященко;
  return "Практическая экспертиза в предотвращении неосвобождения от обязательств в банкротстве физических лиц.";
};

const fallbackStudentCases: StudentCase[] = [
  {
    id: "fallback-nondischarge-case-1",
    course_id: "",
    student_name: "Анна В.",
    student_role: "Юрист по БФЛ",
    case_text:
      "Внедрила предбанкротный аудит с матрицей риска. Выявила «красные флаги» (снятие 800 тыс., серый доход). Собрали доказательства легитимности. Суд списал все долги несмотря на возражения кредитора.",
    result_text: "Результат: клиент получил списание долгов на 3,2 млн",
    is_published: true,
    display_order: 1,
    created_at: "",
    updated_at: "",
  },
  {
    id: "fallback-nondischarge-case-2",
    course_id: "",
    student_name: "Сергей К.",
    student_role: "Помощник АУ",
    case_text:
      "Применил модуль по поведению должника. Внедрил регламент коммуникации с должником (сроки, документы, дисциплина). Снизили количество кейсов с «пассивным должником» с 25% до 4%.",
    result_text: "Результат: −84% проблемных кейсов с пассивными должниками",
    is_published: true,
    display_order: 2,
    created_at: "",
    updated_at: "",
  },
  {
    id: "fallback-nondischarge-case-3",
    course_id: "",
    student_name: "Максим Л.",
    student_role: "Руководитель практики",
    case_text:
      "Внедрил систему скоринга клиентов на входе. Перестали брать «минные» кейсы без подготовки. Стали отказывать 15% клиентов на аудите. Процент списаний вырос с 78% до 94%.",
    result_text: "Результат: +20% к % успешных списаний (с 78% до 94%)",
    is_published: true,
    display_order: 3,
    created_at: "",
    updated_at: "",
  },
  {
    id: "fallback-nondischarge-case-4",
    course_id: "",
    student_name: "Ольга Д.",
    student_role: "Юрист по БФЛ",
    case_text:
      "Использовала шаблоны ответов на возражения кредиторов из курса. ФНС возражала против списания (сокрытие дохода от ИП). Подготовили документы, закрыли все аргументы. Суд списал долг 1,8 млн.",
    result_text: "Результат: отбили возражения ФНС, списали 1,8 млн",
    is_published: true,
    display_order: 4,
    created_at: "",
    updated_at: "",
  },
  {
    id: "fallback-nondischarge-case-5",
    course_id: "",
    student_name: "Павел Н.",
    student_role: "Юрист по БФЛ",
    case_text:
      "Применил модуль по кредитам и МФО. У клиента было 18 микрозаймов перед процедурой. Собрали доказательства форс-мажора (увольнение, болезнь, алименты). Суд признал заимствование добросовестным.",
    result_text: "Результат: списание несмотря на 18 МФО перед процедурой",
    is_published: true,
    display_order: 5,
    created_at: "",
    updated_at: "",
  },
  {
    id: "fallback-nondischarge-case-6",
    course_id: "",
    student_name: "Татьяна Ш.",
    student_role: "Помощник АУ",
    case_text:
      "Использовала регламент коммуникации из модуля 8. Внедрили систему напоминаний должникам о документах и заседаниях. Снизили количество «пассивных» кейсов. Процент списаний вырос с 71% до 89%.",
    result_text: "Результат: % списаний +25% (с 71% до 89%)",
    is_published: true,
    display_order: 6,
    created_at: "",
    updated_at: "",
  },
  {
    id: "fallback-nondischarge-case-7",
    course_id: "",
    student_name: "Дмитрий Р.",
    student_role: "Юрист по БФЛ",
    case_text:
      "Использовал чек-лист «что нельзя делать» из курса. Предупредил клиента об опасных действиях до процедуры (дарение авто, разделе имущества). Отложили подачу, исправили ситуацию. Получили полное списание.",
    result_text: "Результат: предотвратили неосвобождение на входе",
    is_published: true,
    display_order: 7,
    created_at: "",
    updated_at: "",
  },
  {
    id: "fallback-nondischarge-case-8",
    course_id: "",
    student_name: "Елена Т.",
    student_role: "Юрист кредитора",
    case_text:
      "Применила модуль по выявлению недобросовестности. Нашли сокрытие бизнеса должника (ИП, счета, активы). Подготовили доказательную базу. Суд отказал в списании по нашему возражению.",
    result_text: "Результат: отказ в списании долга 2,4 млн клиенту",
    is_published: true,
    display_order: 8,
    created_at: "",
    updated_at: "",
  },
];

export default function CourseNonDischarge() {
  const [course, setCourse] = useState<Course | null>(null);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [studentCases, setStudentCases] = useState<StudentCase[]>(fallbackStudentCases);
  const [openModuleIndex, setOpenModuleIndex] = useState<number | null>(0);
  const [isDiscountFormOpen, setIsDiscountFormOpen] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const [materialsBannerUrl, setMaterialsBannerUrl] = useState("");
  const [materialsDownloadUrl, setMaterialsDownloadUrl] = useState("");
  const [materialsTitle, setMaterialsTitle] = useState("Получите дополнительные материалы по неосвобождению");
  const [materialsDescription, setMaterialsDescription] = useState(
    "Практические инструменты для работы: анкета клиента, чек-листы поведения, матрица риска, шаблоны объяснений и ответов."
  );

  const [materialsFullName, setMaterialsFullName] = useState("");
  const [materialsPhone, setMaterialsPhone] = useState("");
  const [materialsEmail, setMaterialsEmail] = useState("");
  const [materialsConsentPolicy, setMaterialsConsentPolicy] = useState(false);
  const [materialsConsentOffers, setMaterialsConsentOffers] = useState(true);
  const [materialsSubmitting, setMaterialsSubmitting] = useState(false);

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
        const nondischargeCourse = courses.find((course) => {
          const title = course.title.toLowerCase();
          return title.includes("неосвобождение") || title.includes("обязательств");
        });

        if (!nondischargeCourse) {
          setStudentCases(fallbackStudentCases);
          return;
        }

        setCourse(nondischargeCourse);

        const data = await api.studentCases.list(true, nondischargeCourse?.id);
        setStudentCases(data?.length ? data : fallbackStudentCases);
      } catch {
        setStudentCases(fallbackStudentCases);
      }
    };

    const fetchSettings = async () => {
      try {
        const settings = await api.settings.list();
        const map = new Map(settings.map((item) => [item.setting_key, item.setting_value || ""]));
        setMaterialsBannerUrl(map.get("nondischarge_materials_banner_url") || "");
        setMaterialsDownloadUrl(map.get("nondischarge_materials_download_url") || "");
        setMaterialsTitle(map.get("nondischarge_materials_title") || "Получите дополнительные материалы по неосвобождению");
        setMaterialsDescription(
          map.get("nondischarge_materials_description") ||
            "Практические инструменты для работы: анкета клиента, чек-листы поведения, матрица риска, шаблоны объяснений и ответов."
        );
      } catch {
        setMaterialsBannerUrl("");
        setMaterialsDownloadUrl("");
      }
    };

    fetchTeam();
    fetchCases();
    fetchSettings();
  }, []);

  const heroTitle = course?.hero_title || "Неосвобождение от обязательств в БФЛ";
  const heroSubtitle = course?.hero_subtitle || course?.description || "Защита от самого «болезненного» риска процедуры";
  const heroDescription = course?.hero_description || course?.benefits || "";
  const heroHighlights = course?.hero_highlights?.length ? course.hero_highlights : highlights;
  const introTitle =
    course?.intro_title || "Самый «болезненный» риск в БФЛ — когда процедура прошла, а суд не списывает долги";
  const introDescription =
    course?.intro_description ||
    "Курс учит предугадывать риск неосвобождения ещё до подачи заявления, правильно «упаковывать» позицию должника и доказательства добросовестности, защищаться от возражений кредиторов и позиции ФНС/уполномоченного органа, работать с «триггерами суда» и строить стратегию успешного списания.";
  const learningResults = course?.learning_results?.length ? course.learning_results : results;
  const programBadge = course?.program_badge || "14 модулей + аттестация";
  const programFeatures = course?.program_features?.length
    ? course.program_features
    : ["Дистанционное обучение: 8–12 занятий по 90–120 минут", "Домашние задания: мини-кейс + сбор документов/позиции"];
  const programFormatTitle = course?.program_format_title || "Что будет на курсе";
  const programFormatDescription =
    course?.program_format_description || "Теория, практические разборы кейсов, шаблоны документов, живые разборные сессии, чат сопровождения.";
  const modulesList = course?.lessons?.length ? course.lessons : modules;
  const audienceList = course?.target_audience?.length ? course.target_audience : audience;
  const sellingPointsList = course?.selling_points?.length ? course.selling_points : sellingPoints;
  const faqList = course?.faq_items?.length ? course.faq_items : faqItems;
  const materialsIncludes = course?.materials_includes?.length
    ? course.materials_includes
    : [
        "Анкета клиента «риски неосвобождения»",
        "Чек-лист «что нельзя делать до/во время банкротства»",
        "Матрица риска (скоринг клиента)",
        "Шаблон объяснений должника для суда",
        "Шаблон ответа на возражения кредитора/ФНС",
        "Регламент коммуникации должник ↔ юрист ↔ ФУ",
      ];
  const specialOfferTitle = course?.special_offer_title || "Специальное предложение для комплексного обучения";
  const specialOfferDescription = course?.special_offer_description || "При покупке всех курсов сразу, скидка 20% на все";
  const specialOfferBadge = course?.special_offer_badge || "-20%";
  const specialOfferButtonText = course?.special_offer_button_text || "Забронировать цену со скидкой";
  const ctaTitle = course?.cta_title || "Готовы защитить клиентов от неосвобождения?";
  const ctaDescription = course?.cta_description || "Оставьте заявку — пришлём программу, формат участия и условия потока.";
  const ctaButtonText = course?.cta_button_text || "Открыть форму заявки";
  const teamOrder = course?.team_order?.length ? course.team_order : teamOrderFallback;
  const resultIcons = [Target, ShieldCheck, BookOpenCheck, Files];

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

  const toggleModule = (index: number) => {
    setOpenModuleIndex((prev) => (prev === index ? null : index));
  };

  const toggleFaq = (index: number) => {
    setOpenFaqIndex((prev) => (prev === index ? null : index));
  };

  const handleMaterialsLeadSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!materialsFullName.trim() || !materialsPhone.trim()) {
      toast({ title: "Заполните поля", description: "Укажите имя и телефон.", variant: "destructive" });
      return;
    }

    if (!materialsConsentPolicy) {
      toast({
        title: "Требуется согласие",
        description: "Подтвердите обработку персональных данных.",
        variant: "destructive",
      });
      return;
    }

    try {
      setMaterialsSubmitting(true);
      await api.leads.create({
        full_name: materialsFullName.trim(),
        phone: materialsPhone.trim(),
        email: materialsEmail.trim() || undefined,
        consent_policy: materialsConsentPolicy,
        consent_offers: materialsConsentOffers,
        source: "nondischarge_materials_2026",
      });

      if (materialsDownloadUrl) {
        const link = document.createElement("a");
        link.href = materialsDownloadUrl;
        link.download = "";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast({ title: "Готово", description: "Заявка отправлена, материалы скачиваются." });
      } else {
        toast({
          title: "Заявка отправлена",
          description: "Файл материалов еще не загружен в админке. Добавьте его в Настройках.",
        });
      }

      setMaterialsFullName("");
      setMaterialsPhone("");
      setMaterialsEmail("");
      setMaterialsConsentPolicy(false);
      setMaterialsConsentOffers(true);
    } catch (error: any) {
      toast({ title: "Ошибка отправки", description: error.message, variant: "destructive" });
    } finally {
      setMaterialsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="animate-page-enter">
        <section className="py-16 sm:py-20">
          <div className="container max-w-6xl">
            <div className="grid gap-6 rounded-3xl bg-gradient-to-br from-red-600 via-red-500 to-orange-500 p-6 sm:p-8 lg:grid-cols-2 lg:p-10">
              <div className="text-white">
                <h1 className="font-heading text-4xl font-bold leading-tight sm:text-5xl">
                  {heroTitle}
                </h1>
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
          <div className="container max-w-6xl">
            <article className="relative overflow-hidden rounded-3xl border bg-card p-6 sm:p-8">
              <div className="pointer-events-none absolute inset-0">
                <span className="absolute left-[6%] top-[12%] h-[120%] w-6 -rotate-12 bg-red-600/10" />
                <span className="absolute left-[38%] top-[-10%] h-[130%] w-4 rotate-6 bg-red-600/10" />
                <span className="absolute left-[62%] top-[5%] h-[120%] w-5 -rotate-[18deg] bg-red-600/10" />
                <span className="absolute left-[83%] top-[-6%] h-[140%] w-3 rotate-12 bg-red-600/10" />
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
            <h2 className="font-heading text-3xl font-bold">Что вы получите на выходе</h2>
            <div className="grid gap-4 md:grid-cols-2">
              {learningResults.map((item, index) => {
                const Icon = resultIcons[index] || Target;
                return (
                  <article key={item.title} className="rounded-2xl border bg-card p-5">
                    <div className="flex items-start gap-3">
                      <Icon className="mt-0.5 h-6 w-6 flex-shrink-0 text-red-600" />
                      <div>
                        <h3 className="text-lg font-semibold text-foreground">{item.title}</h3>
                        <p className="mt-2 text-sm text-muted-foreground">{item.text}</p>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section className="py-10">
          <div className="container max-w-6xl space-y-6">
            <h2 className="font-heading text-3xl font-bold">Команда курса — практикующие эксперты</h2>
            <div className="grid gap-4 lg:grid-cols-3">
              {teamMembers.map((member) => (
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
                        <div className="flex h-full w-full items-center justify-center bg-red-600/15 text-2xl font-bold text-red-600">
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
                      <p className="mt-1 text-sm font-medium text-red-600">Эксперт курса</p>
                    </div>
                  </div>

                  {member.position && member.position !== "Эксперт курса" ? (
                    <p className="mt-5 text-foreground">{member.position}</p>
                  ) : null}
                  {member.bio ? <p className="mt-3 text-foreground">{member.bio}</p> : null}
                  <p className="mt-3 text-sm text-foreground">
                    <span className="font-semibold text-red-600">Экспертиза:</span>{" "}
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
              <p className="text-sm font-medium text-red-600">{programBadge}</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <article className="rounded-2xl border bg-card p-5">
                <div className="flex items-start gap-3">
                  <Sparkles className="mt-0.5 h-5 w-5 text-red-600" />
                  <div className="space-y-2 text-muted-foreground">
                    {programFeatures.map((item) => (
                      <p key={item}>{item}</p>
                    ))}
                  </div>
                </div>
              </article>
              <article className="rounded-2xl border bg-card p-5">
                <h3 className="text-lg font-semibold text-red-600">{programFormatTitle}</h3>
                <p className="mt-2 text-muted-foreground">{programFormatDescription}</p>
              </article>
            </div>

            <div className="space-y-3">
              {modulesList.map((module, index) => {
                const isOpen = openModuleIndex === index;

                return (
                  <article key={module.title} className="overflow-hidden rounded-2xl border bg-card">
                    <button
                      type="button"
                      onClick={() => toggleModule(index)}
                      className="flex w-full items-center justify-between gap-4 p-5 text-left"
                    >
                      <h3 className="font-heading text-xl font-semibold text-foreground">{module.title}</h3>
                      <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-red-600/10 text-red-600">
                        {isOpen ? <Minus className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
                      </span>
                    </button>

                    {isOpen ? (
                      <div className="border-t bg-muted/20 p-5">
                        <ul className="list-disc space-y-2 pl-5 text-muted-foreground">
                          {module.points.map((point) => (
                            <li key={point}>{point}</li>
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

        <section className="py-6">
          <div className="container max-w-6xl">
            <article className="relative overflow-hidden rounded-3xl border bg-card p-6 sm:p-8">
              <div className="pointer-events-none absolute inset-0">
                <span className="absolute -left-20 top-10 h-52 w-52 rounded-full bg-red-600/10 blur-2xl" />
                <span className="absolute right-10 top-0 h-40 w-40 rounded-full bg-red-600/10 blur-2xl" />
              </div>

              <div className="relative">
                <h2 className="text-center font-heading text-3xl font-bold text-foreground">
                  {specialOfferTitle}
                </h2>
                <p className="mt-3 text-center text-lg font-semibold text-red-600">{specialOfferDescription}</p>

                <div className="mx-auto mt-6 flex max-w-3xl flex-wrap justify-center gap-3">
                  <div className="rounded-xl bg-red-600 px-6 py-4 text-lg font-bold text-white">{specialOfferBadge}</div>
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
            <div className="grid gap-4">
              {audienceList.map((item, index) => (
                <article key={item} className="relative overflow-hidden rounded-2xl border bg-card p-6">
                  <span className="pointer-events-none absolute -left-6 top-0 h-full w-4 -rotate-12 bg-red-600/10" />
                  <span className="pointer-events-none absolute right-10 top-0 h-full w-3 rotate-6 bg-red-600/10" />
                  <span className="absolute right-4 top-4 h-8 w-8 rounded-lg bg-red-600/15" />
                  <div className="relative flex items-start gap-4">
                    <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-red-600 text-lg font-bold text-white">
                      {index + 1}
                    </span>
                    <p className="pt-1 text-muted-foreground">{item}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="py-10">
          <div className="container max-w-6xl space-y-5">
            <h2 className="font-heading text-3xl font-bold">Кейсы наших студентов</h2>
            <div className="grid gap-4 lg:grid-cols-4">
              {studentCases.map((item) => (
                <article key={item.id} className="rounded-3xl border bg-muted/30 p-5">
                  <h3 className="text-xl font-semibold text-foreground">{item.student_name}</h3>
                  {item.student_role ? <p className="mt-1 text-sm text-muted-foreground">{item.student_role}</p> : null}
                  <p className="mt-4 text-sm leading-relaxed text-foreground/80">{item.case_text}</p>
                  {item.result_text ? <p className="mt-4 text-sm font-semibold text-red-600">{item.result_text}</p> : null}
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="py-10">
          <div className="container max-w-6xl space-y-5">
            <h2 className="font-heading text-3xl font-bold">Дополнительные материалы</h2>
            <div className="grid gap-4 lg:grid-cols-2">
              <article
                className="relative overflow-hidden rounded-3xl border p-8 text-white sm:p-10"
                style={
                  materialsBannerUrl
                    ? {
                        backgroundImage: `linear-gradient(rgba(153, 27, 27, 0.50), rgba(153, 27, 27, 0.60)), url(${materialsBannerUrl})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                      }
                    : {
                        background: "linear-gradient(135deg, #dc2626 0%, #ea580c 50%, #f59e0b 100%)",
                      }
                }
              >
                <h3 className="font-heading text-3xl font-bold leading-tight">{materialsTitle}</h3>
                <p className="mt-5 text-lg leading-relaxed text-white/90">{materialsDescription}</p>
                <ul className="mt-7 list-disc space-y-2 pl-5 text-base text-white/90">
                  {materialsIncludes.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </article>

              <div className="rounded-3xl border border-border bg-card p-6 sm:p-8">
                <form className="space-y-4" onSubmit={handleMaterialsLeadSubmit}>
                  <Input
                    className="h-14 rounded-xl bg-muted/40 text-base"
                    placeholder="Имя и фамилия"
                    value={materialsFullName}
                    onChange={(e) => setMaterialsFullName(e.target.value)}
                    required
                  />
                  <Input
                    className="h-14 rounded-xl bg-muted/40 text-base"
                    placeholder="+7 (000) 000-00-00"
                    value={materialsPhone}
                    onChange={(e) => setMaterialsPhone(e.target.value)}
                    required
                  />
                  <Input
                    className="h-14 rounded-xl bg-muted/40 text-base"
                    placeholder="Email"
                    type="email"
                    value={materialsEmail}
                    onChange={(e) => setMaterialsEmail(e.target.value)}
                  />

                  <label className="flex items-start gap-3 text-sm text-muted-foreground">
                    <Checkbox
                      checked={materialsConsentPolicy}
                      onCheckedChange={(v) => setMaterialsConsentPolicy(Boolean(v))}
                      className="mt-0.5"
                    />
                    <span>Я согласен с обработкой персональных данных в соответствии с политикой обработки и офертой</span>
                  </label>

                  <label className="flex items-start gap-3 text-sm text-muted-foreground">
                    <Checkbox
                      checked={materialsConsentOffers}
                      onCheckedChange={(v) => setMaterialsConsentOffers(Boolean(v))}
                      className="mt-0.5"
                    />
                    <span>Я соглашаюсь получать уведомления о новых продуктах и предложениях</span>
                  </label>

                  <Button
                    type="submit"
                    className="mt-2 h-14 w-full rounded-xl bg-foreground text-base font-semibold text-background hover:bg-foreground/90"
                    disabled={!materialsConsentPolicy || materialsSubmitting}
                  >
                    {materialsSubmitting ? "Отправка..." : "Получить материалы и скачать"}
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
                  <span className="pointer-events-none absolute -left-5 top-0 h-full w-3 -rotate-12 bg-red-600/10" />
                  <span className="pointer-events-none absolute right-10 top-0 h-full w-2 rotate-6 bg-red-600/10" />
                  <span className="absolute right-4 top-4 h-8 w-8 rounded-lg bg-red-600/15" />
                  <p className="pr-12 text-xl font-semibold text-foreground">{item}</p>
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
                      <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-red-600/10 text-red-600">
                        {isOpen ? <Minus className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
                      </span>
                    </button>
                    {isOpen ? (
                      <div className="relative border-t bg-muted/20 p-5">
                        <span className="pointer-events-none absolute left-6 top-0 h-full w-2 -rotate-12 bg-red-600/10" />
                        <p className="relative pl-3 text-muted-foreground">{faq.answer}</p>
                      </div>
                    ) : null}
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <CourseInstallmentBlock courseName="Неосвобождение от долгов" />

        <section id="apply" className="py-14">
          <div className="container max-w-6xl">
            <div className="relative overflow-hidden rounded-2xl border bg-card p-6 sm:p-8">
              <span className="pointer-events-none absolute left-[5%] top-0 h-full w-4 -rotate-12 bg-red-600/10" />
              <span className="pointer-events-none absolute left-[42%] top-0 h-full w-3 rotate-[8deg] bg-red-600/10" />
              <span className="pointer-events-none absolute right-[12%] top-0 h-full w-4 -rotate-[6deg] bg-red-600/10" />
              <h2 className="relative font-heading text-3xl font-bold">{ctaTitle}</h2>
              <p className="relative mt-3 text-muted-foreground">{ctaDescription}</p>
              <div className="relative mt-6">
                <a href="#course-form">
                  <Button className="h-12 px-8 text-base">{ctaButtonText}</Button>
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

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
