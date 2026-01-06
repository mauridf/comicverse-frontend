import api from './config';
import { 
  LoginRequest, 
  LoginResponse, 
  RegistroRequest, 
  RegistroResponse,
  AlterarSenhaRequest,
  AtualizarUsuarioRequest,
  Usuario 
} from '../types/auth';

export const authApi = {
  // Login - tipo explícito para evitar confusão
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>('/api/Auth/login', data);
    return response.data;
  },
  
  // Registrar
  registrar: async (data: RegistroRequest): Promise<RegistroResponse> => {
    const response = await api.post<RegistroResponse>('/api/Auth/registrar', data);
    return response.data;
  },
  
  // Trocar senha (Auth)
  trocarSenha: async (data: AlterarSenhaRequest): Promise<void> => {
    await api.put('/api/Auth/alterar-senha', data);
  },
  
  // Validar token
  validarToken: async (): Promise<void> => {
    await api.get('/api/Auth/validar');
  },
  
  // Obter dados do usuário atual
  getMe: async (): Promise<Usuario> => {
    const response = await api.get<Usuario>('/api/Usuarios/me');
    return response.data;
  },
  
  // Atualizar dados do usuário
  atualizarMe: async (data: AtualizarUsuarioRequest): Promise<Usuario> => {
    const response = await api.put<Usuario>('/api/Usuarios/me', data);
    return response.data;
  },
  
  // Alterar senha (Usuarios)
  alterarSenha: async (data: AlterarSenhaRequest): Promise<void> => {
    await api.put('/api/Usuarios/alterar-senha', data);
  },
};