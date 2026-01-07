import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './pages/auth/Login';
import Registrar from './pages/auth/Registrar';
import Dashboard from './pages/dashboard/Dashboard';
import Navbar from './components/layout/Navbar';
import Header from './components/layout/Header';
import EditorasLista from './pages/editoras';
import EditarEditora from './pages/editoras/Editar';
import VisualizarEditora from './pages/editoras/Visualizar';
import PersonagensLista from './pages/personagens';
import EditarPersonagem from './pages/personagens/Editar';
import VisualizarPersonagem from './pages/personagens/Visualizar';
import EquipesLista from './pages/equipes';
import EditarEquipe from './pages/equipes/Editar';
import VisualizarEquipe from './pages/equipes/Visualizar';

// Componente para rotas privadas
const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { usuario, loading } = useAuth();

  console.log('🔍 PrivateRoute:', { 
    usuario: usuario?.email, 
    loading,
    shouldRender: !!usuario && !loading
  });

  if (loading) {
    console.log('🔍 PrivateRoute: Carregando...');
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  console.log('🔍 PrivateRoute: Usuário autenticado?', !!usuario);
  
  return usuario ? <>{children}</> : <Navigate to="/login" />;
};

// Layout principal com Navbar e Header
const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [navbarOpen, setNavbarOpen] = useState(true);
  const navbarWidth = 240;

  return (
    <Box sx={{ display: 'flex' }}>
      <Header 
        onToggleNavbar={() => setNavbarOpen(!navbarOpen)} 
        navbarOpen={navbarOpen}
      />
      <Navbar open={navbarOpen} onClose={() => setNavbarOpen(false)} width={navbarWidth} />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${navbarOpen ? navbarWidth : 0}px)` },
          marginTop: '64px', // Altura do Header
          minHeight: 'calc(100vh - 64px)',
          backgroundColor: '#f5f5f5',
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

function AppRoutes() {
  console.log('🔍 AppRoutes renderizado');
  
  return (
    <Routes>
      {/* Rotas públicas */}
      <Route path="/login" element={<Login />} />
      <Route path="/registrar" element={<Registrar />} />
      
      {/* Rotas privadas */}
      <Route 
        path="/dashboard" 
        element={
          <PrivateRoute>
            <MainLayout>
              <Dashboard />
            </MainLayout>
          </PrivateRoute>
        } 
      />
      <Route path="/editoras" element={
          <PrivateRoute>
            <MainLayout>
              <EditorasLista />
            </MainLayout>
          </PrivateRoute>
        } />

      <Route path="/editoras/editar/:id" element={
          <PrivateRoute>
            <MainLayout>
              <EditarEditora />
            </MainLayout>
          </PrivateRoute>
        } />

      <Route path="/editoras/visualizar/:id" element={
          <PrivateRoute>
            <MainLayout>
              <VisualizarEditora />
            </MainLayout>
          </PrivateRoute>
        } />

      <Route path="/personagens" element={
          <PrivateRoute>
            <MainLayout>
              <PersonagensLista />
            </MainLayout>
          </PrivateRoute>
        } />

      <Route path="/personagens/editar/:id" element={
          <PrivateRoute>
            <MainLayout>
              <EditarPersonagem />
            </MainLayout>
          </PrivateRoute>
        } />

      <Route path="/personagens/visualizar/:id" element={
          <PrivateRoute>
            <MainLayout>
              <VisualizarPersonagem />
            </MainLayout>
          </PrivateRoute>
        } />
      
      <Route path="/equipes" element={
          <PrivateRoute>
            <MainLayout>
              <EquipesLista />
            </MainLayout>
          </PrivateRoute>
        } />

      <Route path="/equipes/editar/:id" element={
          <PrivateRoute>
            <MainLayout>
              <EditarEquipe />
            </MainLayout>
          </PrivateRoute>
        } />

      <Route path="/equipes/visualizar/:id" element={
          <PrivateRoute>
            <MainLayout>
              <VisualizarEquipe />
            </MainLayout>
          </PrivateRoute>
        } />
      {/* Rota padrão */}
      <Route path="/" element={<Navigate to="/dashboard" />} />
    </Routes>
  );
}

function App() {
  console.log('🔍 App renderizado');
  
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
}

export default App;