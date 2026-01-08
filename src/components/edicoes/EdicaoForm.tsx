import React from 'react';
import {
  Box,
  TextField,
  FormControlLabel,
  Checkbox,
  Rating,
  Typography,
  FormHelperText,
} from '@mui/material';
import { EdicaoRequest } from '../../types/edicao';

interface EdicaoFormProps {
  formData: EdicaoRequest;
  onChange: (field: string, value: any) => void;
  disabled?: boolean;
  errors?: Record<string, string>;
  hqId: string;
  hqNome?: string;
}

const EdicaoForm: React.FC<EdicaoFormProps> = ({
  formData,
  onChange,
  disabled = false,
  errors = {},
  hqId,
  hqNome,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checkbox = e.target as HTMLInputElement;
      onChange(name, checkbox.checked);
    } else {
      onChange(name, value);
    }
  };

  const handleRatingChange = (event: React.SyntheticEvent, newValue: number | null) => {
    onChange('ranking', newValue || 0);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {hqNome && (
        <Box sx={{ p: 2, bgcolor: 'primary.light', borderRadius: 1 }}>
          <Typography variant="subtitle1" color="white">
            HQ: <strong>{hqNome}</strong>
          </Typography>
        </Box>
      )}

      <Box sx={{ display: 'flex', gap: 2 }}>
        <TextField
          required
          fullWidth
          label="Número da Edição"
          name="numero"
          value={formData.numero}
          onChange={handleChange}
          disabled={disabled}
          error={!!errors.numero}
          helperText={errors.numero}
          placeholder="Ex: 1, 2, 3..."
          autoFocus
        />

        <TextField
          fullWidth
          label="Título"
          name="titulo"
          value={formData.titulo}
          onChange={handleChange}
          disabled={disabled}
          error={!!errors.titulo}
          helperText={errors.titulo}
          placeholder="Título específico da edição (opcional)"
        />
      </Box>

      <TextField
        fullWidth
        multiline
        rows={4}
        label="Sinopse"
        name="sinopse"
        value={formData.sinopse}
        onChange={handleChange}
        disabled={disabled}
        error={!!errors.sinopse}
        helperText={errors.sinopse}
        placeholder="Sinopse desta edição específica..."
      />

      <TextField
        fullWidth
        multiline
        rows={3}
        label="Observações"
        name="observacoes"
        value={formData.observacoes}
        onChange={handleChange}
        disabled={disabled}
        error={!!errors.observacoes}
        helperText={errors.observacoes}
        placeholder="Observações específicas desta edição..."
      />

      <TextField
        fullWidth
        label="URL de Download"
        name="urlDownload"
        value={formData.urlDownload}
        onChange={handleChange}
        disabled={disabled}
        error={!!errors.urlDownload}
        helperText={errors.urlDownload}
        placeholder="https://exemplo.com/download/edicao1"
      />

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <FormControlLabel
          control={
            <Checkbox
              name="lida"
              checked={formData.lida}
              onChange={handleChange}
              disabled={disabled}
              color="primary"
            />
          }
          label="Marcar como lida"
        />

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="body1">Avaliação:</Typography>
          <Rating
            name="ranking"
            value={formData.ranking}
            onChange={handleRatingChange}
            disabled={disabled}
            max={5}
            size="large"
          />
          <Typography variant="body2" color="text.secondary">
            ({formData.ranking}/5)
          </Typography>
        </Box>
      </Box>

      {errors.ranking && (
        <FormHelperText error>{errors.ranking}</FormHelperText>
      )}
    </Box>
  );
};

export default EdicaoForm;