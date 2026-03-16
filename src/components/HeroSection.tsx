import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import heroBgWebp from "@/assets/hero-bg.webp";
import heroBgJpg from "@/assets/hero-bg.jpg";

const HeroSection = () => {
  const [backgroundUrl, setBackgroundUrl] = useState<string | null>(null);
  const [heroTitle, setHeroTitle] = useState("Академия Банкротства");
  const [heroDescription, setHeroDescription] = useState(
    "Знания, навыки и деловые связи для профессионального роста специалистов в сфере банкротства"
  );

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const data = await api.settings.list();

      if (data) {
        data.forEach((item) => {
          if (item.setting_key === "hero_background_url" && item.setting_value) {
            setBackgroundUrl(item.setting_value);
          }
          if (item.setting_key === "hero_title" && item.setting_value) {
            setHeroTitle(item.setting_value);
          }
          if (item.setting_key === "hero_description" && item.setting_value) {
            setHeroDescription(item.setting_value);
          }
        });
      }
    } catch (error) {
      console.log("Используются настройки по умолчанию");
    }
  };

  return (
    <section className="relative overflow-hidden">
      <div className="relative mx-auto max-w-[1200px] overflow-hidden rounded-b-3xl">
        {backgroundUrl ? (
          <img
            src={backgroundUrl}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 h-full w-full object-cover object-center"
          />
        ) : (
          <picture>
            <source srcSet={heroBgWebp} type="image/webp" />
            <img
              src={heroBgJpg}
              alt=""
              aria-hidden="true"
              fetchPriority="high"
              className="absolute inset-0 h-full w-full object-cover object-center"
            />
          </picture>
        )}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/80 via-primary-glow/60 to-primary/90" />
        <div className="relative px-6 py-20 text-center sm:py-28 md:py-36">
          <p className="font-heading text-base font-semibold tracking-wide text-white sm:text-lg">
            Онлайн-школа банкротства
          </p>
          <h1 className="mx-auto mt-4 max-w-3xl font-heading text-4xl font-extrabold leading-tight text-white sm:text-5xl md:text-6xl">
            {heroTitle}
          </h1>
          <p className="mx-auto mt-6 max-w-2xl font-body text-base leading-relaxed text-white sm:text-lg">
            {heroDescription}
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
