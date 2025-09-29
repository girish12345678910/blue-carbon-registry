import React, { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Chip,
  Paper,
  Slider,
  Avatar,
  LinearProgress,
  Divider,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Satellite as SatelliteIcon,
  Map as MapIcon,
  Timeline as TimelineIcon,
  Landscape as LandscapeIcon,
  Analytics as AnalyticsIcon,
  TrendingUp as TrendingUpIcon,
  Forest as ForestIcon,
  CompareArrows as CompareIcon,
  LocationOn as LocationIcon
} from '@mui/icons-material';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip as RTooltip, ResponsiveContainer, Legend, Area, AreaChart } from 'recharts';
import { useApp } from '../context/AppContext';

const SatelliteMapping = () => {
  const { state } = useApp();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [selectedProject, setSelectedProject] = useState(null);
  const [timeSlider, setTimeSlider] = useState(3); // 0-3 for quarters
  const [mapLayer, setMapLayer] = useState('satellite'); // satellite, terrain, hybrid

  // Safe access to geographic data
  const geoData = state.geographicData || { projects: {} };
  const projects = state.projects || [];

  // Calculate total metrics
  const totalArea = Object.values(geoData.projects).reduce((sum, p) => sum + (p.area || 0), 0);
  const totalCoverage = Object.values(geoData.projects).reduce((sum, p) => {
    const latest = p.growthData?.[p.growthData.length - 1];
    return sum + (latest?.coverage || 0);
  }, 0) / Object.keys(geoData.projects).length || 0;

  // Time periods for slider
  const timePeriods = [
    { label: 'Jan 2024', value: 0 },
    { label: 'Apr 2024', value: 1 },
    { label: 'Jul 2024', value: 2 },
    { label: 'Oct 2024', value: 3 }
  ];

  const getProjectMarkerColor = (project) => {
    const projectGeo = geoData.projects[project.id];
    if (!projectGeo) return '#gray';
    const latest = projectGeo.growthData?.[projectGeo.growthData.length - 1];
    const coverage = latest?.coverage || 0;
    
    if (coverage >= 60) return '#4caf50'; // Green - Excellent
    if (coverage >= 40) return '#ff9800'; // Orange - Good
    if (coverage >= 20) return '#f44336'; // Red - Needs attention
    return '#9e9e9e'; // Gray - No data
  };

  const ProjectCard = ({ project }) => {
    const projectGeo = geoData.projects[project.id];
    if (!projectGeo) return null;

    const currentData = projectGeo.growthData?.[timeSlider];
    const progress = ((currentData?.coverage || 0) / 100) * 100;

    return (
      <Card 
        sx={{ 
          cursor: 'pointer',
          transition: 'transform 0.2s',
          '&:hover': { transform: 'translateY(-2px)' },
          border: selectedProject?.id === project.id ? 2 : 0,
          borderColor: 'primary.main'
        }}
        onClick={() => setSelectedProject(project)}
      >
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1}>
            <Typography variant="subtitle1" fontWeight="bold">
              {project.name}
            </Typography>
            <Chip 
              label={`${projectGeo.area} ha`} 
              size="small" 
              color="primary"
            />
          </Box>
          
          <Box display="flex" alignItems="center" gap={0.5} mb={1}>
            <LocationIcon fontSize="small" color="action" />
            <Typography variant="body2" color="text.secondary">
              {projectGeo.coordinates[0].toFixed(4)}, {projectGeo.coordinates[1].toFixed(4)}
            </Typography>
          </Box>
          
          <Box display="flex" justifyContent="space-between" mb={1}>
            <Typography variant="body2" color="text.secondary">
              Coverage Progress:
            </Typography>
            <Typography variant="body2" fontWeight="bold">
              {currentData?.coverage || 0}%
            </Typography>
          </Box>
          
          <LinearProgress 
            variant="determinate" 
            value={progress} 
            sx={{ mb: 1, height: 8, borderRadius: 4 }}
            color={progress >= 60 ? 'success' : progress >= 40 ? 'warning' : 'error'}
          />
          
          <Box display="flex" justifyContent="space-between">
            <Typography variant="caption" color="text.secondary">
              Biomass: {currentData?.biomass || 0} tons/ha
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {projectGeo.ecosystem}
            </Typography>
          </Box>
        </CardContent>
      </Card>
    );
  };

  const SatelliteImageComparison = () => {
    if (!selectedProject) return null;
    
    const projectGeo = geoData.projects[selectedProject.id];
    
    return (
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box display="flex" alignItems="center" gap={1} mb={2}>
            <CompareIcon color="primary" />
            <Typography variant="h6" fontWeight="bold">
              Satellite Imagery Comparison - {selectedProject.name}
            </Typography>
          </Box>
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 2, textAlign: 'center' }}>
                <Typography variant="subtitle1" color="error" gutterBottom>
                  Before Restoration (Jan 2024)
                </Typography>
                <Box
                  sx={{
                    width: '100%',
                    height: 200,
                    background: 'linear-gradient(45deg, #8d6e63 0%, #a1887f 50%, #bcaaa4 100%)',
                    borderRadius: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '0.9rem',
                    flexDirection: 'column',
                    gap: 1
                  }}
                >
                  <Typography variant="body1" fontWeight="bold">
                    Degraded Coastal Area
                  </Typography>
                  <Typography variant="body2">
                    Sparse Vegetation
                  </Typography>
                  <Typography variant="body2">
                    {projectGeo?.growthData?.[0]?.coverage || 15}% Coverage
                  </Typography>
                  <Typography variant="caption">
                    Coordinates: {projectGeo?.coordinates[0].toFixed(3)}, {projectGeo?.coordinates[1].toFixed(3)}
                  </Typography>
                </Box>
              </Paper>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 2, textAlign: 'center' }}>
                <Typography variant="subtitle1" color="success.main" gutterBottom>
                  After Restoration (Oct 2024)
                </Typography>
                <Box
                  sx={{
                    width: '100%',
                    height: 200,
                    background: 'linear-gradient(45deg, #2e7d32 0%, #4caf50 50%, #81c784 100%)',
                    borderRadius: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '0.9rem',
                    flexDirection: 'column',
                    gap: 1
                  }}
                >
                  <Typography variant="body1" fontWeight="bold">
                    Thriving Blue Carbon Ecosystem
                  </Typography>
                  <Typography variant="body2">
                    Dense {projectGeo?.ecosystem} Forest
                  </Typography>
                  <Typography variant="body2">
                    {projectGeo?.growthData?.[3]?.coverage || 65}% Coverage
                  </Typography>
                  <Typography variant="caption">
                    Area: {projectGeo?.area} hectares restored
                  </Typography>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    );
  };

  // Simple India map representation
  const IndiaMapVisualization = () => (
    <Card>
      <CardContent>
        <Box display="flex" justify="space-between" alignItems="center" mb={2}>
          <Typography variant="h6" fontWeight="bold">
            India Blue Carbon Projects Map
          </Typography>
          <Box display="flex" gap={1}>
            <Button
              variant={mapLayer === 'satellite' ? 'contained' : 'outlined'}
              size="small"
              onClick={() => setMapLayer('satellite')}
            >
              Satellite
            </Button>
            <Button
              variant={mapLayer === 'terrain' ? 'contained' : 'outlined'}
              size="small"
              onClick={() => setMapLayer('terrain')}
            >
              Terrain
            </Button>
          </Box>
        </Box>

        {/* Simplified map representation */}
        <Box 
          sx={{ 
            height: 400, 
            borderRadius: 2, 
            background: mapLayer === 'satellite' 
              ? 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)'
              : 'linear-gradient(135deg, #8BC34A 0%, #4CAF50 100%)',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          {/* India outline representation */}
          <Box
            sx={{
              position: 'absolute',
              top: '20%',
              left: '30%',
              width: '40%',
              height: '60%',
              border: '2px solid rgba(255,255,255,0.5)',
              borderRadius: '20px 10px 30px 5px',
              background: 'rgba(255,255,255,0.1)'
            }}
          />
          
          {/* Project markers */}
          {projects.map((project) => {
            const projectGeo = geoData.projects[project.id];
            if (!projectGeo) return null;
            
            // Simple positioning based on coordinates
            const lat = projectGeo.coordinates[0];
            const lng = projectGeo.coordinates[1];
            
            // Convert to percentage positions (rough mapping)
            const top = `${80 - ((lat - 8) / (22 - 8)) * 60}%`;
            const left = `${30 + ((lng - 72) / (88 - 72)) * 40}%`;
            
            return (
              <Box
                key={project.id}
                sx={{
                  position: 'absolute',
                  top,
                  left,
                  transform: 'translate(-50%, -50%)',
                  cursor: 'pointer'
                }}
                onClick={() => setSelectedProject(project)}
              >
                <Avatar
                  sx={{
                    width: 20,
                    height: 20,
                    bgcolor: getProjectMarkerColor(project),
                    border: selectedProject?.id === project.id ? '2px solid white' : 'none'
                  }}
                >
                  <LocationIcon sx={{ fontSize: 12 }} />
                </Avatar>
                <Typography
                  variant="caption"
                  sx={{
                    position: 'absolute',
                    top: '100%',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    color: 'white',
                    background: 'rgba(0,0,0,0.7)',
                    padding: '2px 4px',
                    borderRadius: 1,
                    whiteSpace: 'nowrap',
                    fontSize: '0.6rem'
                  }}
                >
                  {project.name.split(' ')[0]}
                </Typography>
              </Box>
            );
          })}
        </Box>

        {/* Time Slider */}
        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle2" gutterBottom>
            Time Period: {timePeriods[timeSlider]?.label}
          </Typography>
          <Slider
            value={timeSlider}
            onChange={(e, newValue) => setTimeSlider(newValue)}
            min={0}
            max={3}
            marks={timePeriods}
            step={1}
          />
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <Box>
      <Typography variant={isMobile ? "h5" : "h4"} gutterBottom fontWeight="bold">
        Satellite Mapping & Analysis
      </Typography>
      <Typography variant="body1" color="text.secondary" gutterBottom>
        Real-time satellite monitoring of blue carbon restoration projects across India
      </Typography>

      {/* Control Panel */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={8}>
          <IndiaMapVisualization />
        </Grid>

        {/* Summary Statistics */}
        <Grid item xs={12} md={4}>
          <Grid container spacing={2}>
            <Grid item xs={6} md={12}>
              <Card>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Avatar sx={{ bgcolor: 'primary.main', mx: 'auto', mb: 1 }}>
                    <LandscapeIcon />
                  </Avatar>
                  <Typography variant="h5" color="primary" fontWeight="bold">
                    {totalArea.toLocaleString()}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Hectares Restored
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={6} md={12}>
              <Card>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Avatar sx={{ bgcolor: 'success.main', mx: 'auto', mb: 1 }}>
                    <ForestIcon />
                  </Avatar>
                  <Typography variant="h5" color="success.main" fontWeight="bold">
                    {totalCoverage.toFixed(1)}%
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Average Coverage
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    Coverage Progress
                  </Typography>
                  {Object.entries(geoData.projects).map(([projectId, data]) => {
                    const project = projects.find(p => p.id === parseInt(projectId));
                    if (!project) return null;
                    
                    const coverage = data.growthData?.[timeSlider]?.coverage || 0;
                    
                    return (
                      <Box key={projectId} sx={{ mb: 1 }}>
                        <Box display="flex" justifyContent="space-between">
                          <Typography variant="body2" fontSize="0.8rem">
                            {project.name.length > 15 ? project.name.substring(0, 15) + '...' : project.name}
                          </Typography>
                          <Typography variant="body2">{coverage}%</Typography>
                        </Box>
                        <LinearProgress 
                          variant="determinate" 
                          value={coverage} 
                          sx={{ mb: 1 }}
                        />
                      </Box>
                    );
                  })}
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      {/* Project Details */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            Project Overview
          </Typography>
          <Grid container spacing={2}>
            {projects.map((project) => (
              <Grid item xs={12} key={project.id}>
                <ProjectCard project={project} />
              </Grid>
            ))}
          </Grid>
        </Grid>

        <Grid item xs={12} md={8}>
          {selectedProject ? (
            <Box>
              <SatelliteImageComparison />
              
              {/* Growth Analytics */}
              <Card>
                <CardContent>
                  <Box display="flex" alignItems="center" gap={1} mb={2}>
                    <AnalyticsIcon color="primary" />
                    <Typography variant="h6" fontWeight="bold">
                      Growth Analytics - {selectedProject.name}
                    </Typography>
                  </Box>

                  <Box sx={{ height: 300 }}>
                    <ResponsiveContainer>
                      <AreaChart data={geoData.projects[selectedProject.id]?.growthData || []}>
                        <defs>
                          <linearGradient id="coverageGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#4caf50" stopOpacity={0.4} />
                            <stop offset="95%" stopColor="#4caf50" stopOpacity={0} />
                          </linearGradient>
                          <linearGradient id="biomassGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#2196f3" stopOpacity={0.4} />
                            <stop offset="95%" stopColor="#2196f3" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <RTooltip />
                        <Legend />
                        <Area
                          type="monotone"
                          dataKey="coverage"
                          stroke="#4caf50"
                          fill="url(#coverageGradient)"
                          name="Coverage (%)"
                        />
                        <Area
                          type="monotone"
                          dataKey="biomass"
                          stroke="#2196f3"
                          fill="url(#biomassGradient)"
                          name="Biomass (tons/ha)"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </Box>
                </CardContent>
              </Card>
            </Box>
          ) : (
            <Card sx={{ height: 400, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <SatelliteIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  Select a Project
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Click on a project card or map marker to view detailed satellite analysis
                </Typography>
              </CardContent>
            </Card>
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

export default SatelliteMapping;
