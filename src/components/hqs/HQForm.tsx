import React from 'react';
import {
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  FormHelperText,
} from '@mui/material';
import { TipoSerie, TipoSerieLabel, StatusHQ, StatusHQLabel } from '../../types/hq';

interface HQFormProps {
  formData: {
    nome: string;
    tipoSerie: TipoSerie;
    anoLancamento: string;
    totalEdicoes: string;
    status: StatusHQ;
    sinopse: string;
    observacoes: string;
    urlCapa: string;
    urlDownload: string;
  };
  onChange: (field: string, value: any) => void;
  disabled?: boolean;
  errors?: Record<string, string>;
}

const HQForm: React.FC<HQFormProps> = ({
  formData,
  onChange,
  disabled = false,
  errors = {},
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    onChange(name, value);
  };

  const handleSelectChange = (e: any) => {
    const { name, value } = e.target;
    onChange(name, parseInt(value));
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <TextField
        required
        fullWidth
        label="Nome da HQ"
        name="nome"
        value={formData.nome}
        onChange={handleChange}
        disabled={disabled}
        error={!!errors.nome}
        helperText={errors.nome}
        autoFocus
      />

      <Box sx={{ display: 'flex', gap: 2 }}>
        <FormControl fullWidth required error={!!errors.tipoSerie}>
          <InputLabel id="tipo-serie-label">Tipo de Série</InputLabel>
          <Select
            labelId="tipo-serie-label"
            name="tipoSerie"
            value={formData.tipoSerie}
            label="Tipo de Série"
            onChange={handleSelectChange}
            disabled={disabled}
          >
            {Object.entries(TipoSerieLabel).map(([key, label]) => (
              <MenuItem key={key} value={key}>
                {label}
              </MenuItem>
            ))}
          </Select>
          {errors.tipoSerie && <FormHelperText>{errors.tipoSerie}</FormHelperText>}
        </FormControl>

        <FormControl fullWidth required error={!!errors.status}>
          <InputLabel id="status-label">Status</InputLabel>
          <Select
            labelId="status-label"
            name="status"
            value={formData.status}
            label="Status"
            onChange={handleSelectChange}
            disabled={disabled}
          >
            {Object.entries(StatusHQLabel).map(([key, label]) => (
              <MenuItem key={key} value={key}>
                {label}
              </MenuItem>
            ))}
          </Select>
          {errors.status && <FormHelperText>{errors.status}</FormHelperText>}
        </FormControl>
      </Box>

      <Box sx={{ display: 'flex', gap: 2 }}>
        <TextField
          fullWidth
          label="Ano de Lançamento"
          name="anoLancamento"
          value={formData.anoLancamento}
          onChange={handleChange}
          disabled={disabled}
          error={!!errors.anoLancamento}
          helperText={errors.anoLancamento}
          placeholder="Ex: 1986"
        />

        <TextField
          fullWidth
          label="Total de Edições"
          name="totalEdicoes"
          value={formData.totalEdicoes}
          onChange={handleChange}
          disabled={disabled}
          error={!!errors.totalEdicoes}
          helperText={errors.totalEdicoes}
          placeholder="Ex: 12 ou ?"
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
      />

      <Box sx={{ display: 'flex', gap: 2 }}>
        <TextField
          fullWidth
          label="URL da Capa"
          name="urlCapa"
          value={formData.urlCapa}
          onChange={handleChange}
          disabled={disabled}
          error={!!errors.urlCapa}
          helperText={errors.urlCapa}
          placeholder="https://exemplo.com/capa.jpg"
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
          placeholder="https://exemplo.com/download"
        />
      </Box>

      {formData.urlCapa && (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Box
            component="img"
            src={formData.urlCapa}
            alt="Preview da capa"
            sx={{
              width: 200,
              height: 300,
              objectFit: 'cover',
              borderRadius: 2,
              border: '2px solid #ddd',
            }}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
            }}
          />
          <small>Prévia da capa</small>
        </Box>
      )}
    </Box>
  );
};

export default HQForm;