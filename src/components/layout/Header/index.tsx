import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  Avatar,
  Menu,
  MenuItem,
  Divider,
} from '@mui/material';
import {
  Menu as MenuIcon,
  AccountCircle,
} from '@mui/icons-material';
import { useAuth } from '../../../contexts/AuthContext';
import logo from '../../../assets/logo.png'; // Você precisará adicionar uma logo

interface HeaderProps {
  onToggleNavbar: () => void;
  navbarOpen: boolean;
}

const Header: React.FC<HeaderProps> = ({ onToggleNavbar, navbarOpen }) => {
  const { usuario, logout } = useAuth();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar 
      position="fixed" 
      sx={{ 
        zIndex: (theme) => theme.zIndex.drawer + 1,
        backgroundColor: '#121212'
      }}
    >
      <Toolbar>
        <IconButton
          color="inherit"
          onClick={onToggleNavbar}
          edge="start"
          sx={{ mr: 2 }}
        >
          <MenuIcon />
        </IconButton>
        
        {/* Logo e Título */}
        <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
          <img 
            src={logo} 
            alt="ComicVerse Logo" 
            style={{ height: 40, marginRight: 16 }}
          />
          <Typography variant="h6" noWrap>
            ComicVerse
          </Typography>
        </Box>

        {/* Avatar do Usuário */}
        <IconButton
          onClick={handleMenuOpen}
          color="inherit"
          sx={{ p: 0 }}
        >
          <Avatar>
            {usuario?.nome?.charAt(0) || <AccountCircle />}
          </Avatar>
        </IconButton>

        {/* Menu do Usuário */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          PaperProps={{
            sx: {
              mt: 1.5,
              minWidth: 200,
            }
          }}
        >
          <Box sx={{ px: 2, py: 1 }}>
            <Typography variant="subtitle1" fontWeight="bold">
              {usuario?.nome}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {usuario?.email}
            </Typography>
          </Box>
          <Divider />
          <MenuItem onClick={() => {/* Perfil será implementado */}}>
            Meu Perfil
          </MenuItem>
          <MenuItem onClick={() => {/* Configurações será implementado */}}>
            Configurações
          </MenuItem>
          <Divider />
          <MenuItem onClick={logout}>
            Sair
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default Header;