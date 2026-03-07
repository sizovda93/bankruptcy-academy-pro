import { CalendarRange, CreditCard, Wallet } from "lucide-react";
import { LeadFormContent } from "@/components/LeadFormSection";

type CourseInstallmentBlockProps = {
  courseName?: string;
};

const terms = [
  {
    icon: CalendarRange,
    title: "4 месяца",
    text: "Разбиваем оплату на четыре понятных этапа без полной нагрузки одним платежом.",
  },
  {
    icon: CreditCard,
    title: "Удобный график",
    text: "Подберем формат оплаты под ваш рабочий ритм и текущую финансовую нагрузку.",
  },
  {
    icon: Wallet,
    title: "Быстрый старт",
    text: "Можно зафиксировать место на курсе и спокойно распределить бюджет на обучение.",
  },
];

export default function CourseInstallmentBlock({ courseName }: CourseInstallmentBlockProps) {
  const formId = "installment-lead-form";

  return (
    <section className="py-12 sm:py-14">
      <div className="container max-w-6xl">
        <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="relative overflow-hidden rounded-3xl border bg-card p-6 sm:p-8">
            <span className="pointer-events-none absolute left-[8%] top-0 h-full w-4 -rotate-12 bg-primary/10" />
            <span className="pointer-events-none absolute left-[47%] top-0 h-full w-3 rotate-[9deg] bg-primary/10" />
            <span className="pointer-events-none absolute right-[10%] top-0 h-full w-4 -rotate-[7deg] bg-primary/10" />

            <div className="relative">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">Рассрочка</p>
              <h2 className="mt-3 font-heading text-3xl font-bold leading-tight sm:text-4xl">
                Оплата курса в рассрочку на 4 месяца
              </h2>
              <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
                Если хотите начать обучение без полной оплаты сразу, оставьте заявку. Поможем оформить рассрочку,
                расскажем по графику платежей и подберем удобный формат участия
                {courseName ? ` для курса «${courseName}».` : "."}
              </p>
            </div>

            <div className="relative mt-8 grid gap-4 sm:grid-cols-3">
              {terms.map(({ icon: Icon, title, text }) => (
                <article key={title} className="rounded-2xl border bg-background/80 p-4 backdrop-blur-sm">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-foreground">{title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{text}</p>
                </article>
              ))}
            </div>

            <div className="relative mt-8 rounded-2xl border border-primary/15 bg-primary/5 p-4 sm:p-5">
              <p className="text-sm leading-relaxed text-foreground/80 sm:text-base">
                Оставьте заявку в форме справа. Мы свяжемся с вами, уточним детали по курсу и предложим вариант оплаты
                с распределением на четыре месяца.
              </p>
            </div>
          </div>

          <div id={formId} className="flex scroll-mt-28 items-stretch">
            <div className="w-full">
              <LeadFormContent compact />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
