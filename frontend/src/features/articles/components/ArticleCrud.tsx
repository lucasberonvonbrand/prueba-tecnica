import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from '@tanstack/react-form';
import { Button, Input, Textarea, Select, SelectItem, Card, CardBody, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure, Pagination } from '@heroui/react';
import { getMyArticles, createArticle, updateArticle, deleteArticle, type Article } from '../services/article.service';
import { useState } from 'react';

export const ArticleCrud = () => {
  const queryClient = useQueryClient();
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [viewingArticle, setViewingArticle] = useState<Article | null>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [page, setPage] = useState(1);

  const { data: queryResult, isLoading } = useQuery({
    queryKey: ['my-articles', page],
    queryFn: () => getMyArticles(page),
  });

  const articles = queryResult?.data || [];
  const total = queryResult?.total || 0;
  const totalPages = Math.ceil(total / 10) || 1;

  const createMutation = useMutation({
    mutationFn: createArticle,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-articles'] });
      onClose();
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: { id: string; payload: any }) => updateArticle(data.id, data.payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-articles'] });
      onClose();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteArticle,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-articles'] });
    },
  });

  const form = useForm({
    defaultValues: {
      title: editingArticle?.title || '',
      content: editingArticle?.content || '',
      coverImageUrl: editingArticle?.coverImageUrl || '',
    },
    onSubmit: async ({ value }) => {
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
    },
  });

  const openCreate = () => {
    setEditingArticle(null);
    form.reset();
    onOpen();
  };

  const openEdit = (article: Article) => {
    setEditingArticle(article);
    form.reset();
    form.setFieldValue('title', article.title);
    form.setFieldValue('content', article.content);
    form.setFieldValue('coverImageUrl', article.coverImageUrl || '');
    onOpen();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Tus Artículos</h2>
        <Button color="primary" onPress={openCreate}>Crear Artículo</Button>
      </div>

      {isLoading ? (
        <p>Cargando artículos...</p>
      ) : articles?.length === 0 ? (
        <p className="text-gray-500">No tienes artículos todavía. ¡Crea uno!</p>
      ) : (
        <div className="grid gap-4">
          {articles?.map((article) => (
            <Card key={article.id}>
              <CardBody className="flex flex-row justify-between items-center">
                <div>
                  <h3 className="font-bold">{article.title}</h3>
                  <p className="text-sm text-gray-500 truncate max-w-xl mb-2">{article.content}</p>
                  {article.coverImageUrl && (
                    <img src={article.coverImageUrl} alt={article.title} className="w-24 h-24 object-cover rounded mt-2 mb-2" />
                  )}
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="flat" color="secondary" onPress={() => setViewingArticle(article)}>Ver</Button>
                  <Button size="sm" variant="flat" onPress={() => openEdit(article)}>Editar</Button>
                  <Button size="sm" color="danger" variant="flat" onPress={() => deleteMutation.mutate(article.id)} isLoading={deleteMutation.isPending}>Eliminar</Button>
                </div>
              </CardBody>
            </Card>
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
      <Modal isOpen={!!viewingArticle} onClose={() => setViewingArticle(null)}>
        <ModalContent>
          {() => (
            <>
              <ModalHeader>Detalle del Artículo</ModalHeader>
              <ModalBody>
                {viewingArticle && (
                  <div className="space-y-4">
                    <h3 className="text-2xl font-bold">{viewingArticle.title}</h3>
                    <div className="flex justify-between text-sm text-gray-500">
                      <span>Por: {viewingArticle.authorName}</span>
                      <span>{new Date(viewingArticle.createdAt).toLocaleDateString()}</span>
                    </div>
                    {viewingArticle.coverImageUrl && (
                      <img src={viewingArticle.coverImageUrl} alt={viewingArticle.title} className="w-full max-h-60 object-cover rounded" />
                    )}
                    <p className="whitespace-pre-wrap">{viewingArticle.content}</p>
                  </div>
                )}
              </ModalBody>
              <ModalFooter>
                <Button color="primary" onPress={() => setViewingArticle(null)}>Cerrar</Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* Modal de Creación/Edición */}
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>{editingArticle ? 'Editar Artículo' : 'Crear Artículo'}</ModalHeader>
              <ModalBody>
                <form.Field name="title">
                  {(field) => (
                    <Input
                      label="Título"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      isInvalid={field.state.meta.errors.length > 0}
                      errorMessage={field.state.meta.errors.join(', ')}
                      isRequired
                    />
                  )}
                </form.Field>
                <form.Field name="content">
                  {(field) => (
                    <Textarea
                      label="Contenido"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      isInvalid={field.state.meta.errors.length > 0}
                      errorMessage={field.state.meta.errors.join(', ')}
                      isRequired
                    />
                  )}
                </form.Field>
                <form.Field name="coverImageUrl">
                  {(field) => (
                    <Input
                      label="URL de imagen de portada (opcional)"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      isInvalid={field.state.meta.errors.length > 0}
                      errorMessage={field.state.meta.errors.join(', ')}
                    />
                  )}
                </form.Field>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>Cancelar</Button>
                <form.Subscribe
                  selector={(state) => [state.canSubmit, state.isSubmitting]}
                  children={([canSubmit, isSubmitting]) => (
                    <Button 
                      color="primary" 
                      onPress={() => form.handleSubmit()} 
                      isDisabled={!canSubmit} 
                      isLoading={isSubmitting as boolean}
                    >
                      Guardar
                    </Button>
                  )}
                />
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

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
