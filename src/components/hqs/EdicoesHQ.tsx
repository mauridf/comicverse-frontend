import React, { useState, useEffect } from 'react';
import {
  Paper,
  Typography,
  Box,
  Button,
  Alert,
  Chip,
  Rating,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  DialogContentText,
  Snackbar,
} from '@mui/material';
import { 
  Add as AddIcon, 
  Edit as EditIcon, 
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  CheckCircle as CheckCircleIcon,
  RadioButtonUnchecked as UncheckedIcon
} from '@mui/icons-material';
import { EdicaoBasica } from '../../types/hq';
import { edicoesApi } from '../../api/edicoes';
import CadastrarEdicao from '../edicoes/modals/CadastrarEdicao';
import EditarEdicao from '../edicoes/modals/EditarEdicao';
import VisualizarEdicao from '../edicoes/modals/VisualizarEdicao';

interface EdicoesHQProps {
  hqId: string;
  hqNome?: string;
  edicoes: EdicaoBasica[];
  onEdicoesChange: (edicoes: EdicaoBasica[]) => void;
  readOnly?: boolean;
}

const EdicoesHQ: React.FC<EdicoesHQProps> = ({
  hqId,
  hqNome = '',
  edicoes,
  onEdicoesChange,
  readOnly = false,
}) => {
  const [openCadastro, setOpenCadastro] = useState(false);
  const [openEdicao, setOpenEdicao] = useState(false);
  const [openVisualizar, setOpenVisualizar] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [edicaoSelecionada, setEdicaoSelecionada] = useState<EdicaoBasica | null>(null);
  const [edicaoParaExcluir, setEdicaoParaExcluir] = useState<string | null>(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
  });

  console.log('EdicoesHQ Props:', {
    hqId,        // Deve ter valor
    hqNome,      // Deve ter valor
    readOnly,    // Deve ser false
    edicoesCount: edicoes.length
  });

  // Carregar edições completas ao montar componente
  useEffect(() => {
    console.log('useEffect executado:', { hqId, readOnly });
    if (hqId) {
      carregarEdicoesCompletas();
    }
  }, [hqId]);

  const carregarEdicoesCompletas = async () => {
    try {
      const edicoesCompletas = await edicoesApi.listarPorHQ(hqId);
      // Transformar para formato básico se necessário
      const edicoesBasicas: EdicaoBasica[] = edicoesCompletas.map(edicao => ({
        id: edicao.id,
        numero: edicao.numero,
        titulo: edicao.titulo,
        lida: edicao.lida,
        ranking: edicao.ranking,
      }));
      onEdicoesChange(edicoesBasicas);
    } catch (error) {
      console.error('Erro ao carregar edições:', error);
    }
  };

  const handleCadastrarEdicao = () => {
    setOpenCadastro(true);
  };

  const handleCadastroSuccess = (novaEdicao: any) => {
    // Adicionar nova edição à lista
    const novaEdicaoBasica: EdicaoBasica = {
      id: novaEdicao.id,
      numero: novaEdicao.numero,
      titulo: novaEdicao.titulo,
      lida: novaEdicao.lida,
      ranking: novaEdicao.ranking,
    };
    
    onEdicoesChange([...edicoes, novaEdicaoBasica]);
    setOpenCadastro(false);
    setSnackbar({
      open: true,
      message: 'Edição cadastrada com sucesso!',
      severity: 'success',
    });
  };

  const handleEditarClick = (edicao: EdicaoBasica) => {
    setEdicaoSelecionada(edicao);
    setOpenEdicao(true);
  };

  const handleEdicaoEditada = (edicaoAtualizada: any) => {
    // Atualizar edição na lista
    const novasEdicoes = edicoes.map(edicao => 
      edicao.id === edicaoAtualizada.id 
        ? {
            ...edicao,
            numero: edicaoAtualizada.numero,
            titulo: edicaoAtualizada.titulo,
            lida: edicaoAtualizada.lida,
            ranking: edicaoAtualizada.ranking,
          }
        : edicao
    );
    
    onEdicoesChange(novasEdicoes);
    setOpenEdicao(false);
    setEdicaoSelecionada(null);
    setSnackbar({
      open: true,
      message: 'Edição atualizada com sucesso!',
      severity: 'success',
    });
  };

  const handleVisualizarClick = (edicao: EdicaoBasica) => {
    setEdicaoSelecionada(edicao);
    setOpenVisualizar(true);
  };

  const handleExcluirClick = (edicaoId: string) => {
    setEdicaoParaExcluir(edicaoId);
    setOpenDeleteDialog(true);
  };

  const handleConfirmarExclusao = async () => {
    if (!edicaoParaExcluir) return;

    try {
      await edicoesApi.excluir(edicaoParaExcluir);
      
      // Remover edição da lista
      const novasEdicoes = edicoes.filter(edicao => edicao.id !== edicaoParaExcluir);
      onEdicoesChange(novasEdicoes);
      
      setSnackbar({
        open: true,
        message: 'Edição excluída com sucesso!',
        severity: 'success',
      });
    } catch (error: any) {
      setSnackbar({
        open: true,
        message: error.response?.data?.detail || 'Erro ao excluir edição',
        severity: 'error',
      });
    } finally {
      setOpenDeleteDialog(false);
      setEdicaoParaExcluir(null);
    }
  };

  const toggleLida = async (edicaoId: string, atualLida: boolean) => {
    try {
      await edicoesApi.marcarLida(edicaoId, !atualLida);
      
      // Atualizar estado local
      const novasEdicoes = edicoes.map(edicao => 
        edicao.id === edicaoId ? { ...edicao, lida: !atualLida } : edicao
      );
      
      onEdicoesChange(novasEdicoes);
    } catch (error) {
      console.error('Erro ao marcar como lida:', error);
    }
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Box>
          <Typography variant="h6" gutterBottom>
            Edições ({edicoes.length})
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {edicoes.filter(e => e.lida).length} lidas • {edicoes.filter(e => !e.lida).length} faltam
          </Typography>
        </Box>
        {!readOnly && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleCadastrarEdicao}
            size="small"
          >
            Cadastrar Edição
          </Button>
        )}
      </Box>

      {edicoes.length === 0 ? (
        <Alert severity="info" sx={{ mb: 2 }}>
          Nenhuma edição cadastrada
        </Alert>
      ) : (
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Lida</TableCell>
                <TableCell>Número</TableCell>
                <TableCell>Título</TableCell>
                <TableCell align="center">Avaliação</TableCell>
                {!readOnly && <TableCell align="center">Ações</TableCell>}
              </TableRow>
            </TableHead>
            <TableBody>
              {edicoes.map((edicao) => (
                <TableRow key={edicao.id} hover>
                  <TableCell>
                    <IconButton
                      size="small"
                      onClick={() => toggleLida(edicao.id, edicao.lida)}
                      disabled={readOnly}
                      color={edicao.lida ? "success" : "default"}
                    >
                      {edicao.lida ? <CheckCircleIcon /> : <UncheckedIcon />}
                    </IconButton>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={`#${edicao.numero}`}
                      size="small"
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>{edicao.titulo || 'Sem título'}</TableCell>
                  <TableCell align="center">
                    <Rating 
                      value={edicao.ranking / 2} 
                      readOnly 
                      size="small" 
                      precision={0.5}
                    />
                    <Typography variant="caption" display="block" color="text.secondary">
                      {edicao.ranking.toFixed(1)}
                    </Typography>
                  </TableCell>
                  {!readOnly && (
                    <TableCell align="center">
                      <IconButton
                        size="small"
                        onClick={() => handleVisualizarClick(edicao)}
                        title="Visualizar"
                        color="info"
                      >
                        <VisibilityIcon fontSize="small" />
                      </IconButton>
                      
                      <IconButton
                        size="small"
                        onClick={() => handleEditarClick(edicao)}
                        title="Editar"
                        color="primary"
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                      
                      <IconButton
                        size="small"
                        onClick={() => handleExcluirClick(edicao.id)}
                        title="Excluir"
                        color="error"
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Modal de Cadastro */}
      <CadastrarEdicao
        open={openCadastro}
        onClose={() => setOpenCadastro(false)}
        onSuccess={handleCadastroSuccess}
        hqId={hqId}
        hqNome={hqNome}
      />

      {/* Modal de Edição */}
      {edicaoSelecionada && (
        <EditarEdicao
          open={openEdicao}
          onClose={() => {
            setOpenEdicao(false);
            setEdicaoSelecionada(null);
          }}
          onSuccess={handleEdicaoEditada}
          edicaoId={edicaoSelecionada.id}
          hqNome={hqNome}
        />
      )}

      {/* Modal de Visualização */}
      {edicaoSelecionada && (
        <VisualizarEdicao
          open={openVisualizar}
          onClose={() => {
            setOpenVisualizar(false);
            setEdicaoSelecionada(null);
          }}
          edicaoId={edicaoSelecionada.id}
        />
      )}

      {/* Dialog de Confirmação de Exclusão */}
      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
      >
        <DialogTitle>Confirmar Exclusão</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Tem certeza que deseja excluir esta edição? Esta ação não pode ser desfeita.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)} color="primary">
            Cancelar
          </Button>
          <Button onClick={handleConfirmarExclusao} color="error" variant="contained">
            Excluir
          </Button>
        </DialogActions>
      </Dialog>

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
    </Paper>
  );
};

export default EdicoesHQ;