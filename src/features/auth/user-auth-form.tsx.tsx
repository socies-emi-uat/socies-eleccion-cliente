'use client';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';

const formSchema = z.object({
  email: z.string().email({ message: 'Ingrese un correo electrónico válido' }),
  password: z
    .string()
    .min(5, { message: 'La contraseña debe tener al menos 6 caracteres' })
    .max(20, { message: 'La contraseña debe tener como máximo 20 caracteres' })
    .nonempty({ message: 'La contraseña no puede estar vacía' })
});

type UserFormValue = z.infer<typeof formSchema>;

export default function UserAuthForm() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl');
  const [loading, startTransition] = useTransition();
  const router = useRouter();
  const defaultValues = {
    email: 'ronalddiazy@gmail.com',
    password: ''
  };
  const form = useForm<UserFormValue>({
    resolver: zodResolver(formSchema),
    defaultValues
  });

  const onSubmit = (data: UserFormValue) => {
    const loading = toast.loading('Verificando credenciales...');
    startTransition(() => {
      signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: false, // 👈 importante
        callbackUrl: callbackUrl ?? '/'
      })
        .then((result) => {
          if (result?.error) {
            toast.error('Credenciales invalidas!');
            toast.dismiss(loading);
          } else {
            toast.dismiss(loading);
            toast.success('Inicio de sesión exitoso!');
            router.push(callbackUrl ?? '/');
          }
        })
        .catch(() => {
          toast.error('Error al iniciar sesión!');
          toast.dismiss(loading);
        });
    });
  };

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className='w-full space-y-2'
        >
          <FormField
            control={form.control}
            name='email'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email / CI</FormLabel>
                <FormControl>
                  <Input
                    type='email'
                    placeholder='Ingresa tu correo...'
                    disabled={loading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='password'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contraseña</FormLabel>
                <FormControl>
                  <Input
                    type='password'
                    placeholder='Ingresa tu contraseña...'
                    disabled={loading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            disabled={loading}
            className='mt-2 ml-auto w-full'
            type='submit'
          >
            Iniciar sesión
          </Button>
        </form>
      </Form>
      <p className='text-muted-foreground px-6 text-center text-xs'>
        O{' '}
        <button
          onClick={() => router.push('/register')}
          className='text-tertiary underline transition hover:opacity-80'
        >
          Registrarse
        </button>
      </p>
    </>
  );
}