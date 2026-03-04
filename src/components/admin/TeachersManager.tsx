import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Pencil, Trash2, Eye, EyeOff, Upload } from "lucide-react";
import { supabase, Teacher } from "@/lib/supabase";
import { uploadImageWithBucketFallback } from "@/lib/storage";
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

export function TeachersManager() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [photoImage, setPhotoImage] = useState<{ url: string; file: File | null }>({
    url: "",
    file: null,
  });

  const form = useForm({
    defaultValues: {
      full_name: "",
      position: "",
      bio: "",
      photo_url: "",
      display_order: 0,
      is_published: true,
    },
  });

  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchTeachers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("teachers")
        .select("*")
        .order("display_order", { ascending: true, nullsFirst: false })
        .order("created_at", { ascending: false });

      if (error) throw error;
      setTeachers(data || []);
    } catch (error: any) {
      toast({ title: "Ошибка", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      const fileExt = file.name.split(".").pop();
      const fileName = `teacher-photo-${Date.now()}.${fileExt}`;
      const filePath = `teachers/${fileName}`;

      const { publicUrl: fileUrl } = await uploadImageWithBucketFallback(filePath, file);
      setPhotoImage({ url: fileUrl, file });
      form.setValue("photo_url", fileUrl);
      toast({ title: "Успешно", description: "Фото загружено" });
    } catch (error: any) {
      toast({ title: "Ошибка загрузки", description: error.message, variant: "destructive" });
    } finally {
      setUploading(false);
    }
  };

  const onSubmit = async (values: any) => {
    try {
      const submitData = {
        full_name: values.full_name,
        position: values.position || null,
        bio: values.bio || null,
        photo_url: values.photo_url || null,
        display_order: Number(values.display_order) || 0,
        is_published: Boolean(values.is_published),
      };

      if (editingId) {
        const { error } = await supabase.from("teachers").update(submitData).eq("id", editingId);
        if (error) throw error;
        toast({ title: "Успешно", description: "Преподаватель обновлен" });
      } else {
        const { error } = await supabase.from("teachers").insert([submitData]);
        if (error) throw error;
        toast({ title: "Успешно", description: "Преподаватель добавлен" });
      }

      form.reset();
      setPhotoImage({ url: "", file: null });
      setOpen(false);
      setEditingId(null);
      await fetchTeachers();
    } catch (error: any) {
      toast({ title: "Ошибка", description: error.message, variant: "destructive" });
    }
  };

  const editTeacher = (teacher: Teacher) => {
    form.reset({
      full_name: teacher.full_name,
      position: teacher.position || "",
      bio: teacher.bio || "",
      photo_url: teacher.photo_url || "",
      display_order: teacher.display_order || 0,
      is_published: teacher.is_published,
    });

    setPhotoImage({ url: teacher.photo_url || "", file: null });
    setEditingId(teacher.id);
    setOpen(true);
  };

  const togglePublish = async (id: string, current: boolean) => {
    try {
      const { error } = await supabase.from("teachers").update({ is_published: !current }).eq("id", id);
      if (error) throw error;

      toast({ title: "Успешно", description: "Статус публикации изменен" });
      await fetchTeachers();
    } catch (error: any) {
      toast({ title: "Ошибка", description: error.message, variant: "destructive" });
    }
  };

  const deleteTeacher = async (id: string) => {
    if (!confirm("Удалить преподавателя?")) return;

    try {
      const { error } = await supabase.from("teachers").delete().eq("id", id);
      if (error) throw error;

      toast({ title: "Успешно", description: "Преподаватель удален" });
      await fetchTeachers();
    } catch (error: any) {
      toast({ title: "Ошибка", description: error.message, variant: "destructive" });
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      form.reset();
      setPhotoImage({ url: "", file: null });
      setEditingId(null);
    }
    setOpen(newOpen);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Преподаватели ({teachers.length})</h2>
        <Dialog open={open} onOpenChange={handleOpenChange}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingId(null)}>Добавить преподавателя</Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingId ? "Редактировать преподавателя" : "Добавить преподавателя"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <FormLabel className="block mb-2">Фото</FormLabel>
                {photoImage.url ? (
                  <div className="space-y-2">
                    <img
                      src={photoImage.url}
                      alt="Teacher"
                      className="w-24 h-24 rounded-full object-cover"
                    />
                    <Input type="file" accept="image/*" onChange={handlePhotoUpload} disabled={uploading} />
                  </div>
                ) : (
                  <div className="border-2 border-dashed rounded-lg p-6 text-center hover:bg-gray-50 cursor-pointer">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      disabled={uploading}
                      className="hidden"
                      id="teacher-photo-input"
                    />
                    <label htmlFor="teacher-photo-input" className="cursor-pointer block">
                      <Upload className="mx-auto mb-2 text-gray-400" size={24} />
                      <p className="text-sm">Нажми или перетащи фото</p>
                      {uploading ? <p className="text-xs text-blue-500 mt-2">Загрузка...</p> : null}
                    </label>
                  </div>
                )}
              </div>

              <div>
                <FormLabel className="block mb-2">ФИО</FormLabel>
                <Input {...form.register("full_name")} placeholder="Иванов Иван Иванович" />
              </div>

              <div>
                <FormLabel className="block mb-2">Должность / роль</FormLabel>
                <Input {...form.register("position")} placeholder="Адвокат, партнер практики банкротства" />
              </div>

              <div>
                <FormLabel className="block mb-2">Описание</FormLabel>
                <Textarea {...form.register("bio")} placeholder="Кратко о компетенциях преподавателя" />
              </div>

              <div>
                <FormLabel className="block mb-2">Порядок отображения</FormLabel>
                <Input type="number" {...form.register("display_order", { valueAsNumber: true })} placeholder="0" />
              </div>

              <div className="flex items-center gap-2">
                <input type="checkbox" {...form.register("is_published")} id="teacher_is_published" className="cursor-pointer" />
                <FormLabel htmlFor="teacher_is_published" className="cursor-pointer">
                  Опубликовать на сайте
                </FormLabel>
              </div>

              <Button type="submit" className="w-full">
                {editingId ? "Сохранить изменения" : "Добавить преподавателя"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <p>Загрузка...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {teachers.length === 0 ? (
            <p className="text-gray-500">Преподавателей пока нет</p>
          ) : (
            teachers.map((teacher) => (
              <div key={teacher.id} className="border rounded-lg p-4 hover:shadow-md transition">
                <div className="flex gap-4">
                  {teacher.photo_url ? (
                    <img
                      src={teacher.photo_url}
                      alt={teacher.full_name}
                      className="w-16 h-16 rounded-full object-cover flex-shrink-0"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-gray-200 flex-shrink-0" />
                  )}

                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start gap-2">
                      <div className="min-w-0">
                        <h3 className="font-bold text-lg truncate">{teacher.full_name}</h3>
                        {teacher.position ? <p className="text-sm text-gray-600">{teacher.position}</p> : null}
                        <p className="text-xs text-gray-500 mt-1">Порядок: {teacher.display_order ?? 0}</p>
                      </div>
                      <div className="flex gap-2 flex-shrink-0">
                        <Button variant="outline" size="sm" onClick={() => editTeacher(teacher)}>
                          <Pencil size={16} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => togglePublish(teacher.id, teacher.is_published)}
                        >
                          {teacher.is_published ? <Eye size={16} /> : <EyeOff size={16} />}
                        </Button>
                        <Button variant="destructive" size="sm" onClick={() => deleteTeacher(teacher.id)}>
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </div>

                    {teacher.bio ? <p className="text-sm text-gray-700 mt-3">{teacher.bio}</p> : null}

                    <p className="text-xs mt-3 text-gray-500">
                      {teacher.is_published ? "Опубликован" : "Скрыт"}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

