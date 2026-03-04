import { useState, useEffect } from 'react';
import { supabase, Review, Course } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useForm } from 'react-hook-form';
import { toast } from '@/hooks/use-toast';
import { Trash2, Eye, EyeOff, Pencil, Upload } from 'lucide-react';

const FormLabel = ({ className = '', ...props }: any) => (
  <label className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${className}`} {...props} />
);

export function ReviewsManager() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [avatarImage, setAvatarImage] = useState<{ url: string; file: File | null }>({
    url: '',
    file: null,
  });

  const form = useForm({
    defaultValues: {
      author_name: '',
      rating: '5',
      comment: '',
      author_avatar_url: '',
      course_id: '',
      is_published: true,
    },
  });

  useEffect(() => {
    fetchReviews();
    fetchCourses();
  }, []);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.from('reviews').select('*').order('created_at', { ascending: false });

      if (error) throw error;
      setReviews(data || []);
    } catch (error: any) {
      toast({ title: 'РћС€РёР±РєР°', description: error.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const fetchCourses = async () => {
    try {
      const { data, error } = await supabase.from('courses').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      setCourses(data || []);
    } catch (error: any) {
      toast({ title: 'РћС€РёР±РєР° Р·Р°РіСЂСѓР·РєРё РєСѓСЂСЃРѕРІ', description: error.message, variant: 'destructive' });
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);

      // Р—Р°РіСЂСѓР·РёРј С„Р°Р№Р» РІ Supabase Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `avatar-${Date.now()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      const { error: uploadError } = await supabase.storage.from('media').upload(filePath, file);

      if (uploadError) throw uploadError;

      // РџРѕР»СѓС‡РёРј РїСѓР±Р»РёС‡РЅС‹Р№ URL
      const { data: publicData } = supabase.storage.from('media').getPublicUrl(filePath);
      const fileUrl = publicData.publicUrl;

      setAvatarImage({ url: fileUrl, file: file });
      form.setValue('author_avatar_url', fileUrl);
      toast({ title: 'РЈСЃРїРµС€РЅРѕ', description: 'РђРІР°С‚Р°СЂ Р·Р°РіСЂСѓР¶РµРЅ' });
    } catch (error: any) {
      toast({ title: 'РћС€РёР±РєР° Р·Р°РіСЂСѓР·РєРё', description: error.message, variant: 'destructive' });
    } finally {
      setUploading(false);
    }
  };

  const onSubmit = async (values: any) => {
    try {
      const submitData = {
        author_name: values.author_name,
        rating: parseInt(values.rating),
        comment: values.comment,
        author_avatar_url: values.author_avatar_url,
        course_id: values.course_id || null,
        is_published: values.is_published,
      };

      if (editingId) {
        const { error } = await supabase.from('reviews').update(submitData).eq('id', editingId);
        if (error) throw error;
        toast({ title: 'РЈСЃРїРµС€РЅРѕ', description: 'РћС‚Р·С‹РІ РѕР±РЅРѕРІР»С‘РЅ' });
      } else {
        const { error } = await supabase.from('reviews').insert([submitData]);
        if (error) throw error;
        toast({ title: 'РЈСЃРїРµС€РЅРѕ', description: 'РћС‚Р·С‹РІ РґРѕР±Р°РІР»РµРЅ' });
      }

      form.reset();
      setAvatarImage({ url: '', file: null });
      setOpen(false);
      setEditingId(null);
      await fetchReviews();
    } catch (error: any) {
      toast({ title: 'РћС€РёР±РєР°', description: error.message, variant: 'destructive' });
    }
  };

  const editReview = (review: Review) => {
    form.reset({
      author_name: review.author_name,
      rating: review.rating.toString(),
      comment: review.comment,
      author_avatar_url: review.author_avatar_url,
      course_id: review.course_id || '',
      is_published: review.is_published,
    });
    setAvatarImage({ url: review.author_avatar_url || '', file: null });
    setEditingId(review.id);
    setOpen(true);
  };

  const togglePublish = async (id: string, current: boolean) => {
    try {
      const { error } = await supabase.from('reviews').update({ is_published: !current }).eq('id', id);

      if (error) throw error;

      toast({ title: 'РЈСЃРїРµС€РЅРѕ', description: 'РЎС‚Р°С‚СѓСЃ РёР·РјРµРЅС‘РЅ' });
      await fetchReviews();
    } catch (error: any) {
      toast({ title: 'РћС€РёР±РєР°', description: error.message, variant: 'destructive' });
    }
  };

  const deleteReview = async (id: string) => {
    if (!confirm('РЈРґР°Р»РёС‚СЊ РѕС‚Р·С‹РІ?')) return;

    try {
      const { error } = await supabase.from('reviews').delete().eq('id', id);

      if (error) throw error;

      toast({ title: 'РЈСЃРїРµС€РЅРѕ', description: 'РћС‚Р·С‹РІ СѓРґР°Р»С‘РЅ' });
      await fetchReviews();
    } catch (error: any) {
      toast({ title: 'РћС€РёР±РєР°', description: error.message, variant: 'destructive' });
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      form.reset();
      setAvatarImage({ url: '', file: null });
      setEditingId(null);
    }
    setOpen(newOpen);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">РћС‚Р·С‹РІС‹ ({reviews.length})</h2>
        <Dialog open={open} onOpenChange={handleOpenChange}>
          <DialogTrigger asChild>
            <Button>Р”РѕР±Р°РІРёС‚СЊ РѕС‚Р·С‹РІ</Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingId ? 'Р РµРґР°РєС‚РёСЂРѕРІР°С‚СЊ РѕС‚Р·С‹РІ' : 'Р”РѕР±Р°РІРёС‚СЊ РѕС‚Р·С‹РІ'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {/* РРјСЏ Р°РІС‚РѕСЂР° */}
              <div className="space-y-2">
                <FormLabel>РРјСЏ Р°РІС‚РѕСЂР°</FormLabel>
                <Input {...form.register('author_name')} placeholder="РРІР°РЅ РџРµС‚СЂРѕРІ" />
              </div>

              {/* Р’С‹Р±РѕСЂ РєСѓСЂСЃР° */}
              <div className="space-y-2">
                <FormLabel>РљСѓСЂСЃ (РѕРїС†РёРѕРЅР°Р»СЊРЅРѕ)</FormLabel>
                <select
                  {...form.register('course_id')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="">РќРµ РїСЂРёРІСЏР·Р°РЅ Рє РєСѓСЂСЃСѓ</option>
                  {courses.map((course) => (
                    <option key={course.id} value={course.id}>
                      {course.title}
                    </option>
                  ))}
                </select>
              </div>

              {/* РћС†РµРЅРєР° */}
              <div className="space-y-2">
                <FormLabel>РћС†РµРЅРєР° (1-5)</FormLabel>
                <Input
                  type="number"
                  min="1"
                  max="5"
                  {...form.register('rating')}
                />
              </div>

              {/* РўРµРєСЃС‚ РѕС‚Р·С‹РІР° */}
              <div className="space-y-2">
                <FormLabel>РўРµРєСЃС‚ РѕС‚Р·С‹РІР°</FormLabel>
                <Textarea
                  {...form.register('comment')}
                  placeholder="РћС‚Р»РёС‡РЅС‹Р№ РєСѓСЂСЃ, РјРЅРѕРіРѕ РїРѕР»РµР·РЅРѕР№ РёРЅС„РѕСЂРјР°С†РёРё..."
                  rows={4}
                />
              </div>

              {/* Р—Р°РіСЂСѓР·РєР° Р°РІР°С‚Р°СЂР° */}
              <div className="space-y-2">
                <FormLabel>РђРІР°С‚Р°СЂ</FormLabel>
                {avatarImage.url && (
                  <div className="mb-2">
                    <img
                      src={avatarImage.url}
                      alt="Avatar preview"
                      className="w-16 h-16 rounded-full object-cover"
                    />
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                    disabled={uploading}
                    className="cursor-pointer"
                  />
                  {uploading && <span className="text-sm text-gray-500">Р—Р°РіСЂСѓР·РєР°...</span>}
                </div>
                <p className="text-xs text-gray-500">РёР»Рё</p>
                <Input
                  {...form.register('author_avatar_url')}
                  placeholder="Р’СЃС‚Р°РІРёС‚СЊ URL Р°РІР°С‚Р°СЂР°"
                />
              </div>

              {/* РџСѓР±Р»РёРєР°С†РёСЏ */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  {...form.register('is_published')}
                  id="is_published"
                  className="cursor-pointer"
                />
                <FormLabel htmlFor="is_published" className="cursor-pointer">
                  РћРїСѓР±Р»РёРєРѕРІР°С‚СЊ СЃСЂР°Р·Сѓ
                </FormLabel>
              </div>

              <Button type="submit" className="w-full">
                {editingId ? 'РћР±РЅРѕРІРёС‚СЊ' : 'Р”РѕР±Р°РІРёС‚СЊ'} РѕС‚Р·С‹РІ
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <p>Р—Р°РіСЂСѓР·РєР°...</p>
      ) : (
        <div className="space-y-3">
          {reviews.length === 0 ? (
            <p className="text-gray-500">РћС‚Р·С‹РІРѕРІ РЅРµС‚</p>
          ) : (
            reviews.map((review) => {
              const course = courses.find((c) => c.id === review.course_id);
              return (
                <div key={review.id} className="border rounded-lg p-4 flex gap-4">
                  {review.author_avatar_url && (
                    <img
                      src={review.author_avatar_url}
                      alt={review.author_name}
                      className="w-12 h-12 rounded-full object-cover flex-shrink-0"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-2 gap-2">
                      <div className="min-w-0">
                        <h4 className="font-bold">{review.author_name}</h4>
                        <p className="text-sm text-yellow-500">в­ђ {review.rating}/5</p>
                        {course && <p className="text-xs text-gray-500">РљСѓСЂСЃ: {course.title}</p>}
                      </div>
                      <div className="flex gap-2 flex-shrink-0">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => editReview(review)}
                        >
                          <Pencil size={16} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => togglePublish(review.id, review.is_published)}
                        >
                          {review.is_published ? <Eye size={16} /> : <EyeOff size={16} />}
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => deleteReview(review.id)}
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </div>
                    <p className="text-sm text-gray-700 break-words">{review.comment}</p>
                    <p className="text-xs text-gray-500 mt-2">
                      {review.is_published ? 'вњ“ РћРїСѓР±Р»РёРєРѕРІР°РЅРѕ' : 'вЉ РќРµ РѕРїСѓР±Р»РёРєРѕРІР°РЅРѕ'}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}

