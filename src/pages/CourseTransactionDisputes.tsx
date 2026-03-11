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
  "Предбанкротный аудит: находим рисковые сделки до подачи заявления",
  "Стратегия защиты должника и/или возврата активов в конкурсную массу",
  "Чек-листы, матрица риска, шаблоны документов для работы",
];

const audience = [
  "Юристам по БФЛ — чтобы не «заводить» клиента в процедуру с миной замедленного действия и уметь отбивать оспаривания.",
  "Финансовым управляющим / помощникам АУ — чтобы выстроить методику анализа подозрительных сделок и подготовку заявлений/возражений.",
  "Руководителям юр. компаний — чтобы стандартизировать аудит, снизить «пожары» и повысить качество кейсов в производстве.",
  "Представителям кредиторов — чтобы понимать, где реально вернуть активы/деньги в конкурсную массу и как доказать позицию.",
];

const modules = [
  {
    title: "Модуль 1. Картина мира суда: зачем оспаривают сделки в БФЛ",
    points: [
      "Что такое «возврат в конкурсную массу» на практике",
      "Кто инициирует оспаривание: АУ, кредитор, уполномоченный орган",
      "Как суд смотрит на цель сделки, поведение сторон, экономику и добросовестность",
      "Типовые причины, почему оспаривание «вылезает» именно в банкротстве граждан",
    ],
  },
  {
    title: "Модуль 2. Нормативная база и виды недействительности",
    points: [
      "«Общая гражданская недействительность» vs «банкротные основания»",
      "Ключевые конструкции: подозрительные сделки, с предпочтением, мнимые/притворные",
      "Кто является ответчиком/третьими лицами",
      "Что можно требовать: возврат имущества, взыскание стоимости, реституция",
    ],
  },
  {
    title: "Модуль 3. Сроки, периоды, давность — где чаще всего ошибаются",
    points: [
      "Проверяемые периоды в БФЛ: что анализируем и почему",
      "Исчисление срока давности: когда «узнали/должны были узнать»",
      "Процессуальные ловушки: пропуск срока, неправильное определение даты",
      "Как заранее «снять» риск по срокам на аудите",
    ],
  },
  {
    title: "Модуль 4. Предбанкротный аудит: чек-лист красных флагов",
    points: [
      "Дарения родственникам и «переписывание» активов",
      "Продажи «по низу рынка»",
      "Вывод денег и активов через займы/расписки",
      "Фиктивные долги и «рисованные кредиторы»",
      "Брачные договоры / соглашения о разделе имущества",
      "Действия с единственным жильём, ипотекой, маткапиталом",
      "Снятие наличных, крупные переводы, крипта, карты родственников",
    ],
  },
  {
    title: "Модуль 5. Недвижимость: самые частые и самые дорогие споры",
    points: [
      "Купля-продажа квартиры/доли: занижение цены, «бумажная оплата», скрытые расчёты",
      "Дарение, рента, обмен, уступка прав",
      "Сделки с долями, несовершеннолетними, опекой",
      "Единственное жильё: где границы риска на практике",
      "Ипотека: что оспаривают, как защищать позицию, влияние залога",
    ],
  },
  {
    title: "Модуль 6. Автомобили и движимое имущество",
    points: [
      "Продажа «по доверенности» и фактическая передача",
      "Продажа перед процедурой, переоформление на родственников",
      "Доказательства реальной оплаты, рыночной цены, добросовестности",
      "Как работать с оценкой и экспертизой",
    ],
  },
  {
    title: "Модуль 7. Деньги, переводы, займы, расписки, «фиктивные долги»",
    points: [
      "Займы между родственниками и друзьями: что бесит суд",
      "Притворные договоры, «задним числом», расписка без денег",
      "Возвраты «избирательно» одному кредитору (предпочтение)",
      "Переводы на карты третьих лиц, обналичка",
      "Как доказывать реальность денежных потоков",
    ],
  },
  {
    title: "Модуль 8. Семейные конструкции: развод, раздел, брачный договор",
    points: [
      "Когда раздел/брачный договор воспринимается как вывод активов",
      "Как суд оценивает «честность» раздела",
      "Типовые ошибки: «отдали всё супруге/супругу» накануне банкротства",
      "Стратегия защиты: документы, логика, мотивы, временные рамки",
    ],
  },
  {
    title: "Модуль 9. Сделки с бизнесом: доли, ИП, оборудование, счета",
    points: [
      "Вывод активов ИП и смешение личного/делового",
      "Отчуждение долей/акций, уступка дебиторки",
      "Фиктивные услуги/акты как способ вывода денег",
      "Как защищать экономическую обоснованность",
    ],
  },
  {
    title: "Модуль 10. Доказательства и процесс: как «собрать дело»",
    points: [
      "«Скелет» доказательственной базы: выписки, договоры, расписки, отчёты",
      "Запросы: суд, АУ, нотариус, банк, Росреестр, ГИБДД",
      "Типовая структура заявления об оспаривании и возражений",
      "Тактика в заседании: что говорить, что не говорить",
      "Экспертиза/оценка: когда нужна и как ставить вопросы",
    ],
  },
  {
    title: "Модуль 11. Стратегия защиты должника (и юриста)",
    points: [
      "Что делать до подачи: когда лучше подождать, когда корректировать действия",
      "«Неосвобождение от долгов» и связь с поведением должника",
      "Правила коммуникации с клиентом: как объяснять риски",
      "Как не попасть под претензии клиента (договор, информирование)",
    ],
  },
  {
    title: "Модуль 12. Стратегия кредитора/АУ: когда есть смысл оспаривать",
    points: [
      "Критерии «целесообразности»: актив/перспектива/расходы",
      "Выбор основания и ответчика",
      "Типовые сценарии, где реально вернуть имущество/стоимость",
      "Мировые соглашения по оспариванию: когда выгодно",
    ],
  },
  {
    title: "Модуль 13. Практика и кейсы (разборы)",
    points: [
      "10–15 типовых кейсов по категориям: недвижимость / авто / переводы / займы / семья",
      "Разбор: факты → риск → основания → доказательства → стратегия → прогноз",
      "Анализ реальных судебных решений",
    ],
  },
  {
    title: "Модуль 14. Документы и шаблоны (то, что забирают в работу)",
    points: [
      "Чек-лист аудита сделок",
      "Анкета клиента по сделкам/активам",
      "Матрица риска",
      "Шаблон позиции (для должника)",
      "Шаблон заявления об оспаривании (для АУ/кредитора)",
      "Список «идеальных доказательств» по каждому типу сделки",
    ],
  },
  {
    title: "Модуль 15. Итоговый экзамен / сертификация",
    points: [
      "Тест + практическая задача: оценить кейс и предложить стратегию",
      "Критерии: точность основания, сроки, доказательства, логика суда",
      "Получение сертификата о прохождении курса",
    ],
  },
];

const results = [
  {
    icon: Target,
    title: "Аудит сделок за проверяемые периоды",
    text: "Быстро находите красные флаги и оцениваете перспективу оспаривания. Отличаете оспоримые сделки от «шумовых» — где суд почти наверняка откажет.",
  },
  {
    icon: ShieldCheck,
    title: "Дорожная карта защиты/атаки",
    text: "Что делать ДО банкротства, НА входе, В процессе. Готовите пакет: заявление/возражения/ходатайства, запросы в банки/Росреестр/ГИБДД.",
  },
  {
    icon: BookOpenCheck,
    title: "Понимание судебной практики",
    text: "Какие аргументы работают, какие — нет. Снижаете риски неосвобождения от долгов из-за недобросовестности/злоупотребления.",
  },
  {
    icon: Files,
    title: "Готовые шаблоны и инструменты",
    text: "Чек-листы аудита, матрица риска, анкета клиента, шаблоны заявлений и возражений, список доказательств по каждому типу сделки.",
  },
];

const sellingPoints = [
  "Полный обзор практики БФЛ по оспариванию: от аудита до судебного результата",
  "Чек-листы и матрица риска: быстрый анализ перед входом в процедуру",
  "Шаблоны документов: заявления/возражения/запросы",
  "Кейсы: типовые сценарии из реальных дел (недвижимость/переводы/семья)",
  "Анти-ошибки: что приводит к провалу и неосвобождению от долгов",
  "Стратегия защиты должника и стратегия возврата активов для кредиторов",
];

const faqItems = [
  {
    question: "Как проходит обучение?",
    answer:
      "Обучение проходит в формате видео-уроков: вы получаете доступ к материалам и можете смотреть занятия в любое удобное время. В программе предусмотрены практические разборы кейсов, домашние задания после каждого модуля и финальное тестирование.",
  },
  {
    question: "Какой документ я получу после обучения?",
    answer:
      "После успешной сдачи итогового экзамена (тест + практическая задача) вы получаете сертификат о прохождении курса. Это подтверждает вашу квалификацию в области оспаривания сделок в банкротстве граждан.",
  },
  {
    question: "Смогу ли я пользоваться материалами после окончания?",
    answer:
      "Да, по курсу предусмотрен неограниченный доступ к материалам: шаблонам документов, чек-листам, матрице риска, анкетам и всем видеозаписям занятий.",
  },
  {
    question: "Можно ли задавать вопросы по своим кейсам?",
    answer:
      "Да. В программе предусмотрены 2–3 разборные сессии по реальным кейсам участников, а также чат сопровождения, где можно задавать вопросы экспертам курса.",
  },
  {
    question: "Подойдет ли курс начинающим юристам?",
    answer:
      "Курс подойдет как начинающим юристам по БФЛ, так и опытным специалистам. Программа построена от основ (виды недействительности, сроки) до продвинутых стратегий (защита должника, тактика кредитора).",
  },
  {
    question: "Что делать, если я пропущу занятие?",
    answer:
      "Все занятия доступны в записи, вы можете посмотреть их в удобное время. Главное — выполнять домашние задания после каждого модуля для закрепления материала.",
  },
  {
    question: "Можно ли совмещать обучение с работой?",
    answer:
      "Да, программа рассчитана на практикующих юристов и специалистов. Занятия в записи, домашние задания и кейсы помогают сразу применять знания в текущей практике.",
  },
];

const teamOrderFallback = ["артин", "абукаев", "герасимов"];

const teamFallback: Teacher[] = [
  {
    id: "fallback-disputes-1",
    full_name: "Василий Алексеевич Артин",
    position: "Ведущий эксперт курса",
    bio: "Эксперт по банкротству физлиц и оспариванию сделок.",
    expertise: "Стратегия оспаривания сделок, предбанкротный аудит, защита должника.",
    experience: "Практикующий эксперт",
    photo_url: "",
    display_order: 1,
    is_published: true,
    created_at: "",
    updated_at: "",
  },
  {
    id: "fallback-disputes-2",
    full_name: "Абукаев Андрей Александрович",
    position: "Эксперт курса",
    bio: "Практикующий специалист по сопровождению процедур БФЛ.",
    expertise: "Анализ сделок, подготовка процессуальных документов, судебная практика.",
    experience: "Практикующий эксперт",
    photo_url: "",
    display_order: 2,
    is_published: true,
    created_at: "",
    updated_at: "",
  },
  {
    id: "fallback-disputes-3",
    full_name: "Герасимов Александр Валерьевич",
    position: "Эксперт курса",
    bio: "Специалист по анализу сделок и судебной практике в банкротстве.",
    expertise: "Оспаривание сделок, анализ судебной практики, защита интересов сторон процесса.",
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
    "Стратегия оспаривания сделок в БФЛ, предбанкротный аудит активов, защита должника от претензий кредиторов и АУ.",
  абукаев:
    "Анализ подозрительных сделок, подготовка заявлений об оспаривании и возражений, работа с доказательствами.",
  герасимов:
    "Оспаривание сделок в банкротстве, анализ судебной практики, подготовка процессуальных документов.",
};

const getTeamExpertise = (fullName: string) => {
  const lower = fullName.toLowerCase();
  if (lower.includes("артин")) return teamExpertiseByName.артин;
  if (lower.includes("абукаев")) return teamExpertiseByName.абукаев;
  if (lower.includes("герасимов")) return teamExpertiseByName.герасимов;
  return "Практическая экспертиза в оспаривании сделок и сопровождении дел о банкротстве физических лиц.";
};

const fallbackStudentCases: StudentCase[] = [
  {
    id: "fallback-disputes-case-1",
    course_id: "",
    student_name: "Игорь С.",
    student_role: "Юрист по БФЛ",
    case_text:
      "После курса внедрил чек-лист аудита сделок. Выявил рисковую продажу квартиры клиента за 3 недели до банкротства. Скорректировали стратегию, отложили подачу, оформили всё корректно. Клиент получил освобождение от долгов без оспаривания.",
    result_text: "Результат: избежали возврата 4,2 млн в конкурсную массу",
    is_published: true,
    display_order: 1,
    created_at: "",
    updated_at: "",
  },
  {
    id: "fallback-disputes-case-2",
    course_id: "",
    student_name: "Мария К.",
    student_role: "Помощник АУ",
    case_text:
      "Применила модуль по семейным конструкциям. Выявили фиктивный раздел имущества за 2 месяца до процедуры. Подготовили заявление с полным пакетом доказательств. Суд признал сделку недействительной, вернули в массу квартиру стоимостью 6 млн.",
    result_text: "Результат: возврат 6 млн рублей в конкурсную массу",
    is_published: true,
    display_order: 2,
    created_at: "",
    updated_at: "",
  },
  {
    id: "fallback-disputes-case-3",
    course_id: "",
    student_name: "Алексей В.",
    student_role: "Руководитель практики",
    case_text:
      "Внедрил в компанию матрицу риска и стандартизировал аудит сделок. Команда перестала «проглядывать» красные флаги. Снизили количество отказов в освобождении с 18% до 3% за полгода.",
    result_text: "Результат: качество кейсов +83%, отказов –83%",
    is_published: true,
    display_order: 3,
    created_at: "",
    updated_at: "",
  },
  {
    id: "fallback-disputes-case-4",
    course_id: "",
    student_name: "Екатерина Д.",
    student_role: "Представитель кредитора",
    case_text:
      "Использовала стратегию из модуля 12 для анализа целесообразности оспаривания. Из 7 потенциальных сделок выбрали 2 перспективные (автомобиль и перевод 900 тыс.). Вернули активы на 1,4 млн при расходах 120 тыс.",
    result_text: "Результат: ROI 1067% по оспариванию",
    is_published: true,
    display_order: 4,
    created_at: "",
    updated_at: "",
  },
  {
    id: "fallback-disputes-case-5",
    course_id: "",
    student_name: "Виктор П.",
    student_role: "Помощник АУ",
    case_text:
      "Применил модуль по фиктивным долгам и переводам. Выявил 3 займа между родственниками без реальных денежных потоков. Суд отклонил требования мнимых кредиторов на 2,8 млн рублей, что увеличило процент выплат реальным кредиторам.",
    result_text: "Результат: исключили 2,8 млн фиктивных требований",
    is_published: true,
    display_order: 5,
    created_at: "",
    updated_at: "",
  },
  {
    id: "fallback-disputes-case-6",
    course_id: "",
    student_name: "Ольга Ш.",
    student_role: "Юрист по БФЛ",
    case_text:
      "Использовала знания по срокам давности и стратегии защиты должника из модуля 11. Доказали, что оспариваемая сделка с автомобилем была совершена за пределами проверяемого периода. Суд отказал АУ в оспаривании, клиент сохранил имущество.",
    result_text: "Результат: защита имущества на 850 тыс рублей",
    is_published: true,
    display_order: 6,
    created_at: "",
    updated_at: "",
  },
];

export default function CourseTransactionDisputes() {
  const [course, setCourse] = useState<Course | null>(null);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [studentCases, setStudentCases] = useState<StudentCase[]>(fallbackStudentCases);
  const [openModuleIndex, setOpenModuleIndex] = useState<number | null>(0);
  const [isDiscountFormOpen, setIsDiscountFormOpen] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  
  const [materialsBannerUrl, setMaterialsBannerUrl] = useState("");
  const [materialsDownloadUrl, setMaterialsDownloadUrl] = useState("");
  const [materialsTitle, setMaterialsTitle] = useState("Получите дополнительные материалы по оспариванию сделок");
  const [materialsDescription, setMaterialsDescription] = useState(
    "Практические инструменты для работы: чек-листы аудита, матрица риска, шаблоны документов."
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
        const disputesCourse = courses.find((course) => {
          const title = course.title.toLowerCase();
          return title.includes("оспаривание") || title.includes("сделок");
        });

        if (!disputesCourse) {
          setStudentCases(fallbackStudentCases);
          return;
        }

        setCourse(disputesCourse);

        // Загружаем данные формы скачивания из курса
        if (disputesCourse.download_form_banner_url) {
          setMaterialsBannerUrl(disputesCourse.download_form_banner_url);
        }
        if (disputesCourse.download_form_file_url) {
          setMaterialsDownloadUrl(disputesCourse.download_form_file_url);
        }
        if (disputesCourse.download_form_title) {
          setMaterialsTitle(disputesCourse.download_form_title);
        }
        if (disputesCourse.download_form_description) {
          setMaterialsDescription(disputesCourse.download_form_description);
        }

        const data = await api.studentCases.list(true, disputesCourse?.id);
        setStudentCases(data?.length ? data : fallbackStudentCases);
      } catch {
        setStudentCases(fallbackStudentCases);
      }
    };

    fetchTeam();
    fetchCases();
  }, []);

  const heroTitle = course?.hero_title || "Оспаривание сделок в БФЛ";
  const heroSubtitle = course?.hero_subtitle || course?.description || "Полный обзор практики банкротства граждан";
  const heroDescription = course?.hero_description || course?.benefits || "";
  const heroHighlights = course?.hero_highlights?.length ? course.hero_highlights : highlights;
  const introTitle =
    course?.intro_title || "Защищать должника и/или возвращать активы — системный подход к оспариванию сделок в банкротстве";
  const introDescription =
    course?.intro_description ||
    "Курс учит находить рисковые сделки до подачи заявления, понимать какие сделки оспаривают чаще всего и почему, строить стратегию защиты должника и/или стратегию атаки (для кредитора/АУ), грамотно работать с сроками, доказательствами, экономической обоснованностью и минимизировать риски неосвобождения от долгов.";
  const learningResults = course?.learning_results?.length ? course.learning_results : results;
  const programBadge = course?.program_badge || "15 модулей + экзамен";
  const programFeatures = course?.program_features?.length
    ? course.program_features
    : ["Дистанционное обучение в удобном формате", "Домашние задания после каждого модуля"];
  const programFormatTitle = course?.program_format_title || "Что будет на курсе";
  const programFormatDescription =
    course?.program_format_description || "Теория, практические разборы кейсов, шаблоны документов, чат сопровождения.";
  const modulesList = course?.lessons?.length ? course.lessons : modules;
  const audienceList = course?.target_audience?.length ? course.target_audience : audience;
  const sellingPointsList = course?.selling_points?.length ? course.selling_points : sellingPoints;
  const faqList = course?.faq_items?.length ? course.faq_items : faqItems;
  const materialsIncludes = course?.materials_includes?.length
    ? course.materials_includes
    : [
        "Чек-лист аудита сделок за проверяемые периоды",
        "Матрица риска: оценка перспективы оспаривания",
        "Анкета клиента по сделкам и активам для предбанкротного анализа",
        "Шаблоны заявлений об оспаривании и возражений",
        "Список «идеальных доказательств» по каждому типу сделки",
      ];
  const specialOfferTitle = course?.special_offer_title || "Специальное предложение для комплексного обучения";
  const specialOfferDescription = course?.special_offer_description || "При покупке всех курсов сразу, скидка 20% на все";
  const specialOfferBadge = course?.special_offer_badge || "-20%";
  const specialOfferButtonText = course?.special_offer_button_text || "Забронировать цену со скидкой";
  const ctaTitle = course?.cta_title || "Готовы освоить оспаривание сделок в БФЛ?";
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
        source: "disputes_materials_2026",
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
                <span className="absolute -left-20 top-10 h-52 w-52 rounded-full bg-primary/10 blur-2xl" />
                <span className="absolute right-10 top-0 h-40 w-40 rounded-full bg-primary/10 blur-2xl" />
              </div>

              <div className="relative">
                <h2 className="text-center font-heading text-3xl font-bold text-foreground">
                  {specialOfferTitle}
                </h2>
                <p className="mt-3 text-center text-lg font-semibold text-red-600">{specialOfferDescription}</p>

                <div className="mx-auto mt-6 flex max-w-3xl flex-wrap justify-center gap-3">
                  <div className="rounded-xl bg-primary px-6 py-4 text-lg font-bold text-primary-foreground">{specialOfferBadge}</div>
                </div>

                <div className="mt-8">
                    <Button className="h-14 w-full bg-red-600 text-base font-semibold text-white hover:bg-red-700" onClick={() => setIsDiscountFormOpen(true)}>
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
                  {item.result_text ? <p className="mt-5 text-base font-semibold text-red-600">{item.result_text}</p> : null}
                </article>
              ))}
            </div>
          </div>
        </section>

        <CourseInstallmentBlock courseName="Оспаривание сделок в банкротстве" />

        <section className="py-10">
          <div className="container max-w-6xl space-y-5">
            <h2 className="font-heading text-3xl font-bold">Дополнительные материалы</h2>
            <div className="grid gap-4 lg:grid-cols-2">
              <article
                className="relative overflow-hidden rounded-3xl border p-8 text-white sm:p-10"
                style={
                  materialsBannerUrl
                    ? {
                        backgroundImage: `linear-gradient(rgba(4, 60, 46, 0.50), rgba(4, 60, 46, 0.60)), url(${materialsBannerUrl})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                      }
                    : {
                        background: "linear-gradient(135deg, #16a34a 0%, #0d9488 50%, #34d399 100%)",
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
                    className="mt-2 h-14 w-full rounded-xl bg-red-600 text-base font-semibold text-white hover:bg-red-700"
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
                  <Button className="h-12 bg-red-600 px-8 text-base text-white hover:bg-red-700">{ctaButtonText}</Button>
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
