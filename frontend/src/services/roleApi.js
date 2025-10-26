const API_BASE = 'http://localhost:5000';

const jsonHeaders = (token) => ({
  'Content-Type': 'application/json',
  ...(token ? { Authorization: `Bearer ${token}` } : {})
});

export async function loginFieldOfficer({ email, password }) {
  const res = await fetch(`${API_BASE}/api/auth/field-officer/login`, {
    method: 'POST',
    headers: jsonHeaders(),
    body: JSON.stringify({ email, password })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Field officer login failed');
  return data; // { token, user }
}

export async function loginSupervisor({ email, password }) {
  const res = await fetch(`${API_BASE}/api/auth/supervisor/login`, {
    method: 'POST',
    headers: jsonHeaders(),
    body: JSON.stringify({ email, password })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Supervisor login failed');
  return data; // { token, user }
}

export async function getFieldOfficerReports(token) {
  const res = await fetch(`${API_BASE}/api/field-officer/reports`, {
    method: 'GET',
    headers: jsonHeaders(token)
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to fetch assigned reports');
  return data; // { reports: [...] }
}

export async function getReportDetail(reportId, token) {
  const res = await fetch(`${API_BASE}/api/field-officer/reports/${reportId}`, {
    method: 'GET',
    headers: jsonHeaders(token)
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to fetch report detail');
  return data; // { report }
}

export async function updateReportStatus(reportId, status, token) {
  const res = await fetch(`${API_BASE}/api/field-officer/reports/${reportId}/status`, {
    method: 'PUT',
    headers: jsonHeaders(token),
    body: JSON.stringify({ status })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to update report status');
  return data; // { success: true }
}

export async function getSupervisorReports(token) {
  const res = await fetch(`${API_BASE}/api/supervisor/reports`, {
    method: 'GET',
    headers: jsonHeaders(token)
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to fetch all reports');
  return data; // { reports: [...] }
}
