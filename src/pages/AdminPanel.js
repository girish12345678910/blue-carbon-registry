import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemAvatar,
  Divider
} from '@mui/material';
import {
  AdminPanelSettings as AdminIcon,
  CheckCircle as ApproveIcon,
  Cancel as RejectIcon,
  Schedule as PendingIcon,
  Assessment as AssessmentIcon,
  Verified as VerifiedIcon,
  Error as ErrorIcon,
  AttachFile as FileIcon,
  AccessTime as TimeIcon
} from '@mui/icons-material';
import { useApp } from '../context/AppContext';

const AdminPanel = () => {
  const { state, actions } = useApp();
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [actionDialogOpen, setActionDialogOpen] = useState(false);
  const [actionType, setActionType] = useState('');
  
  // Only show if user is admin
  if (state.userRole !== 'Admin') {
    return (
      <Box textAlign="center" sx={{ mt: 8 }}>
        <Alert severity="warning">
          Access denied. This panel is only available to administrators.
        </Alert>
      </Box>
    );
  }
  
  const pendingSubmissions = state.mrvSubmissions.filter(sub => sub.status === 'Pending');
  const approvedSubmissions = state.mrvSubmissions.filter(sub => sub.status === 'Approved');
  const rejectedSubmissions = state.mrvSubmissions.filter(sub => sub.status === 'Rejected');
  
  const handleAction = (submission, type) => {
    setSelectedSubmission(submission);
    setActionType(type);
    setActionDialogOpen(true);
  };
  
  const confirmAction = () => {
    if (selectedSubmission && actionType) {
      if (actionType === 'approve') {
        actions.approveMRV(selectedSubmission.id);
      } else if (actionType === 'reject') {
        actions.rejectMRV(selectedSubmission.id);
      }
      setActionDialogOpen(false);
      setSelectedSubmission(null);
      setActionType('');
    }
  };
  
  const getStatusColor = (status) => {
    switch (status) {
      case 'Approved': return 'success';
      case 'Pending': return 'warning';
      case 'Rejected': return 'error';
      default: return 'default';
    }
  };
  
  const getStatusIcon = (status) => {
    switch (status) {
      case 'Approved': return <VerifiedIcon fontSize="small" />;
      case 'Pending': return <PendingIcon fontSize="small" />;
      case 'Rejected': return <ErrorIcon fontSize="small" />;
      default: return <AssessmentIcon fontSize="small" />;
    }
  };
  
  const getActivityIcon = (type) => {
    switch (type) {
      case 'mrv_approved': return <ApproveIcon color="success" />;
      case 'mrv_rejected': return <RejectIcon color="error" />;
      case 'mrv_submitted': return <FileIcon color="primary" />;
      default: return <TimeIcon color="action" />;
    }
  };
  
  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInMinutes = Math.floor((now - time) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} hours ago`;
    return `${Math.floor(diffInMinutes / 1440)} days ago`;
  };
  
  return (
    <Box>
      <Typography variant="h4" gutterBottom fontWeight="bold">
        Admin Panel
      </Typography>
      <Typography variant="body1" color="text.secondary" gutterBottom>
        Review and manage MRV submissions, approve carbon credit issuance, and monitor system activity.
      </Typography>
      
      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Avatar sx={{ bgcolor: 'warning.main', mx: 'auto', mb: 2 }}>
                <PendingIcon />
              </Avatar>
              <Typography variant="h4" color="warning.main" fontWeight="bold">
                {pendingSubmissions.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Pending Reviews
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Avatar sx={{ bgcolor: 'success.main', mx: 'auto', mb: 2 }}>
                <VerifiedIcon />
              </Avatar>
              <Typography variant="h4" color="success.main" fontWeight="bold">
                {approvedSubmissions.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Approved This Month
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Avatar sx={{ bgcolor: 'error.main', mx: 'auto', mb: 2 }}>
                <ErrorIcon />
              </Avatar>
              <Typography variant="h4" color="error.main" fontWeight="bold">
                {rejectedSubmissions.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Rejected Submissions
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Avatar sx={{ bgcolor: 'primary.main', mx: 'auto', mb: 2 }}>
                <AdminIcon />
              </Avatar>
              <Typography variant="h4" color="primary.main" fontWeight="bold">
                {state.mrvSubmissions.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Submissions
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      <Grid container spacing={3}>
        {/* Pending MRV Submissions */}
        <Grid item xs={12} lg={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom fontWeight="bold">
                Pending MRV Submissions
              </Typography>
              
              {pendingSubmissions.length === 0 ? (
                <Alert severity="info">
                  No pending submissions to review at this time.
                </Alert>
              ) : (
                <TableContainer component={Paper} variant="outlined">
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Submission ID</TableCell>
                        <TableCell>Project</TableCell>
                        <TableCell>Submitted By</TableCell>
                        <TableCell>Date</TableCell>
                        <TableCell>Files</TableCell>
                        <TableCell>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {pendingSubmissions.map((submission) => (
                        <TableRow key={submission.id}>
                          <TableCell>
                            <Typography variant="body2" fontFamily="monospace">
                              #{submission.id}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" fontWeight="medium">
                              {submission.projectName}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {submission.location}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              {submission.submittedBy}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              {new Date(submission.submittedAt).toLocaleDateString()}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              {submission.files.length} files
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Box display="flex" gap={1}>
                              <Button
                                size="small"
                                color="success"
                                variant="outlined"
                                startIcon={<ApproveIcon />}
                                onClick={() => handleAction(submission, 'approve')}
                              >
                                Approve
                              </Button>
                              <Button
                                size="small"
                                color="error"
                                variant="outlined"
                                startIcon={<RejectIcon />}
                                onClick={() => handleAction(submission, 'reject')}
                              >
                                Reject
                              </Button>
                            </Box>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </CardContent>
          </Card>
        </Grid>
        
        {/* Activity List (replacing Timeline) */}
        <Grid item xs={12} lg={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom fontWeight="bold">
                Recent Activity
              </Typography>
              
              {state.activities.length === 0 ? (
                <Alert severity="info">
                  No recent activities to display.
                </Alert>
              ) : (
                <List>
                  {state.activities.slice(0, 10).map((activity, index) => (
                    <React.Fragment key={activity.id}>
                      <ListItem alignItems="flex-start" sx={{ px: 0 }}>
                        <ListItemAvatar>
                          <Avatar sx={{ bgcolor: 'background.default', width: 32, height: 32 }}>
                            {getActivityIcon(activity.type)}
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={
                            <Typography variant="subtitle2" fontWeight="bold">
                              {activity.title}
                            </Typography>
                          }
                          secondary={
                            <Box>
                              <Typography variant="body2" color="text.secondary" gutterBottom>
                                {activity.description}
                              </Typography>
                              <Box display="flex" justifyContent="space-between" alignItems="center">
                                <Typography variant="caption" color="text.secondary">
                                  {activity.user}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  {formatTimeAgo(activity.timestamp)}
                                </Typography>
                              </Box>
                            </Box>
                          }
                        />
                      </ListItem>
                      {index < state.activities.slice(0, 10).length - 1 && (
                        <Divider variant="inset" component="li" />
                      )}
                    </React.Fragment>
                  ))}
                </List>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      {/* Action Confirmation Dialog */}
      <Dialog open={actionDialogOpen} onClose={() => setActionDialogOpen(false)}>
        <DialogTitle>
          {actionType === 'approve' ? 'Approve MRV Submission' : 'Reject MRV Submission'}
        </DialogTitle>
        <DialogContent>
          <Typography gutterBottom>
            Are you sure you want to {actionType} this MRV submission?
          </Typography>
          {selectedSubmission && (
            <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
              <Typography variant="body2">
                <strong>Submission ID:</strong> #{selectedSubmission.id}
              </Typography>
              <Typography variant="body2">
                <strong>Project:</strong> {selectedSubmission.projectName}
              </Typography>
              <Typography variant="body2">
                <strong>Submitted by:</strong> {selectedSubmission.submittedBy}
              </Typography>
              <Typography variant="body2">
                <strong>Files:</strong> {selectedSubmission.files.length} uploaded
              </Typography>
            </Box>
          )}
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            {actionType === 'approve' 
              ? 'This will approve the submission and allow carbon credits to be issued.'
              : 'This will reject the submission and notify the submitter to make corrections.'
            }
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setActionDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={confirmAction}
            color={actionType === 'approve' ? 'success' : 'error'}
            variant="contained"
          >
            {actionType === 'approve' ? 'Approve' : 'Reject'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminPanel;
