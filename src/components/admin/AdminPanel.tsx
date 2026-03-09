import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UsersTable } from './UsersTable';
import { CourseDetailEditor } from './CourseDetailEditor';
import { ReviewsManager } from './ReviewsManager';
import { SiteSettingsManager } from './SiteSettingsManager';
import { TeachersManager } from './TeachersManager';
import { LeadsManager } from './LeadsManager';
import { LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

export function AdminPanel() {
  const [activeTab, setActiveTab] = useState('courses');
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('admin_authenticated') === 'true';
  });
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = () => {
    const adminPassword = import.meta.env.VITE_ADMIN_PASSWORD || '279286';

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
            {error && <p className="text-sm text-red-500">{error}</p>}
            <Button onClick={handleLogin} className="w-full">
              Войти
            </Button>
            <p className="text-center text-xs text-gray-500">Пароль задается в компоненте `AdminPanel.tsx`</p>
          </div>
        </DialogContent>
      </Dialog>

      {isAuthenticated && (
        <>
          <div className="border-b bg-white shadow-sm">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Админ Панель</h1>
                <p className="text-gray-500">Академия Банкротства</p>
              </div>
              <Button variant="outline" onClick={handleLogout}>
                <LogOut className="mr-2" size={18} />
                Выход
              </Button>
            </div>
          </div>

          <div className="mx-auto max-w-7xl px-4 py-8">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="mb-8 grid w-full grid-cols-5">
                <TabsTrigger value="courses">Курсы</TabsTrigger>
                <TabsTrigger value="teachers">Преподаватели</TabsTrigger>
                <TabsTrigger value="leads">Заявки</TabsTrigger>
                <TabsTrigger value="feedback">Отзывы</TabsTrigger>
                <TabsTrigger value="settings">Настройки</TabsTrigger>
              </TabsList>

              <TabsContent value="courses" className="rounded-lg bg-white p-6 shadow">
                <CourseDetailEditor />
              </TabsContent>

              <TabsContent value="teachers" className="rounded-lg bg-white p-6 shadow">
                <TeachersManager />
              </TabsContent>

              <TabsContent value="leads" className="rounded-lg bg-white p-6 shadow">
                <LeadsManager />
              </TabsContent>

              <TabsContent value="feedback" className="rounded-lg bg-white p-6 shadow">
                <ReviewsManager />
              </TabsContent>

              <TabsContent value="settings" className="rounded-lg bg-white p-6 shadow">
                <SiteSettingsManager />
              </TabsContent>
            </Tabs>
          </div>
        </>
      )}
    </div>
  );
}
