import heroBg from "@/assets/hero-bg.jpg";

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden">
      <div
        className="relative mx-auto max-w-[1200px] overflow-hidden rounded-b-3xl"
        style={{
          backgroundImage: `url(${heroBg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary/80 via-primary-glow/60 to-primary/90" />
        <div className="relative px-6 py-20 text-center sm:py-28 md:py-36">
          <p className="font-heading text-base font-semibold tracking-wide text-primary-foreground/90 sm:text-lg">
            Онлайн-школа банкротства
          </p>
          <h1 className="mx-auto mt-4 max-w-3xl font-heading text-4xl font-extrabold leading-tight text-primary-foreground sm:text-5xl md:text-6xl">
            Академия Банкротства
          </h1>
          <p className="mx-auto mt-6 max-w-2xl font-body text-base leading-relaxed text-primary-foreground/85 sm:text-lg">
            Знания, навыки и деловые связи для профессионального роста
            специалистов в сфере банкротства
          </p>
          <div className="mt-8">
            <a
              href="#courses"
              className="inline-block rounded-xl bg-primary-foreground px-10 py-4 font-heading text-sm font-semibold text-foreground shadow-lg transition-all hover:scale-105 hover:shadow-xl sm:text-base"
            >
              Выбрать курс
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
