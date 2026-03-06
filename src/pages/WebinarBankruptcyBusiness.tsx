import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useEffect, useState } from "react";
import { BarChart3, Briefcase, CheckCircle2, Lightbulb, Minus, Plus, Scale, Shield, Star, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LeadFormContent } from "@/components/LeadFormSection";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { api, Review } from "@/lib/api";

const highlights = [
  "6 готовых бизнес-моделей для монетизации знаний о банкротстве",
  "Пошаговый план запуска бизнеса за 30 дней с нуля",
  "Реальные кейсы специалистов, построивших успешный бизнес в нише",
];

const audienceGroups = [
  {
    title: "Профессионалы в области банкротства",
    items: [
      "Адвокатов, специализирующихся на банкротстве физических лиц",
      "Финансовых консультантов и инсолвентных менеджеров",
      "Руководителей антикризисных агентств и компаний",
      "Специалистов судебных приставов и органов судопроизводства",
    ],
  },
  {
    title: "Предприниматели",
    items: [
      "Владельцев небольших консалтинговых агентств",
      "Стартапы в финансовой сфере",
      "Фрилансеров, переходящих на корпоративный уровень",
      "Тех, кто хочет диверсифицировать источники дохода",
    ],
  },
  {
    title: "Инвесторы и финансисты",
    items: [
      "Ангел-инвесторов, ищущих перспективные B2B ниши",
      "Собственников фондов и финансовых учреждений",
      "Тех, кто видит потенциал в кризисных ситуациях",
    ],
  },
  {
    title: "Практики в кризис-менеджменте",
    items: [
      "Коучей и бизнес-консультантов",
      "Психологов, работающих с финансовой подготовкой",
      "Преподавателей и тренеров в сфере финансов",
    ],
  },
];

const benefits = [
  "Уже работаете в сфере финансов, права или консультирования",
  "Ищете нишу, которая будет востребована даже в экономических спадах",
  "Хотите расширить услуги и создать новый источник дохода",
  "Заинтересованы в B2B маркетинге и масштабировании",
  "Хотите понять, как зарабатывать на решении реальных проблем людей",
];

const blocks = [
  {
    title: "Блок 1: Рынок и возможности",
    icon: BarChart3,
    points: [
      "Статистика и текущая ситуация – сколько людей столкнулось с банкротством в 2023–2024",
      "Карманы клиентов – кто платит и за что (физические лица, кредиторы, судьи)",
      "Горячие точки спроса – какие услуги наиболее востребованы прямо сейчас",
      "Конкуренция – кто работает на этом рынке и какие пробелы есть",
    ],
  },
  {
    title: "Блок 2: Бизнес-модели, которые работают",
    icon: Briefcase,
    points: [
      "6 готовых бизнес-моделей для монетизации знаний о банкротстве:",
      "— Консультирование физических лиц",
      "— Представление интересов в суде",
      "— Подготовка документов и учетно-отчетная работа",
      "— Образовательные программы для других специалистов",
      "— Софтверные решения для процесса банкротства",
      "— Восстановление кредитной истории",
    ],
  },
  {
    title: "Блок 3: Как начать с нуля",
    icon: Lightbulb,
    points: [
      "Минимальные требования – что нужно, чтобы начать (лицензии, квалификация, капитал)",
      "Пошаговый план запуска – первые шаги в течение 30 дней",
      "Источники клиентов – где искать первых клиентов (SEO, партнерства, рекламные каналы)",
      "Ценообразование – сколько стоят услуги в разных регионах и как правильно считать прибыль",
    ],
  },
  {
    title: "Блок 4: Масштабирование и систематизация",
    icon: Users,
    points: [
      "Автоматизация процессов – какие части можно передать помощникам или софту",
      "Франшиза и расширение – как открыть филиалы или масштабировать по регионам",
      "Создание команды – когда нанимать людей и как структурировать отдел",
      "Инвестиции и финансирование – на что расходуются деньги при росте",
    ],
  },
  {
    title: "Блок 5: Юридические и этические аспекты",
    icon: Scale,
    points: [
      "Регулирование и лицензирование – актуальные требования закона",
      "Страхование ответственности – защита вашего бизнеса от рисков",
      "Этические границы – как не помочь мошенничеству и остаться в рамках закона",
      "Конфликты интересов – как работать прозрачно с кредиторами и судом",
    ],
  },
  {
    title: "Блок 6: Кейсы и примеры",
    icon: CheckCircle2,
    points: [
      "5 реальных кейсов – как специалисты построили успешный бизнес в этой нише",
      "Типовые ошибки – что не надо делать новичкам",
      "Быстрые победы – первые результаты в первые недели",
      "Долгосрочное видение – как выглядит успешный бизнес на этом рынке через 2–3 года",
    ],
  },
  {
    title: "Блок 7: Контроль качества и репутация",
    icon: Shield,
    points: [
      "Как построить доверие – рецензии, рекомендации, сертификаты",
      "Работа с отзывами – как реагировать на критику и недовольство",
      "Стандарты обслуживания – качество работы, которое гарантирует повторные заказы",
      "Личный бренд – зачем нужен и как его строить",
    ],
  },
];

const faqItems = [
  {
    question: "Как проходит вебинар?",
    answer:
      "Вебинар проходит в онлайн-формате. Вы получаете ссылку для подключения после регистрации. Запись будет доступна участникам в течение 30 дней после эфира.",
  },
  {
    question: "Нужен ли опыт в сфере банкротства для участия?",
    answer:
      "Нет, вебинар подходит как для специалистов с опытом, так и для тех, кто только рассматривает эту нишу. Программа построена от основ к продвинутым стратегиям.",
  },
  {
    question: "Будут ли материалы после вебинара?",
    answer:
      "Да, все участники получают презентацию, чек-листы и шаблоны бизнес-планов, которые разбираются на вебинаре.",
  },
  {
    question: "Можно ли задавать вопросы спикеру?",
    answer:
      "Да, в программе предусмотрен блок вопросов и ответов. Также вы можете задать вопросы в чате во время трансляции.",
  },
  {
    question: "Сколько длится вебинар?",
    answer:
      "Продолжительность вебинара — около 2,5–3 часов, включая блок Q&A. Предусмотрен перерыв между основными блоками.",
  },
  {
    question: "Подойдет ли вебинар для юристов из регионов?",
    answer:
      "Да, на вебинаре разбираются модели, применимые в любом регионе. Отдельно рассматриваются особенности ценообразования и поиска клиентов в разных городах.",
  },
];

export default function WebinarBankruptcyBusiness() {
  const [openBlockIndex, setOpenBlockIndex] = useState<number | null>(0);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loadingReviews, setLoadingReviews] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const data = await api.reviews.list(true, 'webinar', 'bankruptcy-business');
        setReviews(data || []);
      } catch {
        setReviews([]);
      } finally {
        setLoadingReviews(false);
      }
    };

    fetchReviews();
  }, []);

  const toggleBlock = (index: number) => {
    setOpenBlockIndex((prev) => (prev === index ? null : index));
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
            <div className="grid gap-6 rounded-3xl bg-gradient-to-br from-primary via-primary-glow to-emerald-500 p-6 sm:p-8 lg:grid-cols-2 lg:p-10">
              <div className="text-white">
                <p className="text-sm font-semibold uppercase tracking-wider text-white/70">Онлайн-вебинар</p>
                <h1 className="mt-2 font-heading text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
                  Как в кризис построить устойчивый бизнес на банкротстве физических лиц
                </h1>
                <p className="mt-6 text-lg leading-relaxed text-white/90 sm:text-xl">
                  Практический вебинар для тех, кто хочет выстроить прибыльный бизнес в одной из самых
                  востребованных ниш — банкротстве физических лиц. Разберём рынок, модели, стратегии запуска
                  и масштабирования.
                </p>
                <div className="mt-8 grid gap-3">
                  {highlights.map((item) => (
                    <div key={item} className="rounded-xl border border-white/20 bg-white/10 p-3 text-sm font-medium text-white">
                      {item}
                    </div>
                  ))}
                </div>
              </div>
              <div id="webinar-form">
                <LeadFormContent compact />
              </div>
            </div>
          </div>
        </section>

        {/* Stats cards */}
        <section className="pb-8">
          <div className="container max-w-6xl space-y-4">
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <article className="rounded-2xl border bg-card p-5">
                <div className="flex items-start gap-3">
                  <BarChart3 className="mt-0.5 h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Формат</p>
                    <p className="mt-1 text-base font-semibold text-foreground">Онлайн-вебинар с записью</p>
                  </div>
                </div>
              </article>

              <article className="rounded-2xl border bg-card p-5">
                <div className="flex items-start gap-3">
                  <Briefcase className="mt-0.5 h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Бизнес-модели</p>
                    <p className="mt-1 text-base font-semibold text-foreground">6 готовых моделей монетизации</p>
                  </div>
                </div>
              </article>

              <article className="rounded-2xl border bg-card p-5">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Практика</p>
                    <p className="mt-1 text-base font-semibold text-foreground">5 реальных кейсов успешного бизнеса</p>
                  </div>
                </div>
              </article>

              <article className="rounded-2xl border bg-card p-5">
                <div className="flex items-start gap-3">
                  <Lightbulb className="mt-0.5 h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Результат</p>
                    <p className="mt-1 text-base font-semibold text-foreground">Пошаговый план запуска за 30 дней</p>
                  </div>
                </div>
              </article>
            </div>

            {/* Motivational block */}
            <article className="relative overflow-hidden rounded-3xl border bg-card p-6 sm:p-8">
              <div className="pointer-events-none absolute inset-0">
                <span className="absolute left-[6%] top-[12%] h-[120%] w-6 -rotate-12 bg-primary/10" />
                <span className="absolute left-[38%] top-[-10%] h-[130%] w-4 rotate-6 bg-primary/10" />
                <span className="absolute left-[62%] top-[5%] h-[120%] w-5 -rotate-[18deg] bg-primary/10" />
                <span className="absolute left-[83%] top-[-6%] h-[140%] w-3 rotate-12 bg-primary/10" />
              </div>

              <div className="relative grid gap-6 lg:grid-cols-2 lg:gap-10">
                <h2 className="font-heading text-2xl font-semibold text-foreground sm:text-3xl">
                  <span className="font-bold text-primary">Банкротство физлиц — антикризисная ниша,</span> которая растёт
                  даже когда экономика падает
                </h2>
                <p className="text-base leading-relaxed text-foreground sm:text-lg">
                  На вебинаре вы узнаете, как превратить растующий спрос на услуги банкротства в устойчивый бизнес:
                  от выбора модели и первых клиентов до масштабирования, найма команды и выхода на системную прибыль.
                  Без воды — только конкретные цифры, шаги и проверенные стратегии.
                </p>
              </div>
            </article>
          </div>
        </section>

        {/* Для кого этот вебинар */}
        <section className="py-10">
          <div className="container max-w-6xl space-y-5">
            <h2 className="font-heading text-3xl font-bold">Для кого этот вебинар</h2>
            <div className="grid gap-4 md:grid-cols-2">
              {audienceGroups.map((group) => (
                <article key={group.title} className="relative overflow-hidden rounded-2xl border bg-card p-6">
                  <span className="pointer-events-none absolute -left-6 top-0 h-full w-4 -rotate-12 bg-primary/10" />
                  <span className="pointer-events-none absolute right-10 top-0 h-full w-3 rotate-6 bg-primary/10" />
                  <span className="absolute right-4 top-4 h-8 w-8 rounded-lg bg-primary/15" />
                  <h3 className="pr-12 text-2xl font-semibold text-foreground">{group.title}</h3>
                  <ul className="mt-4 space-y-2 text-muted-foreground">
                    {group.items.map((item) => (
                      <li key={item} className="flex items-start gap-2">
                        <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Вы получите максимум пользы */}
        <section className="py-10">
          <div className="container max-w-6xl space-y-5">
            <h2 className="font-heading text-3xl font-bold">Вы получите максимум пользы, если</h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {benefits.map((item) => (
                <article key={item} className="relative overflow-hidden rounded-2xl border bg-card p-6">
                  <span className="pointer-events-none absolute -left-5 top-0 h-full w-3 -rotate-12 bg-primary/10" />
                  <span className="pointer-events-none absolute right-10 top-0 h-full w-2 rotate-6 bg-primary/10" />
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
                    <p className="text-lg font-medium text-foreground">{item}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Программа вебинара */}
        <section className="py-10">
          <div className="container max-w-6xl space-y-5">
            <div className="flex items-start justify-between gap-4">
              <h2 className="font-heading text-3xl font-bold">Что узнаете на вебинаре</h2>
              <p className="text-sm font-medium text-primary">7 блоков программы</p>
            </div>

            <div className="space-y-3">
              {blocks.map((block, index) => {
                const isOpen = openBlockIndex === index;
                const Icon = block.icon;

                return (
                  <article key={block.title} className="overflow-hidden rounded-2xl border bg-card">
                    <button
                      type="button"
                      onClick={() => toggleBlock(index)}
                      className="flex w-full items-center justify-between gap-4 p-5 text-left"
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="h-5 w-5 flex-shrink-0 text-primary" />
                        <h3 className="font-heading text-xl font-semibold text-foreground">{block.title}</h3>
                      </div>
                      <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                        {isOpen ? <Minus className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
                      </span>
                    </button>

                    {isOpen ? (
                      <div className="border-t bg-muted/20 p-5">
                        <ul className="list-disc space-y-2 pl-5 text-muted-foreground">
                          {block.points.map((point) => (
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
                  Забронируйте место на вебинаре
                </h2>
                <p className="mt-3 text-center text-lg font-semibold text-primary">
                  Количество мест ограничено — зарегистрируйтесь заранее
                </p>

                <div className="mt-8">
                  <Button className="h-14 w-full text-base font-semibold" onClick={() => setIsFormOpen(true)}>
                    Записаться на вебинар
                  </Button>
                </div>
              </div>
            </article>
          </div>
        </section>

        {/* Reviews */}
        {!loadingReviews && reviews.length > 0 && (
          <section className="py-10">
            <div className="container max-w-6xl space-y-5">
              <h2 className="font-heading text-3xl font-bold">Отзывы участников</h2>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {reviews.map((review) => (
                  <article key={review.id} className="rounded-3xl border bg-muted/30 p-6">
                    <div className="mb-4 flex items-center gap-1">
                      {Array.from({ length: review.rating }).map((_, idx) => (
                        <Star key={`${review.id}-star-${idx}`} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <p className="text-lg leading-relaxed text-foreground/80">{review.comment}</p>
                    <div className="mt-6 flex items-center gap-3 border-t border-border pt-4">
                      {review.author_avatar_url ? (
                        <img
                          src={review.author_avatar_url}
                          alt={review.author_name}
                          className="h-12 w-12 rounded-full object-cover"
                        />
                      ) : (
                        <div className="h-12 w-12 rounded-full bg-primary/15 flex items-center justify-center text-primary font-bold">
                          {review.author_name.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div>
                        <p className="font-semibold text-foreground">{review.author_name}</p>
                        <p className="text-sm text-muted-foreground">Участник вебинара</p>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* FAQ */}
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

        {/* Bottom CTA */}
        <section id="apply" className="py-14">
          <div className="container max-w-6xl">
            <div className="relative overflow-hidden rounded-2xl border bg-card p-6 sm:p-8">
              <span className="pointer-events-none absolute left-[5%] top-0 h-full w-4 -rotate-12 bg-primary/10" />
              <span className="pointer-events-none absolute left-[42%] top-0 h-full w-3 rotate-[8deg] bg-primary/10" />
              <span className="pointer-events-none absolute right-[12%] top-0 h-full w-4 -rotate-[6deg] bg-primary/10" />
              <h2 className="relative font-heading text-3xl font-bold">Готовы начать строить бизнес на банкротстве?</h2>
              <p className="relative mt-3 text-muted-foreground">
                Оставьте заявку — получите программу вебинара, условия участия и бонусные материалы.
              </p>
              <div className="relative mt-6">
                <a href="#webinar-form">
                  <Button className="h-12 px-8 text-base">Открыть форму заявки</Button>
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="w-[96vw] max-w-[760px] p-4 sm:p-6">
          <DialogTitle className="sr-only">Запись на вебинар</DialogTitle>
          <LeadFormContent compact />
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
}
