import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button, Card, CardBody, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure, Pagination, Skeleton } from '@heroui/react';
import { getMyArticles, createArticle, updateArticle, deleteArticle, type Article } from '../services/article.service';
import { useState } from 'react';
import { ArticleCard } from './ArticleCard';
import { ArticleFormModal } from './ArticleFormModal';
import { ArticleViewModal } from './ArticleViewModal';
import { ArticleDeleteModal } from './ArticleDeleteModal';

export const ArticleCrud = () => {
  const queryClient = useQueryClient();
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [viewingArticle, setViewingArticle] = useState<Article | null>(null);
  const [deletingArticle, setDeletingArticle] = useState<Article | null>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [page, setPage] = useState(1);

  const { data: queryResult, isLoading, isError, refetch } = useQuery({
    queryKey: ['my-articles', page],
    queryFn: () => getMyArticles(page),
  });

  const articles = queryResult?.data || [];
  const total = queryResult?.total || 0;
  const totalPages = Math.ceil(total / 5) || 1;

  const createMutation = useMutation({
    mutationFn: createArticle,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-articles'] });
      queryClient.invalidateQueries({ queryKey: ['public-articles'] });
      queryClient.invalidateQueries({ queryKey: ['authors'] });
      onClose();
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: { id: string; payload: any }) => updateArticle(data.id, data.payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-articles'] });
      queryClient.invalidateQueries({ queryKey: ['public-articles'] });
      queryClient.invalidateQueries({ queryKey: ['authors'] });
      onClose();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteArticle,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-articles'] });
      queryClient.invalidateQueries({ queryKey: ['public-articles'] });
      queryClient.invalidateQueries({ queryKey: ['authors'] });
      setDeletingArticle(null);
    },
  });

  const handleFormSubmit = async (value: any) => {
    try {
      if (editingArticle) {
        await updateMutation.mutateAsync({ id: editingArticle.id, payload: value });
      } else {
        await createMutation.mutateAsync(value);
      }
    } catch (error) {
      console.error(error);
      setErrorMsg('Ocurrió un error al guardar el artículo. Revisa la consola para más detalles.');
    }
  };

  const handleConfirmDelete = async () => {
    if (deletingArticle) {
      try {
        await deleteMutation.mutateAsync(deletingArticle.id);
      } catch (error) {
        console.error(error);
        setErrorMsg('Ocurrió un error al eliminar el artículo.');
        setDeletingArticle(null);
      }
    }
  };

  const openCreate = () => {
    setEditingArticle(null);
    onOpen();
  };

  const openEdit = (article: Article) => {
    setEditingArticle(article);
    onOpen();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Tus Artículos</h2>
        <Button color="primary" onPress={openCreate}>Crear Artículo</Button>
      </div>

      {isError ? (
        <div className="text-center bg-danger-50 text-danger p-8 rounded-2xl">
          <p className="mb-4 font-bold">Ocurrió un error al cargar tus artículos.</p>
          <Button color="danger" variant="flat" onPress={() => refetch()}>Reintentar</Button>
        </div>
      ) : isLoading ? (
        <div className="grid gap-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i}>
              <CardBody className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex-1 w-full space-y-2">
                  <Skeleton className="w-1/3 h-6 rounded-lg" />
                  <Skeleton className="w-full h-4 rounded-full" />
                </div>
                <div className="flex gap-2 shrink-0">
                  <Skeleton className="w-16 h-8 rounded-lg" />
                  <Skeleton className="w-16 h-8 rounded-lg" />
                  <Skeleton className="w-20 h-8 rounded-lg" />
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      ) : articles?.length === 0 ? (
        <div className="text-center bg-gray-50 p-12 rounded-3xl mt-8">
          <div className="text-6xl mb-4">✍️</div>
          <h3 className="text-2xl font-bold mb-2">Aún no has escrito nada</h3>
          <p className="text-gray-500 mb-6">Comparte tus ideas con el mundo creando tu primer artículo.</p>
          <Button color="primary" size="lg" onPress={openCreate}>Crear mi primer artículo</Button>
        </div>
      ) : (
        <div className="grid gap-4">
          {articles?.map((article) => (
            <ArticleCard 
              key={article.id} 
              article={article} 
              onView={setViewingArticle} 
              onEdit={openEdit} 
              onDelete={() => setDeletingArticle(article)} 
              isDeleting={deleteMutation.isPending && deleteMutation.variables === article.id}
            />
          ))}
        </div>
      )}
      
      {!isLoading && totalPages > 1 && (
        <div className="flex justify-center mt-6">
          <Pagination
            total={totalPages}
            page={page}
            onChange={setPage}
            showControls
          />
        </div>
      )}

      {/* Modal de Detalle */}
      <ArticleViewModal 
        article={viewingArticle} 
        onClose={() => setViewingArticle(null)} 
      />

      {/* Modal de Creación/Edición */}
      <ArticleFormModal 
        isOpen={isOpen} 
        onOpenChange={onOpenChange} 
        editingArticle={editingArticle} 
        onSubmit={handleFormSubmit} 
      />

      {/* Modal de Confirmación de Eliminación */}
      <ArticleDeleteModal
        article={deletingArticle}
        onClose={() => setDeletingArticle(null)}
        onConfirm={handleConfirmDelete}
        isDeleting={deleteMutation.isPending}
      />

      {/* Modal de Error */}
      <Modal isOpen={!!errorMsg} onClose={() => setErrorMsg('')}>
        <ModalContent>
          <ModalHeader className="text-danger font-bold flex gap-2 items-center">
            Ocurrió un error
          </ModalHeader>
          <ModalBody>
            <p>{errorMsg}</p>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onPress={() => setErrorMsg('')}>
              Entendido
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};
