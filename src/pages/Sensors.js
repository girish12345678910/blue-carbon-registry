import React, { useEffect, useRef, useState, useMemo } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  LinearProgress,
  Paper,
  Divider,
  Alert,
  Switch,
  FormControlLabel,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Sensors as SensorsIcon,
  PowerSettingsNew as PowerIcon,
  BatteryChargingFull as BatteryIcon,
  BatteryAlert as BatteryAlertIcon,
  Timeline as TimelineIcon,
  PlayArrow as PlayIcon,
  Pause as PauseIcon,
  Speed as SpeedIcon,
  Thermostat as ThermostatIcon,
  Opacity as OpacityIcon,
  Park as EcoIcon,
  Science as ScienceIcon
} from '@mui/icons-material';
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip as RTooltip,
  ResponsiveContainer,
  Legend,
  Area,
  AreaChart,
  ReferenceLine
} from 'recharts';
import { useApp } from '../context/AppContext';

// Generate realistic sensor data
const generateSensorSample = () => {
  const co2ppm = 380 + Math.random() * 140;
  const temp = 24 + Math.random() * 8;
  const dox = 5 + Math.random() * 3.5;
  const salinity = 28 + Math.random() * 8;
  const soilCarbon = 2 + Math.random() * 2;
  const turbidity = 1 + Math.random() * 4;
  const ph = 7.8 + Math.random() * 0.6;

  const tempFactor = Math.max(0.6, Math.min(1.4, 1 + (temp - 26) * 0.02));
  const oxygenFactor = Math.max(0.7, Math.min(1.3, 0.8 + dox * 0.05));
  const carbonFactor = 0.5 + soilCarbon * 0.15;
  const sequestrationRate = 0.0025 * tempFactor * oxygenFactor * carbonFactor;

  return {
    timestamp: Date.now(),
    timeString: new Date().toLocaleTimeString(),
    co2ppm: +co2ppm.toFixed(2),
    temperature: +temp.toFixed(1),
    dissolvedOxygen: +dox.toFixed(2),
    salinity: +salinity.toFixed(1),
    soilCarbon: +soilCarbon.toFixed(2),
    turbidity: +turbidity.toFixed(1),
    ph: +ph.toFixed(2),
    sequestrationRate: +sequestrationRate.toFixed(4),
    co2Absorbed: +(co2ppm * 0.001).toFixed(3)
  };
};

const Sensors = () => {
  const { state, actions } = useApp();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  // Safe defaults with null checks
  const [selectedProjectId, setSelectedProjectId] = useState(() => {
    return (state.projects && state.projects.length > 0) ? state.projects[0].id : 1;
  });
  const [isStreaming, setIsStreaming] = useState(true);
  const [alertsEnabled, setAlertsEnabled] = useState(true);
  const intervalRef = useRef(null);
  
  // Safe data access with fallbacks
  const selectedProject = (state.projects || []).find(p => p.id === selectedProjectId);
  const sensorConfig = state.sensors?.[selectedProjectId] || { enabled: false, battery: 0, deviceId: 'N/A' };
  const sensorData = state.sensorStreams?.[selectedProjectId] || [];
  
  // Update selectedProjectId if projects change
  useEffect(() => {
    if (state.projects && state.projects.length > 0 && !selectedProject) {
      setSelectedProjectId(state.projects[0].id);
    }
  }, [state.projects, selectedProject]);
  
  // Real-time data streaming with null checks
  useEffect(() => {
    if (!isStreaming || !sensorConfig?.enabled || !actions.pushSensorSample) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      return;
    }
    
    intervalRef.current = setInterval(() => {
      const sample = generateSensorSample();
      actions.pushSensorSample(selectedProjectId, sample);
      
      // Alert system with null checks
      if (alertsEnabled && selectedProject?.name) {
        if (sample.co2ppm > 500) {
          actions.addNotification?.({
            type: 'warning',
            title: 'High CO₂ Detected',
            message: `${selectedProject.name}: CO₂ levels at ${sample.co2ppm} ppm`
          });
        }
        
        if (sample.dissolvedOxygen < 5.5) {
          actions.addNotification?.({
            type: 'error',
            title: 'Low Oxygen Alert',
            message: `${selectedProject.name}: Dissolved oxygen at ${sample.dissolvedOxygen} mg/L`
          });
        }
        
        if (sample.temperature > 30) {
          actions.addNotification?.({
            type: 'warning',
            title: 'High Temperature',
            message: `${selectedProject.name}: Water temperature at ${sample.temperature}°C`
          });
        }
      }
    }, 2000);
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [selectedProjectId, isStreaming, sensorConfig?.enabled, alertsEnabled, selectedProject?.name, actions]);
  
  // Data analysis with safe array access
  const latestReading = sensorData.length > 0 ? sensorData[sensorData.length - 1] : null;
  const averages = useMemo(() => {
    if (!sensorData || sensorData.length === 0) return null;
    
    const sum = sensorData.reduce((acc, reading) => ({
      co2ppm: acc.co2ppm + (reading.co2ppm || 0),
      temperature: acc.temperature + (reading.temperature || 0),
      dissolvedOxygen: acc.dissolvedOxygen + (reading.dissolvedOxygen || 0),
      salinity: acc.salinity + (reading.salinity || 0),
      soilCarbon: acc.soilCarbon + (reading.soilCarbon || 0),
      sequestrationRate: acc.sequestrationRate + (reading.sequestrationRate || 0),
      co2Absorbed: acc.co2Absorbed + (reading.co2Absorbed || 0)
    }), {
      co2ppm: 0, temperature: 0, dissolvedOxygen: 0, salinity: 0,
      soilCarbon: 0, sequestrationRate: 0, co2Absorbed: 0
    });
    
    const count = sensorData.length;
    return {
      co2ppm: +(sum.co2ppm / count).toFixed(2),
      temperature: +(sum.temperature / count).toFixed(1),
      dissolvedOxygen: +(sum.dissolvedOxygen / count).toFixed(2),
      salinity: +(sum.salinity / count).toFixed(1),
      soilCarbon: +(sum.soilCarbon / count).toFixed(2),
      sequestrationRate: +(sum.sequestrationRate / count).toFixed(4),
      co2Absorbed: +(sum.co2Absorbed / count).toFixed(3)
    };
  }, [sensorData]);
  
  const getBatteryColor = (level) => {
    if (!level || level > 50) return 'success';
    if (level > 20) return 'warning';
    return 'error';
  };
  
  const getBatteryIcon = (level) => {
    return (level && level > 20) ? <BatteryIcon /> : <BatteryAlertIcon />;
  };

  // Safety check for projects
  if (!state.projects || state.projects.length === 0) {
    return (
      <Box>
        <Typography variant="h4" gutterBottom fontWeight="bold">
          Real-Time Sensor Monitoring
        </Typography>
        <Alert severity="warning">
          No projects available. Please add projects first to enable sensor monitoring.
        </Alert>
      </Box>
    );
  }
  
  return (
    <Box>
      <Typography variant={isMobile ? "h5" : "h4"} gutterBottom fontWeight="bold">
        Real-Time Sensor Monitoring
      </Typography>
      <Typography variant="body1" color="text.secondary" gutterBottom>
        Live environmental data streaming from IoT sensors in blue carbon ecosystems
      </Typography>
      
      {/* Control Panel */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Sensor Controls
              </Typography>
              
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Select Project Site</InputLabel>
                <Select
                  value={selectedProjectId}
                  onChange={(e) => setSelectedProjectId(e.target.value)}
                  label="Select Project Site"
                >
                  {state.projects.map(project => (
                    <MenuItem key={project.id} value={project.id}>
                      {project.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              
              <Box display="flex" alignItems="center" gap={1} mb={2}>
                <SensorsIcon color={sensorConfig?.enabled ? 'success' : 'error'} />
                <Chip
                  label={sensorConfig?.enabled ? 'Sensor Online' : 'Sensor Offline'}
                  color={sensorConfig?.enabled ? 'success' : 'error'}
                  size="small"
                />
              </Box>
              
              <Box display="flex" gap={1} mb={2}>
                <Button
                  variant="contained"
                  color={sensorConfig?.enabled ? 'error' : 'success'}
                  startIcon={<PowerIcon />}
                  onClick={() => actions.toggleSensor?.(selectedProjectId, !sensorConfig?.enabled)}
                  fullWidth
                >
                  {sensorConfig?.enabled ? 'Disable' : 'Enable'}
                </Button>
                <Button
                  variant="outlined"
                  startIcon={isStreaming ? <PauseIcon /> : <PlayIcon />}
                  onClick={() => setIsStreaming(!isStreaming)}
                  disabled={!sensorConfig?.enabled}
                >
                  {isStreaming ? 'Pause' : 'Resume'}
                </Button>
              </Box>
              
              {/* Battery Status */}
              <Box display="flex" alignItems="center" gap={1} mb={2}>
                {getBatteryIcon(sensorConfig?.battery)}
                <Box flexGrow={1}>
                  <LinearProgress
                    variant="determinate"
                    value={sensorConfig?.battery || 0}
                    color={getBatteryColor(sensorConfig?.battery)}
                  />
                </Box>
                <Typography variant="body2">
                  {Math.round(sensorConfig?.battery || 0)}%
                </Typography>
              </Box>
              
              <FormControlLabel
                control={
                  <Switch
                    checked={alertsEnabled}
                    onChange={(e) => setAlertsEnabled(e.target.checked)}
                  />
                }
                label="Enable Alerts"
              />
              
              <Divider sx={{ my: 2 }} />
              <Typography variant="body2" color="text.secondary">
                <strong>Device:</strong> {sensorConfig?.deviceId || '—'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <strong>Last Seen:</strong> {sensorConfig?.lastSeen ? 
                  new Date(sensorConfig.lastSeen).toLocaleTimeString() : '—'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <strong>Data Points:</strong> {sensorData.length || 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        {/* Live Metrics */}
        <Grid item xs={12} md={8}>
          <Grid container spacing={2}>
            {[
              {
                label: 'CO₂ Concentration',
                value: latestReading?.co2ppm,
                unit: 'ppm',
                icon: <ScienceIcon />,
                color: 'primary'
              },
              {
                label: 'Water Temperature',
                value: latestReading?.temperature,
                unit: '°C',
                icon: <ThermostatIcon />,
                color: 'secondary'
              },
              {
                label: 'Dissolved Oxygen',
                value: latestReading?.dissolvedOxygen,
                unit: 'mg/L',
                icon: <OpacityIcon />,
                color: 'info'
              },
              {
                label: 'Soil Organic Carbon',
                value: latestReading?.soilCarbon,
                unit: '%',
                icon: <EcoIcon />,
                color: 'success'
              },
              {
                label: 'Sequestration Rate',
                value: latestReading?.sequestrationRate,
                unit: 'tCO₂e/day',
                icon: <SpeedIcon />,
                color: 'warning'
              },
              {
                label: 'CO₂ Absorbed',
                value: latestReading?.co2Absorbed,
                unit: 'kg/m³',
                icon: <ScienceIcon />,
                color: 'error'
              }
            ].map((metric, index) => (
              <Grid key={index} item xs={6} md={4}>
                <Paper 
                  variant="outlined" 
                  sx={{ 
                    p: 2, 
                    textAlign: 'center',
                    backgroundColor: sensorConfig?.enabled ? 'background.paper' : 'action.disabledBackground'
                  }}
                >
                  <Box display="flex" justifyContent="center" mb={1}>
                    {React.cloneElement(metric.icon, { color: metric.color })}
                  </Box>
                  <Typography variant="h5" fontWeight="bold" color={`${metric.color}.main`}>
                    {metric.value ? metric.value : '—'}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {metric.label}
                  </Typography>
                  <Typography variant="caption" display="block" color="text.secondary">
                    {metric.unit}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>
      
      {/* Status Alert */}
      {!sensorConfig?.enabled && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          Sensor is currently offline. Enable the sensor to start receiving real-time data.
        </Alert>
      )}
      
      {/* Charts */}
      <Grid container spacing={3}>
        {/* CO₂ Chart */}
        <Grid item xs={12} lg={8}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" gap={1} mb={2}>
                <TimelineIcon color="primary" />
                <Typography variant="h6" fontWeight="bold">
                  CO₂ Concentration & Temperature Trends
                </Typography>
              </Box>
              <Box sx={{ width: '100%', height: 350 }}>
                {sensorData.length > 0 ? (
                  <ResponsiveContainer>
                    <AreaChart data={sensorData.slice(-50)}>
                      <defs>
                        <linearGradient id="co2Gradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#1976d2" stopOpacity={0.4} />
                          <stop offset="95%" stopColor="#1976d2" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="timeString" tick={{ fontSize: 12 }} />
                      <YAxis yAxisId="left" />
                      <YAxis yAxisId="right" orientation="right" />
                      <RTooltip />
                      <Legend />
                      <Area
                        yAxisId="left"
                        type="monotone"
                        dataKey="co2ppm"
                        stroke="#1976d2"
                        fill="url(#co2Gradient)"
                        name="CO₂ (ppm)"
                      />
                      <Line
                        yAxisId="right"
                        type="monotone"
                        dataKey="temperature"
                        stroke="#d32f2f"
                        strokeWidth={2}
                        dot={false}
                        name="Temperature (°C)"
                      />
                      <ReferenceLine y={450} stroke="orange" strokeDasharray="5 5" label="Alert Level" />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <Box display="flex" alignItems="center" justifyContent="center" height="100%">
                    <Typography color="text.secondary">
                      No sensor data available. Enable sensor to start monitoring.
                    </Typography>
                  </Box>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        {/* Analysis Panel */}
        <Grid item xs={12} lg={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Carbon Sequestration Analysis
              </Typography>
              
              {averages ? (
                <Box>
                  <Box display="flex" justifyContent="space-between" mb={1}>
                    <Typography variant="body2">Avg Daily Rate:</Typography>
                    <Typography variant="body2" fontWeight="bold">
                      {averages.sequestrationRate} tCO₂e/day
                    </Typography>
                  </Box>
                  
                  <Box display="flex" justifyContent="space-between" mb={1}>
                    <Typography variant="body2">Monthly Estimate:</Typography>
                    <Typography variant="body2" fontWeight="bold">
                      {(averages.sequestrationRate * 30).toFixed(2)} tCO₂e
                    </Typography>
                  </Box>
                  
                  <Divider sx={{ my: 2 }} />
                  
                  <Box display="flex" justifyContent="space-between" mb={1}>
                    <Typography variant="body2">Est. Credits/Month:</Typography>
                    <Typography variant="body2" fontWeight="bold" color="success.main">
                      ~{Math.round(averages.sequestrationRate * 30 * 1000)}
                    </Typography>
                  </Box>
                  
                  <LinearProgress
                    variant="determinate"
                    value={Math.min(100, (averages.sequestrationRate / 0.01) * 100)}
                    color="success"
                    sx={{ mt: 2 }}
                  />
                  <Typography variant="caption" color="text.secondary">
                    Performance vs. Target
                  </Typography>
                </Box>
              ) : (
                <Typography color="text.secondary">
                  No data available. Enable sensor to start monitoring.
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Sensors;
