import { MessageSquare, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { toast } from "@/hooks/use-toast";

export const LeadFormContent = () => {
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [promoCode, setPromoCode] = useState("");
  const [showPromo, setShowPromo] = useState(false);
  const [consentPolicy, setConsentPolicy] = useState(false);
  const [consentOffers, setConsentOffers] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const resetForm = () => {
    setFullName("");
    setPhone("");
    setEmail("");
    setPromoCode("");
    setShowPromo(false);
    setConsentPolicy(false);
    setConsentOffers(true);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!fullName.trim() || !phone.trim()) {
      toast({ title: "Заполните поля", description: "Укажите имя и телефон.", variant: "destructive" });
      return;
    }

    if (!consentPolicy) {
      toast({ title: "Требуется согласие", description: "Подтвердите обработку персональных данных.", variant: "destructive" });
      return;
    }

    try {
      setSubmitting(true);
      const { error } = await supabase.from("leads").insert([
        {
          full_name: fullName.trim(),
          phone: phone.trim(),
          email: email.trim() || null,
          promo_code: promoCode.trim() || null,
          consent_policy: consentPolicy,
          consent_offers: consentOffers,
          source: "website",
        },
      ]);

      if (error) throw error;

      toast({ title: "Заявка отправлена", description: "Мы свяжемся с вами в ближайшее время." });
      resetForm();
    } catch (error: any) {
      toast({ title: "Ошибка отправки", description: error.message, variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-primary-glow to-emerald-500 p-8 text-white sm:p-12">
            <div className="absolute -bottom-12 -right-10 h-56 w-56 rounded-full bg-white/10 blur-2xl" />
            <div className="absolute -left-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
            <div className="relative">
              <h3 className="font-heading text-3xl font-bold leading-tight sm:text-4xl">
                Поможем определиться
              </h3>
              <p className="mt-6 max-w-lg text-xl leading-relaxed text-white/90">
                Если хотите уточнить нюансы - оставляйте заявку, ответим на все вопросы и подберем подходящий формат обучения.
              </p>
            </div>

            <div className="relative mt-12 flex items-center gap-4 text-white/90">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15">
                <MessageSquare className="h-6 w-6" />
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15">
                <Phone className="h-6 w-6" />
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-border bg-card p-6 sm:p-8">
            <form className="space-y-4" onSubmit={handleSubmit}>
              <Input
                className="h-14 rounded-xl bg-muted/40 text-base"
                placeholder="Имя и фамилия"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
              <Input
                className="h-14 rounded-xl bg-muted/40 text-base"
                placeholder="+7 (000) 000-00-00"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
              <Input
                className="h-14 rounded-xl bg-muted/40 text-base"
                placeholder="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <button
                type="button"
                className="pt-1 text-left text-sm font-medium text-primary hover:underline"
                onClick={() => setShowPromo((v) => !v)}
              >
                У меня есть промокод
              </button>

              {showPromo ? (
                <Input
                  className="h-12 rounded-xl bg-muted/40 text-base"
                  placeholder="Введите промокод"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                />
              ) : null}

              <label className="flex items-start gap-3 text-sm text-muted-foreground">
                <Checkbox
                  checked={consentPolicy}
                  onCheckedChange={(v) => setConsentPolicy(Boolean(v))}
                  className="mt-0.5"
                />
                <span>
                  Я согласен с обработкой персональных данных в соответствии с политикой обработки и публичной офертой
                </span>
              </label>

              <label className="flex items-start gap-3 text-sm text-muted-foreground">
                <Checkbox
                  checked={consentOffers}
                  onCheckedChange={(v) => setConsentOffers(Boolean(v))}
                  className="mt-0.5"
                />
                <span>Я соглашаюсь получать уведомления о новых продуктах и предложениях</span>
              </label>

              <Button
                type="submit"
                className="mt-2 h-14 w-full rounded-xl bg-foreground text-base font-semibold text-background hover:bg-foreground/90"
                disabled={!consentPolicy || submitting}
              >
                {submitting ? "Отправка..." : "Оставить заявку"}
              </Button>
            </form>
          </div>
        </div>
  );
};

const LeadFormSection = () => {
  return (
    <section id="contact-form" className="bg-background py-16 sm:py-24">
      <div className="container">
        <LeadFormContent />
      </div>
    </section>
  );
};

export default LeadFormSection;
