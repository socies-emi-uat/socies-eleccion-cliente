"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { useSession } from "next-auth/react";
import { CheckCircle, XCircle, Loader2, AlertCircle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { Votacion } from "@/constats/api-votar";

interface VotoResponse {
  puedeVotar: boolean;
  motivo?: string;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

const iconVariants = {
  hidden: { opacity: 0, scale: 0 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: "easeOut",
      type: "spring",
      stiffness: 100,
    },
  },
};

export default function EstadoVoto() {
  const [votoInfo, setVotoInfo] = useState<VotoResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    const fetchVotoInfo = async () => {
      if (!session?.user?.id) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const response = await Votacion.verificarVoto({ token: session.user.token });
        setVotoInfo({ puedeVotar: response });
      } catch (err: any) {
        setError("Error al obtener el estado de voto");
        console.error("Error fetching vote status:", err);
      } finally {
        setLoading(false);
      }
    };

    if (status === "authenticated") {
      fetchVotoInfo();
    }
  }, [session?.user?.id, status]);

  // Redirect to login if not authenticated
  if (status === "unauthenticated") {
    router.push("/auth/signin");
    return null;
  }

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mb-4 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver
          </Button>
          
          <h1 className="text-3xl font-bold text-center">
            Estado de Votación
          </h1>
          <p className="text-center text-muted-foreground mt-2">
            Verifica tu capacidad para participar en las elecciones
          </p>
        </motion.div>

        {/* Content Card */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-6"
        >
          <Card className="shadow-lg border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
            <CardHeader className="text-center pb-2">
              <CardTitle className="text-xl">
                {session?.user?.name || "Usuario"}
              </CardTitle>
              <CardDescription>
                {session?.user?.email}
              </CardDescription>
            </CardHeader>

            <CardContent className="pt-6">
              {loading ? (
                <motion.div
                  variants={itemVariants}
                  className="flex flex-col items-center justify-center py-12 space-y-4"
                >
                  <Loader2 className="animate-spin h-12 w-12" />
                  <p className="text-lg text-muted-foreground">
                    Verificando estado de votación...
                  </p>
                </motion.div>
              ) : error ? (
                <motion.div
                  variants={itemVariants}
                  className="flex flex-col items-center justify-center py-12 space-y-4"
                >
                  <AlertCircle className="h-16 w-16" />
                  <div className="text-center">
                    <p className="text-lg font-semibold mb-2">
                      Error al verificar estado
                    </p>
                    <p className="text-muted-foreground">{error}</p>
                    <Button
                      variant="outline"
                      onClick={() => window.location.reload()}
                      className="mt-4"
                    >
                      Intentar nuevamente
                    </Button>
                  </div>
                </motion.div>
              ) : votoInfo ? (
                <motion.div
                  variants={itemVariants}
                  className="flex flex-col items-center justify-center py-8 space-y-6"
                >
                  {/* Icon */}
                  <motion.div variants={iconVariants}>
                    {votoInfo.puedeVotar ? (
                      <div className="relative">
                        <CheckCircle className="h-24 w-24 drop-shadow-lg" />
                        <motion.div
                          className="absolute inset-0 rounded-full bg-primary/20"
                          animate={{
                            scale: [1, 1.2, 1],
                            opacity: [0.5, 0, 0.5],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut",
                          }}
                        />
                      </div>
                    ) : (
                      <div className="relative">
                        <XCircle className="h-24 w-24 drop-shadow-lg" />
                        <motion.div
                          className="absolute inset-0 rounded-full bg-destructive/20"
                          animate={{
                            scale: [1, 1.2, 1],
                            opacity: [0.5, 0, 0.5],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut",
                          }}
                        />
                      </div>
                    )}
                  </motion.div>

                  {/* Status Message */}
                  <div className="text-center space-y-2">
                    <motion.h2
                      variants={itemVariants}
                      className="text-2xl font-bold"
                    >
                      {votoInfo.puedeVotar 
                        ? "✓ Habilitado para Votar" 
                        : "✗ No Habilitado para Votar"
                      }
                    </motion.h2>
                    
                    <motion.p
                      variants={itemVariants}
                      className="text-lg"
                    >
                      {votoInfo.puedeVotar 
                        ? "Tienes todos los requisitos necesarios para participar en las elecciones."
                        : "No cumples con los requisitos necesarios para votar."
                      }
                    </motion.p>

                    {/* Reason for not being able to vote */}
                    {!votoInfo.puedeVotar && votoInfo.motivo && (
                      <motion.div
                        variants={itemVariants}
                        className="mt-4 p-4 bg-destructive/10 rounded-lg border border-destructive/20"
                      >
                        <p className="text-sm font-medium">
                          Motivo: {votoInfo.motivo}
                        </p>
                      </motion.div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <motion.div
                    variants={itemVariants}
                    className="flex flex-col sm:flex-row gap-3 w-full max-w-md"
                  >
                    {votoInfo.puedeVotar ? (
                      <>
                        <Button
                          size="lg"
                          onClick={() => router.push("/votar")}
                          className="flex-1"
                        >
                          Ir a Votar
                        </Button>
                        <Button
                          variant="outline"
                          size="lg"
                          onClick={() => router.push("/resultados")}
                          className="flex-1"
                        >
                          Ver Resultados
                        </Button>
                      </>
                    ) : (
                      <Button
                        variant="outline"
                        size="lg"
                        onClick={() => router.push("/contacto")}
                        className="w-full"
                      >
                        Contactar Soporte
                      </Button>
                    )}
                  </motion.div>
                </motion.div>
              ) : null}
            </CardContent>
          </Card>

          {/* Additional Info Card */}
          <motion.div variants={itemVariants}>
            <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
              <CardContent className="pt-6">
                <div className="text-center text-sm text-blue-800 dark:text-blue-200">
                  <p className="font-medium mb-2">¿Necesitas ayuda?</p>
                  <p>
                    Si tienes dudas sobre tu estado de votación, puedes contactar 
                    al soporte técnico o consultar las preguntas frecuentes.
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}