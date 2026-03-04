import { useState, useEffect } from 'react';
import { supabase, Course } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useForm } from 'react-hook-form';
import { toast } from '@/hooks/use-toast';
import { Pencil, Trash2, Upload } from 'lucide-react';
import { uploadImageWithBucketFallback } from '@/lib/storage';

const FormLabel = ({ className = '', ...props }: any) => (
  <label className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${className}`} {...props} />
);

export function CoursesManager() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [coverImage, setCoverImage] = useState<{ url: string; file: File | null }>({
    url: '',
    file: null,
  });

  const form = useForm({
    defaultValues: {
      title: '',
      description: '',
      cover_image_url: '',
      price: 0,
      level: 'РќР°С‡РёРЅР°СЋС‰РёР№',
    },
  });

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.from('courses').select('*').order('created_at', { ascending: false });

      if (error) throw error;
      setCourses(data || []);
    } catch (error: any) {
      toast({ title: 'РћС€РёР±РєР°', description: error.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);

      // Р—Р°РіСЂСѓР·РёРј С„Р°Р№Р» РІ Supabase Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `course-cover-${Date.now()}.${fileExt}`;
      const filePath = `covers/${fileName}`;

      const { publicUrl: fileUrl } = await uploadImageWithBucketFallback(filePath, file);

      setCoverImage({ url: fileUrl, file: file });
      form.setValue('cover_image_url', fileUrl);
      toast({ title: 'РЈСЃРїРµС€РЅРѕ', description: 'РћР±Р»РѕР¶РєР° Р·Р°РіСЂСѓР¶РµРЅР°' });
    } catch (error: any) {
      toast({ title: 'РћС€РёР±РєР° Р·Р°РіСЂСѓР·РєРё', description: error.message, variant: 'destructive' });
    } finally {
      setUploading(false);
    }
  };

  const onSubmit = async (values: any) => {
    try {
      const submitData = {
        ...values,
        price: parseFloat(values.price),
      };

      if (editingId) {
        const { error } = await supabase.from('courses').update(submitData).eq('id', editingId);
        if (error) throw error;
        toast({ title: 'РЈСЃРїРµС€РЅРѕ', description: 'РљСѓСЂСЃ РѕР±РЅРѕРІР»С‘РЅ' });
      } else {
        const { error } = await supabase.from('courses').insert([submitData]);
        if (error) throw error;
        toast({ title: 'РЈСЃРїРµС€РЅРѕ', description: 'РљСѓСЂСЃ СЃРѕР·РґР°РЅ' });
      }

      form.reset();
      setCoverImage({ url: '', file: null });
      setOpen(false);
      setEditingId(null);
      await fetchCourses();
    } catch (error: any) {
      toast({ title: 'РћС€РёР±РєР°', description: error.message, variant: 'destructive' });
    }
  };

  const editCourse = (course: Course) => {
    form.reset({
      title: course.title,
      description: course.description,
      cover_image_url: course.cover_image_url,
      price: course.price,
      level: course.level,
    });
    setCoverImage({ url: course.cover_image_url || '', file: null });
    setEditingId(course.id);
    setOpen(true);
  };

  const deleteCourse = async (id: string) => {
    if (!confirm('Р’С‹ СѓРІРµСЂРµРЅС‹?')) return;

    try {
      const { error } = await supabase.from('courses').delete().eq('id', id);
      if (error) throw error;

      toast({ title: 'РЈСЃРїРµС€РЅРѕ', description: 'РљСѓСЂСЃ СѓРґР°Р»С‘РЅ' });
      await fetchCourses();
    } catch (error: any) {
      toast({ title: 'РћС€РёР±РєР°', description: error.message, variant: 'destructive' });
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      form.reset();
      setCoverImage({ url: '', file: null });
      setEditingId(null);
    }
    setOpen(newOpen);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">РљСѓСЂСЃС‹ ({courses.length})</h2>
        <Dialog open={open} onOpenChange={handleOpenChange}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingId(null)}>Р”РѕР±Р°РІРёС‚СЊ РєСѓСЂСЃ</Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingId ? 'Р РµРґР°РєС‚РёСЂРѕРІР°С‚СЊ РєСѓСЂСЃ' : 'Р”РѕР±Р°РІРёС‚СЊ РєСѓСЂСЃ'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {/* Cover Image Upload */}
              <div>
                <FormLabel className="block mb-2">РћР±Р»РѕР¶РєР° РєСѓСЂСЃР°</FormLabel>
                {coverImage.url ? (
                  <div className="space-y-2">
                    <img
                      src={coverImage.url}
                      alt="Cover"
                      className="w-full h-40 object-cover rounded-lg"
                    />
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleCoverUpload}
                      disabled={uploading}
                    />
                  </div>
                ) : (
                  <div className="border-2 border-dashed rounded-lg p-6 text-center hover:bg-gray-50 cursor-pointer">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleCoverUpload}
                      disabled={uploading}
                      className="hidden"
                      id="cover-input"
                    />
                    <label htmlFor="cover-input" className="cursor-pointer block">
                      <Upload className="mx-auto mb-2 text-gray-400" size={24} />
                      <p className="text-sm">РќР°Р¶РјРё РёР»Рё РїРµСЂРµС‚Р°С‰Рё РѕР±Р»РѕР¶РєСѓ</p>
                      {uploading && <p className="text-xs text-blue-500 mt-2">Р—Р°РіСЂСѓР·РєР°...</p>}
                    </label>
                  </div>
                )}
              </div>

              <div>
                <FormLabel className="block mb-2">РќР°Р·РІР°РЅРёРµ</FormLabel>
                <Input
                  {...form.register('title')}
                  placeholder="РќР°Р·РІР°РЅРёРµ РєСѓСЂСЃР°"
                />
              </div>

              <div>
                <FormLabel className="block mb-2">РћРїРёСЃР°РЅРёРµ</FormLabel>
                <Textarea
                  {...form.register('description')}
                  placeholder="РћРїРёСЃР°РЅРёРµ РєСѓСЂСЃР°"
                />
              </div>

              <div>
                <FormLabel className="block mb-2">Р¦РµРЅР° (в‚Ѕ)</FormLabel>
                <Input
                  type="number"
                  step="0.01"
                  {...form.register('price', { valueAsNumber: true })}
                  placeholder="0"
                />
              </div>

              <div>
                <FormLabel className="block mb-2">РЈСЂРѕРІРµРЅСЊ</FormLabel>
                <Input
                  {...form.register('level')}
                  placeholder="РЈСЂРѕРІРµРЅСЊ РєСѓСЂСЃР°"
                />
              </div>

              <Button type="submit" className="w-full">
                РЎРѕС…СЂР°РЅРёС‚СЊ
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <p>Р—Р°РіСЂСѓР·РєР°...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {courses.map((course) => (
            <div key={course.id} className="border rounded-lg overflow-hidden hover:shadow-lg transition">
              {course.cover_image_url && (
                <img src={course.cover_image_url} alt={course.title} className="w-full h-40 object-cover" />
              )}
              <div className="p-4">
                <h3 className="font-bold text-lg mb-2 line-clamp-2">{course.title}</h3>
                <p className="text-sm text-gray-600 mb-2 line-clamp-2">{course.description}</p>
                <div className="flex justify-between text-sm mb-4 gap-2 flex-wrap">
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">рџ’° {course.price} в‚Ѕ</span>
                  <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs">рџ“Љ {course.level}</span>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => editCourse(course)}
                    className="flex-1"
                  >
                    <Pencil size={16} className="mr-1" />
                    Р РµРґР°РєС‚РёСЂРѕРІР°С‚СЊ
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => deleteCourse(course.id)}
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

