import React, { useEffect, useMemo, useState } from "react";
import "./SupervisorDashboard.css";
import { useNavigate } from "react-router-dom";
import { getSupervisorReports } from "../../services/roleApi";

const statusColor = (status) => {
  switch (status) {
    case "pending":
      return "#ff9800";
    case "verified":
      return "#2196f3";
    case "In Progress":
      return "#9c27b0";
    case "Work Ordered":
      return "#1976d2";
    case "completed":
      return "#4caf50";
    default:
      return "#757575";
  }
};

const SupervisorDashboard = () => {
  const navigate = useNavigate();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");

  const token = localStorage.getItem("token"); // common token for all users
  const user = (() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "{}");
    } catch {
      // common user for all roles
      return {};
    }
  })();

  useEffect(() => {
    if (!token) {
      navigate("/");
      return;
    } // common login

    const fetchReports = async () => {
      try {
        setLoading(true);
        const data = await getSupervisorReports(token);

        // Sort by date descending (latest first)
        const sortedReports = (data.reports || []).sort(
          (a, b) => new Date(b.date) - new Date(a.date)
        );

        setReports(sortedReports);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    console.log ("Fetching reports for supervisor dashboard");
    fetchReports();
  }, [navigate, token]);
console.log ("Fetching done for supervisor dashboard");
  const filteredReports = useMemo(
    () =>
      reports.filter((r) => (statusFilter ? r.status === statusFilter : true)),
    [reports, statusFilter]
  );

  const metrics = useMemo(() => {
    const total = reports.length;
    const pending = reports.filter((r) =>
      ["pending", "verified", "assigned"].includes(r.status)
    ).length;
    const progress = reports.filter((r) =>
      ["in-progress"].includes(r.status)
    ).length;
    const completed = reports.filter((r) => r.status === "completed").length;
    return { total, pending, progress, completed };
  }, [reports]);

  return (
    <div className="sup-dashboard-page">
      <header className="sup-header">
        <div className="sup-brand">
          <img src="/pothole-logo.svg" alt="PotholeDetect Logo" />
          <span>PotholeDetect</span>
        </div>
        <div className="sup-user">
          <span>{user?.name || "Supervisor"}</span>
          <button
            onClick={() => {
              localStorage.removeItem("token");
              localStorage.removeItem("user");
              navigate("/"); // common login
            }}
          >
            Logout
          </button>
        </div>
      </header>

      <section className="sup-hero">
        <div className="sup-hero-content">
          <h1>Reports Overview</h1>
          <p>Track progress and assignments across all areas</p>
        </div>
      </section>

      <main className="sup-content">
        <div className="sup-stats">
          <div className="sup-stat-card total">
            <div className="sup-stat-icon">📊</div>
            <div className="sup-stat-info">
              <h3>{metrics.total}</h3>
              <p>Total Reports</p>
            </div>
          </div>
          <div className="sup-stat-card pending">
            <div className="sup-stat-icon">⏳</div>
            <div className="sup-stat-info">
              <h3>{metrics.pending}</h3>
              <p>Pending</p>
            </div>
          </div>
          <div className="sup-stat-card progress">
            <div className="sup-stat-icon">🚧</div>
            <div className="sup-stat-info">
              <h3>{metrics.progress}</h3>
              <p>In Progress</p>
            </div>
          </div>
          <div className="sup-stat-card completed">
            <div className="sup-stat-icon">🏁</div>
            <div className="sup-stat-info">
              <h3>{metrics.completed}</h3>
              <p>Completed</p>
            </div>
          </div>
        </div>

        <div className="sup-controls">
          <select
            className="sup-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            {/* <option value="Work Ordered">Work Ordered</option> */}
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        <div className="sup-table">
          <div className="sup-table-header">
            <span>Report ID</span>
            <span>Location</span>
            <span>Status</span>
            <span>Severity</span>
            <span>Assigned Officer</span>
            <span>Date</span>
          </div>
          {loading && <div className="sup-loading">Loading reports…</div>}
          {!loading &&
            filteredReports.map((r) => (
              <div className="sup-table-row" key={r._id}>
                <span className="sup-id">{r.reportId}</span>
                <span className="sup-loc">
                  {r.location?.address || "Location"}
                </span>
                <span
                  className="sup-status"
                  style={{ backgroundColor: statusColor(r.status) }}
                >
                  {r.status}
                </span>
                <span className="sup-sev">{r.severity || "—"}</span>
                <span className="sup-officer">
                  {r.assignedTo?.name || "Unassigned"}
                </span>
                <span className="sup-date">
                  {r.date ? new Date(r.date).toLocaleDateString() : "—"}
                </span>
              </div>
            ))}
        </div>
      </main>

      <footer className="sup-footer">
        <p>© 2025 PotholeDetect</p>
      </footer>
    </div>
  );
};

export default SupervisorDashboard;
