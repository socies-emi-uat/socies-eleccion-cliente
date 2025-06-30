"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { useSession } from "next-auth/react";
import { CheckCircle, XCircle, Loader2, AlertCircle, ArrowLeft, Moon, Sun, DownloadCloud } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";

interface VotoResponse {
  puedeVotar: boolean;
  motivo?: string;
}

export default function UserViewConfig() {
  const [votoInfo, setVotoInfo] = useState<VotoResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isPwa, setIsPwa] = useState<boolean>(false);
  const { data: session, status } = useSession();
  const { theme, setTheme } = useTheme();
  const router = useRouter();

  useEffect(() => {
    // Verifica si la app está instalada como PWA
    setIsPwa(window.matchMedia("(display-mode: standalone)").matches);
  }, []);

  useEffect(() => {
    const fetchVotoInfo = async () => {
      if (!session?.user?.id) return;
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get<VotoResponse>(`/api/voto/estado/${session.user.id}`);
        setVotoInfo(response.data);
      } catch (err) {
        setError("Error al obtener el estado de voto");
      } finally {
        setLoading(false);
      }
    };

    if (status === "authenticated") {
      fetchVotoInfo();
    }
  }, [session?.user?.id, status]);

  if (status === "unauthenticated") {
    router.push("/auth/signin");
    return null;
  }

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-6 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver
        </Button>

        <h1 className="text-3xl font-bold text-center mb-4">Configuración de Usuario</h1>
        <p className="text-center text-muted-foreground mb-10">
          Gestiona tus preferencias y estado dentro de la plataforma.
        </p>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.2 },
            },
          }}
          className="space-y-6"
        >
          {/* Tema */}
          <motion.div variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}>
            <Card>
              <CardHeader>
                <CardTitle>Tema</CardTitle>
                <CardDescription>Selecciona el tema de la interfaz</CardDescription>
              </CardHeader>
              <CardContent className="flex gap-4">
                <Button variant={theme === "light" ? "default" : "outline"} onClick={() => setTheme("light")}>
                  <Sun className="mr-2 h-4 w-4" />
                  Claro
                </Button>
                <Button variant={theme === "dark" ? "default" : "outline"} onClick={() => setTheme("dark")}>
                  <Moon className="mr-2 h-4 w-4" />
                  Oscuro
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Contraseña */}
          <motion.div variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}>
            <Card>
              <CardHeader>
                <CardTitle>Cambiar Contraseña</CardTitle>
                <CardDescription>
                  Redirige a la página de seguridad para actualizar tu contraseña.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={() => router.push("/perfil/seguridad")}>
                  Cambiar Contraseña
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Estado de PWA */}
          <motion.div variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}>
            <Card>
              <CardHeader>
                <CardTitle>Aplicación Web Progresiva (PWA)</CardTitle>
                <CardDescription>
                  Estado de instalación como aplicación
                </CardDescription>
              </CardHeader>
              <CardContent className="flex items-center gap-4">
                <DownloadCloud className="h-6 w-6" />
                {isPwa ? (
                  <span className="text-green-600 font-medium">Instalada como PWA</span>
                ) : (
                  <span className="text-yellow-600">No instalada como PWA</span>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Estado de votación */}
          <motion.div variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}>
            <Card>
              <CardHeader>
                <CardTitle>Estado de Votación</CardTitle>
                <CardDescription>Información actual sobre tu capacidad de voto</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="animate-spin h-5 w-5" />
                    Verificando estado...
                  </div>
                ) : error ? (
                  <div className="text-red-500 text-sm">{error}</div>
                ) : votoInfo ? (
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      {votoInfo.puedeVotar ? (
                        <CheckCircle className="text-green-500 h-5 w-5" />
                      ) : (
                        <XCircle className="text-red-500 h-5 w-5" />
                      )}
                      <span className="font-medium">
                        {votoInfo.puedeVotar
                          ? "Estás habilitado para votar"
                          : "No estás habilitado para votar"}
                      </span>
                    </div>
                    {!votoInfo.puedeVotar && votoInfo.motivo && (
                      <p className="text-sm text-muted-foreground">Motivo: {votoInfo.motivo}</p>
                    )}
                  </div>
                ) : null}
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
