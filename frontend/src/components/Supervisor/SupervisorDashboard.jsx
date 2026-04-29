import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
  Avatar,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import { getSupervisorReports } from "../../services/roleApi";
import Sidebar from "../common/Sidebar";

// Icons
import AssessmentIcon from '@mui/icons-material/Assessment';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import BuildIcon from '@mui/icons-material/Build';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import MapIcon from '@mui/icons-material/Map';
import SettingsIcon from '@mui/icons-material/Settings';

const statusColors = {
  pending: "warning",
  verified: "info",
  "in progress": "secondary",
  "in-progress": "secondary",
  "work ordered": "primary",
  completed: "success",
};

const SupervisorDashboard = () => {
  const navigate = useNavigate();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {

    const fetchReports = async () => {
      try {
        setLoading(true);
        const data = await getSupervisorReports(token);
        const sortedReports = (data.reports || []).sort(
          (a, b) => new Date(b.date) - new Date(a.date)
        );
        setReports(sortedReports);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, [navigate, token]);

  const filteredReports = useMemo(
    () => reports.filter((r) => (statusFilter ? r.status === statusFilter : true)),
    [reports, statusFilter]
  );

  const metrics = useMemo(() => {
    const total = reports.length;
    const pending = reports.filter((r) => ["pending", "verified", "assigned"].includes(r.status?.toLowerCase())).length;
    const progress = reports.filter((r) => ["in-progress", "in progress"].includes(r.status?.toLowerCase())).length;
    const completed = reports.filter((r) => r.status?.toLowerCase() === "completed").length;
    return { total, pending, progress, completed };
  }, [reports]);

  const sidebarItems = [
    { id: 'supervisor-overview', label: 'Supervisor Overview', icon: <AssessmentIcon /> },
    { id: 'settings', label: 'Settings', icon: <SettingsIcon /> },
  ];

  const userInfo = {
    name: 'Supervisor',
    role: 'Admin Account',
    avatarText: 'S',
    avatarColor: 'secondary.main',
  };

  return (
    <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden', bgcolor: (theme) => alpha(theme.palette.primary.main, 0.01) }}>
      {/* Left Sidebar Component */}
      <Sidebar 
        menuItems={sidebarItems}
        activeItem="supervisor-overview"
        onItemClick={() => {}}
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
              Supervisor Overview
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Track progress and assignments across all areas
            </Typography>
          </Box>

      {/* Metrics Grid */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6} md={3}>
          <Card variant="outlined" sx={{ borderRadius: 4, p: 1.5, boxShadow: '0 4px 20px rgba(0,0,0,0.02)', transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 8px 24px rgba(0,0,0,0.04)' } }}>
            <CardContent sx={{ p: '16px !important', display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar sx={{ bgcolor: (theme) => alpha(theme.palette.primary.main, 0.1), color: 'primary.main', width: 56, height: 56 }}>
                <AssessmentIcon fontSize="large" />
              </Avatar>
              <Box>
                <Typography variant="h4" fontWeight={800} color="text.primary" sx={{ lineHeight: 1.2 }}>
                  {metrics.total}
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
                  {metrics.pending}
                </Typography>
                <Typography variant="body2" color="text.secondary" fontWeight={600} sx={{ mt: 0.5 }}>
                  Pending Action
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card variant="outlined" sx={{ borderRadius: 4, p: 1.5, boxShadow: '0 4px 20px rgba(0,0,0,0.02)', transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 8px 24px rgba(0,0,0,0.04)' } }}>
            <CardContent sx={{ p: '16px !important', display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar sx={{ bgcolor: (theme) => alpha(theme.palette.secondary.main, 0.1), color: 'secondary.main', width: 56, height: 56 }}>
                <BuildIcon fontSize="large" />
              </Avatar>
              <Box>
                <Typography variant="h4" fontWeight={800} color="text.primary" sx={{ lineHeight: 1.2 }}>
                  {metrics.progress}
                </Typography>
                <Typography variant="body2" color="text.secondary" fontWeight={600} sx={{ mt: 0.5 }}>
                  In Progress
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card variant="outlined" sx={{ borderRadius: 4, p: 1.5, boxShadow: '0 4px 20px rgba(0,0,0,0.02)', transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 8px 24px rgba(0,0,0,0.04)' } }}>
            <CardContent sx={{ p: '16px !important', display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar sx={{ bgcolor: (theme) => alpha(theme.palette.success.main, 0.1), color: 'success.main', width: 56, height: 56 }}>
                <CheckCircleIcon fontSize="large" />
              </Avatar>
              <Box>
                <Typography variant="h4" fontWeight={800} color="text.primary" sx={{ lineHeight: 1.2 }}>
                  {metrics.completed}
                </Typography>
                <Typography variant="body2" color="text.secondary" fontWeight={600} sx={{ mt: 0.5 }}>
                  Completed
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Main Content Area */}
      <Card variant="outlined" sx={{ borderRadius: 4, boxShadow: '0 4px 20px rgba(0,0,0,0.02)', minHeight: 600, display: 'flex', flexDirection: 'column' }}>
        <CardContent sx={{ p: 4, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
            <Typography variant="h6" fontWeight={700}>All Reports</Typography>
            <FormControl size="small" sx={{ minWidth: 200 }}>
              <InputLabel>Filter by Status</InputLabel>
              <Select
                value={statusFilter}
                label="Filter by Status"
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <MenuItem value="">All Status</MenuItem>
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="in-progress">In Progress</MenuItem>
                <MenuItem value="completed">Completed</MenuItem>
              </Select>
            </FormControl>
          </Box>

          <TableContainer component={Box} sx={{ flexGrow: 1, overflowY: 'auto' }}>
            <Table size="medium">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600, color: 'text.secondary', borderBottom: '2px solid', borderColor: 'divider' }}>Report ID</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: 'text.secondary', borderBottom: '2px solid', borderColor: 'divider' }}>Location</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: 'text.secondary', borderBottom: '2px solid', borderColor: 'divider' }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: 'text.secondary', borderBottom: '2px solid', borderColor: 'divider' }}>Severity</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: 'text.secondary', borderBottom: '2px solid', borderColor: 'divider' }}>Assigned Officer</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: 'text.secondary', borderBottom: '2px solid', borderColor: 'divider' }}>Date</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 8 }}>
                      <CircularProgress />
                    </TableCell>
                  </TableRow>
                ) : filteredReports.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 8 }}>
                      <Box sx={{ color: 'text.disabled', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                         <AssessmentIcon sx={{ fontSize: 48, mb: 2, opacity: 0.5 }}/>
                         <Typography variant="body1">No reports found.</Typography>
                      </Box>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredReports.map((r) => (
                    <TableRow key={r._id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 }, '&:hover': { bgcolor: (theme) => alpha(theme.palette.primary.main, 0.02) } }}>
                      <TableCell sx={{ fontFamily: 'monospace', fontWeight: 500 }}>{r.reportId || r._id.substring(0,8)}</TableCell>
                      <TableCell sx={{ maxWidth: 300, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontWeight: 500 }}>
                        {r.location?.address || "Location"}
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={r.status} 
                          sx={{ 
                            bgcolor: (theme) => alpha(theme.palette[statusColors[r.status?.toLowerCase()] || "default"].main, 0.1), 
                            color: statusColors[r.status?.toLowerCase()] + '.main', 
                            fontWeight: 600, 
                            borderRadius: 1.5 
                          }}
                          size="small" 
                        />
                      </TableCell>
                      <TableCell sx={{ textTransform: 'capitalize', fontWeight: 500 }}>{r.severity || "—"}</TableCell>
                      <TableCell>{r.assignedTo?.name || <Typography variant="body2" color="text.disabled" fontWeight={600}>Unassigned</Typography>}</TableCell>
                      <TableCell sx={{ color: 'text.secondary' }}>{r.date ? new Date(r.date).toLocaleDateString() : "—"}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
        </Container>
      </Box>
    </Box>
  );
};

export default SupervisorDashboard;
