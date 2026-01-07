export interface Equipe {
  id: string;
  nome: string;
  resumo: string;
  urlImagem: string;
}

export interface EquipeRequest {
  nome: string;
  resumo: string;
  urlImagem: string;
}