import api from './config';
import { Personagem, PersonagemRequest, TipoPersonagem } from '../types/personagem';

export const personagensApi = {
  // Listar todos os personagens
  listar: async (): Promise<Personagem[]> => {
    const response = await api.get<Personagem[]>('/api/Personagens');
    return response.data;
  },

  // Obter personagem por ID
  obterPorId: async (id: string): Promise<Personagem> => {
    const response = await api.get<Personagem>(`/api/Personagens/${id}`);
    return response.data;
  },

  // Listar personagens por HQ
  listarPorHQ: async (hqId: string): Promise<Personagem[]> => {
    const response = await api.get<Personagem[]>(`/api/Personagens/hq/${hqId}`);
    return response.data;
  },

  // Listar personagens por tipo
  listarPorTipo: async (tipo: TipoPersonagem): Promise<Personagem[]> => {
    const response = await api.get<Personagem[]>(`/api/Personagens/tipo/${tipo}`);
    return response.data;
  },

  // Obter personagem por nome
  obterPorNome: async (nome: string): Promise<Personagem> => {
    const response = await api.get<Personagem>(`/api/Personagens/${nome}`);
    return response.data;
  },

  // Registrar novo personagem
  registrar: async (data: PersonagemRequest): Promise<Personagem> => {
    const response = await api.post<Personagem>('/api/Personagens', data);
    return response.data;
  },

  // Atualizar personagem
  atualizar: async (id: string, data: PersonagemRequest): Promise<Personagem> => {
    const response = await api.put<Personagem>(`/api/Personagens/${id}`, data);
    return response.data;
  },

  // Excluir personagem
  excluir: async (id: string): Promise<void> => {
    await api.delete(`/api/Personagens/${id}`);
  },
};