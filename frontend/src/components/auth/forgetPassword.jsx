import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  CssBaseline,
  FormControl,
  FormLabel,
  TextField,
  Typography,
  Stack,
  Card as MuiCard,
  Link
} from '@mui/material';
import { styled } from '@mui/material/styles';
import AppTheme from '../../sharedTheme/appTheme';
import { SitemarkIcon } from './components/customIcons';
import { sendOTP } from "../../services/api"; // import API function
import { toast } from "react-toastify"; // for notifications

const Card = styled(MuiCard)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  maxWidth: 400,
  padding: theme.spacing(3),
  gap: theme.spacing(1.5),
  margin: 'auto',
  boxShadow:
    'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
  ...theme.applyStyles('dark', {
    boxShadow:
      'hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px',
  }),
}));

const Container = styled(Stack)(({ theme }) => ({
  height: '100dvh',
  justifyContent: 'center',
  alignItems: 'center',
  padding: theme.spacing(2),
  overflow: 'hidden',
  position: 'relative',
  '&::before': {
    content: '""',
    display: 'block',
    position: 'absolute',
    zIndex: -1,
    inset: 0,
    backgroundImage:
      'radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))',
    backgroundRepeat: 'no-repeat',
    ...theme.applyStyles('dark', {
      backgroundImage:
        'radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))',
    }),
  },
}));

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = React.useState('');
  const [error, setError] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState('');

  const validateEmail = (value) => {
    if (!value) {
      setError(true);
      setErrorMessage('Email is required');
      return false;
    } else if (!/\S+@\S+\.\S+/.test(value)) {
      setError(true);
      setErrorMessage('Enter a valid email address');
      return false;
    } else {
      setError(false);
      setErrorMessage('');
      return true;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateEmail(email)) return;

    try {
      const result = await sendOTP(email);
      toast.success(result.message);
      navigate("/verify-otp", { state: { email, otpExpiry: result.otpExpiry } });
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <AppTheme>
      <CssBaseline enableColorScheme />
      <Container>
        <Card>
          <SitemarkIcon />
          <Typography variant="h5" fontWeight="600" sx={{ mt: -1 }}>
            Forgot Password
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Enter your registered email to receive an OTP.
          </Typography>

          <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mt: 1 }}>
            <FormControl fullWidth>
              <FormLabel sx={{ mb: 0.5 }}>Email</FormLabel>
              <TextField
                size="small"
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={error}
                helperText={error ? errorMessage : ''}
                placeholder="your@email.com"
              />
            </FormControl>

            <Button
              sx={{ mt: 1 }}
              fullWidth
              variant="contained"
              type="submit"
            >
              Send OTP
            </Button>
            
            <Typography sx={{ textAlign: 'center', mt: 1 }} variant="body2">
              Remember your password?{' '}
              <Link component="button" onClick={() => navigate('/')} variant="body2">
                Sign in
              </Link>
            </Typography>
          </Box>
        </Card>
      </Container>
    </AppTheme>
  );
}
