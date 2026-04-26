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
  Avatar,
  Divider,
} from "@mui/material";
import { alpha } from "@mui/material/styles";

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

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [userData, setUserData] = useState({ stats: {}, reports: [] });
  const [statusFilter, setStatusFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [userDetails, setUserDetails] = useState(null);

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
    if (name) {
      setUserDetails({ name });
    }

    const fetchDashboardData = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        if (user.id && token) {
          const response = await fetch(
            `http://localhost:5000/api/getdata/dashboard/${user.id}`,
            { headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` } }
          );
          if (response.ok) {
            const data = await response.json();
            setUserData(data);
          }
        }
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
      }
    };
    fetchDashboardData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run once on mount

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Dashboard Header */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h4" fontWeight={700} gutterBottom>
            Welcome back, {userDetails?.name || 'User'}!
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Here's your pothole reporting dashboard overview.
          </Typography>
        </Box>
        <Button 
          variant="contained" 
          component={Link} 
          to="/report"
          startIcon={<AddAPhotoIcon />}
          size="large"
          sx={{ borderRadius: 2 }}
        >
          Report New Pothole
        </Button>
      </Box>

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 4 }}>
        <Tabs value={activeTab} onChange={handleTabChange} aria-label="dashboard tabs" variant="scrollable" scrollButtons="auto">
          <Tab icon={<AssessmentIcon />} iconPosition="start" label="Overview" value="overview" />
          <Tab icon={<AssignmentIcon />} iconPosition="start" label="My Reports" value="reports" />
          <Tab icon={<MapIcon />} iconPosition="start" label="Map View" value="map" />
          <Tab icon={<TimelineIcon />} iconPosition="start" label="Analytics" value="analytics" />
        </Tabs>
      </Box>

      {/* Overview Tab */}
      {activeTab === "overview" && (
        <Box>
          {/* Stats Grid */}
          <Grid container spacing={3} mb={4}>
            <Grid item xs={12} sm={6} md={3}>
              <Card variant="outlined" sx={{ borderRadius: 3, bgcolor: (theme) => alpha(theme.palette.primary.main, 0.05) }}>
                <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar sx={{ bgcolor: 'primary.main', width: 56, height: 56 }}><AssessmentIcon fontSize="large" /></Avatar>
                  <Box>
                    <Typography variant="h4" fontWeight={700}>{userData?.stats?.totalReports || 0}</Typography>
                    <Typography variant="body2" color="text.secondary" fontWeight={500}>Total Reports</Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card variant="outlined" sx={{ borderRadius: 3, bgcolor: (theme) => alpha(theme.palette.warning.main, 0.05) }}>
                <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar sx={{ bgcolor: 'warning.main', width: 56, height: 56 }}><PendingActionsIcon fontSize="large" /></Avatar>
                  <Box>
                    <Typography variant="h4" fontWeight={700}>{userData?.stats?.pendingReports || 0}</Typography>
                    <Typography variant="body2" color="text.secondary" fontWeight={500}>Pending Review</Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card variant="outlined" sx={{ borderRadius: 3, bgcolor: (theme) => alpha(theme.palette.info.main, 0.05) }}>
                <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar sx={{ bgcolor: 'info.main', width: 56, height: 56 }}><CheckCircleIcon fontSize="large" /></Avatar>
                  <Box>
                    <Typography variant="h4" fontWeight={700}>{userData?.stats?.verifiedReports || 0}</Typography>
                    <Typography variant="body2" color="text.secondary" fontWeight={500}>Verified</Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card variant="outlined" sx={{ borderRadius: 3, bgcolor: (theme) => alpha(theme.palette.success.main, 0.05) }}>
                <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar sx={{ bgcolor: 'success.main', width: 56, height: 56 }}><BuildIcon fontSize="large" /></Avatar>
                  <Box>
                    <Typography variant="h4" fontWeight={700}>{userData?.stats?.completedReports || 0}</Typography>
                    <Typography variant="body2" color="text.secondary" fontWeight={500}>Repairs Completed</Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          <Grid container spacing={4}>
            {/* Recent Activity */}
            <Grid item xs={12} md={8}>
              <Card variant="outlined" sx={{ borderRadius: 3, height: '100%' }}>
                <CardContent>
                  <Typography variant="h6" fontWeight={700} gutterBottom>Recent Reports</Typography>
                  <TableContainer component={Box} sx={{ mt: 2 }}>
                    <Table size="small" aria-label="recent reports table">
                      <TableHead>
                        <TableRow>
                          <TableCell sx={{ fontWeight: 600 }}>Report ID</TableCell>
                          <TableCell sx={{ fontWeight: 600 }}>Location</TableCell>
                          <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                          <TableCell sx={{ fontWeight: 600 }}>Priority</TableCell>
                          <TableCell sx={{ fontWeight: 600 }}>Date</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {(userData?.reports || [])
                          .slice()
                          .sort((a, b) => new Date(b.date) - new Date(a.date))
                          .slice(0, 5)
                          .map((report) => (
                            <TableRow key={report._id} hover>
                              <TableCell sx={{ fontFamily: 'monospace' }}>{report.reportId || report._id.substring(0,8)}</TableCell>
                              <TableCell>{report?.location?.address || report?.location || "N/A"}</TableCell>
                              <TableCell>
                                <Chip label={report.status} color={getStatusColor(report.status)} size="small" />
                              </TableCell>
                              <TableCell>{getPriorityIcon(report.severity)} {report.severity}</TableCell>
                              <TableCell>{report.date ? new Date(report.date).toLocaleDateString() : "N/A"}</TableCell>
                            </TableRow>
                          ))}
                        {(!userData?.reports || userData.reports.length === 0) && (
                           <TableRow>
                             <TableCell colSpan={5} align="center" sx={{ py: 3, color: 'text.secondary' }}>No recent reports found.</TableCell>
                           </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </CardContent>
              </Card>
            </Grid>

            {/* Quick Actions */}
            <Grid item xs={12} md={4}>
              <Card variant="outlined" sx={{ borderRadius: 3, height: '100%' }}>
                <CardContent>
                  <Typography variant="h6" fontWeight={700} gutterBottom>Quick Actions</Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
                    <Button 
                      variant="outlined" 
                      fullWidth 
                      startIcon={<AddAPhotoIcon />}
                      component={Link}
                      to="/report"
                      sx={{ justifyContent: 'flex-start', py: 1.5 }}
                    >
                      Report Pothole
                    </Button>
                    <Button 
                      variant="outlined" 
                      fullWidth 
                      startIcon={<TravelExploreIcon />}
                      onClick={() => setActiveTab('map')}
                      sx={{ justifyContent: 'flex-start', py: 1.5 }}
                    >
                      View Map
                    </Button>
                    <Button 
                      variant="outlined" 
                      fullWidth 
                      startIcon={<TimelineIcon />}
                      onClick={() => setActiveTab('analytics')}
                      sx={{ justifyContent: 'flex-start', py: 1.5 }}
                    >
                      View Analytics
                    </Button>
                  </Box>
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
                  <Card variant="outlined" sx={{ borderRadius: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                        <Typography variant="caption" sx={{ fontFamily: 'monospace', bgcolor: 'action.hover', px: 1, py: 0.5, borderRadius: 1 }}>
                          {report._id.substring(0, 10)}...
                        </Typography>
                        <Chip label={report.status} color={getStatusColor(report.status)} size="small" />
                      </Box>
                      <Typography variant="h6" fontWeight={600} gutterBottom sx={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {report.location?.address || report.location || "Unknown Location"}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" mb={1}>
                        Severity: {getPriorityIcon(report.severity)} <span style={{ textTransform: 'capitalize' }}>{report.severity}</span>
                      </Typography>
                      <Typography variant="caption" color="text.disabled">
                        Reported: {report.date ? new Date(report.date).toLocaleDateString() : 'N/A'}
                      </Typography>
                    </CardContent>
                    <Divider />
                    <CardActions sx={{ p: 2 }}>
                      <Button size="small" variant="text">View Details</Button>
                      <Button size="small" variant="contained" sx={{ ml: 'auto' }}>Track Progress</Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            {userData?.reports?.length === 0 && (
              <Grid item xs={12}>
                <Typography variant="body1" color="text.secondary" align="center" sx={{ py: 8 }}>
                  You haven't submitted any reports yet.
                </Typography>
              </Grid>
            )}
          </Grid>
        </Box>
      )}

      {/* Map Tab */}
      {activeTab === "map" && (
        <Card variant="outlined" sx={{ borderRadius: 3 }}>
          <CardContent sx={{ p: 0 }}>
            <Box sx={{ p: 3, borderBottom: 1, borderColor: 'divider', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6" fontWeight={700}>Pothole Map</Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button variant="contained" size="small">My Reports</Button>
                <Button variant="outlined" size="small">All Reports</Button>
                <Button variant="outlined" size="small">Completed</Button>
              </Box>
            </Box>
            <Box sx={{ height: 500, bgcolor: 'action.hover', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', p: 4, textAlign: 'center' }}>
               <MapIcon sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
               <Typography variant="h5" color="text.secondary" gutterBottom>Interactive Map Placeholder</Typography>
               <Typography variant="body1" color="text.secondary" maxWidth={500}>
                 In a real implementation, a map component (like react-leaflet or Google Maps) would render here, showing pins for all report locations.
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

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card variant="outlined" sx={{ borderRadius: 3, height: 400, display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                  <Typography variant="subtitle1" fontWeight={600} gutterBottom>Reports Over Time</Typography>
                  <Box sx={{ flexGrow: 1, bgcolor: 'action.hover', borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', mt: 1 }}>
                    <Typography color="text.secondary">Chart Placeholder</Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card variant="outlined" sx={{ borderRadius: 3, height: 400, display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                  <Typography variant="subtitle1" fontWeight={600} gutterBottom>Status Distribution</Typography>
                  <Box sx={{ flexGrow: 1, bgcolor: 'action.hover', borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', mt: 1 }}>
                    <Typography color="text.secondary">Pie Chart Placeholder</Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12}>
              <Card variant="outlined" sx={{ borderRadius: 3 }}>
                <CardContent>
                  <Typography variant="subtitle1" fontWeight={600} gutterBottom>Impact Summary</Typography>
                  <Grid container spacing={2} sx={{ mt: 1 }}>
                    <Grid item xs={6} sm={3}>
                      <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'action.hover', borderRadius: 2 }}>
                        <Typography variant="h4" fontWeight={700} color="primary.main">156</Typography>
                        <Typography variant="body2" color="text.secondary">Citizens Helped</Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6} sm={3}>
                      <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'action.hover', borderRadius: 2 }}>
                        <Typography variant="h4" fontWeight={700} color="success.main">23</Typography>
                        <Typography variant="body2" color="text.secondary">Roads Improved</Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6} sm={3}>
                      <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'action.hover', borderRadius: 2 }}>
                        <Typography variant="h4" fontWeight={700} color="info.main">89%</Typography>
                        <Typography variant="body2" color="text.secondary">Accuracy Rate</Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6} sm={3}>
                      <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'action.hover', borderRadius: 2 }}>
                        <Typography variant="h4" fontWeight={700} color="warning.main">4.8</Typography>
                        <Typography variant="body2" color="text.secondary">Average Rating</Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      )}
    </Container>
  );
};

export default Dashboard;
