"use client";

import React, { useMemo, useState } from "react";
import { format } from "date-fns";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  History,
  RefreshCcw,
  Search,
} from "lucide-react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface VotoRecord {
  hash: string;
  fecha: string;
  proceso: string;
  candidato: string;
  estado: "válido" | "anulado";
}

const mockVotos: VotoRecord[] = [
  {
    hash: "a7f9b3e1",
    fecha: "2025-03-15",
    proceso: "Elecciones Generales 2025",
    candidato: "Ronald Diaz - MAS",
    estado: "válido",
  },
  {
    hash: "c1e0d9a2",
    fecha: "2025-03-15",
    proceso: "Elecciones Generales 2025",
    candidato: "Alianza Popular",
    estado: "válido",
  },
  {
    hash: "d2f7a6b9",
    fecha: "2025-03-15",
    proceso: "Elecciones Generales 2025",
    candidato: "Ronald Diaz - MAS",
    estado: "anulado",
  },
  {
    hash: "e3b5d2c8",
    fecha: "2025-03-15",
    proceso: "Elecciones Generales 2025",
    candidato: "Ronald Diaz - MAS",
    estado: "válido",
  },
];

export default function HistorialVotosPage() {
  const router = useRouter();

  const [procesoFiltro, setProcesoFiltro] = useState<string>("all");
  const [fechaFiltro, setFechaFiltro] = useState<string>("");
  const [busqueda, setBusqueda] = useState<string>("");

  const procesosUnicos = Array.from(new Set(mockVotos.map((v) => v.proceso)));

  const votosFiltrados = useMemo(() => {
    return mockVotos.filter((voto) => {
      const coincideProceso =
        procesoFiltro === "all" ? true : voto.proceso === procesoFiltro;
      const coincideFecha = fechaFiltro
        ? voto.fecha === fechaFiltro
        : true;
      const coincideBusqueda =
        busqueda.trim().length === 0 ||
        voto.hash.toLowerCase().includes(busqueda.toLowerCase()) ||
        voto.candidato.toLowerCase().includes(busqueda.toLowerCase()) ||
        voto.proceso.toLowerCase().includes(busqueda.toLowerCase());

      return coincideProceso && coincideFecha && coincideBusqueda;
    });
  }, [procesoFiltro, fechaFiltro, busqueda]);

  return (
    <div className="min-h-screen px-4 py-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8"
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
            Historial General de Votación
          </h1>
          <p className="text-center text-muted-foreground mt-2">
            Visualiza los votos registrados en distintos procesos electorales.
          </p>
        </motion.div>

        {/* Card con filtros */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <History className="h-5 w-5" />
              Votos registrados
            </CardTitle>
            <CardDescription>
              Filtra por proceso, fecha o realiza una búsqueda general.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Filtros */}
            <div className="grid sm:grid-cols-4 gap-4">
              <div>
                <label className="text-sm mb-1 block">Proceso Electoral</label>
                <Select
                  onValueChange={setProcesoFiltro}
                  value={procesoFiltro}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Todos los procesos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    {procesosUnicos.map((proceso) => (
                      <SelectItem key={proceso} value={proceso}>
                        {proceso}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm mb-1 block">Fecha Exacta</label>
                <Input
                  type="date"
                  value={fechaFiltro}
                  onChange={(e) => setFechaFiltro(e.target.value)}
                />
              </div>

              <div className="col-span-2">
                <label className="text-sm mb-1 block">Buscar</label>
                <div className="relative">
                  <Input
                    type="text"
                    placeholder="Buscar por hash, candidato o proceso"
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                    className="pl-10"
                  />
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                </div>
              </div>
            </div>

            <div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setProcesoFiltro("all");
                  setFechaFiltro("");
                  setBusqueda("");
                }}
              >
                <RefreshCcw className="mr-2 h-4 w-4" />
                Limpiar Filtros
              </Button>
            </div>

            {/* Tabla */}
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Hash de Votación</TableHead>
                  <TableHead>Proceso</TableHead>
                  <TableHead>Candidato</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Estado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {votosFiltrados.length > 0 ? (
                  votosFiltrados.map((voto) => (
                    <TableRow key={voto.hash}>
                      <TableCell className="font-mono text-xs">
                        {voto.hash}
                      </TableCell>
                      <TableCell>{voto.proceso}</TableCell>
                      <TableCell>{voto.candidato}</TableCell>
                      <TableCell>
                        {format(new Date(voto.fecha), "dd/MM/yyyy")}
                      </TableCell>
                      <TableCell>
                        <span
                          className={`text-sm font-medium ${
                            voto.estado === "válido"
                              ? "text-green-600"
                              : "text-red-500"
                          }`}
                        >
                          {voto.estado}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                      No se encontraron votos con los criterios actuales.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
