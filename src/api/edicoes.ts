import api from './config';
import { Edicao, EdicaoRequest, BuscaEdicaoParams } from '../types/edicao';

export const edicoesApi = {
  // Obter edição por ID
  obterPorId: async (id: string): Promise<Edicao> => {
    const response = await api.get<Edicao>(`/api/Edicoes/${id}`);
    return response.data;
  },

  // Listar edições por HQ
  listarPorHQ: async (hqId: string): Promise<Edicao[]> => {
    const response = await api.get<Edicao[]>(`/api/Edicoes/hq/${hqId}`);
    return response.data;
  },

  // Buscar edições com filtros
  buscar: async (params: BuscaEdicaoParams): Promise<Edicao[]> => {
    const response = await api.get<Edicao[]>('/api/Edicoes/buscar', { params });
    return response.data;
  },

  // Cadastrar nova edição
  cadastrar: async (data: EdicaoRequest): Promise<Edicao> => {
    const response = await api.post<Edicao>('/api/Edicoes', data);
    return response.data;
  },

  // Atualizar edição
  atualizar: async (id: string, data: EdicaoRequest): Promise<Edicao> => {
    const response = await api.put<Edicao>(`/api/Edicoes/${id}`, data);
    return response.data;
  },

  // Excluir edição
  excluir: async (id: string): Promise<void> => {
    await api.delete(`/api/Edicoes/${id}`);
  },

  // Listar edições lidas
  listarLidas: async (): Promise<Edicao[]> => {
    const response = await api.get<Edicao[]>('/api/Edicoes/lidas');
    return response.data;
  },

  // Listar edições não lidas
  listarNaoLidas: async (): Promise<Edicao[]> => {
    const response = await api.get<Edicao[]>('/api/Edicoes/nao-lidas');
    return response.data;
  },

  // Listar edições por ranking
  listarPorRanking: async (ranking: number): Promise<Edicao[]> => {
    const response = await api.get<Edicao[]>(`/api/Edicoes/ranking/${ranking}`);
    return response.data;
  },

  // Obter top edições rankeadas
  obterTopRankeadas: async (quantidade = 10): Promise<Edicao[]> => {
    const response = await api.get<Edicao[]>('/api/Edicoes/top-rankeadas', {
      params: { quantidade }
    });
    return response.data;
  },

  // Marcar como lida/não lida
  marcarLida: async (id: string, lida: boolean): Promise<void> => {
    await api.patch(`/api/Edicoes/${id}/marcar-lida`, lida);
  },

  // Atribuir ranking
  atribuirRanking: async (id: string, ranking: number): Promise<void> => {
    await api.post(`/api/Edicoes/${id}/rankear`, ranking);
  },
};