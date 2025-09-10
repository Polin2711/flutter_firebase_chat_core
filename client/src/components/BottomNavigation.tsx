import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  BottomNavigation,
  BottomNavigationAction,
  Paper,
  Box,
  Typography,
} from '@mui/material';
import {
  Chat as ChatIcon,
  Person as PersonIcon,
  Book as BookIcon,
  MilitaryTech as MilitaryTechIcon,
} from '@mui/icons-material';

const BottomNav: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const getCurrentValue = () => {
    switch (location.pathname) {
      case '/':
        return 0;
      case '/profile':
        return 1;
      case '/dictionary':
        return 2;
      case '/ranks':
        return 3;
      default:
        return 0;
    }
  };

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    switch (newValue) {
      case 0:
        navigate('/');
        break;
      case 1:
        navigate('/profile');
        break;
      case 2:
        // Dictionary - show "SOON" message
        break;
      case 3:
        navigate('/ranks');
        break;
    }
  };

  return (
    <Paper
      sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        borderTop: '1px solid #e0e0e0',
      }}
      elevation={3}
    >
      <BottomNavigation
        value={getCurrentValue()}
        onChange={handleChange}
        showLabels
        sx={{
          '& .MuiBottomNavigationAction-root': {
            minWidth: 'auto',
            padding: '6px 0',
          },
          '& .MuiBottomNavigationAction-label': {
            fontSize: '0.75rem',
            fontWeight: 500,
          },
        }}
      >
        <BottomNavigationAction
          label="Chat"
          icon={<ChatIcon />}
          sx={{
            '&.Mui-selected': {
              color: 'primary.main',
            },
          }}
        />
        <BottomNavigationAction
          label="Perfil"
          icon={<PersonIcon />}
          sx={{
            '&.Mui-selected': {
              color: 'primary.main',
            },
          }}
        />
        <BottomNavigationAction
          label={
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="caption" display="block">
                Diccionario
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  color: 'text.secondary',
                  fontSize: '0.6rem',
                  fontWeight: 'bold',
                }}
              >
                SOON
              </Typography>
            </Box>
          }
          icon={<BookIcon />}
          sx={{
            '&.Mui-selected': {
              color: 'primary.main',
            },
            '& .MuiBottomNavigationAction-label': {
              opacity: 0.7,
            },
          }}
        />
        <BottomNavigationAction
          label="Rangos"
          icon={<MilitaryTechIcon />}
          sx={{
            '&.Mui-selected': {
              color: 'primary.main',
            },
          }}
        />
      </BottomNavigation>
    </Paper>
  );
};

export default BottomNav;