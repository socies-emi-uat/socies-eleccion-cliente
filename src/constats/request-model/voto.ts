import { ApiWrapper } from '@/models/ApiWrapper';
import { VTProcesoElectoral } from '@/models/VVoto';
import { API_BASE_PROTECTED } from '@/utils/config';
import axios, { AxiosError } from 'axios';

export const getProcesoElectoral = async (token: string): Promise<ApiWrapper<VTProcesoElectoral>> => {
  try {
    const response = await axios.get(`${API_BASE_PROTECTED}/procesos/activo`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    return response.data as ApiWrapper<VTProcesoElectoral>;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;

      console.error('Error en getProcesoElectoral:');
      console.error('Status:', axiosError.response?.status);
      console.error('Mensaje:', axiosError.response?.data);
    } else {
      console.error('Error inesperado en getProcesoElectoral:', error);
    }

    throw error; // puedes volver a lanzarlo o retornar un valor seguro
  }
};
