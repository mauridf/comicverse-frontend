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
import { personagensApi } from '../../api/personagens';
import { Personagem, PersonagemRequest, TipoPersonagem } from '../../types/personagem';
import TipoPersonagemSelect from '../../components/personagens/TipoPersonagemSelect';

const Editar: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [personagem, setPersonagem] = useState<Personagem | null>(null);
  const [formData, setFormData] = useState<PersonagemRequest>({
    nome: '',
    resumo: '',
    urlImagem: '',
    tipo: TipoPersonagem.Heroi,
  });
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchPersonagem = async () => {
      if (!id) return;
      
      try {
        setLoadingData(true);
        const data = await personagensApi.obterPorId(id);
        setPersonagem(data);
        setFormData({
          nome: data.nome,
          resumo: data.resumo,
          urlImagem: data.urlImagem,
          tipo: data.tipo,
        });
      } catch (err: any) {
        setError(err.response?.data?.detail || 'Erro ao carregar personagem');
      } finally {
        setLoadingData(false);
      }
    };

    fetchPersonagem();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleTipoChange = (value: TipoPersonagem) => {
    setFormData(prev => ({
      ...prev,
      tipo: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !personagem) return;

    setLoading(true);
    setError(null);

    try {
      // Validações básicas
      if (!formData.nome.trim()) {
        throw new Error('O nome do personagem é obrigatório');
      }

      await personagensApi.atualizar(id, formData);
      setSuccess(true);
      
      // Redireciona após 2 segundos
      setTimeout(() => {
        navigate('/personagens');
      }, 2000);
    } catch (err: any) {
      setError(err.response?.data?.detail || err.message || 'Erro ao atualizar personagem');
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

  if (!personagem) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert severity="error">
          Personagem não encontrado
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

  return (
    <Container maxWidth="md" sx={{ mt: 2, mb: 4 }}>
      <Button 
        startIcon={<ArrowBackIcon />} 
        onClick={() => navigate('/personagens')}
        sx={{ mb: 3 }}
      >
        Voltar para a lista
      </Button>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          Editar Personagem
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Atualize as informações do personagem
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            Personagem atualizado com sucesso! Redirecionando...
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <TextField
              required
              fullWidth
              label="Nome do Personagem"
              name="nome"
              value={formData.nome}
              onChange={handleChange}
              disabled={loading || success}
            />

            <TipoPersonagemSelect
              value={formData.tipo}
              onChange={handleTipoChange}
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
              helperText="Breve descrição do personagem"
            />

            <TextField
              fullWidth
              label="URL da Imagem"
              name="urlImagem"
              value={formData.urlImagem}
              onChange={handleChange}
              disabled={loading || success}
              placeholder="https://exemplo.com/personagem.jpg"
              helperText="URL da imagem do personagem (opcional)"
            />

            {formData.urlImagem && (
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Box
                  component="img"
                  src={formData.urlImagem}
                  alt="Personagem"
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
                onClick={() => navigate('/personagens')}
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