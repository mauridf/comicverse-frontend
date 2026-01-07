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
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowBack as ArrowBackIcon, Edit as EditIcon } from '@mui/icons-material';
import { equipeApi } from '../../api/equipe';
import { Equipe } from '../../types/equipe';

const Visualizar: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [equipe, setEquipe] = useState<Equipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEquipe = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const data = await equipeApi.obterPorId(id);
        setEquipe(data);
      } catch (err: any) {
        setError(err.response?.data?.detail || 'Erro ao carregar equipe');
      } finally {
        setLoading(false);
      }
    };

    fetchEquipe();
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

  if (error || !equipe) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert severity="error">
          {error || 'Equipe não encontrada'}
        </Alert>
        <Button 
          startIcon={<ArrowBackIcon />} 
          onClick={() => navigate('/equipes')}
          sx={{ mt: 2 }}
        >
          Voltar para a lista
        </Button>
      </Container>
    );
  };

  return (
    <Container maxWidth="md" sx={{ mt: 2, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Button 
          startIcon={<ArrowBackIcon />} 
          onClick={() => navigate('/equipes')}
        >
          Voltar para a lista
        </Button>
        
        <Button
          variant="contained"
          startIcon={<EditIcon />}
          onClick={() => navigate(`/equipes/editar/${id}`)}
        >
          Editar
        </Button>
      </Box>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom align="center">
          {equipe.nome}
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
          {equipe.urlImagem ? (
            <CardMedia
              component="img"
              image={equipe.urlImagem}
              alt={equipe.nome}
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
                    Resumo:
                  </Typography>
                  <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                    {equipe.resumo || 'Sem resumo'}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    ID:
                  </Typography>
                  <Typography variant="body2" fontFamily="monospace">
                    {equipe.id}
                  </Typography>
                </Box>

                {equipe.urlImagem && (
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      URL da Imagem:
                    </Typography>
                    <Typography variant="body2" sx={{ wordBreak: 'break-all' }}>
                      {equipe.urlImagem}
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