import React from "react";
import { useNavigate } from "react-router-dom";
import { Box, Typography, Button, Card, Grid } from "@mui/material";
import { alpha } from "@mui/material/styles";
import AssignmentImage from "../../assets/home.png"; // your generated image
import TrackChangesIcon from "@mui/icons-material/TrackChanges";
import MapIcon from "@mui/icons-material/Map";
import AnalyticsIcon from "@mui/icons-material/Analytics";
import ReportIcon from "@mui/icons-material/Report";
import VerifiedIcon from "@mui/icons-material/Verified";
import SecurityIcon from "@mui/icons-material/Security";

const features = [
  {
    title: "Track Progress",
    description:
      "Monitor your submitted pothole reports and see status updates in real-time.",
    icon: <TrackChangesIcon sx={{ fontSize: 40, color: "primary.main" }} />,
  },
  {
    title: "Map View",
    description:
      "Explore potholes visually on an interactive map with AI-detected locations.",
    icon: <MapIcon sx={{ fontSize: 40, color: "primary.main" }} />,
  },
  {
    title: "Analytics",
    description:
      "Check trends, severity patterns, and insights from all submitted reports.",
    icon: <AnalyticsIcon sx={{ fontSize: 40, color: "primary.main" }} />,
  },
  {
    title: "AI Verification",
    description: "Our AI ensures only valid pothole reports are saved.",
    icon: <VerifiedIcon sx={{ fontSize: 40, color: "success.main" }} />,
  },
  {
    title: "Report Potholes",
    description:
      "Submit reports with photos, location detection, and severity selection.",
    icon: <ReportIcon sx={{ fontSize: 40, color: "error.main" }} />,
  },
  {
    title: "Secure Access",
    description:
      "Role-based authentication ensures secure access for users, officers, and supervisors.",
    icon: <SecurityIcon sx={{ fontSize: 40, color: "warning.main" }} />,
  },
];

const HomePage = () => {
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem('token');

  const handleReportClick = () => {
    if (isLoggedIn) navigate('/report');
    else navigate('/');
  };

  const handleViewReportsClick = () => {
    if (isLoggedIn) navigate('/dashboard');
    else navigate('/');
  };

  return (
    <Box sx={{ pb: 8 }}>
      {/* Hero Section with Background Image */}
      <Box
        sx={{
          minHeight: "60vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          textAlign: { xs: "center", md: "left" },
          px: { xs: 3, md: 8 },
          color: "common.white",
          backgroundImage: `url(${AssignmentImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          position: "relative",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            bgcolor: alpha("#000", 0.4), // dark overlay
            zIndex: 1,
          },
        }}
      >
        <Box sx={{ position: "relative", zIndex: 2, maxWidth: 600 }}>
          <Typography
            variant="h2"
            fontWeight={600}
            gutterBottom
            sx={{ fontSize: { xs: "2rem", md: "3rem" }, lineHeight: 1.2 }}
          >
            Smart Pothole Detection
          </Typography>

          <Typography
            variant="body1"
            color="white"
            mb={6}
            sx={{ fontSize: { xs: "1rem", md: "1.25rem" }, lineHeight: 1.6 }}
          >
            Submit pothole reports, track progress, and monitor locations with
            AI verification and real-time analytics.
          </Typography>

          <Box sx={{ display: "flex", gap: 2 }}>
            {/* Primary Action */}
            <Button
              variant="contained"
              onClick={handleReportClick}
              sx={{
                bgcolor: "primary.main",
                color: "white",
                px: 4,
                py: 1.5,
                fontWeight: 500,
                borderRadius: 3,
                "&:hover": { bgcolor: "primary.dark" },
              }}
            >
              Report Pothole
            </Button>
            {/* Secondary Action */}
            <Button
              variant="contained"
              onClick={handleViewReportsClick}
              sx={{
                bgcolor: "background.paper",
                color: "primary.main",
                px: 4,
                py: 1.5,
                fontWeight: 500,
                borderRadius: 3,
                border: (theme) => `1px solid ${theme.palette.primary.main}`,
                "&:hover": { bgcolor: "grey.300" },
              }}
            >
              View Dashboard
            </Button>
          </Box>
        </Box>
      </Box>

      {/* Key Features */}
      {/* Key Features */}
      <Box
        mt={8}
        maxWidth="1200px"
        mx="auto"
        px={2}
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, 1fr)",
            md: "repeat(3, 1fr)",
          },
          gap: 4,
        }}
      >
        {features.map((feature, index) => (
          <Card
            key={index}
            sx={{
              height: 260, // 🔥 fixed height
              width: "100%",
              p: 3,
              textAlign: "center",
              borderRadius: 3,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              transition: "all 0.3s ease",
              "&:hover": {
                transform: "translateY(-6px)",
                boxShadow: (theme) =>
                  `0 8px 24px ${alpha(theme.palette.grey[400], 0.2)}`,
              },
            }}
          >
            <Box mb={2}>{feature.icon}</Box>

            <Typography variant="h6" fontWeight={600} mb={1}>
              {feature.title}
            </Typography>

            <Typography variant="body2" color="text.secondary">
              {feature.description}
            </Typography>
          </Card>
        ))}
      </Box>
    </Box>
  );
};

export default HomePage;
