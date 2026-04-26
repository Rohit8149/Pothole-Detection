import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Box,
  Typography,
  Tabs,
  Tab,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Divider,
} from "@mui/material";
import { getFieldOfficerReports, updateReportStatus } from "../../services/roleApi";
import AssignmentIcon from '@mui/icons-material/Assignment';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import DoneAllIcon from '@mui/icons-material/DoneAll';

const statusColors = {
  assigned: "warning",
  "in-progress": "secondary",
  completed: "success",
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
  const [selectedReport, setSelectedReport] = useState(null);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await getFieldOfficerReports(token);
        const sortedReports = Array.isArray(data.reports)
          ? data.reports.sort((a, b) => new Date(b.report?.date) - new Date(a.report?.date))
          : [];
        setReports(sortedReports);
      } catch (err) {
        console.error("Failed to fetch reports:", err);
        setReports([]);
      } finally {
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

      if (updatedAssignment) {
        setReports((prev) => prev.map((r) => r._id === updatedAssignment._id ? updatedAssignment : r));
        setActiveTab(updatedAssignment.status);
      }
    } catch (err) {
      console.error("Failed to update status:", err);
    } finally {
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
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight={700} gutterBottom>
          Assigned Reports
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage and update the status of pothole reports in your designated area.
        </Typography>
      </Box>

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs 
          value={activeTab} 
          onChange={(e, val) => { setActiveTab(val); setSeverityFilter(""); }}
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab icon={<AssignmentIcon />} iconPosition="start" label={`Assigned (${reports.filter(r => r.status === 'assigned').length})`} value="assigned" />
          <Tab icon={<AutorenewIcon />} iconPosition="start" label={`In Progress (${reports.filter(r => r.status === 'in-progress').length})`} value="in-progress" />
          <Tab icon={<DoneAllIcon />} iconPosition="start" label={`Completed (${reports.filter(r => r.status === 'completed').length})`} value="completed" />
        </Tabs>
      </Box>

      {/* Controls */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'flex-end' }}>
        <FormControl size="small" sx={{ minWidth: 200 }}>
          <InputLabel>Filter by Severity</InputLabel>
          <Select
            value={severityFilter}
            label="Filter by Severity"
            onChange={(e) => setSeverityFilter(e.target.value)}
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="low">Low</MenuItem>
            <MenuItem value="medium">Medium</MenuItem>
            <MenuItem value="high">High</MenuItem>
            <MenuItem value="critical">Critical</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Grid */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      ) : tabReports.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="body1" color="text.secondary">No reports found in this section.</Typography>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {tabReports.map((r) => (
            <Grid item xs={12} sm={6} md={4} key={r._id}>
              <Card variant="outlined" sx={{ borderRadius: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="caption" sx={{ fontFamily: 'monospace', bgcolor: 'action.hover', px: 1, py: 0.5, borderRadius: 1 }}>
                      {r.report?.reportId || r._id.substring(0, 8)}
                    </Typography>
                    <Chip label={statusLabels[r.status] || r.status} color={statusColors[r.status] || "default"} size="small" />
                  </Box>
                  <Typography variant="h6" fontWeight={600} gutterBottom sx={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {r.report?.location?.address || "Unknown Location"}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ textTransform: 'capitalize' }}>
                    Severity: {r.report?.severity || "NA"}
                  </Typography>
                  <Typography variant="caption" color="text.disabled">
                    Date: {r.report?.date ? new Date(r.report.date).toLocaleDateString() : "—"}
                  </Typography>
                </CardContent>
                <Divider />
                <CardActions sx={{ p: 2, display: 'flex', justifyContent: 'space-between', gap: 1, flexWrap: 'wrap' }}>
                  <Button size="small" variant="outlined" onClick={() => setSelectedReport(r)}>
                    Details
                  </Button>
                  <FormControl size="small" sx={{ minWidth: 140 }}>
                    <Select
                      value=""
                      displayEmpty
                      disabled={updatingId === r._id}
                      onChange={(e) => handleStatusChange(r._id, e.target.value)}
                    >
                      <MenuItem value="" disabled>Update Status</MenuItem>
                      {r.status !== "in-progress" && <MenuItem value="in-progress">In Progress</MenuItem>}
                      {r.status !== "completed" && <MenuItem value="completed">Completed</MenuItem>}
                    </Select>
                  </FormControl>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Detail Dialog */}
      <Dialog open={!!selectedReport} onClose={() => setSelectedReport(null)} maxWidth="sm" fullWidth>
        {selectedReport && (
          <>
            <DialogTitle sx={{ fontWeight: 700 }}>
              Report Details
            </DialogTitle>
            <DialogContent dividers>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="caption" color="text.secondary" display="block">Report ID</Typography>
                  <Typography variant="body1" fontWeight={500} gutterBottom>{selectedReport.report?.reportId}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="caption" color="text.secondary" display="block">Status</Typography>
                  <Chip label={statusLabels[selectedReport.report?.status] || selectedReport.report?.status || "—"} color="primary" size="small" sx={{ mt: 0.5 }} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="caption" color="text.secondary" display="block">Severity</Typography>
                  <Typography variant="body1" fontWeight={500} gutterBottom sx={{ textTransform: 'capitalize' }}>{selectedReport.report?.severity || "—"}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="caption" color="text.secondary" display="block">Address</Typography>
                  <Typography variant="body1" fontWeight={500} gutterBottom>{selectedReport.report?.location?.address || "—"}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="caption" color="text.secondary" display="block">Description</Typography>
                  <Typography variant="body1" fontWeight={500} gutterBottom>{selectedReport.report?.description || "—"}</Typography>
                </Grid>
                {selectedReport.report?.imageUrl && (
                  <Grid item xs={12} sx={{ mt: 2 }}>
                    <Typography variant="caption" color="text.secondary" display="block" gutterBottom>Uploaded Image</Typography>
                    <Box 
                      component="img" 
                      src={`http://localhost:5000${selectedReport.report.imageUrl}`} 
                      alt="Pothole" 
                      sx={{ width: '100%', borderRadius: 2 }}
                    />
                  </Grid>
                )}
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setSelectedReport(null)} variant="contained">Close</Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Container>
  );
};

export default FieldOfficerDashboard;
