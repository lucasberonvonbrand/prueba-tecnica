import { useForm } from '@tanstack/react-form';
import { Input, Button, Card, CardHeader, CardBody, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from '@heroui/react';
import { loginSchema } from '../types/auth.schema';
import { useAuth } from '../hooks/useAuth';
import { useState } from 'react';

export const LoginFormComponent = () => {
  const { login } = useAuth();
  const [errorMsg, setErrorMsg] = useState('');

  const form = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
    onSubmit: async ({ value }) => {
      const result = loginSchema.safeParse(value);
      if (!result.success) {
        setErrorMsg('Revisa los campos, hay errores en el formulario');
        return;
      }

      try {
        await login(value);
        console.log('Login exitoso');
        window.location.href = '/dashboard';
      } catch (error: any) {
        console.error('Error en el login', error);
        let errorTxt = error.message || error.statusText || 'Credenciales incorrectas';
        if (errorTxt.includes('Invalid email or password')) {
          errorTxt = 'Email o contraseña incorrectos';
        }
        setErrorMsg(errorTxt);
      }
    },
  });

  return (
    <>
      <Card className="w-full max-w-md mx-auto mt-10">
        <CardHeader className="flex flex-col gap-1 items-center">
          <h2 className="text-2xl font-bold">Iniciar Sesión</h2>
          <p className="text-sm text-default-500">Ingresa tus credenciales para continuar</p>
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
              name="email"
              validators={{
                onChange: ({ value }) => {
                  const res = loginSchema.shape.email.safeParse(value);
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
                  isInvalid={field.state.meta.errors.length > 0}
                  errorMessage={field.state.meta.errors.join(', ')}
                />
              )}
            />

            <form.Field
              name="password"
              validators={{
                onChange: ({ value }) => {
                  const res = loginSchema.shape.password.safeParse(value);
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
                  isInvalid={field.state.meta.errors.length > 0}
                  errorMessage={field.state.meta.errors.join(', ')}
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
                  Ingresar
                </Button>
              )}
            />
          </form>
        </CardBody>
      </Card>

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
    </>
  );
};
