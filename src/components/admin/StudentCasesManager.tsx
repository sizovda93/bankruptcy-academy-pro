import { useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { Eye, EyeOff, Pencil, Trash2, Upload } from "lucide-react";
import { api, Course, StudentCase } from "@/lib/api";
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

const UNASSIGNED = "__unassigned__";

export function StudentCasesManager() {
  const [cases, setCases] = useState<StudentCase[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedCourse, setSelectedCourse] = useState("all");
  const [caseImage, setCaseImage] = useState<{ url: string; file: File | null }>({ url: "", file: null });
  const [caseVideo, setCaseVideo] = useState<{ url: string; file: File | null }>({ url: "", file: null });
  const [uploading, setUploading] = useState<"image" | "video" | null>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  const form = useForm({
    defaultValues: {
      course_id: "",
      student_name: "",
      student_role: "",
      case_text: "",
      result_text: "",
      case_image_url: "",
      case_video_url: "",
      display_order: 0,
      is_published: true,
    },
  });

  useEffect(() => {
    fetchCases();
    fetchCourses();
  }, []);

  const fetchCases = async () => {
    try {
      setLoading(true);
      const data = await api.studentCases.list();
      setCases(data || []);
    } catch (error: any) {
      toast({ title: "Ошибка", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const fetchCourses = async () => {
    try {
      const data = await api.courses.list();
      setCourses(data || []);
    } catch (error: any) {
      toast({ title: "Ошибка загрузки курсов", description: error.message, variant: "destructive" });
    }
  };

  const filteredCases = useMemo(() => {
    if (selectedCourse === "all") return cases;
    if (selectedCourse === UNASSIGNED) return cases.filter((item) => !item.course_id);
    return cases.filter((item) => item.course_id === selectedCourse);
  }, [cases, selectedCourse]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setUploading("image");
      const { publicUrl } = await api.media.uploadToPath(file);
      setCaseImage({ url: publicUrl, file });
      form.setValue("case_image_url", publicUrl);
    } catch (err: any) {
      toast({ title: "Ошибка загрузки фото", description: err.message, variant: "destructive" });
    } finally {
      setUploading(null);
    }
  };

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setUploading("video");
      const { publicUrl } = await api.media.uploadToPath(file);
      setCaseVideo({ url: publicUrl, file });
      form.setValue("case_video_url", publicUrl);
    } catch (err: any) {
      toast({ title: "Ошибка загрузки видео", description: err.message, variant: "destructive" });
    } finally {
      setUploading(null);
    }
  };

  const onSubmit = async (values: any) => {
    try {
      const payload = {
        course_id: values.course_id || null,
        student_name: values.student_name,
        student_role: values.student_role || null,
        case_text: values.case_text || null,
        result_text: values.result_text || null,
        case_image_url: values.case_image_url || null,
        case_video_url: values.case_video_url || null,
        display_order: Number(values.display_order) || 0,
        is_published: values.is_published,
      };

      if (editingId) {
        await api.studentCases.update(editingId, payload);
        toast({ title: "Успешно", description: "Кейс обновлен" });
      } else {
        await api.studentCases.create(payload);
        toast({ title: "Успешно", description: "Кейс добавлен" });
      }

      form.reset();
      setEditingId(null);
      setOpen(false);
      await fetchCases();
    } catch (error: any) {
      toast({ title: "Ошибка", description: error.message, variant: "destructive" });
    }
  };

  const editCase = (item: StudentCase) => {
    form.reset({
      course_id: item.course_id || "",
      student_name: item.student_name,
      student_role: item.student_role || "",
      case_text: item.case_text || "",
      result_text: item.result_text || "",
      case_image_url: item.case_image_url || "",
      case_video_url: item.case_video_url || "",
      display_order: item.display_order || 0,
      is_published: item.is_published,
    });
    setCaseImage({ url: item.case_image_url || "", file: null });
    setCaseVideo({ url: item.case_video_url || "", file: null });
    setEditingId(item.id);
    setOpen(true);
  };

  const togglePublish = async (id: string, current: boolean) => {
    try {
      await api.studentCases.togglePublish(id, !current);
      toast({ title: "Успешно", description: "Статус публикации обновлен" });
      await fetchCases();
    } catch (error: any) {
      toast({ title: "Ошибка", description: error.message, variant: "destructive" });
    }
  };

  const deleteCase = async (id: string) => {
    if (!confirm("Удалить кейс?")) return;

    try {
      await api.studentCases.delete(id);
      toast({ title: "Успешно", description: "Кейс удален" });
      await fetchCases();
    } catch (error: any) {
      toast({ title: "Ошибка", description: error.message, variant: "destructive" });
    }
  };

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      form.reset();
      setEditingId(null);
      setCaseImage({ url: "", file: null });
      setCaseVideo({ url: "", file: null });
    }
    setOpen(nextOpen);
  };

  const openCreate = () => {
    setEditingId(null);
    form.reset({
      course_id: selectedCourse !== "all" && selectedCourse !== UNASSIGNED ? selectedCourse : "",
      student_name: "",
      student_role: "",
      case_text: "",
      result_text: "",
      case_image_url: "",
      case_video_url: "",
      display_order: 0,
      is_published: true,
    });
    setCaseImage({ url: "", file: null });
    setCaseVideo({ url: "", file: null });
    setOpen(true);
  };

  const renderCaseCard = (item: StudentCase) => (
    <div key={item.id} className="rounded-lg border p-4">
      <div className="mb-2 flex items-start justify-between gap-2">
        <div className="min-w-0">
          <h4 className="font-bold">{item.student_name}</h4>
          {item.student_role ? <p className="text-sm text-gray-500">{item.student_role}</p> : null}
        </div>
        <div className="flex flex-shrink-0 gap-2">
          <Button variant="outline" size="sm" onClick={() => editCase(item)}>
            <Pencil size={16} />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => togglePublish(item.id, item.is_published)}>
            {item.is_published ? <Eye size={16} /> : <EyeOff size={16} />}
          </Button>
          <Button variant="destructive" size="sm" onClick={() => deleteCase(item.id)}>
            <Trash2 size={16} />
          </Button>
        </div>
      </div>
      <p className="text-sm text-gray-700">{item.case_text}</p>
      {item.result_text ? <p className="mt-2 text-sm font-medium text-primary">{item.result_text}</p> : null}
      <p className="mt-2 text-xs text-gray-500">{item.is_published ? "Опубликован" : "Скрыт"}</p>
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <h2 className="text-2xl font-bold">Кейсы студентов ({cases.length})</h2>
        <div className="flex w-full flex-col gap-2 md:w-auto md:flex-row md:items-center">
          <select
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 md:w-80"
          >
            <option value="all">Все курсы</option>
            {courses.map((course) => (
              <option key={course.id} value={course.id}>
                {course.title}
              </option>
            ))}
            <option value={UNASSIGNED}>Без привязки к курсу</option>
          </select>

          <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
              <Button onClick={openCreate}>Добавить кейс</Button>
            </DialogTrigger>
            <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingId ? "Редактировать кейс" : "Добавить кейс"}</DialogTitle>
              </DialogHeader>

              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <FormLabel className="mb-2 block">Курс</FormLabel>
                  <select {...form.register("course_id")} className="w-full rounded-md border border-gray-300 px-3 py-2">
                    <option value="">Без привязки к курсу</option>
                    {courses.map((course) => (
                      <option key={course.id} value={course.id}>
                        {course.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <FormLabel className="mb-2 block">Имя студента</FormLabel>
                  <Input {...form.register("student_name")} placeholder="Александр М." />
                </div>

                <div>
                  <FormLabel className="mb-2 block">Статус/роль</FormLabel>
                  <Input {...form.register("student_role")} placeholder="Выпускник курса" />
                </div>

                <div>
                  <FormLabel className="mb-2 block">Описание (необязательно)</FormLabel>
                  <Textarea {...form.register("case_text")} rows={4} placeholder="Описание кейса и результата" />
                </div>

                <div>
                  <FormLabel className="mb-2 block">Итог (необязательно)</FormLabel>
                  <Textarea {...form.register("result_text")} rows={2} placeholder="Например: +40% к конверсии в договор" />
                </div>

                <div>
                  <FormLabel className="mb-2 block">Фото студента (аватар)</FormLabel>
                  {caseImage.url && (
                    <img src={caseImage.url} alt="Фото" className="mb-2 h-16 w-16 rounded-full object-cover" />
                  )}
                  <div className="flex items-center gap-2">
                    <input ref={imageInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                    <Button type="button" variant="outline" size="sm" disabled={uploading === "image"} onClick={() => imageInputRef.current?.click()}>
                      <Upload size={14} className="mr-1" />
                      {uploading === "image" ? "Загрузка..." : "Загрузить фото"}
                    </Button>
                    {caseImage.url && (
                      <Button type="button" variant="ghost" size="sm" onClick={() => { setCaseImage({ url: "", file: null }); form.setValue("case_image_url", ""); }}>
                        Удалить
                      </Button>
                    )}
                  </div>
                  <p className="mt-1 text-xs text-gray-500">или вставьте URL:</p>
                  <Input className="mt-1" {...form.register("case_image_url")} placeholder="https://..." onChange={(e) => { form.setValue("case_image_url", e.target.value); setCaseImage({ url: e.target.value, file: null }); }} />
                </div>

                <div>
                  <FormLabel className="mb-2 block">Видео</FormLabel>
                  {caseVideo.url && (
                    <video src={caseVideo.url} controls className="mb-2 h-32 w-full rounded-lg bg-black" />
                  )}
                  <div className="flex items-center gap-2">
                    <input ref={videoInputRef} type="file" accept="video/*" className="hidden" onChange={handleVideoUpload} />
                    <Button type="button" variant="outline" size="sm" disabled={uploading === "video"} onClick={() => videoInputRef.current?.click()}>
                      <Upload size={14} className="mr-1" />
                      {uploading === "video" ? "Загрузка..." : "Загрузить видео"}
                    </Button>
                    {caseVideo.url && (
                      <Button type="button" variant="ghost" size="sm" onClick={() => { setCaseVideo({ url: "", file: null }); form.setValue("case_video_url", ""); }}>
                        Удалить
                      </Button>
                    )}
                  </div>
                  <p className="mt-1 text-xs text-gray-500">или вставьте URL:</p>
                  <Input className="mt-1" {...form.register("case_video_url")} placeholder="https://..." onChange={(e) => { form.setValue("case_video_url", e.target.value); setCaseVideo({ url: e.target.value, file: null }); }} />
                </div>

                <div>
                  <FormLabel className="mb-2 block">Порядок</FormLabel>
                  <Input type="number" {...form.register("display_order", { valueAsNumber: true })} />
                </div>

                <div className="flex items-center gap-2">
                  <input type="checkbox" {...form.register("is_published")} id="case_is_published" className="cursor-pointer" />
                  <FormLabel htmlFor="case_is_published" className="cursor-pointer">
                    Опубликовать
                  </FormLabel>
                </div>

                <Button type="submit" className="w-full">
                  {editingId ? "Сохранить изменения" : "Добавить кейс"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {loading ? (
        <p>Загрузка...</p>
      ) : selectedCourse === "all" ? (
        <div className="space-y-6">
          {courses.map((course) => {
            const casesByCourse = cases.filter((item) => item.course_id === course.id);
            return (
              <section key={course.id} className="space-y-3 rounded-xl border p-4">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-lg font-semibold">{course.title}</h3>
                  <span className="text-xs text-gray-500">Кейсов: {casesByCourse.length}</span>
                </div>
                {casesByCourse.length ? (
                  <div className="space-y-3">{casesByCourse.map(renderCaseCard)}</div>
                ) : (
                  <p className="text-sm text-gray-500">Для этого курса кейсов пока нет</p>
                )}
              </section>
            );
          })}

          <section className="space-y-3 rounded-xl border p-4">
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-lg font-semibold">Без привязки к курсу</h3>
              <span className="text-xs text-gray-500">Кейсов: {cases.filter((item) => !item.course_id).length}</span>
            </div>
            {cases.some((item) => !item.course_id) ? (
              <div className="space-y-3">{cases.filter((item) => !item.course_id).map(renderCaseCard)}</div>
            ) : (
              <p className="text-sm text-gray-500">Нет кейсов без привязки</p>
            )}
          </section>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredCases.length ? (
            filteredCases.map(renderCaseCard)
          ) : (
            <p className="text-gray-500">Кейсов по выбранному курсу пока нет</p>
          )}
        </div>
      )}
    </div>
  );
}
