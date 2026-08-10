import { ObjectId } from 'mongodb';

export interface ArticleDocument {
  _id?: ObjectId;
  title: string;
  content: string;
  coverImageUrl?: string;
  authorId: string;
  authorName: string;
  createdAt: Date;
}
