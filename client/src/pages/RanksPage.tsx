import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Alert,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemText,
  Divider,
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  MilitaryTech as MilitaryTechIcon,
  People as PeopleIcon,
} from '@mui/icons-material';
import { rankAPI } from '../services/api';
import { Rank } from '../types';

const RanksPage: React.FC = () => {
  const [ranks, setRanks] = useState<Rank[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadRanks();
  }, []);

  const loadRanks = async () => {
    try {
      setIsLoading(true);
      const response = await rankAPI.getRanks();
      setRanks(response.ranks);
    } catch (err: any) {
      setError(err.message || 'Error al cargar los rangos');
    } finally {
      setIsLoading(false);
    }
  };

  const getRankColor = (level: number) => {
    if (level <= 3) return 'default';
    if (level <= 6) return 'primary';
    if (level <= 10) return 'secondary';
    if (level <= 14) return 'warning';
    return 'error';
  };

  const getRankBackgroundColor = (level: number) => {
    if (level <= 3) return '#e0e0e0';
    if (level <= 6) return '#e3f2fd';
    if (level <= 10) return '#f3e5f5';
    if (level <= 14) return '#fff3e0';
    return '#ffebee';
  };

  if (isLoading) {
    return (
      <Container maxWidth="lg">
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="100vh"
        >
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4, pb: 10 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <MilitaryTechIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
          <Typography variant="h3" component="h1" gutterBottom>
            Sistema de Rangos
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Jerarquía Militar de Las Empoderás
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* Ranks Overview */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" gutterBottom>
            Resumen de Rangos
          </Typography>
          <Grid container spacing={2}>
            {ranks.map((rank) => (
              <Grid item xs={12} sm={6} md={4} key={rank.id}>
                <Card
                  sx={{
                    height: '100%',
                    backgroundColor: getRankBackgroundColor(rank.level),
                    border: '1px solid #e0e0e0',
                  }}
                >
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Typography variant="h4" sx={{ mr: 2 }}>
                        {rank.icon}
                      </Typography>
                      <Box>
                        <Typography variant="h6" component="h3">
                          {rank.displayName}
                        </Typography>
                        <Chip
                          label={`Nivel ${rank.level}`}
                          size="small"
                          color={getRankColor(rank.level) as any}
                        />
                      </Box>
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      {rank.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        <Divider sx={{ my: 4 }} />

        {/* Detailed Ranks */}
        <Box>
          <Typography variant="h5" gutterBottom>
            Detalles de Rangos
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            Cada rango tiene requisitos específicos y otorga privilegios únicos dentro de la organización.
          </Typography>

          {ranks.map((rank) => (
            <Accordion key={rank.id} sx={{ mb: 1 }}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                sx={{
                  backgroundColor: getRankBackgroundColor(rank.level),
                  '&:hover': {
                    backgroundColor: getRankBackgroundColor(rank.level),
                    opacity: 0.8,
                  },
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                  <Typography variant="h4" sx={{ mr: 2 }}>
                    {rank.icon}
                  </Typography>
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="h6">
                      {rank.displayName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Nivel {rank.level} • {rank.description}
                    </Typography>
                  </Box>
                  <Chip
                    label={`Nivel ${rank.level}`}
                    color={getRankColor(rank.level) as any}
                    size="small"
                  />
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle1" gutterBottom>
                      Descripción
                    </Typography>
                    <Typography variant="body2" paragraph>
                      {rank.description}
                    </Typography>

                    {rank.requirements && (
                      <Box>
                        <Typography variant="subtitle1" gutterBottom>
                          Requisitos
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {rank.requirements}
                        </Typography>
                      </Box>
                    )}
                  </Grid>
                  <Grid item xs={12} md={6}>
                    {rank.privileges && rank.privileges.length > 0 && (
                      <Box>
                        <Typography variant="subtitle1" gutterBottom>
                          Privilegios
                        </Typography>
                        <List dense>
                          {rank.privileges.map((privilege, index) => (
                            <ListItem key={index} sx={{ py: 0 }}>
                              <ListItemText
                                primary={
                                  <Typography variant="body2">
                                    • {privilege}
                                  </Typography>
                                }
                              />
                            </ListItem>
                          ))}
                        </List>
                      </Box>
                    )}
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>
          ))}
        </Box>

        {/* Footer Information */}
        <Box sx={{ mt: 4, p: 3, backgroundColor: '#f5f5f5', borderRadius: 2 }}>
          <Typography variant="h6" gutterBottom>
            Sobre el Sistema de Rangos
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            El sistema de rangos de Las Empoderás está basado en la jerarquía militar tradicional,
            adaptado para fomentar el crecimiento personal y el liderazgo dentro de nuestra comunidad.
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            Los rangos se otorgan basándose en la participación activa, el compromiso con la comunidad,
            y la demostración de valores y liderazgo. Cada miembro comienza como Soldado Raso y puede
            avanzar a través de los rangos mediante su dedicación y contribuciones.
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Para más información sobre cómo avanzar en los rangos, contacta con los oficiales superiores
            o consulta las actividades y eventos disponibles en el chat grupal.
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default RanksPage;