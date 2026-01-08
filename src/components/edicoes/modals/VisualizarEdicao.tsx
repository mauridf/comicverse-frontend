import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Chip,
  Rating,
  Divider,
  Alert,
  CircularProgress,
} from '@mui/material';
import { edicoesApi } from '../../../api/edicoes';
import { Edicao } from '../../../types/edicao';

interface VisualizarEdicaoProps {
  open: boolean;
  onClose: () => void;
  edicaoId: string;
}

const VisualizarEdicao: React.FC<VisualizarEdicaoProps> = ({
  open,
  onClose,
  edicaoId,
}) => {
  const [edicao, setEdicao] = useState<Edicao | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open && edicaoId) {
      carregarEdicao();
    }
  }, [open, edicaoId]);

  const carregarEdicao = async () => {
    try {
      setLoading(true);
      const data = await edicoesApi.obterPorId(edicaoId);
      setEdicao(data);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Erro ao carregar edição');
    } finally {
      setLoading(false);
    }
  };

  const formatarData = (dataString: string) => {
    try {
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

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Detalhes da Edição</DialogTitle>
      
      <DialogContent sx={{ minHeight: 400 }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error">{error}</Alert>
        ) : edicao ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <Box>
                <Typography variant="h5" gutterBottom>
                  {edicao.titulo || `Edição #${edicao.numero}`}
                </Typography>
                <Typography variant="subtitle1" color="text.secondary">
                  HQ: {edicao.hqNome}
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Chip
                  label={`#${edicao.numero}`}
                  color="primary"
                  variant="outlined"
                />
                <Chip
                  label={edicao.lida ? 'Lida' : 'Não lida'}
                  color={edicao.lida ? 'success' : 'default'}
                />
              </Box>
            </Box>

            <Divider />

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography variant="subtitle1">Avaliação:</Typography>
              <Rating value={edicao.ranking / 2} readOnly size="large" />
              <Typography variant="h6" color="primary.main">
                {edicao.ranking.toFixed(1)}/5
              </Typography>
            </Box>

            {edicao.sinopse && (
              <>
                <Divider />
                <Typography variant="h6" gutterBottom>
                  Sinopse
                </Typography>
                <Typography variant="body1" paragraph sx={{ whiteSpace: 'pre-line' }}>
                  {edicao.sinopse}
                </Typography>
              </>
            )}

            {edicao.observacoes && (
              <>
                <Divider />
                <Typography variant="h6" gutterBottom>
                  Observações
                </Typography>
                <Typography variant="body1" paragraph sx={{ whiteSpace: 'pre-line' }}>
                  {edicao.observacoes}
                </Typography>
              </>
            )}

            {edicao.urlDownload && (
              <>
                <Divider />
                <Typography variant="h6" gutterBottom>
                  Download
                </Typography>
                <Typography variant="body2" color="primary">
                  <a href={edicao.urlDownload} target="_blank" rel="noopener noreferrer">
                    {edicao.urlDownload}
                  </a>
                </Typography>
              </>
            )}

            <Divider />

            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 3 }}>
              <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Criada em
                </Typography>
                <Typography variant="body2">
                  {formatarData(edicao.criadoEm)}
                </Typography>
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Última atualização
                </Typography>
                <Typography variant="body2">
                  {formatarData(edicao.atualizadoEm)}
                </Typography>
              </Box>
            </Box>
          </Box>
        ) : null}
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} variant="outlined">
          Fechar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default VisualizarEdicao;