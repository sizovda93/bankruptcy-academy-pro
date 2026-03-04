import { Shield, Users, Award } from "lucide-react";

const items = [
  {
    icon: Shield,
    title: "Федеральная Экспертная Служба",
    desc: "Профессиональная экспертиза в области банкротства на федеральном уровне",
  },
  {
    icon: Users,
    title: "АСПБ — Агентство сопровождения процедур банкротства",
    desc: "Комплексное сопровождение всех этапов процедуры банкротства",
  },
  {
    icon: Award,
    title: "Первая школа банкротства",
    desc: "Пионеры образования в сфере банкротства в России",
  },
];

const InfoBanner = () => {
  return (
    <section className="bg-secondary py-16 sm:py-20">
      <div className="container">
        <div className="grid gap-8 sm:grid-cols-3">
          {items.map((item) => (
            <div key={item.title} className="flex flex-col items-center text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
                <item.icon className="h-7 w-7 text-primary" />
              </div>
              <h3 className="mt-4 font-heading text-lg font-bold text-foreground">
                {item.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default InfoBanner;
