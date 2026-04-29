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
  CircularProgress,
  Divider,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import { getFieldOfficerReports, updateReportStatus } from "../../services/roleApi";
import Sidebar from "../common/Sidebar";
import AssignmentIcon from '@mui/icons-material/Assignment';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import MapIcon from '@mui/icons-material/Map';

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

  const sidebarItems = [
    { id: 'assigned', label: `Assigned (${reports.filter(r => r.status === 'assigned').length})`, icon: <AssignmentIcon /> },
    { id: 'in-progress', label: `In Progress (${reports.filter(r => r.status === 'in-progress').length})`, icon: <AutorenewIcon /> },
    { id: 'completed', label: `Completed (${reports.filter(r => r.status === 'completed').length})`, icon: <DoneAllIcon /> },
  ];

  const userInfo = {
    name: 'Field Officer',
    role: 'Staff Account',
    avatarText: 'F',
    avatarColor: 'secondary.main',
  };

  return (
    <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden', bgcolor: (theme) => alpha(theme.palette.primary.main, 0.01) }}>
      {/* Left Sidebar Component */}
      <Sidebar 
        menuItems={sidebarItems}
        activeItem={activeTab}
        onItemClick={(id) => { setActiveTab(id); setSeverityFilter(""); }}
        userInfo={userInfo}
      />

      {/* Main Content Area */}
      <Box sx={{ 
        flexGrow: 1, 
        height: '100vh', 
        overflowY: 'auto', 
        p: 4, 
        boxSizing: 'border-box',
        scrollbarWidth: 'none', /* Firefox */
        msOverflowStyle: 'none', /* IE/Edge */
        '&::-webkit-scrollbar': { display: 'none' } /* Chrome/Safari */
      }}>
        <Container maxWidth="xl" disableGutters>
          <Box sx={{ mb: 4 }}>
            <Typography variant="h4" fontWeight={800} gutterBottom sx={{ color: 'text.primary' }}>
              {activeTab === 'assigned' && 'Assigned Tasks'}
              {activeTab === 'in-progress' && 'Tasks In Progress'}
              {activeTab === 'completed' && 'Completed Repairs'}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Manage and update the status of pothole reports in your designated area.
            </Typography>
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
        <Grid container spacing={4}>
          {tabReports.map((r) => (
            <Grid item xs={12} sm={6} md={4} key={r._id}>
              <Card variant="outlined" sx={{ borderRadius: 4, height: '100%', display: 'flex', flexDirection: 'column', boxShadow: '0 4px 20px rgba(0,0,0,0.02)', transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-4px)' } }}>
                <CardContent sx={{ flexGrow: 1, p: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Typography variant="caption" sx={{ fontFamily: 'monospace', bgcolor: 'action.hover', px: 1.5, py: 0.5, borderRadius: 2, fontWeight: 600 }}>
                      {r.report?.reportId || r._id.substring(0, 8)}
                    </Typography>
                    <Chip 
                      label={statusLabels[r.status] || r.status} 
                      sx={{ bgcolor: (theme) => alpha(theme.palette[statusColors[r.status] || "default"].main, 0.1), color: (statusColors[r.status] || "default") + '.main', fontWeight: 600, borderRadius: 1.5 }} 
                      size="small" 
                    />
                  </Box>
                  <Typography variant="h6" fontWeight={700} gutterBottom sx={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', lineHeight: 1.3 }}>
                    {r.report?.location?.address || "Unknown Location"}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ textTransform: 'capitalize', mb: 2, fontWeight: 500 }}>
                    Severity: {r.report?.severity || "NA"}
                  </Typography>
                  <Typography variant="caption" color="text.disabled" fontWeight={500}>
                    Date: {r.report?.date ? new Date(r.report.date).toLocaleDateString() : "—"}
                  </Typography>
                </CardContent>
                <Divider />
                <CardActions sx={{ p: 2, px: 3, bgcolor: (theme) => alpha(theme.palette.primary.main, 0.01), display: 'flex', justifyContent: 'space-between', gap: 1, flexWrap: 'wrap' }}>
                  <Button size="small" variant="text" sx={{ fontWeight: 600 }} onClick={() => setSelectedReport(r)}>
                    View Details
                  </Button>
                  <FormControl size="small" sx={{ minWidth: 140 }}>
                    <Select
                      value=""
                      displayEmpty
                      disabled={updatingId === r._id}
                      onChange={(e) => handleStatusChange(r._id, e.target.value)}
                      sx={{ borderRadius: 2, bgcolor: 'background.paper' }}
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
      </Box>
    </Box>
  );
};

export default FieldOfficerDashboard;
