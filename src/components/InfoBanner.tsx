import { Briefcase, Building2, Calculator, Gavel, Home, Users } from "lucide-react";

const audiences = [
  {
    icon: Gavel,
    title: "Юристы и адвокаты по банкротству",
    desc: "Для тех, кто ведет дела и хочет снизить риск неосвобождения от долгов.",
  },
  {
    icon: Briefcase,
    title: "Финансовые управляющие и помощники ФУ",
    desc: "Чтобы выстроить правильную позицию, доказательственную базу и рабочую тактику.",
  },
  {
    icon: Calculator,
    title: "Бухгалтеры и финансовые директора МСБ",
    desc: "Чтобы понимать риски личной ответственности, долгов и корректные действия в сложных ситуациях.",
  },
  {
    icon: Home,
    title: "Риелторы, ипотечные брокеры и кредитные специалисты",
    desc: "Чтобы корректно направлять клиентов и не вредить делу ошибочными рекомендациями.",
  },
  {
    icon: Building2,
    title: "Собственники и управляющие партнеры юрфирм",
    desc: "Для масштабирования потока дел без потери качества юридического сопровождения.",
  },
  {
    icon: Users,
    title: "Руководители отделов банкротства",
    desc: "Для тимлидов и кураторов групп юристов и ФУ, которым важны управляемость и стандарт качества.",
  },
];

const InfoBanner = () => {
  return (
    <section className="bg-secondary py-16 sm:py-20">
      <div className="container">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="font-heading text-3xl font-bold text-foreground sm:text-4xl">Для кого подойдут данные курсы</h2>
          <p className="mt-4 text-base text-muted-foreground sm:text-lg">
            Программа ориентирована на практикующих специалистов, которые работают с делами о банкротстве и смежными задачами.
          </p>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {audiences.map((item) => (
            <article key={item.title} className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <item.icon className="h-6 w-6" />
              </div>
              <h3 className="mt-4 font-heading text-lg font-bold text-foreground">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.desc}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default InfoBanner;
