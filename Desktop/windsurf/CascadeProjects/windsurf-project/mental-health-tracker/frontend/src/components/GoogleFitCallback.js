import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { googleFitService } from '../services/googleFit';
import { Box, CircularProgress, Typography } from '@mui/material';

const GoogleFitCallback = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState(null);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const params = new URLSearchParams(location.search);
        const code = params.get('code');
        
        if (!code) {
          throw new Error('No authorization code received');
        }

        await googleFitService.handleCallback(code);
        navigate('/profile');
      } catch (err) {
        console.error('Error handling Google Fit callback:', err);
        setError(err.message);
      }
    };

    handleCallback();
  }, [location, navigate]);

  if (error) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
        <Typography variant="h6" color="error" gutterBottom>
          Error connecting to Google Fit
        </Typography>
        <Typography color="textSecondary">
          {error}
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
      <CircularProgress />
      <Typography sx={{ mt: 2 }}>
        Connecting to Google Fit...
      </Typography>
    </Box>
  );
};

export default GoogleFitCallback;
