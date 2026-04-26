import * as React from "react";
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
} from "@mui/material";
import { styled } from "@mui/material/styles";
import AppTheme from "../../sharedTheme/appTheme";
import { SitemarkIcon } from "./components/customIcons";
import { useLocation, useNavigate } from "react-router-dom";
import { resetPassword } from "../../services/api";
import { toast } from "react-toastify";

const Card = styled(MuiCard)(({ theme }) => ({
  width: "100%",
  maxWidth: 400,
  padding: theme.spacing(3),
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(1.5),
  boxShadow:
    "hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px",
  ...theme.applyStyles("dark", {
    boxShadow:
      "hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px",
  }),
}));

const Container = styled(Stack)(({ theme }) => ({
  height: "100dvh",
  justifyContent: "center",
  alignItems: "center",
  padding: theme.spacing(2),
  overflow: "hidden",
  position: "relative",
  "&::before": {
    content: '""',
    display: "block",
    position: "absolute",
    zIndex: -1,
    inset: 0,
    backgroundImage:
      "radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))",
    backgroundRepeat: "no-repeat",
    ...theme.applyStyles("dark", {
      backgroundImage:
        "radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))",
    }),
  },
}));

export default function ResetPassword() {
  const [password, setPassword] = React.useState("");
  const [confirm, setConfirm] = React.useState("");
  const [passwordError, setPasswordError] = React.useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = React.useState("");
  const [confirmError, setConfirmError] = React.useState(false);
  const [confirmErrorMessage, setConfirmErrorMessage] = React.useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || "";

  const validatePasswords = () => {
    let valid = true;

    if (!password || password.length < 8) {
      setPasswordError(true);
      setPasswordErrorMessage("At least 8 chars required.");
      valid = false;
    } else {
      setPasswordError(false);
      setPasswordErrorMessage("");
    }

    if (confirm !== password) {
      setConfirmError(true);
      setConfirmErrorMessage("Passwords do not match.");
      valid = false;
    } else {
      setConfirmError(false);
      setConfirmErrorMessage("");
    }

    return valid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validatePasswords()) return;

    try {
      await resetPassword(email, password);
      toast.success("Password reset successful 🎉");
      setTimeout(() => {
        navigate("/");
      }, 1500);
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
          <Typography variant="h5" fontWeight="600" sx={{ mt: -1 }}>Reset Password</Typography>
          
          <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mt: 1 }}>
            <FormControl fullWidth>
              <FormLabel sx={{ mb: 0.5 }}>New Password</FormLabel>
              <TextField
                size="small"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter new password"
                error={passwordError}
                helperText={passwordError ? passwordErrorMessage : ""}
              />
            </FormControl>

            <FormControl fullWidth>
              <FormLabel sx={{ mb: 0.5 }}>Confirm Password</FormLabel>
              <TextField
                size="small"
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder="Confirm password"
                error={confirmError}
                helperText={confirmError ? confirmErrorMessage : ""}
              />
            </FormControl>

            <Button sx={{ mt: 1 }} fullWidth variant="contained" type="submit">
              Reset Password
            </Button>
          </Box>
        </Card>
      </Container>
    </AppTheme>
  );
}
