import { useState, useEffect } from 'react';
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
import { api, Post } from '@/lib/api';

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
  
  const [post, setPost] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState<Comment[]>([]);

  useEffect(() => {
    const loadPost = async () => {
      if (!id) return;
      
      try {
        const data = await api.posts.getById(Number(id));
        setPost(data);
      } catch (error) {
        toast({
          title: 'Ошибка',
          description: 'Не удалось загрузить новость',
          variant: 'destructive',
        });
        navigate('/');
      } finally {
        setIsLoading(false);
      }
    };

    loadPost();
  }, [id, navigate, toast]);

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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-muted/30">
        <Header />
        <main className="container py-8">
          <div className="text-center">
            <p className="text-muted-foreground">Загрузка...</p>
          </div>
        </main>
      </div>
    );
  }

  if (!post) {
    return null;
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <Header />
      
      <main className="container py-8">
        <article className="max-w-4xl mx-auto animate-fade-in">
          <Card className="overflow-hidden">
            {post.image_url && (
              <div className="w-full h-96 overflow-hidden">
                <img 
                  src={post.image_url} 
                  alt={post.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <CardHeader className="space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <Badge className="mb-3">{post.category}</Badge>
                  <h1 className="text-4xl font-bold mb-4 leading-tight">
                    {post.title}
                  </h1>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Icon name="User" size={14} />
                      <span>{post.author_name || 'Аноним'}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Icon name="Calendar" size={14} />
                      <span>{new Date(post.created_at).toLocaleDateString('ru-RU')}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Icon name="Eye" size={14} />
                      <span>{post.views}</span>
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
                {post.content.split('\n\n').map((paragraph, index) => (
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