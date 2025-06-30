import { VTCandidatura, VTProcesoElectoral } from '@/models/VVoto';
import { ApiWrapper } from '@/models/ApiWrapper';

import { API_BASE_PROTECTED } from '@/utils/config';
import axios, { AxiosError } from 'axios';

export const getProcesoElectoral = async (token: string): Promise<ApiWrapper<VTProcesoElectoral>> => {
  try {
    console.log(token);
    const response = await axios.get(`${API_BASE_PROTECTED}/procesos/activo`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    console.log("response.data", response.data);

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

export const candidaturas = {
  async getAll({
    token
  }: {
    token: string;
  }): Promise<VTProcesoElectoral | null> {
    let procesoElectoral: ApiWrapper<VTProcesoElectoral> = await getProcesoElectoral(token);
    console.log(procesoElectoral);
    console.log(token);
    return procesoElectoral?.data ?? null;
  }
}

export const Votacion = {
  async verificarVoto({
    token
  }: {
    token: string;
  }): Promise<boolean> {
    try {
      const response = await axios.get(`${API_BASE_PROTECTED}/votos/estado`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data.success as boolean;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError;
        console.error('Error en verificarVoto:');
        console.error('Status:', axiosError.response?.status);
        console.error('Mensaje:', axiosError.response?.data);
      } else {
        console.error('Error inesperado en verificarVoto:', error);
      }

      // En caso de error, devolvemos false por defecto
      return false;
    }
  }
};
