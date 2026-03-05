import { useState } from "react";
import { Menu, X, Phone } from "lucide-react";

const navItems = [
  { label: "Курсы", href: "/#courses" },
  { label: "Преподаватели", href: "/#teachers" },
  { label: "Отзывы", href: "/#reviews" },
  { label: "О нас", href: "/#about" },
  { label: "Контакты", href: "/#contact-form" },
];

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="container flex h-16 items-center justify-between">
        <a href="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <span className="font-heading text-sm font-bold text-primary-foreground">АБ</span>
          </div>
          <div className="hidden sm:block">
            <p className="font-heading text-sm font-bold leading-tight text-foreground">Академия</p>
            <p className="font-heading text-xs font-semibold leading-tight text-primary">Банкротства</p>
          </div>
        </a>

        <nav className="hidden items-center gap-6 lg:flex">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="font-body text-sm font-medium text-foreground/80 transition-colors hover:text-primary"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <a href="tel:+74951234567" className="hidden items-center gap-1.5 text-sm font-medium text-foreground md:flex">
            <Phone className="h-4 w-4 text-primary" />
            +7 495 123 45 67
          </a>
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
                key={item.label}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className="rounded-md px-3 py-2 text-sm font-medium text-foreground/80 transition-colors hover:bg-primary-light hover:text-primary"
              >
                {item.label}
              </a>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
