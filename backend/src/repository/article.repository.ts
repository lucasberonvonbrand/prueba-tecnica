import { ObjectId } from 'mongodb';
import { dbConfig } from '../config/db.js';
import type { ArticleDocument } from '../model/Article.js';

export class ArticleRepository {
  private get collection() {
    return dbConfig.getDb().collection<ArticleDocument>('articles');
  }

  async create(article: ArticleDocument): Promise<ArticleDocument> {
    const result = await this.collection.insertOne(article);
    return { ...article, _id: result.insertedId };
  }

  async findById(id: string): Promise<ArticleDocument | null> {
    if (!ObjectId.isValid(id)) return null;
    return this.collection.findOne({ _id: new ObjectId(id) });
  }

  async findByAuthorId(authorId: string, skip: number, limit: number): Promise<[ArticleDocument[], number]> {
    const filter = { authorId };
    const items = await this.collection.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).toArray();
    const count = await this.collection.countDocuments(filter);
    return [items, count];
  }

  async search(query: string, skip: number, limit: number): Promise<[ArticleDocument[], number]> {
    const filter = query
      ? {
          $or: [
            { title: { $regex: query, $options: 'i' } },
            { content: { $regex: query, $options: 'i' } },
            { authorName: { $regex: query, $options: 'i' } },
          ],
        }
      : {};

    const items = await this.collection.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).toArray();
    const count = await this.collection.countDocuments(filter);
    return [items, count];
  }

  async update(id: string, updateData: Partial<ArticleDocument>): Promise<boolean> {
    if (!ObjectId.isValid(id)) return false;
    const result = await this.collection.updateOne({ _id: new ObjectId(id) }, { $set: updateData });
    return result.matchedCount > 0;
  }

  async delete(id: string): Promise<boolean> {
    if (!ObjectId.isValid(id)) return false;
    const result = await this.collection.deleteOne({ _id: new ObjectId(id) });
    return result.deletedCount > 0;
  }
}

export const articleRepository = new ArticleRepository();
