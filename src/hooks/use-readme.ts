import { ApiWrapper } from "@/models/ApiWrapper";
import { PPartido } from "@/models/PPartido";
import { API_BASE_PUBLIC } from "@/utils/config";
import axios from "axios";
import { DateTime } from "luxon"; // o usar Intl como alternativa


const humanizeDate = (isoDate: string, format: 'short' | 'medium' = 'medium'): string => {
  const date = DateTime.fromISO(isoDate);

  const formats = {
    short: date.toLocaleString(DateTime.DATE_SHORT),
    medium: date.toLocaleString(DateTime.DATETIME_MED),
    long: date.toLocaleString(DateTime.DATETIME_HUGE)
  };

  return formats[format];
};
export async function fetchServicios(): Promise<ApiWrapper<PPartido[]>> {
  try {
    const response = await axios.get<ApiWrapper<PPartido[]>>(`${API_BASE_PUBLIC}/public/elecciones`);
    return response.data;
  } catch (error) {
    console.log(error);
    console.error("Error al obtener servicios desde el backend:", error);
    throw error;
  }
}
