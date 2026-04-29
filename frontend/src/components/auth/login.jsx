import * as React from "react";
import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import CssBaseline from "@mui/material/CssBaseline";
import FormControlLabel from "@mui/material/FormControlLabel";
import Divider from "@mui/material/Divider";
import FormLabel from "@mui/material/FormLabel";
import FormControl from "@mui/material/FormControl";
import Link from "@mui/material/Link";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import MuiCard from "@mui/material/Card";
import { styled } from "@mui/material/styles";
import AppTheme from "../../sharedTheme/appTheme";
import { GoogleIcon, FacebookIcon, SitemarkIcon } from "./components/customIcons";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { loginUser } from "../../services/api"; // import API service

const Card = styled(MuiCard)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignSelf: "center",
  width: "100%",
  padding: theme.spacing(3),
  gap: theme.spacing(1.5),
  margin: "auto",
  [theme.breakpoints.up("sm")]: {
    maxWidth: "400px",
  },
  boxShadow:
    "hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px",
  ...theme.applyStyles("dark", {
    boxShadow:
      "hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px",
  }),
}));

const SignInContainer = styled(Stack)(({ theme }) => ({
  minHeight: "100dvh",
  padding: theme.spacing(2),
  paddingTop: "10vh",
  overflow: "hidden",
  display: "flex",
  alignItems: "center",
  backgroundColor: theme.palette.background.default,
}));

function SignIn({ disableCustomTheme }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  useEffect(() => {
    // If user is already logged in, redirect them once on mount only
    const token = localStorage.getItem('token');
    if (token) {
      const role = localStorage.getItem('role');
      if (role === 'supervisor') navigate('/supervisor/dashboard', { replace: true });
      else if (role === 'field-officer') navigate('/field-officer/dashboard', { replace: true });
      else navigate('/dashboard', { replace: true });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run ONCE on mount only - prevents redirect loop

  const validate = () => {
    let tempErrors = { email: "", password: "" };
    let isValid = true;

    if (!email) {
      tempErrors.email = "Email is required";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      tempErrors.email = "Enter a valid email";
      isValid = false;
    }

    if (!password) {
      tempErrors.password = "Password is required";
      isValid = false;
    } else if (password.length < 8) {
      tempErrors.password = "Must be at least 8 chars";
      isValid = false;
    }

    setErrors(tempErrors);
    return isValid;
  };

  const submitLoginForm = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      const result = await loginUser(email, password);

      // Save token and optionally role/name
      localStorage.setItem("token", result.token);
      localStorage.setItem("role", result.role);
      localStorage.setItem("name", result.name);
      localStorage.setItem("userId", result.userId);
      localStorage.setItem("login", "true");

      toast.success("Login successful!");
      
      // Redirect based on role
      if (result.role === 'supervisor') {
        navigate('/supervisor/dashboard');
      } else if (result.role === 'field-officer') {
        navigate('/field-officer/dashboard');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      toast.error(err.message); // Show backend error
    }
  };

  return (
    <AppTheme disableCustomTheme={disableCustomTheme}>
      <CssBaseline enableColorScheme />
      <SignInContainer>
        <Card variant="outlined">
          <SitemarkIcon />
          <Typography
            component="h1"
            variant="h5"
            fontWeight="600"
            sx={{ width: "100%", mt: -1 }}
          >
            Sign in
          </Typography>
          <Box
            component="form"
            onSubmit={submitLoginForm}
            noValidate
            sx={{ display: "flex", flexDirection: "column", width: "100%", gap: 1.5 }}
          >
            <FormControl>
              <FormLabel htmlFor="email" sx={{ mb: 0.5 }}>Email</FormLabel>
              <TextField
                size="small"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={!!errors.email}
                helperText={errors.email}
                id="email"
                type="email"
                name="email"
                placeholder="your@email.com"
                autoComplete="email"
                autoFocus
                fullWidth
                required
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
                name="password"
                placeholder="••••••••"
                type="password"
                id="password"
                autoComplete="current-password"
                fullWidth
                required
              />
            </FormControl>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: -1 }}>
              <FormControlLabel
                control={<Checkbox value="remember" color="primary" size="small" />}
                label={<Typography variant="body2">Remember me</Typography>}
              />
              <Link
                component="button"
                type="button"
                onClick={() => navigate("/forget-password")}
                variant="body2"
              >
                Forgot password?
              </Link>
            </Box>

            <Button type="submit" fullWidth variant="contained" size="medium">
              Sign in
            </Button>
          </Box>

          <Divider sx={{ my: 0.5 }}>
            <Typography variant="caption" color="text.secondary">or</Typography>
          </Divider>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
            <Box sx={{ display: "flex", gap: 1 }}>
              <Button
                fullWidth
                variant="outlined"
                onClick={() => alert("Sign in with Google")}
                startIcon={<GoogleIcon />}
                size="small"
                sx={{ py: 1 }}
              >
                Google
              </Button>
              <Button
                fullWidth
                variant="outlined"
                onClick={() => alert("Sign in with Facebook")}
                startIcon={<FacebookIcon />}
                size="small"
                sx={{ py: 1 }}
              >
                Facebook
              </Button>
            </Box>

            <Button
              fullWidth
              variant="outlined"
              color="primary"
              onClick={() => navigate('/register')}
              sx={{ fontWeight: 600, borderStyle: 'dashed' }}
            >
              Create an account (Sign Up)
            </Button>
          </Box>
        </Card>
      </SignInContainer>
    </AppTheme>
  );
}

export default SignIn;
