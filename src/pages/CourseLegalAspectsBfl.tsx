import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useEffect } from "react";
import { Award, BookOpenCheck, Files, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LeadFormContent } from "@/components/LeadFormSection";

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

const outcomes = [
  "Понимание общих положений, признаков банкротства и логики суда.",
  "Умение выбирать и запускать правильную процедуру: реструктуризация, реализация, мировое, внесудебное.",
  "Понимание ролей и интересов всех участников и управление ими юридически.",
  "Технология подготовки дела: аудит, сбор документов, пакет в суд, стандарты.",
  "Практика торгов и защита интересов доверителя при реализации имущества.",
  "Понимание оспаривания сделок: момент входа, риски, стратегия.",
  "Образцы документов, стандарты подготовки, итоговое тестирование и сертификация.",
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

export default function CourseLegalAspectsBfl() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="animate-page-enter">
        <section className="py-16 sm:py-20">
          <div className="container max-w-6xl">
            <div className="grid gap-6 rounded-3xl bg-gradient-to-br from-primary via-primary-glow to-emerald-500 p-6 sm:p-8 lg:grid-cols-2 lg:p-10">
              <div className="text-white">
                <h1 className="font-heading text-4xl font-bold leading-tight sm:text-5xl">Юридические аспекты БФЛ</h1>
                <p className="mt-2 text-lg font-medium text-white/90">Курс для старта юридической практики БФЛ</p>
                <p className="mt-6 text-lg leading-relaxed text-white/90 sm:text-xl">
                  «Юридические аспекты процедуры банкротства граждан 2.0» — практико-ориентированный курс по банкротству
                  физлиц от старта до торгов и распределения конкурсной массы.
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
          <div className="container max-w-6xl space-y-4">
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <article className="rounded-2xl border bg-card p-5">
                <div className="flex items-start gap-3">
                  <Award className="mt-0.5 h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">После обучения</p>
                    <p className="mt-1 text-base font-semibold text-foreground">Удостоверение о повышении квалификации</p>
                  </div>
                </div>
              </article>

              <article className="rounded-2xl border bg-card p-5">
                <div className="flex items-start gap-3">
                  <BookOpenCheck className="mt-0.5 h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Материалы курса</p>
                    <p className="mt-1 text-base font-semibold text-foreground">Неограниченный доступ к материалам</p>
                  </div>
                </div>
              </article>

              <article className="rounded-2xl border bg-card p-5">
                <div className="flex items-start gap-3">
                  <Files className="mt-0.5 h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Практика в работе</p>
                    <p className="mt-1 text-base font-semibold text-foreground">Готовые шаблоны документов и чек-листы</p>
                  </div>
                </div>
              </article>

              <article className="rounded-2xl border bg-card p-5">
                <div className="flex items-start gap-3">
                  <ShieldCheck className="mt-0.5 h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Сложные кейсы</p>
                    <p className="mt-1 text-base font-semibold text-foreground">Алгоритмы снижения рисков в процедурах БФЛ</p>
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
                <h2 className="font-heading text-3xl font-bold text-foreground sm:text-4xl">
                  Быть квалифицированным специалистом в области БФЛ — значит управлять результатом, а не надеяться на случай
                </h2>
                <p className="text-base leading-relaxed text-muted-foreground sm:text-lg">
                  Квалифицированный юрист по банкротству физлиц видит дело системно: оценивает риски до входа в процедуру,
                  выстраивает стратегию под позицию суда и кредиторов, грамотно взаимодействует с арбитражным управляющим и
                  ведёт доверителя к прогнозируемому итогу. Это уровень, на котором вы снижаете процессуальные ошибки,
                  экономите время команды, усиливаете доверие клиентов и формируете устойчивую профессиональную репутацию.
                </p>
              </div>
            </article>
          </div>
        </section>

        <section className="py-14">
          <div className="container max-w-6xl space-y-5">
            <h2 className="font-heading text-3xl font-bold">Что это за курс</h2>
            <p className="text-muted-foreground">
              Упор курса: правильный вход в процедуру, снижение рисков на сложных делах, стандарты подготовки документов
              и взаимодействия с АУ, тестирование и сертификация по итогам.
            </p>
            <p className="text-muted-foreground">
              Автор/ведущий: Василий Алексеевич Артин — эксперт по банкротству физлиц, руководитель команды АУ,
              директор по развитию группы «Федеральная экспертная служба».
            </p>
          </div>
        </section>

        <section className="py-10"><div className="container max-w-6xl space-y-4"><h2 className="font-heading text-3xl font-bold">Кому подходит</h2><ul className="list-disc space-y-2 pl-6 text-muted-foreground">{audience.map((item) => (<li key={item}>{item}</li>))}</ul></div></section>
        <section className="py-10"><div className="container max-w-6xl space-y-4"><h2 className="font-heading text-3xl font-bold">Результаты на выходе</h2><ul className="list-disc space-y-2 pl-6 text-muted-foreground">{outcomes.map((item) => (<li key={item}>{item}</li>))}</ul></div></section>
        <section className="py-10"><div className="container max-w-6xl space-y-6"><h2 className="font-heading text-3xl font-bold">Структура курса по занятиям</h2>{lessons.map((lesson) => (<article key={lesson.title} className="rounded-xl border bg-card p-5"><h3 className="font-heading text-xl font-semibold">{lesson.title}</h3><ul className="mt-3 list-disc space-y-2 pl-6 text-muted-foreground">{lesson.points.map((point) => (<li key={point}>{point}</li>))}</ul></article>))}</div></section>
        <section className="py-10"><div className="container max-w-6xl space-y-4"><h2 className="font-heading text-3xl font-bold">Формат обучения и правила</h2><ul className="list-disc space-y-2 pl-6 text-muted-foreground"><li>Участники задают вопросы и выполняют задания</li><li>После каждого семинара — тестирование</li><li>Сертификат при результате выше 80% (по правилам курса)</li></ul></div></section>
        <section className="py-10"><div className="container max-w-6xl space-y-4"><h2 className="font-heading text-3xl font-bold">Преимущества курса</h2><ul className="list-disc space-y-2 pl-6 text-muted-foreground">{sellingPoints.map((item) => (<li key={item}>{item}</li>))}</ul></div></section>

        <section id="apply" className="py-14">
          <div className="container max-w-6xl rounded-2xl border bg-card p-6 sm:p-8">
            <h2 className="font-heading text-3xl font-bold">Готовы усилить юридическую практику БФЛ?</h2>
            <p className="mt-3 text-muted-foreground">Оставьте заявку — пришлём программу, формат участия и условия потока.</p>
            <div className="mt-6"><a href="#course-form"><Button className="h-12 px-8 text-base">Открыть форму заявки</Button></a></div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
