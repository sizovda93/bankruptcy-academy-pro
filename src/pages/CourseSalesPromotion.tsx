import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useEffect, useMemo, useState } from "react";
import { Award, BookOpenCheck, Target, TrendingUp, Users, Sparkles, Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LeadFormContent } from "@/components/LeadFormSection";
import { api, StudentCase, Teacher } from "@/lib/api";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/hooks/use-toast";

const highlights = [
  "Технология продажи «от голоса до договора» без скидок и уговоров",
  "Система доверия через сознательные и бессознательные триггеры",
  "Метрики, воронка, конверсия и управление результатом",
];

const audience = [
  "Юрист/аудитор/менеджер, кто проводит консультации и хочет поднять конверсию во встречу и в договор, научиться уверенно «вести» клиента и закрывать сделки без скидок.",
  "Руководитель юр. компании, кому нужна система продаж: стандарты консультации, контроль качества, метрики, «воронка», офис/упаковка/портфолио как часть продаж.",
  "Команда, которая «сливает» лиды: клиенты «думают и пропадают», боятся цены, не приходят на встречу, нет триггеров доверия и единой инфолинии.",
];

const lessons = [
  {
    title: "Занятие 1. Война и мир с кредиторами + продуктовая линейка",
    points: [
      "Логика «вы либо решаете проблему клиента, создавая проблему кредиторам / либо наоборот»",
      "Какие услуги закрывают потребности должника: выкуп долга/мировое, защита по кредитам и займам, работа с приставами, реструктуризация, банкротство, ипотека, взыскание через БФЛ и т.д.",
      "Понимание продуктовой линейки для разных типов клиентов",
    ],
  },
  {
    title: "Занятие 2. Психологические аспекты продаж",
    points: [
      "Что такое продажа услуги как формирование «картины мира жизни без долгов»",
      "Сознательные и бессознательные триггеры (внешний вид, голос, офис, уверенность)",
      "Почему «юристы продают хуже» и как перестроиться",
      "6 стадий: привлечение → завлечение → увлечение → отвлечение → развлечение → вовлечение",
      "Работа с убеждениями, ресурсным состоянием, «машина продаж»",
    ],
  },
  {
    title: "Занятие 3. Типология клиентов и подстройка",
    points: [
      "Психотипы и готовность решать проблему",
      "«Холодный/нейтральный/тёплый/горячий» — как определять и работать с каждым типом",
      "Механика «желание/необходимость/могу/хочу/надо»",
      "Как попадать в ожидания: безопасность/выгода/комфорт/успех",
      "Техники подстройки под тип клиента для максимальной конверсии",
    ],
  },
  {
    title: "Занятие 4. Доверие, конгруэнтность, касания",
    points: [
      "Точки доступа к подсознанию, внушаемость и механика доверия",
      "«6 касаний до результата» и расширенная цепочка касаний (вплоть до 25)",
      "Единая информационная линия и почему «любое несоответствие = минус касание»",
      "Идея: цель — не договор, а «клиентура окружения» + агентская логика",
      "Выстраивание долгосрочных отношений с клиентами",
    ],
  },
  {
    title: "Занятие 5. Технология продаж: воронка и аудит",
    points: [
      "Воронка принятия решения клиентом: от первого контакта до подписания договора",
      "Задачи аудитора: усиление боли/потребности, показ будущего, варианты решения",
      "Работа с возражениями, доказательства, преимущества компании",
      "Позиционирование продукта/менеджера/команды («великолепная тройка»)",
      "Пошаговая схема: контакт → выявление потребностей → презентация решения → возражения → закрытие → сопровождение",
    ],
  },
  {
    title: "Занятие 6. Отстройка от конкурентов и продажи дороже",
    points: [
      "Как не конкурировать по цене и продавать дороже рынка",
      "Структура отстройки + подстройка под базовую потребность клиента",
      "Модель «кто мы / мы-они / базовая потребность / повторение смысла / нивелирование конкурентов»",
      "«Повторение одной мысли разными словами» как техника закрепления",
      "Формирование уникального ценностного предложения",
    ],
  },
];

const results = [
  {
    icon: Target,
    title: "Технология продажи «от голоса до договора»",
    text: "Пошаговая схема: контакт → выявление потребностей → презентация решения → возражения → закрытие → сопровождение. Готовый алгоритм для внедрения в работу команды.",
  },
  {
    icon: Users,
    title: "Понимание «что вы продаёте на самом деле»",
    text: "Не «банкротство» как услугу, а безопасность, комфорт, уверенность, внимание, выгоду/победу — через потребности клиента. Смена фокуса с процесса на результат.",
  },
  {
    icon: Award,
    title: "Система доверия (сознательные + бессознательные триггеры)",
    text: "Как клиент считывает уверенность/профессионализм и почему это решает конверсию. Артефакты доверия: решения судов, благодарности, папки, сервис, регламент.",
  },
  {
    icon: TrendingUp,
    title: "Отстройка от конкурентов и продажи дороже",
    text: "Модель «кто мы / мы-они / базовая потребность / повторение смысла / нивелирование конкурентов». Как обосновывать высокую цену через ценность.",
  },
  {
    icon: BookOpenCheck,
    title: "Метрики, воронка, конверсия, ROI",
    text: "Какие показатели считать и как управлять результатом (заявки → встречи → договоры → авансы → клиенты). Превращение продаж в управляемый процесс.",
  },
  {
    icon: Sparkles,
    title: "Длинная система касаний + агентская программа",
    text: "Как «после договора» превращать клиента в постоянный источник рекомендаций (цель — не просто договор, а клиентура окружения).",
  },
];

const tasks = [
  "Прописать, «что вы продаёте по каждому продукту» (смысл/выгода, а не юридический термин)",
  "Выписать свои сильные/слабые стороны в продажах (имидж/коммуникации/профессионализм)",
  "Проработать триггеры доверия (какие на сознание, какие на подсознание)",
  "Выстроить общую информационную линию, скрипты и предложения для минимизации рисков",
  "Разработать систему касаний для своей практики",
  "Внедрить метрики отслеживания конверсии на каждом этапе воронки",
];

const sellingPoints = [
  "Продажи начинаются с доверия: клиент не покупает услугу — он покупает уверенность и безопасное будущее",
  "Офис и упаковка — часть сделки (артефакты: решения судов, благодарности, папки, сервис, регламент)",
  "Метрики и конверсия — как «рычаг»: вы управляете процессом, а не гадаете",
  "Длинная игра: договор — не конец, а старт агентской/рекомендательной системы",
  "Фокус не на «уговорить», а на системе формирования доверия и готовности клиента действовать",
  "Управление конверсией через понимание психотипов и стадий готовности клиента",
];

const faqItems = [
  {
    question: "Как проходит обучение?",
    answer:
      "Обучение проходит в записи: вы получаете доступ к материалам и можете смотреть уроки в любое удобное время, в своем темпе. В программе предусмотрены практические разборы, задания для отработки навыков продаж.",
  },
  {
    question: "Подходит ли курс для начинающих в продажах?",
    answer:
      "Да. Курс построен так, чтобы дать системное понимание от основ психологии продаж до отстройки от конкурентов. Подойдет как новичкам, так и опытным юристам, которые хотят систематизировать свои знания и внедрить метрики.",
  },
  {
    question: "Смогу ли я применить знания сразу после курса?",
    answer:
      "Да. В курсе предусмотрены практические задания уровня «взял и внедрил»: скрипты, чек-листы триггеров доверия, система касаний, метрики воронки. Вы сможете сразу применять инструменты в работе.",
  },
  {
    question: "Можно ли задавать вопросы по своим кейсам?",
    answer:
      "Да. Участники задают вопросы в процессе обучения и на разборах, чтобы адаптировать инструменты курса под свои реальные ситуации и клиентские кейсы.",
  },
  {
    question: "Что делать, если я работаю в команде?",
    answer:
      "Отлично! Курс дает стандарты консультации, которые можно внедрить в команду: регламент общения с клиентами, единую информационную линию, метрики для контроля качества продаж.",
  },
  {
    question: "Как долго действует доступ к материалам?",
    answer:
      "Доступ к материалам курса неограничен: вы сможете пересматривать уроки, использовать шаблоны и скрипты в любой момент после прохождения курса.",
  },
  {
    question: "Можно ли совмещать обучение с работой?",
    answer:
      "Да, программа рассчитана на практикующих юристов: занятия в записи, внедрение инструментов идет параллельно с вашей текущей практикой, что позволяет сразу видеть результаты.",
  },
];

const teamOrder = ["артин", "дрыгваль", "лященко"];

const teamFallback: Teacher[] = [
  {
    id: "fallback-sales-1",
    full_name: "Василий Алексеевич Артин",
    position: "Ведущий эксперт курса",
    bio: "Эксперт по построению систем продаж юридических услуг.",
    expertise: "Технология продаж, психология клиента, построение отдела продаж.",
    experience: "Практикующий эксперт",
    photo_url: "",
    display_order: 1,
    is_published: true,
    created_at: "",
    updated_at: "",
  },
  {
    id: "fallback-sales-2",
    full_name: "Дрыгваль Дарья Владимировна",
    position: "Руководитель отдела сопровождения",
    bio: "Старший эксперт по клиентскому сервису и системе касаний.",
    expertise: "Выстраивание долгосрочных отношений с клиентами, система касаний, клиентский сервис и агентские программы.",
    experience: "10 лет",
    photo_url: "",
    display_order: 2,
    is_published: true,
    created_at: "",
    updated_at: "",
  },
  {
    id: "fallback-sales-3",
    full_name: "Лященко Елена Юрьевна",
    position: "Арбитражный управляющий",
    bio: "Эксперт по сопровождению сложных проектов и стандартизации процессов.",
    expertise: "Стандарты коммуникации с клиентами, регламенты работы, контроль качества сопровождения и управление командой.",
    experience: "15 лет",
    photo_url: "",
    display_order: 3,
    is_published: true,
    created_at: "",
    updated_at: "",
  },
];

const teamExpertiseByName: Record<string, string> = {
  артин:
    "Построение систем продаж юридических услуг, технология консультации от первого контакта до договора, психология доверия.",
  дрыгваль:
    "Выстраивание долгосрочных отношений с клиентами, разработка системы касаний и агентских программ, клиентский сервис.",
  лященко:
    "Стандартизация процессов сопровождения клиентов, регламенты коммуникации, контроль качества работы команды.",
};

const getTeamExpertise = (fullName: string) => {
  const lower = fullName.toLowerCase();
  if (lower.includes("артин")) return teamExpertiseByName.артин;
  if (lower.includes("дрыгваль")) return teamExpertiseByName.дрыгваль;
  if (lower.includes("лященко")) return teamExpertiseByName.лященко;
  return "Практическая экспертиза в продажах юридических услуг и построении систем доверия.";
};

const fallbackStudentCases: StudentCase[] = [
  {
    id: "fallback-sales-case-1",
    course_id: "",
    student_name: "Дмитрий В.",
    student_role: "Юрист по банкротству",
    case_text:
      "После курса внедрил систему триггеров доверия и начал использовать технику 6 касаний. Клиенты перестали «уходить подумать». Конверсия из консультации в договор выросла с 35% до 62%.",
    result_text: "Результат: +77% к конверсии в договор",
    is_published: true,
    display_order: 1,
    created_at: "",
    updated_at: "",
  },
  {
    id: "fallback-sales-case-2",
    course_id: "",
    student_name: "Елена К.",
    student_role: "Руководитель юридической компании",
    case_text:
      "Применила модель отстройки от конкурентов и перестала снижать цены. Внедрила стандарты консультации для команды. Средний чек вырос с 180 тыс до 420 тыс рублей без потери клиентов.",
    result_text: "Результат: средний чек +133%",
    is_published: true,
    display_order: 2,
    created_at: "",
    updated_at: "",
  },
  {
    id: "fallback-sales-case-3",
    course_id: "",
    student_name: "Андрей М.",
    student_role: "Менеджер по продажам",
    case_text:
      "Использовал типологию клиентов и подстройку под психотипы. Научился правильно выявлять потребности и презентовать решение. Количество сделок в месяц выросло с 8 до 19.",
    result_text: "Результат: +138% по количеству сделок",
    is_published: true,
    display_order: 3,
    created_at: "",
    updated_at: "",
  },
  {
    id: "fallback-sales-case-4",
    course_id: "",
    student_name: "Мария Л.",
    student_role: "Юрист-консультант",
    case_text:
      "Внедрила агентскую программу и длинную систему касаний. Клиенты начали приводить рекомендации. За 4 месяца получила 23 новых клиента через существующую базу без вложений в рекламу.",
    result_text: "Результат: 23 клиента по рекомендациям за 4 месяца",
    is_published: true,
    display_order: 4,
    created_at: "",
    updated_at: "",
  },
  {
    id: "fallback-sales-case-5",
    course_id: "",
    student_name: "Игорь Т.",
    student_role: "Партнёр юридической компании",
    case_text:
      "Внедрил CRM и систему автоматизации касаний из модуля по технологии продаж. Настроил последовательность касаний: звонок → письмо → напоминание → повторный контакт. Конверсия «холодных» лидов в клиентов выросла с 8% до 24%.",
    result_text: "Результат: конверсия холодных лидов +200%",
    is_published: true,
    display_order: 5,
    created_at: "",
    updated_at: "",
  },
  {
    id: "fallback-sales-case-6",
    course_id: "",
    student_name: "Светлана Б.",
    student_role: "Юрист по банкротству",
    case_text:
      "Применила техники работы с возражениями и презентационный блок. Научилась переформулировать «дорого» в «инвестиция», использовать кейсы и социальные доказательства. Отказов стало меньше, средний чек вырос с 220 до 380 тыс рублей.",
    result_text: "Результат: средний чек +73%, отказов −41%",
    is_published: true,
    display_order: 6,
    created_at: "",
    updated_at: "",
  },
];

export default function CourseSalesPromotion() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [studentCases, setStudentCases] = useState<StudentCase[]>(fallbackStudentCases);
  const [openLessonIndex, setOpenLessonIndex] = useState<number | null>(0);
  const [isDiscountFormOpen, setIsDiscountFormOpen] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  
  const [guideBannerUrl, setGuideBannerUrl] = useState("");
  const [guideDownloadUrl, setGuideDownloadUrl] = useState("");
  const [guideTitle, setGuideTitle] = useState("Получите методичку по продажам юридических услуг");
  const [guideDescription, setGuideDescription] = useState(
    "Практическое руководство по технологии продаж, триггерам доверия и системе касаний для юристов по банкротству."
  );

  const [guideFullName, setGuideFullName] = useState("");
  const [guidePhone, setGuidePhone] = useState("");
  const [guideEmail, setGuideEmail] = useState("");
  const [guideConsentPolicy, setGuideConsentPolicy] = useState(false);
  const [guideConsentOffers, setGuideConsentOffers] = useState(true);
  const [guideSubmitting, setGuideSubmitting] = useState(false);

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
        const salesCourse = courses.find((course) => {
          const title = course.title.toLowerCase();
          return title.includes("продаж") || title.includes("продавать") || title.includes("1,5 млн");
        });

        if (!salesCourse) {
          setStudentCases(fallbackStudentCases);
          return;
        }

        const data = await api.studentCases.list(true, salesCourse?.id);
        setStudentCases(data?.length ? data : fallbackStudentCases);
      } catch {
        setStudentCases(fallbackStudentCases);
      }
    };

    const fetchSettings = async () => {
      try {
        const settings = await api.settings.list();
        const map = new Map(settings.map((item) => [item.setting_key, item.setting_value || ""]));
        setGuideBannerUrl(map.get("sales_guide_banner_url") || "");
        setGuideDownloadUrl(map.get("sales_guide_download_url") || "");
        setGuideTitle(map.get("sales_guide_title") || "Получите методичку по продажам юридических услуг");
        setGuideDescription(
          map.get("sales_guide_description") ||
            "Практическое руководство по технологии продаж, триггерам доверия и системе касаний для юристов по банкротству."
        );
      } catch {
        setGuideBannerUrl("");
        setGuideDownloadUrl("");
      }
    };

    fetchTeam();
    fetchCases();
    fetchSettings();
  }, []);

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

  const handleGuideLeadSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!guideFullName.trim() || !guidePhone.trim()) {
      toast({ title: "Заполните поля", description: "Укажите имя и телефон.", variant: "destructive" });
      return;
    }

    if (!guideConsentPolicy) {
      toast({
        title: "Требуется согласие",
        description: "Подтвердите обработку персональных данных.",
        variant: "destructive",
      });
      return;
    }

    try {
      setGuideSubmitting(true);
      await api.leads.create({
        full_name: guideFullName.trim(),
        phone: guidePhone.trim(),
        email: guideEmail.trim() || undefined,
        consent_policy: guideConsentPolicy,
        consent_offers: guideConsentOffers,
        source: "sales_guide_2026",
      });

      if (guideDownloadUrl) {
        const link = document.createElement("a");
        link.href = guideDownloadUrl;
        link.download = "";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast({ title: "Готово", description: "Заявка отправлена, методичка скачивается." });
      } else {
        toast({
          title: "Заявка отправлена",
          description: "Файл методички еще не загружен в админке. Добавьте его в Настройках.",
        });
      }

      setGuideFullName("");
      setGuidePhone("");
      setGuideEmail("");
      setGuideConsentPolicy(false);
      setGuideConsentOffers(true);
    } catch (error: any) {
      toast({ title: "Ошибка отправки", description: error.message, variant: "destructive" });
    } finally {
      setGuideSubmitting(false);
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
                <h1 className="font-heading text-4xl font-bold leading-tight sm:text-5xl">
                  Как продавать на 1,5 млн рублей
                </h1>
                <p className="mt-2 text-lg font-medium text-white/90">
                  Практический курс по продажам юридических услуг в нише долгов/банкротства
                </p>
                <p className="mt-6 text-lg leading-relaxed text-white/90 sm:text-xl">
                  Как продавать юридические услуги по банкротству на чеки 300–800 тыс и выстраивать продажи до 1,5 млн в
                  месяц: технология консультации и доверия, воронка и метрики, отстройка от конкурентов без скидок,
                  типология клиентов, система касаний и превращение доверителей в источник рекомендаций.
                </p>
                <div className="mt-8 grid gap-3">
                  {highlights.map((item) => (
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
                <span className="absolute left-[6%] top-[12%] h-[120%] w-6 -rotate-12 bg-primary/10" />
                <span className="absolute left-[38%] top-[-10%] h-[130%] w-4 rotate-6 bg-primary/10" />
                <span className="absolute left-[62%] top-[5%] h-[120%] w-5 -rotate-[18deg] bg-primary/10" />
                <span className="absolute left-[83%] top-[-6%] h-[140%] w-3 rotate-12 bg-primary/10" />
              </div>

              <div className="relative grid gap-6 lg:grid-cols-2 lg:gap-10">
                <h2 className="font-heading text-2xl font-semibold text-foreground sm:text-3xl">
                  <span className="font-bold text-primary">Продажи начинаются с доверия</span> — клиент не покупает
                  услугу, он покупает уверенность и безопасное будущее
                </h2>
                <p className="text-base leading-relaxed text-foreground sm:text-lg">
                  Этот курс — про системный подход к продажам юридических услуг: как формировать доверие и готовность
                  клиента действовать, как проводить аудит → встреча → договор, как не конкурировать по цене и продавать
                  дороже, как управлять конверсией и метриками, как строить серийные касания и превращать клиента в
                  агента/рекомендателя.
                </p>
              </div>
            </article>
          </div>
        </section>

        <section className="py-10">
          <div className="container max-w-6xl space-y-6">
            <h2 className="font-heading text-3xl font-bold">Что вы получите на выходе</h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {results.map((item) => {
                const Icon = item.icon;
                return (
                  <article key={item.title} className="rounded-2xl border bg-card p-5">
                    <div className="flex items-start gap-3">
                      <Icon className="mt-0.5 h-6 w-6 flex-shrink-0 text-primary" />
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
                          className="h-full w-full object-cover object-center"
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
              <p className="text-sm font-medium text-primary">6 занятий + практика</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <article className="rounded-2xl border bg-card p-5">
                <div className="flex items-start gap-3">
                  <Sparkles className="mt-0.5 h-5 w-5 text-primary" />
                  <div className="space-y-2 text-muted-foreground">
                    <p>Дистанционное обучение в удобном формате</p>
                    <p>Практические задания уровня «взял и внедрил»</p>
                  </div>
                </div>
              </article>
              <article className="rounded-2xl border bg-card p-5">
                <h3 className="text-lg font-semibold text-primary">Что будет на курсе</h3>
                <p className="mt-2 text-muted-foreground">
                  Теория продаж, психология клиента, скрипты, метрики, практические разборы кейсов.
                </p>
              </article>
            </div>

            <div className="space-y-3">
              {lessons.map((lesson, index) => {
                const isOpen = openLessonIndex === index;

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
                      <div className="border-t bg-muted/20 p-5">
                        <ul className="list-disc space-y-2 pl-5 text-muted-foreground">
                          {lesson.points.map((point) => (
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

        <section className="py-10">
          <div className="container max-w-6xl space-y-5">
            <h2 className="font-heading text-3xl font-bold">Практические задания</h2>
            <div className="grid gap-4 md:grid-cols-2">
              {tasks.map((task, index) => (
                <article key={task} className="relative overflow-hidden rounded-2xl border bg-card p-5">
                  <span className="pointer-events-none absolute -left-4 top-0 h-full w-3 -rotate-12 bg-primary/10" />
                  <span className="pointer-events-none absolute right-8 top-0 h-full w-2 rotate-6 bg-primary/10" />
                  <div className="relative flex items-start gap-3">
                    <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-primary/15 text-sm font-bold text-primary">
                      {index + 1}
                    </span>
                    <p className="text-foreground">{task}</p>
                  </div>
                </article>
              ))}
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
                  Специальное предложение для комплексного обучения
                </h2>
                <p className="mt-3 text-center text-lg font-semibold text-primary">
                  При покупке всех курсов сразу, скидка 20% на все
                </p>

                <div className="mx-auto mt-6 flex max-w-3xl flex-wrap justify-center gap-3">
                  <div className="rounded-xl bg-primary px-6 py-4 text-lg font-bold text-primary-foreground">-20%</div>
                </div>

                <div className="mt-8">
                  <Button className="h-14 w-full text-base font-semibold" onClick={() => setIsDiscountFormOpen(true)}>
                    Забронировать цену со скидкой
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
                <h3 className="pr-12 text-2xl font-semibold text-foreground">Юристам/аудиторам/менеджерам</h3>
                <p className="mt-4 text-muted-foreground">{audience[0]}</p>
              </article>

              <article className="relative overflow-hidden rounded-2xl border bg-card p-6">
                <span className="pointer-events-none absolute -left-4 top-0 h-full w-3 -rotate-[16deg] bg-primary/10" />
                <span className="pointer-events-none absolute right-16 top-0 h-full w-4 rotate-12 bg-primary/10" />
                <span className="absolute right-4 top-4 h-8 w-8 rounded-lg bg-primary/15" />
                <h3 className="pr-12 text-2xl font-semibold text-foreground">Руководителям юридических компаний</h3>
                <p className="mt-4 text-muted-foreground">{audience[1]}</p>
              </article>

              <article className="relative overflow-hidden rounded-2xl border bg-card p-6 md:col-span-2">
                <span className="pointer-events-none absolute left-[8%] top-0 h-full w-4 -rotate-[10deg] bg-primary/10" />
                <span className="pointer-events-none absolute left-[58%] top-0 h-full w-3 rotate-[9deg] bg-primary/10" />
                <span className="absolute right-4 top-4 h-8 w-8 rounded-lg bg-primary/15" />
                <h3 className="pr-12 text-2xl font-semibold text-foreground">Командам, которые «сливают» лиды</h3>
                <p className="mt-4 text-muted-foreground">{audience[2]}</p>
              </article>
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
                  {item.result_text ? <p className="mt-5 text-base font-semibold text-primary">{item.result_text}</p> : null}
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="py-10">
          <div className="container max-w-6xl space-y-5">
            <h2 className="font-heading text-3xl font-bold">Практические материалы</h2>
            <div className="grid gap-4 lg:grid-cols-2">
              <article
                className="relative overflow-hidden rounded-3xl border p-8 text-white sm:p-10"
                style={
                  guideBannerUrl
                    ? {
                        backgroundImage: `linear-gradient(rgba(22, 163, 74, 0.65), rgba(22, 163, 74, 0.65)), url(${guideBannerUrl})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                      }
                    : {
                        background: "linear-gradient(135deg, #16a34a 0%, #0d9488 50%, #34d399 100%)",
                      }
                }
              >
                <h3 className="font-heading text-3xl font-bold leading-tight">{guideTitle}</h3>
                <p className="mt-5 text-lg leading-relaxed text-white/90">{guideDescription}</p>
                <ul className="mt-7 list-disc space-y-2 pl-5 text-base text-white/90">
                  <li>Скрипты продаж для консультаций по банкротству и работе с долгами</li>
                  <li>Чек-листы триггеров доверия и техники работы с возражениями клиентов</li>
                  <li>Шаблоны для выстраивания системы касаний и агентских программ</li>
                  <li>Метрики отслеживания конверсии на каждом этапе воронки продаж</li>
                </ul>
              </article>

              <div className="rounded-3xl border border-border bg-card p-6 sm:p-8">
                <form className="space-y-4" onSubmit={handleGuideLeadSubmit}>
                  <Input
                    className="h-14 rounded-xl bg-muted/40 text-base"
                    placeholder="Имя и фамилия"
                    value={guideFullName}
                    onChange={(e) => setGuideFullName(e.target.value)}
                    required
                  />
                  <Input
                    className="h-14 rounded-xl bg-muted/40 text-base"
                    placeholder="+7 (000) 000-00-00"
                    value={guidePhone}
                    onChange={(e) => setGuidePhone(e.target.value)}
                    required
                  />
                  <Input
                    className="h-14 rounded-xl bg-muted/40 text-base"
                    placeholder="Email"
                    type="email"
                    value={guideEmail}
                    onChange={(e) => setGuideEmail(e.target.value)}
                  />

                  <label className="flex items-start gap-3 text-sm text-muted-foreground">
                    <Checkbox
                      checked={guideConsentPolicy}
                      onCheckedChange={(v) => setGuideConsentPolicy(Boolean(v))}
                      className="mt-0.5"
                    />
                    <span>Я согласен с обработкой персональных данных в соответствии с политикой обработки и офертой</span>
                  </label>

                  <label className="flex items-start gap-3 text-sm text-muted-foreground">
                    <Checkbox
                      checked={guideConsentOffers}
                      onCheckedChange={(v) => setGuideConsentOffers(Boolean(v))}
                      className="mt-0.5"
                    />
                    <span>Я соглашаюсь получать уведомления о новых продуктах и предложениях</span>
                  </label>

                  <Button
                    type="submit"
                    className="mt-2 h-14 w-full rounded-xl bg-foreground text-base font-semibold text-background hover:bg-foreground/90"
                    disabled={!guideConsentPolicy || guideSubmitting}
                  >
                    {guideSubmitting ? "Отправка..." : "Получить методичку и скачать"}
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </section>

        <section className="py-10">
          <div className="container max-w-6xl space-y-5">
            <h2 className="font-heading text-3xl font-bold">Ключевые преимущества курса</h2>
            <div className="grid gap-4 md:grid-cols-2">
              {sellingPoints.map((item) => (
                <article key={item} className="relative overflow-hidden rounded-2xl border bg-card p-6">
                  <span className="pointer-events-none absolute -left-5 top-0 h-full w-3 -rotate-12 bg-primary/10" />
                  <span className="pointer-events-none absolute right-10 top-0 h-full w-2 rotate-6 bg-primary/10" />
                  <span className="absolute right-4 top-4 h-8 w-8 rounded-lg bg-primary/15" />
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
              {faqItems.map((faq, index) => {
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

        <section id="apply" className="py-14">
          <div className="container max-w-6xl">
            <div className="relative overflow-hidden rounded-2xl border bg-card p-6 sm:p-8">
              <span className="pointer-events-none absolute left-[5%] top-0 h-full w-4 -rotate-12 bg-primary/10" />
              <span className="pointer-events-none absolute left-[42%] top-0 h-full w-3 rotate-[8deg] bg-primary/10" />
              <span className="pointer-events-none absolute right-[12%] top-0 h-full w-4 -rotate-[6deg] bg-primary/10" />
              <h2 className="relative font-heading text-3xl font-bold">Готовы вывести продажи на новый уровень?</h2>
              <p className="relative mt-3 text-muted-foreground">
                Оставьте заявку — пришлём программу, формат участия и условия потока.
              </p>
              <div className="relative mt-6">
                <a href="#course-form">
                  <Button className="h-12 px-8 text-base">Открыть форму заявки</Button>
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
