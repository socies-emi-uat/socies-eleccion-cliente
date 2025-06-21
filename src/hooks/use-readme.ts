import axios from "axios";
import { DateTime } from "luxon"; // o usar Intl como alternativa

export interface Perfil {
  celular: string
  fecha_creacion: string
  grado: string
  id_perfil: number
  profesion: any
}
export interface Candidato {
  id_candidato: number;
  nombre: string;
  apellidos: string;
  partido: string;
  logo_partido: string;
  foto_candidato: string;
  fecha_creacion: string;
}
export interface Partido {
  id_partido: number
  nombre: string
  logo: string
}

export interface Rol {
  fecha_creacion: string
  id_rol: number
  nombre: string
}

export interface Usuario {
  apellido: string
  email: string
  estado: boolean
  fecha_creacion: string
  id_usuario: number
  nombre: string
  perfil: Perfil
  rol: Rol
  username: string
}

export interface Servicio {
  date: string
  description: string
  id_servicio: number
  id_usuario_fk: number
  name: string
  old_pricing: number
  pricing: number
  status: boolean
  url: string
  usuario: Usuario
}

export interface Resource {
  id_servicio: number;
  name: string;
  url: string;
  description: string;
  category: string;
  date: string;
  old_pricing: number;
  pricing: number;
  status: boolean;
  servicio?: Servicio; // puedes tiparlo más adelante si lo necesitas
}
const humanizeDate = (isoDate: string, format: 'short' | 'medium' = 'medium'): string => {
  const date = DateTime.fromISO(isoDate);

  const formats = {
    short: date.toLocaleString(DateTime.DATE_SHORT),
    medium: date.toLocaleString(DateTime.DATETIME_MED),
    long: date.toLocaleString(DateTime.DATETIME_HUGE)
  };

  return formats[format];
};
export async function fetchServicios(): Promise<Resource[]> {
  try {
    const response = await axios.get<Resource[]>("https://bramaca.vercel.app/api/incluyes");
    const data = response.data;

    const resources: Resource[] = data.map((item) => ({
      id_servicio: item.id_servicio,
      name: item.name,
      url: item.url,
      description: item.description,
      category: item.category || "Sin categoría",
      date: item.date,
      old_pricing: item.old_pricing,
      pricing: item.pricing,
      status: item.status,
      servicio: item.servicio,
    }));

    return resources;
  } catch (error) {
    console.log(error);
    console.error("Error al obtener servicios desde el backend:", error);
    throw error;
  }
}
