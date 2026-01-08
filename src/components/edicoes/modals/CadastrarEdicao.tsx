import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Alert,
  CircularProgress,
} from '@mui/material';
import { edicoesApi } from '../../../api/edicoes';
import { EdicaoRequest } from '../../../types/edicao';
import EdicaoForm from '../EdicaoForm';

interface CadastrarEdicaoProps {
  open: boolean;
  onClose: () => void;
  onSuccess: (edicao: any) => void;
  hqId: string;
  hqNome: string;
}

const CadastrarEdicao: React.FC<CadastrarEdicaoProps> = ({
  open,
  onClose,
  onSuccess,
  hqId,
  hqNome,
}) => {
  const [formData, setFormData] = useState<EdicaoRequest>({
    hqId,
    numero: '',
    titulo: '',
    sinopse: '',
    observacoes: '',
    urlDownload: '',
    lida: false,
    ranking: 0,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const handleFormChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
    
    if (formErrors[field]) {
      setFormErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.numero.trim()) {
      errors.numero = 'O número da edição é obrigatório';
    }

    if (formData.ranking < 0 || formData.ranking > 5) {
      errors.ranking = 'O ranking deve estar entre 0 e 5';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const novaEdicao = await edicoesApi.cadastrar(formData);
      onSuccess(novaEdicao);
      resetForm();
    } catch (err: any) {
      if (err.response?.data?.errors) {
        const errorMessages = Object.entries(err.response.data.errors)
          .map(([key, value]) => `${key}: ${value}`)
          .join(', ');
        setError(`Erros de validação: ${errorMessages}`);
      } else {
        setError(err.response?.data?.detail || 'Erro ao cadastrar edição');
      }
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      hqId,
      numero: '',
      titulo: '',
      sinopse: '',
      observacoes: '',
      urlDownload: '',
      lida: false,
      ranking: 0,
    });
    setError(null);
    setFormErrors({});
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>Cadastrar Nova Edição</DialogTitle>
        
        <DialogContent sx={{ minHeight: 400 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <EdicaoForm
            formData={formData}
            onChange={handleFormChange}
            disabled={loading}
            errors={formErrors}
            hqId={hqId}
            hqNome={hqNome}
          />
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleClose} disabled={loading}>
            Cancelar
          </Button>
          
          <Box sx={{ flex: '1 1 auto' }} />
          
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

export default CadastrarEdicao;