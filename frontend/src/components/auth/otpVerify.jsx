import * as React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Box,
  Button,
  CssBaseline,
  Typography,
  Stack,
  Card as MuiCard,
  TextField,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import AppTheme from "../../sharedTheme/appTheme";
import { SitemarkIcon } from "./components/customIcons";
import { verifyOTP, resendOTP } from "../../services/api";

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

export default function VerifyOtp() {
  const navigate = useNavigate();
  const location = useLocation();

  const otpExpiry = location.state?.otpExpiry
    ? new Date(location.state.otpExpiry)
    : null;
  const email = location.state?.email || "";

  const [otp, setOtp] = React.useState(new Array(6).fill(""));
  const [error, setError] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState("");
  const [timer, setTimer] = React.useState(() => {
    if (!otpExpiry) return 0;
    const remaining = Math.floor((otpExpiry - new Date()) / 1000);
    return remaining > 0 ? remaining : 0;
  });

  const inputRefs = React.useRef([]);

  React.useEffect(() => {
    if (timer <= 0) return;
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [timer]);

  const handleChange = (e, index) => {
    const val = e.target.value.replace(/\D/, "");
    if (!val) return;

    const newOtp = [...otp];
    newOtp[index] = val[0];
    setOtp(newOtp);

    if (index < 5) inputRefs.current[index + 1].focus();
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const validateOtp = () => {
    if (otp.some((d) => d === "")) {
      setError(true);
      setErrorMessage("Complete the 6-digit OTP");
      return false;
    }
    setError(false);
    setErrorMessage("");
    return true;
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!validateOtp()) return;

    const otpValue = otp.join("");

    try {
      await verifyOTP(email, otpValue);
      navigate("/reset-password", { state: { email } });
    } catch (err) {
      setError(true);
      setErrorMessage(err.message);
    }
  };

  const handleResend = async () => {
    try {
      const data = await resendOTP(email);
      const remaining = Math.floor(
        (new Date(data.otpExpiry) - new Date()) / 1000,
      );

      setTimer(remaining > 0 ? remaining : 0);
      setOtp(new Array(6).fill(""));
      setError(false);
      setErrorMessage("");
    } catch (err) {
      setError(true);
      setErrorMessage(err.message);
    }
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  return (
    <AppTheme>
      <CssBaseline enableColorScheme />
      <Container>
        <Card>
          <SitemarkIcon />
          <Typography variant="h5" fontWeight="600" sx={{ mt: -1 }}>Verify OTP</Typography>
          <Typography variant="body2" color="text.secondary">
            Enter the 6-digit OTP sent to your email.
          </Typography>

          <Box component="form" onSubmit={handleVerify} sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mt: 1 }}>
            <Stack direction="row" spacing={1} justifyContent="space-between">
              {otp.map((digit, index) => (
                <TextField
                  key={index}
                  size="small"
                  inputRef={(el) => (inputRefs.current[index] = el)}
                  value={digit}
                  onChange={(e) => handleChange(e, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  inputProps={{
                    maxLength: 1,
                    style: {
                      textAlign: "center",
                      fontSize: "1.2rem",
                      padding: "8px 0",
                    },
                  }}
                  error={error}
                  sx={{ minWidth: '40px' }}
                />
              ))}
            </Stack>

            {error && (
              <Typography color="error" variant="body2" sx={{ textAlign: "center" }}>
                {errorMessage}
              </Typography>
            )}

            <Button sx={{ mt: 1 }} fullWidth variant="contained" type="submit">
              Verify
            </Button>
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, mt: 1 }}>
            <Typography align="center" variant="body2" color="text.secondary">
              {timer > 0 ? `Resend OTP in ${formatTime(timer)}` : "Didn’t receive OTP?"}
            </Typography>

            <Button
              disabled={timer > 0}
              onClick={handleResend}
              fullWidth
              variant="text"
              size="small"
            >
              Resend OTP
            </Button>
          </Box>
        </Card>
      </Container>
    </AppTheme>
  );
}
