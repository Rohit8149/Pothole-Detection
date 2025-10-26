import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Dashboard.css";
import Navbar from "../navbar/Navbar.jsx";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [userData, setUserData] = useState({ stats: {}, reports: [] });
  const [statusFilter, setStatusFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [userDetails, setUserDetails] = useState(null)
  // let userDetails;
  // Mock data - in real app this would come from API
  // const userStats = {
  //   totalReports: 23,
  //   pendingReports: 5,
  //   verifiedReports: 15,
  //   completedRepairs: 3,
  // };

  const recentReports = [
    {
      id: "PH-001",
      location: "Main St & 5th Ave",
      status: "Verified",
      severity: "High",
      date: "2024-01-15",
      priority: "urgent",
    },
    {
      id: "PH-002",
      location: "Oak Road near Park",
      status: "Pending",
      severity: "Medium",
      date: "2024-01-14",
      priority: "medium",
    },
    {
      id: "PH-003",
      location: "Highway 101 Exit 12",
      status: "In Progress",
      severity: "High",
      date: "2024-01-13",
      priority: "high",
    },
    {
      id: "PH-004",
      location: "Elm Street School Zone",
      status: "Completed",
      severity: "Low",
      date: "2024-01-12",
      priority: "low",
    },
    {
      id: "PH-005",
      location: "Downtown Bridge",
      status: "Verified",
      severity: "Critical",
      date: "2024-01-11",
      priority: "urgent",
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "#ff9800";
      case "verified":
        return "#2196f3";
      case "In Progress":
        return "#9c27b0";
      case "completed":
        return "#4caf50";
      default:
        return "#757575";
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case "critical":
        return "🔴";
      case "high":
        return "🟠";
      case "medium":
        return "🟡";
      case "low":
        return "🟢";
      default:
        return "⚪";
    }
  };
  const navigate = useNavigate();

  useEffect(() => {
    console.log(!localStorage.getItem("login"));
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUserDetails(parsedUser); // ✅ update state
      console.log("User loaded:", parsedUser);
    }
    if (!localStorage.getItem("login")) {
      navigate("/");
    }
    const fetchDashboardData = async () => {
      try {
        const getData = async () => {
          console.log("Fetching user data...");
          console.log("User ID:", localStorage.getItem("user"));
          const user = JSON.parse(localStorage.getItem("user"));

          const data = await fetch(
            `http://localhost:5000/api/getdata/dashboard/${user.id}`,
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
          if (data.status === 200) {
            console.log("Data fetched successfully");
            const response = await data.json();
            console.log("User Data:", response);
            setUserData(response);
            // Update state with user-specific data
          }
        };
        getData();
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
      }
    };
    fetchDashboardData();
  }, [navigate]);
  return (
    <div className="dashboard-page">
      <Navbar />

      {/* Dashboard Header */}
      <div className="dashboard-header">
        <div className="header-content">
          <div className="welcome-section">
            <h1>Welcome back, {userDetails?.name || 'User'}!</h1>
            <p>Here's your pothole reporting dashboard</p>
          </div>
          <div className="header-actions">
            <Link to="/report" className="btn-primary">
              <span>📸</span> Report New Pothole
            </Link>
          </div>
        </div>
      </div>

      {/* Dashboard Navigation */}
      <div className="dashboard-nav">
        <div className="nav-container">
          {[
            { key: "overview", label: "Overview", icon: "📊" },
            { key: "reports", label: "My Reports", icon: "📋" },
            { key: "map", label: "Map View", icon: "🗺️" },
            { key: "analytics", label: "Analytics", icon: "📈" },
          ].map((tab) => (
            <button
              key={tab.key}
              className={`nav-tab ${activeTab === tab.key ? "active" : ""}`}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Dashboard Content */}
      <div className="dashboard-content">
        {activeTab === "overview" && (
          <div className="overview-section">
            {/* Stats Cards */}
            <div className="stats-grid">
              <div className="stat-card total">
                <div className="stat-icon">📊</div>
                <div className="stat-info">
                  <h3>{userData?.stats.totalReports || 0}</h3>
                  <p>Total Reports</p>
                </div>
              </div>
              <div className="stat-card pending">
                <div className="stat-icon">⏳</div>
                <div className="stat-info">
                  <h3>{userData?.stats.pendingReports || 0}</h3>
                  <p>Pending Review</p>
                </div>
              </div>
              <div className="stat-card verified">
                <div className="stat-icon">✅</div>
                <div className="stat-info">
                  <h3>{userData?.stats.verifiedReports || 0}</h3>
                  <p>Verified</p>
                </div>
              </div>
              <div className="stat-card completed">
                <div className="stat-icon">🏁</div>
                <div className="stat-info">
                  <h3>{userData?.stats.completedReports || 0}</h3>
                  <p>Repairs Completed</p>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="recent-activity">
              <h2>Recent Reports</h2>
              <div className="reports-table">
                <div className="table-header">
                  <span>Report ID</span>
                  <span>Location</span>
                  <span>Status</span>
                  <span>Priority</span>
                  <span>Date</span>
                </div>

                {(userData?.reports || [])
                  .slice() // copy to avoid mutating state
                  .sort((a, b) => new Date(b.date) - new Date(a.date)) // sort by newest first
                  .slice(0, 5) // take only top 5
                  .map((report) => (
                    <div key={report._id} className="table-row">
                      <span className="report-id">{report.reportId}</span>
                      <span className="location">
                        {report?.location?.address || report?.location || "N/A"}
                      </span>
                      <span
                        className="status-badge"
                        style={{
                          backgroundColor: getStatusColor(report.status),
                        }}
                      >
                        {report.status}
                      </span>
                      <span className="priority">
                        {getPriorityIcon(report.severity)} {report.severity}
                      </span>
                      <span className="date">
                        {report.date
                          ? new Date(report.date).toLocaleDateString()
                          : "N/A"}
                      </span>
                    </div>
                  ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="quick-actions">
              <h2>Quick Actions</h2>
              <div className="actions-grid">
                <div className="action-card">
                  <div className="action-icon">📸</div>
                  <h3>Report Pothole</h3>
                  <p>Submit a new pothole report with photos and location</p>
                  <Link to="/report" className="action-btn">
                    Start Report
                  </Link>
                </div>
                <div className="action-card">
                  <div className="action-icon">📍</div>
                  <h3>View Map</h3>
                  <p>See all reported potholes in your area on the map</p>
                  <button
                    className="action-btn"
                    onClick={() => setActiveTab("map")}
                  >
                    Open Map
                  </button>
                </div>
                <div className="action-card">
                  <div className="action-icon">📈</div>
                  <h3>View Analytics</h3>
                  <p>Check detailed analytics of your reporting activity</p>
                  <button
                    className="action-btn"
                    onClick={() => setActiveTab("analytics")}
                  >
                    View Stats
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "reports" && (
          <div className="reports-section">
            <div className="section-header">
              <h2>My Reports</h2>
              <div className="filter-options">
                <select
                  className="filter-select"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="">All Status</option>
                  <option value="Pending">Pending</option>
                  <option value="Verified">Verified</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </select>
                <select
                  className="filter-select"
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value)}
                >
                  <option value="">All Priority</option>
                  <option value="Critical">Critical</option>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>
            </div>

            <div className="reports-grid">
              {(userData?.reports || [])
                .filter(
                  (report) =>
                    (statusFilter ? report.status === statusFilter : true) &&
                    (priorityFilter
                      ? report.priority.toLowerCase() ===
                        priorityFilter.toLowerCase()
                      : true)
                )
                .map((report) => (
                  <div key={report._id} className="report-card">
                    <div className="report-header">
                      <span className="report-id">{report._id}</span>
                      <span
                        className="status-badge"
                        style={{
                          backgroundColor: getStatusColor(report.status),
                        }}
                      >
                        {report.status}
                      </span>
                    </div>
                    <div className="report-info">
                      <h3>{report.location}</h3>
                      <p>
                        Severity: {getPriorityIcon(report.priority)}{" "}
                        {report.severity}
                      </p>
                      <p>Reported: {report.date}</p>
                    </div>
                    <div className="report-actions">
                      <button className="btn-outline">View Details</button>
                      <button className="btn-primary">Track Progress</button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {activeTab === "map" && (
          <div className="map-section">
            <div className="section-header">
              <h2>Pothole Map</h2>
              <div className="map-controls">
                <button className="map-btn active">My Reports</button>
                <button className="map-btn">All Reports</button>
                <button className="map-btn">Completed</button>
              </div>
            </div>

            <div className="map-container">
              <div className="map-placeholder">
                <div className="map-content">
                  <div className="map-icon">🗺️</div>
                  <h3>Interactive Map</h3>
                  <p>View all pothole reports on an interactive map</p>
                  <div className="map-legend">
                    <div className="legend-item">
                      <span className="legend-dot urgent"></span>
                      <span>Critical/Urgent</span>
                    </div>
                    <div className="legend-item">
                      <span className="legend-dot high"></span>
                      <span>High Priority</span>
                    </div>
                    <div className="legend-item">
                      <span className="legend-dot medium"></span>
                      <span>Medium Priority</span>
                    </div>
                    <div className="legend-item">
                      <span className="legend-dot low"></span>
                      <span>Low Priority</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "analytics" && (
          <div className="analytics-section">
            <div className="section-header">
              <h2>Analytics & Insights</h2>
              <div className="time-filter">
                <select className="filter-select">
                  <option>Last 30 Days</option>
                  <option>Last 3 Months</option>
                  <option>Last Year</option>
                  <option>All Time</option>
                </select>
              </div>
            </div>

            <div className="analytics-grid">
              <div className="chart-card">
                <h3>Reports Over Time</h3>
                <div className="chart-placeholder">
                  <div className="chart-bars">
                    <div className="bar" style={{ height: "60%" }}></div>
                    <div className="bar" style={{ height: "80%" }}></div>
                    <div className="bar" style={{ height: "45%" }}></div>
                    <div className="bar" style={{ height: "90%" }}></div>
                    <div className="bar" style={{ height: "70%" }}></div>
                    <div className="bar" style={{ height: "65%" }}></div>
                    <div className="bar" style={{ height: "85%" }}></div>
                  </div>
                  <p>Weekly reporting activity</p>
                </div>
              </div>

              <div className="chart-card">
                <h3>Status Distribution</h3>
                <div className="chart-placeholder">
                  <div className="pie-chart">
                    <div
                      className="pie-slice pending"
                      style={{ transform: "rotate(0deg)" }}
                    ></div>
                    <div
                      className="pie-slice verified"
                      style={{ transform: "rotate(90deg)" }}
                    ></div>
                    <div
                      className="pie-slice progress"
                      style={{ transform: "rotate(180deg)" }}
                    ></div>
                    <div
                      className="pie-slice completed"
                      style={{ transform: "rotate(270deg)" }}
                    ></div>
                  </div>
                  <div className="pie-legend">
                    <div className="legend-item">
                      <span className="legend-dot pending"></span>
                      <span>Pending (22%)</span>
                    </div>
                    <div className="legend-item">
                      <span className="legend-dot verified"></span>
                      <span>Verified (65%)</span>
                    </div>
                    <div className="legend-item">
                      <span className="legend-dot progress"></span>
                      <span>In Progress (10%)</span>
                    </div>
                    <div className="legend-item">
                      <span className="legend-dot completed"></span>
                      <span>Completed (3%)</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="chart-card full-width">
                <h3>Impact Summary</h3>
                <div className="impact-stats">
                  <div className="impact-item">
                    <div className="impact-number">156</div>
                    <div className="impact-label">Citizens Helped</div>
                  </div>
                  <div className="impact-item">
                    <div className="impact-number">23</div>
                    <div className="impact-label">Roads Improved</div>
                  </div>
                  <div className="impact-item">
                    <div className="impact-number">89%</div>
                    <div className="impact-label">Accuracy Rate</div>
                  </div>
                  <div className="impact-item">
                    <div className="impact-number">4.8</div>
                    <div className="impact-label">Average Rating</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-section">
            <div className="logo">
              <img src="/pothole-logo.svg" alt="PotholeDetect Logo" />
              <span>PotholeDetect</span>
            </div>
            <p>Making roads safer with smart technology.</p>
          </div>
          <div className="footer-section">
            <h3>Quick Links</h3>
            <ul>
              <li>
                <a href="/home">Home</a>
              </li>
              <li>
                <a href="/report">Report Pothole</a>
              </li>
              <li>
                <a href="/about">About Us</a>
              </li>
              <li>
                <a href="/contact">Contact</a>
              </li>
            </ul>
          </div>
          <div className="footer-section">
            <h3>Contact Info</h3>
            <p>📧 info@potholedetect.com</p>
            <p>📞 +1 (555) 123-4567</p>
            <p>📍 123 Tech Street, City</p>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2025 PotholeDetect. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;
