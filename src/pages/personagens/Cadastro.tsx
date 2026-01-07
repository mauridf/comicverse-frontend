import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Alert,
  CircularProgress,
} from '@mui/material';
import { personagensApi } from '../../api/personagens';
import { PersonagemRequest, TipoPersonagem } from '../../types/personagem';
import TipoPersonagemSelect from '../../components/personagens/TipoPersonagemSelect';

interface CadastroProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const Cadastro: React.FC<CadastroProps> = ({ open, onClose, onSuccess }) => {
  const [formData, setFormData] = useState<PersonagemRequest>({
    nome: '',
    resumo: '',
    urlImagem: '',
    tipo: TipoPersonagem.Heroi,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    if (error) setError(null);
  };

  const handleTipoChange = (value: TipoPersonagem) => {
    setFormData(prev => ({
      ...prev,
      tipo: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Validações básicas
      if (!formData.nome.trim()) {
        throw new Error('O nome do personagem é obrigatório');
      }

      await personagensApi.registrar(formData);
      onSuccess();
      resetForm();
    } catch (err: any) {
      setError(err.response?.data?.detail || err.message || 'Erro ao cadastrar personagem');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      nome: '',
      resumo: '',
      urlImagem: '',
      tipo: TipoPersonagem.Heroi,
    });
    setError(null);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>Cadastrar Novo Personagem</DialogTitle>
        
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <TextField
              required
              fullWidth
              label="Nome do Personagem"
              name="nome"
              value={formData.nome}
              onChange={handleChange}
              disabled={loading}
              autoFocus
            />

            <TipoPersonagemSelect
              value={formData.tipo}
              onChange={handleTipoChange}
              disabled={loading}
            />

            <TextField
              fullWidth
              multiline
              rows={4}
              label="Resumo"
              name="resumo"
              value={formData.resumo}
              onChange={handleChange}
              disabled={loading}
              helperText="Breve descrição do personagem"
            />

            <TextField
              fullWidth
              label="URL da Imagem"
              name="urlImagem"
              value={formData.urlImagem}
              onChange={handleChange}
              disabled={loading}
              placeholder="https://exemplo.com/personagem.jpg"
              helperText="URL da imagem do personagem (opcional)"
            />

            {formData.urlImagem && (
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Box
                  component="img"
                  src={formData.urlImagem}
                  alt="Preview"
                  sx={{
                    width: 150,
                    height: 150,
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
          </Box>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleClose} disabled={loading}>
            Cancelar
          </Button>
          <Button 
            type="submit" 
            variant="contained" 
            disabled={loading}
            startIcon={loading && <CircularProgress size={20} />}
          >
            {loading ? 'Cadastrando...' : 'Cadastrar'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default Cadastro;