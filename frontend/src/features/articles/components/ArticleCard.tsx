import { Card, CardBody, Button } from '@heroui/react';
import type { Article } from '../services/article.service';

interface ArticleCardProps {
  article: Article;
  onView: (article: Article) => void;
  onEdit: (article: Article) => void;
  onDelete: (id: string) => void;
  isDeleting: boolean;
}

export const ArticleCard = ({ article, onView, onEdit, onDelete, isDeleting }: ArticleCardProps) => {
  return (
    <Card>
      <CardBody className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 overflow-hidden">
        <div className="flex-1 min-w-0 w-full">
          <h3 className="font-bold truncate">{article.title}</h3>
          <p className="text-sm text-gray-500 truncate mb-2">{article.content}</p>
          {article.coverImageUrl && (
            <img src={article.coverImageUrl} alt={article.title} className="w-24 h-24 object-cover rounded mt-2 mb-2" />
          )}
        </div>
        <div className="flex gap-2 shrink-0">
          <Button size="sm" variant="flat" color="primary" onPress={() => onView(article)}>Ver</Button>
          <Button size="sm" variant="flat" color="primary" onPress={() => onEdit(article)}>Editar</Button>
          <Button size="sm" variant="solid" color="danger" onPress={() => onDelete(article.id)} isLoading={isDeleting}>Eliminar</Button>
        </div>
      </CardBody>
    </Card>
  );
};
