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
  Chip,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { personagensApi } from '../../api/personagens';
import { Personagem, TipoPersonagemLabel } from '../../types/personagem';
import DataTable, { Column, Action } from '../../components/common/DataTable';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
} from '@mui/icons-material';
import Cadastro from './Cadastro';

const PersonagensLista: React.FC = () => {
  const navigate = useNavigate();
  const [personagens, setPersonagens] = useState<Personagem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openCadastro, setOpenCadastro] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [personagemToDelete, setPersonagemToDelete] = useState<string | null>(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
  });

  const fetchPersonagens = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await personagensApi.listar();
      setPersonagens(data);
    } catch (err: any) {
      console.error('Erro ao carregar personagens:', err);
      setError(err.response?.data?.detail || 'Erro ao carregar personagens');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPersonagens();
  }, []);

  const handleDeleteClick = (id: string) => {
    setPersonagemToDelete(id);
    setOpenDeleteDialog(true);
  };

  const handleDeleteConfirm = async () => {
    if (!personagemToDelete) return;

    try {
      await personagensApi.excluir(personagemToDelete);
      setPersonagens(personagens.filter(personagem => personagem.id !== personagemToDelete));
      setSnackbar({
        open: true,
        message: 'Personagem excluído com sucesso!',
        severity: 'success',
      });
    } catch (err: any) {
      setSnackbar({
        open: true,
        message: err.response?.data?.detail || 'Erro ao excluir personagem',
        severity: 'error',
      });
    } finally {
      setOpenDeleteDialog(false);
      setPersonagemToDelete(null);
    }
  };

  const handleCadastroSuccess = () => {
    setOpenCadastro(false);
    fetchPersonagens();
    setSnackbar({
      open: true,
      message: 'Personagem cadastrado com sucesso!',
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
      id: 'tipo',
      label: 'Tipo',
      minWidth: 150,
      format: (value: number) => (
        <Chip
          label={TipoPersonagemLabel[value as keyof typeof TipoPersonagemLabel] || 'Desconhecido'}
          color={
            value === 1 ? 'success' : 
            value === 2 ? 'error' : 
            value === 3 ? 'warning' : 'default'
          }
          variant="outlined"
          size="small"
        />
      ),
    },
    {
      id: 'resumo',
      label: 'Resumo',
      minWidth: 300,
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
      minWidth: 150,
      format: (value: string) => (
        value ? (
          <Box
            component="img"
            src={value}
            alt="Personagem"
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
      onClick: (id) => navigate(`/personagens/visualizar/${id}`),
      color: 'info',
    },
    {
      icon: <EditIcon />,
      tooltip: 'Editar',
      onClick: (id) => navigate(`/personagens/editar/${id}`),
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
          Personagens
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Gerencie os personagens da sua coleção de HQs
        </Typography>
      </Box>

      <DataTable
        columns={columns}
        data={personagens}
        actions={actions}
        loading={loading}
        error={error ?? undefined}
        searchable={true}
        searchPlaceholder="Pesquisar personagens..."
        searchFields={['nome', 'resumo']}
        onAddNew={() => setOpenCadastro(true)}
        addButtonText="Novo Personagem"
        emptyMessage="Nenhum personagem cadastrado. Clique no botão + para adicionar um novo."
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
            Tem certeza que deseja excluir este personagem? Esta ação não pode ser desfeita.
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

export default PersonagensLista;