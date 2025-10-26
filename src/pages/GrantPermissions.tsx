import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, UserRole } from '@/hooks/useAuth';
import Header from '@/components/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import Icon from '@/components/ui/icon';

const GrantPermissions = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [userEmail, setUserEmail] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole>('user');

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/');
    }
  }, [user, navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    toast({
      title: 'Права обновлены',
      description: `Пользователю ${userEmail} назначена роль: ${getRoleLabel(selectedRole)}`,
    });
    
    setUserEmail('');
    setSelectedRole('user');
  };

  const getRoleLabel = (role: UserRole) => {
    const labels = {
      admin: 'Администратор',
      writer: 'Писатель',
      user: 'Пользователь',
    };
    return labels[role];
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-muted/30">
      <Header />
      
      <main className="container py-8">
        <div className="max-w-2xl mx-auto animate-fade-in">
          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-2">Управление правами</h1>
            <p className="text-muted-foreground">Назначение ролей пользователям системы</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Выдача прав доступа</CardTitle>
              <CardDescription>Укажите email пользователя и выберите роль</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="userEmail">Email пользователя</Label>
                  <Input
                    id="userEmail"
                    type="email"
                    placeholder="user@ikit.ru"
                    value={userEmail}
                    onChange={(e) => setUserEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="role">Роль</Label>
                  <Select value={selectedRole} onValueChange={(value) => setSelectedRole(value as UserRole)} required>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="user">Пользователь</SelectItem>
                      <SelectItem value="writer">Писатель</SelectItem>
                      <SelectItem value="admin">Администратор</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-muted-foreground">
                    {selectedRole === 'user' && '• Может читать и комментировать новости'}
                    {selectedRole === 'writer' && '• Может создавать и публиковать новости'}
                    {selectedRole === 'admin' && '• Полный доступ к управлению системой'}
                  </p>
                </div>

                <div className="flex gap-2">
                  <Button type="submit" className="flex-1">
                    <Icon name="Shield" size={16} className="mr-2" />
                    Назначить права
                  </Button>
                  <Button type="button" variant="outline" onClick={() => navigate(-1)}>
                    Отмена
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Описание ролей</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-3">
                <Icon name="User" size={20} className="text-muted-foreground mt-0.5" />
                <div>
                  <p className="font-semibold">Пользователь</p>
                  <p className="text-sm text-muted-foreground">Базовые права: чтение новостей и добавление комментариев</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Icon name="PenTool" size={20} className="text-muted-foreground mt-0.5" />
                <div>
                  <p className="font-semibold">Писатель</p>
                  <p className="text-sm text-muted-foreground">Может создавать и публиковать новости на портале</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Icon name="Shield" size={20} className="text-destructive mt-0.5" />
                <div>
                  <p className="font-semibold">Администратор</p>
                  <p className="text-sm text-muted-foreground">Полный контроль: управление пользователями, модерация, скрытие постов</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default GrantPermissions;
