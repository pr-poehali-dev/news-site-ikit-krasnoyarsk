const API_BASE = {
  auth: 'https://functions.poehali.dev/25da1cf3-03e4-4e62-941d-eaf280739a63',
  posts: 'https://functions.poehali.dev/b839986e-b0bf-4106-8a8b-388e508862fc',
};

export interface User {
  id: number;
  username: string;
  email: string;
  full_name?: string;
  role: string;
  created_at: string;
}

export interface Post {
  id: number;
  title: string;
  category: string;
  content: string;
  image_url?: string;
  author_id?: number;
  author_name?: string;
  author_full_name?: string;
  created_at: string;
  updated_at: string;
  views: number;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export const api = {
  auth: {
    register: async (data: {
      username: string;
      email: string;
      password: string;
      full_name?: string;
    }): Promise<AuthResponse> => {
      const response = await fetch(API_BASE.auth, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'register', ...data }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Registration failed');
      }

      return response.json();
    },

    login: async (data: {
      email: string;
      password: string;
    }): Promise<AuthResponse> => {
      const response = await fetch(API_BASE.auth, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'login', ...data }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Login failed');
      }

      return response.json();
    },
  },

  posts: {
    getAll: async (): Promise<Post[]> => {
      const response = await fetch(API_BASE.posts);

      if (!response.ok) {
        throw new Error('Failed to fetch posts');
      }

      const data = await response.json();
      return data.posts;
    },

    getByCategory: async (category: string): Promise<Post[]> => {
      const response = await fetch(`${API_BASE.posts}?category=${encodeURIComponent(category)}`);

      if (!response.ok) {
        throw new Error('Failed to fetch posts');
      }

      const data = await response.json();
      return data.posts;
    },

    getById: async (id: number): Promise<Post> => {
      const response = await fetch(`${API_BASE.posts}?id=${id}`);

      if (!response.ok) {
        throw new Error('Failed to fetch post');
      }

      const data = await response.json();
      return data.post;
    },

    create: async (data: {
      title: string;
      category: string;
      content: string;
      image_url?: string;
      author_id?: number;
    }): Promise<Post> => {
      const response = await fetch(API_BASE.posts, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create post');
      }

      const result = await response.json();
      return result.post;
    },

    update: async (data: {
      id: number;
      title?: string;
      category?: string;
      content?: string;
      image_url?: string;
    }): Promise<Post> => {
      const response = await fetch(API_BASE.posts, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update post');
      }

      const result = await response.json();
      return result.post;
    },
  },
};
