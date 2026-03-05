import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { LeadFormContent } from "@/components/LeadFormSection";

const keyBenefits = [
  "Клиенты без рекламных бюджетов — за счёт сети доверия",
  "Чёткая технология: скрипты, правила коммуникации, метрики и внедрение",
  "Рост команды и выход руководителя из операционки (по модели 4К)",
];

const audience = [
  {
    title: "1) Начинающий специалист / волк-одиночка",
    text: "Хотите перейти к команде 2–3 человека, стабильно наращивать выручку и понять вехи роста бизнеса на БФЛ.",
  },
  {
    title: "2) Команда 2–3 человека",
    text: "Нужно вырасти до 5–8 сотрудников, чтобы руководитель стал директором по развитию, а не пожарным в операционке.",
  },
  {
    title: "3) Команда 10–20 человек",
    text: "Цель — увеличить количество сделок, расширить линейку услуг, выйти из операционки и масштабировать управление.",
  },
];

const results = [
  {
    title: "1) Система роста без рекламы",
    text: "Вы перестанете зависеть от дорогого трафика и начнёте получать поток через агентскую программу, партнёрскую программу, регулярные коммуникации и инфополе.",
  },
  {
    title: "2) Упаковка агентской программы как продукта",
    text: "Разберёте, как упаковать предложение, какие формулировки усиливают доверие, какие правила коммуникации превращают знакомства в сделки и как оставлять информационный след.",
  },
  {
    title: "3) Управление через метрики",
    text: "Внедрите показатели коммуникаций, конверсии в партнёрство и заявки, количество договоров, средний чек и качество сервиса/производства.",
  },
  {
    title: "4) Фокус руководителя на 4К",
    text: "Выстроите приоритеты: Качество, Коммуникации, Команда, Коллективный разум.",
  },
];

const modules = [
  {
    title: "Модуль 1. Ключевые вещи, на которых всё работает",
    points: [
      "Где вы платите за воздух в рекламе и как перестать",
      "Красные и голубые океаны: уход от ценовой войны",
      "Ограничивающие убеждения и организационные ошибки",
      "4К, Парето, рычаг и как находить 1% действий, дающих 51% результата",
    ],
  },
  {
    title: "Модуль 2. Агентская программа: клиенты через сеть доверия",
    points: [
      "Как активировать базу клиентов и окружение",
      "Агентские продажи без прямых продаж",
      "Как выстроить сеть, которая приносит сделки каждый месяц",
      "Почему юридический бизнес становится сервисным и как это усиливает конверсию",
    ],
  },
  {
    title: "Модуль 3. Скрипт и правила коммуникации",
    points: [
      "Правила уверенной подачи (без возможно/вероятно)",
      "Как заранее закрывать возражения",
      "Что должен помнить человек после разговора",
      "Как строить касания 2–3 раза в год и превращать знакомого в партнёра",
    ],
  },
  {
    title: "Модуль 4. Партнёрские программы и масштабирование",
    points: [
      "Партнёрства, которые дают рычаг на годы",
      "Системная организация работы с агентами: роли, структура, платформа/боты, каналы",
    ],
  },
];

const advantages = [
  "Вы строите актив, а не покупаете риски.",
  "Один правильный рычаг сильнее десятков действий.",
  "Практика и внедрение, а не послушал и забыл.",
  "Подходит для разных уровней: от одиночки до команды 20+ человек.",
];

const expectations = [
  "Больше заявок за счёт рекомендаций и партнёров",
  "Рост среднего чека и меньше торга по цене",
  "Сокращение долгих ухаживаний и сомнений клиентов",
  "Сильный сервис: доверители приводят 2–3 новых контакта",
  "Понятная структура: кто привлекает, кто обрабатывает, кто ведёт процедуру",
];

const faq = [
  {
    q: "Сколько времени нужно в неделю?",
    a: "Ритм 1–2 занятия в неделю + задания. Рекомендуется отдельно выделять время на внедрение: план коммуникаций, база, касания.",
  },
  {
    q: "Подойдёт ли, если клиентов мало?",
    a: "Да. Показано, как стартовать с телефонной книги и окружения, расширять сеть и превращать новые контакты в агентов.",
  },
  {
    q: "Если у нас уже есть реклама?",
    a: "Практикум нужен, чтобы не зависеть от рекламы и вырастить канал через доверие: агенты, партнёры, коммуникации.",
  },
  {
    q: "Будут ли записи?",
    a: "Да, предусмотрен доступ к записям.",
  },
];

export default function CoursePromotionNoAds() {
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
                <h1 className="font-heading text-4xl font-bold leading-tight sm:text-5xl">Продвижение без вложений в рекламу</h1>
                <p className="mt-6 text-lg leading-relaxed text-white/90 sm:text-xl">
                  Закрытый онлайн-практикум для руководителей юридических компаний: как получать клиентов через агентскую и
                  партнёрскую сеть, выстроить системные коммуникации и занять лидерство в своём городе/регионе.
                </p>
                <div className="mt-8 grid gap-3">
                  {keyBenefits.map((benefit) => (
                    <div key={benefit} className="rounded-xl border border-white/20 bg-white/10 p-3 text-sm font-medium text-white">
                      {benefit}
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

        <section className="py-14">
          <div className="container max-w-6xl space-y-8">
            <h2 className="font-heading text-3xl font-bold">Для кого</h2>
            <p className="text-muted-foreground">Этот практикум для вас, если вы:</p>
            <div className="grid gap-5 md:grid-cols-3">
              {audience.map((item) => (
                <article key={item.title} className="rounded-xl border bg-card p-5">
                  <h3 className="font-heading text-lg font-semibold">{item.title}</h3>
                  <p className="mt-3 text-sm text-muted-foreground">{item.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="py-10"><div className="container max-w-6xl space-y-4"><h2 className="font-heading text-3xl font-bold">Боль рынка: почему это важно сейчас</h2><p className="text-muted-foreground">Юридический рынок БФЛ меняется быстро: конкуренция растёт каждый день, реклама дорожает, клиентов приходится дожимать дольше, практика и требования кредиторов становятся жёстче.</p><p className="text-muted-foreground">Решение — не воевать за трафик, а строить голубой океан доверия: быть первым, кому звонят, первым, о ком рекомендуют, тем, кого выбирают без торга.</p></div></section>

        <section className="py-10"><div className="container max-w-6xl space-y-6"><h2 className="font-heading text-3xl font-bold">Результаты</h2><div className="space-y-4">{results.map((item) => (<article key={item.title} className="rounded-xl border bg-card p-5"><h3 className="font-heading text-xl font-semibold">{item.title}</h3><p className="mt-2 text-muted-foreground">{item.text}</p></article>))}</div></div></section>

        <section className="py-10"><div className="container max-w-6xl space-y-6"><h2 className="font-heading text-3xl font-bold">Программа</h2>{modules.map((module) => (<article key={module.title} className="rounded-xl border bg-card p-5"><h3 className="font-heading text-xl font-semibold">{module.title}</h3><ul className="mt-3 list-disc space-y-2 pl-6 text-muted-foreground">{module.points.map((point) => (<li key={point}>{point}</li>))}</ul></article>))}</div></section>

        <section className="py-10"><div className="container max-w-6xl space-y-4"><h2 className="font-heading text-3xl font-bold">Формат обучения</h2><ul className="list-disc space-y-2 pl-6 text-muted-foreground"><li>1–2 занятия в неделю (Zoom)</li><li>Домашние задания + практические сессии</li><li>Коуч-сессия по индивидуальной траектории роста</li><li>Доступ к записям</li><li>Очная встреча (Москва) + сертификация (если предусмотрено расписанием потока)</li></ul></div></section>

        <section className="py-10"><div className="container max-w-6xl space-y-4"><h2 className="font-heading text-3xl font-bold">Преимущества</h2><ol className="list-decimal space-y-2 pl-6 text-muted-foreground">{advantages.map((item) => (<li key={item}>{item}</li>))}</ol></div></section>

        <section className="py-10"><div className="container max-w-6xl space-y-4"><h2 className="font-heading text-3xl font-bold">Ожидания после внедрения</h2><ul className="list-disc space-y-2 pl-6 text-muted-foreground">{expectations.map((item) => (<li key={item}>{item}</li>))}</ul></div></section>

        <section className="py-10"><div className="container max-w-6xl rounded-xl border bg-card p-6"><h2 className="font-heading text-3xl font-bold">Ведущий</h2><p className="mt-3 text-muted-foreground">Василий Алексеевич Артин — к.ю.н., Председатель Совета партнёров группы «Федеральная экспертная служба».</p></div></section>

        <section className="py-10"><div className="container max-w-6xl space-y-4"><h2 className="font-heading text-3xl font-bold">FAQ</h2><div className="space-y-3">{faq.map((item) => (<article key={item.q} className="rounded-xl border bg-card p-5"><h3 className="font-heading text-lg font-semibold">{item.q}</h3><p className="mt-2 text-muted-foreground">{item.a}</p></article>))}</div></div></section>

        <section id="apply" className="py-14">
          <div className="container max-w-6xl rounded-2xl border bg-card p-6 sm:p-8">
            <h2 className="font-heading text-3xl font-bold">Готовы расти без рекламных бюджетов?</h2>
            <p className="mt-3 text-muted-foreground">Оставьте заявку — пришлём программу, формат участия и условия потока.</p>
            <div className="mt-6"><a href="#course-form"><Button className="h-12 px-8 text-base">Открыть форму заявки</Button></a></div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
