import { Briefcase, Scale, TrendingUp } from "lucide-react";

const points = [
  {
    icon: Scale,
    title: "Практика вместо теории",
    text: "Разбираем реальные кейсы банкротства: от стратегии защиты до сопровождения сложных процедур.",
  },
  {
    icon: Briefcase,
    title: "Для действующих специалистов",
    text: "Программы ориентированы на юристов, адвокатов и руководителей практик, которым важен прикладной результат.",
  },
  {
    icon: TrendingUp,
    title: "Рост профессиональной ценности",
    text: "Помогаем усиливать экспертизу, повышать качество сопровождения клиентов и расширять линейку юридических услуг.",
  },
];

const AboutSection = () => {
  return (
    <section id="about" className="py-16 sm:py-24 bg-secondary/40">
      <div className="container">
        <div className="max-w-3xl">
          <h2 className="font-heading text-3xl font-bold text-foreground sm:text-4xl">О нас</h2>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
            Академия Банкротства - образовательная платформа для профессионалов юридического рынка.
            Мы объединяем экспертизу практикующих специалистов и структурированный подход к обучению,
            чтобы вы могли применять знания сразу в работе с клиентами.
          </p>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {points.map((point) => (
            <article key={point.title} className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <point.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 font-heading text-lg font-bold text-foreground">{point.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{point.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
