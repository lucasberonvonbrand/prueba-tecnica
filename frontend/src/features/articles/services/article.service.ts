import { api } from '@/core/api/axios';

export interface Article {
  id: string;
  title: string;
  content: string;
  coverImageUrl?: string;
  authorName: string;
  status: 'DRAFT' | 'PUBLISHED';
  createdAt: string;
  authorId: string;
}

export const getMyArticles = async (page = 1, limit = 5): Promise<{ data: Article[]; total: number }> => {
  const { data } = await api.get<{ data: Article[]; total: number }>('/articles', {
    params: { page, limit }
  });
  return data;
};

export const createArticle = async (payload: { title: string; content: string; coverImageUrl?: string }) => {
  const { data } = await api.post<Article>('/articles', payload);
  return data;
};

export const updateArticle = async (id: string, payload: { title: string; content: string; coverImageUrl?: string }) => {
  const { data } = await api.put<Article>(`/articles/${id}`, payload);
  return data;
};

export const deleteArticle = async (id: string) => {
  await api.delete(`/articles/${id}`);
};
