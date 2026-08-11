import { useForm } from '@tanstack/react-form';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input, Textarea } from '@heroui/react';
import type { Article } from '../services/article.service';
import { useEffect } from 'react';
import { articleSchema } from '../types/article.schema';

import { z } from 'zod';

interface ArticleFormModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  editingArticle: Article | null;
  onSubmit: (values: z.infer<typeof articleSchema>) => Promise<void>;
}

export const ArticleFormModal = ({ isOpen, onOpenChange, editingArticle, onSubmit }: ArticleFormModalProps) => {
  const form = useForm({
    defaultValues: {
      title: editingArticle?.title || '',
      content: editingArticle?.content || '',
      coverImageUrl: editingArticle?.coverImageUrl || '',
    },
    onSubmit: async ({ value }) => {
      const result = articleSchema.safeParse(value);
      if (!result.success) {
        return;
      }
      const cleanValue = {
        ...value,
        coverImageUrl: value.coverImageUrl?.trim() || undefined,
      };
      await onSubmit(cleanValue);
    },
  });

  useEffect(() => {
    if (isOpen) {
      form.reset();
      if (editingArticle) {
        form.setFieldValue('title', editingArticle.title);
        form.setFieldValue('content', editingArticle.content);
        form.setFieldValue('coverImageUrl', editingArticle.coverImageUrl || '');
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
              <form.Field 
                name="title"
                validators={{
                  onChange: ({ value }) => {
                    const res = articleSchema.shape.title.safeParse(value);
                    return res.success ? undefined : res.error.errors[0].message;
                  }
                }}
              >
                {(field) => (
                  <Input
                    label="Título"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    isInvalid={field.state.meta.isTouched && field.state.meta.errors.length > 0}
                    errorMessage={field.state.meta.isTouched ? field.state.meta.errors.join(', ') : undefined}
                    isRequired
                  />
                )}
              </form.Field>

              <form.Field 
                name="content"
                validators={{
                  onChange: ({ value }) => {
                    const res = articleSchema.shape.content.safeParse(value);
                    return res.success ? undefined : res.error.errors[0].message;
                  }
                }}
              >
                {(field) => (
                  <Textarea
                    label="Contenido"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    isInvalid={field.state.meta.isTouched && field.state.meta.errors.length > 0}
                    errorMessage={field.state.meta.isTouched ? field.state.meta.errors.join(', ') : undefined}
                    isRequired
                  />
                )}
              </form.Field>

              <form.Field 
                name="coverImageUrl"
                validators={{
                  onChange: ({ value }) => {
                    if (!value) return undefined;
                    const res = articleSchema.shape.coverImageUrl.safeParse(value);
                    return res.success ? undefined : res.error.errors[0].message;
                  }
                }}
              >
                {(field) => (
                  <Input
                    label="URL de imagen de portada (opcional)"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    isInvalid={field.state.meta.isTouched && field.state.meta.errors.length > 0}
                    errorMessage={field.state.meta.isTouched ? field.state.meta.errors.join(', ') : undefined}
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
