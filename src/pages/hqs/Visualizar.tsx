import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Alert,
  Button,
  Chip,
  Rating,
  LinearProgress,
  Card,
  CardMedia,
  CardContent,
  Divider,
  Snackbar,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Edit as EditIcon,
  Download as DownloadIcon,
  Image as ImageIcon,
} from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import { hqsApi } from '../../api/hqs';
import { HQ, TipoSerieLabel, StatusHQLabel } from '../../types/hq';
import EdicoesHQ from '../../components/hqs/EdicoesHQ';

const VisualizarHQ: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [hq, setHq] = useState<HQ | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
  });

  useEffect(() => {
    if (id) {
      carregarHQ(id);
    }
  }, [id]);

  const carregarHQ = async (hqId: string) => {
    try {
      setLoading(true);
      const data = await hqsApi.obterPorId(hqId);
      setHq(data);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Erro ao carregar HQ');
    } finally {
      setLoading(false);
    }
  };

  const handleEditarClick = () => {
    if (hq) {
      navigate(`/hqs/editar/${hq.id}`);
    }
  };

  const formatarData = (dataString: string) => {
    try {
      // Formatação simples sem date-fns para evitar dependência
      const data = new Date(dataString);
      return data.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dataString;
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <Typography>Carregando HQ...</Typography>
        </Box>
      </Container>
    );
  }

  if (error || !hq) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert 
          severity="error" 
          action={
            <Button color="inherit" size="small" onClick={() => navigate('/hqs')}>
              Voltar para lista
            </Button>
          }
        >
          {error || 'HQ não encontrada'}
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 2, mb: 4 }}>
      <Box sx={{ mb: 3 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/hqs')}
          sx={{ mb: 2 }}
        >
          Voltar para lista
        </Button>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 2 }}>
          <Box>
            <Typography variant="h3" gutterBottom>
              {hq.nome}
            </Typography>
            
            <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
              <Chip
                label={TipoSerieLabel[hq.tipoSerie]}
                color="primary"
                variant="outlined"
              />
              <Chip
                label={StatusHQLabel[hq.status]}
                color={
                  hq.status === 1 ? 'info' : 
                  hq.status === 2 ? 'success' : 
                  hq.status === 3 ? 'error' : 'default'
                }
              />
              {hq.anoLancamento && (
                <Chip
                  label={`Ano: ${hq.anoLancamento}`}
                  variant="outlined"
                />
              )}
              <Chip
                label={`Edições: ${hq.totalEdicoes}`}
                variant="outlined"
              />
            </Box>
          </Box>

          <Button
            variant="contained"
            startIcon={<EditIcon />}
            onClick={handleEditarClick}
          >
            Editar HQ
          </Button>
        </Box>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
        {/* Coluna da esquerda - Informações principais */}
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h5" gutterBottom color="primary">
              Informações da Série
            </Typography>
            
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 3, mb: 3 }}>
              <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Progresso de Leitura
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 1 }}>
                  <LinearProgress 
                    variant="determinate" 
                    value={hq.progressoLeitura} 
                    sx={{ flexGrow: 1, height: 10 }}
                  />
                  <Typography variant="body2" fontWeight="bold">
                    {hq.progressoLeitura}%
                  </Typography>
                </Box>
                <Typography variant="caption" color="text.secondary">
                  {hq.edicoesLidas} de {hq.totalEdicoes} edições lidas
                </Typography>
              </Box>

              <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Avaliação Média
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                  <Rating value={hq.mediaRanking / 2} readOnly precision={0.5} size="large" />
                  <Typography variant="h6" fontWeight="bold">
                    {hq.mediaRanking.toFixed(1)}
                  </Typography>
                </Box>
                <Typography variant="caption" color="text.secondary">
                  Baseado em {hq.edicoes.filter(e => e.ranking > 0).length} avaliações
                </Typography>
              </Box>
            </Box>

            {hq.sinopse && (
              <>
                <Divider sx={{ my: 3 }} />
                <Typography variant="h6" gutterBottom>
                  Sinopse
                </Typography>
                <Typography variant="body1" paragraph sx={{ whiteSpace: 'pre-line' }}>
                  {hq.sinopse}
                </Typography>
              </>
            )}

            {hq.observacoes && (
              <>
                <Divider sx={{ my: 3 }} />
                <Typography variant="h6" gutterBottom>
                  Observações
                </Typography>
                <Typography variant="body1" paragraph sx={{ whiteSpace: 'pre-line' }}>
                  {hq.observacoes}
                </Typography>
              </>
            )}

            {/* Editoras */}
            {hq.editoras.length > 0 && (
              <>
                <Divider sx={{ my: 3 }} />
                <Typography variant="h6" gutterBottom>
                  Editoras
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, justifyContent: 'center' }}>
                  {hq.editoras.map((editora) => (
                    <Card key={editora.id} sx={{ maxWidth: 120, mb: 1 }}>
                      {editora.urlLogotipo ? (
                        <CardMedia
                          component="img"
                          height="80"
                          image={editora.urlLogotipo}
                          alt={editora.nome}
                          sx={{ objectFit: 'contain', p: 1 }}
                        />
                      ) : (
                        <Box sx={{ height: 80, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <ImageIcon sx={{ fontSize: 40, color: 'text.secondary' }} />
                        </Box>
                      )}
                      <CardContent sx={{ p: 1, '&:last-child': { pb: 1 } }}>
                        <Typography variant="body2" align="center" noWrap>
                          {editora.nome}
                        </Typography>
                      </CardContent>
                    </Card>
                  ))}
                </Box>
              </>
            )}

            {/* Metadados */}
            <Divider sx={{ my: 3 }} />
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 3 }}>
              <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Criado por
                </Typography>
                <Typography variant="body1">
                  {hq.usuarioNome}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {formatarData(hq.criadoEm)}
                </Typography>
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Última atualização
                </Typography>
                <Typography variant="body1">
                  {formatarData(hq.atualizadoEm)}
                </Typography>
              </Box>
            </Box>
          </Paper>

          {/* Personagens e Equipes */}
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3, mb: 3 }}>
            {hq.personagens.length > 0 && (
              <Paper sx={{ p: 3, flex: 1 }}>
                <Typography variant="h6" gutterBottom>
                  Personagens ({hq.personagens.length})
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {hq.personagens.map((personagem) => (
                    <Chip
                      key={personagem.id}
                      label={personagem.nome}
                      avatar={
                        personagem.urlImagem ? (
                          <Box
                            component="img"
                            src={personagem.urlImagem}
                            alt={personagem.nome}
                            sx={{ width: 24, height: 24, borderRadius: '50%' }}
                          />
                        ) : undefined
                      }
                      variant="outlined"
                      sx={{ m: 0.5 }}
                    />
                  ))}
                </Box>
              </Paper>
            )}

            {hq.equipes.length > 0 && (
              <Paper sx={{ p: 3, flex: 1 }}>
                <Typography variant="h6" gutterBottom>
                  Equipes ({hq.equipes.length})
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {hq.equipes.map((equipe) => (
                    <Chip
                      key={equipe.id}
                      label={equipe.nome}
                      avatar={
                        equipe.urlImagem ? (
                          <Box
                            component="img"
                            src={equipe.urlImagem}
                            alt={equipe.nome}
                            sx={{ width: 24, height: 24, borderRadius: '50%' }}
                          />
                        ) : undefined
                      }
                      variant="outlined"
                      sx={{ m: 0.5 }}
                    />
                  ))}
                </Box>
              </Paper>
            )}
          </Box>
        </Box>

        {/* Coluna da direita - Capa e Links */}
        <Box sx={{ width: { xs: '100%', md: 350 }, minWidth: { md: 350 } }}>
          <Paper sx={{ p: 3, mb: 3, position: 'sticky', top: 20 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              {hq.urlCapa ? (
                <CardMedia
                  component="img"
                  image={hq.urlCapa}
                  alt={`Capa de ${hq.nome}`}
                  sx={{
                    width: '100%',
                    maxWidth: 300,
                    height: 'auto',
                    borderRadius: 2,
                    mb: 2,
                    boxShadow: 3,
                  }}
                />
              ) : (
                <Box
                  sx={{
                    width: '100%',
                    maxWidth: 300,
                    height: 400,
                    bgcolor: 'grey.200',
                    borderRadius: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 2,
                  }}
                >
                  <ImageIcon sx={{ fontSize: 60, color: 'grey.400' }} />
                </Box>
              )}

              {hq.urlDownload && (
                <Button
                  fullWidth
                  variant="contained"
                  startIcon={<DownloadIcon />}
                  href={hq.urlDownload}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{ mb: 2 }}
                >
                  Acessar Download
                </Button>
              )}

              <Box sx={{ width: '100%', mt: 2 }}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Estatísticas
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  <Box sx={{ flex: '1 1 calc(50% - 8px)', minWidth: 120 }}>
                    <Paper variant="outlined" sx={{ p: 1, textAlign: 'center' }}>
                      <Typography variant="h6" color="success.main">
                        {hq.totalEdicoesLidas}
                      </Typography>
                      <Typography variant="caption">Lidas</Typography>
                    </Paper>
                  </Box>
                  <Box sx={{ flex: '1 1 calc(50% - 8px)', minWidth: 120 }}>
                    <Paper variant="outlined" sx={{ p: 1, textAlign: 'center' }}>
                      <Typography variant="h6" color="error.main">
                        {hq.totalEdicoesNaoLidas}
                      </Typography>
                      <Typography variant="caption">Faltam</Typography>
                    </Paper>
                  </Box>
                  <Box sx={{ flex: '1 1 calc(50% - 8px)', minWidth: 120 }}>
                    <Paper variant="outlined" sx={{ p: 1, textAlign: 'center' }}>
                      <Typography variant="h6">
                        {hq.totalEdicoes}
                      </Typography>
                      <Typography variant="caption">Total</Typography>
                    </Paper>
                  </Box>
                  <Box sx={{ flex: '1 1 calc(50% - 8px)', minWidth: 120 }}>
                    <Paper variant="outlined" sx={{ p: 1, textAlign: 'center' }}>
                      <Typography variant="h6" color="primary.main">
                        {hq.progressoLeitura}%
                      </Typography>
                      <Typography variant="caption">Progresso</Typography>
                    </Paper>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Paper>
        </Box>
      </Box>

      {/* Edições - Full width */}
      <Box sx={{ mt: 3 }}>
        <EdicoesHQ
          hqId={hq.id}
          hqNome={hq.nome}
          edicoes={hq.edicoes}
          onEdicoesChange={(novasEdicoes) => {
            // Atualizar HQ localmente se necessário
            setHq(prev => prev ? { ...prev, edicoes: novasEdicoes } : null);
          }}
          readOnly={false}
        />
      </Box>

      {/* Snackbar para feedback */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert 
          onClose={() => setSnackbar({ ...snackbar, open: false })} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default VisualizarHQ;