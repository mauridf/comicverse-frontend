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
import { equipeApi } from '../../api/equipe';
import { EquipeResumo } from '../../types/hq';
import { Equipe } from '../../types/equipe';

interface EquipesHQProps {
  hqId: string;
  equipes: EquipeResumo[];
  onEquipesChange: (equipes: EquipeResumo[]) => void;
  readOnly?: boolean;
}

const EquipesHQ: React.FC<EquipesHQProps> = ({
  hqId,
  equipes,
  onEquipesChange,
  readOnly = false,
}) => {
  const [todasEquipes, setTodasEquipes] = useState<Equipe[]>([]);
  const [openModal, setOpenModal] = useState(false);
  const [selectedEquipeId, setSelectedEquipeId] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregarEquipes();
  }, []);

  const carregarEquipes = async () => {
    try {
      setLoading(true);
      const data = await equipeApi.listar();
      setTodasEquipes(data);
    } catch (error) {
      console.error('Erro ao carregar equipes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdicionar = () => {
    if (!selectedEquipeId) return;

    const equipeSelecionada = todasEquipes.find(e => e.id === selectedEquipeId);
    if (!equipeSelecionada) return;

    const novaEquipe: EquipeResumo = {
      id: equipeSelecionada.id,
      nome: equipeSelecionada.nome,
      urlImagem: equipeSelecionada.urlImagem,
    };

    onEquipesChange([...equipes, novaEquipe]);
    setSelectedEquipeId('');
    setOpenModal(false);
  };

  const handleRemover = (index: number) => {
    const novasEquipes = equipes.filter((_, i) => i !== index);
    onEquipesChange(novasEquipes);
  };

  const equipesDisponiveis = todasEquipes.filter(
    equipe => !equipes.some(e => e.id === equipe.id)
  );

  return (
    <Paper sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" gutterBottom>
          Equipes
        </Typography>
        {!readOnly && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setOpenModal(true)}
            size="small"
            disabled={loading}
          >
            Incluir Equipe
          </Button>
        )}
      </Box>

      {equipes.length === 0 ? (
        <Alert severity="info" sx={{ mb: 2 }}>
          Sem equipes adicionadas
        </Alert>
      ) : (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {equipes.map((equipe, index) => (
            <Chip
              key={equipe.id}
              label={equipe.nome}
              onDelete={readOnly ? undefined : () => handleRemover(index)}
              variant="outlined"
              avatar={
                equipe.urlImagem ? (
                  <Box
                    component="img"
                    src={equipe.urlImagem}
                    alt={equipe.nome}
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

      {/* Modal para adicionar equipe */}
      <Dialog open={openModal} onClose={() => setOpenModal(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Adicionar Equipe</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel id="equipe-select-label">Selecionar Equipe</InputLabel>
            <Select
              labelId="equipe-select-label"
              value={selectedEquipeId}
              label="Selecionar Equipe"
              onChange={(e) => setSelectedEquipeId(e.target.value)}
              disabled={loading}
            >
              {equipesDisponiveis.map((equipe) => (
                <MenuItem key={equipe.id} value={equipe.id}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {equipe.urlImagem && (
                      <Box
                        component="img"
                        src={equipe.urlImagem}
                        alt={equipe.nome}
                        sx={{ width: 30, height: 30, borderRadius: '50%' }}
                      />
                    )}
                    <Typography variant="body1">{equipe.nome}</Typography>
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
            disabled={!selectedEquipeId || loading}
          >
            Adicionar
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default EquipesHQ;