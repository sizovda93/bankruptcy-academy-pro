const Footer = () => {
  const cities = [
    "Москва", "Санкт-Петербург", "Новосибирск", "Екатеринбург", "Казань",
    "Нижний Новгород", "Челябинск", "Самара", "Омск", "Ростов-на-Дону",
    "Уфа", "Красноярск", "Воронеж", "Пермь", "Волгоград",
    "Краснодар", "Саратов", "Тюмень", "Тольятти", "Ижевск"
  ];

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    // Если это якорная ссылка
    if (href.startsWith('#')) {
      e.preventDefault();
      const id = href.substring(1); // убираем '#'
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        window.history.pushState(null, '', href);
      }
    }
  };

  return (
    <footer className="border-t border-border bg-foreground text-background/70">
      {/* Бегущая строка с городами */}
      <div className="relative overflow-hidden border-b border-background/10 bg-foreground/95 py-3">
        <div className="flex animate-scroll whitespace-nowrap">
          {[...cities, ...cities].map((city, index) => (
            <span
              key={index}
              className="mx-6 text-sm font-medium text-background/60"
            >
              {city}
            </span>
          ))}
        </div>
      </div>

      <div className="py-12">
        <div className="container">
          <div className="grid gap-8 sm:grid-cols-3">
          <div>
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <span className="font-heading text-xs font-bold text-primary-foreground">АБ</span>
              </div>
              <p className="font-heading text-sm font-bold text-background">Академия Банкротства</p>
            </div>
            <p className="mt-3 text-sm leading-relaxed">
              Знания и навыки для профессионалов в сфере банкротства
            </p>
          </div>
          <div>
            <p className="font-heading text-sm font-semibold text-background">Навигация</p>
            <ul className="mt-3 space-y-2 text-sm">
              <li><a href="#" className="hover:text-primary transition-colors">Курсы</a></li>
              <li><a href="#teachers" onClick={(e) => handleNavClick(e, '#teachers')} className="hover:text-primary transition-colors">Преподаватели</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">О нас</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Контакты</a></li>
            </ul>
          </div>
          <div>
            <p className="font-heading text-sm font-semibold text-background">Контакты</p>
            <ul className="mt-3 space-y-2 text-sm">
              <li>+7 495 123 45 67</li>
              <li>info@academy-bankrotstvo.ru</li>
              <li>г. Москва, улица Садовая-Спасская 21/1, офис 922</li>
              <li>Мы располагаемся в БЦ «Красные Ворота»</li>
              <li>(в 100 метрах от станции метро «Красные Ворота»)</li>
            </ul>
          </div>
        </div>
        <div className="mt-10 border-t border-background/10 pt-6 text-center text-xs">
          © 2026 Академия Банкротства. Все права защищены.
        </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
