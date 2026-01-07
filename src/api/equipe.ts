import api from './config';
import { Equipe, EquipeRequest } from '../types/equipe';

export const equipeApi = {
  // Listar todos as equipes
  listar: async (): Promise<Equipe[]> => {
    const response = await api.get<Equipe[]>('/api/Equipes');
    return response.data;
  },

  // Obter equipe por ID
  obterPorId: async (id: string): Promise<Equipe> => {
    const response = await api.get<Equipe>(`/api/Equipes/${id}`);
    return response.data;
  },

  // Listar personagens por HQ
  listarPorHQ: async (hqId: string): Promise<Equipe[]> => {
    const response = await api.get<Equipe[]>(`/api/Equipes/hq/${hqId}`);
    return response.data;
  },

  // Obter equipe por nome
  obterPorNome: async (nome: string): Promise<Equipe> => {
    const response = await api.get<Equipe>(`/api/Equipes/${nome}`);
    return response.data;
  },

  // Registrar nova equipe
  registrar: async (data: EquipeRequest): Promise<Equipe> => {
    const response = await api.post<Equipe>('/api/Equipes', data);
    return response.data;
  },

  // Atualizar equipe
  atualizar: async (id: string, data: EquipeRequest): Promise<Equipe> => {
    const response = await api.put<Equipe>(`/api/Equipes/${id}`, data);
    return response.data;
  },

  // Excluir equipe
  excluir: async (id: string): Promise<void> => {
    await api.delete(`/api/Equipes/${id}`);
  },
}