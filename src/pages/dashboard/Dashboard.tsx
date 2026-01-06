import React from 'react';
import { Box, Container, Typography, Paper } from '@mui/material';

const Dashboard: React.FC = () => {
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Bem-vindo ao ComicVerse! Esta é a sua área inicial.
        </Typography>
      </Box>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Visão Geral
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Em breve você terá aqui estatísticas e informações sobre suas HQs, personagens e editoras favoritas.
        </Typography>
      </Paper>
    </Container>
  );
};

export default Dashboard;