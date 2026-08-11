import { dbConfig } from "../config/db.js";
import type { AuthorResponse } from "../dto/AuthorDto.ts";

export class UserRepository {
  private get collection() {
    return dbConfig.getDb().collection("user");
  }

  async getAuthorsWithArticleCount(): Promise<AuthorResponse[]> {
    const pipeline = [
      {
        $addFields: {
          userIdStr: { $toString: '$_id' }
        }
      },
      {
        $lookup: {
          from: "articles",
          localField: "userIdStr",
          foreignField: "authorId",
          as: "articles",
        },
      },
      {
        $project: {
          id: { $toString: '$_id' },
          name: 1,
          email: 1,
          articles: 1,
          articleCount: { $size: '$articles' },
        },
      },
      {
         $sort: { name: 1 }
      }
    ];

    const authors = await this.collection.aggregate(pipeline).toArray();
    
    return authors.map((a: any) => ({
      id: a.id || a._id.toString(),
      name: a.name,
      email: a.email,
      articles: a.articles.map((art: any) => ({
        id: art._id.toString(),
        title: art.title,
        content: art.content,
        status: art.status || 'PUBLISHED',
        createdAt: art.createdAt ? new Date(art.createdAt).toISOString() : new Date().toISOString()
      }))
    }));
  }
}

export const userRepository = new UserRepository();
