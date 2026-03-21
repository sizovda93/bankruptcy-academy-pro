import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Pencil, Trash2, Upload, Download } from "lucide-react";
import { api, Course } from "@/lib/api";
import { resizeImageToCover } from "@/lib/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";

const FormLabel = ({ className = "", ...props }: any) => (
  <label
    className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${className}`}
    {...props}
  />
);

export function CoursesManager() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [coverImage, setCoverImage] = useState<{ url: string; file: File | null }>({
    url: "",
    file: null,
  });

  const form = useForm({
    defaultValues: {
      title: "",
      description: "",
      benefits: "",
      cover_image_url: "",
      price: 0,
      level: "Начинающий",
    },
  });

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const data = await api.courses.list();
      setCourses(data || []);
    } catch (error: any) {
      toast({ title: "Ошибка", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const originalFile = e.target.files?.[0];
    if (!originalFile) return;

    try {
      setUploading(true);
      const file = await resizeImageToCover(originalFile, { width: 1200, height: 675, quality: 0.9 });
      const { publicUrl: fileUrl } = await api.media.uploadToPath(file);

      setCoverImage({ url: fileUrl, file });
      form.setValue("cover_image_url", fileUrl);
      toast({ title: "Успешно", description: "Обложка загружена" });
    } catch (error: any) {
      toast({ title: "Ошибка загрузки", description: error.message, variant: "destructive" });
    } finally {
      setUploading(false);
    }
  };

  const onSubmit = async (values: any) => {
    try {
      const submitData = {
        title: values.title,
        description: values.description || null,
        benefits: values.benefits || null,
        cover_image_url: values.cover_image_url || null,
        price: Number(values.price) || 0,
        level: values.level || null,
      };

      if (editingId) {
        await api.courses.update(editingId, submitData);
        toast({ title: "Успешно", description: "Курс обновлен" });
      } else {
        await api.courses.create(submitData);
        toast({ title: "Успешно", description: "Курс создан" });
      }

      form.reset();
      setCoverImage({ url: "", file: null });
      setOpen(false);
      setEditingId(null);
      await fetchCourses();
    } catch (error: any) {
      toast({ title: "Ошибка", description: error.message, variant: "destructive" });
    }
  };

  const editCourse = (course: Course) => {
    form.reset({
      title: course.title,
      description: course.description || "",
      benefits: course.benefits || "",
      cover_image_url: course.cover_image_url || "",
      price: course.price,
      level: course.level || "",
    });
    setCoverImage({ url: course.cover_image_url || "", file: null });
    setEditingId(course.id);
    setOpen(true);
  };

  const deleteCourse = async (id: string) => {
    if (!confirm("Вы уверены?")) return;

    try {
      await api.courses.delete(id);
      toast({ title: "Успешно", description: "Курс удален" });
      await fetchCourses();
    } catch (error: any) {
      toast({ title: "Ошибка", description: error.message, variant: "destructive" });
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      form.reset();
      setCoverImage({ url: "", file: null });
      setEditingId(null);
    }
    setOpen(newOpen);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Курсы ({courses.length})</h2>
        <Dialog open={open} onOpenChange={handleOpenChange}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingId(null)}>Добавить курс</Button>
          </DialogTrigger>
          <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingId ? "Редактировать курс" : "Добавить курс"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <FormLabel className="mb-2 block">Обложка курса</FormLabel>
                {coverImage.url ? (
                  <div className="space-y-2">
                    <img src={coverImage.url} alt="Cover" className="h-40 w-full rounded-lg object-cover" />
                    <Input type="file" accept="image/*" onChange={handleCoverUpload} disabled={uploading} />
                  </div>
                ) : (
                  <div className="cursor-pointer rounded-lg border-2 border-dashed p-6 text-center hover:bg-gray-50">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleCoverUpload}
                      disabled={uploading}
                      className="hidden"
                      id="cover-input"
                    />
                    <label htmlFor="cover-input" className="block cursor-pointer">
                      <Upload className="mx-auto mb-2 text-gray-400" size={24} />
                      <p className="text-sm">Нажми или перетащи обложку</p>
                      {uploading ? <p className="mt-2 text-xs text-blue-500">Загрузка...</p> : null}
                    </label>
                  </div>
                )}
              </div>

              <div>
                <FormLabel className="mb-2 block">Название</FormLabel>
                <Input {...form.register("title")} placeholder="Название курса" />
              </div>

              <div>
                <FormLabel className="mb-2 block">Описание</FormLabel>
                <Textarea {...form.register("description")} placeholder="Описание курса" />
              </div>

              <div>
                <FormLabel className="mb-2 block">Преимущества курса</FormLabel>
                <Textarea
                  {...form.register("benefits")}
                  placeholder="Каждый пункт с новой строки&#10;Например:&#10;Практические кейсы&#10;Поддержка экспертов"
                />
              </div>

              <div>
                <FormLabel className="mb-2 block">Цена (₽)</FormLabel>
                <Input type="number" step="0.01" {...form.register("price", { valueAsNumber: true })} placeholder="0" />
              </div>

              <div>
                <FormLabel className="mb-2 block">Уровень</FormLabel>
                <Input {...form.register("level")} placeholder="Уровень курса" />
              </div>

              <Button type="submit" className="w-full">
                Сохранить
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <p>Загрузка...</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {courses.map((course) => (
            <div key={course.id} className="overflow-hidden rounded-lg border transition hover:shadow-lg">
              {course.cover_image_url ? (
                <img src={course.cover_image_url} alt={course.title} className="h-40 w-full object-cover" />
              ) : null}
              <div className="p-4">
                <h3 className="mb-2 line-clamp-2 text-lg font-bold">{course.title}</h3>
                <p className="mb-2 line-clamp-2 text-sm text-gray-600">{course.description}</p>
                <div className="mb-4 flex flex-wrap justify-between gap-2 text-sm">
                  <span className="rounded bg-blue-100 px-2 py-1 text-xs text-blue-800">💰 {course.price} ₽</span>
                  <span className="rounded bg-purple-100 px-2 py-1 text-xs text-purple-800">📊 {course.level}</span>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => editCourse(course)} className="flex-1">
                    <Pencil size={16} className="mr-1" />
                    Редактировать
                  </Button>
                  {course.cover_image_url ? (
                    <Button variant="outline" size="sm" asChild>
                      <a href={`${course.cover_image_url}?download=1`} download>
                        <Download size={16} />
                      </a>
                    </Button>
                  ) : null}
                  <Button variant="destructive" size="sm" onClick={() => deleteCourse(course.id)}>
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
