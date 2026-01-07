import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  TextField,
  Button,
  Alert,
  CircularProgress,
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { equipeApi } from '../../api/equipe';
import { Equipe, EquipeRequest } from '../../types/equipe';

const Editar: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [equipe, setEquipe] = useState<Equipe | null>(null);
  const [formData, setFormData] = useState<EquipeRequest>({
    nome: '',
    resumo: '',
    urlImagem: '',
  });
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchEquipe = async () => {
      if (!id) return;
      
      try {
        setLoadingData(true);
        const data = await equipeApi.obterPorId(id);
        setEquipe(data);
        setFormData({
          nome: data.nome,
          resumo: data.resumo,
          urlImagem: data.urlImagem,
        });
      } catch (err: any) {
        setError(err.response?.data?.detail || 'Erro ao carregar equipe');
      } finally {
        setLoadingData(false);
      }
    };

    fetchEquipe();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !equipe) return;

    setLoading(true);
    setError(null);

    try {
      // Validações básicas
      if (!formData.nome.trim()) {
        throw new Error('O nome da equipe é obrigatório');
      }

      await equipeApi.atualizar(id, formData);
      setSuccess(true);
      
      // Redireciona após 2 segundos
      setTimeout(() => {
        navigate('/equipes');
      }, 2000);
    } catch (err: any) {
      setError(err.response?.data?.detail || err.message || 'Erro ao atualizar equipe');
    } finally {
      setLoading(false);
    }
  };

  if (loadingData) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="300px">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (!equipe) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert severity="error">
          Equipe não encontrada
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
  }

  return (
    <Container maxWidth="md" sx={{ mt: 2, mb: 4 }}>
      <Button 
        startIcon={<ArrowBackIcon />} 
        onClick={() => navigate('/equipes')}
        sx={{ mb: 3 }}
      >
        Voltar para a lista
      </Button>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          Editar Equipe
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Atualize as informações da equipe
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            Equipe atualizada com sucesso! Redirecionando...
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <TextField
              required
              fullWidth
              label="Nome da Equipe"
              name="nome"
              value={formData.nome}
              onChange={handleChange}
              disabled={loading || success}
            />

            <TextField
              fullWidth
              multiline
              rows={4}
              label="Resumo"
              name="resumo"
              value={formData.resumo}
              onChange={handleChange}
              disabled={loading || success}
              helperText="Breve descrição da equipe"
            />

            <TextField
              fullWidth
              label="URL da Imagem"
              name="urlImagem"
              value={formData.urlImagem}
              onChange={handleChange}
              disabled={loading || success}
              placeholder="https://exemplo.com/equipe.jpg"
              helperText="URL da imagem ou logotipo da equipe (opcional)"
            />

            {formData.urlImagem && (
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Box
                  component="img"
                  src={formData.urlImagem}
                  alt="Equipe"
                  sx={{
                    width: 200,
                    height: 200,
                    objectFit: 'cover',
                    borderRadius: 2,
                    border: '2px solid #ddd',
                  }}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                  }}
                />
                <small>Prévia da imagem</small>
              </Box>
            )}

            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
              <Button
                variant="outlined"
                onClick={() => navigate('/equipes')}
                disabled={loading || success}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={loading || success}
                startIcon={loading && <CircularProgress size={20} />}
              >
                {loading ? 'Atualizando...' : 'Atualizar'}
              </Button>
            </Box>
          </Box>
        </form>
      </Paper>
    </Container>
  );
};

export default Editar;