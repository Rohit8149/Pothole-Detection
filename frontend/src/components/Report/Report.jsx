import React, { useState } from "react";
import "./Report.css";
import Navbar from '../navbar/Navbar.jsx';
import { toast } from "react-toastify";

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
    <div className="report-page">
      <Navbar/>
      {!reportSubmitted ? (
        <div className="report-form-container">
          <h1>Report a Pothole</h1>
          <form className="report-form" onSubmit={handleSubmit}>
            {/* Photo Upload */}
            <div className="form-group photo-upload">
              {!imagePreview ? (
                <div
                  className="upload-area"
                  onClick={() => document.getElementById("photoInput").click()}
                >
                  <span className="camera-icon">📸</span>
                  <p>Click to upload photo</p>
                </div>
              ) : (
                <img
                  src={imagePreview}
                  alt="preview"
                  className="image-preview clickable"
                  onClick={() => document.getElementById("photoInput").click()}
                />
              )}
              <input
                type="file"
                id="photoInput"
                accept="image/*"
                onChange={handleFileChange}
                style={{ display: "none" }}
              />
            </div>

            {/* Location */}
            <div className="form-group">
              <label>Location</label>
              <button
                type="button"
                className="location-btn"
                onClick={handleGetLocation}
              >
                {loadingLocation ? "Fetching..." : "Get Current Location"}
              </button>
              {location && <p className="location-text">{location}</p>}
            </div>

            {/* Severity */}
            <div className="form-group">
              <label>Severity</label>
              <select
                value={severity}
                onChange={(e) => setSeverity(e.target.value)}
              >
                <option value="">Select Severity</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>

            {/* Description */}
            <div className="form-group">
              <label>Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter details about the pothole..."
              ></textarea>
            </div>

            <button type="submit" className="submit-btn">
              Submit Report
            </button>
          </form>
        </div>
      ) : (
        <div className="submitted-view">
          <button className="close-btn" onClick={handleNewReport}>
            ❌
          </button>
          <h2>Potholes Detected</h2>
          <img
            src={submittedImage}
            alt="annotated pothole"
            className="full-image"
          />
        </div>
      )}
    </div>
  );
};

export default ReportPage;
