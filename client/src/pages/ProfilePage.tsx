import React, { useState } from 'react';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Avatar,
  Chip,
  Grid,
  Alert,
  CircularProgress,
  Divider,
} from '@mui/material';
import {
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

const ProfilePage: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    bio: '',
  });

  const { currentUser, updateProfile } = useAuth();

  React.useEffect(() => {
    if (currentUser) {
      setProfileData({
        firstName: currentUser.firstName,
        lastName: currentUser.lastName,
        bio: currentUser.bio || '',
      });
    }
  }, [currentUser]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = async () => {
    if (!currentUser) return;

    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      await updateProfile(profileData);
      setSuccess('Perfil actualizado exitosamente');
      setIsEditing(false);
    } catch (err: any) {
      setError(err.message || 'Error al actualizar el perfil');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    if (currentUser) {
      setProfileData({
        firstName: currentUser.firstName,
        lastName: currentUser.lastName,
        bio: currentUser.bio || '',
      });
    }
    setIsEditing(false);
    setError('');
    setSuccess('');
  };

  if (!currentUser) {
    return (
      <Container maxWidth="md">
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
    <Container maxWidth="md" sx={{ py: 4, pb: 10 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" component="h1">
            Mi Perfil
          </Typography>
          {!isEditing ? (
            <Button
              variant="outlined"
              startIcon={<EditIcon />}
              onClick={() => setIsEditing(true)}
            >
              Editar
            </Button>
          ) : (
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                variant="outlined"
                startIcon={<CancelIcon />}
                onClick={handleCancel}
                disabled={isLoading}
              >
                Cancelar
              </Button>
              <Button
                variant="contained"
                startIcon={<SaveIcon />}
                onClick={handleSave}
                disabled={isLoading}
              >
                {isLoading ? <CircularProgress size={20} /> : 'Guardar'}
              </Button>
            </Box>
          )}
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {success}
          </Alert>
        )}

        <Grid container spacing={3}>
          {/* Profile Picture and Basic Info */}
          <Grid item xs={12} md={4}>
            <Box sx={{ textAlign: 'center' }}>
              <Avatar
                sx={{
                  width: 120,
                  height: 120,
                  fontSize: '3rem',
                  bgcolor: 'primary.main',
                  mx: 'auto',
                  mb: 2,
                }}
              >
                {currentUser.fullName.charAt(0).toUpperCase()}
              </Avatar>
              <Typography variant="h5" gutterBottom>
                {currentUser.fullName}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                @{currentUser.username}
              </Typography>
              <Chip
                label={currentUser.rank.displayName}
                icon={<span>{currentUser.rank.icon}</span>}
                color="primary"
                sx={{ mb: 2 }}
              />
            </Box>
          </Grid>

          {/* Profile Details */}
          <Grid item xs={12} md={8}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Nombre"
                  name="firstName"
                  value={profileData.firstName}
                  onChange={handleChange}
                  disabled={!isEditing || isLoading}
                  variant={isEditing ? 'outlined' : 'filled'}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Apellido"
                  name="lastName"
                  value={profileData.lastName}
                  onChange={handleChange}
                  disabled={!isEditing || isLoading}
                  variant={isEditing ? 'outlined' : 'filled'}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Correo Electrónico"
                  value={currentUser.email}
                  disabled
                  variant="filled"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  label="Biografía"
                  name="bio"
                  value={profileData.bio}
                  onChange={handleChange}
                  disabled={!isEditing || isLoading}
                  variant={isEditing ? 'outlined' : 'filled'}
                  placeholder="Cuéntanos algo sobre ti..."
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>

        <Divider sx={{ my: 3 }} />

        {/* Additional Info */}
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="text.secondary">
              Fecha de Registro
            </Typography>
            <Typography variant="body1">
              {new Date(currentUser.joinDate).toLocaleDateString('es-ES', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="text.secondary">
              Última Conexión
            </Typography>
            <Typography variant="body1">
              {new Date(currentUser.lastSeen).toLocaleString('es-ES', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </Typography>
          </Grid>
        </Grid>

        {/* Rank Information */}
        <Divider sx={{ my: 3 }} />
        
        <Box>
          <Typography variant="h6" gutterBottom>
            Información del Rango
          </Typography>
          <Paper variant="outlined" sx={{ p: 2, backgroundColor: '#f5f5f5' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <Typography variant="h4">{currentUser.rank.icon}</Typography>
              <Box>
                <Typography variant="h6">{currentUser.rank.displayName}</Typography>
                <Typography variant="body2" color="text.secondary">
                  Nivel {currentUser.rank.level}
                </Typography>
              </Box>
            </Box>
            <Typography variant="body2" paragraph>
              {currentUser.rank.description}
            </Typography>
            {currentUser.rank.requirements && (
              <Box>
                <Typography variant="subtitle2" gutterBottom>
                  Requisitos:
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {currentUser.rank.requirements}
                </Typography>
              </Box>
            )}
            {currentUser.rank.privileges && currentUser.rank.privileges.length > 0 && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Privilegios:
                </Typography>
                <ul style={{ margin: 0, paddingLeft: 20 }}>
                  {currentUser.rank.privileges.map((privilege, index) => (
                    <li key={index}>
                      <Typography variant="body2" color="text.secondary">
                        {privilege}
                      </Typography>
                    </li>
                  ))}
                </ul>
              </Box>
            )}
          </Paper>
        </Box>
      </Paper>
    </Container>
  );
};

export default ProfilePage;