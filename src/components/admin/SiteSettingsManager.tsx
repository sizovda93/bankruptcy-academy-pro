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
  const [backgroundImage, setBackgroundImage] = useState<string>("");

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
      const keysToSave = ["hero_title", "hero_description"];
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

  const handleBackgroundImageUpload = async (file: File) => {
    try {
      setUploading(true);
      const uploadedImageUrl: string = "https://example.com/path-to-uploaded-image"; // Placeholder for now
      setBackgroundImage(uploadedImageUrl);
      handleSettingChange("cover_background", uploadedImageUrl);
      toast({ title: "Успех", description: "Фон успешно обновлен", variant: "default" });
    } catch (error: any) {
      toast({ title: "Ошибка", description: error.message, variant: "destructive" });
    } finally {
      setUploading(false);
    }
  };

  if (loading) return <p>Загрузка...</p>;

  return (
    <div className="space-y-6">
      <div className="rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
        <h3 className="mb-4 text-xl font-bold">Фон главного баннера</h3>        {settings.hero_background_url ? (
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

      <div className="rounded-lg border-2 border-amber-200 bg-amber-50 p-6">
        <h3 className="mb-2 text-lg font-bold text-amber-900">Материалы курсов перенесены</h3>
        <p className="text-sm text-amber-800">
          Управление файлами и обложками материалов теперь выполняется в разделе <strong>Курсы</strong> - откройте нужный курс и вкладку <strong>Файлы</strong>.
        </p>
      </div>

      <div className="rounded-lg bg-gradient-to-br from-emerald-50 to-green-50 p-6">
        <h3 className="mb-4 text-xl font-bold">Фон блока «Поможем определиться»</h3>
        {settings.contact_block_bg_url ? (
          <div className="space-y-4">
            <div className="relative h-40 overflow-hidden rounded-lg border-2 border-dashed border-emerald-300">
              <img src={settings.contact_block_bg_url} alt="Contact block background" className="h-full w-full object-cover" />
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Button variant="outline" onClick={() => copyToClipboard(settings.contact_block_bg_url, "contact")}>
                {copied === "contact" ? <Check size={16} className="mr-2" /> : <Copy size={16} className="mr-2" />}
                {copied === "contact" ? "Скопировано" : "Копировать URL"}
              </Button>
              <Button variant="destructive" onClick={() => clearSetting("contact_block_bg_url", "фон блока")}>
                <X size={16} className="mr-2" />
                Удалить
              </Button>
              <label className="inline-flex cursor-pointer items-center rounded-md border px-3 py-2 text-sm">
                <Upload size={16} className="mr-2" />
                Заменить
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => uploadToSetting(e, "contact_block_bg_url", "Фон блока обновлен")}
                  disabled={uploading}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        ) : (
          <label className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border-2 border-dashed border-emerald-300 p-8 text-center hover:bg-emerald-50">
            <Upload size={20} />
            <span>{uploading ? "Загрузка..." : "Загрузить фон блока"}</span>
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => uploadToSetting(e, "contact_block_bg_url", "Фон блока загружен")}
              disabled={uploading}
              className="hidden"
            />
          </label>
        )}
      </div>


        <h3 className="mb-4 text-xl font-bold">Тексты блоков</h3>
        <div className="space-y-2 text-sm text-gray-600">
          <p>
            Hero title: <strong>{settings.hero_title || "-"}</strong>
          </p>
          <p>
            Hero description: <strong>{settings.hero_description || "-"}</strong>
          </p>
        </div>
        <Button onClick={() => setEditOpen(true)} variant="outline" className="mt-4 w-full">
          Редактировать тексты
        </Button>
      </div>

      <div className="mb-4">
        <h3 className="text-lg font-medium">Фон обложки</h3>
        <p className="text-sm text-gray-600 mb-4">Это баннер на постер "Поможем определиться"</p>
        <input
          type="file"
          onChange={(e) => e.target.files && handleBackgroundImageUpload(e.target.files[0])}
          disabled={uploading}
        />
        {backgroundImage && (
          <div className="mt-4">
            <p>Текущий фон:</p>
            <img src={backgroundImage} alt="Текущий фон" className="rounded-lg shadow-md max-w-full h-auto" />
          </div>
        )}
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
