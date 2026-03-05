const Footer = () => {
  return (
    <footer className="border-t border-border bg-foreground py-12 text-background/70">
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
              <li><a href="#teachers" className="hover:text-primary transition-colors">Преподаватели</a></li>
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
    </footer>
  );
};

export default Footer;
