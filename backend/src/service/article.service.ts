import { articleRepository } from '../repository/article.repository.js';
import { ArticleMapper } from '../mapper/ArticleMapper.js';
import type { ArticleBodyRequest, ArticleResponse } from '../dto/ArticleDto.js';
import { NotFoundException, ForbiddenException } from '../exception/ApiError.js';
import type { ArticleDocument } from '../model/Article.js';

export class ArticleService {
  async createArticle(data: ArticleBodyRequest, authorId: string, authorName: string): Promise<ArticleResponse> {
    const newArticle: ArticleDocument = {
      title: data.title,
      content: data.content,
      coverImageUrl: data.coverImageUrl,
      authorId,
      authorName,
      createdAt: new Date(),
    };

    const savedArticle = await articleRepository.create(newArticle);
    return ArticleMapper.toDto(savedArticle);
  }

  async getOwnArticles(authorId: string, page: number, limit: number): Promise<{ data: ArticleResponse[]; total: number }> {
    const skip = (page - 1) * limit;
    const [articles, total] = await articleRepository.findByAuthorId(authorId, skip, limit);
    return {
      data: ArticleMapper.toDtoList(articles),
      total,
    };
  }

  async updateArticle(id: string, authorId: string, data: Partial<ArticleBodyRequest>): Promise<ArticleResponse> {
    const article = await articleRepository.findById(id);
    
    if (!article) {
      throw new NotFoundException('Artículo no encontrado');
    }

    if (article.authorId !== authorId) {
      throw new ForbiddenException('No tienes permiso para editar este artículo');
    }

    const updated = await articleRepository.update(id, data);
    if (!updated) {
      throw new Error('Error al actualizar el artículo');
    }

    const updatedArticle = await articleRepository.findById(id);
    return ArticleMapper.toDto(updatedArticle!);
  }

  async deleteArticle(id: string, authorId: string): Promise<void> {
    const article = await articleRepository.findById(id);
    
    if (!article) {
      throw new NotFoundException('Artículo no encontrado');
    }

    if (article.authorId !== authorId) {
      throw new ForbiddenException('No tienes permiso para eliminar este artículo');
    }

    await articleRepository.delete(id);
  }
}

export const articleService = new ArticleService();
