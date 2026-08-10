import { api } from '@/core/api/axios';

export interface ArticleSummary {
  id: string;
  title: string;
  content: string;
  status: string;
  createdAt: string;
}

export interface Author {
  id: string;
  name: string;
  email: string;
  articles: ArticleSummary[];
}

export const getAuthors = async (search?: string): Promise<Author[]> => {
  const { data } = await api.get<Author[]>('/public/authors', {
    params: { search: search || undefined },
  });
  return data;
};

export interface PublicArticle {
  id: string;
  title: string;
  content: string;
  coverImageUrl?: string;
  authorName: string;
  createdAt: string;
}

export const getPublicArticles = async (search: string, page = 1, limit = 10): Promise<{ data: PublicArticle[]; total: number }> => {
  const { data } = await api.get<{ data: PublicArticle[]; total: number }>('/public/articles', {
    params: { search, page, limit }
  });
  return data;
};
