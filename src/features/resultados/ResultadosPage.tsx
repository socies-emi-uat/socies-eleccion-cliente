"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
} from "recharts";

import { motion } from "framer-motion";
import { useState, useMemo } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface Resultado {
  candidato: string;
  votos: number;
  proceso: string;
}

const dataMock: Resultado[] = [
  { candidato: "María López", votos: 3400, proceso: "Elecciones Generales 2025" },
  { candidato: "Juan Pérez", votos: 2900, proceso: "Elecciones Generales 2025" },
  { candidato: "Voto Blanco", votos: 300, proceso: "Elecciones Generales 2025" },

  { candidato: "A favor", votos: 4000, proceso: "Referéndum Constitucional" },
  { candidato: "En contra", votos: 1800, proceso: "Referéndum Constitucional" },

  { candidato: "Lista A", votos: 500, proceso: "Elección Estudiantil" },
  { candidato: "Lista B", votos: 700, proceso: "Elección Estudiantil" },
];

const colores = ["#4ade80", "#60a5fa", "#facc15", "#fb7185", "#a78bfa", "#34d399", "#f97316"];

export default function ResultadosPage() {
  const router = useRouter();
  const [proceso, setProceso] = useState("Elecciones Generales 2025");

  const procesosDisponibles = Array.from(new Set(dataMock.map((r) => r.proceso)));

  const resultadosFiltrados = useMemo(() => {
    return dataMock.filter((r) => r.proceso === proceso);
  }, [proceso]);

  const totalVotos = resultadosFiltrados.reduce((acc, r) => acc + r.votos, 0);

  return (
    <div className="min-h-screen px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-6"
        >
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mb-4 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver
          </Button>

          <h1 className="text-3xl font-bold text-center">Resultados Electorales</h1>
          <p className="text-center text-muted-foreground mt-2">
            Visualiza los resultados de los procesos finalizados.
          </p>
        </motion.div>

        {/* Filtro */}
        <div className="mb-6 max-w-sm mx-auto">
          <label className="text-sm mb-1 block text-center">Selecciona un proceso</label>
          <Select value={proceso} onValueChange={setProceso}>
            <SelectTrigger>
              <SelectValue placeholder="Selecciona un proceso" />
            </SelectTrigger>
            <SelectContent>
              {procesosDisponibles.map((p) => (
                <SelectItem key={p} value={p}>
                  {p}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Resultados */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card con gráfico de barras */}
          <Card>
            <CardHeader>
              <CardTitle>Distribución de votos</CardTitle>
              <CardDescription>Total: {totalVotos} votos</CardDescription>
            </CardHeader>
            <CardContent className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={resultadosFiltrados}>
                  <XAxis dataKey="candidato" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="votos" fill="#4f46e5">
                    {resultadosFiltrados.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={colores[index % colores.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Card con gráfico de pastel */}
          <Card>
            <CardHeader>
              <CardTitle>Participación</CardTitle>
              <CardDescription>Votos por opción</CardDescription>
            </CardHeader>
            <CardContent className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={resultadosFiltrados}
                    dataKey="votos"
                    nameKey="candidato"
                    cx="50%"
                    cy="50%"
                    outerRadius={90}
                    fill="#8884d8"
                    label
                  >
                    {resultadosFiltrados.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={colores[index % colores.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Tabla resumen */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Resumen</CardTitle>
            <CardDescription>Detalles por opción</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Candidato / Opción</TableHead>
                  <TableHead className="text-right">Votos</TableHead>
                  <TableHead className="text-right">% del total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {resultadosFiltrados.map((res, index) => (
                  <TableRow key={res.candidato}>
                    <TableCell>{res.candidato}</TableCell>
                    <TableCell className="text-right">{res.votos}</TableCell>
                    <TableCell className="text-right">
                      {((res.votos / totalVotos) * 100).toFixed(1)}%
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
