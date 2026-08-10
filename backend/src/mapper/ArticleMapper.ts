import type { ArticleDocument } from '../model/Article.js';
import type { ArticleResponse } from '../dto/ArticleDto.js';

export class ArticleMapper {
  static toDto(entity: ArticleDocument): ArticleResponse {
    return {
      id: entity._id?.toString() || '',
      title: entity.title,
      content: entity.content,
      coverImageUrl: entity.coverImageUrl,
      authorId: entity.authorId,
      authorName: entity.authorName,
      createdAt: entity.createdAt.toISOString(),
    };
  }

  static toDtoList(entities: ArticleDocument[]): ArticleResponse[] {
    return entities.map((e) => this.toDto(e));
  }
}
