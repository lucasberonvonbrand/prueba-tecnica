import { useForm } from '@tanstack/react-form';
import { useNavigate } from '@tanstack/react-router';
import { Input, Button, Card, CardHeader, CardBody, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from '@heroui/react';
import { registerSchema } from '../types/auth.schema';
import { useAuth } from '../hooks/useAuth';
import { useState } from 'react';

export const RegisterFormComponent = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [modalState, setModalState] = useState<{isOpen: boolean; title: string; message: string; type: 'error' | 'success'}>({
    isOpen: false,
    title: '',
    message: '',
    type: 'error',
  });

  const form = useForm({
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
    onSubmit: async ({ value }) => {
      const result = registerSchema.safeParse(value);
      if (!result.success) {
        setModalState({
          isOpen: true,
          title: 'Ocurrió un error',
          message: 'Revisa los campos, hay errores en el formulario',
          type: 'error'
        });
        return;
      }

      try {
        await register(value);
        console.log('Registro exitoso');
        setModalState({
          isOpen: true,
          title: 'Registro Exitoso',
          message: 'Tu cuenta ha sido creada exitosamente. Iniciando sesión...',
          type: 'success'
        });
        
        setTimeout(() => {
          navigate({ to: '/dashboard' });
        }, 1500);
      } catch (error: any) {
        console.error('Error en el registro', error);
        let errorTxt = error.message || error.statusText || 'No se pudo crear la cuenta';
        if (errorTxt.includes('User already exists')) {
          errorTxt = 'El correo electrónico ya está registrado en otra cuenta.';
        }
        setModalState({
          isOpen: true,
          title: 'Ocurrió un error',
          message: errorTxt,
          type: 'error'
        });
      }
    },
  });

  return (
      <Card className="w-full max-w-md mx-auto mt-4">
        <CardHeader className="flex flex-col gap-1 items-center">
          <h2 className="text-2xl font-bold">Crear Cuenta</h2>
          <p className="text-sm text-default-500">Regístrate para publicar artículos</p>
        </CardHeader>
        
        <CardBody>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              form.handleSubmit();
            }}
            className="flex flex-col gap-4"
          >
            <form.Field
              name="name"
              validators={{
                onChange: ({ value }) => {
                  const res = registerSchema.shape.name.safeParse(value);
                  return res.success ? undefined : res.error.errors[0].message;
                }
              }}
              children={(field) => (
                <Input
                  label="Nombre completo"
                  type="text"
                  placeholder="Juan Pérez"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  isInvalid={field.state.meta.isTouched && field.state.meta.errors.length > 0}
                  errorMessage={field.state.meta.isTouched ? field.state.meta.errors.join(', ') : undefined}
                />
              )}
            />

            <form.Field
              name="email"
              validators={{
                onChange: ({ value }) => {
                  const res = registerSchema.shape.email.safeParse(value);
                  return res.success ? undefined : res.error.errors[0].message;
                }
              }}
              children={(field) => (
                <Input
                  label="Email"
                  type="email"
                  placeholder="tu@email.com"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  isInvalid={field.state.meta.isTouched && field.state.meta.errors.length > 0}
                  errorMessage={field.state.meta.isTouched ? field.state.meta.errors.join(', ') : undefined}
                />
              )}
            />

            <form.Field
              name="password"
              validators={{
                onChange: ({ value }) => {
                  const res = registerSchema.shape.password.safeParse(value);
                  return res.success ? undefined : res.error.errors[0].message;
                }
              }}
              children={(field) => (
                <Input
                  label="Contraseña"
                  type="password"
                  placeholder="********"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  isInvalid={field.state.meta.isTouched && field.state.meta.errors.length > 0}
                  errorMessage={field.state.meta.isTouched ? field.state.meta.errors.join(', ') : undefined}
                />
              )}
            />

            <form.Subscribe
              selector={(state) => [state.canSubmit, state.isSubmitting]}
              children={([canSubmit, isSubmitting]) => (
                <Button
                  type="submit"
                  color="primary"
                  className="mt-4"
                  isDisabled={!(canSubmit as boolean)}
                  isLoading={isSubmitting as boolean}
                >
                  Registrarme
                </Button>
              )}
            />
          </form>
        </CardBody>

        <Modal isOpen={modalState.isOpen} onClose={() => setModalState({ ...modalState, isOpen: false })}>
          <ModalContent>
            <ModalHeader className={`${modalState.type === 'error' ? 'text-danger' : 'text-success'} font-bold flex gap-2 items-center`}>
              {modalState.title}
            </ModalHeader>
            <ModalBody>
              <p>{modalState.message}</p>
            </ModalBody>
            <ModalFooter>
              <Button color="primary" onPress={() => setModalState({ ...modalState, isOpen: false })}>
                Entendido
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Card>
  );
};
