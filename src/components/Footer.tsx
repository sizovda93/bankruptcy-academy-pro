import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

type ModalType = "privacy" | "cookies" | "disclaimer" | null;

const MODAL_CONTENT: Record<NonNullable<ModalType>, { title: string; content: React.ReactNode }> = {
  privacy: {
    title: "Политика конфиденциальности",
    content: (
      <div className="space-y-4 text-sm leading-relaxed text-muted-foreground">
        <p><strong className="text-foreground">1. Общие положения</strong></p>
        <p>Настоящая Политика конфиденциальности определяет порядок обработки и защиты персональных данных пользователей сайта Академии Банкротства (далее — «Оператор»). Оператор обязуется не раскрывать полученные персональные данные третьим лицам, за исключением случаев, предусмотренных действующим законодательством Российской Федерации.</p>
        <p><strong className="text-foreground">2. Состав персональных данных</strong></p>
        <p>Оператор собирает следующие персональные данные: фамилия, имя, отчество; номер телефона; адрес электронной почты. Данные передаются пользователем добровольно при заполнении форм на сайте.</p>
        <p><strong className="text-foreground">3. Цели обработки</strong></p>
        <p>Персональные данные обрабатываются в целях: связи с пользователем по его заявке; предоставления информации об образовательных продуктах; улучшения качества обслуживания; направления информационных и рекламных сообщений (при наличии согласия).</p>
        <p><strong className="text-foreground">4. Правовые основания обработки</strong></p>
        <p>Обработка персональных данных осуществляется на основании согласия субъекта персональных данных (ст. 9 Федерального закона от 27.07.2006 № 152-ФЗ «О персональных данных»).</p>
        <p><strong className="text-foreground">5. Хранение и защита данных</strong></p>
        <p>Оператор принимает необходимые организационные и технические меры для защиты персональных данных от несанкционированного доступа, уничтожения, изменения, блокирования, копирования и распространения. Данные хранятся не дольше, чем этого требуют цели их обработки.</p>
        <p><strong className="text-foreground">6. Права пользователя</strong></p>
        <p>Пользователь вправе: получить информацию об обработке своих персональных данных; потребовать уточнения, блокирования или уничтожения данных; отозвать согласие на обработку персональных данных. Для реализации прав обратитесь по адресу: info@academy-bankrotstvo.ru.</p>
        <p><strong className="text-foreground">7. Изменения политики</strong></p>
        <p>Оператор оставляет за собой право вносить изменения в настоящую Политику. Актуальная версия всегда размещена на сайте. Дата последнего обновления: 10 марта 2026 г.</p>
      </div>
    ),
  },
  cookies: {
    title: "Политика использования Cookie",
    content: (
      <div className="space-y-4 text-sm leading-relaxed text-muted-foreground">
        <p><strong className="text-foreground">Что такое cookie?</strong></p>
        <p>Cookie — это небольшие текстовые файлы, которые сохраняются в вашем браузере при посещении сайта. Они помогают сайту запоминать ваши предпочтения и улучшать работу сервиса.</p>
        <p><strong className="text-foreground">Какие cookie мы используем?</strong></p>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong className="text-foreground">Необходимые</strong> — обеспечивают базовую функциональность сайта (навигация, формы). Без них сайт не работает корректно.</li>
          <li><strong className="text-foreground">Аналитические</strong> — помогают понять, как пользователи взаимодействуют с сайтом (например, Яндекс.Метрика). Данные собираются анонимно.</li>
          <li><strong className="text-foreground">Функциональные</strong> — запоминают ваши настройки и предпочтения для удобства повторных визитов.</li>
        </ul>
        <p><strong className="text-foreground">Управление cookie</strong></p>
        <p>Вы можете в любое время изменить настройки cookie в вашем браузере: отключить их полностью или удалить уже сохранённые. Обратите внимание, что отключение необходимых cookie может повлиять на работу сайта.</p>
        <p><strong className="text-foreground">Согласие</strong></p>
        <p>Продолжая использовать сайт, вы соглашаетесь с использованием cookie в соответствии с настоящей политикой.</p>
      </div>
    ),
  },
  disclaimer: {
    title: "Дисклеймер",
    content: (
      <div className="space-y-4 text-sm leading-relaxed text-muted-foreground">
        <p><strong className="text-foreground">Информационный характер материалов</strong></p>
        <p>Все материалы, размещённые на сайте Академии Банкротства, носят исключительно информационно-образовательный характер и не являются юридической консультацией, офертой или рекламой конкретных услуг.</p>
        <p><strong className="text-foreground">Ограничение ответственности</strong></p>
        <p>Академия Банкротства не несёт ответственности за любые прямые или косвенные убытки, возникшие в результате использования информации с данного сайта. Пользователь самостоятельно принимает решения на основании полученных сведений.</p>
        <p><strong className="text-foreground">Результаты обучения</strong></p>
        <p>Указанные на сайте результаты и достижения являются примерами из практики и не гарантируют аналогичных результатов для каждого участника. Результат зависит от индивидуальных усилий, опыта и условий работы.</p>
        <p><strong className="text-foreground">Авторские права</strong></p>
        <p>Все материалы сайта (тексты, изображения, видео, программы курсов) являются объектами интеллектуальной собственности и защищены законодательством РФ. Их копирование и распространение без письменного разрешения Оператора запрещено.</p>
        <p><strong className="text-foreground">Применимое право</strong></p>
        <p>Настоящий дисклеймер составлен в соответствии с законодательством Российской Федерации. Все споры решаются в судебном порядке по месту нахождения Оператора.</p>
      </div>
    ),
  },
};

const Footer = () => {
  const [openModal, setOpenModal] = useState<ModalType>(null);
  const location = useLocation();
  const navigate = useNavigate();
  
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
      
      // Если мы на главной странице - просто прокручиваем
      if (location.pathname === '/') {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
          window.history.pushState(null, '', '/' + href);
        }
      } else {
        // Если на другой странице - переходим на главную с якорем
        navigate('/' + href);
        // После перехода прокручиваем к элементу
        setTimeout(() => {
          const element = document.getElementById(id);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 100);
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
              <li><a href="#courses" onClick={(e) => handleNavClick(e, '#courses')} className="hover:text-primary transition-colors">Курсы</a></li>
              <li><a href="#teachers" onClick={(e) => handleNavClick(e, '#teachers')} className="hover:text-primary transition-colors">Преподаватели</a></li>
              <li><a href="#about" onClick={(e) => handleNavClick(e, '#about')} className="hover:text-primary transition-colors">О нас</a></li>
              <li><a href="#contact-form" onClick={(e) => handleNavClick(e, '#contact-form')} className="hover:text-primary transition-colors">Контакты</a></li>
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
        <div className="mt-10 border-t border-background/10 pt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-between text-xs">
          <span>© 2026 Академия Банкротства. Все права защищены.</span>
          <div className="flex gap-4">
            <button onClick={() => setOpenModal("privacy")} className="hover:text-primary transition-colors underline underline-offset-2">
              Политика конфиденциальности
            </button>
            <button onClick={() => setOpenModal("cookies")} className="hover:text-primary transition-colors underline underline-offset-2">
              Cookies
            </button>
            <button onClick={() => setOpenModal("disclaimer")} className="hover:text-primary transition-colors underline underline-offset-2">
              Дисклеймер
            </button>
          </div>
        </div>
        </div>
      </div>

      {openModal && (
        <Dialog open={true} onOpenChange={() => setOpenModal(null)}>
          <DialogContent className="max-h-[80vh] overflow-y-auto sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle>{MODAL_CONTENT[openModal].title}</DialogTitle>
            </DialogHeader>
            {MODAL_CONTENT[openModal].content}
          </DialogContent>
        </Dialog>
      )}
    </footer>
  );
};

export default Footer;
