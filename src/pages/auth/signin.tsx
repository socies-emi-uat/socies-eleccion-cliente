'use client';

import { Metadata } from 'next';
import Link from 'next/link';
import { Button, buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { IconStethoscope } from '@tabler/icons-react';
import { motion } from 'framer-motion';
import UserAuthForm from '@/features/auth/user-auth-form.tsx';
import { useRouter } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Iniciar Sesión',
  description: 'Sistema de gestión de votos'
};

export default function SignInViewPage() {
  const router = useRouter();
  return (
    <div className='bg-background relative h-screen w-full md:grid md:grid-cols-2 lg:px-0'>
      {/* Logo / Lado izquierdo */}
      <div className='bg-muted relative hidden h-full flex-col p-10 md:flex dark:border-r'>
        <div className='absolute inset-0 dark:bg-zinc-900' />
        <div className='relative z-20 flex items-center gap-2 text-lg font-bold tracking-tight'>
          <IconStethoscope className='h-6 w-6' />
          Sistema de Votacion Electronica
        </div>
        <div className='relative z-20 mt-auto'>
          <blockquote className='space-y-2'>
            <p className='text-lg leading-relaxed'>
              &ldquo;Una plataforma pensada para mejorar la atención y gestión
              de tus votos.&rdquo;
            </p>
            <footer className='text-sm'>— Equipo de desarrollo</footer>
          </blockquote>
        </div>
      </div>

      {/* Formulario de login */}
      <div className='flex h-full items-center justify-center p-4 lg:p-8'>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className='mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[380px]'
        >
          <div className='flex flex-col items-center space-y-2 text-center'>
            <h1 className='text-3xl font-bold'>Bienvenido</h1>
            <p className='text-muted-foreground text-sm'>
              Inicia sesión con tus credenciales
            </p>
          </div>

          <UserAuthForm />

          <p className='text-muted-foreground px-6 text-center text-xs'>
            Al continuar, aceptas nuestros{' '}
            <Link href='/terms' className='hover:text-primary underline'>
              Términos de servicio
            </Link>{' '}
            y{' '}
            <Link href='/privacy' className='hover:text-primary underline'>
              Política de privacidad
            </Link>
            .
          </p>
        </motion.div>
      </div>

      {/* Botón oculto arriba a la derecha */}
      <Button
        onClick={() => router.push('/')}
        className={cn(
          buttonVariants({ variant: 'ghost' }),
          'absolute top-4 right-4 md:top-8 md:right-8'
        )}
        variant='outline'
      >
        Ir al inicio
      </Button>
    </div>
  );
}