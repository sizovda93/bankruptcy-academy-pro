import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';
import { Upload, X, Copy, Check } from 'lucide-react';

export function SiteSettingsManager() {
  const [settings, setSettings] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState('');
  const [copied, setCopied] = useState(false);
  const [editOpen, setEditOpen] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const data = await api.settings.list();

      const settingsMap: { [key: string]: string } = {};
      data?.forEach((item) => {
        settingsMap[item.setting_key] = item.setting_value || '';
      });
      setSettings(settingsMap);
      setPreviewUrl(settingsMap['hero_background_url'] || '');
    } catch (error: any) {
      toast({ title: 'Ошибка', description: error.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleBackgroundUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);

      // Загрузим файл на сервер
      const { publicUrl: fileUrl } = await api.media.uploadToPath(file);

      // Обновим настройку в БД
      await api.settings.update('hero_background_url', fileUrl);

      setPreviewUrl(fileUrl);
      setSettings({ ...settings, hero_background_url: fileUrl });
      toast({ title: 'Успешно', description: 'Фоновое изображение загружено' });
      e.target.value = '';
    } catch (error: any) {
      toast({ title: 'Ошибка загрузки', description: error.message, variant: 'destructive' });
    } finally {
      setUploading(false);
    }
  };

  const handleSettingChange = (key: string, value: string) => {
    setSettings({ ...settings, [key]: value });
  };

  const saveTextSettings = async () => {
    try {
      setLoading(true);

      for (const [key, value] of Object.entries(settings)) {
        if (key !== 'hero_background_url') {
          await api.settings.update(key, value);
        }
      }

      toast({ title: 'Успешно', description: 'Настройки сохранены' });
      setEditOpen(false);
      await fetchSettings();
    } catch (error: any) {
      toast({ title: 'Ошибка', description: error.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const deleteBackground = async () => {
    if (!confirm('Удалить фоновое изображение?')) return;

    try {
      // Очистим в БД
      await api.settings.update('hero_background_url', '');

      setPreviewUrl('');
      setSettings({ ...settings, hero_background_url: '' });
      toast({ title: 'Успешно', description: 'Фоновое изображение удалено' });
    } catch (error: any) {
      toast({ title: 'Ошибка', description: error.message, variant: 'destructive' });
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(previewUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast({ title: 'Ошибка', description: 'Не удалось скопировать', variant: 'destructive' });
    }
  };

  if (loading) return <p>Загрузка...</p>;

  return (
    <div className="space-y-6">
      {/* Background Section */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-6">
        <h3 className="text-xl font-bold mb-4">🎨 Фоновое изображение баннера</h3>

        {previewUrl ? (
          <div className="space-y-4">
            <div className="relative h-40 rounded-lg overflow-hidden border-2 border-dashed border-blue-300">
              <img
                src={previewUrl}
                alt="Hero Background"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex gap-2 flex-col sm:flex-row">
              <Button
                variant="outline"
                onClick={copyToClipboard}
                className="flex-1"
              >
                {copied ? <Check size={16} className="mr-2" /> : <Copy size={16} className="mr-2" />}
                {copied ? 'Скопировано!' : 'Копировать URL'}
              </Button>
              <Button
                variant="destructive"
                onClick={deleteBackground}
              >
                <X size={16} className="mr-2" />
                Удалить
              </Button>
            </div>

            <div className="bg-white p-3 rounded border border-blue-200">
              <p className="text-xs text-gray-500 mb-1">URL:</p>
              <p className="text-xs font-mono text-gray-700 break-all">{previewUrl}</p>
            </div>
          </div>
        ) : (
          <div className="border-2 border-dashed border-blue-300 rounded-lg p-8 text-center hover:bg-blue-50">
            <Upload className="mx-auto mb-4 text-blue-400" size={32} />
            <Input
              type="file"
              accept="image/*"
              onChange={handleBackgroundUpload}
              disabled={uploading}
              className="hidden"
              id="background-input"
            />
            <label htmlFor="background-input" className="cursor-pointer">
              <p className="mb-2 font-medium">Нажми или перетащи иображение сюда</p>
              <p className="text-sm text-gray-500">PNG, JPG, WebP до 10MB</p>
            </label>
            {uploading && <p className="mt-4 text-blue-500">Загрузка...</p>}
          </div>
        )}
      </div>

      {/* Text Settings */}
      <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-6">
        <h3 className="text-xl font-bold mb-4">📝 Текст главного баннера</h3>

        <div className="space-y-3 text-sm text-gray-600 mb-4">
          <p>Название: <strong>{settings['hero_title']}</strong></p>
          <p>Описание: <strong>{settings['hero_description']?.substring(0, 50)}...</strong></p>
        </div>

        <Button onClick={() => setEditOpen(true)} variant="outline" className="w-full">
          ✏️ Редактировать текст
        </Button>
      </div>

      {/* Edit Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Редактировать текст баннера</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Название</label>
              <Input
                value={settings['hero_title'] || ''}
                onChange={(e) => handleSettingChange('hero_title', e.target.value)}
                placeholder="Название баннера"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Описание</label>
              <Textarea
                value={settings['hero_description'] || ''}
                onChange={(e) => handleSettingChange('hero_description', e.target.value)}
                placeholder="Описание под названием"
                rows={4}
              />
            </div>
            <div className="flex gap-2 pt-4">
              <Button
                onClick={saveTextSettings}
                className="flex-1"
              >
                💾 Сохранить
              </Button>
              <Button
                variant="outline"
                onClick={() => setEditOpen(false)}
                className="flex-1"
              >
                Отмена
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
