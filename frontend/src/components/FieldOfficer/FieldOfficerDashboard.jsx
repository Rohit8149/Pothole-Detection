import React, { useEffect, useState, useMemo } from "react";
import "./FieldOfficerDashboard.css";
import { useNavigate } from "react-router-dom";
import {
  getFieldOfficerReports,
  updateReportStatus,
} from "../../services/roleApi";

const statusColors = {
  assigned: "#ff9800",
  "in-progress": "#9c27b0",
  completed: "#4caf50",
};

const statusLabels = {
  assigned: "Assigned",
  "in-progress": "In Progress",
  completed: "Completed",
};

const FieldOfficerDashboard = () => {
  const navigate = useNavigate();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("assigned");
  const [severityFilter, setSeverityFilter] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  // NEW: overlay state
  const [selectedReport, setSelectedReport] = useState(null);

  const token = localStorage.getItem("token");
  const user = (() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "{}");
    } catch {
      return {};
    }
  })();

  useEffect(() => {
    if (!token) {
      navigate("/");
      return;
    }
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await getFieldOfficerReports(token);
        console.log(data);
        // setReports(Array.isArray(data.reports) ? data.reports : []);
        const sortedReports = Array.isArray(data.reports)
          ? data.reports.sort(
              (a, b) => new Date(b.report?.date) - new Date(a.report?.date)
            )
          : [];
        setReports(sortedReports);

        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch reports:", err);
        setReports([]);
        setLoading(false);
      }
    };
    fetchData();
    
  }, [navigate, token]);

  const handleStatusChange = async (assignmentId, nextStatus) => {
    if (!nextStatus) return;
    try {
      setUpdatingId(assignmentId);
      const res = await updateReportStatus(assignmentId, nextStatus, token);
      const updatedAssignment = res.assignment;

      if (!updatedAssignment) {
        console.error("Backend did not return assignment");
        setUpdatingId(null);
        return;
      }

      setReports((prev) =>
        prev.map((r) =>
          r._id === updatedAssignment._id ? updatedAssignment : r
        )
      );
      setActiveTab(updatedAssignment.status);
      setUpdatingId(null);
    } catch (err) {
      console.error("Failed to update status:", err);
      setUpdatingId(null);
    }
  };

  const tabReports = useMemo(() => {
    let list = reports.filter((r) => r.status === activeTab);
    if (severityFilter) {
      list = list.filter((r) => r.report?.severity === severityFilter);
    }
    return list;
  }, [reports, activeTab, severityFilter]);

  return (
    <div className="role-dashboard-page">
      {/* ... header and hero unchanged ... */}
      <header className="role-header">
        {" "}
        <div className="role-brand">
          {" "}
          <img src="/pothole-logo.svg" alt="PotholeDetect Logo" />{" "}
          <span>PotholeDetect</span>{" "}
        </div>{" "}
        <div className="role-user">
          {" "}
          <span>{user?.name || "Field Officer"}</span>{" "}
          <button
            onClick={() => {
              localStorage.removeItem("token");
              localStorage.removeItem("user");
              navigate("/");
            }}
          >
            Logout
          </button>{" "}
        </div>{" "}
      </header>{" "}
      <section className="role-hero">
        {" "}
        <div className="role-hero-content">
          {" "}
          <h1>Assigned Reports</h1>{" "}
          <p>Manage and update the status of pothole reports in your area</p>{" "}
        </div>{" "}
      </section>
      <main className="role-content">
        {/* Tabs */}
        <div className="role-tabs">
          {["assigned", "in-progress", "completed"].map((status) => (
            <button
              key={status}
              className={`role-tab ${activeTab === status ? "active" : ""}`}
              onClick={() => {
                setActiveTab(status);
                setSeverityFilter("");
              }}
            >
              {statusLabels[status]} (
              {reports.filter((r) => r.status === status).length})
            </button>
          ))}
        </div>

        {/* Severity Filter */}
        <div className="role-controls">
          <label>Filter by Severity: </label>
          <select
            className="role-select"
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
          >
            <option value="">All</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="critical">Critical</option>
          </select>
        </div>

        <div className="role-grid">
          {loading && <div className="role-loading">Loading reports…</div>}
          {!loading && tabReports.length === 0 && (
            <div className="role-empty">No reports in this section.</div>
          )}
          {!loading &&
            tabReports.map((r) => (
              <div key={r._id} className="role-card">
                <div className="role-card-header">
                  <span className="role-report-id">
                    {r.report?.reportId || r._id}
                  </span>
                  <span
                    className="role-status"
                    style={{
                      backgroundColor: statusColors[r.status] || "#757575",
                    }}
                  >
                    {statusLabels[r.status] || r.status}
                  </span>
                </div>
                <div className="role-card-body">
                  <h3 className="role-location">
                    {r.report?.location?.address || "Location"}
                  </h3>
                  <p className="role-meta">
                    Severity: {r.report?.severity || "NA"}
                  </p>
                  <p className="role-meta">
                    Date:{" "}
                    {r.report?.date
                      ? new Date(r.report.date).toLocaleDateString()
                      : "—"}
                  </p>
                </div>
                <div className="role-card-actions">
                  {/* Instead of <Link>, open overlay */}
                  <button
                    className="role-btn-outline"
                    onClick={() => setSelectedReport(r)}
                  >
                    Details
                  </button>
                  <select
                    className="role-select"
                    disabled={updatingId === r._id}
                    value=""
                    onChange={(e) => handleStatusChange(r._id, e.target.value)}
                  >
                    <option value="" disabled>
                      Update Status
                    </option>
                    {r.status !== "in-progress" && (
                      <option value="in-progress">In Progress</option>
                    )}
                    {r.status !== "completed" && (
                      <option value="completed">Completed</option>
                    )}
                  </select>
                </div>
              </div>
            ))}
        </div>
      </main>
      <footer className="role-footer">
        <p>© 2025 PotholeDetect</p>
      </footer>
      {/* 🔹 Overlay Modal */}
      {/* 🔹 Overlay Modal */}
      {selectedReport && (
        <div className="report-overlay">
          <div className="report-overlay-content">
            <button
              className="report-close-btn"
              onClick={() => setSelectedReport(null)}
            >
              ✖
            </button>

            <h2>Report Details</h2>
            <div className="report-detail-row">
              <strong>ID:</strong> {selectedReport.report?.reportId}
            </div>
            <div className="report-detail-row">
              <strong>Description:</strong>{" "}
              {selectedReport.report?.description || "—"}
            </div>
            <div className="report-detail-row">
              <strong>Severity:</strong>{" "}
              {selectedReport.report?.severity || "—"}
            </div>
            <div className="report-detail-row">
              <strong>Status:</strong> {selectedReport.report?.status || "—"}
            </div>
            <div className="report-detail-row">
              <strong>Address:</strong>{" "}
              {selectedReport.report?.location?.address || "—"}
            </div>
            <div className="report-detail-row">
              <strong>Latitude:</strong>{" "}
              {selectedReport.report?.location?.lat || "—"}
            </div>
            <div className="report-detail-row">
              <strong>Longitude:</strong>{" "}
              {selectedReport.report?.location?.lng || "—"}
            </div>

            {/* Image at bottom */}
            {selectedReport.report?.imageUrl && (
              <img
                src={`http://localhost:5000${selectedReport.report.imageUrl}`}
                alt="report"
                className="report-image"
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default FieldOfficerDashboard;
