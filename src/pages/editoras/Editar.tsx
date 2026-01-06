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
import { editorasApi } from '../../api/editoras';
import { Editora, EditoraRequest } from '../../types/editora';

const Editar: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [editora, setEditora] = useState<Editora | null>(null);
  const [formData, setFormData] = useState<EditoraRequest>({
    nome: '',
    urlLogotipo: '',
  });
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchEditora = async () => {
      if (!id) return;
      
      try {
        setLoadingData(true);
        const data = await editorasApi.obterPorId(id);
        setEditora(data);
        setFormData({
          nome: data.nome,
          urlLogotipo: data.urlLogotipo,
        });
      } catch (err: any) {
        setError(err.response?.data?.detail || 'Erro ao carregar editora');
      } finally {
        setLoadingData(false);
      }
    };

    fetchEditora();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !editora) return;

    setLoading(true);
    setError(null);

    try {
      // Validações básicas
      if (!formData.nome.trim()) {
        throw new Error('O nome da editora é obrigatório');
      }

      await editorasApi.atualizar(id, formData);
      setSuccess(true);
      
      // Redireciona após 2 segundos
      setTimeout(() => {
        navigate('/editoras');
      }, 2000);
    } catch (err: any) {
      setError(err.response?.data?.detail || err.message || 'Erro ao atualizar editora');
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

  if (!editora) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert severity="error">
          Editora não encontrada
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
      <Button 
        startIcon={<ArrowBackIcon />} 
        onClick={() => navigate('/editoras')}
        sx={{ mb: 3 }}
      >
        Voltar para a lista
      </Button>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          Editar Editora
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Atualize as informações da editora
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            Editora atualizada com sucesso! Redirecionando...
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <TextField
              required
              fullWidth
              label="Nome da Editora"
              name="nome"
              value={formData.nome}
              onChange={handleChange}
              disabled={loading || success}
            />

            <TextField
              fullWidth
              label="URL do Logotipo"
              name="urlLogotipo"
              value={formData.urlLogotipo}
              onChange={handleChange}
              disabled={loading || success}
              placeholder="https://exemplo.com/logo.png"
              helperText="URL da imagem do logotipo (opcional)"
            />

            {formData.urlLogotipo && (
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Box
                  component="img"
                  src={formData.urlLogotipo}
                  alt="Logotipo"
                  sx={{
                    width: 150,
                    height: 150,
                    objectFit: 'contain',
                    borderRadius: 1,
                    border: '1px solid #ddd',
                    p: 2,
                  }}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                  }}
                />
                <small>Prévia do logotipo</small>
              </Box>
            )}

            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
              <Button
                variant="outlined"
                onClick={() => navigate('/editoras')}
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