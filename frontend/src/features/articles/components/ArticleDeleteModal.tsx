import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from '@heroui/react';
import type { Article } from '../services/article.service';

interface ArticleDeleteModalProps {
  article: Article | null;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  isDeleting: boolean;
}

export const ArticleDeleteModal = ({ article, onClose, onConfirm, isDeleting }: ArticleDeleteModalProps) => {
  return (
    <Modal isOpen={!!article} onClose={onClose}>
      <ModalContent>
        <ModalHeader className="font-bold flex gap-2 items-center text-foreground">
          ¿Eliminar artículo?
        </ModalHeader>
        <ModalBody>
          <p className="text-gray-600">
            ¿Estás seguro de que deseas eliminar la publicación <strong className="text-foreground">"{article?.title}"</strong>? Esta acción no se puede deshacer.
          </p>
        </ModalBody>
        <ModalFooter>
          <Button variant="light" onPress={onClose} isDisabled={isDeleting}>
            Cancelar
          </Button>
          <Button 
            color="danger" 
            onPress={onConfirm} 
            isLoading={isDeleting}
          >
            Eliminar definitivamente
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
