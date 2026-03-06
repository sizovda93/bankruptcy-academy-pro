import { useEffect, useState } from "react";
import { api, Course, StudentCase } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { ChevronLeft, Plus, Trash2, Upload, GripVertical } from "lucide-react";
import { resizeImageToCover } from "@/lib/image";

const FormLabel = ({ className = "", ...props }: any) => (
  <label
    className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${className}`}
    {...props}
  />
);

export function CourseDetailEditor() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  // State для всех полей курса
  const [basicInfo, setBasicInfo] = useState({
    title: "",
    slug: "",
    description: "",
    benefits: "",
    cover_image_url: "",
    price: 0,
    level: "",
    is_published: true,
    display_order: 0,
  });

  const [heroSection, setHeroSection] = useState({
    hero_title: "",
    hero_description: "",
    hero_highlights: [] as string[],
  });

  const [targetAudience, setTargetAudience] = useState<string[]>([]);
  const [lessons, setLessons] = useState<Array<{ title: string; points: string[] }>>([]);
  const [sellingPoints, setSellingPoints] = useState<string[]>([]);
  const [faqItems, setFaqItems] = useState<Array<{ question: string; answer: string }>>([]);
  const [teamOrder, setTeamOrder] = useState<string[]>([]);
  const [downloadForm, setDownloadForm] = useState({
    download_form_banner_url: "",
    download_form_file_url: "",
    download_form_title: "",
    download_form_description: "",
  });

  const [studentCases, setStudentCases] = useState<StudentCase[]>([]);

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

  const loadCourse = async (course: Course) => {
    setSelectedCourse(course);
    
    // Загружаем основную информацию
    setBasicInfo({
      title: course.title || "",
      slug: course.slug || "",
      description: course.description || "",
      benefits: course.benefits || "",
      cover_image_url: course.cover_image_url || "",
      price: Number(course.price) || 0,
      level: course.level || "",
      is_published: course.is_published !== false,
      display_order: course.display_order || 0,
    });

    // Загружаем hero секцию
    setHeroSection({
      hero_title: course.hero_title || "",
      hero_description: course.hero_description || "",
      hero_highlights: course.hero_highlights || [],
    });

    setTargetAudience(course.target_audience || []);
    setLessons(course.lessons || []);
    setSellingPoints(course.selling_points || []);
    setFaqItems(course.faq_items || []);
    setTeamOrder(course.team_order || []);
    
    setDownloadForm({
      download_form_banner_url: course.download_form_banner_url || "",
      download_form_file_url: course.download_form_file_url || "",
      download_form_title: course.download_form_title || "",
      download_form_description: course.download_form_description || "",
    });

    // Загружаем кейсы студентов
    try {
      const cases = await api.studentCases.list(undefined, course.id);
      setStudentCases(cases || []);
    } catch (error) {
      console.error("Ошибка загрузки кейсов:", error);
    }
  };

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const originalFile = e.target.files?.[0];
    if (!originalFile) return;

    try {
      setUploading(true);
      const file = await resizeImageToCover(originalFile, { width: 1200, height: 675, quality: 0.9 });
      const { publicUrl } = await api.media.uploadToPath(file);

      setBasicInfo((prev) => ({ ...prev, cover_image_url: publicUrl }));
      toast({ title: "Успешно", description: "Обложка загружена" });
    } catch (error: any) {
      toast({ title: "Ошибка загрузки", description: error.message, variant: "destructive" });
    } finally {
      setUploading(false);
    }
  };

  const handleDownloadFormUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: "banner" | "file") => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      const { publicUrl } = await api.media.uploadToPath(file);
      
      if (type === "banner") {
        setDownloadForm((prev) => ({ ...prev, download_form_banner_url: publicUrl }));
        toast({ title: "Успешно", description: "Обложка формы загружена" });
      } else {
        setDownloadForm((prev) => ({ ...prev, download_form_file_url: publicUrl }));
        toast({ title: "Успешно", description: "Файл для скачивания загружен" });
      }
    } catch (error: any) {
      toast({ title: "Ошибка загрузки", description: error.message, variant: "destructive" });
    } finally {
      setUploading(false);
    }
  };

  const saveCourse = async () => {
    if (!selectedCourse) return;

    try {
      setLoading(true);
      const updateData: Partial<Course> = {
        ...basicInfo,
        ...heroSection,
        target_audience: targetAudience,
        lessons,
        selling_points: sellingPoints,
        faq_items: faqItems,
        team_order: teamOrder,
        ...downloadForm,
      };

      await api.courses.update(selectedCourse.id, updateData);
      toast({ title: "Успешно", description: "Курс обновлен" });
      await fetchCourses();
    } catch (error: any) {
      toast({ title: "Ошибка", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  // Вспомогательные функции для работы с массивами
  const addToArray = (setter: React.Dispatch<React.SetStateAction<string[]>>) => {
    setter((prev) => [...prev, ""]);
  };

  const updateArray = (index: number, value: string, setter: React.Dispatch<React.SetStateAction<string[]>>) => {
    setter((prev) => {
      const newArray = [...prev];
      newArray[index] = value;
      return newArray;
    });
  };

  const removeFromArray = (index: number, setter: React.Dispatch<React.SetStateAction<string[]>>) => {
    setter((prev) => prev.filter((_, i) => i !== index));
  };

  // Функции для работы с уроками
  const addLesson = () => {
    setLessons((prev) => [...prev, { title: "", points: [""] }]);
  };

  const updateLesson = (index: number, field: "title", value: string) => {
    setLessons((prev) => {
      const newLessons = [...prev];
      newLessons[index][field] = value;
      return newLessons;
    });
  };

  const addLessonPoint = (lessonIndex: number) => {
    setLessons((prev) => {
      const newLessons = [...prev];
      newLessons[lessonIndex].points.push("");
      return newLessons;
    });
  };

  const updateLessonPoint = (lessonIndex: number, pointIndex: number, value: string) => {
    setLessons((prev) => {
      const newLessons = [...prev];
      newLessons[lessonIndex].points[pointIndex] = value;
      return newLessons;
    });
  };

  const removeLessonPoint = (lessonIndex: number, pointIndex: number) => {
    setLessons((prev) => {
      const newLessons = [...prev];
      newLessons[lessonIndex].points = newLessons[lessonIndex].points.filter((_, i) => i !== pointIndex);
      return newLessons;
    });
  };

  const removeLesson = (index: number) => {
    setLessons((prev) => prev.filter((_, i) => i !== index));
  };

  // Функции для работы с FAQ
  const addFaq = () => {
    setFaqItems((prev) => [...prev, { question: "", answer: "" }]);
  };

  const updateFaq = (index: number, field: "question" | "answer", value: string) => {
    setFaqItems((prev) => {
      const newFaq = [...prev];
      newFaq[index][field] = value;
      return newFaq;
    });
  };

  const removeFaq = (index: number) => {
    setFaqItems((prev) => prev.filter((_, i) => i !== index));
  };

  // Если не выбран курс, показываем список курсов
  if (!selectedCourse) {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Редактор курсов</h2>
        <p className="text-muted-foreground">Выберите курс для редактирования</p>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => (
            <Card
              key={course.id}
              className="cursor-pointer overflow-hidden transition-all hover:shadow-lg"
              onClick={() => loadCourse(course)}
            >
              {course.cover_image_url && (
                <img src={course.cover_image_url} alt={course.title} className="h-40 w-full object-cover" />
              )}
              <div className="p-4">
                <h3 className="font-bold">{course.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{course.description}</p>
                <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                  <span>{course.is_published ? "Опубликован" : "Черновик"}</span>
                  <span>{course.price} ₽</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // Если выбран курс, показываем редактор
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => setSelectedCourse(null)}>
            <ChevronLeft size={16} />
          </Button>
          <h2 className="text-2xl font-bold">{selectedCourse.title}</h2>
        </div>
        <Button onClick={saveCourse} disabled={loading}>
          {loading ? "Сохранение..." : "Сохранить изменения"}
        </Button>
      </div>

      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="basic">Основное</TabsTrigger>
          <TabsTrigger value="hero">Hero</TabsTrigger>
          <TabsTrigger value="program">Программа</TabsTrigger>
          <TabsTrigger value="selling">Преимущества</TabsTrigger>
          <TabsTrigger value="faq">FAQ</TabsTrigger>
          <TabsTrigger value="cases">Кейсы</TabsTrigger>
          <TabsTrigger value="files">Файлы</TabsTrigger>
        </TabsList>

        {/* Основная информация */}
        <TabsContent value="basic" className="space-y-4">
          <Card className="p-6">
            <h3 className="mb-4 text-lg font-semibold">Основная информация</h3>
            
            <div className="space-y-4">
              <div>
                <FormLabel className="mb-2 block">Обложка курса</FormLabel>
                {basicInfo.cover_image_url ? (
                  <div className="space-y-2">
                    <img src={basicInfo.cover_image_url} alt="Cover" className="h-40 w-full rounded-lg object-cover" />
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
                      <p className="text-sm">Загрузить обложку</p>
                    </label>
                  </div>
                )}
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <FormLabel className="mb-2 block">Название курса *</FormLabel>
                  <Input
                    value={basicInfo.title}
                    onChange={(e) => setBasicInfo((prev) => ({ ...prev, title: e.target.value }))}
                    placeholder="Название курса"
                  />
                </div>

                <div>
                  <FormLabel className="mb-2 block">Slug (URL)</FormLabel>
                  <Input
                    value={basicInfo.slug}
                    onChange={(e) => setBasicInfo((prev) => ({ ...prev, slug: e.target.value }))}
                    placeholder="course-name"
                  />
                </div>
              </div>

              <div>
                <FormLabel className="mb-2 block">Краткое описание</FormLabel>
                <Textarea
                  value={basicInfo.description}
                  onChange={(e) => setBasicInfo((prev) => ({ ...prev, description: e.target.value }))}
                  placeholder="Краткое описание курса"
                  rows={3}
                />
              </div>

              <div>
                <FormLabel className="mb-2 block">Преимущества (каждое с новой строки)</FormLabel>
                <Textarea
                  value={basicInfo.benefits}
                  onChange={(e) => setBasicInfo((prev) => ({ ...prev, benefits: e.target.value }))}
                  placeholder="Преимущество 1&#10;Преимущество 2"
                  rows={4}
                />
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <FormLabel className="mb-2 block">Цена (₽)</FormLabel>
                  <Input
                    type="number"
                    value={basicInfo.price}
                    onChange={(e) => setBasicInfo((prev) => ({ ...prev, price: Number(e.target.value) }))}
                  />
                </div>

                <div>
                  <FormLabel className="mb-2 block">Уровень</FormLabel>
                  <Input
                    value={basicInfo.level}
                    onChange={(e) => setBasicInfo((prev) => ({ ...prev, level: e.target.value }))}
                    placeholder="Начинающий"
                  />
                </div>

                <div>
                  <FormLabel className="mb-2 block">Порядок отображения</FormLabel>
                  <Input
                    type="number"
                    value={basicInfo.display_order}
                    onChange={(e) => setBasicInfo((prev) => ({ ...prev, display_order: Number(e.target.value) }))}
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="is_published"
                  checked={basicInfo.is_published}
                  onChange={(e) => setBasicInfo((prev) => ({ ...prev, is_published: e.target.checked }))}
                  className="h-4 w-4"
                />
                <FormLabel htmlFor="is_published">Опубликован на сайте</FormLabel>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* Hero секция */}
        <TabsContent value="hero" className="space-y-4">
          <Card className="p-6">
            <h3 className="mb-4 text-lg font-semibold">Hero секция</h3>
            
            <div className="space-y-4">
              <div>
                <FormLabel className="mb-2 block">Заголовок Hero</FormLabel>
                <Input
                  value={heroSection.hero_title}
                  onChange={(e) => setHeroSection((prev) => ({ ...prev, hero_title: e.target.value }))}
                  placeholder="Главный заголовок"
                />
              </div>

              <div>
                <FormLabel className="mb-2 block">Описание Hero</FormLabel>
                <Textarea
                  value={heroSection.hero_description}
                  onChange={(e) => setHeroSection((prev) => ({ ...prev, hero_description: e.target.value }))}
                  placeholder="Описание курса в hero-секции"
                  rows={3}
                />
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <FormLabel>Ключевые моменты</FormLabel>
                  <Button size="sm" onClick={() => setHeroSection((prev) => ({ ...prev, hero_highlights: [...prev.hero_highlights, ""] }))}>
                    <Plus size={16} /> Добавить
                  </Button>
                </div>
                {heroSection.hero_highlights.map((highlight, index) => (
                  <div key={index} className="mb-2 flex gap-2">
                    <Input
                      value={highlight}
                      onChange={(e) => {
                        const newHighlights = [...heroSection.hero_highlights];
                        newHighlights[index] = e.target.value;
                        setHeroSection((prev) => ({ ...prev, hero_highlights: newHighlights }));
                      }}
                      placeholder="Ключевой момент"
                    />
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => {
                        const newHighlights = heroSection.hero_highlights.filter((_, i) => i !== index);
                        setHeroSection((prev) => ({ ...prev, hero_highlights: newHighlights }));
                      }}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                ))}
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <FormLabel>Целевая аудитория</FormLabel>
                  <Button size="sm" onClick={() => addToArray(setTargetAudience)}>
                    <Plus size={16} /> Добавить
                  </Button>
                </div>
                {targetAudience.map((item, index) => (
                  <div key={index} className="mb-2 flex gap-2">
                    <Textarea
                      value={item}
                      onChange={(e) => updateArray(index, e.target.value, setTargetAudience)}
                      placeholder="Описание целевой аудитории"
                      rows={2}
                    />
                    <Button size="sm" variant="destructive" onClick={() => removeFromArray(index, setTargetAudience)}>
                      <Trash2 size={16} />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* Программа обучения */}
        <TabsContent value="program" className="space-y-4">
          <Card className="p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold">Программа обучения</h3>
              <Button onClick={addLesson}>
                <Plus size={16} /> Добавить урок
              </Button>
            </div>

            <div className="space-y-6">
              {lessons.map((lesson, lessonIndex) => (
                <Card key={lessonIndex} className="border-2 p-4">
                  <div className="mb-4 flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <FormLabel className="mb-2 block">Название урока</FormLabel>
                      <Input
                        value={lesson.title}
                        onChange={(e) => updateLesson(lessonIndex, "title", e.target.value)}
                        placeholder="Занятие 1. Название"
                      />
                    </div>
                    <Button size="sm" variant="destructive" onClick={() => removeLesson(lessonIndex)}>
                      <Trash2 size={16} />
                    </Button>
                  </div>

                  <div>
                    <div className="mb-2 flex items-center justify-between">
                      <FormLabel>Пункты урока</FormLabel>
                      <Button size="sm" variant="outline" onClick={() => addLessonPoint(lessonIndex)}>
                        <Plus size={14} /> Добавить пункт
                      </Button>
                    </div>
                    {lesson.points.map((point, pointIndex) => (
                      <div key={pointIndex} className="mb-2 flex gap-2">
                        <Textarea
                          value={point}
                          onChange={(e) => updateLessonPoint(lessonIndex, pointIndex, e.target.value)}
                          placeholder="Описание пункта"
                          rows={2}
                        />
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => removeLessonPoint(lessonIndex, pointIndex)}
                        >
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    ))}
                  </div>
                </Card>
              ))}
            </div>
          </Card>
        </TabsContent>

        {/* Ключевые преимущества */}
        <TabsContent value="selling" className="space-y-4">
          <Card className="p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold">Ключевые преимущества курса</h3>
              <Button size="sm" onClick={() => addToArray(setSellingPoints)}>
                <Plus size={16} /> Добавить
              </Button>
            </div>

            <div className="space-y-2">
              {sellingPoints.map((point, index) => (
                <div key={index} className="flex gap-2">
                  <Textarea
                    value={point}
                    onChange={(e) => updateArray(index, e.target.value, setSellingPoints)}
                    placeholder="Преимущество курса"
                    rows={2}
                  />
                  <Button size="sm" variant="destructive" onClick={() => removeFromArray(index, setSellingPoints)}>
                    <Trash2 size={16} />
                  </Button>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        {/* FAQ */}
        <TabsContent value="faq" className="space-y-4">
          <Card className="p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold">Часто задаваемые вопросы</h3>
              <Button onClick={addFaq}>
                <Plus size={16} /> Добавить вопрос
              </Button>
            </div>

            <div className="space-y-4">
              {faqItems.map((faq, index) => (
                <Card key={index} className="border-2 p-4">
                  <div className="mb-4 flex items-start justify-between gap-2">
                    <div className="flex-1 space-y-3">
                      <div>
                        <FormLabel className="mb-2 block">Вопрос</FormLabel>
                        <Input
                          value={faq.question}
                          onChange={(e) => updateFaq(index, "question", e.target.value)}
                          placeholder="Вопрос"
                        />
                      </div>
                      <div>
                        <FormLabel className="mb-2 block">Ответ</FormLabel>
                        <Textarea
                          value={faq.answer}
                          onChange={(e) => updateFaq(index, "answer", e.target.value)}
                          placeholder="Ответ на вопрос"
                          rows={3}
                        />
                      </div>
                    </div>
                    <Button size="sm" variant="destructive" onClick={() => removeFaq(index)}>
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </Card>
        </TabsContent>

        {/* Кейсы студентов */}
        <TabsContent value="cases" className="space-y-4">
          <Card className="p-6">
            <h3 className="mb-4 text-lg font-semibold">Кейсы студентов</h3>
            <p className="mb-4 text-sm text-muted-foreground">
              Для управления кейсами используйте вкладку "Кейсы" в основном меню админ-панели
            </p>
            
            <div className="space-y-2">
              {studentCases.length === 0 ? (
                <p className="text-sm text-muted-foreground">Нет кейсов для этого курса</p>
              ) : (
                studentCases.map((caseItem) => (
                  <Card key={caseItem.id} className="p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-semibold">{caseItem.student_name}</h4>
                        {caseItem.student_role && (
                          <p className="text-sm text-muted-foreground">{caseItem.student_role}</p>
                        )}
                        <p className="mt-2 text-sm line-clamp-2">{caseItem.case_text}</p>
                      </div>
                      <span className={`text-xs ${caseItem.is_published ? "text-green-600" : "text-gray-400"}`}>
                        {caseItem.is_published ? "Опубликован" : "Черновик"}
                      </span>
                    </div>
                  </Card>
                ))
              )}
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="mb-4 text-lg font-semibold">Порядок отображения команды</h3>
            <p className="mb-4 text-sm text-muted-foreground">
              Укажите фамилии преподавателей в нужном порядке (по одной на каждой строке)
            </p>
            <Textarea
              value={teamOrder.join("\n")}
              onChange={(e) => setTeamOrder(e.target.value.split("\n").filter(Boolean))}
              placeholder="артин&#10;абукаев&#10;сизов"
              rows={6}
            />
          </Card>
        </TabsContent>

        {/* Файлы для скачивания */}
        <TabsContent value="files" className="space-y-4">
          <Card className="p-6">
            <h3 className="mb-4 text-lg font-semibold">Форма скачивания материалов</h3>
            
            <div className="space-y-4">
              <div>
                <FormLabel className="mb-2 block">Заголовок формы</FormLabel>
                <Input
                  value={downloadForm.download_form_title}
                  onChange={(e) => setDownloadForm((prev) => ({ ...prev, download_form_title: e.target.value }))}
                  placeholder="Название материала"
                />
              </div>

              <div>
                <FormLabel className="mb-2 block">Описание формы</FormLabel>
                <Textarea
                  value={downloadForm.download_form_description}
                  onChange={(e) => setDownloadForm((prev) => ({ ...prev, download_form_description: e.target.value }))}
                  placeholder="Описание материала"
                  rows={3}
                />
              </div>

              <div>
                <FormLabel className="mb-2 block">Обложка формы</FormLabel>
                {downloadForm.download_form_banner_url ? (
                  <div className="space-y-2">
                    <img
                      src={downloadForm.download_form_banner_url}
                      alt="Banner"
                      className="h-40 w-full rounded-lg object-cover"
                    />
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleDownloadFormUpload(e, "banner")}
                      disabled={uploading}
                    />
                  </div>
                ) : (
                  <div className="cursor-pointer rounded-lg border-2 border-dashed p-6 text-center hover:bg-gray-50">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleDownloadFormUpload(e, "banner")}
                      disabled={uploading}
                      className="hidden"
                      id="banner-input"
                    />
                    <label htmlFor="banner-input" className="block cursor-pointer">
                      <Upload className="mx-auto mb-2 text-gray-400" size={24} />
                      <p className="text-sm">Загрузить обложку</p>
                    </label>
                  </div>
                )}
              </div>

              <div>
                <FormLabel className="mb-2 block">Файл для скачивания</FormLabel>
                {downloadForm.download_form_file_url ? (
                  <div className="space-y-2">
                    <a
                      href={downloadForm.download_form_file_url}
                      target="_blank"
                      rel="noreferrer"
                      className="block break-all text-sm text-primary underline"
                    >
                      {downloadForm.download_form_file_url}
                    </a>
                    <Input
                      type="file"
                      accept=".pdf,.doc,.docx,.rtf,.txt,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                      onChange={(e) => handleDownloadFormUpload(e, "file")}
                      disabled={uploading}
                    />
                  </div>
                ) : (
                  <div className="cursor-pointer rounded-lg border-2 border-dashed p-6 text-center hover:bg-gray-50">
                    <Input
                      type="file"
                      accept=".pdf,.doc,.docx,.rtf,.txt,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                      onChange={(e) => handleDownloadFormUpload(e, "file")}
                      disabled={uploading}
                      className="hidden"
                      id="file-input"
                    />
                    <label htmlFor="file-input" className="block cursor-pointer">
                      <Upload className="mx-auto mb-2 text-gray-400" size={24} />
                      <p className="text-sm">Загрузить файл (PDF, DOC, DOCX)</p>
                    </label>
                  </div>
                )}
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
