'use client';

import { motion } from 'framer-motion';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button, buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { IconUser } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';

const userSchema = z.object({
  nombre: z.string(),
  email: z.string(),
  telefono: z.string(),
  direccion: z.string(),
  ci: z.string(),
  fechaNacimiento: z.string(),
});

type UserData = z.infer<typeof userSchema>;

export default function UserFormView() {
  const router = useRouter();

  const defaultValues: UserData = {
    nombre: 'Camilo Condor Mamani',
    email: 'Votacion',
    telefono: '+591 777-12345',
    direccion: 'Calle Siempre Viva 742',
    ci: '12345678',
    fechaNacimiento: '1990-05-12',
  };

  const form = useForm<UserData>({
    defaultValues,
  });

  return (
    <div className="bg-background relative h-screen w-full md:grid md:grid-cols-2 lg:px-0">
      {/* Lado izquierdo */}
      <div className="bg-muted relative hidden h-full flex-col p-10 md:flex dark:border-r">
        <div className="absolute inset-0 dark:bg-zinc-900" />
        <div className="relative z-20 flex items-center gap-2 text-lg font-bold tracking-tight">
          <IconUser className="h-6 w-6" />
          Información del Usuario
        </div>
        <div className="relative z-20 mt-auto">
          <blockquote className="space-y-2">
            <p className="text-lg leading-relaxed">
              &ldquo;Visualiza tus datos personales registrados en el sistema.&rdquo;
            </p>
            <footer className="text-sm">— Equipo de desarrollo</footer>
          </blockquote>
        </div>
      </div>

      {/* Lado derecho */}
      <div className="flex h-full items-center justify-center p-4 lg:p-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mx-auto w-full space-y-6 sm:w-[600px]"
        >
          <div className="flex flex-col items-center space-y-2 text-center">
            <h1 className="text-3xl font-bold">Datos del Usuario</h1>
            <p className="text-muted-foreground text-sm">
              Esta información es solo de visualización
            </p>
          </div>

          <Form {...form}>
            <form className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="nombre"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre</FormLabel>
                    <FormControl>
                      <Input disabled {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input disabled {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="telefono"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Teléfono</FormLabel>
                    <FormControl>
                      <Input disabled {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="direccion"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Dirección</FormLabel>
                    <FormControl>
                      <Input disabled {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="ci"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>CI</FormLabel>
                    <FormControl>
                      <Input disabled {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="fechaNacimiento"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fecha de Nacimiento</FormLabel>
                    <FormControl>
                      <Input disabled type="date" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </motion.div>
      </div>

      {/* Botón de ir al inicio */}
      <Button
        onClick={() => router.push('/')}
        className={cn(
          buttonVariants({ variant: 'ghost' }),
          'absolute top-4 right-4 md:top-8 md:right-8'
        )}
        variant="outline"
      >
        Ir al inicio
      </Button>
    </div>
  );
}
