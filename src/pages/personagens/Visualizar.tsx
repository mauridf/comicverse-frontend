import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  Alert,
  CircularProgress,
  Card,
  CardContent,
  CardMedia,
  Chip,
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowBack as ArrowBackIcon, Edit as EditIcon } from '@mui/icons-material';
import { personagensApi } from '../../api/personagens';
import { Personagem, TipoPersonagemLabel } from '../../types/personagem';

const Visualizar: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [personagem, setPersonagem] = useState<Personagem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPersonagem = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const data = await personagensApi.obterPorId(id);
        setPersonagem(data);
      } catch (err: any) {
        setError(err.response?.data?.detail || 'Erro ao carregar personagem');
      } finally {
        setLoading(false);
      }
    };

    fetchPersonagem();
  }, [id]);

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="300px">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error || !personagem) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert severity="error">
          {error || 'Personagem não encontrado'}
        </Alert>
        <Button 
          startIcon={<ArrowBackIcon />} 
          onClick={() => navigate('/personagens')}
          sx={{ mt: 2 }}
        >
          Voltar para a lista
        </Button>
      </Container>
    );
  }

  const getChipColor = (tipo: number) => {
    switch (tipo) {
      case 1: return 'success';
      case 2: return 'error';
      case 3: return 'warning';
      default: return 'default';
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 2, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Button 
          startIcon={<ArrowBackIcon />} 
          onClick={() => navigate('/personagens')}
        >
          Voltar para a lista
        </Button>
        
        <Button
          variant="contained"
          startIcon={<EditIcon />}
          onClick={() => navigate(`/personagens/editar/${id}`)}
        >
          Editar
        </Button>
      </Box>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom align="center">
          {personagem.nome}
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
          {personagem.urlImagem ? (
            <CardMedia
              component="img"
              image={personagem.urlImagem}
              alt={personagem.nome}
              sx={{ 
                width: '100%', 
                maxWidth: 400,
                height: 400,
                objectFit: 'cover',
                borderRadius: 2,
                border: '2px solid #ddd',
              }}
            />
          ) : (
            <Box
              sx={{
                width: '100%',
                maxWidth: 400,
                height: 400,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: 'grey.100',
                borderRadius: 2,
                border: '2px solid #ddd',
              }}
            >
              <Typography variant="h6" color="text.secondary">
                Sem imagem
              </Typography>
            </Box>
          )}

          <Card sx={{ width: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Tipo:
                  </Typography>
                  <Chip
                    label={TipoPersonagemLabel[personagem.tipo as keyof typeof TipoPersonagemLabel] || 'Desconhecido'}
                    color={getChipColor(personagem.tipo)}
                    variant="filled"
                  />
                </Box>

                <Box>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Resumo:
                  </Typography>
                  <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                    {personagem.resumo || 'Sem resumo'}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    ID:
                  </Typography>
                  <Typography variant="body2" fontFamily="monospace">
                    {personagem.id}
                  </Typography>
                </Box>

                {personagem.urlImagem && (
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      URL da Imagem:
                    </Typography>
                    <Typography variant="body2" sx={{ wordBreak: 'break-all' }}>
                      {personagem.urlImagem}
                    </Typography>
                  </Box>
                )}
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Paper>
    </Container>
  );
};

export default Visualizar;