import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import Header from '@/components/Header';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import Icon from '@/components/ui/icon';

interface Comment {
  id: string;
  author: string;
  content: string;
  date: string;
}

const Article = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState<Comment[]>([
    {
      id: '1',
      author: 'Петров А.В.',
      content: 'Отличная новость! Очень рад за наш институт.',
      date: '2025-10-26T10:30:00',
    },
    {
      id: '2',
      author: 'Сидорова М.И.',
      content: 'Когда можно будет посетить новую лабораторию?',
      date: '2025-10-26T11:15:00',
    },
  ]);

  const article = {
    id: '1',
    title: 'ИКИТ открывает новую лабораторию искусственного интеллекта',
    content: `Институт космических и информационных технологий объявляет о запуске современной лаборатории ИИ, оснащенной высокопроизводительными вычислительными системами для исследований в области машинного обучения и нейронных сетей.

Новая лаборатория оборудована 20 рабочими станциями с мощными графическими ускорителями NVIDIA A100, серверным кластером для обучения крупных языковых моделей и специализированным программным обеспечением для разработки ИИ-приложений.

В рамках открытия лаборатории запланированы:
• Мастер-классы по глубокому обучению от ведущих специалистов
• Хакатон по компьютерному зрению
• Серия лекций о применении ИИ в космической отрасли

Студенты и аспиранты ИКИТ получат доступ к современному оборудованию для выполнения курсовых работ, дипломных проектов и научных исследований. Планируется также сотрудничество с крупными IT-компаниями для реализации совместных проектов.

Официальное открытие лаборатории состоится 15 ноября 2025 года. Приглашаются все желающие!`,
    author: 'Иванов И.И.',
    date: '2025-10-26',
    category: 'Наука',
    image: 'https://cdn.poehali.dev/projects/00fc5f79-eeb0-4d95-aead-d9a89c173069/files/dc15984e-2967-4028-818c-367118bf6f1d.jpg',
  };

  const handleAddComment = () => {
    if (!user) {
      toast({
        title: 'Требуется авторизация',
        description: 'Войдите в систему для добавления комментариев',
        variant: 'destructive',
      });
      navigate('/login');
      return;
    }

    if (!newComment.trim()) return;

    const comment: Comment = {
      id: Date.now().toString(),
      author: user.username,
      content: newComment,
      date: new Date().toISOString(),
    };

    setComments([...comments, comment]);
    setNewComment('');
    toast({
      title: 'Комментарий добавлен',
      description: 'Ваш комментарий успешно опубликован',
    });
  };

  const handleHidePost = () => {
    toast({
      title: 'Пост скрыт',
      description: 'Публикация больше не отображается на портале',
    });
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <Header />
      
      <main className="container py-8">
        <article className="max-w-4xl mx-auto animate-fade-in">
          <Card className="overflow-hidden">
            {article.image && (
              <div className="w-full h-96 overflow-hidden">
                <img 
                  src={article.image} 
                  alt={article.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <CardHeader className="space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <Badge className="mb-3">{article.category}</Badge>
                  <h1 className="text-4xl font-bold mb-4 leading-tight">
                    {article.title}
                  </h1>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Icon name="User" size={14} />
                      <span>{article.author}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Icon name="Calendar" size={14} />
                      <span>{new Date(article.date).toLocaleDateString('ru-RU')}</span>
                    </div>
                  </div>
                </div>
                
                {user?.role === 'admin' && (
                  <Button variant="destructive" size="sm" onClick={handleHidePost}>
                    <Icon name="EyeOff" size={16} className="mr-2" />
                    Скрыть пост
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="prose prose-lg max-w-none">
                {article.content.split('\n\n').map((paragraph, index) => (
                  <p key={index} className="mb-4 leading-relaxed text-foreground">
                    {paragraph}
                  </p>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="mt-8">
            <CardHeader>
              <h2 className="text-2xl font-bold">Комментарии ({comments.length})</h2>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                {comments.map((comment) => (
                  <div key={comment.id} className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Icon name="User" size={16} className="text-muted-foreground" />
                      <span className="font-semibold">{comment.author}</span>
                      <span className="text-sm text-muted-foreground">
                        {new Date(comment.date).toLocaleString('ru-RU')}
                      </span>
                    </div>
                    <p className="text-foreground pl-6">{comment.content}</p>
                    <Separator className="mt-4" />
                  </div>
                ))}
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold">Добавить комментарий</h3>
                <Textarea
                  placeholder={user ? "Напишите ваш комментарий..." : "Войдите, чтобы оставить комментарий"}
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  rows={4}
                  disabled={!user}
                />
                <Button onClick={handleAddComment} disabled={!user || !newComment.trim()}>
                  <Icon name="Send" size={16} className="mr-2" />
                  Отправить
                </Button>
              </div>
            </CardContent>
          </Card>
        </article>
      </main>
    </div>
  );
};

export default Article;