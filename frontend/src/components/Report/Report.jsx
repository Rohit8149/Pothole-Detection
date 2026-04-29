import React, { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import {
  Typography,
  Button,
  Box,
  TextField,
  CircularProgress,
  Chip,
  LinearProgress,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import MyLocationIcon from "@mui/icons-material/MyLocation";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import AddAPhotoIcon from "@mui/icons-material/AddAPhoto";
import { useNavigate } from "react-router-dom";

const severityConfig = {
  low:      { label: "Low",      desc: "Minor surface damage"          },
  medium:   { label: "Medium",   desc: "Rough driving, noticeable dip" },
  high:     { label: "High",     desc: "Deep hole, vehicle damage"     },
  critical: { label: "Critical", desc: "Immediate danger to traffic"   },
};

const STEPS = [
  { id: 0, label: "Uploading image to server",      duration: 1200 },
  { id: 1, label: "Running AI pothole detection",   duration: 2800 },
  { id: 2, label: "Analysing severity & location",  duration: 1200 },
  { id: 3, label: "Saving report to database",      duration: 800  },
  { id: 4, label: "Report finalised!",              duration: 0    },
];

// ── Step Progress Component ───────────────────────────────────────────────────
const StepProgress = ({ currentStep, progress }) => (
  <Box sx={{ width: "100%", maxWidth: 420 }}>
    {/* Overall bar */}
    <LinearProgress
      variant="determinate"
      value={progress}
      sx={{ height: 6, borderRadius: 3, mb: 4, bgcolor: (t) => alpha(t.palette.primary.main, 0.12) }}
    />

    {/* Steps list */}
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
      {STEPS.map((step, i) => {
        const done    = i < currentStep;
        const active  = i === currentStep;
        const pending = i > currentStep;
        return (
          <Box key={step.id} sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            {/* Icon */}
            {done ? (
              <CheckCircleIcon sx={{ color: "success.main", fontSize: 22, flexShrink: 0 }} />
            ) : active ? (
              <CircularProgress size={20} sx={{ flexShrink: 0 }} />
            ) : (
              <RadioButtonUncheckedIcon sx={{ color: "divider", fontSize: 22, flexShrink: 0 }} />
            )}

            {/* Label */}
            <Typography
              variant="body2"
              fontWeight={active ? 700 : done ? 600 : 400}
              color={done ? "success.main" : active ? "text.primary" : "text.disabled"}
            >
              {step.label}
            </Typography>
          </Box>
        );
      })}
    </Box>
  </Box>
);

// ── Main Component ────────────────────────────────────────────────────────────
const ReportPage = () => {
  const navigate = useNavigate();
  const [imageFile, setImageFile]         = useState(null);
  const [imagePreview, setImagePreview]   = useState(null);
  const [lat, setLat]                     = useState(null);
  const [lon, setLon]                     = useState(null);
  const [location, setLocation]           = useState("");
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [severity, setSeverity]           = useState("");
  const [description, setDescription]    = useState("");
  const [submittedImage, setSubmittedImage] = useState(null);
  const [isDragging, setIsDragging]       = useState(false);

  // States: 'form' | 'loading' | 'success'
  const [screen, setScreen]               = useState("form");
  const [currentStep, setCurrentStep]     = useState(0);
  const [progress, setProgress]           = useState(0);
  const stepTimers = useRef([]);

  // ── File handlers ──────────────────────────────────────────────────────────
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) { setImageFile(file); setImagePreview(URL.createObjectURL(file)); }
  };

  const handleDrop = (e) => {
    e.preventDefault(); setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file?.type.startsWith("image/")) { setImageFile(file); setImagePreview(URL.createObjectURL(file)); }
  };

  // ── Location ───────────────────────────────────────────────────────────────
  const handleGetLocation = () => {
    setLoadingLocation(true);
    if (!navigator.geolocation) { alert("Geolocation not supported"); setLoadingLocation(false); return; }
    navigator.geolocation.getCurrentPosition(
      async ({ coords: { latitude, longitude } }) => {
        setLat(latitude); setLon(longitude);
        try {
          const res  = await fetch(`http://localhost:5000/api/reports/reverse?lat=${latitude}&lon=${longitude}`);
          const data = await res.json();
          setLocation(data.display_name || `${latitude}, ${longitude}`);
        } catch { setLocation(`${latitude}, ${longitude}`); }
        setLoadingLocation(false);
      },
      () => { setLocation("Unable to get location"); setLoadingLocation(false); }
    );
  };

  // ── Animated steps driver ──────────────────────────────────────────────────
  const runStepAnimation = () => {
    let elapsed = 0;
    const totalDuration = STEPS.slice(0, -1).reduce((s, st) => s + st.duration, 0);

    STEPS.slice(0, -1).forEach((step, i) => {
      const t = setTimeout(() => {
        setCurrentStep(i);
        setProgress(Math.round((elapsed / totalDuration) * 85)); // max 85% until api responds
      }, elapsed);
      stepTimers.current.push(t);
      elapsed += step.duration;
    });
  };

  // ── Submit ─────────────────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!imageFile || !location || !severity || !description) {
      toast.warn("⚠️ Please fill all fields!"); return;
    }

    setScreen("loading");
    setCurrentStep(0);
    setProgress(0);
    runStepAnimation();

    const formData = new FormData();
    formData.append("image", imageFile);
    formData.append("address", location);
    formData.append("severity", severity);
    formData.append("description", description);
    if (lat && lon) { formData.append("lat", lat); formData.append("lng", lon); }

    try {
      const res  = await fetch("http://localhost:5000/api/reports", {
        method: "POST",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        body: formData,
      });
      const data = await res.json();

      // Clear pending timers, jump to done
      stepTimers.current.forEach(clearTimeout);
      stepTimers.current = [];

      if (res.ok) {
        setCurrentStep(STEPS.length - 1);
        setProgress(100);
        setTimeout(() => { setSubmittedImage(data?.boxedImageUrl); setScreen("success"); }, 600);
        toast.success("✅ Report submitted!");
      } else {
        setScreen("form");
        toast.error(data.message || "❌ Error submitting report");
      }
    } catch {
      stepTimers.current.forEach(clearTimeout);
      setScreen("form");
      toast.error("❌ Server error");
    }
  };

  const handleNewReport = () => {
    setScreen("form"); setImageFile(null); setImagePreview(null);
    setLat(null); setLon(null); setLocation(""); setSeverity(""); setDescription(""); setSubmittedImage(null);
    setCurrentStep(0); setProgress(0);
  };

  useEffect(() => () => stepTimers.current.forEach(clearTimeout), []);

  const canSubmit = imageFile && location && severity && description;
  const SHELL_SX  = { display: "flex", height: "calc(100vh - 64px)", overflow: "hidden", bgcolor: "background.paper" };

  // ════════════════════════════════════════════════════════════════════════════
  // LOADING SCREEN
  // ════════════════════════════════════════════════════════════════════════════
  if (screen === "loading") {
    return (
      <Box sx={SHELL_SX}>
        {/* Left — submitted image, dimmed */}
        <Box sx={{ flex: "0 0 52%", p: 2, display: "flex", alignItems: "center", justifyContent: "center", borderRight: "1px solid", borderColor: "divider" }}>
          <Box
            component="img"
            src={imagePreview}
            alt="submitted"
            sx={{ width: "100%", height: "100%", objectFit: "contain", borderRadius: 2, opacity: 0.55, filter: "grayscale(40%)" }}
          />
        </Box>

        {/* Right — step progress */}
        <Box sx={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "flex-start", justifyContent: "center", p: 6, gap: 3 }}>
          <Box>
            <Typography variant="h5" fontWeight={800} color="text.primary">Processing your report…</Typography>
            <Typography variant="body2" color="text.secondary" mt={0.5}>Please keep this tab open</Typography>
          </Box>
          <StepProgress currentStep={currentStep} progress={progress} />
        </Box>
      </Box>
    );
  }

  // ════════════════════════════════════════════════════════════════════════════
  // SUCCESS SCREEN
  // ════════════════════════════════════════════════════════════════════════════
  if (screen === "success") {
    return (
      <Box sx={SHELL_SX}>
        {/* Left — full annotated image */}
        <Box sx={{ flex: "0 0 58%", p: 2, display: "flex", alignItems: "center", justifyContent: "center", borderRight: "1px solid", borderColor: "divider" }}>
          <Box
            component="img"
            src={submittedImage}
            alt="AI annotated pothole"
            sx={{ width: "100%", height: "100%", objectFit: "contain", borderRadius: 2 }}
          />
        </Box>

        {/* Right — details */}
        <Box sx={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", p: 5, gap: 2.5 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <CheckCircleIcon sx={{ fontSize: 40, color: "success.main" }} />
            <Box>
              <Typography variant="h5" fontWeight={800}>Report Submitted!</Typography>
              <Typography variant="body2" color="text.secondary">AI detection complete — pothole marked</Typography>
            </Box>
          </Box>

          <Box sx={{ p: 2, borderRadius: 2, border: "1px solid", borderColor: "divider", bgcolor: (t) => alpha(t.palette.success.main, 0.05) }}>
            <Typography variant="caption" color="text.secondary" fontWeight={700} display="block">LOCATION</Typography>
            <Typography variant="body2" fontWeight={600} mt={0.5}>{location}</Typography>
          </Box>
          <Box sx={{ p: 2, borderRadius: 2, border: "1px solid", borderColor: "divider", bgcolor: (t) => alpha(t.palette.primary.main, 0.05) }}>
            <Typography variant="caption" color="text.secondary" fontWeight={700} display="block">SEVERITY</Typography>
            <Typography variant="body2" fontWeight={600} mt={0.5} sx={{ textTransform: "capitalize" }}>{severity}</Typography>
          </Box>
          <Typography variant="body2" color="text.secondary">
            Our team has been notified and will assign a field officer to repair this pothole.
          </Typography>

          <Box sx={{ display: "flex", gap: 1.5, mt: 1 }}>
            <Button variant="contained" onClick={handleNewReport} sx={{ borderRadius: 2, fontWeight: 600, textTransform: "none", px: 3 }}>
              Report Another
            </Button>
            <Button variant="outlined" onClick={() => navigate("/dashboard")} sx={{ borderRadius: 2, fontWeight: 600, textTransform: "none", px: 3 }}>
              Dashboard
            </Button>
          </Box>
        </Box>
      </Box>
    );
  }

  // ════════════════════════════════════════════════════════════════════════════
  // FORM SCREEN
  // ════════════════════════════════════════════════════════════════════════════
  return (
    <Box component="form" onSubmit={handleSubmit} sx={SHELL_SX}>

      {/* ── LEFT: Title + Image Upload ── */}
      <Box sx={{
        flex: "0 0 52%",
        display: "flex",
        flexDirection: "column",
        p: 3,
        gap: 2,
        borderRight: "1px solid",
        borderColor: "divider",
        overflow: "hidden",
      }}>
        <Box>
          <Typography variant="h5" fontWeight={800} color="text.primary">Report a Pothole</Typography>
          <Typography variant="body2" color="text.secondary" mt={0.5}>Upload a photo — the AI will detect and mark potholes.</Typography>
        </Box>

        {/* Upload zone */}
        <Box
          onClick={() => document.getElementById("photoInput").click()}
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          sx={{
            flexGrow: 1,
            borderRadius: 3,
            border: "2px dashed",
            borderColor: isDragging ? "primary.main" : imagePreview ? "transparent" : (t) => alpha(t.palette.primary.main, 0.3),
            bgcolor: imagePreview ? "transparent" : (t) => alpha(t.palette.primary.main, 0.025),
            cursor: "pointer",
            position: "relative",
            overflow: "hidden",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "all 0.2s",
          }}
        >
          {imagePreview ? (
            <>
              <Box
                component="img"
                src={imagePreview}
                alt="preview"
                sx={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "contain" }}
              />
              <Box sx={{
                position: "absolute", inset: 0,
                display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column",
                color: "white", opacity: 0, transition: "opacity 0.2s",
                "&:hover": { opacity: 1, bgcolor: "rgba(0,0,0,0.45)" },
              }}>
                <AddAPhotoIcon sx={{ fontSize: 34, mb: 0.5 }} />
                <Typography variant="body2" fontWeight={700}>Change Photo</Typography>
              </Box>
              <Chip label="Photo added ✓" color="success" size="small" sx={{ position: "absolute", top: 12, left: 12, fontWeight: 700, zIndex: 2 }} />
            </>
          ) : (
            <Box sx={{ textAlign: "center", p: 3, userSelect: "none" }}>
              <Box sx={{ width: 64, height: 64, borderRadius: "50%", mx: "auto", mb: 2, bgcolor: (t) => alpha(t.palette.primary.main, 0.1), display: "flex", alignItems: "center", justifyContent: "center" }}>
                <CloudUploadIcon sx={{ fontSize: 32, color: "primary.main" }} />
              </Box>
              <Typography variant="h6" fontWeight={700} color="text.primary">{isDragging ? "Drop it here!" : "Upload Photo"}</Typography>
              <Typography variant="body2" color="text.secondary" mt={0.5}>Drag & drop or click to browse</Typography>
              <Typography variant="caption" color="text.disabled" display="block" mt={1}>JPG · PNG · WEBP · max 10 MB</Typography>
            </Box>
          )}
          <input type="file" id="photoInput" accept="image/*" onChange={handleFileChange} style={{ display: "none" }} />
        </Box>
      </Box>

      {/* ── RIGHT: Form Fields ── */}
      <Box sx={{ flex: 1, display: "flex", flexDirection: "column", p: 3, gap: 2.5, overflow: "hidden" }}>

        {/* Location */}
        <Box>
          <Typography variant="subtitle2" fontWeight={700} mb={1} color="text.primary">Location</Typography>
          <Box sx={{ display: "flex", gap: 1.5, alignItems: "flex-start" }}>
            <Button
              variant="outlined"
              onClick={handleGetLocation}
              startIcon={loadingLocation ? <CircularProgress size={16} /> : <MyLocationIcon />}
              disabled={loadingLocation}
              sx={{ flexShrink: 0, borderRadius: 2, fontWeight: 600, py: 1, textTransform: "none", minWidth: 110 }}
            >
              {loadingLocation ? "Detecting…" : "Detect"}
            </Button>
            <TextField
              fullWidth size="small"
              placeholder="Your location will appear here…"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              multiline maxRows={2}
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
            />
          </Box>
        </Box>

        {/* Severity */}
        <Box>
          <Typography variant="subtitle2" fontWeight={700} mb={1.5} color="text.primary">Severity Level</Typography>
          <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1 }}>
            {Object.entries(severityConfig).map(([key, cfg]) => {
              const active = severity === key;
              return (
                <Box key={key} onClick={() => setSeverity(key)} sx={{
                  p: 1.5, borderRadius: 2, border: "2px solid",
                  borderColor: active ? "primary.main" : "divider",
                  bgcolor: active ? (t) => alpha(t.palette.primary.main, 0.07) : "transparent",
                  cursor: "pointer", transition: "all 0.15s",
                  "&:hover": { borderColor: "primary.light", bgcolor: (t) => alpha(t.palette.primary.main, 0.04) }
                }}>
                  <Typography variant="caption" fontWeight={700} display="block" color={active ? "primary.main" : "text.primary"} sx={{ textTransform: "uppercase", letterSpacing: 0.5 }}>
                    {cfg.label}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" display="block" mt={0.3} sx={{ lineHeight: 1.3 }}>
                    {cfg.desc}
                  </Typography>
                </Box>
              );
            })}
          </Box>
        </Box>

        {/* Description */}
        <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
          <Typography variant="subtitle2" fontWeight={700} mb={1} color="text.primary">Description</Typography>
          <TextField
            fullWidth multiline
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe the pothole — location details, road condition, surrounding hazards…"
            sx={{ flexGrow: 1, "& .MuiOutlinedInput-root": { borderRadius: 2, height: "100%", alignItems: "flex-start" } }}
          />
        </Box>

        {/* Submit */}
        <Box>
          <Button
            type="submit" variant="contained" size="large" fullWidth
            disabled={!canSubmit}
            sx={{ py: 1.6, borderRadius: 2, fontWeight: 700, textTransform: "none", fontSize: "0.95rem", boxShadow: canSubmit ? "0 4px 16px rgba(37,99,235,0.25)" : "none" }}
          >
            Submit Report →
          </Button>
          {!canSubmit && (
            <Typography variant="caption" color="text.disabled" display="block" textAlign="center" mt={0.8}>
              {!imageFile ? "Upload a photo to continue" : !location ? "Detect your location" : !severity ? "Select severity level" : "Add a description"}
            </Typography>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default ReportPage;
