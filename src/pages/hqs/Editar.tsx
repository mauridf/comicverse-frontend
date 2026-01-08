import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Alert,
  Button,
  Stepper,
  Step,
  StepLabel,
  CircularProgress,
  Snackbar,
} from '@mui/material';
import { Save as SaveIcon, ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import { hqsApi } from '../../api/hqs';
import { HQ, HQRequest, TipoSerie, StatusHQ, EditoraResumo, PersonagemResumo, EquipeResumo } from '../../types/hq';
import HQForm from '../../components/hqs/HQForm';
import EditorasHQ from '../../components/hqs/EditorasHQ';
import PersonagensHQ from '../../components/hqs/PersonagensHQ';
import EquipesHQ from '../../components/hqs/EquipesHQ';
import EdicoesHQ from '../../components/hqs/EdicoesHQ';

const steps = ['Informações Básicas', 'Editoras', 'Personagens', 'Equipes', 'Edições'];

const EditarHQ: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [hq, setHq] = useState<HQ | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
  });

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
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (id) {
      carregarHQ(id);
    }
  }, [id]);

  const carregarHQ = async (hqId: string) => {
    try {
      setLoading(true);
      const data = await hqsApi.obterPorId(hqId);
      setHq(data);
      
      // Preenche o form com os dados da HQ
      setFormData({
        nome: data.nome,
        tipoSerie: data.tipoSerie,
        anoLancamento: data.anoLancamento,
        totalEdicoes: data.totalEdicoes,
        status: data.status,
        sinopse: data.sinopse,
        observacoes: data.observacoes,
        urlCapa: data.urlCapa,
        urlDownload: data.urlDownload,
        editoraIds: data.editoras.map(e => e.id),
        personagemIds: data.personagens.map(p => p.id),
        equipeIds: data.equipes.map(e => e.id),
      });

      setEditoras(data.editoras);
      setPersonagens(data.personagens);
      setEquipes(data.equipes);

    } catch (err: any) {
      setError(err.response?.data?.detail || 'Erro ao carregar HQ');
    } finally {
      setLoading(false);
    }
  };

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
    
    if (!validateStep(activeStep) || !id) {
      return;
    }

    // Validação adicional da URL da capa
    if (formData.urlCapa && formData.urlCapa.length > 200) {
        setError('A URL da capa não pode exceder 200 caracteres. URL atual: ' + formData.urlCapa.length + ' caracteres');
        return;
    }

    setSaving(true);
    setError(null);

    try {
      // Prepara os IDs para envio
      const dadosParaEnvio: HQRequest = {
        ...formData,
        editoraIds: editoras.map(e => e.id) || [],
        personagemIds: personagens.map(p => p.id) || [],
        equipeIds: equipes.map(e => e.id) || [],
      };

      await hqsApi.atualizar(id, dadosParaEnvio);
      setSnackbar({
        open: true,
        message: 'HQ atualizada com sucesso!',
        severity: 'success',
      });
      
      // Recarrega os dados da HQ após atualizar
      setTimeout(() => carregarHQ(id), 500);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Erro ao atualizar HQ');
      setSnackbar({
        open: true,
        message: 'Erro ao atualizar HQ',
        severity: 'error',
      });
    } finally {
      setSaving(false);
    }
  };

  const getStepContent = (step: number) => {
    if (loading) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress />
        </Box>
      );
    }

    switch (step) {
      case 0:
        return (
          <HQForm
            formData={formData}
            onChange={handleFormChange}
            disabled={saving}
            errors={formErrors}
          />
        );
      case 1:
        return (
          <EditorasHQ
            hqId={id || ''}
            editoras={editoras}
            onEditorasChange={setEditoras}
            readOnly={saving}
          />
        );
      case 2:
        return (
          <PersonagensHQ
            hqId={id || ''}
            personagens={personagens}
            onPersonagensChange={setPersonagens}
            readOnly={saving}
          />
        );
      case 3:
        return (
          <EquipesHQ
            hqId={id || ''}
            equipes={equipes}
            onEquipesChange={setEquipes}
            readOnly={saving}
          />
        );
      case 4:
        return (
          <EdicoesHQ
            hqId={id || ''}
            hqNome={hq?.nome || ''}
            edicoes={hq?.edicoes || []}
            onEdicoesChange={(novasEdicoes) => {
              // Atualizar edições locais
              if (hq) {
                setHq({ ...hq, edicoes: novasEdicoes });
              }
            }}
            readOnly={saving}
          />
        );
      default:
        return 'Step desconhecido';
    }
  };

  if (error && !loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert 
          severity="error" 
          action={
            <Button color="inherit" size="small" onClick={() => navigate('/hqs')}>
              Voltar
            </Button>
          }
        >
          {error}
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 2, mb: 4 }}>
      <Box sx={{ mb: 3 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/hqs')}
          sx={{ mb: 2 }}
        >
          Voltar para lista
        </Button>
        
        <Typography variant="h4" gutterBottom>
          Editar HQ: {hq?.nome || 'Carregando...'}
        </Typography>
        
        <Stepper activeStep={activeStep} sx={{ mt: 3 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </Box>

      <form onSubmit={handleSubmit}>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Paper sx={{ p: 3, mb: 3 }}>
          {getStepContent(activeStep)}
        </Paper>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', p: 2 }}>
          <Button
            variant="outlined"
            onClick={() => navigate('/hqs')}
            disabled={saving}
          >
            Cancelar
          </Button>

          <Box sx={{ display: 'flex', gap: 2 }}>
            {activeStep > 0 && (
              <Button onClick={handleBack} disabled={saving}>
                Voltar
              </Button>
            )}
            
            {activeStep < steps.length - 1 ? (
              <Button onClick={handleNext} variant="contained" disabled={saving}>
                Próximo
              </Button>
            ) : (
              <Button
                type="submit"
                variant="contained"
                startIcon={saving ? <CircularProgress size={20} /> : <SaveIcon />}
                disabled={saving}
              >
                {saving ? 'Salvando...' : 'Salvar Alterações'}
              </Button>
            )}
          </Box>
        </Box>
      </form>

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

export default EditarHQ;