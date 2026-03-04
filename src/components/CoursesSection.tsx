import { useState } from "react";
import { Clock, BookOpen } from "lucide-react";

const categories = [
  "Все курсы",
  "Юридические аспекты",
  "Маркетинг",
  "Управление",
  "Практика",
];

interface Course {
  title: string;
  category: string;
  type: string;
  duration: string;
  price: string;
  discount?: string;
}

const courses: Course[] = [
  {
    title: "Юридические аспекты процедуры банкротства",
    category: "Юридические аспекты",
    type: "Повышение квалификации",
    duration: "6 месяцев",
    price: "14 500 ₽/мес",
    discount: "до -20%",
  },
  {
    title: "Маркетинг в сфере банкротства",
    category: "Маркетинг",
    type: "Повышение квалификации",
    duration: "4 месяца",
    price: "11 200 ₽/мес",
    discount: "до -40%",
  },
  {
    title: "Построение эффективной команды",
    category: "Управление",
    type: "Повышение квалификации",
    duration: "3 месяца",
    price: "8 900 ₽/мес",
    discount: "до -30%",
  },
  {
    title: "Обзор практики банкротства",
    category: "Практика",
    type: "Интенсив",
    duration: "2 месяца",
    price: "6 500 ₽/мес",
  },
  {
    title: "Субсидиарная ответственность",
    category: "Юридические аспекты",
    type: "Курс",
    duration: "3 месяца",
    price: "9 800 ₽/мес",
    discount: "до -15%",
  },
  {
    title: "Масштабирование бизнеса в банкротстве",
    category: "Управление",
    type: "Повышение квалификации",
    duration: "5 месяцев",
    price: "12 000 ₽/мес",
    discount: "до -25%",
  },
];

const CoursesSection = () => {
  const [active, setActive] = useState("Все курсы");

  const filtered =
    active === "Все курсы"
      ? courses
      : courses.filter((c) => c.category === active);

  return (
    <section id="courses" className="py-16 sm:py-24">
      <div className="container">
        <h2 className="font-heading text-3xl font-bold text-foreground sm:text-4xl">
          Наши курсы
        </h2>

        <div className="mt-8 flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActive(cat)}
              className={`rounded-xl px-5 py-2.5 font-heading text-sm font-semibold transition-all ${
                active === cat
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "bg-secondary text-foreground/70 hover:bg-primary-light hover:text-primary"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((course) => (
            <div
              key={course.title}
              className="group relative flex flex-col rounded-2xl border border-border bg-card p-6 shadow-sm transition-all hover:shadow-lg hover:-translate-y-1"
            >
              {course.discount && (
                <span className="absolute -top-3 right-4 rounded-full bg-accent px-3 py-1 font-heading text-xs font-bold text-accent-foreground shadow">
                  {course.discount}
                </span>
              )}
              <div className="flex items-center gap-2 text-xs text-primary">
                <BookOpen className="h-3.5 w-3.5" />
                <span className="font-medium">{course.type}</span>
              </div>
              <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                <Clock className="h-3.5 w-3.5" />
                <span>{course.duration}</span>
              </div>
              <h3 className="mt-4 font-heading text-lg font-bold leading-snug text-foreground group-hover:text-primary transition-colors">
                {course.title}
              </h3>
              <div className="mt-auto pt-6">
                <p className="font-heading text-xl font-bold text-foreground">
                  {course.price}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CoursesSection;
