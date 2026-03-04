import { useState } from 'react';
import { supabase, Media } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';
import { Upload, X, Copy, Check } from 'lucide-react';

export function MediaUploader() {
  const [uploading, setUploading] = useState(false);
  const [files, setFiles] = useState<Media[]>([]);
  const [copied, setCopied] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchMedia = async () => {
    try {
      const { data, error } = await supabase
        .from('media')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setFiles(data || []);
    } catch (error: any) {
      toast({ title: 'Ошибка', description: error.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);

      // Загрузим файл в Supabase Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `media/${fileName}`;

      const { error: uploadError, data } = await supabase.storage.from('media').upload(filePath, file);

      if (uploadError) throw uploadError;

      // Получим публичный URL
      const { data: publicData } = supabase.storage.from('media').getPublicUrl(filePath);
      const fileUrl = publicData.publicUrl;

      // Сохраним инфо в БД
      const { error: dbError } = await supabase.from('media').insert([
        {
          file_name: file.name,
          file_url: fileUrl,
          file_type: file.type,
          file_size: file.size,
          uploaded_by: null, // Можешь заменить на current_user_id если будет auth
        },
      ]);

      if (dbError) throw dbError;

      toast({ title: 'Успешно', description: 'Файл загружен' });
      e.target.value = '';
      await fetchMedia();
    } catch (error: any) {
      toast({ title: 'Ошибка загрузки', description: error.message, variant: 'destructive' });
    } finally {
      setUploading(false);
    }
  };

  const deleteFile = async (id: string, fileUrl: string) => {
    if (!confirm('Удалить файл?')) return;

    try {
      // Удалим из Storage
      const filePath = fileUrl.split('/').pop();
      if (filePath) {
        await supabase.storage.from('media').remove([`media/${filePath}`]);
      }

      // Удалим из БД
      const { error } = await supabase.from('media').delete().eq('id', id);

      if (error) throw error;

      toast({ title: 'Успешно', description: 'Файл удалён' });
      await fetchMedia();
    } catch (error: any) {
      toast({ title: 'Ошибка', description: error.message, variant: 'destructive' });
    }
  };

  const copyToClipboard = async (url: string, id: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(id);
      setTimeout(() => setCopied(null), 2000);
    } catch {
      toast({ title: 'Ошибка', description: 'Не удалось скопировать', variant: 'destructive' });
    }
  };

  if (loading) return <p>Загрузка...</p>;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-4">Загрузка медиа</h2>

        <div className="border-2 border-dashed rounded-lg p-8 text-center hover:bg-gray-50">
          <Upload className="mx-auto mb-4 text-gray-400" size={32} />
          <Input
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            disabled={uploading}
            className="hidden"
            id="file-input"
          />
          <label htmlFor="file-input" className="cursor-pointer">
            <p className="mb-2">Нажми или перетащи файл сюда</p>
            <p className="text-sm text-gray-500">PNG, JPG, WebP до 10MB</p>
          </label>
          {uploading && <p className="mt-4 text-blue-500">Загрузка...</p>}
        </div>
      </div>

      <div>
        <h3 className="text-xl font-bold mb-4">Загруженные файлы ({files.length})</h3>

        {files.length === 0 ? (
          <p className="text-gray-500">Файлов нет</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {files.map((file) => (
              <div key={file.id} className="border rounded-lg overflow-hidden hover:shadow-lg transition">
                <img src={file.file_url} alt={file.file_name} className="w-full h-40 object-cover" />
                <div className="p-3">
                  <p className="text-sm font-medium truncate">{file.file_name}</p>
                  <p className="text-xs text-gray-500 mb-3">{new Date(file.created_at).toLocaleDateString('ru-RU')}</p>

                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(file.file_url, file.id)}
                      className="flex-1"
                    >
                      {copied === file.id ? <Check size={16} /> : <Copy size={16} />}
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => deleteFile(file.id, file.file_url)}
                      className="flex-1"
                    >
                      <X size={16} />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
