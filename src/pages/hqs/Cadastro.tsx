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
  Stepper,
  Step,
  StepLabel,
  Typography,
} from '@mui/material';
import { hqsApi } from '../../api/hqs';
import { HQRequest, TipoSerie, StatusHQ, EdicaoBasica } from '../../types/hq';
import HQForm from '../../components/hqs/HQForm';
import EditorasHQ from '../../components/hqs/EditorasHQ';
import PersonagensHQ from '../../components/hqs/PersonagensHQ';
import EquipesHQ from '../../components/hqs/EquipesHQ';
import EdicoesHQ from '../../components/hqs/EdicoesHQ';
import { EditoraResumo, PersonagemResumo, EquipeResumo } from '../../types/hq';

interface CadastroProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const steps = ['Informações Básicas', 'Editoras', 'Personagens', 'Equipes', 'Edições'];

const Cadastro: React.FC<CadastroProps> = ({ open, onClose, onSuccess }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState<HQRequest>({
    nome: '',
    tipoSerie: TipoSerie.Mensal,
    anoLancamento: '',
    totalEdicoes: '',
    status: StatusHQ.Outros,
    sinopse: '',
    observacoes: '',
    urlCapa: '',
    urlDownload: '',
    editoraIds: [],
    personagemIds: [],
    equipeIds: [],
  });
  const [editoras, setEditoras] = useState<EditoraResumo[]>([]);
  const [personagens, setPersonagens] = useState<PersonagemResumo[]>([]);
  const [equipes, setEquipes] = useState<EquipeResumo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [edicoes, setEdicoes] = useState<EdicaoBasica[]>([]);

  const handleFormChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
    // Limpa erro do campo
    if (formErrors[field]) {
      setFormErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validateStep = (step: number): boolean => {
    const errors: Record<string, string> = {};

    if (step === 0) {
        if (!formData.nome.trim()) {
        errors.nome = 'O nome da HQ é obrigatório';
        }
        if (!formData.totalEdicoes.trim()) {
        errors.totalEdicoes = 'O total de edições é obrigatório';
        }
        // Validar URL da capa
        if (formData.urlCapa && formData.urlCapa.length > 200) {
        errors.urlCapa = 'A URL não pode exceder 200 caracteres';
        }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
    };

  const handleNext = () => {
    if (validateStep(activeStep)) {
      setActiveStep((prevStep) => prevStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateStep(activeStep)) {
        return;
    }

    // Validação adicional da URL da capa
    if (formData.urlCapa && formData.urlCapa.length > 200) {
        setError('A URL da capa não pode exceder 200 caracteres. URL atual: ' + formData.urlCapa.length + ' caracteres');
        return;
    }

    setLoading(true);
    setError(null);

    try {
        // Prepara os IDs para envio (podem ser arrays vazios)
        const dadosParaEnvio: HQRequest = {
        ...formData,
        editoraIds: editoras.map(e => e.id) || [],
        personagemIds: personagens.map(p => p.id) || [],
        equipeIds: equipes.map(e => e.id) || [],
        };

        await hqsApi.registrar(dadosParaEnvio);
        onSuccess();
        resetForm();
    } catch (err: any) {
        // Captura erros mais específicos
        if (err.response?.data?.errors) {
        const errorMessages = Object.entries(err.response.data.errors)
            .map(([key, value]) => `${key}: ${value}`)
            .join(', ');
        setError(`Erros de validação: ${errorMessages}`);
        } else {
        setError(err.response?.data?.detail || 'Erro ao cadastrar HQ');
        }
    } finally {
        setLoading(false);
    }
    };

  const resetForm = () => {
    setFormData({
      nome: '',
      tipoSerie: TipoSerie.Mensal,
      anoLancamento: '',
      totalEdicoes: '',
      status: StatusHQ.Outros,
      sinopse: '',
      observacoes: '',
      urlCapa: '',
      urlDownload: '',
      editoraIds: [],
      personagemIds: [],
      equipeIds: [],
    });
    setEditoras([]);
    setPersonagens([]);
    setEquipes([]);
    setActiveStep(0);
    setError(null);
    setFormErrors({});
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <HQForm
            formData={formData}
            onChange={handleFormChange}
            disabled={loading}
            errors={formErrors}
          />
        );
      case 1:
        return (
          <EditorasHQ
            hqId="" // Vazio durante cadastro
            editoras={editoras}
            onEditorasChange={setEditoras}
            readOnly={loading}
          />
        );
      case 2:
        return (
          <PersonagensHQ
            hqId="" // Vazio durante cadastro
            personagens={personagens}
            onPersonagensChange={setPersonagens}
            readOnly={loading}
          />
        );
      case 3:
        return (
          <EquipesHQ
            hqId="" // Vazio durante cadastro
            equipes={equipes}
            onEquipesChange={setEquipes}
            readOnly={loading}
          />
        );
        case 4:
        return (
          <EdicoesHQ
            hqId="" // Vazio durante cadastro
            hqNome={formData.nome}
            edicoes={edicoes}
            onEdicoesChange={setEdicoes}
            readOnly={loading}
          />
        );
      default:
        return 'Step desconhecido';
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="lg" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>
          Cadastrar Nova HQ
          <Stepper activeStep={activeStep} sx={{ mt: 3 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </DialogTitle>
        
        <DialogContent sx={{ minHeight: 500 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {getStepContent(activeStep)}
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleClose} disabled={loading}>
            Cancelar
          </Button>
          
          <Box sx={{ flex: '1 1 auto' }} />
          
          {activeStep > 0 && (
            <Button onClick={handleBack} disabled={loading}>
              Voltar
            </Button>
          )}
          
          {activeStep < steps.length - 1 ? (
            <Button onClick={handleNext} variant="contained" disabled={loading}>
              Próximo
            </Button>
          ) : (
            <Button 
              type="submit" 
              variant="contained" 
              disabled={loading}
              startIcon={loading && <CircularProgress size={20} />}
            >
              {loading ? 'Cadastrando...' : 'Cadastrar'}
            </Button>
          )}
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default Cadastro;