import React, { useState } from 'react';
import {
  Grid,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Typography,
  Button,
  Box,
  Chip,
  Avatar,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  List,
  ListItem,
  ListItemText,
  IconButton,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Park as EcoIcon,
  LocationOn as LocationIcon,
  CalendarToday as CalendarIcon,
  Verified as VerifiedIcon,
  Close as CloseIcon,
  TrendingUp as TrendingUpIcon,
  Assessment as AssessmentIcon
} from '@mui/icons-material';
import { useApp } from '../context/AppContext';

const Dashboard = () => {
  const { state } = useApp();
  const [selectedProject, setSelectedProject] = useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  // Calculate summary statistics
  const totalCredits = state.projects.reduce((sum, project) => sum + project.creditsIssued, 0);
  const approvedProjects = state.projects.filter(p => p.status === 'Approved').length;
  const pendingProjects = state.projects.filter(p => p.status === 'Pending').length;
  
  const getStatusColor = (status) => {
    switch (status) {
      case 'Approved': return 'success';
      case 'Pending': return 'warning';
      case 'Rejected': return 'error';
      default: return 'default';
    }
  };
  
  const formatNumber = (num) => {
    return new Intl.NumberFormat().format(num);
  };
  
  const ProjectDetailDialog = ({ project, open, onClose }) => {
    if (!project) return null;
    
    return (
      <Dialog 
        open={open} 
        onClose={onClose} 
        maxWidth="md" 
        fullWidth
        fullScreen={isMobile} // Full screen on mobile
      >
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant={isMobile ? "h6" : "h5"}>{project.name}</Typography>
            <IconButton onClick={onClose}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Box mb={2}>
                <Typography variant="subtitle2" color="text.secondary">
                  Location
                </Typography>
                <Typography variant="body1">{project.location}</Typography>
              </Box>
              
              <Box mb={2}>
                <Typography variant="subtitle2" color="text.secondary">
                  Ecosystem Type
                </Typography>
                <Typography variant="body1">{project.ecosystem}</Typography>
              </Box>
              
              <Box mb={2}>
                <Typography variant="subtitle2" color="text.secondary">
                  Project Area
                </Typography>
                <Typography variant="body1">{project.area}</Typography>
              </Box>
              
              <Box mb={2}>
                <Typography variant="subtitle2" color="text.secondary">
                  Start Date
                </Typography>
                <Typography variant="body1">
                  {new Date(project.startDate).toLocaleDateString()}
                </Typography>
              </Box>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Box mb={2}>
                <Typography variant="subtitle2" color="text.secondary">
                  Status
                </Typography>
                <Chip 
                  label={project.status} 
                  color={getStatusColor(project.status)}
                  size="small"
                />
              </Box>
              
              <Box mb={2}>
                <Typography variant="subtitle2" color="text.secondary">
                  Verifier
                </Typography>
                <Typography variant="body1">{project.verifier}</Typography>
              </Box>
              
              <Box mb={2}>
                <Typography variant="subtitle2" color="text.secondary">
                  Credits Issued
                </Typography>
                <Typography variant="body1" color="primary" fontWeight="bold">
                  {formatNumber(project.creditsIssued)} tCO₂e
                </Typography>
              </Box>
              
              <Box mb={2}>
                <Typography variant="subtitle2" color="text.secondary">
                  Estimated Total Credits
                </Typography>
                <Typography variant="body1">
                  {formatNumber(project.estimatedCredits)} tCO₂e
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={(project.creditsIssued / project.estimatedCredits) * 100}
                  sx={{ mt: 1 }}
                />
              </Box>
            </Grid>
            
            <Grid item xs={12}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Project Description
              </Typography>
              <Typography variant="body1">{project.description}</Typography>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} fullWidth={isMobile}>Close</Button>
        </DialogActions>
      </Dialog>
    );
  };
  
  return (
    <Box>
      <Typography variant={isMobile ? "h5" : "h4"} gutterBottom fontWeight="bold">
        Project Dashboard
      </Typography>
      <Typography variant="body1" color="text.secondary" gutterBottom sx={{ mb: 3 }}>
        Welcome back! Here's an overview of your blue carbon projects and recent activity.
      </Typography>
      
      {/* Summary Cards */}
      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid item xs={6} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center', py: { xs: 2, sm: 3 } }}>
              <Avatar sx={{ 
                bgcolor: 'primary.main', 
                mx: 'auto', 
                mb: 1,
                width: { xs: 32, sm: 40 },
                height: { xs: 32, sm: 40 }
              }}>
                <EcoIcon sx={{ fontSize: { xs: 20, sm: 24 } }} />
              </Avatar>
              <Typography variant={isMobile ? "h6" : "h4"} color="primary" fontWeight="bold">
                {state.projects.length}
              </Typography>
              <Typography variant="body2" color="text.secondary" fontSize={{ xs: '0.75rem', sm: '0.875rem' }}>
                Total Projects
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={6} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center', py: { xs: 2, sm: 3 } }}>
              <Avatar sx={{ 
                bgcolor: 'success.main', 
                mx: 'auto', 
                mb: 1,
                width: { xs: 32, sm: 40 },
                height: { xs: 32, sm: 40 }
              }}>
                <VerifiedIcon sx={{ fontSize: { xs: 20, sm: 24 } }} />
              </Avatar>
              <Typography variant={isMobile ? "h6" : "h4"} color="success.main" fontWeight="bold">
                {approvedProjects}
              </Typography>
              <Typography variant="body2" color="text.secondary" fontSize={{ xs: '0.75rem', sm: '0.875rem' }}>
                Approved Projects
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={6} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center', py: { xs: 2, sm: 3 } }}>
              <Avatar sx={{ 
                bgcolor: 'warning.main', 
                mx: 'auto', 
                mb: 1,
                width: { xs: 32, sm: 40 },
                height: { xs: 32, sm: 40 }
              }}>
                <AssessmentIcon sx={{ fontSize: { xs: 20, sm: 24 } }} />
              </Avatar>
              <Typography variant={isMobile ? "h6" : "h4"} color="warning.main" fontWeight="bold">
                {pendingProjects}
              </Typography>
              <Typography variant="body2" color="text.secondary" fontSize={{ xs: '0.75rem', sm: '0.875rem' }}>
                Pending Review
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={6} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center', py: { xs: 2, sm: 3 } }}>
              <Avatar sx={{ 
                bgcolor: 'secondary.main', 
                mx: 'auto', 
                mb: 1,
                width: { xs: 32, sm: 40 },
                height: { xs: 32, sm: 40 }
              }}>
                <TrendingUpIcon sx={{ fontSize: { xs: 20, sm: 24 } }} />
              </Avatar>
              <Typography variant={isMobile ? "h6" : "h4"} color="secondary.main" fontWeight="bold">
                {formatNumber(totalCredits)}
              </Typography>
              <Typography variant="body2" color="text.secondary" fontSize={{ xs: '0.75rem', sm: '0.875rem' }}>
                Total Credits
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      {/* Projects Grid */}
      <Typography variant={isMobile ? "h6" : "h5"} gutterBottom fontWeight="bold">
        Blue Carbon Projects
      </Typography>
      
      <Grid container spacing={{ xs: 2, sm: 3 }}>
        {state.projects.map((project) => (
          <Grid item xs={12} sm={6} lg={4} key={project.id}>
            <Card 
              sx={{ 
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 3
                }
              }}
            >
              <CardMedia
                component="div"
                sx={{
                  height: { xs: 150, sm: 200 },
                  background: `linear-gradient(45deg, ${
                    project.ecosystem === 'Mangroves' ? '#4caf50, #81c784' :
                    project.ecosystem === 'Seagrass' ? '#2196f3, #64b5f6' :
                    project.ecosystem === 'Salt Marsh' ? '#ff9800, #ffb74d' :
                    '#9c27b0, #ba68c8'
                  })`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white'
                }}
              >
                <EcoIcon sx={{ fontSize: { xs: 40, sm: 60 } }} />
              </CardMedia>
              
              <CardContent sx={{ flexGrow: 1, p: { xs: 2, sm: 3 } }}>
                <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1}>
                  <Typography variant={isMobile ? "subtitle1" : "h6"} component="h2" fontWeight="bold">
                    {project.name}
                  </Typography>
                  <Chip 
                    label={project.status} 
                    color={getStatusColor(project.status)}
                    size="small"
                  />
                </Box>
                
                <Box display="flex" alignItems="center" mb={1}>
                  <LocationIcon fontSize="small" color="action" />
                  <Typography variant="body2" color="text.secondary" ml={0.5}>
                    {project.location}
                  </Typography>
                </Box>
                
                <Typography 
                  variant="body2" 
                  color="text.secondary" 
                  mb={2}
                  sx={{
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                  }}
                >
                  {project.description}
                </Typography>
                
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                  <Typography variant="body2" color="text.secondary">
                    Credits Issued:
                  </Typography>
                  <Typography variant="body2" fontWeight="bold" color="primary">
                    {formatNumber(project.creditsIssued)} tCO₂e
                  </Typography>
                </Box>
                
                <Box display="flex" alignItems="center">
                  <VerifiedIcon fontSize="small" color="action" />
                  <Typography 
                    variant="body2" 
                    color="text.secondary" 
                    ml={0.5}
                    sx={{
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {project.verifier}
                  </Typography>
                </Box>
              </CardContent>
              
              <CardActions sx={{ p: { xs: 2, sm: 3 }, pt: 0 }}>
                <Button 
                  size="small" 
                  onClick={() => setSelectedProject(project)}
                  fullWidth
                  variant="outlined"
                >
                  More Details
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
      
      {/* Project Detail Dialog */}
      <ProjectDetailDialog
        project={selectedProject}
        open={Boolean(selectedProject)}
        onClose={() => setSelectedProject(null)}
      />
    </Box>
  );
};

export default Dashboard;
