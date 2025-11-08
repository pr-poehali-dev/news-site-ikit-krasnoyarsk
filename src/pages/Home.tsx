import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { api, Post } from '@/lib/api';

const mockNews: NewsArticle[] = [
  {
    id: '1',
    title: 'ИКИТ открывает новую лабораторию искусственного интеллекта',
    content: 'Институт космических и информационных технологий объявляет о запуске современной лаборатории ИИ, оснащенной высокопроизводительными вычислительными системами для...',
    author: 'Иванов И.И.',
    date: '2025-10-26',
    category: 'Наука',
    commentsCount: 12,
    image: 'https://cdn.poehali.dev/projects/00fc5f79-eeb0-4d95-aead-d9a89c173069/files/dc15984e-2967-4028-818c-367118bf6f1d.jpg',
  },
  {
    id: '2',
    title: 'Студенты ИКИТ заняли первое место на хакатоне',
    content: 'Команда из пяти студентов института одержала победу на международном хакатоне по разработке решений для умных городов. Проект включал...',
    author: 'Петрова А.С.',
    date: '2025-10-25',
    category: 'Достижения',
    commentsCount: 8,
    image: 'https://cdn.poehali.dev/projects/00fc5f79-eeb0-4d95-aead-d9a89c173069/files/eff3f428-9aa2-4417-b1a3-617fe8cfd3f4.jpg',
  },
  {
    id: '3',
    title: 'Расписание экзаменационной сессии 2025',
    content: 'Деканат ИКИТ публикует официальное расписание зимней экзаменационной сессии. Экзамены начнутся 15 января 2025 года. Студентам необходимо ознакомиться...',
    author: 'Деканат ИКИТ',
    date: '2025-10-24',
    category: 'Учеба',
    commentsCount: 45,
    image: 'https://cdn.poehali.dev/projects/00fc5f79-eeb0-4d95-aead-d9a89c173069/files/f5a78b07-30b9-46c2-9e05-cbc0a47e3319.jpg',
  },
  {
    id: '4',
    title: 'День открытых дверей: приглашаем абитуриентов',
    content: 'ИКИТ приглашает будущих студентов на день открытых дверей, который состоится 3 ноября. В программе: экскурсии по лабораториям, встречи...',
    author: 'Приемная комиссия',
    date: '2025-10-23',
    category: 'События',
    commentsCount: 6,
  },
  {
    id: '5',
    title: 'Новые гранты для научных исследований',
    content: 'Объявлен конкурс на получение грантов для студенческих научных проектов. Общий призовой фонд составляет 2 миллиона рублей. Заявки принимаются...',
    author: 'Научный отдел',
    date: '2025-10-22',
    category: 'Наука',
    commentsCount: 15,
  },
];

const Home = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const data = await api.posts.getAll();
        setPosts(data);
      } catch (error) {
        console.error('Failed to load posts:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadPosts();
  }, []);

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'Наука': 'bg-blue-100 text-blue-800',
      'Достижения': 'bg-green-100 text-green-800',
      'Учеба': 'bg-purple-100 text-purple-800',
      'События': 'bg-orange-100 text-orange-800',
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <Header />
      
      <main className="container py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Новости ИКИТ</h1>
          <p className="text-muted-foreground">Актуальная информация института космических и информационных технологий</p>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Загрузка новостей...</p>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Пока нет опубликованных новостей</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {posts.map((post) => (
              <Link key={post.id} to={`/article/${post.id}`} className="block">
                <Card className="hover:shadow-lg transition-all duration-200 animate-fade-in overflow-hidden">
                  {post.image_url && (
                    <div className="w-full h-72 overflow-hidden">
                      <img 
                        src={post.image_url} 
                        alt={post.title}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}
                  <CardHeader>
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div className="flex-1">
                        <Badge className={getCategoryColor(post.category)} variant="secondary">
                          {post.category}
                        </Badge>
                        <CardTitle className="text-2xl mt-2 mb-2 hover:text-accent transition-colors">
                          {post.title}
                        </CardTitle>
                      </div>
                    </div>
                    <CardDescription className="text-base leading-relaxed">
                      {post.content.substring(0, 150)}...
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <Icon name="User" size={14} />
                          <span>{post.author_name || 'Аноним'}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Icon name="Calendar" size={14} />
                          <span>{new Date(post.created_at).toLocaleDateString('ru-RU')}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <Icon name="Eye" size={14} />
                        <span>{post.views}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Home;