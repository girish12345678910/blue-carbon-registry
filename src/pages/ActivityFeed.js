import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Chip,
  Divider,
  Grid,
  Paper,
  Alert
} from '@mui/material';
import {
  Timeline as TimelineIcon,
  Park as EcoIcon,  // ✅ Changed from Eco to Park
  Upload as UploadIcon,
  CheckCircle as ApproveIcon,
  Cancel as RejectIcon,
  Delete as RetireIcon,
  Business as BusinessIcon,
  Person as PersonIcon,
  AdminPanelSettings as AdminIcon
} from '@mui/icons-material';
import { useApp } from '../context/AppContext';

const ActivityFeed = () => {
  const { state } = useApp();
  
  const getActivityIcon = (type) => {
    switch (type) {
      case 'project_created': return <EcoIcon />;
      case 'mrv_submitted': return <UploadIcon />;
      case 'mrv_approved': return <ApproveIcon />;
      case 'mrv_rejected': return <RejectIcon />;
      case 'credit_retired': return <RetireIcon />;
      default: return <TimelineIcon />;
    }
  };
  
  const getActivityColor = (type) => {
    switch (type) {
      case 'project_created': return 'primary';
      case 'mrv_submitted': return 'info';
      case 'mrv_approved': return 'success';
      case 'mrv_rejected': return 'error';
      case 'credit_retired': return 'warning';
      default: return 'default';
    }
  };
  
  const getUserIcon = (user) => {
    if (user === 'Admin' || user.includes('Admin')) return <AdminIcon />;
    if (user.includes('NGO') || user.includes('Organization')) return <BusinessIcon />;
    return <PersonIcon />;
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
  
  const activityStats = {
    today: state.activities.filter(activity => {
      const today = new Date().toDateString();
      return new Date(activity.timestamp).toDateString() === today;
    }).length,
    thisWeek: state.activities.filter(activity => {
      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      return new Date(activity.timestamp) > weekAgo;
    }).length,
    total: state.activities.length
  };
  
  return (
    <Box>
      <Typography variant="h4" gutterBottom fontWeight="bold">
        Activity Feed
      </Typography>
      <Typography variant="body1" color="text.secondary" gutterBottom>
        Stay updated with the latest activities across all blue carbon projects and submissions.
      </Typography>
      
      {/* Activity Statistics */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={4}>
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h4" color="primary" fontWeight="bold">
              {activityStats.today}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Activities Today
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h4" color="secondary" fontWeight="bold">
              {activityStats.thisWeek}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              This Week
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h4" color="success.main" fontWeight="bold">
              {activityStats.total}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Total Activities
            </Typography>
          </Paper>
        </Grid>
      </Grid>
      
      {/* Activity List */}
      <Card>
        <CardContent>
          <Box display="flex" alignItems="center" mb={2}>
            <TimelineIcon sx={{ mr: 1 }} />
            <Typography variant="h6" fontWeight="bold">
              Recent Activities
            </Typography>
          </Box>
          
          {state.activities.length === 0 ? (
            <Alert severity="info">
              No activities to display yet. Activities will appear here as users interact with the system.
            </Alert>
          ) : (
            <List>
              {state.activities.map((activity, index) => (
                <React.Fragment key={activity.id}>
                  <ListItem alignItems="flex-start" sx={{ px: 0 }}>
                    <ListItemAvatar>
                      <Avatar 
                        sx={{ 
                          bgcolor: `${getActivityColor(activity.type)}.light`,
                          color: `${getActivityColor(activity.type)}.dark`
                        }}
                      >
                        {getActivityIcon(activity.type)}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Box display="flex" alignItems="center" gap={1} mb={0.5}>
                          <Typography variant="subtitle1" fontWeight="bold">
                            {activity.title}
                          </Typography>
                          <Chip
                            size="small"
                            label={activity.type.replace('_', ' ').toUpperCase()}
                            color={getActivityColor(activity.type)}
                            variant="outlined"
                          />
                        </Box>
                      }
                      secondary={
                        <Box>
                          <Typography variant="body2" color="text.secondary" paragraph>
                            {activity.description}
                          </Typography>
                          <Box display="flex" alignItems="center" gap={2}>
                            <Box display="flex" alignItems="center" gap={0.5}>
                              {getUserIcon(activity.user)}
                              <Typography variant="caption" color="text.secondary">
                                {activity.user}
                              </Typography>
                            </Box>
                            <Typography variant="caption" color="text.secondary">
                              {formatTimeAgo(activity.timestamp)}
                            </Typography>
                          </Box>
                        </Box>
                      }
                    />
                  </ListItem>
                  {index < state.activities.length - 1 && <Divider variant="inset" component="li" />}
                </React.Fragment>
              ))}
            </List>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default ActivityFeed;
