import { useForm } from '@tanstack/react-form';
import { zodValidator } from '@tanstack/zod-form-adapter';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input, Textarea } from '@heroui/react';
import type { Article } from '../services/article.service';
import { useEffect } from 'react';
import { articleSchema } from '../types/article.schema';

interface ArticleFormModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  editingArticle: Article | null;
  onSubmit: (values: any) => Promise<void>;
}

export const ArticleFormModal = ({ isOpen, onOpenChange, editingArticle, onSubmit }: ArticleFormModalProps) => {
  const form = useForm({
    validatorAdapter: zodValidator(),
    validators: {
      onChange: articleSchema,
    },
    defaultValues: {
      title: editingArticle?.title || '',
      content: editingArticle?.content || '',
      coverImageUrl: editingArticle?.coverImageUrl || '',
    },
    onSubmit: async ({ value }) => {
      await onSubmit(value);
    },
  });

  useEffect(() => {
    if (isOpen) {
      form.reset();
      if (editingArticle) {
        form.setFieldValue('title', editingArticle.title);
        form.setFieldValue('content', editingArticle.content);
        form.setFieldValue('coverImageUrl', editingArticle.coverImageUrl || '');
      } else {
        form.setFieldValue('title', '');
        form.setFieldValue('content', '');
        form.setFieldValue('coverImageUrl', '');
      }
    }
  }, [editingArticle, isOpen]);

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} scrollBehavior="inside" size="2xl">
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
  );
};
