import * as React from 'react';
import { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import Link from '@mui/material/Link';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import MuiCard from '@mui/material/Card';
import { styled } from '@mui/material/styles';
import AppTheme from '../../sharedTheme/appTheme';
import { GoogleIcon, FacebookIcon, SitemarkIcon } from './components/customIcons';
import { useNavigate } from 'react-router-dom';
import { registerUser } from "../../services/api"; // import the API
import { toast } from "react-toastify"; // import toast for notifications

const Card = styled(MuiCard)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignSelf: 'center',
  width: '100%',
  padding: theme.spacing(3),
  gap: theme.spacing(1.5),
  margin: 'auto',
  [theme.breakpoints.up('sm')]: {
    maxWidth: '400px',
  },
  boxShadow:
    'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
  ...theme.applyStyles('dark', {
    boxShadow:
      'hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px',
  }),
}));

const SignUpContainer = styled(Stack)(({ theme }) => ({
  minHeight: '100dvh',
  padding: theme.spacing(2),
  paddingTop: '10vh',
  overflow: 'hidden',
  display: 'flex',
  alignItems: 'center',
  backgroundColor: theme.palette.background.default,
}));

export default function SignUp({ disableCustomTheme }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({ name: '', email: '', password: '' });
  const navigate = useNavigate();

  const validate = () => {
    const tempErrors = { name: '', email: '', password: '' };
    let isValid = true;

    if (!name.trim()) {
      tempErrors.name = 'Name is required';
      isValid = false;
    }

    if (!email) {
      tempErrors.email = 'Email is required';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      tempErrors.email = 'Enter a valid email';
      isValid = false;
    }

    if (!password) {
      tempErrors.password = 'Password is required';
      isValid = false;
    } else if (password.length < 8) {
      tempErrors.password = 'Must be at least 8 chars';
      isValid = false;
    }

    setErrors(tempErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const result = await registerUser(name, email, password);
      toast.success(result.message);
      navigate("/"); // redirect to login page
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <AppTheme disableCustomTheme={disableCustomTheme}>
      <CssBaseline enableColorScheme />
      <SignUpContainer>
        <Card variant="outlined">
          <SitemarkIcon />
          <Typography
            component="h1"
            variant="h5"
            fontWeight="600"
            sx={{ width: '100%', mt: -1 }}
          >
            Sign up
          </Typography>

          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ display: 'flex', flexDirection: 'column', width: '100%', gap: 1.5 }}
          >
            <FormControl>
              <FormLabel htmlFor="name" sx={{ mb: 0.5 }}>Full name</FormLabel>
              <TextField
                size="small"
                value={name}
                onChange={(e) => setName(e.target.value)}
                error={!!errors.name}
                helperText={errors.name}
                autoComplete="name"
                required
                fullWidth
                id="name"
                placeholder="Jon Snow"
              />
            </FormControl>

            <FormControl>
              <FormLabel htmlFor="email" sx={{ mb: 0.5 }}>Email</FormLabel>
              <TextField
                size="small"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={!!errors.email}
                helperText={errors.email}
                required
                fullWidth
                id="email"
                placeholder="your@email.com"
                type="email"
                autoComplete="email"
              />
            </FormControl>

            <FormControl>
              <FormLabel htmlFor="password" sx={{ mb: 0.5 }}>Password</FormLabel>
              <TextField
                size="small"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={!!errors.password}
                helperText={errors.password}
                required
                fullWidth
                name="password"
                placeholder="••••••••"
                type="password"
                id="password"
                autoComplete="new-password"
              />
            </FormControl>

            <FormControlLabel
              control={<Checkbox value="allowExtraEmails" color="primary" size="small" />}
              label={<Typography variant="body2">Receive updates via email</Typography>}
              sx={{ mt: -1 }}
            />

            <Button type="submit" fullWidth variant="contained" size="medium">
              Sign up
            </Button>
          </Box>

          <Divider sx={{ my: 0.5 }}>
            <Typography variant="caption" color="text.secondary">or</Typography>
          </Divider>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                fullWidth
                variant="outlined"
                onClick={() => alert('Sign up with Google')}
                startIcon={<GoogleIcon />}
                size="small"
                sx={{ py: 1 }}
              >
                Google
              </Button>
              <Button
                fullWidth
                variant="outlined"
                onClick={() => alert('Sign up with Facebook')}
                startIcon={<FacebookIcon />}
                size="small"
                sx={{ py: 1 }}
              >
                Facebook
              </Button>
            </Box>

            <Typography sx={{ textAlign: 'center' }} variant="body2">
              Already have an account?{' '}
              <Link component="button" onClick={() => navigate('/')} variant="body2">
                Sign in
              </Link>
            </Typography>
          </Box>
        </Card>
      </SignUpContainer>
    </AppTheme>
  );
}
