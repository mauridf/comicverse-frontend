export enum TipoPersonagem {
  Heroi = 1,
  Vilao = 2,
  AntiHeroi = 3,
  PersonagemHistorico = 4,
  Fabula = 5,
  Animacao = 6,
  Outro = 7
}

export const TipoPersonagemLabel: Record<TipoPersonagem, string> = {
  [TipoPersonagem.Heroi]: 'Herói',
  [TipoPersonagem.Vilao]: 'Vilão',
  [TipoPersonagem.AntiHeroi]: 'Anti-Herói',
  [TipoPersonagem.PersonagemHistorico]: 'Personagem Histórico',
  [TipoPersonagem.Fabula]: 'Fábula',
  [TipoPersonagem.Animacao]: 'Animação',
  [TipoPersonagem.Outro]: 'Outro'
};

export interface Personagem {
  id: string;
  nome: string;
  resumo: string;
  urlImagem: string;
  tipo: TipoPersonagem;
}

export interface PersonagemRequest {
  nome: string;
  resumo: string;
  urlImagem: string;
  tipo: TipoPersonagem;
}