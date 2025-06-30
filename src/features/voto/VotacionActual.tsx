"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { formatDistanceToNowStrict, parseISO } from "date-fns";
import { Loader2 } from "lucide-react";

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
  const [proceso, setProceso] = useState<ProcesoElectoral | null>(null);
  const [loading, setLoading] = useState(true);
  const [restante, setRestante] = useState<string>("");
  const [candidaturaActiva, setCandidaturaActiva] = useState<Candidatura | null>(null);

  useEffect(() => {
    // Simulación de fetch desde la API
    setTimeout(() => {
      fetch("/api/mock-proceso")
        .then(() => {
          const respuesta = {
            nombreProceso: "Presidencial",
            descripcionProceso: "Elección presidencial: 1-2 vueltas",
            fechaInicio: "2024-01-01T00:00:00",
            fechaFin: "2024-12-31T23:59:59",
            candidaturas: [
                {
                    "nombreCandidatura": "Ronald Diaz - MAS",
                    "lema": "Antes muertos que esclavos",
                    "partido": {
                        "id": 1,
                        "nombrePartido": "Movimiento al Socialismo",
                        "sigla": "MAS",
                        "lema": "Progreso para todos",
                        "logoUrl": "partidos/01JYNM0Z9NBZMQGD78DDA027FG.png",
                        "colorHex": "#225fde",
                        "pais": "Bolivia",
                        "representanteLegal": "Carlos Gomez",
                        "descripcion": "Un nuevo partido politico",
                        "direccionSede": "Av. Central 456",
                        "paginaWeb": "https://nuevopartido.bo",
                        "telefonoContacto": "76543210",
                        "correoContacto": "contacto@nuevopartido.bo",
                        "fechaFundacion": "2025-06-13T00:00:00",
                        "estado": true
                    },
                    "candidato": {
                        "foto": "candidatos/01JYDXB79AKXH9RPDVK5DFNZ4X.jpg",
                        "id": 1,
                        "nombreCandidato": "Ronald",
                        "apPaterno": "Diaz",
                        "apMaterno": "Otrillas",
                        "fechaNacimiento": "1997-06-04",
                        "fotoUrl": "candidatos/01JYDXB79AKXH9RPDVK5DFNZ4X.jpg",
                        "propuesta": "Por una bolivia libre de corrupcion",
                        "cargo": "Sin cargo",
                        "estado": "Activo"
                    }
                },
                {
                    "nombreCandidatura": "Alianza Popular",
                    "lema": "Comprometidos con la Patria, enfocados en salvar el pais y un futuro mejor",
                    "partido": {
                        "id": 3,
                        "nombrePartido": "Alianza Politica",
                        "sigla": "AP",
                        "lema": "Comprometidos con la Patria, enfocados en salvar el pais y un futuro mejor",
                        "colorHex": "#29bdfa",
                        "pais": "Bolivia",
                        "representanteLegal": "Sandra Hinojosa Núñez",
                        "direccionSede": "Avenida Mariscal Santa Cruz Nro. 1364, Edificio",
                        "telefonoContacto": "73745454",
                        "correoContacto": "alianzaPopular2025@gmail.com",
                        "fechaFundacion": "2025-04-17T00:00:00",
                        "estado": true
                    },
                    "candidato": {
                        "foto": "candidatos/01JYDXB79AKXH9RPDVK5DFNZ4X.jpg",
                        "id": 3,
                        "nombreCandidato": "Andronico",
                        "apPaterno": "Rodriguez",
                        "apMaterno": "Ledezma",
                        "fechaNacimiento": "1988-11-11",
                        "fotoUrl": null,
                        "propuesta": "propone mejorar condiciones laborales, renovar empresas estatales, fomentar la economía del conocimiento y reducir impuestos a sectores privados.",
                        "cargo": "Sin cargo",
                        "estado": "Activo"
                    }
                }
            ] // Aquí se colocan las candidaturas reales
          };
          setProceso(respuesta as ProcesoElectoral);
          setLoading(false);
        });
    }, 1000);
  }, []);

  useEffect(() => {
    if (!proceso) return;
    const interval = setInterval(() => {
      const distancia = formatDistanceToNowStrict(parseISO(proceso.fechaFin), { addSuffix: true });
      setRestante(distancia);
    }, 1000);
    return () => clearInterval(interval);
  }, [proceso]);

  const handleVotar = (candidatura: Candidatura) => {
    alert(`Has votado por: ${candidatura.nombreCandidatura}`);
    // Aquí puedes implementar la lógica real de votación
  };

  if (loading || !proceso) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="animate-spin h-10 w-10" />
        <span className="ml-2 text-muted-foreground">Cargando proceso electoral...</span>
      </div>
    );
  }

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
                <Button onClick={() => handleVotar(candidatura)} className="flex-1">
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
    </div>
  );
}
