import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { Check, Copy, Upload, X } from "lucide-react";

export function SiteSettingsManager() {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const [editOpen, setEditOpen] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const data = await api.settings.list();
      const settingsMap: Record<string, string> = {};
      data?.forEach((item) => {
        settingsMap[item.setting_key] = item.setting_value || "";
      });
      setSettings(settingsMap);
    } catch (error: any) {
      toast({ title: "Ошибка", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleSettingChange = (key: string, value: string) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const saveTextSettings = async () => {
    try {
      setLoading(true);
      const keysToSave = [
        "hero_title",
        "hero_description",
        "bfl_book_title",
        "bfl_book_description",
        "sales_guide_title",
        "sales_guide_description",
        "disputes_materials_title",
        "disputes_materials_description",
        "nondischarge_materials_title",
        "nondischarge_materials_description",
      ];
      for (const key of keysToSave) {
        await api.settings.update(key, settings[key] || "");
      }
      toast({ title: "Успешно", description: "Текстовые настройки сохранены" });
      setEditOpen(false);
      await fetchSettings();
    } catch (error: any) {
      toast({ title: "Ошибка", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const uploadToSetting = async (
    e: React.ChangeEvent<HTMLInputElement>,
    settingKey: string,
    successText: string
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      const { publicUrl } = await api.media.uploadToPath(file);
      await api.settings.update(settingKey, publicUrl);
      setSettings((prev) => ({ ...prev, [settingKey]: publicUrl }));
      toast({ title: "Успешно", description: successText });
      e.target.value = "";
    } catch (error: any) {
      toast({ title: "Ошибка загрузки", description: error.message, variant: "destructive" });
    } finally {
      setUploading(false);
    }
  };

  const clearSetting = async (settingKey: string, title: string) => {
    if (!confirm(`Удалить ${title}?`)) return;

    try {
      await api.settings.update(settingKey, "");
      setSettings((prev) => ({ ...prev, [settingKey]: "" }));
      toast({ title: "Успешно", description: `${title} удален` });
    } catch (error: any) {
      toast({ title: "Ошибка", description: error.message, variant: "destructive" });
    }
  };

  const copyToClipboard = async (value: string, id: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(id);
      setTimeout(() => setCopied(null), 1500);
    } catch {
      toast({ title: "Ошибка", description: "Не удалось скопировать", variant: "destructive" });
    }
  };

  if (loading) return <p>Загрузка...</p>;

  return (
    <div className="space-y-6">
      <div className="rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
        <h3 className="mb-4 text-xl font-bold">Фон главного баннера</h3>
        {settings.hero_background_url ? (
          <div className="space-y-4">
            <div className="relative h-40 overflow-hidden rounded-lg border-2 border-dashed border-blue-300">
              <img src={settings.hero_background_url} alt="Hero background" className="h-full w-full object-cover" />
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Button variant="outline" onClick={() => copyToClipboard(settings.hero_background_url, "hero")}>
                {copied === "hero" ? <Check size={16} className="mr-2" /> : <Copy size={16} className="mr-2" />}
                {copied === "hero" ? "Скопировано" : "Копировать URL"}
              </Button>
              <Button variant="destructive" onClick={() => clearSetting("hero_background_url", "фон")}>
                <X size={16} className="mr-2" />
                Удалить
              </Button>
              <label className="inline-flex cursor-pointer items-center rounded-md border px-3 py-2 text-sm">
                <Upload size={16} className="mr-2" />
                Заменить
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => uploadToSetting(e, "hero_background_url", "Фон обновлен")}
                  disabled={uploading}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        ) : (
          <label className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border-2 border-dashed border-blue-300 p-8 text-center hover:bg-blue-50">
            <Upload size={20} />
            <span>{uploading ? "Загрузка..." : "Загрузить фон баннера"}</span>
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => uploadToSetting(e, "hero_background_url", "Фон загружен")}
              disabled={uploading}
              className="hidden"
            />
          </label>
        )}
      </div>

      <div className="rounded-lg bg-gradient-to-br from-emerald-50 to-green-50 p-6">
        <h3 className="mb-4 text-xl font-bold">Блок книги БФЛ (2026)</h3>
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="space-y-3 rounded-lg border bg-white p-4">
            <p className="text-sm font-semibold">Фон блока книги</p>
            {settings.bfl_book_banner_url ? (
              <>
                <img src={settings.bfl_book_banner_url} alt="Book banner" className="h-36 w-full rounded-md object-cover" />
                <div className="flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => copyToClipboard(settings.bfl_book_banner_url, "book-banner")}
                  >
                    {copied === "book-banner" ? <Check size={14} className="mr-1" /> : <Copy size={14} className="mr-1" />}
                    URL
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => clearSetting("bfl_book_banner_url", "фон блока книги")}>
                    Удалить
                  </Button>
                </div>
              </>
            ) : (
              <p className="text-sm text-gray-500">Фон еще не загружен</p>
            )}
            <label className="inline-flex cursor-pointer items-center rounded-md border px-3 py-2 text-sm">
              <Upload size={14} className="mr-2" />
              Загрузить фон
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => uploadToSetting(e, "bfl_book_banner_url", "Фон блока книги загружен")}
                disabled={uploading}
                className="hidden"
              />
            </label>
          </div>

          <div className="space-y-3 rounded-lg border bg-white p-4">
            <p className="text-sm font-semibold">Файл книги для скачивания</p>
            {settings.bfl_book_download_url ? (
              <>
                <a
                  href={settings.bfl_book_download_url}
                  target="_blank"
                  rel="noreferrer"
                  className="block break-all text-sm text-primary underline"
                >
                  {settings.bfl_book_download_url}
                </a>
                <div className="flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => copyToClipboard(settings.bfl_book_download_url, "book-file")}
                  >
                    {copied === "book-file" ? <Check size={14} className="mr-1" /> : <Copy size={14} className="mr-1" />}
                    URL
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => clearSetting("bfl_book_download_url", "файл книги")}>
                    Удалить
                  </Button>
                </div>
              </>
            ) : (
              <p className="text-sm text-gray-500">Файл книги еще не загружен</p>
            )}
            <label className="inline-flex cursor-pointer items-center rounded-md border px-3 py-2 text-sm">
              <Upload size={14} className="mr-2" />
              Загрузить книгу (PDF/DOCX)
              <Input
                type="file"
                accept=".pdf,.doc,.docx,.rtf,.txt,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                onChange={(e) => uploadToSetting(e, "bfl_book_download_url", "Файл книги загружен")}
                disabled={uploading}
                className="hidden"
              />
            </label>
          </div>
        </div>
      </div>

      <div className="rounded-lg bg-gradient-to-br from-blue-50 to-cyan-50 p-6">
        <h3 className="mb-4 text-xl font-bold">Методичка по продажам юридических услуг</h3>
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="space-y-3 rounded-lg border bg-white p-4">
            <p className="text-sm font-semibold">Обложка методички</p>
            {settings.sales_guide_banner_url ? (
              <>
                <img src={settings.sales_guide_banner_url} alt="Guide banner" className="h-36 w-full rounded-md object-cover" />
                <div className="flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => copyToClipboard(settings.sales_guide_banner_url, "guide-banner")}
                  >
                    {copied === "guide-banner" ? <Check size={14} className="mr-1" /> : <Copy size={14} className="mr-1" />}
                    URL
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => clearSetting("sales_guide_banner_url", "обложка методички")}>
                    Удалить
                  </Button>
                </div>
              </>
            ) : (
              <p className="text-sm text-gray-500">Обложка еще не загружена</p>
            )}
            <label className="inline-flex cursor-pointer items-center rounded-md border px-3 py-2 text-sm">
              <Upload size={14} className="mr-2" />
              Загрузить обложку
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => uploadToSetting(e, "sales_guide_banner_url", "Обложка методички загружена")}
                disabled={uploading}
                className="hidden"
              />
            </label>
          </div>

          <div className="space-y-3 rounded-lg border bg-white p-4">
            <p className="text-sm font-semibold">Файл методички для скачивания</p>
            {settings.sales_guide_download_url ? (
              <>
                <a
                  href={settings.sales_guide_download_url}
                  target="_blank"
                  rel="noreferrer"
                  className="block break-all text-sm text-primary underline"
                >
                  {settings.sales_guide_download_url}
                </a>
                <div className="flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => copyToClipboard(settings.sales_guide_download_url, "guide-file")}
                  >
                    {copied === "guide-file" ? <Check size={14} className="mr-1" /> : <Copy size={14} className="mr-1" />}
                    URL
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => clearSetting("sales_guide_download_url", "файл методички")}>
                    Удалить
                  </Button>
                </div>
              </>
            ) : (
              <p className="text-sm text-gray-500">Файл методички еще не загружен</p>
            )}
            <label className="inline-flex cursor-pointer items-center rounded-md border px-3 py-2 text-sm">
              <Upload size={14} className="mr-2" />
              Загрузить методичку (PDF/DOCX)
              <Input
                type="file"
                accept=".pdf,.doc,.docx,.rtf,.txt,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                onChange={(e) => uploadToSetting(e, "sales_guide_download_url", "Файл методички загружен")}
                disabled={uploading}
                className="hidden"
              />
            </label>
          </div>
        </div>
      </div>

      <div className="rounded-lg bg-gradient-to-br from-amber-50 to-orange-50 p-6">
        <h3 className="mb-4 text-xl font-bold">Материалы по оспариванию сделок в БФЛ</h3>
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="space-y-3 rounded-lg border bg-white p-4">
            <p className="text-sm font-semibold">Обложка материалов</p>
            {settings.disputes_materials_banner_url ? (
              <>
                <img src={settings.disputes_materials_banner_url} alt="Materials banner" className="h-36 w-full rounded-md object-cover" />
                <div className="flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => copyToClipboard(settings.disputes_materials_banner_url, "materials-banner")}
                  >
                    {copied === "materials-banner" ? <Check size={14} className="mr-1" /> : <Copy size={14} className="mr-1" />}
                    URL
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => clearSetting("disputes_materials_banner_url", "обложка материалов")}>Удалить</Button>
                </div>
              </>
            ) : (
              <p className="text-sm text-gray-500">Обложка еще не загружена</p>
            )}
            <label className="inline-flex cursor-pointer items-center rounded-md border px-3 py-2 text-sm">
              <Upload size={14} className="mr-2" />
              Загрузить обложку
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => uploadToSetting(e, "disputes_materials_banner_url", "Обложка материалов загружена")}
                disabled={uploading}
                className="hidden"
              />
            </label>
          </div>

          <div className="space-y-3 rounded-lg border bg-white p-4">
            <p className="text-sm font-semibold">Файл материалов для скачивания</p>
            {settings.disputes_materials_download_url ? (
              <>
                <a
                  href={settings.disputes_materials_download_url}
                  target="_blank"
                  rel="noreferrer"
                  className="block break-all text-sm text-primary underline"
                >
                  {settings.disputes_materials_download_url}
                </a>
                <div className="flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => copyToClipboard(settings.disputes_materials_download_url, "materials-file")}
                  >
                    {copied === "materials-file" ? <Check size={14} className="mr-1" /> : <Copy size={14} className="mr-1" />}
                    URL
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => clearSetting("disputes_materials_download_url", "файл материалов")}>Удалить</Button>
                </div>
              </>
            ) : (
              <p className="text-sm text-gray-500">Файл материалов еще не загружен</p>
            )}
            <label className="inline-flex cursor-pointer items-center rounded-md border px-3 py-2 text-sm">
              <Upload size={14} className="mr-2" />
              Загрузить материалы (PDF/DOCX)
              <Input
                type="file"
                accept=".pdf,.doc,.docx,.rtf,.txt,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                onChange={(e) => uploadToSetting(e, "disputes_materials_download_url", "Файл материалов загружен")}
                disabled={uploading}
                className="hidden"
              />
            </label>
          </div>
        </div>
      </div>

      <div className="rounded-lg bg-gradient-to-br from-rose-50 to-red-50 p-6">
        <h3 className="mb-4 text-xl font-bold">Материалы по неосвобождению от обязательств</h3>
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="space-y-3 rounded-lg border bg-white p-4">
            <p className="text-sm font-semibold">Обложка материалов</p>
            {settings.nondischarge_materials_banner_url ? (
              <>
                <img src={settings.nondischarge_materials_banner_url} alt="Nondischarge materials banner" className="h-36 w-full rounded-md object-cover" />
                <div className="flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => copyToClipboard(settings.nondischarge_materials_banner_url, "nondischarge-banner")}
                  >
                    {copied === "nondischarge-banner" ? <Check size={14} className="mr-1" /> : <Copy size={14} className="mr-1" />}
                    URL
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => clearSetting("nondischarge_materials_banner_url", "обложка материалов")}>Удалить</Button>
                </div>
              </>
            ) : (
              <p className="text-sm text-gray-500">Обложка еще не загружена</p>
            )}
            <label className="inline-flex cursor-pointer items-center rounded-md border px-3 py-2 text-sm">
              <Upload size={14} className="mr-2" />
              Загрузить обложку
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => uploadToSetting(e, "nondischarge_materials_banner_url", "Обложка материалов загружена")}
                disabled={uploading}
                className="hidden"
              />
            </label>
          </div>

          <div className="space-y-3 rounded-lg border bg-white p-4">
            <p className="text-sm font-semibold">Файл материалов для скачивания</p>
            {settings.nondischarge_materials_download_url ? (
              <>
                <a
                  href={settings.nondischarge_materials_download_url}
                  target="_blank"
                  rel="noreferrer"
                  className="block break-all text-sm text-primary underline"
                >
                  {settings.nondischarge_materials_download_url}
                </a>
                <div className="flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => copyToClipboard(settings.nondischarge_materials_download_url, "nondischarge-file")}
                  >
                    {copied === "nondischarge-file" ? <Check size={14} className="mr-1" /> : <Copy size={14} className="mr-1" />}
                    URL
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => clearSetting("nondischarge_materials_download_url", "файл материалов")}>Удалить</Button>
                </div>
              </>
            ) : (
              <p className="text-sm text-gray-500">Файл материалов еще не загружен</p>
            )}
            <label className="inline-flex cursor-pointer items-center rounded-md border px-3 py-2 text-sm">
              <Upload size={14} className="mr-2" />
              Загрузить материалы (PDF/DOCX)
              <Input
                type="file"
                accept=".pdf,.doc,.docx,.rtf,.txt,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                onChange={(e) => uploadToSetting(e, "nondischarge_materials_download_url", "Файл материалов загружен")}
                disabled={uploading}
                className="hidden"
              />
            </label>
          </div>
        </div>
      </div>

      <div className="rounded-lg bg-gradient-to-br from-green-50 to-emerald-50 p-6">
        <h3 className="mb-4 text-xl font-bold">Тексты блоков</h3>
        <div className="space-y-2 text-sm text-gray-600">
          <p>
            Hero title: <strong>{settings.hero_title || "-"}</strong>
          </p>
          <p>
            Hero description: <strong>{settings.hero_description || "-"}</strong>
          </p>
          <p>
            Заголовок блока книги: <strong>{settings.bfl_book_title || "Получите книгу по банкротству физических лиц 2026"}</strong>
          </p>
          <p>
            Описание блока книги:{" "}
            <strong>{settings.bfl_book_description || "Краткий практический материал по изменениям, рискам и судебной логике БФЛ."}</strong>
          </p>
          <p>
            Заголовок методички по продажам: <strong>{settings.sales_guide_title || "Получите методичку по продажам юридических услуг"}</strong>
          </p>
          <p>
            Описание методички по продажам:{" "}
            <strong>{settings.sales_guide_description || "Практическое руководство по технологии продаж, триггерам доверия и системе касаний."}</strong>
          </p>
          <p>
            Заголовок материалов по оспариванию: <strong>{settings.disputes_materials_title || "Получите дополнительные материалы по оспариванию сделок"}</strong>
          </p>
          <p>
            Описание материалов по оспариванию:{" "}
            <strong>{settings.disputes_materials_description || "Практические инструменты для работы: чек-листы аудита, матрица риска, шаблоны документов."}</strong>
          </p>
          <p>
            Заголовок материалов по неосвобождению: <strong>{settings.nondischarge_materials_title || "Получите дополнительные материалы по неосвобождению"}</strong>
          </p>
          <p>
            Описание материалов по неосвобождению:{" "}
            <strong>{settings.nondischarge_materials_description || "Практические инструменты для работы: анкета клиента, чек-листы поведения, матрица риска, шаблоны объяснений."}</strong>
          </p>
        </div>
        <Button onClick={() => setEditOpen(true)} variant="outline" className="mt-4 w-full">
          Редактировать тексты
        </Button>
      </div>

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Редактировать тексты</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium">Заголовок hero</label>
              <Input
                value={settings.hero_title || ""}
                onChange={(e) => handleSettingChange("hero_title", e.target.value)}
                placeholder="Академия Банкротства"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">Описание hero</label>
              <Textarea
                value={settings.hero_description || ""}
                onChange={(e) => handleSettingChange("hero_description", e.target.value)}
                rows={3}
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">Заголовок блока книги</label>
              <Input
                value={settings.bfl_book_title || ""}
                onChange={(e) => handleSettingChange("bfl_book_title", e.target.value)}
                placeholder="Получите книгу по банкротству физических лиц 2026"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">Описание блока книги</label>
              <Textarea
                value={settings.bfl_book_description || ""}
                onChange={(e) => handleSettingChange("bfl_book_description", e.target.value)}
                rows={4}
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">Заголовок методички по продажам</label>
              <Input
                value={settings.sales_guide_title || ""}
                onChange={(e) => handleSettingChange("sales_guide_title", e.target.value)}
                placeholder="Получите методичку по продажам юридических услуг"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">Описание методички по продажам</label>
              <Textarea
                value={settings.sales_guide_description || ""}
                onChange={(e) => handleSettingChange("sales_guide_description", e.target.value)}
                rows={4}
                placeholder="Практическое руководство по технологии продаж, триггерам доверия и системе касаний"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">Заголовок материалов по оспариванию</label>
              <Input
                value={settings.disputes_materials_title || ""}
                onChange={(e) => handleSettingChange("disputes_materials_title", e.target.value)}
                placeholder="Получите дополнительные материалы по оспариванию сделок"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">Описание материалов по оспариванию</label>
              <Textarea
                value={settings.disputes_materials_description || ""}
                onChange={(e) => handleSettingChange("disputes_materials_description", e.target.value)}
                rows={4}
                placeholder="Практические инструменты для работы: чек-листы аудита, матрица риска, шаблоны документов."
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">Заголовок материалов по неосвобождению</label>
              <Input
                value={settings.nondischarge_materials_title || ""}
                onChange={(e) => handleSettingChange("nondischarge_materials_title", e.target.value)}
                placeholder="Получите дополнительные материалы по неосвобождению"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">Описание материалов по неосвобождению</label>
              <Textarea
                value={settings.nondischarge_materials_description || ""}
                onChange={(e) => handleSettingChange("nondischarge_materials_description", e.target.value)}
                rows={4}
                placeholder="Практические инструменты для работы: анкета клиента, чек-листы поведения, матрица риска."
              />
            </div>
            <div className="flex gap-2 pt-2">
              <Button onClick={saveTextSettings} className="flex-1">
                Сохранить
              </Button>
              <Button variant="outline" onClick={() => setEditOpen(false)} className="flex-1">
                Отмена
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
