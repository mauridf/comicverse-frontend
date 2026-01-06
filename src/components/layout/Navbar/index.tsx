import React from 'react';
import { 
  Drawer, 
  List, 
  ListItemButton, 
  ListItemIcon, 
  ListItemText, 
  Box,
  Divider
} from '@mui/material';
import {
  LibraryBooks as EditoraIcon,
  Person as PersonagemIcon,
  Groups as EquipeIcon,
  MenuBook as HQIcon,
  Logout as LogoutIcon,
  Dashboard as DashboardIcon
} from '@mui/icons-material';
import { useAuth } from '../../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface NavbarProps {
  open: boolean;
  onClose: () => void;
  width: number;
}

const Navbar: React.FC<NavbarProps> = ({ open, onClose, width }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
    { text: 'Editora', icon: <EditoraIcon />, path: '/editoras' },
    { text: 'Personagem', icon: <PersonagemIcon />, path: '/personagens' },
    { text: 'Equipe', icon: <EquipeIcon />, path: '/equipes' },
    { text: 'HQ', icon: <HQIcon />, path: '/hqs' },
  ];

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: open ? width : 0,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: open ? width : 0,
          boxSizing: 'border-box',
          marginTop: '64px', // Altura do Header
          backgroundColor: '#1e1e2d',
          color: '#fff',
        },
      }}
      open={open}
    >
      <Box sx={{ overflow: 'auto' }}>
        <List>
          {menuItems.map((item) => (
            <ListItemButton 
              key={item.text}
              onClick={() => handleNavigation(item.path)}
              sx={{
                '&:hover': {
                  backgroundColor: '#2d2d3d',
                }
              }}
            >
              <ListItemIcon sx={{ color: '#fff' }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          ))}
        </List>
        <Divider sx={{ backgroundColor: '#444' }} />
        <List>
          <ListItemButton 
            onClick={logout}
            sx={{
              '&:hover': {
                backgroundColor: '#2d2d3d',
              }
            }}
          >
            <ListItemIcon sx={{ color: '#fff' }}>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItemButton>
        </List>
      </Box>
    </Drawer>
  );
};

export default Navbar;