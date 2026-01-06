export interface LoginRequest {
  email: string;
  senha: string;
}

export interface LoginResponse {
  token: string;
  expiraEm: string;
  usuario: Usuario;
}

export interface RegistroRequest {
  nome: string;
  email: string;
  senha: string;
  confirmarSenha: string;
  telefone: string;
}

export interface RegistroResponse {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  criadoEm: string;
}

export interface Usuario {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  criadoEm: string;
}

export interface AlterarSenhaRequest {
  senhaAtual: string;
  novaSenha: string;
  confirmarNovaSenha: string;
}

export interface AtualizarUsuarioRequest {
  nome: string;
  telefone: string;
}

export interface ErrorResponse {
  type: string;
  title: string;
  status: number;
  detail: string;
  instance: string;
  additionalProp1: string;
  additionalProp2: string;
  additionalProp3: string;
}