import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Tabs,
  Tab,
  Skeleton,
  Alert,
  Button,
  Chip,
  Card,
  CardContent,
  Rating,
} from '@mui/material';
import {
  LibraryBooks as HQsIcon,
  MenuBook as EdicoesIcon,
  Collections as ColecaoIcon,
  Timeline as ProgressoIcon,
  Recommend as RecomendacoesIcon,
  BarChart as EstatisticasIcon,
  TrendingUp,
  TrendingDown,
  Star,
  Visibility,
  CollectionsBookmark,
} from '@mui/icons-material';
import { dashboardApi } from '../../api/dashboard';
import {
  DashboardGeral,
  DashboardHQs,
  DashboardEdicoes,
} from '../../types/dashboard';
import StatCard from '../../components/dashboard/StatCard';
import ProgressCircle from '../../components/dashboard/ProgressCircle';
import HQCard from '../../components/dashboard/HQCard';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index }) => {
  return (
    <div role="tabpanel" hidden={value !== index}>
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
};

// Dados mock para desenvolvimento
const mockDashboardGeral: DashboardGeral = {
  totalHQs: 12,
  totalEdicoes: 156,
  totalPersonagens: 45,
  totalEditoras: 8,
  totalEquipes: 6,
  edicoesLidas: 89,
  edicoesNaoLidas: 67,
  percentualLeitura: 57,
  mediaRankingGeral: 4.2,
  hQsPorTipoSerie: {
    'Super-heróis': 8,
    'Fantasia': 3,
    'Sci-fi': 1
  },
  hQsPorStatus: {
    'Em andamento': 6,
    'Completa': 4,
    'Planejada': 2
  },
  personagensPorTipo: {
    'Herói': 25,
    'Vilão': 15,
    'Coadjuvante': 5
  },
  topHQs: [
    {
      id: '1',
      nome: 'Batman: Ano Um',
      urlCapa: 'https://example.com/batman.jpg',
      tipoSerie: 'Super-heróis',
      mediaRanking: 4.8,
      totalEdicoes: 4,
      edicoesLidas: 4,
      progressoLeitura: 100
    },
    {
      id: '2',
      nome: 'Watchmen',
      urlCapa: 'https://example.com/watchmen.jpg',
      tipoSerie: 'Super-heróis',
      mediaRanking: 4.7,
      totalEdicoes: 12,
      edicoesLidas: 8,
      progressoLeitura: 67
    }
  ],
  topEdicoes: [
    {
      id: '1',
      numero: '#1',
      titulo: 'O Cavaleiro das Trevas',
      hqNome: 'Batman: Ano Um',
      hqId: '1',
      ranking: 5,
      criadoEm: '2024-01-15'
    }
  ],
  hQsRecentes: [
    {
      id: '3',
      nome: 'Homem-Aranha: A Última Caçada de Kraven',
      urlCapa: 'https://example.com/spiderman.jpg',
      tipoSerie: 'Super-heróis',
      mediaRanking: 4.5,
      totalEdicoes: 6,
      edicoesLidas: 2,
      progressoLeitura: 33
    }
  ],
  diasConsecutivosLeitura: 7,
  hQsCompletadasEsteMes: 2,
  edicoesLidasEstaSemana: 5,
  proximasLeituras: []
};

const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [useMockData, setUseMockData] = useState(false);
  
  // Estados para os dados
  const [dashboardGeral, setDashboardGeral] = useState<DashboardGeral | null>(null);
  const [dashboardHQs, setDashboardHQs] = useState<DashboardHQs | null>(null);
  const [dashboardEdicoes, setDashboardEdicoes] = useState<DashboardEdicoes | null>(null);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      setUseMockData(false);
      
      // Tenta buscar dados reais
      const geralData = await dashboardApi.getDashboardGeral();
      setDashboardGeral(geralData);
      
      // Busca dados específicos baseado na tab ativa
      switch (activeTab) {
        case 0: // Visão Geral (já carregado)
          break;
        case 1: // HQs
          const hqsData = await dashboardApi.getDashboardHQs();
          setDashboardHQs(hqsData);
          break;
        case 2: // Edições
          const edicoesData = await dashboardApi.getDashboardEdicoes();
          setDashboardEdicoes(edicoesData);
          break;
        default:
          // Para as outras tabs, não buscamos dados ainda
          break;
      }
    } catch (err: any) {
      console.error('Erro ao carregar dashboard:', err);
      
      // Se for erro 400 (Bad Request), provavelmente o endpoint não existe
      if (err.response?.status === 400 || err.response?.status === 404) {
        setError('Alguns endpoints do dashboard ainda não estão disponíveis. Usando dados de exemplo para demonstração.');
        setUseMockData(true);
        
        // Usa dados mock para desenvolvimento
        setDashboardGeral(mockDashboardGeral);
        setDashboardHQs(null);
        setDashboardEdicoes(null);
      } else {
        setError(err.response?.data?.detail || 'Erro ao carregar dados do dashboard');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [activeTab]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleRetry = () => {
    fetchDashboardData();
  };

  const handleUseMockData = () => {
    setUseMockData(true);
    setDashboardGeral(mockDashboardGeral);
    setError(null);
    setLoading(false);
  };

  const formatNumber = (num: number) => {
    return num.toLocaleString('pt-BR');
  };

  // Função para renderizar cards em linha responsiva
  const renderCardRow = (cards: React.ReactNode[]) => {
    return (
      <Box sx={{ 
        display: 'flex', 
        flexWrap: 'wrap', 
        gap: 3,
        mb: 4 
      }}>
        {cards.map((card, index) => (
          <Box key={index} sx={{ 
            flex: '1 1 300px',
            minWidth: '250px'
          }}>
            {card}
          </Box>
        ))}
      </Box>
    );
  };

  // Função para renderizar lista de HQs responsiva
  const renderHQsGrid = (hqs: any[]) => {
    if (!hqs || hqs.length === 0) {
      return (
        <Alert severity="info" sx={{ mt: 2 }}>
          Nenhuma HQ disponível para exibir.
        </Alert>
      );
    }

    return (
      <Box sx={{ 
        display: 'flex', 
        flexWrap: 'wrap', 
        gap: 3 
      }}>
        {hqs.map((hq) => (
          <Box key={hq.id} sx={{ 
            flex: '1 1 250px',
            maxWidth: '300px'
          }}>
            <HQCard hq={hq} />
          </Box>
        ))}
      </Box>
    );
  };

  // Dados atuais (reais ou mock)
  const currentData = dashboardGeral || mockDashboardGeral;

  return (
    <Container maxWidth="xl" sx={{ mt: 2, mb: 4 }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Visualize estatísticas e informações sobre sua coleção de HQs
        </Typography>
        
        {useMockData && (
          <Alert 
            severity="info" 
            sx={{ mt: 2 }}
            action={
              <Button color="inherit" size="small" onClick={handleRetry}>
                Tentar dados reais
              </Button>
            }
          >
            Usando dados de exemplo. Alguns endpoints ainda não estão disponíveis no backend.
          </Alert>
        )}
      </Box>

      <Paper sx={{ mb: 3 }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab icon={<EstatisticasIcon />} label="Visão Geral" />
          <Tab icon={<HQsIcon />} label="HQs" />
          <Tab icon={<EdicoesIcon />} label="Edições" />
          <Tab icon={<ColecaoIcon />} label="Coleção" />
          <Tab icon={<ProgressoIcon />} label="Progresso" />
          <Tab icon={<RecomendacoesIcon />} label="Recomendações" />
        </Tabs>
      </Paper>

      {error && !useMockData ? (
        <Alert 
          severity="warning" 
          action={
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button color="inherit" size="small" onClick={handleRetry}>
                Tentar novamente
              </Button>
              <Button color="inherit" size="small" onClick={handleUseMockData}>
                Usar dados de exemplo
              </Button>
            </Box>
          }
          sx={{ mb: 3 }}
        >
          {error}
        </Alert>
      ) : null}

      {/* Tab 1: Visão Geral */}
      <TabPanel value={activeTab} index={0}>
        {loading ? (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
            {[...Array(8)].map((_, index) => (
              <Box key={index} sx={{ flex: '1 1 300px', minWidth: '250px' }}>
                <Skeleton variant="rectangular" height={120} />
              </Box>
            ))}
          </Box>
        ) : (
          <>
            {/* Cards de Estatísticas - Primeira linha */}
            {renderCardRow([
              <StatCard
                key="totalHQs"
                title="Total de HQs"
                value={formatNumber(currentData.totalHQs)}
                icon={<HQsIcon />}
                color="primary"
              />,
              <StatCard
                key="totalEdicoes"
                title="Total de Edições"
                value={formatNumber(currentData.totalEdicoes)}
                icon={<EdicoesIcon />}
                color="secondary"
              />,
              <StatCard
                key="edicoesLidas"
                title="Edições Lidas"
                value={formatNumber(currentData.edicoesLidas)}
                subtitle={`${currentData.edicoesNaoLidas} não lidas`}
                icon={<Visibility />}
                color="success"
              />,
              <StatCard
                key="mediaRanking"
                title="Média de Avaliação"
                value={currentData.mediaRankingGeral.toFixed(1)}
                icon={<Star />}
                color="warning"
              />
            ])}

            {/* Segunda linha de cards */}
            {renderCardRow([
              <StatCard
                key="personagens"
                title="Personagens"
                value={formatNumber(currentData.totalPersonagens)}
                color="info"
              />,
              <StatCard
                key="editoras"
                title="Editoras"
                value={formatNumber(currentData.totalEditoras)}
                color="info"
              />,
              <StatCard
                key="equipes"
                title="Equipes"
                value={formatNumber(currentData.totalEquipes)}
                color="info"
              />,
              <Box key="progresso" sx={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center',
                minHeight: '120px'
              }}>
                <ProgressCircle
                  value={currentData.percentualLeitura}
                  size={100}
                  label="Progresso"
                  subtitle={`${currentData.edicoesLidas}/${currentData.totalEdicoes}`}
                  color="success"
                />
              </Box>
            ])}

            {/* Estatísticas de leitura */}
            <Paper sx={{ p: 3, mb: 4 }}>
              <Typography variant="h6" gutterBottom>
                Estatísticas de Leitura
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
                <Box sx={{ flex: '1 1 300px' }}>
                  <StatCard
                    title="Dias Consecutivos"
                    value={currentData.diasConsecutivosLeitura}
                    color="primary"
                    trend="up"
                  />
                </Box>
                <Box sx={{ flex: '1 1 300px' }}>
                  <StatCard
                    title="HQs Completadas"
                    value={currentData.hQsCompletadasEsteMes}
                    subtitle="este mês"
                    color="success"
                  />
                </Box>
                <Box sx={{ flex: '1 1 300px' }}>
                  <StatCard
                    title="Edições Lidas"
                    value={currentData.edicoesLidasEstaSemana}
                    subtitle="esta semana"
                    color="info"
                  />
                </Box>
              </Box>
            </Paper>

            {/* Distribuição por Tipo de Série */}
            {Object.keys(currentData.hQsPorTipoSerie).length > 0 && (
              <Paper sx={{ p: 3, mb: 4 }}>
                <Typography variant="h6" gutterBottom>
                  Distribuição por Tipo de Série
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {Object.entries(currentData.hQsPorTipoSerie).map(([tipo, quantidade]) => (
                    <Chip
                      key={tipo}
                      label={`${tipo}: ${quantidade}`}
                      variant="outlined"
                      color="primary"
                    />
                  ))}
                </Box>
              </Paper>
            )}

            {/* Top HQs */}
            <Paper sx={{ p: 3, mb: 4 }}>
              <Typography variant="h6" gutterBottom>
                Top HQs Mais Bem Avaliadas
              </Typography>
              {renderHQsGrid(currentData.topHQs.slice(0, 4))}
            </Paper>

            {/* HQs Recentes */}
            {currentData.hQsRecentes && currentData.hQsRecentes.length > 0 && (
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  HQs Adicionadas Recentemente
                </Typography>
                {renderHQsGrid(currentData.hQsRecentes.slice(0, 4))}
              </Paper>
            )}
          </>
        )}
      </TabPanel>

      {/* Tab 2: HQs - Simplificada por enquanto */}
      <TabPanel value={activeTab} index={1}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Dashboard de HQs
          </Typography>
          <Alert severity="info">
            Esta seção está em desenvolvimento. Em breve terá estatísticas específicas de HQs.
          </Alert>
          <Box sx={{ mt: 3 }}>
            <Typography variant="body1">
              Total de HQs na coleção: <strong>{currentData.totalHQs}</strong>
            </Typography>
            <Typography variant="body1" sx={{ mt: 1 }}>
              Progresso geral de leitura: <strong>{currentData.percentualLeitura}%</strong>
            </Typography>
          </Box>
        </Paper>
      </TabPanel>

      {/* Tab 3: Edições - Simplificada por enquanto */}
      <TabPanel value={activeTab} index={2}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Dashboard de Edições
          </Typography>
          <Alert severity="info">
            Esta seção está em desenvolvimento. Em breve terá estatísticas específicas de edições.
          </Alert>
          <Box sx={{ mt: 3 }}>
            <Typography variant="body1">
              Total de edições: <strong>{currentData.totalEdicoes}</strong>
            </Typography>
            <Typography variant="body1" sx={{ mt: 1 }}>
              Edições lidas: <strong>{currentData.edicoesLidas}</strong>
            </Typography>
            <Typography variant="body1" sx={{ mt: 1 }}>
              Edições não lidas: <strong>{currentData.edicoesNaoLidas}</strong>
            </Typography>
          </Box>
        </Paper>
      </TabPanel>

      {/* Tabs 4, 5, 6 - Em desenvolvimento */}
      <TabPanel value={activeTab} index={3}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Dashboard de Coleção
          </Typography>
          <Alert severity="info">
            Esta seção será implementada em breve.
          </Alert>
        </Paper>
      </TabPanel>

      <TabPanel value={activeTab} index={4}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Dashboard de Progresso
          </Typography>
          <Alert severity="info">
            Esta seção será implementada em breve.
          </Alert>
        </Paper>
      </TabPanel>

      <TabPanel value={activeTab} index={5}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Dashboard de Recomendações
          </Typography>
          <Alert severity="info">
            Esta seção será implementada em breve.
          </Alert>
        </Paper>
      </TabPanel>
    </Container>
  );
};

export default Dashboard;