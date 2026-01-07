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
import { equipeApi } from '../../api/equipe';
import { EquipeRequest } from '../../types/equipe';

interface CadastroProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const Cadastro: React.FC<CadastroProps> = ({ open, onClose, onSuccess }) => {
  const [formData, setFormData] = useState<EquipeRequest>({
    nome: '',
    resumo: '',
    urlImagem: '',
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Validações básicas
      if (!formData.nome.trim()) {
        throw new Error('O nome da equipe é obrigatório');
      }

      await equipeApi.registrar(formData);
      onSuccess();
      resetForm();
    } catch (err: any) {
      setError(err.response?.data?.detail || err.message || 'Erro ao cadastrar equipe');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      nome: '',
      resumo: '',
      urlImagem: '',
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
        <DialogTitle>Cadastrar Nova Equipe</DialogTitle>
        
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
              label="Nome da Equipe"
              name="nome"
              value={formData.nome}
              onChange={handleChange}
              disabled={loading}
              autoFocus
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
              helperText="Breve descrição da equipe"
            />

            <TextField
              fullWidth
              label="URL da Imagem"
              name="urlImagem"
              value={formData.urlImagem}
              onChange={handleChange}
              disabled={loading}
              placeholder="https://exemplo.com/equipe.jpg"
              helperText="URL da imagem ou logotipo da equipe (opcional)"
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