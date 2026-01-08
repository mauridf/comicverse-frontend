import React, { useState, useEffect } from 'react';
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
import { Edicao, EdicaoRequest } from '../../../types/edicao';
import EdicaoForm from '../EdicaoForm';

interface EditarEdicaoProps {
  open: boolean;
  onClose: () => void;
  onSuccess: (edicao: Edicao) => void;
  edicaoId: string;
  hqNome: string;
}

const EditarEdicao: React.FC<EditarEdicaoProps> = ({
  open,
  onClose,
  onSuccess,
  edicaoId,
  hqNome,
}) => {
  const [edicao, setEdicao] = useState<Edicao | null>(null);
  const [formData, setFormData] = useState<EdicaoRequest | null>(null);
  const [loading, setLoading] = useState(false);
  const [carregando, setCarregando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (open && edicaoId) {
      carregarEdicao();
    }
  }, [open, edicaoId]);

  const carregarEdicao = async () => {
    try {
      setCarregando(true);
      const data = await edicoesApi.obterPorId(edicaoId);
      setEdicao(data);
      setFormData({
        hqId: data.hqId,
        numero: data.numero,
        titulo: data.titulo,
        sinopse: data.sinopse,
        observacoes: data.observacoes,
        urlDownload: data.urlDownload,
        lida: data.lida,
        ranking: data.ranking,
      });
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Erro ao carregar edição');
    } finally {
      setCarregando(false);
    }
  };

  const handleFormChange = (field: string, value: any) => {
    if (!formData) return;
    
    setFormData(prev => ({
      ...prev!,
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
    if (!formData) return false;

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
    
    if (!formData || !validateForm()) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const edicaoAtualizada = await edicoesApi.atualizar(edicaoId, formData);
      onSuccess(edicaoAtualizada);
      handleClose();
    } catch (err: any) {
      if (err.response?.data?.errors) {
        const errorMessages = Object.entries(err.response.data.errors)
          .map(([key, value]) => `${key}: ${value}`)
          .join(', ');
        setError(`Erros de validação: ${errorMessages}`);
      } else {
        setError(err.response?.data?.detail || 'Erro ao atualizar edição');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setEdicao(null);
    setFormData(null);
    setError(null);
    setFormErrors({});
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>Editar Edição</DialogTitle>
        
        <DialogContent sx={{ minHeight: 400 }}>
          {carregando ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <CircularProgress />
            </Box>
          ) : error ? (
            <Alert severity="error">{error}</Alert>
          ) : formData ? (
            <>
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
                hqId={formData.hqId}
                hqNome={hqNome}
              />
            </>
          ) : null}
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleClose} disabled={loading}>
            Cancelar
          </Button>
          
          <Box sx={{ flex: '1 1 auto' }} />
          
          {formData && !carregando && (
            <Button 
              type="submit" 
              variant="contained" 
              disabled={loading}
              startIcon={loading && <CircularProgress size={20} />}
            >
              {loading ? 'Salvando...' : 'Salvar'}
            </Button>
          )}
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default EditarEdicao;