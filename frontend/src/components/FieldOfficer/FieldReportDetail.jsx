import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getReportDetail, updateReportStatus } from '../../services/roleApi';
import {
  Container,
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  Button,
  FormControl,
  Select,
  MenuItem,
  CircularProgress,
  Divider,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const statusColors = {
  assigned: 'warning',
  'in-progress': 'secondary',
  completed: 'success',
};

const statusLabels = {
  assigned: 'Assigned',
  'in-progress': 'In Progress',
  completed: 'Completed',
};

const FieldReportDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [assignment, setAssignment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      navigate('/');
      return;
    }

    const fetchDetail = async () => {
      try {
        setLoading(true);
        // We pass the assignment ID (or report ID) from the URL. 
        // Based on the endpoint /api/field-officer/reports/:id it fetches the assignment detail.
        const data = await getReportDetail(id, token);
        setAssignment(data.assignment || data.report || data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [id, navigate, token]);

  const handleStatusChange = async (nextStatus) => {
    if (!nextStatus || !assignment) return;
    try {
      setUpdating(true);
      const res = await updateReportStatus(assignment._id, nextStatus, token);
      if (res.assignment) {
        setAssignment(res.assignment);
      }
    } catch (err) {
      console.error('Failed to update status:', err);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <Container sx={{ py: 8, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (!assignment) {
    return (
      <Container sx={{ py: 8, textAlign: 'center' }}>
        <Typography variant="h5" color="text.secondary">Report not found</Typography>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/field-officer/dashboard')} sx={{ mt: 2 }}>
          Back to Dashboard
        </Button>
      </Container>
    );
  }

  const report = assignment.report || {};

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Button 
        startIcon={<ArrowBackIcon />} 
        onClick={() => navigate('/field-officer/dashboard')}
        sx={{ mb: 3 }}
      >
        Back to Dashboard
      </Button>

      <Card variant="outlined" sx={{ borderRadius: 3 }}>
        <CardContent sx={{ p: { xs: 2, md: 4 } }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3, flexWrap: 'wrap', gap: 2 }}>
            <Box>
              <Typography variant="h4" fontWeight={700} gutterBottom>
                Report Details
              </Typography>
              <Typography variant="subtitle1" color="text.secondary" sx={{ fontFamily: 'monospace' }}>
                ID: {report.reportId || report._id}
              </Typography>
            </Box>
            <Chip 
              label={statusLabels[assignment.status] || assignment.status} 
              color={statusColors[assignment.status] || 'default'} 
              size="medium" 
              sx={{ fontWeight: 600, fontSize: '1rem', py: 2 }}
            />
          </Box>

          <Divider sx={{ mb: 3 }} />

          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <Typography variant="caption" color="text.secondary" display="block">Severity</Typography>
              <Typography variant="body1" fontWeight={500} sx={{ textTransform: 'capitalize' }}>
                {report.severity || "—"}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="caption" color="text.secondary" display="block">Date Reported</Typography>
              <Typography variant="body1" fontWeight={500}>
                {report.date ? new Date(report.date).toLocaleDateString() : "—"}
              </Typography>
            </Grid>
            
            <Grid item xs={12}>
              <Typography variant="caption" color="text.secondary" display="block">Address</Typography>
              <Typography variant="body1" fontWeight={500}>
                {report.location?.address || "—"}
              </Typography>
            </Grid>
            
            <Grid item xs={12}>
              <Typography variant="caption" color="text.secondary" display="block">Description</Typography>
              <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                {report.description || "No description provided."}
              </Typography>
            </Grid>

            {report.imageUrl && (
              <Grid item xs={12} sx={{ mt: 2 }}>
                <Typography variant="caption" color="text.secondary" display="block" mb={1}>Photo Evidence</Typography>
                <Box 
                  component="img" 
                  src={`http://localhost:5000${report.imageUrl}`} 
                  alt="Pothole evidence"
                  sx={{ 
                    width: '100%', 
                    maxHeight: 500, 
                    objectFit: 'cover', 
                    borderRadius: 2,
                    border: '1px solid',
                    borderColor: 'divider'
                  }}
                />
              </Grid>
            )}
          </Grid>

          <Box sx={{ mt: 4, pt: 3, borderTop: '1px solid', borderColor: 'divider', display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
            <Typography variant="subtitle1" fontWeight={600}>Update Status:</Typography>
            <FormControl size="small" sx={{ minWidth: 200 }}>
              <Select
                value=""
                displayEmpty
                disabled={updating}
                onChange={(e) => handleStatusChange(e.target.value)}
              >
                <MenuItem value="" disabled>Select new status...</MenuItem>
                {assignment.status !== 'in-progress' && <MenuItem value="in-progress">In Progress</MenuItem>}
                {assignment.status !== 'completed' && <MenuItem value="completed">Completed</MenuItem>}
              </Select>
            </FormControl>
            {updating && <CircularProgress size={24} />}
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};

export default FieldReportDetail;
