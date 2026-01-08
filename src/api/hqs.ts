import api from './config';
import { HQ, HQRequest, BuscaHQParams } from '../types/hq';

export const hqsApi = {
  // Listar todas as HQs
  listar: async (): Promise<HQ[]> => {
    const response = await api.get<HQ[]>('/api/HQs');
    return response.data;
  },

  // Obter HQ por ID
  obterPorId: async (id: string): Promise<HQ> => {
    const response = await api.get<HQ>(`/api/HQs/${id}`);
    return response.data;
  },

  // Buscar HQs com filtros
  buscar: async (params: BuscaHQParams): Promise<HQ[]> => {
    const response = await api.get<HQ[]>('/api/HQs/buscar', { params });
    return response.data;
  },

  // Registrar nova HQ
  registrar: async (data: HQRequest): Promise<HQ> => {
    const response = await api.post<HQ>('/api/HQs', data);
    return response.data;
  },

  // Atualizar HQ
  atualizar: async (id: string, data: HQRequest): Promise<HQ> => {
    const response = await api.put<HQ>(`/api/HQs/${id}`, data);
    return response.data;
  },

  // Excluir HQ
  excluir: async (id: string): Promise<void> => {
    await api.delete(`/api/HQs/${id}`);
  },

  // Listar HQs por editora
  listarPorEditora: async (editoraId: string): Promise<HQ[]> => {
    const response = await api.get<HQ[]>(`/api/HQs/editora/${editoraId}`);
    return response.data;
  },

  // Listar HQs por personagem
  listarPorPersonagem: async (personagemId: string): Promise<HQ[]> => {
    const response = await api.get<HQ[]>(`/api/HQs/personagem/${personagemId}`);
    return response.data;
  },

  // Listar HQs por equipe
  listarPorEquipe: async (equipeId: string): Promise<HQ[]> => {
    const response = await api.get<HQ[]>(`/api/HQs/equipe/${equipeId}`);
    return response.data;
  },

  // Listar HQs por tipo de série
  listarPorTipoSerie: async (tipoSerie: string): Promise<HQ[]> => {
    const response = await api.get<HQ[]>(`/api/HQs/tipo-serie/${tipoSerie}`);
    return response.data;
  },

  // Listar HQs por status
  listarPorStatus: async (status: string): Promise<HQ[]> => {
    const response = await api.get<HQ[]>(`/api/HQs/status/${status}`);
    return response.data;
  },

  // Adicionar editora à HQ
  adicionarEditora: async (hqId: string, editoraId: string): Promise<void> => {
    await api.post(`/api/HQs/${hqId}/editoras/${editoraId}`);
  },

  // Remover editora da HQ
  removerEditora: async (hqId: string, editoraId: string): Promise<void> => {
    await api.delete(`/api/HQs/${hqId}/editoras/${editoraId}`);
  },

  // Adicionar personagem à HQ
  adicionarPersonagem: async (hqId: string, personagemId: string): Promise<void> => {
    await api.post(`/api/HQs/${hqId}/personagens/${personagemId}`);
  },

  // Remover personagem da HQ
  removerPersonagem: async (hqId: string, personagemId: string): Promise<void> => {
    await api.delete(`/api/HQs/${hqId}/personagens/${personagemId}`);
  },

  // Adicionar equipe à HQ
  adicionarEquipe: async (hqId: string, equipeId: string): Promise<void> => {
    await api.post(`/api/HQs/${hqId}/equipes/${equipeId}`);
  },

  // Remover equipe da HQ
  removerEquipe: async (hqId: string, equipeId: string): Promise<void> => {
    await api.delete(`/api/HQs/${hqId}/equipes/${equipeId}`);
  },
};