"use client";

import React, { startTransition, useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { formatDistanceToNowStrict, parseISO } from "date-fns";
import { Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { VTCandidatura, VTProcesoElectoral } from "@/models/VVoto";

import { candidaturas as apiCandidaturas } from "@/constats/api-votar"; // correcto
import { toast } from "sonner";

interface Partido {
  nombrePartido: string;
  sigla: string;
  lema: string;
  colorHex: string;
  descripcion: string;
  paginaWeb?: string;
  telefonoContacto?: string;
  correoContacto?: string;
  representanteLegal?: string;
  logoUrl?: string;
}

interface Candidato {
  foto: string;
  nombreCandidato: string;
  apPaterno: string;
  apMaterno: string;
  fechaNacimiento: string;
  fotoUrl?: string;
  propuesta?: string;
  cargo: string;
  estado: string;
}

interface Candidatura {
  nombreCandidatura: string;
  lema: string;
  partido: Partido;
  candidato: Candidato;
}

interface ProcesoElectoral {
  nombreProceso: string;
  descripcionProceso: string;
  fechaInicio: string;
  fechaFin: string;
  candidaturas: Candidatura[];
}

export default function PaginaVotacionActual() {
  const [proceso, setProceso] = useState<VTProcesoElectoral | null>(null);
  const [loading, setLoading] = useState(true);
  const [restante, setRestante] = useState<string>("");
  const [candidaturaActiva, setCandidaturaActiva] = useState<VTCandidatura | null>(null);
  const [confirmarVoto, setConfirmarVoto] = useState<VTCandidatura | null>(null);
  const { data: session } = useSession();
  useEffect(() => {
    const fetchProceso = async () => {
      try {
        const respuesta = await apiCandidaturas.getAll({ token: session?.user?.token ?? "" });
        setProceso(respuesta as VTProcesoElectoral);
      } catch (err) {
        console.error("Error al cargar el proceso electoral", err);
      } finally {
        setLoading(false);
      }
    };
  
    if (session?.user?.token) {
      fetchProceso();
    }
  }, [session?.user?.token]);
  

  useEffect(() => {
    if (!proceso) return;
    const interval = setInterval(() => {
      const distancia = formatDistanceToNowStrict(parseISO(proceso.fechaFin), { addSuffix: true });
      setRestante(distancia);
    }, 1000);
    return () => clearInterval(interval);
  }, [proceso]);


  const handleVotar = (candidatura: VTCandidatura) => {
    setConfirmarVoto(null);
    startTransition(() => {
      let loading = toast.loading(`Cargando votación...`);
      setTimeout(() => {
        toast.success(`Votación exitosa`);
        toast.dismiss(loading);
      }, 2000);
    });
  };

  if (loading || !proceso) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="animate-spin h-10 w-10" />
        <span className="ml-2 text-muted-foreground">Cargando proceso electoral...</span>
      </div>
    );
  }

  const handleConfirmarVoto = (candidatura: VTCandidatura) => {
    handleVotar(candidatura);
    setConfirmarVoto(null);
  };

  return (
    <div className="max-w-5xl mx-auto p-4">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold">Proceso Actual: {proceso.nombreProceso}</h1>
        <p className="text-muted-foreground mt-2">{proceso.descripcionProceso}</p>
        <p className="mt-2 font-medium text-primary">Tiempo restante: {restante}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {proceso.candidaturas.map((candidatura, idx) => (
          <Card key={idx} className="border-2" style={{ borderColor: candidatura.partido.colorHex }}>
            <CardHeader>
              <CardTitle>{candidatura.nombreCandidatura}</CardTitle>
              <CardDescription>{candidatura.lema}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                {candidatura.candidato.fotoUrl ? (
                  <img
                    src={`data:image/jpeg;base64,${candidatura.candidato.foto}`}
                    alt="Candidato"
                    className="w-20 h-20 object-cover rounded-full border"
                  />
                ) : (
                  <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center">?</div>
                )}
                <div>
                  <p className="font-semibold">{candidatura.candidato.nombreCandidato} {candidatura.candidato.apPaterno}</p>
                  <p className="text-sm text-muted-foreground">{candidatura.candidato.cargo}</p>
                </div>
              </div>
              <div className="mt-4 flex gap-2">
                <Button onClick={() => setConfirmarVoto(candidatura)} className="flex-1">
                  Votar
                </Button>
                <Button variant="outline" onClick={() => setCandidaturaActiva(candidatura)} className="flex-1">
                  Ver Detalles
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={!!candidaturaActiva} onOpenChange={() => setCandidaturaActiva(null)}>
        <DialogContent>
          {candidaturaActiva && (
            <>
              <DialogHeader>
                <DialogTitle>{candidaturaActiva.nombreCandidatura}</DialogTitle>
                <DialogDescription>{candidaturaActiva.lema}</DialogDescription>
              </DialogHeader>
              <div className="flex flex-col gap-2 text-sm">
                <p><strong>Partido:</strong> {candidaturaActiva.partido.nombrePartido} ({candidaturaActiva.partido.sigla})</p>
                <p><strong>Representante:</strong> {candidaturaActiva.partido.representanteLegal}</p>
                <p><strong>Contacto:</strong> {candidaturaActiva.partido.correoContacto}</p>
                <p><strong>Web:</strong> <a href={candidaturaActiva.partido.paginaWeb} className="text-blue-600 underline">{candidaturaActiva.partido.paginaWeb}</a></p>
                <p><strong>Propuesta:</strong> {candidaturaActiva.candidato.propuesta}</p>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={!!confirmarVoto} onOpenChange={() => setConfirmarVoto(null)}>
        <DialogContent>
          {confirmarVoto && (
            <>
              <DialogHeader>
                <DialogTitle>Confirmar Voto</DialogTitle>
                <DialogDescription>
                  ¿Estás seguro que deseas votar por <strong>{confirmarVoto.nombreCandidatura}</strong>?
                </DialogDescription>
              </DialogHeader>
              <div className="flex justify-end gap-2 mt-4">
                <Button variant="outline" onClick={() => setConfirmarVoto(null)}>Cancelar</Button>
                <Button onClick={() => handleVotar(confirmarVoto)}>Confirmar Voto</Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
