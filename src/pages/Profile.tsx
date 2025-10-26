import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import Header from '@/components/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import Icon from '@/components/ui/icon';

const Profile = () => {
  const { user, updateUser, logout } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    setUsername(user.username);
    setEmail(user.email);
  }, [user, navigate]);

  if (!user) return null;

  const handleSave = () => {
    updateUser({ username, email });
    setIsEditing(false);
    toast({
      title: 'Успешно',
      description: 'Данные обновлены',
    });
  };

  const getRoleBadge = (role: string) => {
    const roles = {
      admin: { label: 'Администратор', variant: 'destructive' as const },
      writer: { label: 'Писатель', variant: 'default' as const },
      user: { label: 'Пользователь', variant: 'secondary' as const },
    };
    return roles[role as keyof typeof roles] || roles.user;
  };

  const roleBadge = getRoleBadge(user.role);

  return (
    <div className="min-h-screen bg-muted/30">
      <Header />
      
      <main className="container py-8">
        <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
          <div>
            <h1 className="text-3xl font-bold mb-2">Личный кабинет</h1>
            <p className="text-muted-foreground">Управление профилем и настройками</p>
          </div>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Информация профиля</CardTitle>
                  <CardDescription>Ваши личные данные</CardDescription>
                </div>
                <Badge variant={roleBadge.variant}>{roleBadge.label}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Имя пользователя</Label>
                <Input
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={!isEditing}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={!isEditing}
                />
              </div>

              <div className="flex gap-2">
                {isEditing ? (
                  <>
                    <Button onClick={handleSave}>
                      <Icon name="Save" size={16} className="mr-2" />
                      Сохранить
                    </Button>
                    <Button variant="outline" onClick={() => setIsEditing(false)}>
                      Отмена
                    </Button>
                  </>
                ) : (
                  <Button onClick={() => setIsEditing(true)}>
                    <Icon name="Edit" size={16} className="mr-2" />
                    Редактировать
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {(user.role === 'writer' || user.role === 'admin') && (
            <Card>
              <CardHeader>
                <CardTitle>Управление контентом</CardTitle>
                <CardDescription>Инструменты для создания публикаций</CardDescription>
              </CardHeader>
              <CardContent>
                <Link to="/create-post">
                  <Button className="w-full">
                    <Icon name="Plus" size={16} className="mr-2" />
                    Создать новый пост
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}

          {user.role === 'admin' && (
            <Card>
              <CardHeader>
                <CardTitle>Администрирование</CardTitle>
                <CardDescription>Управление пользователями и правами</CardDescription>
              </CardHeader>
              <CardContent>
                <Link to="/grant-permissions">
                  <Button className="w-full" variant="destructive">
                    <Icon name="Shield" size={16} className="mr-2" />
                    Выдать права пользователю
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardContent className="pt-6">
              <Button variant="outline" className="w-full" onClick={logout}>
                <Icon name="LogOut" size={16} className="mr-2" />
                Выйти из аккаунта
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Profile;
