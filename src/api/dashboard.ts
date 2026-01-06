import api from './config';
import {
  DashboardGeral,
  DashboardHQs,
  DashboardEdicoes,
  DashboardColecao,
  DashboardProgresso,
  DashboardRecomendacoes,
} from '../types/dashboard';

export const dashboardApi = {
  // Dashboard geral - Vamos compor com outros endpoints ou usar fallback
  getDashboardGeral: async (): Promise<DashboardGeral> => {
    try {
      // Primeiro tenta o endpoint principal
      const response = await api.get<DashboardGeral>('/api/Dashboard');
      return response.data;
    } catch (error) {
      console.log('🔍 Endpoint /api/Dashboard não disponível, usando fallback...');
      
      // Se não funcionar, tenta compor dados de outros endpoints
      try {
        const [hqsData, edicoesData] = await Promise.all([
          dashboardApi.getHQsDashboard(),
          dashboardApi.getEdicoesDashboard()
        ]);
        
        // Cria um dashboard geral básico com os dados disponíveis
        return {
          totalHQs: hqsData.totalHQs,
          totalEdicoes: hqsData.totalEdicoes,
          totalPersonagens: 0, // Não temos este dado ainda
          totalEditoras: 0,    // Não temos este dado ainda
          totalEquipes: 0,     // Não temos este dado ainda
          edicoesLidas: hqsData.edicoesLidas,
          edicoesNaoLidas: hqsData.edicoesNaoLidas,
          percentualLeitura: hqsData.percentualLeitura,
          mediaRankingGeral: hqsData.mediaRankingGeral,
          hQsPorTipoSerie: hqsData.hQsPorTipoSerie,
          hQsPorStatus: hqsData.hQsPorStatus,
          personagensPorTipo: {},
          topHQs: hqsData.topRanked?.slice(0, 5).map(hq => ({
            id: hq.id,
            nome: hq.nome,
            urlCapa: hq.urlCapa,
            tipoSerie: hq.tipoSerieDescricao,
            mediaRanking: hq.mediaRanking,
            totalEdicoes: hq.totalEdicoesLidas + hq.totalEdicoesNaoLidas,
            edicoesLidas: hq.totalEdicoesLidas,
            progressoLeitura: hq.totalEdicoesLidas + hq.totalEdicoesNaoLidas > 0 ? 
              (hq.totalEdicoesLidas / (hq.totalEdicoesLidas + hq.totalEdicoesNaoLidas)) * 100 : 0
          })) || [],
          topEdicoes: edicoesData.melhoresAvaliadas?.slice(0, 5).map(edicao => ({
            id: edicao.id,
            numero: edicao.numero,
            titulo: edicao.titulo,
            hqNome: edicao.hqNome,
            hqId: edicao.hqId,
            ranking: edicao.ranking,
            criadoEm: edicao.criadoEm
          })) || [],
          hQsRecentes: hqsData.recentes?.slice(0, 5).map(hq => ({
            id: hq.id,
            nome: hq.nome,
            urlCapa: hq.urlCapa,
            tipoSerie: hq.tipoSerieDescricao,
            mediaRanking: hq.mediaRanking,
            totalEdicoes: hq.totalEdicoesLidas + hq.totalEdicoesNaoLidas,
            edicoesLidas: hq.totalEdicoesLidas,
            progressoLeitura: hq.totalEdicoesLidas + hq.totalEdicoesNaoLidas > 0 ? 
              (hq.totalEdicoesLidas / (hq.totalEdicoesLidas + hq.totalEdicoesNaoLidas)) * 100 : 0
          })) || [],
          diasConsecutivosLeitura: 0,
          hQsCompletadasEsteMes: 0,
          edicoesLidasEstaSemana: 0,
          proximasLeituras: []
        };
      } catch (fallbackError) {
        console.error('🔍 Erro ao compor dados do dashboard:', fallbackError);
        throw new Error('Não foi possível obter dados do dashboard');
      }
    }
  },

  // Dashboard HQs - Usa endpoint alternativo
  getDashboardHQs: async (): Promise<DashboardHQs> => {
    try {
      const response = await api.get<DashboardHQs>('/api/Dashboard/hqs');
      return response.data;
    } catch (error) {
      console.log('🔍 Endpoint /api/Dashboard/hqs não disponível, tentando alternativo...');
      // Tenta endpoint alternativo
      const response = await api.get<DashboardHQs>('/api/HQs/dashboard');
      return response.data;
    }
  },

  // Dashboard Edições - Usa endpoint alternativo
  getDashboardEdicoes: async (): Promise<DashboardEdicoes> => {
    try {
      const response = await api.get<DashboardEdicoes>('/api/Dashboard/edicoes');
      return response.data;
    } catch (error) {
      console.log('🔍 Endpoint /api/Dashboard/edicoes não disponível, tentando alternativo...');
      // Tenta endpoint alternativo
      const response = await api.get<DashboardEdicoes>('/api/Edicoes/dashboard');
      return response.data;
    }
  },

  // Dashboard Coleção - Pode não estar implementado ainda
  getDashboardColecao: async (): Promise<DashboardColecao> => {
    try {
      const response = await api.get<DashboardColecao>('/api/Dashboard/colecao');
      return response.data;
    } catch (error) {
      console.log('🔍 Endpoint /api/Dashboard/colecao não disponível retornando vazio...');
      // Retorna dados vazios
      return {
        editorasComMaisHQs: {},
        personagensMaisFrequentes: {},
        equipesMaisFrequentes: {},
        editorasFaltantes: [],
        personagensFaltantes: []
      };
    }
  },

  // Dashboard Progresso - Pode não estar implementado ainda
  getDashboardProgresso: async (dias: number = 30): Promise<DashboardProgresso> => {
    try {
      const response = await api.get<DashboardProgresso>('/api/Dashboard/progresso', {
        params: { dias }
      });
      return response.data;
    } catch (error) {
      console.log('🔍 Endpoint /api/Dashboard/progresso não disponível retornando mock...');
      // Retorna dados mock para desenvolvimento
      return {
        progressoUltimos30Dias: Array.from({ length: 30 }, (_, i) => ({
          data: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString(),
          edicoesLidas: Math.floor(Math.random() * 5),
          tempoLeituraMinutos: Math.floor(Math.random() * 120)
        })),
        totalLeiturasEsteMes: Math.floor(Math.random() * 50),
        totalLeiturasMesPassado: Math.floor(Math.random() * 45),
        variacaoLeituras: Math.floor(Math.random() * 20) - 10,
        diasMaiorLeitura: ['Segunda', 'Sexta']
      };
    }
  },

  // Dashboard Recomendações - Pode não estar implementado ainda
  getDashboardRecomendacoes: async (): Promise<DashboardRecomendacoes> => {
    try {
      const response = await api.get<DashboardRecomendacoes>('/api/Dashboard/recomendacoes');
      return response.data;
    } catch (error) {
      console.log('🔍 Endpoint /api/Dashboard/recomendacoes não disponível retornando mock...');
      // Retorna dados mock para desenvolvimento
      return {
        baseadoNoHistorico: [],
        editorasFavoritas: [],
        personagensFavoritos: [],
        completarColecao: []
      };
    }
  },

  // Endpoints alternativos (que sabemos que existem)
  getHQsDashboard: async (): Promise<DashboardHQs> => {
    const response = await api.get<DashboardHQs>('/api/HQs/dashboard');
    return response.data;
  },

  getEdicoesDashboard: async (): Promise<DashboardEdicoes> => {
    const response = await api.get<DashboardEdicoes>('/api/Edicoes/dashboard');
    return response.data;
  },
};