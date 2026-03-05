import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UsersTable } from './UsersTable';
import { MediaUploader } from './MediaUploader';
import { CoursesManager } from './CoursesManager';
import { ReviewsManager } from './ReviewsManager';
import { SiteSettingsManager } from './SiteSettingsManager';
import { TeachersManager } from './TeachersManager';
import { LeadsManager } from './LeadsManager';
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
    // РџСЂРѕСЃС‚Р°СЏ Р·Р°С‰РёС‚Р° - РёР·РјРµРЅРё РїР°СЂРѕР»СЊ РЅР° СЃРІРѕР№!
    const adminPassword = '279286';
    
    if (password === adminPassword) {
      localStorage.setItem('admin_authenticated', 'true');
      setIsAuthenticated(true);
      setPassword('');
      setError('');
    } else {
      setError('РќРµРІРµСЂРЅС‹Р№ РїР°СЂРѕР»СЊ');
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
            <DialogTitle>Р’С…РѕРґ РІ РђРґРјРёРЅ РџР°РЅРµР»СЊ</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              type="password"
              placeholder="Р’РІРµРґРё РїР°СЂРѕР»СЊ"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError('');
              }}
              onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
            />
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <Button onClick={handleLogin} className="w-full">
              Р’РѕР№С‚Рё
            </Button>
            <p className="text-xs text-gray-500 text-center">
              РџРѕ СѓРјРѕР»С‡Р°РЅРёСЋ РїР°СЂРѕР»СЊ: 123456 (РёР·РјРµРЅРё РµРіРѕ РІ РєРѕРјРїРѕРЅРµРЅС‚Рµ!)
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
                <h1 className="text-3xl font-bold text-gray-900">РђРґРјРёРЅ РџР°РЅРµР»СЊ</h1>
                <p className="text-gray-500">Bankruptcy Academy</p>
              </div>
              <Button variant="outline" onClick={handleLogout}>
                <LogOut className="mr-2" size={18} />
                Р’С‹С…РѕРґ
              </Button>
            </div>
          </div>

          {/* Main Content */}
          <div className="max-w-7xl mx-auto px-4 py-8">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-7 mb-8">
                <TabsTrigger value="dashboard">рџ“Љ РћР±Р·РѕСЂ</TabsTrigger>
                <TabsTrigger value="courses">рџ“љ РљСѓСЂСЃС‹</TabsTrigger>
                <TabsTrigger value="teachers">рџ‘ЁвЂЌрџЏ« РџСЂРµРїРѕРґР°РІР°С‚РµР»Рё</TabsTrigger>
                <TabsTrigger value="media">рџ–јпёЏ РњРµРґРёР°</TabsTrigger>`r`n                <TabsTrigger value="leads">📥 Заявки</TabsTrigger>
                <TabsTrigger value="feedback">в­ђ РћС‚Р·С‹РІС‹</TabsTrigger>
                <TabsTrigger value="settings">вљ™пёЏ РќР°СЃС‚СЂРѕР№РєРё</TabsTrigger>
              </TabsList>

              {/* Dashboard Tab */}
              <TabsContent value="dashboard" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="bg-white p-6 rounded-lg shadow">
                    <p className="text-gray-500 mb-2">Р’СЃРµРіРѕ РїРѕР»СЊР·РѕРІР°С‚РµР»РµР№</p>
                    <p className="text-3xl font-bold">-</p>
                  </div>
                  <div className="bg-white p-6 rounded-lg shadow">
                    <p className="text-gray-500 mb-2">РђРєС‚РёРІРЅС‹С… РєСѓСЂСЃРѕРІ</p>
                    <p className="text-3xl font-bold">-</p>
                  </div>
                  <div className="bg-white p-6 rounded-lg shadow">
                    <p className="text-gray-500 mb-2">Р—Р°РіСЂСѓР¶РµРЅРЅС‹С… С„Р°Р№Р»РѕРІ</p>
                    <p className="text-3xl font-bold">-</p>
                  </div>
                  <div className="bg-white p-6 rounded-lg shadow">
                    <p className="text-gray-500 mb-2">РќРѕРІС‹С… РѕС‚Р·С‹РІРѕРІ</p>
                    <p className="text-3xl font-bold">-</p>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow">
                  <h2 className="text-2xl font-bold mb-4">Р‘С‹СЃС‚СЂС‹Рµ РґРµР№СЃС‚РІРёСЏ</h2>
                  <div className="space-y-2">
                    <Button variant="outline" className="w-full justify-start">
                      вћ• Р”РѕР±Р°РІРёС‚СЊ РЅРѕРІС‹Р№ РєСѓСЂСЃ
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      рџ“ё Р—Р°РіСЂСѓР·РёС‚СЊ РјРµРґРёР° С„Р°Р№Р»
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      рџ‘Ґ Р”РѕР±Р°РІРёС‚СЊ РїРѕР»СЊР·РѕРІР°С‚РµР»СЏ
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

                            {/* Leads Tab */}`r`n              <TabsContent value="leads" className="bg-white p-6 rounded-lg shadow">`r`n                <LeadsManager />`r`n              </TabsContent>`r`n`r`n{/* Settings Tab */}
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

