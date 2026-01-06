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
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { editorasApi } from '../../api/editoras';
import { Editora } from '../../types/editora';
import DataTable, { Column, Action } from '../../components/common/DataTable';
import Cadastro from './Cadastro';

const EditorasLista: React.FC = () => {
  const navigate = useNavigate();
  const [editoras, setEditoras] = useState<Editora[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openCadastro, setOpenCadastro] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [editoraToDelete, setEditoraToDelete] = useState<string | null>(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
  });

  const fetchEditoras = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await editorasApi.listar();
      setEditoras(data);
    } catch (err: any) {
      console.error('Erro ao carregar editoras:', err);
      setError(err.response?.data?.detail || 'Erro ao carregar editoras');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEditoras();
  }, []);

  const handleDeleteClick = (id: string) => {
    setEditoraToDelete(id);
    setOpenDeleteDialog(true);
  };

  const handleDeleteConfirm = async () => {
    if (!editoraToDelete) return;

    try {
      await editorasApi.excluir(editoraToDelete);
      setEditoras(editoras.filter(editora => editora.id !== editoraToDelete));
      setSnackbar({
        open: true,
        message: 'Editora excluída com sucesso!',
        severity: 'success',
      });
    } catch (err: any) {
      setSnackbar({
        open: true,
        message: err.response?.data?.detail || 'Erro ao excluir editora',
        severity: 'error',
      });
    } finally {
      setOpenDeleteDialog(false);
      setEditoraToDelete(null);
    }
  };

  const handleCadastroSuccess = () => {
    setOpenCadastro(false);
    fetchEditoras();
    setSnackbar({
      open: true,
      message: 'Editora cadastrada com sucesso!',
      severity: 'success',
    });
  };

  const columns: Column[] = [
    {
      id: 'nome',
      label: 'Nome',
      minWidth: 200,
    },
    {
      id: 'urlLogotipo',
      label: 'Logotipo',
      minWidth: 200,
      format: (value: string) => (
        value ? (
          <Box
            component="img"
            src={value}
            alt="Logotipo"
            sx={{ 
              width: 50, 
              height: 50, 
              objectFit: 'contain',
              borderRadius: 1 
            }}
          />
        ) : 'Sem logotipo'
      ),
    },
  ];

  const actions: Action[] = [
    {
      icon: <ViewIcon />,
      tooltip: 'Visualizar',
      onClick: (id) => navigate(`/editoras/visualizar/${id}`),
      color: 'info',
    },
    {
      icon: <EditIcon />,
      tooltip: 'Editar',
      onClick: (id) => navigate(`/editoras/editar/${id}`),
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
          Editoras
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Gerencie as editoras da sua coleção de HQs
        </Typography>
      </Box>

      <DataTable
        columns={columns}
        data={editoras}
        actions={actions}
        loading={loading}
        error={error ?? undefined}
        searchable={true}
        searchPlaceholder="Pesquisar editoras..."
        searchFields={['nome']}
        onAddNew={() => setOpenCadastro(true)}
        addButtonText="Nova Editora"
        emptyMessage="Nenhuma editora cadastrada. Clique no botão + para adicionar uma nova."
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
            Tem certeza que deseja excluir esta editora? Esta ação não pode ser desfeita.
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

export default EditorasLista;