import { useState, useEffect } from 'react';
import { supabase, Review } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { toast } from '@/hooks/use-toast';
import { Trash2, Eye, EyeOff } from 'lucide-react';

export function ReviewsManager() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);

  const form = useForm({
    defaultValues: {
      author_name: '',
      rating: 5,
      comment: '',
      author_avatar_url: '',
      is_published: false,
    },
  });

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.from('reviews').select('*').order('created_at', { ascending: false });

      if (error) throw error;
      setReviews(data || []);
    } catch (error: any) {
      toast({ title: 'Ошибка', description: error.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (values: any) => {
    try {
      const { error } = await supabase.from('reviews').insert([
        {
          ...values,
          rating: parseInt(values.rating),
        },
      ]);

      if (error) throw error;

      toast({ title: 'Успешно', description: 'Отзыв добавлен' });
      form.reset();
      setOpen(false);
      await fetchReviews();
    } catch (error: any) {
      toast({ title: 'Ошибка', description: error.message, variant: 'destructive' });
    }
  };

  const togglePublish = async (id: string, current: boolean) => {
    try {
      const { error } = await supabase.from('reviews').update({ is_published: !current }).eq('id', id);

      if (error) throw error;

      toast({ title: 'Успешно', description: 'Статус изменён' });
      await fetchReviews();
    } catch (error: any) {
      toast({ title: 'Ошибка', description: error.message, variant: 'destructive' });
    }
  };

  const deleteReview = async (id: string) => {
    if (!confirm('Удалить отзыв?')) return;

    try {
      const { error } = await supabase.from('reviews').delete().eq('id', id);

      if (error) throw error;

      toast({ title: 'Успешно', description: 'Отзыв удалён' });
      await fetchReviews();
    } catch (error: any) {
      toast({ title: 'Ошибка', description: error.message, variant: 'destructive' });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Отзывы ({reviews.length})</h2>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>Добавить отзыв</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Добавить отзыв</DialogTitle>
            </DialogHeader>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="author_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Имя автора</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="rating"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Оценка (1-5)</FormLabel>
                    <FormControl>
                      <Input type="number" min="1" max="5" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="comment"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Текст отзыва</FormLabel>
                    <FormControl>
                      <Textarea {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="author_avatar_url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>URL аватара (опционально)</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="is_published"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      <input 
                        type="checkbox" 
                        checked={field.value}
                        onChange={(e) => field.onChange(e.target.checked)}
                        className="mr-2" 
                      />
                      Опубликовать сразу
                    </FormLabel>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">Сохранить</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <p>Загрузка...</p>
      ) : (
        <div className="space-y-3">
          {reviews.map((review) => (
            <div key={review.id} className="border rounded-lg p-4 flex gap-4">
              {review.author_avatar_url && (
                <img
                  src={review.author_avatar_url}
                  alt={review.author_name}
                  className="w-12 h-12 rounded-full"
                />
              )}
              <div className="flex-1">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-bold">{review.author_name}</h4>
                    <p className="text-sm text-yellow-500">⭐ {review.rating}/5</p>
                  </div>
                  <div className="flex gap-2">
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
                <p className="text-sm text-gray-700">{review.comment}</p>
                <p className="text-xs text-gray-500 mt-2">
                  {review.is_published ? '✓ Опубликовано' : '⊘ Не опубликовано'}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
