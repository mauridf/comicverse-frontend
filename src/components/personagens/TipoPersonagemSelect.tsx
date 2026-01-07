import React from 'react';
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  Box,
  Chip,
} from '@mui/material';
import { TipoPersonagem, TipoPersonagemLabel } from '../../types/personagem';

interface TipoPersonagemSelectProps {
  value: TipoPersonagem;
  onChange: (value: TipoPersonagem) => void;
  disabled?: boolean;
  required?: boolean;
  label?: string;
}

const TipoPersonagemSelect: React.FC<TipoPersonagemSelectProps> = ({
  value,
  onChange,
  disabled = false,
  required = true,
  label = 'Tipo de Personagem'
}) => {
  const handleChange = (event: SelectChangeEvent<TipoPersonagem>) => {
    onChange(event.target.value as TipoPersonagem);
  };

  const getChipColor = (tipo: TipoPersonagem) => {
    switch (tipo) {
      case TipoPersonagem.Heroi: return 'success';
      case TipoPersonagem.Vilao: return 'error';
      case TipoPersonagem.AntiHeroi: return 'warning';
      default: return 'default';
    }
  };

  return (
    <FormControl fullWidth required={required} disabled={disabled}>
      <InputLabel id="tipo-personagem-label">{label}</InputLabel>
      <Select
        labelId="tipo-personagem-label"
        value={value}
        label={label}
        onChange={handleChange}
      >
        {Object.entries(TipoPersonagemLabel).map(([key, label]) => {
          const tipo = parseInt(key) as TipoPersonagem;
          return (
            <MenuItem key={tipo} value={tipo}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Chip
                  label={label}
                  color={getChipColor(tipo)}
                  variant="outlined"
                  size="small"
                />
              </Box>
            </MenuItem>
          );
        })}
      </Select>
    </FormControl>
  );
};

export default TipoPersonagemSelect;