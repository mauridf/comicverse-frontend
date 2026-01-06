import React, { useState } from 'react';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  Link,
  InputAdornment,
  IconButton,
  Grid,
} from '@mui/material';
import {
  Person as PersonIcon,
  Email as EmailIcon,
  Lock as LockIcon,
  Phone as PhoneIcon,
  Visibility,
  VisibilityOff,
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate, Link as RouterLink } from 'react-router-dom';

const Registrar: React.FC = () => {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    senha: '',
    confirmarSenha: '',
    telefone: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  
  const { registrar } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validações
    if (formData.senha !== formData.confirmarSenha) {
      setError('As senhas não coincidem');
      return;
    }

    if (formData.senha.length < 6) {
      setError('A senha deve ter no mínimo 6 caracteres');
      return;
    }

    setLoading(true);

    try {
      await registrar(formData);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Erro ao registrar. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="sm">
      <Box
        sx={{
          marginTop: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper
          elevation={3}
          sx={{
            padding: 4,
            width: '100%',
          }}
        >
          <Typography component="h1" variant="h5" align="center" gutterBottom>
            Criar Conta
          </Typography>
          <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 3 }}>
            Preencha os dados para criar sua conta no ComicVerse
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box>
                <TextField
                required
                fullWidth
                id="nome"
                label="Nome Completo"
                name="nome"
                value={formData.nome}
                onChange={handleChange}
                InputProps={{
                    startAdornment: (
                    <InputAdornment position="start">
                        <PersonIcon />
                    </InputAdornment>
                    ),
                }}
                />
            </Box>
            
            <Box>
                <TextField
                required
                fullWidth
                id="email"
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                InputProps={{
                    startAdornment: (
                    <InputAdornment position="start">
                        <EmailIcon />
                    </InputAdornment>
                    ),
                }}
                />
            </Box>
            
            <Box sx={{ display: 'flex', gap: 2 }}>
                <Box sx={{ flex: 1 }}>
                <TextField
                    required
                    fullWidth
                    name="senha"
                    label="Senha"
                    type={showPassword ? 'text' : 'password'}
                    id="senha"
                    value={formData.senha}
                    onChange={handleChange}
                    InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                        <LockIcon />
                        </InputAdornment>
                    ),
                    endAdornment: (
                        <InputAdornment position="end">
                        <IconButton
                            onClick={() => setShowPassword(!showPassword)}
                            edge="end"
                        >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                        </InputAdornment>
                    ),
                    }}
                />
                </Box>
                
                <Box sx={{ flex: 1 }}>
                <TextField
                    required
                    fullWidth
                    name="confirmarSenha"
                    label="Confirmar Senha"
                    type={showConfirmPassword ? 'text' : 'password'}
                    id="confirmarSenha"
                    value={formData.confirmarSenha}
                    onChange={handleChange}
                    InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                        <LockIcon />
                        </InputAdornment>
                    ),
                    endAdornment: (
                        <InputAdornment position="end">
                        <IconButton
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            edge="end"
                        >
                            {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                        </InputAdornment>
                    ),
                    }}
                />
                </Box>
            </Box>
            
            <Box>
                <TextField
                fullWidth
                id="telefone"
                label="Telefone"
                name="telefone"
                value={formData.telefone}
                onChange={handleChange}
                InputProps={{
                    startAdornment: (
                    <InputAdornment position="start">
                        <PhoneIcon />
                    </InputAdornment>
                    ),
                }}
                />
            </Box>
            </Box>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={loading}
            >
              {loading ? 'Criando conta...' : 'Criar Conta'}
            </Button>
          </form>

          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body2">
              Já tem uma conta?{' '}
              <Link component={RouterLink} to="/login" variant="body2">
                Faça login
              </Link>
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Registrar;