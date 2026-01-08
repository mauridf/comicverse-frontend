import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Alert,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  Snackbar,
  Chip,
  LinearProgress,
  Rating,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { hqsApi } from '../../api/hqs';
import { HQ, TipoSerieLabel, StatusHQLabel } from '../../types/hq';
import DataTable, { Column, Action } from '../../components/common/DataTable';
import Cadastro from './Cadastro';

const HQsLista: React.FC = () => {
  const navigate = useNavigate();
  const [hqs, setHqs] = useState<HQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openCadastro, setOpenCadastro] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [hqToDelete, setHqToDelete] = useState<string | null>(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
  });

  const fetchHQs = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await hqsApi.listar();
      setHqs(data);
    } catch (err: any) {
      console.error('Erro ao carregar HQs:', err);
      setError(err.response?.data?.detail || 'Erro ao carregar HQs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHQs();
  }, []);

  const handleDeleteClick = (id: string) => {
    setHqToDelete(id);
    setOpenDeleteDialog(true);
  };

  const handleDeleteConfirm = async () => {
    if (!hqToDelete) return;

    try {
      await hqsApi.excluir(hqToDelete);
      setHqs(hqs.filter(hq => hq.id !== hqToDelete));
      setSnackbar({
        open: true,
        message: 'HQ excluída com sucesso!',
        severity: 'success',
      });
    } catch (err: any) {
      setSnackbar({
        open: true,
        message: err.response?.data?.detail || 'Erro ao excluir HQ',
        severity: 'error',
      });
    } finally {
      setOpenDeleteDialog(false);
      setHqToDelete(null);
    }
  };

  const handleCadastroSuccess = () => {
    setOpenCadastro(false);
    fetchHQs();
    setSnackbar({
      open: true,
      message: 'HQ cadastrada com sucesso!',
      severity: 'success',
    });
  };

  const columns: Column[] = [
    {
      id: 'nome',
      label: 'Nome',
      minWidth: 250,
    },
    {
      id: 'tipoSerie',
      label: 'Tipo',
      minWidth: 150,
      format: (value: number) => (
        <Chip
          label={TipoSerieLabel[value as keyof typeof TipoSerieLabel]}
          variant="outlined"
          size="small"
        />
      ),
    },
    {
      id: 'status',
      label: 'Status',
      minWidth: 150,
      format: (value: number) => (
        <Chip
          label={StatusHQLabel[value as keyof typeof StatusHQLabel]}
          color={
            value === 1 ? 'info' : 
            value === 2 ? 'success' : 
            value === 3 ? 'error' : 'default'
          }
          size="small"
        />
      ),
    },
    {
      id: 'progressoLeitura',
      label: 'Progresso',
      minWidth: 200,
      format: (value: number) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <LinearProgress 
            variant="determinate" 
            value={value} 
            sx={{ width: 100, height: 8 }}
          />
          <Typography variant="body2" color="text.secondary">
            {value}%
          </Typography>
        </Box>
      ),
    },
    {
      id: 'mediaRanking',
      label: 'Avaliação',
      minWidth: 150,
      format: (value: number) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Rating value={value / 2} readOnly precision={0.5} size="small" />
          <Typography variant="body2">
            {value.toFixed(1)}
          </Typography>
        </Box>
      ),
    },
    {
      id: 'editoras',
      label: 'Editoras',
      minWidth: 200,
      format: (editoras: any[]) => (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
          {editoras.slice(0, 2).map((editora, index) => (
            <Chip
              key={editora.id}
              label={editora.nome}
              size="small"
              variant="outlined"
            />
          ))}
          {editoras.length > 2 && (
            <Chip
              label={`+${editoras.length - 2}`}
              size="small"
              variant="outlined"
            />
          )}
        </Box>
      ),
    },
  ];

  const actions: Action[] = [
    {
      icon: <ViewIcon />,
      tooltip: 'Visualizar',
      onClick: (id) => navigate(`/hqs/visualizar/${id}`),
      color: 'info',
    },
    {
      icon: <EditIcon />,
      tooltip: 'Editar',
      onClick: (id) => navigate(`/hqs/editar/${id}`),
      color: 'primary',
    },
    {
      icon: <DeleteIcon />,
      tooltip: 'Excluir',
      onClick: handleDeleteClick,
      color: 'error',
    },
  ];

  return (
    <Container maxWidth="xl" sx={{ mt: 2, mb: 4 }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          HQs
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Gerencie sua coleção de Histórias em Quadrinhos
        </Typography>
      </Box>

      <DataTable
        columns={columns}
        data={hqs}
        actions={actions}
        loading={loading}
        error={error ?? undefined}
        searchable={true}
        searchPlaceholder="Pesquisar HQs..."
        searchFields={['nome', 'sinopse']}
        onAddNew={() => setOpenCadastro(true)}
        addButtonText="Nova HQ"
        emptyMessage="Nenhuma HQ cadastrada. Clique no botão + para adicionar uma nova."
        rowsPerPageOptions={[5, 10, 25]}
        defaultRowsPerPage={10}
      />

      {/* Dialog de Confirmação de Exclusão */}
      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
      >
        <DialogTitle>Confirmar Exclusão</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Tem certeza que deseja excluir esta HQ? Esta ação não pode ser desfeita.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)} color="primary">
            Cancelar
          </Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">
            Excluir
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal de Cadastro */}
      <Cadastro
        open={openCadastro}
        onClose={() => setOpenCadastro(false)}
        onSuccess={handleCadastroSuccess}
      />

      {/* Snackbar para feedback */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert 
          onClose={() => setSnackbar({ ...snackbar, open: false })} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default HQsLista;