import React from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Chip,
  Rating,
  LinearProgress,
} from '@mui/material';
import {
  Book,
  CollectionsBookmark,
  Star,
  Visibility,
} from '@mui/icons-material';

interface HQCardProps {
  hq: {
    id: string;
    nome: string;
    urlCapa?: string;
    tipoSerie?: string;
    mediaRanking?: number;
    totalEdicoes?: number;
    edicoesLidas?: number;
    progressoLeitura?: number;
    statusDescricao?: string;
  };
  onClick?: (id: string) => void;
}

const HQCard: React.FC<HQCardProps> = ({ hq, onClick }) => {
  const progresso = hq.progressoLeitura || 
    (hq.totalEdicoes && hq.edicoesLidas ? 
      Math.round((hq.edicoesLidas / hq.totalEdicoes) * 100) : 0);

  return (
    <Card 
      sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        cursor: onClick ? 'pointer' : 'default',
        '&:hover': onClick ? { 
          boxShadow: 6,
          transform: 'translateY(-4px)',
          transition: 'transform 0.2s, box-shadow 0.2s'
        } : {}
      }}
      onClick={onClick ? () => onClick(hq.id) : undefined}
    >
      {hq.urlCapa ? (
        <CardMedia
          component="img"
          height="140"
          image={hq.urlCapa}
          alt={hq.nome}
          sx={{ objectFit: 'cover' }}
        />
      ) : (
        <Box
          sx={{
            height: 140,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: 'grey.200',
          }}
        >
          <Book sx={{ fontSize: 60, color: 'grey.400' }} />
        </Box>
      )}
      
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography gutterBottom variant="h6" component="div" noWrap>
          {hq.nome}
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          {hq.tipoSerie && (
            <Chip
              label={hq.tipoSerie}
              size="small"
              sx={{ mr: 1 }}
            />
          )}
          {hq.statusDescricao && (
            <Chip
              label={hq.statusDescricao}
              size="small"
              color="primary"
              variant="outlined"
            />
          )}
        </Box>
        
        {hq.mediaRanking !== undefined && (
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Rating value={hq.mediaRanking / 2} readOnly precision={0.5} size="small" />
            <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
              {hq.mediaRanking.toFixed(1)}
            </Typography>
          </Box>
        )}
        
        {(hq.totalEdicoes !== undefined || hq.edicoesLidas !== undefined) && (
          <Box sx={{ mb: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
              <Typography variant="body2" color="text.secondary">
                <CollectionsBookmark fontSize="small" sx={{ mr: 0.5, verticalAlign: 'middle' }} />
                Progresso
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {hq.edicoesLidas || 0}/{hq.totalEdicoes || 0}
              </Typography>
            </Box>
            <LinearProgress 
              variant="determinate" 
              value={progresso} 
              sx={{ height: 8, borderRadius: 4 }}
            />
            <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
              {progresso}% completo
            </Typography>
          </Box>
        )}
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {hq.mediaRanking !== undefined && (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Star sx={{ fontSize: 16, color: 'warning.main', mr: 0.5 }} />
              <Typography variant="body2">
                {hq.mediaRanking.toFixed(1)}
              </Typography>
            </Box>
          )}
          
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Visibility sx={{ fontSize: 16, color: 'text.secondary', mr: 0.5 }} />
            <Typography variant="body2" color="text.secondary">
              {hq.edicoesLidas || 0} lidas
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default HQCard;