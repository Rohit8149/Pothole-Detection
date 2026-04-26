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
  Chip,
  CircularProgress,
  Avatar,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import { getSupervisorReports } from "../../services/roleApi";

// Icons
import AssessmentIcon from '@mui/icons-material/Assessment';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import BuildIcon from '@mui/icons-material/Build';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

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

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight={700} gutterBottom>
          Supervisor Overview
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Track progress and assignments across all areas
        </Typography>
      </Box>

      {/* Metrics Grid */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6} md={3}>
          <Card variant="outlined" sx={{ borderRadius: 3, bgcolor: (theme) => alpha(theme.palette.primary.main, 0.05) }}>
            <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar sx={{ bgcolor: 'primary.main', width: 56, height: 56 }}><AssessmentIcon fontSize="large" /></Avatar>
              <Box>
                <Typography variant="h4" fontWeight={700}>{metrics.total}</Typography>
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
                <Typography variant="h4" fontWeight={700}>{metrics.pending}</Typography>
                <Typography variant="body2" color="text.secondary" fontWeight={500}>Pending Action</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card variant="outlined" sx={{ borderRadius: 3, bgcolor: (theme) => alpha(theme.palette.secondary.main, 0.05) }}>
            <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar sx={{ bgcolor: 'secondary.main', width: 56, height: 56 }}><BuildIcon fontSize="large" /></Avatar>
              <Box>
                <Typography variant="h4" fontWeight={700}>{metrics.progress}</Typography>
                <Typography variant="body2" color="text.secondary" fontWeight={500}>In Progress</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card variant="outlined" sx={{ borderRadius: 3, bgcolor: (theme) => alpha(theme.palette.success.main, 0.05) }}>
            <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar sx={{ bgcolor: 'success.main', width: 56, height: 56 }}><CheckCircleIcon fontSize="large" /></Avatar>
              <Box>
                <Typography variant="h4" fontWeight={700}>{metrics.completed}</Typography>
                <Typography variant="body2" color="text.secondary" fontWeight={500}>Completed</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Main Content Area */}
      <Card variant="outlined" sx={{ borderRadius: 3 }}>
        <CardContent>
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

          <TableContainer>
            <Table size="medium">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600 }}>Report ID</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Location</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Severity</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Assigned Officer</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Date</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                      <CircularProgress />
                    </TableCell>
                  </TableRow>
                ) : filteredReports.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 4, color: 'text.secondary' }}>
                      No reports found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredReports.map((r) => (
                    <TableRow key={r._id} hover>
                      <TableCell sx={{ fontFamily: 'monospace' }}>{r.reportId || r._id.substring(0,8)}</TableCell>
                      <TableCell sx={{ maxWidth: 300, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {r.location?.address || "Location"}
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={r.status} 
                          color={statusColors[r.status?.toLowerCase()] || "default"} 
                          size="small" 
                          sx={{ textTransform: 'capitalize' }}
                        />
                      </TableCell>
                      <TableCell sx={{ textTransform: 'capitalize' }}>{r.severity || "—"}</TableCell>
                      <TableCell>{r.assignedTo?.name || <Typography variant="body2" color="text.secondary">Unassigned</Typography>}</TableCell>
                      <TableCell>{r.date ? new Date(r.date).toLocaleDateString() : "—"}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Container>
  );
};

export default SupervisorDashboard;
