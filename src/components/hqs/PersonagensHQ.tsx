import React, { useState, useEffect } from 'react';
import {
  Paper,
  Typography,
  Box,
  Button,
  Alert,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { personagensApi } from '../../api/personagens';
import { PersonagemResumo } from '../../types/hq';
import { Personagem, TipoPersonagemLabel } from '../../types/personagem';

interface PersonagensHQProps {
  hqId: string;
  personagens: PersonagemResumo[];
  onPersonagensChange: (personagens: PersonagemResumo[]) => void;
  readOnly?: boolean;
}

const PersonagensHQ: React.FC<PersonagensHQProps> = ({
  hqId,
  personagens,
  onPersonagensChange,
  readOnly = false,
}) => {
  const [todosPersonagens, setTodosPersonagens] = useState<Personagem[]>([]);
  const [openModal, setOpenModal] = useState(false);
  const [selectedPersonagemId, setSelectedPersonagemId] = useState<string>('');

  useEffect(() => {
    carregarPersonagens();
  }, []);

  const carregarPersonagens = async () => {
    try {
      const data = await personagensApi.listar();
      setTodosPersonagens(data);
    } catch (error) {
      console.error('Erro ao carregar personagens:', error);
    }
  };

  const handleAdicionar = () => {
    if (!selectedPersonagemId) return;

    const personagemSelecionado = todosPersonagens.find(p => p.id === selectedPersonagemId);
    if (!personagemSelecionado) return;

    const novoPersonagem: PersonagemResumo = {
      id: personagemSelecionado.id,
      nome: personagemSelecionado.nome,
      urlImagem: personagemSelecionado.urlImagem,
      tipo: personagemSelecionado.tipo,
    };

    onPersonagensChange([...personagens, novoPersonagem]);
    setSelectedPersonagemId('');
    setOpenModal(false);
  };

  const handleRemover = (index: number) => {
    const novosPersonagens = personagens.filter((_, i) => i !== index);
    onPersonagensChange(novosPersonagens);
  };

  const personagensDisponiveis = todosPersonagens.filter(
    personagem => !personagens.some(p => p.id === personagem.id)
  );

  return (
    <Paper sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" gutterBottom>
          Personagens
        </Typography>
        {!readOnly && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setOpenModal(true)}
            size="small"
          >
            Incluir Personagem
          </Button>
        )}
      </Box>

      {personagens.length === 0 ? (
        <Alert severity="info" sx={{ mb: 2 }}>
          Sem personagens adicionados
        </Alert>
      ) : (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {personagens.map((personagem, index) => (
            <Chip
              key={personagem.id}
              label={personagem.nome}
              onDelete={readOnly ? undefined : () => handleRemover(index)}
              variant="outlined"
              avatar={
                personagem.urlImagem ? (
                  <Box
                    component="img"
                    src={personagem.urlImagem}
                    alt={personagem.nome}
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

      {/* Modal para adicionar personagem */}
      <Dialog open={openModal} onClose={() => setOpenModal(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Adicionar Personagem</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel id="personagem-select-label">Selecionar Personagem</InputLabel>
            <Select
              labelId="personagem-select-label"
              value={selectedPersonagemId}
              label="Selecionar Personagem"
              onChange={(e) => setSelectedPersonagemId(e.target.value)}
            >
              {personagensDisponiveis.map((personagem) => (
                <MenuItem key={personagem.id} value={personagem.id}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {personagem.urlImagem && (
                      <Box
                        component="img"
                        src={personagem.urlImagem}
                        alt={personagem.nome}
                        sx={{ width: 30, height: 30, borderRadius: '50%' }}
                      />
                    )}
                    <Box>
                      <Typography variant="body1">{personagem.nome}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {TipoPersonagemLabel[personagem.tipo as keyof typeof TipoPersonagemLabel]}
                      </Typography>
                    </Box>
                  </Box>
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
            disabled={!selectedPersonagemId}
          >
            Adicionar
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default PersonagensHQ;