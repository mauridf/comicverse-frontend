import React, { useState, useEffect } from 'react';
import {
  Paper,
  Typography,
  Box,
  Button,
  Alert,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { editorasApi } from '../../api/editoras';
import { Editora } from '../../types/editora';
import { EditoraResumo } from '../../types/hq';

interface EditorasHQProps {
  hqId: string;
  editoras: EditoraResumo[];
  onEditorasChange: (editoras: EditoraResumo[]) => void;
  readOnly?: boolean;
}

const EditorasHQ: React.FC<EditorasHQProps> = ({
  hqId,
  editoras,
  onEditorasChange,
  readOnly = false,
}) => {
  const [todasEditoras, setTodasEditoras] = useState<Editora[]>([]);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [selectedEditoraId, setSelectedEditoraId] = useState<string>('');
  const [editandoIndex, setEditandoIndex] = useState<number | null>(null);

  useEffect(() => {
    carregarEditoras();
  }, []);

  const carregarEditoras = async () => {
    try {
      setLoading(true);
      const data = await editorasApi.listar();
      setTodasEditoras(data);
    } catch (error) {
      console.error('Erro ao carregar editoras:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdicionar = () => {
    if (!selectedEditoraId) return;

    const editoraSelecionada = todasEditoras.find(e => e.id === selectedEditoraId);
    if (!editoraSelecionada) return;

    if (editandoIndex !== null) {
      // Editando
      const novasEditoras = [...editoras];
      novasEditoras[editandoIndex] = {
        id: editoraSelecionada.id,
        nome: editoraSelecionada.nome,
        urlLogotipo: editoraSelecionada.urlLogotipo,
      };
      onEditorasChange(novasEditoras);
      setEditandoIndex(null);
    } else {
      // Adicionando nova
      const novaEditora: EditoraResumo = {
        id: editoraSelecionada.id,
        nome: editoraSelecionada.nome,
        urlLogotipo: editoraSelecionada.urlLogotipo,
      };
      onEditorasChange([...editoras, novaEditora]);
    }

    setSelectedEditoraId('');
    setOpenModal(false);
  };

  const handleRemover = (index: number) => {
    const novasEditoras = editoras.filter((_, i) => i !== index);
    onEditorasChange(novasEditoras);
  };

  const handleEditar = (index: number) => {
    const editora = editoras[index];
    setSelectedEditoraId(editora.id);
    setEditandoIndex(index);
    setOpenModal(true);
  };

  const editorasDisponiveis = todasEditoras.filter(
    editora => !editoras.some(e => e.id === editora.id) || 
    (editandoIndex !== null && editoras[editandoIndex].id === editora.id)
  );

  return (
    <Paper sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" gutterBottom>
          Editoras
        </Typography>
        {!readOnly && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => {
              setEditandoIndex(null);
              setSelectedEditoraId('');
              setOpenModal(true);
            }}
            size="small"
          >
            Incluir Editora
          </Button>
        )}
      </Box>

      {editoras.length === 0 ? (
        <Alert severity="info" sx={{ mb: 2 }}>
          Sem editoras adicionadas
        </Alert>
      ) : (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {editoras.map((editora, index) => (
            <Chip
              key={editora.id}
              label={editora.nome}
              onDelete={readOnly ? undefined : () => handleRemover(index)}
              deleteIcon={readOnly ? undefined : <DeleteIcon />}
              variant="outlined"
              avatar={
                editora.urlLogotipo ? (
                  <Box
                    component="img"
                    src={editora.urlLogotipo}
                    alt={editora.nome}
                    sx={{ width: 24, height: 24, borderRadius: '50%' }}
                  />
                ) : undefined
              }
              sx={{ 
                m: 0.5,
                '& .MuiChip-label': {
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                }
              }}
            />
          ))}
        </Box>
      )}

      {/* Modal para adicionar/editar editora */}
      <Dialog open={openModal} onClose={() => setOpenModal(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editandoIndex !== null ? 'Editar Editora' : 'Adicionar Editora'}
        </DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel id="editora-select-label">Selecionar Editora</InputLabel>
            <Select
              labelId="editora-select-label"
              value={selectedEditoraId}
              label="Selecionar Editora"
              onChange={(e) => setSelectedEditoraId(e.target.value)}
            >
              {editorasDisponiveis.map((editora) => (
                <MenuItem key={editora.id} value={editora.id}>
                  {editora.nome}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenModal(false)}>Cancelar</Button>
          <Button 
            onClick={handleAdicionar} 
            variant="contained"
            disabled={!selectedEditoraId}
          >
            {editandoIndex !== null ? 'Salvar' : 'Adicionar'}
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default EditorasHQ;