export interface Edicao {
  id: string;
  hqId: string;
  hqNome: string;
  numero: string;
  titulo: string;
  sinopse: string;
  observacoes: string;
  urlDownload: string;
  lida: boolean;
  ranking: number; // 0-5, onde 0 = não rankeado
  criadoEm: string;
  atualizadoEm: string;
}

export interface EdicaoRequest {
  id?: string;
  hqId: string;
  numero: string;
  titulo: string;
  sinopse: string;
  observacoes: string;
  urlDownload: string;
  lida: boolean;
  ranking: number;
}

export interface BuscaEdicaoParams {
  hqId?: string;
  lida?: boolean;
  rankingMinimo?: number;
  rankingMaximo?: number;
  busca?: string;
  pagina?: number;
  tamanhoPagina?: number;
}

export interface EdicaoBasica {
  id: string;
  numero: string;
  titulo: string;
  lida: boolean;
  ranking: number;
}