import { articleRepository } from '../repository/article.repository.js';
import { userRepository } from '../repository/user.repository.js';
import { ArticleMapper } from '../mapper/ArticleMapper.js';
import type { ArticleResponse } from '../dto/ArticleDto.js';
import type { AuthorResponse } from '../dto/AuthorDto.js';
import { NotFoundException } from '../exception/ApiError.js';

export class PublicService {
  async searchArticles(query: string, page: number, limit: number): Promise<{ data: ArticleResponse[]; total: number }> {
    const skip = (page - 1) * limit;
    const [articles, total] = await articleRepository.search(query, skip, limit);
    return {
      data: ArticleMapper.toDtoList(articles),
      total,
    };
  }

  async getArticleById(id: string): Promise<ArticleResponse> {
    const article = await articleRepository.findById(id);
    if (!article) {
      throw new NotFoundException('Artículo no encontrado');
    }
    return ArticleMapper.toDto(article);
  }

  async getAuthors(): Promise<AuthorResponse[]> {
    return await userRepository.getAuthorsWithArticleCount();
  }
}

export const publicService = new PublicService();
