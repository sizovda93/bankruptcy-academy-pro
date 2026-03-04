import { useState } from "react";
import { Menu, X, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";

const navItems = [
  "Курсы",
  "Интенсивы",
  "Корпоративное обучение",
  "О нас",
  "Контакты",
];

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <span className="font-heading text-sm font-bold text-primary-foreground">АБ</span>
          </div>
          <div className="hidden sm:block">
            <p className="font-heading text-sm font-bold leading-tight text-foreground">Академия</p>
            <p className="font-heading text-xs font-semibold leading-tight text-primary">Банкротства</p>
          </div>
        </div>

        <nav className="hidden items-center gap-6 lg:flex">
          {navItems.map((item) => (
            <a
              key={item}
              href="#"
              className="font-body text-sm font-medium text-foreground/80 transition-colors hover:text-primary"
            >
              {item}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <a href="tel:+74951234567" className="hidden items-center gap-1.5 text-sm font-medium text-foreground md:flex">
            <Phone className="h-4 w-4 text-primary" />
            +7 495 123 45 67
          </a>
          <Button size="sm" variant="outline" className="hidden sm:inline-flex border-primary text-primary hover:bg-primary hover:text-primary-foreground">
            Войти
          </Button>
          <button
            className="lg:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="border-t border-border bg-background p-4 lg:hidden">
          <nav className="flex flex-col gap-3">
            {navItems.map((item) => (
              <a
                key={item}
                href="#"
                className="rounded-md px-3 py-2 text-sm font-medium text-foreground/80 transition-colors hover:bg-primary-light hover:text-primary"
              >
                {item}
              </a>
            ))}
            <Button size="sm" className="mt-2 w-full bg-primary text-primary-foreground hover:bg-primary-glow">
              Войти
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
