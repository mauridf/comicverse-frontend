// Dashboard Geral
export interface DashboardGeral {
  totalHQs: number;
  totalEdicoes: number;
  totalPersonagens: number;
  totalEditoras: number;
  totalEquipes: number;
  edicoesLidas: number;
  edicoesNaoLidas: number;
  percentualLeitura: number;
  mediaRankingGeral: number;
  hQsPorTipoSerie: Record<string, number>;
  hQsPorStatus: Record<string, number>;
  personagensPorTipo: Record<string, number>;
  topHQs: HQResumo[];
  topEdicoes: EdicaoResumo[];
  hQsRecentes: HQResumo[];
  diasConsecutivosLeitura: number;
  hQsCompletadasEsteMes: number;
  edicoesLidasEstaSemana: number;
  proximasLeituras: HQResumo[];
}

// Dashboard HQs
export interface DashboardHQs {
  totalHQs: number;
  totalEdicoes: number;
  edicoesLidas: number;
  edicoesNaoLidas: number;
  percentualLeitura: number;
  mediaRankingGeral: number;
  hQsPorTipoSerie: Record<string, number>;
  hQsPorStatus: Record<string, number>;
  topRanked: HQDetalhada[];
  recentes: HQDetalhada[];
}

// Dashboard Edições
export interface DashboardEdicoes {
  total: number;
  lidas: number;
  naoLidas: number;
  percentualLidas: number;
  distribuicaoRanking: Record<string, number>;
  melhoresAvaliadas: EdicaoDetalhada[];
  recentes: EdicaoDetalhada[];
}

// Dashboard Coleção
export interface DashboardColecao {
  editorasComMaisHQs: Record<string, number>;
  personagensMaisFrequentes: Record<string, number>;
  equipesMaisFrequentes: Record<string, number>;
  editorasFaltantes: string[];
  personagensFaltantes: string[];
}

// Dashboard Progresso
export interface DashboardProgresso {
  progressoUltimos30Dias: ProgressoDiario[];
  totalLeiturasEsteMes: number;
  totalLeiturasMesPassado: number;
  variacaoLeituras: number;
  diasMaiorLeitura: string[];
}

// Dashboard Recomendações
export interface DashboardRecomendacoes {
  baseadoNoHistorico: HQResumo[];
  editorasFavoritas: HQResumo[];
  personagensFavoritos: HQResumo[];
  completarColecao: HQResumo[];
}

// Interfaces auxiliares
export interface HQResumo {
  id: string;
  nome: string;
  urlCapa: string;
  tipoSerie: string;
  mediaRanking: number;
  totalEdicoes: number;
  edicoesLidas: number;
  progressoLeitura: number;
}

export interface EdicaoResumo {
  id: string;
  numero: string;
  titulo: string;
  hqNome: string;
  hqId: string;
  ranking: number;
  criadoEm: string;
}

export interface HQDetalhada {
  id: string;
  nome: string;
  tipoSerie: number;
  tipoSerieDescricao: string;
  anoLancamento: string;
  totalEdicoes: string;
  status: number;
  statusDescricao: string;
  sinopse: string;
  observacoes: string;
  urlCapa: string;
  urlDownload: string;
  usuarioId: string;
  usuarioNome: string;
  criadoEm: string;
  atualizadoEm: string;
  editoras: EditoraResumo[];
  personagens: PersonagemResumo[];
  equipes: EquipeResumo[];
  edicoes: EdicaoBasica[];
  totalEdicoesLidas: number;
  totalEdicoesNaoLidas: number;
  mediaRanking: number;
}

export interface EdicaoDetalhada {
  id: string;
  hqId: string;
  hqNome: string;
  numero: string;
  titulo: string;
  sinopse: string;
  observacoes: string;
  urlDownload: string;
  lida: boolean;
  ranking: number;
  criadoEm: string;
  atualizadoEm: string;
}

export interface EditoraResumo {
  id: string;
  nome: string;
  urlLogotipo: string;
}

export interface PersonagemResumo {
  id: string;
  nome: string;
  urlImagem: string;
  tipo: number;
}

export interface EquipeResumo {
  id: string;
  nome: string;
  urlImagem: string;
}

export interface EdicaoBasica {
  id: string;
  numero: string;
  titulo: string;
  lida: boolean;
  ranking: number;
}

export interface ProgressoDiario {
  data: string;
  edicoesLidas: number;
  tempoLeituraMinutos: number;
}