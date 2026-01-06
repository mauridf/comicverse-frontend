import api from './config';
import { Editora, EditoraRequest } from '../types/editora';

export const editorasApi = {
  // Listar todas as editoras
  listar: async (): Promise<Editora[]> => {
    const response = await api.get<Editora[]>('/api/Editoras');
    return response.data;
  },

  // Obter editora por ID
  obterPorId: async (id: string): Promise<Editora> => {
    const response = await api.get<Editora>(`/api/Editoras/${id}`);
    return response.data;
  },

  // Listar editoras por HQ
  listarPorHQ: async (hqId: string): Promise<Editora[]> => {
    const response = await api.get<Editora[]>(`/api/Editoras/hq/${hqId}`);
    return response.data;
  },

  // Registrar nova editora
  registrar: async (data: EditoraRequest): Promise<Editora> => {
    const response = await api.post<Editora>('/api/Editoras', data);
    return response.data;
  },

  // Atualizar editora
  atualizar: async (id: string, data: EditoraRequest): Promise<Editora> => {
    const response = await api.put<Editora>(`/api/Editoras/${id}`, data);
    return response.data;
  },

  // Excluir editora
  excluir: async (id: string): Promise<void> => {
    await api.delete(`/api/Editoras/${id}`);
  },
};