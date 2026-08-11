import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from '@heroui/react';
import type { Article } from '../services/article.service';

interface ArticleViewModalProps {
  article: Article | null;
  onClose: () => void;
}

export const ArticleViewModal = ({ article, onClose }: ArticleViewModalProps) => {
  return (
    <Modal isOpen={!!article} onClose={onClose} scrollBehavior="inside" size="3xl">
      <ModalContent>
        {() => (
          <>
            <ModalHeader>Detalle del Artículo</ModalHeader>
            <ModalBody>
              {article && (
                <div className="space-y-4">
                  <h3 className="text-2xl font-bold">{article.title}</h3>
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>Por: {article.authorName}</span>
                    <span>{new Date(article.createdAt).toLocaleDateString()}</span>
                  </div>
                  {article.coverImageUrl && (
                    <img src={article.coverImageUrl} alt={article.title} className="w-full max-h-60 object-cover rounded" />
                  )}
                  <p className="whitespace-pre-wrap">{article.content}</p>
                </div>
              )}
            </ModalBody>
            <ModalFooter>
              <Button color="primary" onPress={onClose}>Cerrar</Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};
