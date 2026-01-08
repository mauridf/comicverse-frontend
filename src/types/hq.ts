export enum TipoSerie {
    Mensal = 1,
    OneShot = 2,
    MiniSerie = 3,
    CrossOver = 4,
    Encadernado = 5,
    Omnibus = 6,
    GraphicNovel = 7,
    Evento = 8,
    Outros = 9
}

export enum StatusHQ {
    EmAndamento = 1,
    Cancelada = 2,
    Concluido = 3,
    Descontinuado = 4,
    Paralizado = 5,
    Outros = 6
}

export const TipoSerieLabel: Record<TipoSerie, string> = {
  [TipoSerie.Mensal]: 'Mensal',
  [TipoSerie.OneShot]: 'One Shot',
  [TipoSerie.MiniSerie]: 'Mini Série',
  [TipoSerie.CrossOver]: 'Cross Over',
  [TipoSerie.Encadernado]: 'Encadernado',
  [TipoSerie.Omnibus]: 'Omnibus',
  [TipoSerie.GraphicNovel]: 'Graphic Novel',
  [TipoSerie.Evento]: 'Evento',
  [TipoSerie.Outros]: 'Outro'
};

export const StatusHQLabel: Record<StatusHQ, string> = {
  [StatusHQ.EmAndamento]: 'Em Andamento',
  [StatusHQ.Cancelada]: 'Cancelada',
  [StatusHQ.Concluido]: 'Concluído',
  [StatusHQ.Descontinuado]: 'Descontinuado',
  [StatusHQ.Paralizado]: 'Paralizado',
  [StatusHQ.Outros]: 'Outros'
};

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

export interface HQ {
  id: string;
  nome: string;
  tipoSerie: TipoSerie;
  tipoSerieDescricao: string;
  anoLancamento: string;
  totalEdicoes: string;
  edicoesLidas: number;
  progressoLeitura: number;
  status: StatusHQ;
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

export interface HQRequest {
  nome: string;
  tipoSerie: TipoSerie;
  anoLancamento: string;
  totalEdicoes: string;
  status: StatusHQ;
  sinopse: string;
  observacoes: string;
  urlCapa: string;
  urlDownload: string;
  editoraIds: string[];
  personagemIds: string[];
  equipeIds: string[];
}

export interface BuscaHQParams {
  nome?: string;
  editoraId?: string;
  personagemId?: string;
  equipeId?: string;
  tipoSerie?: string;
  status?: string;
  pagina?: number;
  tamanhoPagina?: number;
}