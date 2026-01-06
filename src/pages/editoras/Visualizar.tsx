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
import { editorasApi } from '../../api/editoras';
import { Editora } from '../../types/editora';

const Visualizar: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [editora, setEditora] = useState<Editora | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEditora = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const data = await editorasApi.obterPorId(id);
        setEditora(data);
      } catch (err: any) {
        setError(err.response?.data?.detail || 'Erro ao carregar editora');
      } finally {
        setLoading(false);
      }
    };

    fetchEditora();
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

  if (error || !editora) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert severity="error">
          {error || 'Editora não encontrada'}
        </Alert>
        <Button 
          startIcon={<ArrowBackIcon />} 
          onClick={() => navigate('/editoras')}
          sx={{ mt: 2 }}
        >
          Voltar para a lista
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 2, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Button 
          startIcon={<ArrowBackIcon />} 
          onClick={() => navigate('/editoras')}
        >
          Voltar para a lista
        </Button>
        
        <Button
          variant="contained"
          startIcon={<EditIcon />}
          onClick={() => navigate(`/editoras/editar/${id}`)}
        >
          Editar
        </Button>
      </Box>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom align="center">
          {editora.nome}
        </Typography>

        <Card sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
          {editora.urlLogotipo ? (
            <CardMedia
              component="img"
              height="300"
              image={editora.urlLogotipo}
              alt={editora.nome}
              sx={{ objectFit: 'contain', p: 2 }}
            />
          ) : (
            <Box
              sx={{
                height: 300,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: 'grey.100',
              }}
            >
              <Typography variant="h6" color="text.secondary">
                Sem logotipo
              </Typography>
            </Box>
          )}
          
          <CardContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  ID:
                </Typography>
                <Typography variant="body1">
                  {editora.id}
                </Typography>
              </Box>

              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Nome:
                </Typography>
                <Typography variant="body1">
                  {editora.nome}
                </Typography>
              </Box>

              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  URL do Logotipo:
                </Typography>
                <Typography variant="body1">
                  {editora.urlLogotipo || 'Não informado'}
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Paper>
    </Container>
  );
};

export default Visualizar;