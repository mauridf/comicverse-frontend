import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { Usuario, LoginResponse } from '../types/auth';
import { authApi } from '../api/auth';

interface AuthContextType {
  usuario: Usuario | null;
  token: string | null;
  loading: boolean;
  login: (email: string, senha: string) => Promise<void>;
  logout: () => void;
  registrar: (data: any) => Promise<void>;
  atualizarUsuario: (data: any) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Função segura para parsear JSON do localStorage
  const safeJsonParse = (jsonString: string | null): any => {
    if (!jsonString || jsonString === 'undefined' || jsonString === 'null') {
      return null;
    }
    
    try {
      return JSON.parse(jsonString);
    } catch (error) {
      console.error('🔍 Erro ao parsear JSON do localStorage:', error, 'String:', jsonString);
      return null;
    }
  };

  // Carregar dados do localStorage na inicialização
  useEffect(() => {
    console.log('🔍 AuthProvider: Carregando dados do localStorage');
    
    const storedToken = localStorage.getItem('token');
    const storedUsuario = safeJsonParse(localStorage.getItem('usuario'));
    
    console.log('🔍 Token do localStorage:', storedToken ? 'Presente' : 'Ausente');
    console.log('🔍 Usuário do localStorage:', storedUsuario);
    
    // Validação: token e usuário devem existir juntos
    if (storedToken && storedUsuario) {
      console.log('🔍 Dados válidos encontrados no localStorage');
      setToken(storedToken);
      setUsuario(storedUsuario);
      
      // Validar token em background (opcional)
      authApi.validarToken().catch((error) => {
        console.log('🔍 Token inválido ou expirado:', error);
        logout();
      });
    } else {
      console.log('🔍 Dados incompletos ou inválidos no localStorage. Limpando...');
      // Limpa dados inválidos
      if (storedToken && !storedUsuario) {
        localStorage.removeItem('token');
      }
      if (!storedToken && storedUsuario) {
        localStorage.removeItem('usuario');
      }
    }
    
    setLoading(false);
  }, []);

  const login = async (email: string, senha: string) => {
    console.log('🔍 Iniciando login para:', email);
    try {
      const response: LoginResponse = await authApi.login({ email, senha });
      
      console.log('🔍 Resposta do login:', response);
      
      if (!response || !response.token || !response.usuario) {
        throw new Error('Resposta inválida da API');
      }
      
      console.log('🔍 Login bem-sucedido!');
      console.log('🔍 Usuário:', response.usuario.nome);
      
      setToken(response.token);
      setUsuario(response.usuario);
      localStorage.setItem('token', response.token);
      localStorage.setItem('usuario', JSON.stringify(response.usuario));
      
      console.log('🔍 Estado atualizado e localStorage salvo');
    } catch (error: any) {
      console.error('🔍 Erro no login:', error);
      
      if (error.response) {
        throw new Error(error.response.data?.detail || 'Erro na autenticação');
      } else if (error.request) {
        throw new Error('Não foi possível conectar ao servidor');
      } else {
        throw error;
      }
    }
  };

  const logout = () => {
    console.log('🔍 Executando logout');
    setToken(null);
    setUsuario(null);
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
  };

  const registrar = async (data: any) => {
    try {
      console.log('🔍 Registrando novo usuário:', data.email);
      const response = await authApi.registrar(data);
      console.log('🔍 Registro bem-sucedido:', response);
      
      await login(data.email, data.senha);
    } catch (error: any) {
      console.error('🔍 Erro no registro:', error);
      throw error;
    }
  };

  const atualizarUsuario = async (data: any) => {
    try {
      const response = await authApi.atualizarMe(data);
      setUsuario(response);
      localStorage.setItem('usuario', JSON.stringify(response));
    } catch (error) {
      console.error('🔍 Erro ao atualizar usuário:', error);
      throw error;
    }
  };

  console.log('🔍 AuthProvider estado atual:', { 
    usuario: usuario?.email, 
    hasToken: !!token,
    loading 
  });

  return (
    <AuthContext.Provider value={{
      usuario,
      token,
      loading,
      login,
      logout,
      registrar,
      atualizarUsuario,
    }}>
      {children}
    </AuthContext.Provider>
  );
};