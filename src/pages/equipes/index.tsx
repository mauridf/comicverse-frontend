import React, { useState, useEffect } from 'react';
import {
  Container,
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
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { equipeApi } from '../../api/equipe';
import { Equipe } from '../../types/equipe';
import DataTable, { Column, Action } from '../../components/common/DataTable';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
} from '@mui/icons-material';
import Cadastro from './Cadastro';

const EquipesLista: React.FC = () => {
  const navigate = useNavigate();
  const [equipes, setEquipes] = useState<Equipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openCadastro, setOpenCadastro] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [equipeToDelete, setEquipeToDelete] = useState<string | null>(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
  });

  const fetchEquipes = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await equipeApi.listar();
      setEquipes(data);
    } catch (err: any) {
      console.error('Erro ao carregar equipes:', err);
      setError(err.response?.data?.detail || 'Erro ao carregar equipes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEquipes();
  }, []);

  const handleDeleteClick = (id: string) => {
    setEquipeToDelete(id);
    setOpenDeleteDialog(true);
  };

  const handleDeleteConfirm = async () => {
    if (!equipeToDelete) return;

    try {
      await equipeApi.excluir(equipeToDelete);
      setEquipes(equipes.filter(equipe => equipe.id !== equipeToDelete));
      setSnackbar({
        open: true,
        message: 'Equipe excluída com sucesso!',
        severity: 'success',
      });
    } catch (err: any) {
      setSnackbar({
        open: true,
        message: err.response?.data?.detail || 'Erro ao excluir equipe',
        severity: 'error',
      });
    } finally {
      setOpenDeleteDialog(false);
      setEquipeToDelete(null);
    }
  };

  const handleCadastroSuccess = () => {
    setOpenCadastro(false);
    fetchEquipes();
    setSnackbar({
      open: true,
      message: 'Equipe cadastrada com sucesso!',
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
      id: 'resumo',
      label: 'Resumo',
      minWidth: 350,
      format: (value: string) => (
        <Box sx={{ 
          maxWidth: 400,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap'
        }}>
          {value || 'Sem resumo'}
        </Box>
      ),
    },
    {
      id: 'urlImagem',
      label: 'Imagem',
      minWidth: 250,
      format: (value: string) => (
        value ? (
          <Box
            component="img"
            src={value}
            alt="Equipe"
            sx={{ 
              width: 60, 
              height: 60, 
              objectFit: 'cover',
              borderRadius: 1,
              border: '1px solid #ddd'
            }}
          />
        ) : 'Sem imagem'
      ),
    },
  ];

  const actions: Action[] = [
    {
      icon: <ViewIcon />,
      tooltip: 'Visualizar',
      onClick: (id) => navigate(`/equipes/visualizar/${id}`),
      color: 'info',
    },
    {
      icon: <EditIcon />,
      tooltip: 'Editar',
      onClick: (id) => navigate(`/equipes/editar/${id}`),
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
          Equipes
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Gerencie as equipes da sua coleção de HQs
        </Typography>
      </Box>

      <DataTable
        columns={columns}
        data={equipes}
        actions={actions}
        loading={loading}
        error={error ?? undefined}
        searchable={true}
        searchPlaceholder="Pesquisar equipes..."
        searchFields={['nome', 'resumo']}
        onAddNew={() => setOpenCadastro(true)}
        addButtonText="Nova Equipe"
        emptyMessage="Nenhuma equipe cadastrada. Clique no botão + para adicionar uma nova."
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
            Tem certeza que deseja excluir esta equipe? Esta ação não pode ser desfeita.
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

export default EquipesLista;