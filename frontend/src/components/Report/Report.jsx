import React, { useState } from "react";
import { toast } from "react-toastify";
import { 
  Container, 
  Card, 
  CardContent, 
  Typography, 
  Button, 
  Box, 
  TextField, 
  MenuItem, 
  CircularProgress,
  IconButton
} from "@mui/material";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import MyLocationIcon from '@mui/icons-material/MyLocation';
import CloseIcon from '@mui/icons-material/Close';

const ReportPage = () => {
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [lat, setLat] = useState(null);
  const [lon, setLon] = useState(null);
  const [location, setLocation] = useState("");
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [severity, setSeverity] = useState("");
  const [description, setDescription] = useState("");
  const [submittedImage, setSubmittedImage] = useState(null);
  const [reportSubmitted, setReportSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle image upload & preview
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // Get current location + reverse geocode via backend
  const handleGetLocation = () => {
    setLoadingLocation(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          setLat(latitude);
          setLon(longitude);

          try {
            const res = await fetch(
              `http://localhost:5000/api/reports/reverse?lat=${latitude}&lon=${longitude}`
            );
            const data = await res.json();
            setLocation(data.display_name || `${latitude}, ${longitude}`);
          } catch (err) {
            console.error(err);
            setLocation(`${latitude}, ${longitude}`);
          }
          setLoadingLocation(false);
        },
        (err) => {
          console.error(err);
          setLocation("Unable to get location");
          setLoadingLocation(false);
        }
      );
    } else {
      alert("Geolocation not supported by your browser");
      setLoadingLocation(false);
    }
  };

  // Submit report to backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!imageFile || !location || !severity || !description) {
      toast.warn("⚠️ Please fill all fields!");
      return;
    }

    setIsSubmitting(true);
    const formData = new FormData();
    formData.append("image", imageFile);
    formData.append("address", location);
    formData.append("severity", severity.toLowerCase());
    formData.append("description", description);
    if (lat && lon) {
      formData.append("lat", lat);
      formData.append("lng", lon);
    }

    try {
      const res = await fetch("http://localhost:5000/api/reports", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        setSubmittedImage(data?.boxedImageUrl);
        setReportSubmitted(true);
        toast.success("✅ Report submitted successfully!");
      } else {
        toast.error(data.message || "❌ Error submitting report");
      }
    } catch (err) {
      console.error(err);
      toast.error("❌ Server error");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reset for new report
  const handleNewReport = () => {
    setReportSubmitted(false);
    setImageFile(null);
    setImagePreview(null);
    setLat(null);
    setLon(null);
    setLocation("");
    setSeverity("");
    setDescription("");
    setSubmittedImage(null);
  };

  return (
    <Container maxWidth="md" sx={{ py: 6, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      {!reportSubmitted ? (
        <Card variant="outlined" sx={{ width: '100%', maxWidth: 600, p: { xs: 2, md: 4 }, borderRadius: 3 }}>
          <Typography variant="h4" component="h1" fontWeight={700} gutterBottom align="center" color="text.primary">
            Report a Pothole
          </Typography>
          <Typography variant="body1" color="text.secondary" align="center" mb={4}>
            Help us identify and fix road hazards by submitting a photo and location.
          </Typography>

          <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            
            {/* Photo Upload */}
            <Box>
              <Typography variant="subtitle2" fontWeight={600} mb={1}>Photo Evidence</Typography>
              {!imagePreview ? (
                <Box
                  onClick={() => document.getElementById("photoInput").click()}
                  sx={{
                    border: '2px dashed',
                    borderColor: 'divider',
                    borderRadius: 2,
                    p: 4,
                    textAlign: 'center',
                    cursor: 'pointer',
                    bgcolor: 'background.default',
                    transition: 'all 0.2s ease',
                    '&:hover': { bgcolor: 'action.hover', borderColor: 'primary.main' }
                  }}
                >
                  <CloudUploadIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 1 }} />
                  <Typography variant="body1" color="text.secondary">
                    Click to upload photo
                  </Typography>
                </Box>
              ) : (
                <Box
                  onClick={() => document.getElementById("photoInput").click()}
                  sx={{
                    width: '100%',
                    height: 250,
                    borderRadius: 2,
                    overflow: 'hidden',
                    cursor: 'pointer',
                    position: 'relative',
                    '&:hover::after': {
                      content: '"Change Photo"',
                      position: 'absolute',
                      inset: 0,
                      bgcolor: 'rgba(0,0,0,0.5)',
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 600
                    }
                  }}
                >
                  <Box
                    component="img"
                    src={imagePreview}
                    alt="preview"
                    sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </Box>
              )}
              <input
                type="file"
                id="photoInput"
                accept="image/*"
                onChange={handleFileChange}
                style={{ display: "none" }}
              />
            </Box>

            {/* Location */}
            <Box>
              <Typography variant="subtitle2" fontWeight={600} mb={1}>Location</Typography>
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start', flexDirection: { xs: 'column', sm: 'row' } }}>
                <Button
                  variant="outlined"
                  onClick={handleGetLocation}
                  startIcon={loadingLocation ? <CircularProgress size={20} /> : <MyLocationIcon />}
                  disabled={loadingLocation}
                  sx={{ flexShrink: 0 }}
                >
                  {loadingLocation ? "Fetching..." : "Get Location"}
                </Button>
                <TextField
                  fullWidth
                  variant="outlined"
                  size="small"
                  placeholder="Location address will appear here"
                  value={location}
                  InputProps={{
                    readOnly: true,
                  }}
                  multiline
                />
              </Box>
            </Box>

            {/* Severity */}
            <Box>
              <Typography variant="subtitle2" fontWeight={600} mb={1}>Estimated Severity</Typography>
              <TextField
                select
                fullWidth
                value={severity}
                onChange={(e) => setSeverity(e.target.value)}
                variant="outlined"
                size="small"
              >
                <MenuItem value="">Select Severity</MenuItem>
                <MenuItem value="low">Low - Minor surface damage</MenuItem>
                <MenuItem value="medium">Medium - Noticeable dip, rough driving</MenuItem>
                <MenuItem value="high">High - Deep hole, potential vehicle damage</MenuItem>
                <MenuItem value="critical">Critical - Immediate danger to traffic</MenuItem>
              </TextField>
            </Box>

            {/* Description */}
            <Box>
              <Typography variant="subtitle2" fontWeight={600} mb={1}>Description</Typography>
              <TextField
                fullWidth
                multiline
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter any additional details about the pothole or surrounding area..."
                variant="outlined"
              />
            </Box>

            <Button 
              type="submit" 
              variant="contained" 
              size="large" 
              fullWidth
              disabled={isSubmitting}
              sx={{ mt: 2, py: 1.5, borderRadius: 2, fontSize: '1.1rem' }}
            >
              {isSubmitting ? <CircularProgress size={24} color="inherit" /> : "Submit Report"}
            </Button>
          </Box>
        </Card>
      ) : (
        <Card variant="outlined" sx={{ width: '100%', maxWidth: 700, p: 4, borderRadius: 3, textAlign: 'center', position: 'relative' }}>
          <IconButton 
            onClick={handleNewReport} 
            sx={{ position: 'absolute', top: 16, right: 16 }}
            aria-label="close"
          >
            <CloseIcon />
          </IconButton>
          
          <Typography variant="h4" fontWeight={700} gutterBottom color="success.main">
            Report Submitted!
          </Typography>
          <Typography variant="body1" color="text.secondary" mb={4}>
            Thank you for helping keep our roads safe. Here is the AI-verified analysis of your submission.
          </Typography>

          <Box sx={{ borderRadius: 2, overflow: 'hidden', border: '1px solid', borderColor: 'divider' }}>
            <Box
              component="img"
              src={submittedImage}
              alt="annotated pothole"
              sx={{ width: '100%', height: 'auto', display: 'block' }}
            />
          </Box>
          
          <Button 
            variant="contained" 
            onClick={handleNewReport}
            sx={{ mt: 4, px: 4, py: 1.5, borderRadius: 2 }}
          >
            Submit Another Report
          </Button>
        </Card>
      )}
    </Container>
  );
};

export default ReportPage;
