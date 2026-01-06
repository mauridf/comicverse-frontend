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
import { editorasApi } from '../../api/editoras';
import { EditoraRequest } from '../../types/editora';

interface CadastroProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const Cadastro: React.FC<CadastroProps> = ({ open, onClose, onSuccess }) => {
  const [formData, setFormData] = useState<EditoraRequest>({
    nome: '',
    urlLogotipo: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    // Limpa erro ao editar
    if (error) setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Validações básicas
      if (!formData.nome.trim()) {
        throw new Error('O nome da editora é obrigatório');
      }

      await editorasApi.registrar(formData);
      onSuccess();
      resetForm();
    } catch (err: any) {
      setError(err.response?.data?.detail || err.message || 'Erro ao cadastrar editora');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      nome: '',
      urlLogotipo: '',
    });
    setError(null);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>Cadastrar Nova Editora</DialogTitle>
        
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
              label="Nome da Editora"
              name="nome"
              value={formData.nome}
              onChange={handleChange}
              disabled={loading}
              autoFocus
            />

            <TextField
              fullWidth
              label="URL do Logotipo"
              name="urlLogotipo"
              value={formData.urlLogotipo}
              onChange={handleChange}
              disabled={loading}
              placeholder="https://exemplo.com/logo.png"
              helperText="URL da imagem do logotipo (opcional)"
            />

            {formData.urlLogotipo && (
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Box
                  component="img"
                  src={formData.urlLogotipo}
                  alt="Preview"
                  sx={{
                    width: 100,
                    height: 100,
                    objectFit: 'contain',
                    borderRadius: 1,
                    border: '1px solid #ddd',
                    p: 1,
                  }}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                  }}
                />
                <small>Prévia do logotipo</small>
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