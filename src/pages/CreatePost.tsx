import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import Header from '@/components/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import Icon from '@/components/ui/icon';

const CreatePost = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    if (!user || (user.role !== 'writer' && user.role !== 'admin')) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    toast({
      title: 'Пост создан',
      description: 'Ваша публикация успешно добавлена',
    });
    
    navigate('/');
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-muted/30">
      <Header />
      
      <main className="container py-8">
        <div className="max-w-3xl mx-auto animate-fade-in">
          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-2">Создание новости</h1>
            <p className="text-muted-foreground">Добавьте новую публикацию на портал</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Новая публикация</CardTitle>
              <CardDescription>Заполните форму для создания новости</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Заголовок новости</Label>
                  <Input
                    id="title"
                    placeholder="Введите заголовок..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Категория</Label>
                  <Select value={category} onValueChange={setCategory} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите категорию" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Наука">Наука</SelectItem>
                      <SelectItem value="Достижения">Достижения</SelectItem>
                      <SelectItem value="Учеба">Учеба</SelectItem>
                      <SelectItem value="События">События</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="imageUrl">URL изображения (необязательно)</Label>
                  <Input
                    id="imageUrl"
                    type="url"
                    placeholder="https://example.com/image.jpg"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                  />
                  {imageUrl && (
                    <div className="mt-2 rounded-lg overflow-hidden border">
                      <img 
                        src={imageUrl} 
                        alt="Предпросмотр"
                        className="w-full h-48 object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="content">Содержание новости</Label>
                  <Textarea
                    id="content"
                    placeholder="Введите текст новости..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    rows={12}
                    required
                    className="resize-none"
                  />
                </div>

                <div className="flex gap-2">
                  <Button type="submit" className="flex-1">
                    <Icon name="Send" size={16} className="mr-2" />
                    Опубликовать
                  </Button>
                  <Button type="button" variant="outline" onClick={() => navigate(-1)}>
                    Отмена
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default CreatePost;