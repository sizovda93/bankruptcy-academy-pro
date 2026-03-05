import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UsersTable } from './UsersTable';
import { MediaUploader } from './MediaUploader';
import { CoursesManager } from './CoursesManager';
import { ReviewsManager } from './ReviewsManager';
import { SiteSettingsManager } from './SiteSettingsManager';
import { TeachersManager } from './TeachersManager';
import { LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

export function AdminPanel() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('admin_authenticated') === 'true';
  });
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = () => {
    // Простая защита - измени пароль на свой!
    const adminPassword = '279286';
    
    if (password === adminPassword) {
      localStorage.setItem('admin_authenticated', 'true');
      setIsAuthenticated(true);
      setPassword('');
      setError('');
    } else {
      setError('Неверный пароль');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_authenticated');
    setIsAuthenticated(false);
    setPassword('');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Login Dialog */}
      <Dialog open={!isAuthenticated} onOpenChange={() => {}}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Вход в Админ Панель</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              type="password"
              placeholder="Введи пароль"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError('');
              }}
              onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
            />
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <Button onClick={handleLogin} className="w-full">
              Войти
            </Button>
            <p className="text-xs text-gray-500 text-center">
              По умолчанию пароль: 123456 (измени его в компоненте!)
            </p>
          </div>
        </DialogContent>
      </Dialog>

      {isAuthenticated && (
        <>
          {/* Header */}
          <div className="bg-white border-b shadow-sm">
            <div className="max-w-7xl mx-auto px-4 py-6 flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Админ Панель</h1>
                <p className="text-gray-500">Bankruptcy Academy</p>
              </div>
              <Button variant="outline" onClick={handleLogout}>
                <LogOut className="mr-2" size={18} />
                Выход
              </Button>
            </div>
          </div>

          {/* Main Content */}
          <div className="max-w-7xl mx-auto px-4 py-8">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-6 mb-8">
                <TabsTrigger value="dashboard">📊 Обзор</TabsTrigger>
                <TabsTrigger value="courses">📚 Курсы</TabsTrigger>
                <TabsTrigger value="teachers">👨‍🏫 Преподаватели</TabsTrigger>
                <TabsTrigger value="media">🖼️ Медиа</TabsTrigger>
                <TabsTrigger value="feedback">⭐ Отзывы</TabsTrigger>
                <TabsTrigger value="settings">⚙️ Настройки</TabsTrigger>
              </TabsList>

              {/* Dashboard Tab */}
              <TabsContent value="dashboard" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="bg-white p-6 rounded-lg shadow">
                    <p className="text-gray-500 mb-2">Всего пользователей</p>
                    <p className="text-3xl font-bold">-</p>
                  </div>
                  <div className="bg-white p-6 rounded-lg shadow">
                    <p className="text-gray-500 mb-2">Активных курсов</p>
                    <p className="text-3xl font-bold">-</p>
                  </div>
                  <div className="bg-white p-6 rounded-lg shadow">
                    <p className="text-gray-500 mb-2">Загруженных файлов</p>
                    <p className="text-3xl font-bold">-</p>
                  </div>
                  <div className="bg-white p-6 rounded-lg shadow">
                    <p className="text-gray-500 mb-2">Новых отзывов</p>
                    <p className="text-3xl font-bold">-</p>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow">
                  <h2 className="text-2xl font-bold mb-4">Быстрые действия</h2>
                  <div className="space-y-2">
                    <Button variant="outline" className="w-full justify-start">
                      ➕ Добавить новый курс
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      📸 Загрузить медиа файл
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      👥 Добавить пользователя
                    </Button>
                  </div>
                </div>

                {/* Users Preview */}
                <div className="bg-white p-6 rounded-lg shadow">
                  <UsersTable />
                </div>
              </TabsContent>

              {/* Courses Tab */}
              <TabsContent value="courses" className="bg-white p-6 rounded-lg shadow">
                <CoursesManager />
              </TabsContent>

              {/* Teachers Tab */}
              <TabsContent value="teachers" className="bg-white p-6 rounded-lg shadow">
                <TeachersManager />
              </TabsContent>

              {/* Media Tab */}
              <TabsContent value="media" className="bg-white p-6 rounded-lg shadow">
                <MediaUploader />
              </TabsContent>

              {/* Reviews Tab */}
              <TabsContent value="feedback" className="bg-white p-6 rounded-lg shadow">
                <ReviewsManager />
              </TabsContent>

              {/* Settings Tab */}
              <TabsContent value="settings" className="bg-white p-6 rounded-lg shadow">
                <SiteSettingsManager />
              </TabsContent>
            </Tabs>
          </div>
        </>
      )}
    </div>
  );
}
