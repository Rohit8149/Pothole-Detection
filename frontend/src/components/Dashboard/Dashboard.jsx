import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Divider,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  CircularProgress,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import Sidebar from "../common/Sidebar";

// Icons
import AssessmentIcon from '@mui/icons-material/Assessment';
import AssignmentIcon from '@mui/icons-material/Assignment';
import MapIcon from '@mui/icons-material/Map';
import TimelineIcon from '@mui/icons-material/Timeline';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import BuildIcon from '@mui/icons-material/Build';
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';
import TravelExploreIcon from '@mui/icons-material/TravelExplore';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import CloseIcon from '@mui/icons-material/Close';
import LocationOnIcon from '@mui/icons-material/LocationOn';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [userData, setUserData] = useState({ stats: {}, reports: [] });
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [userDetails, setUserDetails] = useState(null);
  const [selectedReport, setSelectedReport] = useState(null);

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "warning";
      case "verified":
        return "info";
      case "in progress":
        return "secondary";
      case "completed":
        return "success";
      default:
        return "default";
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority?.toLowerCase()) {
      case "critical": return "🔴";
      case "high": return "🟠";
      case "medium": return "🟡";
      case "low": return "🟢";
      default: return "⚪";
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    const name = localStorage.getItem('name');
    const userId = localStorage.getItem('userId');
    if (name) setUserDetails({ name });

    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        if (userId && token) {
          const response = await fetch(
            `http://localhost:5000/api/getdata/dashboard/${userId}`,
            { headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` } }
          );
          if (response.ok) {
            const data = await response.json();
            setUserData(data);
          }
        }
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run once on mount

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const sidebarItems = [
    { id: 'overview', label: 'Overview', icon: <AssessmentIcon /> },
    { id: 'reports', label: 'My Reports', icon: <AssignmentIcon /> },
    { id: 'map', label: 'Map View', icon: <MapIcon /> },
    { id: 'analytics', label: 'Analytics', icon: <TimelineIcon /> },
  ];

  const userInfo = {
    name: userDetails?.name,
    role: 'Citizen Account',
    avatarText: userDetails?.name?.charAt(0),
    avatarColor: 'secondary.main',
  };

  return (
    <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden', bgcolor: (theme) => alpha(theme.palette.primary.main, 0.01) }}>
      {/* Left Sidebar Component */}
      <Sidebar 
        menuItems={sidebarItems}
        activeItem={activeTab}
        onItemClick={(id) => handleTabChange(null, id)}
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
          {/* Dashboard Header */}
          <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
            <Box>
              <Typography variant="h4" fontWeight={800} gutterBottom sx={{ color: 'text.primary' }}>
                {activeTab === 'overview' && `Welcome back, ${userDetails?.name || 'User'}!`}
                {activeTab === 'reports' && 'My Reports'}
                {activeTab === 'map' && 'Pothole Map'}
                {activeTab === 'analytics' && 'Analytics & Insights'}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {activeTab === 'overview' && "Here's your pothole reporting dashboard overview."}
                {activeTab === 'reports' && "Track and manage all the pothole reports you've submitted."}
                {activeTab === 'map' && "Explore the city map and view pothole distributions."}
                {activeTab === 'analytics' && "View statistics and the impact of community reporting."}
              </Typography>
            </Box>
            <Button 
              variant="contained" 
              component={Link} 
              to="/report"
              startIcon={<AddAPhotoIcon />}
              size="large"
              sx={{ borderRadius: 2, fontWeight: 600, boxShadow: '0 4px 12px rgba(37, 99, 235, 0.2)' }}
            >
              Report Pothole
            </Button>
          </Box>

      {/* Overview Tab */}
      {activeTab === "overview" && (
        <Box>
          {/* Stats Grid */}
          <Grid container spacing={3} mb={4}>
            <Grid item xs={12} sm={6} md={3}>
              <Card variant="outlined" sx={{ borderRadius: 4, p: 1.5, boxShadow: '0 4px 20px rgba(0,0,0,0.02)', transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 8px 24px rgba(0,0,0,0.04)' } }}>
                <CardContent sx={{ p: '16px !important', display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar sx={{ bgcolor: (theme) => alpha(theme.palette.primary.main, 0.1), color: 'primary.main', width: 56, height: 56 }}>
                    <AssessmentIcon fontSize="large" />
                  </Avatar>
                  <Box>
                    <Typography variant="h4" fontWeight={800} color="text.primary" sx={{ lineHeight: 1.2 }}>
                      {userData?.stats?.totalReports || 0}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" fontWeight={600} sx={{ mt: 0.5 }}>
                      Total Reports
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card variant="outlined" sx={{ borderRadius: 4, p: 1.5, boxShadow: '0 4px 20px rgba(0,0,0,0.02)', transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 8px 24px rgba(0,0,0,0.04)' } }}>
                <CardContent sx={{ p: '16px !important', display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar sx={{ bgcolor: (theme) => alpha(theme.palette.warning.main, 0.1), color: 'warning.main', width: 56, height: 56 }}>
                    <PendingActionsIcon fontSize="large" />
                  </Avatar>
                  <Box>
                    <Typography variant="h4" fontWeight={800} color="text.primary" sx={{ lineHeight: 1.2 }}>
                      {userData?.stats?.pendingReports || 0}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" fontWeight={600} sx={{ mt: 0.5 }}>
                      Pending Review
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card variant="outlined" sx={{ borderRadius: 4, p: 1.5, boxShadow: '0 4px 20px rgba(0,0,0,0.02)', transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 8px 24px rgba(0,0,0,0.04)' } }}>
                <CardContent sx={{ p: '16px !important', display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar sx={{ bgcolor: (theme) => alpha(theme.palette.info.main, 0.1), color: 'info.main', width: 56, height: 56 }}>
                    <CheckCircleIcon fontSize="large" />
                  </Avatar>
                  <Box>
                    <Typography variant="h4" fontWeight={800} color="text.primary" sx={{ lineHeight: 1.2 }}>
                      {userData?.stats?.verifiedReports || 0}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" fontWeight={600} sx={{ mt: 0.5 }}>
                      Verified
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card variant="outlined" sx={{ borderRadius: 4, p: 1.5, boxShadow: '0 4px 20px rgba(0,0,0,0.02)', transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 8px 24px rgba(0,0,0,0.04)' } }}>
                <CardContent sx={{ p: '16px !important', display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar sx={{ bgcolor: (theme) => alpha(theme.palette.success.main, 0.1), color: 'success.main', width: 56, height: 56 }}>
                    <BuildIcon fontSize="large" />
                  </Avatar>
                  <Box>
                    <Typography variant="h4" fontWeight={800} color="text.primary" sx={{ lineHeight: 1.2 }}>
                      {userData?.stats?.completedReports || 0}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" fontWeight={600} sx={{ mt: 0.5 }}>
                      Completed
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          <Grid container spacing={4}>
            {/* Recent Activity */}
            <Grid item xs={12} md={12} sx={{ display: 'flex', flexDirection: 'column' }}>
              <Card variant="outlined" sx={{ borderRadius: 4, flexGrow: 1, minHeight: 450, display: 'flex', flexDirection: 'column', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
                <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', p: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography variant="h6" fontWeight={700}>Recent Reports</Typography>
                    <Button variant="text" size="small" component={Link} to="/reports">View All</Button>
                  </Box>
                  <TableContainer component={Box} sx={{ flexGrow: 1, overflowY: 'auto' }}>
                    <Table size="medium" aria-label="recent reports table" sx={{ minWidth: 600 }}>
                      <TableHead>
                        <TableRow>
                          <TableCell sx={{ fontWeight: 600, color: 'text.secondary', borderBottom: '2px solid', borderColor: 'divider' }}>Report ID</TableCell>
                          <TableCell sx={{ fontWeight: 600, color: 'text.secondary', borderBottom: '2px solid', borderColor: 'divider' }}>Location</TableCell>
                          <TableCell sx={{ fontWeight: 600, color: 'text.secondary', borderBottom: '2px solid', borderColor: 'divider' }}>Status</TableCell>
                          <TableCell sx={{ fontWeight: 600, color: 'text.secondary', borderBottom: '2px solid', borderColor: 'divider' }}>Priority</TableCell>
                          <TableCell sx={{ fontWeight: 600, color: 'text.secondary', borderBottom: '2px solid', borderColor: 'divider' }}>Date</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {(userData?.reports || [])
                          .slice()
                          .sort((a, b) => new Date(b.date) - new Date(a.date))
                          .slice(0, 5)
                          .map((report) => (
                            <TableRow key={report._id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 }, '&:hover': { bgcolor: (theme) => alpha(theme.palette.primary.main, 0.02) } }}>
                              <TableCell sx={{ fontFamily: 'monospace', fontWeight: 500 }}>{report.reportId || report._id.substring(0,8)}</TableCell>
                              <TableCell sx={{ fontWeight: 500 }}>{report?.location?.address || report?.location || "N/A"}</TableCell>
                              <TableCell>
                                <Chip label={report.status} sx={{ bgcolor: (theme) => alpha(theme.palette[getStatusColor(report.status)].main, 0.1), color: getStatusColor(report.status) + '.main', fontWeight: 600, borderRadius: 1.5 }} size="small" />
                              </TableCell>
                              <TableCell>{getPriorityIcon(report.severity)} <span style={{ textTransform: 'capitalize', fontWeight: 500 }}>{report.severity}</span></TableCell>
                              <TableCell sx={{ color: 'text.secondary' }}>{report.date ? new Date(report.date).toLocaleDateString() : "N/A"}</TableCell>
                            </TableRow>
                          ))}
                        {(!userData?.reports || userData.reports.length === 0) && (
                           <TableRow>
                             <TableCell colSpan={5} align="center" sx={{ py: 6 }}>
                               <Box sx={{ color: 'text.disabled', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                 <AssessmentIcon sx={{ fontSize: 48, mb: 2, opacity: 0.5 }}/>
                                 <Typography variant="body1">No recent reports found.</Typography>
                               </Box>
                             </TableCell>
                           </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      )}

      {/* Reports Tab */}
      {activeTab === "reports" && (
        <Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
            <Typography variant="h6" fontWeight={700}>My Reports</Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <FormControl size="small" sx={{ minWidth: 150 }}>
                <InputLabel>Status</InputLabel>
                <Select value={statusFilter} label="Status" onChange={(e) => setStatusFilter(e.target.value)}>
                  <MenuItem value="">All</MenuItem>
                  <MenuItem value="pending">Pending</MenuItem>
                  <MenuItem value="verified">Verified</MenuItem>
                  <MenuItem value="in progress">In Progress</MenuItem>
                  <MenuItem value="completed">Completed</MenuItem>
                </Select>
              </FormControl>
              <FormControl size="small" sx={{ minWidth: 150 }}>
                <InputLabel>Priority</InputLabel>
                <Select value={priorityFilter} label="Priority" onChange={(e) => setPriorityFilter(e.target.value)}>
                  <MenuItem value="">All</MenuItem>
                  <MenuItem value="critical">Critical</MenuItem>
                  <MenuItem value="high">High</MenuItem>
                  <MenuItem value="medium">Medium</MenuItem>
                  <MenuItem value="low">Low</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Box>

          <Grid container spacing={3}>
            {(userData?.reports || [])
              .filter(report => (statusFilter ? report.status?.toLowerCase() === statusFilter : true))
              .filter(report => (priorityFilter ? report.severity?.toLowerCase() === priorityFilter : true))
              .map((report) => (
                <Grid item xs={12} sm={6} md={4} key={report._id}>
                  <Card variant="outlined" sx={{ borderRadius: 4, height: '100%', display: 'flex', flexDirection: 'column', boxShadow: '0 4px 20px rgba(0,0,0,0.02)', transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-4px)' } }}>
                    <CardContent sx={{ flexGrow: 1, p: 3 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                        <Typography variant="caption" sx={{ fontFamily: 'monospace', bgcolor: 'action.hover', px: 1.5, py: 0.5, borderRadius: 2, fontWeight: 600 }}>
                          {report._id.substring(0, 10)}...
                        </Typography>
                        <Chip label={report.status} sx={{ bgcolor: (theme) => alpha(theme.palette[getStatusColor(report.status)].main, 0.1), color: getStatusColor(report.status) + '.main', fontWeight: 600, borderRadius: 1.5 }} size="small" />
                      </Box>
                      <Typography variant="h6" fontWeight={700} gutterBottom sx={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', lineHeight: 1.3 }}>
                        {report.location?.address || report.location || "Unknown Location"}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" mb={2} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        {getPriorityIcon(report.severity)} <strong style={{ textTransform: 'capitalize' }}>{report.severity}</strong> Severity
                      </Typography>
                      <Typography variant="caption" color="text.disabled" fontWeight={500}>
                        Reported: {report.date ? new Date(report.date).toLocaleDateString() : 'N/A'}
                      </Typography>
                    </CardContent>
                    <Divider />
                    <CardActions sx={{ p: 2, px: 3, bgcolor: (theme) => alpha(theme.palette.primary.main, 0.01) }}>
                      <Button size="small" variant="text" sx={{ fontWeight: 600 }} onClick={() => setSelectedReport(report)}>View Details</Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
          {/* Empty state for My Reports */}
          {!loading && userData?.reports?.length === 0 && (
            <Box sx={{ textAlign: 'center', py: 10 }}>
              <AssessmentIcon sx={{ fontSize: 64, color: 'text.disabled', mb: 2, opacity: 0.4 }} />
              <Typography variant="h6" color="text.secondary" fontWeight={600}>No reports yet</Typography>
              <Typography variant="body2" color="text.disabled" mt={1} mb={3}>Start by reporting a pothole in your area.</Typography>
              <Button variant="contained" component={Link} to="/report" startIcon={<AddAPhotoIcon />} sx={{ borderRadius: 2, fontWeight: 600 }}>
                Report a Pothole
              </Button>
            </Box>
          )}
          {loading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
              <CircularProgress />
            </Box>
          )}
          </Grid>
        </Box>
      )}

      {/* Map Tab */}
      {activeTab === "map" && (
        <Card variant="outlined" sx={{ borderRadius: 4, boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
          <CardContent sx={{ p: 0 }}>
            <Box sx={{ p: 3, px: 4, borderBottom: 1, borderColor: 'divider', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6" fontWeight={700}>Pothole Map</Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button variant="contained" size="small" sx={{ borderRadius: 2, boxShadow: 'none' }}>My Reports</Button>
                <Button variant="outlined" size="small" color="secondary" sx={{ borderRadius: 2, color: 'text.primary', borderColor: 'divider' }}>All Reports</Button>
                <Button variant="outlined" size="small" color="secondary" sx={{ borderRadius: 2, color: 'text.primary', borderColor: 'divider' }}>Completed</Button>
              </Box>
            </Box>
            <Box sx={{ height: 'calc(100vh - 300px)', minHeight: 600, bgcolor: (theme) => alpha(theme.palette.primary.main, 0.02), display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', p: 4, textAlign: 'center' }}>
               <MapIcon sx={{ fontSize: 72, color: 'text.disabled', mb: 3, opacity: 0.5 }} />
               <Typography variant="h5" color="text.secondary" fontWeight={600} gutterBottom>Interactive Map Placeholder</Typography>
               <Typography variant="body1" color="text.secondary" maxWidth={500}>
                 In a real implementation, a map component (like react-leaflet or Google Maps) would render here, taking up the full vertical space, showing pins for all report locations.
               </Typography>
            </Box>
          </CardContent>
        </Card>
      )}

      {/* Analytics Tab */}
      {activeTab === "analytics" && (
        <Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6" fontWeight={700}>Analytics & Insights</Typography>
            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel>Time Range</InputLabel>
              <Select value="30days" label="Time Range">
                <MenuItem value="30days">Last 30 Days</MenuItem>
                <MenuItem value="3months">Last 3 Months</MenuItem>
                <MenuItem value="1year">Last Year</MenuItem>
                <MenuItem value="all">All Time</MenuItem>
              </Select>
            </FormControl>
          </Box>

          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Card variant="outlined" sx={{ borderRadius: 4, height: 450, display: 'flex', flexDirection: 'column', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
                <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', p: 3 }}>
                  <Typography variant="h6" fontWeight={700} gutterBottom>Reports Over Time</Typography>
                  <Box sx={{ flexGrow: 1, bgcolor: (theme) => alpha(theme.palette.primary.main, 0.02), border: '1px dashed', borderColor: 'divider', borderRadius: 3, display: 'flex', alignItems: 'center', justifyContent: 'center', mt: 2 }}>
                    <Typography color="text.disabled" fontWeight={600}>Line Chart Placeholder</Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card variant="outlined" sx={{ borderRadius: 4, height: 450, display: 'flex', flexDirection: 'column', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
                <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', p: 3 }}>
                  <Typography variant="h6" fontWeight={700} gutterBottom>Status Distribution</Typography>
                  <Box sx={{ flexGrow: 1, bgcolor: (theme) => alpha(theme.palette.primary.main, 0.02), border: '1px dashed', borderColor: 'divider', borderRadius: 3, display: 'flex', alignItems: 'center', justifyContent: 'center', mt: 2 }}>
                    <Typography color="text.disabled" fontWeight={600}>Pie Chart Placeholder</Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12}>
              <Card variant="outlined" sx={{ borderRadius: 4, boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
                <CardContent sx={{ p: 4 }}>
                  <Typography variant="h6" fontWeight={700} gutterBottom>Impact Summary</Typography>
                  <Grid container spacing={3} sx={{ mt: 1 }}>
                    <Grid item xs={6} sm={3}>
                      <Box sx={{ textAlign: 'center', p: 3, bgcolor: (theme) => alpha(theme.palette.primary.main, 0.05), borderRadius: 3 }}>
                        <Typography variant="h3" fontWeight={800} color="primary.main" mb={1}>156</Typography>
                        <Typography variant="body1" color="text.secondary" fontWeight={600}>Citizens Helped</Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6} sm={3}>
                      <Box sx={{ textAlign: 'center', p: 3, bgcolor: (theme) => alpha(theme.palette.success.main, 0.05), borderRadius: 3 }}>
                        <Typography variant="h3" fontWeight={800} color="success.main" mb={1}>23</Typography>
                        <Typography variant="body1" color="text.secondary" fontWeight={600}>Roads Improved</Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6} sm={3}>
                      <Box sx={{ textAlign: 'center', p: 3, bgcolor: (theme) => alpha(theme.palette.info.main, 0.05), borderRadius: 3 }}>
                        <Typography variant="h3" fontWeight={800} color="info.main" mb={1}>89%</Typography>
                        <Typography variant="body1" color="text.secondary" fontWeight={600}>Accuracy Rate</Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6} sm={3}>
                      <Box sx={{ textAlign: 'center', p: 3, bgcolor: (theme) => alpha(theme.palette.warning.main, 0.05), borderRadius: 3 }}>
                        <Typography variant="h3" fontWeight={800} color="warning.main" mb={1}>4.8</Typography>
                        <Typography variant="body1" color="text.secondary" fontWeight={600}>Average Rating</Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      )}
      {/* ── View Details Modal ── */}
      <Dialog open={!!selectedReport} onClose={() => setSelectedReport(null)} maxWidth="md" fullWidth>
        {selectedReport && (
          <>
            <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontWeight: 800, pb: 1 }}>
              Report Details
              <IconButton onClick={() => setSelectedReport(null)} size="small"><CloseIcon /></IconButton>
            </DialogTitle>
            <DialogContent dividers sx={{ p: 0 }}>
              <Box sx={{ display: 'flex', minHeight: 380 }}>
                {/* Left: AI-annotated image */}
                <Box sx={{ flex: '0 0 55%', bgcolor: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center', p: 2 }}>
                  {selectedReport.boxedImageUrl || selectedReport.imageUrl ? (
                    <Box component="img"
                      src={`http://localhost:5000${selectedReport.boxedImageUrl || selectedReport.imageUrl}`}
                      alt="Pothole"
                      sx={{ maxWidth: '100%', maxHeight: 340, objectFit: 'contain', borderRadius: 1 }}
                    />
                  ) : (
                    <Box sx={{ textAlign: 'center', color: 'grey.500' }}>
                      <LocationOnIcon sx={{ fontSize: 48, mb: 1, opacity: 0.5 }} />
                      <Typography variant="body2">No image available</Typography>
                    </Box>
                  )}
                </Box>
                {/* Right: details */}
                <Box sx={{ flex: 1, p: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Box>
                    <Typography variant="caption" color="text.disabled" fontWeight={700}>REPORT ID</Typography>
                    <Typography variant="body2" fontWeight={600} fontFamily="monospace">{selectedReport.reportId || selectedReport._id}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.disabled" fontWeight={700}>LOCATION</Typography>
                    <Typography variant="body2" fontWeight={600}>{selectedReport.location?.address || selectedReport.location || '—'}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="caption" color="text.disabled" fontWeight={700}>STATUS</Typography>
                      <Box mt={0.5}>
                        <Chip
                          label={selectedReport.status}
                          size="small"
                          sx={{ bgcolor: (t) => alpha(t.palette[getStatusColor(selectedReport.status)].main, 0.1), color: getStatusColor(selectedReport.status) + '.main', fontWeight: 700, borderRadius: 1.5 }}
                        />
                      </Box>
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="caption" color="text.disabled" fontWeight={700}>SEVERITY</Typography>
                      <Typography variant="body2" fontWeight={600} mt={0.5} sx={{ textTransform: 'capitalize' }}>
                        {getPriorityIcon(selectedReport.severity)} {selectedReport.severity || '—'}
                      </Typography>
                    </Box>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.disabled" fontWeight={700}>DESCRIPTION</Typography>
                    <Typography variant="body2" mt={0.5} color="text.secondary">{selectedReport.description || '—'}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.disabled" fontWeight={700}>DATE REPORTED</Typography>
                    <Typography variant="body2" fontWeight={600} mt={0.5}>
                      {selectedReport.date ? new Date(selectedReport.date).toLocaleString() : '—'}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </DialogContent>
            <DialogActions sx={{ px: 3, py: 2 }}>
              <Button onClick={() => setSelectedReport(null)} sx={{ borderRadius: 2, fontWeight: 600 }}>Close</Button>
            </DialogActions>
          </>
        )}
      </Dialog>
        </Container>
      </Box>
    </Box>
  );
};

export default Dashboard;
