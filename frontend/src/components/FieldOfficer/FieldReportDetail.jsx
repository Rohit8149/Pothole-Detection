import React, { useEffect, useMemo, useState } from 'react';
import './FieldOfficerDashboard.css';
import { useNavigate, Link } from 'react-router-dom';
import { getFieldOfficerReports, updateReportStatus } from '../../services/roleApi';

const statusColors = {
  Pending: '#ff9800',
  'Work Ordered': '#2196f3',
  'In Progress': '#9c27b0',
  Completed: '#4caf50',
};

const FieldOfficerDashboard = () => {
  const navigate = useNavigate();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [updatingId, setUpdatingId] = useState(null);

  const token = localStorage.getItem('fo_token');
  const user = (() => { 
    try { return JSON.parse(localStorage.getItem('fo_user') || '{}'); } 
    catch { return {}; } 
  })();

  useEffect(() => {
    if (!token) { navigate('/'); return; } // common login

    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await getFieldOfficerReports(token);
        setReports(data.reports || []);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate, token]);

  const filteredReports = useMemo(() => {
    return reports.filter(r => statusFilter ? r.status === statusFilter : true);
  }, [reports, statusFilter]);

  const handleStatusChange = async (reportId, nextStatus) => {
    if (!nextStatus) return;
    try {
      setUpdatingId(reportId);
      await updateReportStatus(reportId, nextStatus, token);
      setReports(prev => prev.map(r => r._id === reportId ? { ...r, status: nextStatus } : r));
      setUpdatingId(null);
    } catch (err) {
      console.error(err);
      setUpdatingId(null);
    }
  };

  return (
    <div className="role-dashboard-page">
      <header className="role-header">
        <div className="role-brand">
          <img src="/pothole-logo.svg" alt="PotholeDetect Logo" />
          <span>PotholeDetect</span>
        </div>
        <div className="role-user">
          <span>{user?.name || 'Field Officer'}</span>
          <button onClick={() => { 
            localStorage.removeItem('fo_token'); 
            localStorage.removeItem('fo_user'); 
            navigate('/'); // common login
          }}>Logout</button>
        </div>
      </header>

      <section className="role-hero">
        <div className="role-hero-content">
          <h1>Assigned Reports</h1>
          <p>Manage and update the status of pothole reports in your area</p>
        </div>
      </section>

      <main className="role-content">
        <div className="role-controls">
          <select className="role-select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="">All Status</option>
            <option value="Pending">Pending</option>
            <option value="Work Ordered">Work Ordered</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
        </div>

        <div className="role-grid">
          {loading && <div className="role-loading">Loading reports…</div>}
          {!loading && filteredReports.length === 0 && <div className="role-empty">No reports found.</div>}
          {!loading && filteredReports.map(r => (
            <div key={r._id} className="role-card">
              <div className="role-card-header">
                <span className="role-report-id">{r._id}</span>
                <span className="role-status" style={{ backgroundColor: statusColors[r.status] || '#757575' }}>{r.status}</span>
              </div>
              <div className="role-card-body">
                <h3 className="role-location">{typeof r.location === 'string' ? r.location : (r.location?.address || 'Location')}</h3>
                <p className="role-meta">Severity: {r.severity || r.priority || 'NA'}</p>
                <p className="role-meta">Date: {r.date ? new Date(r.date).toLocaleDateString() : '—'}</p>
              </div>
              <div className="role-card-actions">
                <Link className="role-btn-outline" to={`/field-officer/reports/${r._id}`}>Details</Link>
                <select
                  className="role-select"
                  disabled={updatingId === r._id}
                  value=""
                  onChange={(e) => handleStatusChange(r._id, e.target.value)}
                >
                  <option value="" disabled>Update Status</option>
                  <option value="Work Ordered">Work Ordered</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      </main>

      <footer className="role-footer">
        <p>© 2024 PotholeDetect</p>
      </footer>
    </div>
  );
};

export default FieldOfficerDashboard;
