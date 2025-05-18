import React, { useState } from 'react';
import { Box, Typography, useTheme, useMediaQuery, Paper } from '@mui/material';
import LoginForm from './LoginForm';
import LoginVisuals from './LoginVisuals';
import ForgotPassword from './ForgotPassword';

const Login: React.FC = () => {
  const theme = useTheme();
  const isMdUp = useMediaQuery(theme.breakpoints.up('md'));
  const [isForgotPassword, setIsForgotPassword] = useState(false);

  return (
    <Box
      display="flex"
      flexDirection={isMdUp ? 'row' : 'column'}
      height="100vh"
      width="100%"
      bgcolor={theme.palette.background.default}
    >
      <Box
        flex={1}
        p={{ xs: 1 }}
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
      >
        <Box width="100%"  maxWidth={400} >
          <Box sx={{ml: 4}}>
            <Typography variant="h3" fontWeight={700} mb={1}>
              Welcome back!
            </Typography>
            <Typography variant="subtitle1" fontWeight={500} color="text.secondary" mb={4} >
              The Central Modern School Teams
            </Typography>
          </Box>
          {isForgotPassword ? (
            <ForgotPassword onBackToLogin={() => setIsForgotPassword(false)} />
          ) : (
            <LoginForm onForgotPassword={() => setIsForgotPassword(true)} />
          )}
          {/* <LoginForm /> */}
        </Box>
      </Box>

      <Box
      flex={1}
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      >
        <Paper
          elevation={0}
          sx={{
            width: '100%',
            height: '100%',
            bgcolor: '#e6f4ea',
            borderRadius: 0,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            px: 4,
            position: 'relative', 
          }}
        >
          <LoginVisuals />
        </Paper>
      </Box>
    </Box>
  );
}
export default Login;
