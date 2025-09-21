import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Alert,
  Chip,
  LinearProgress,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Divider
} from '@mui/material';
import {
  CloudUpload as UploadIcon,
  AttachFile as AttachFileIcon,
  Delete as DeleteIcon,
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon,
  Error as ErrorIcon
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import { useApp } from '../context/AppContext';

const MRVUpload = () => {
  const { state, actions } = useApp();
  const [formData, setFormData] = useState({
    projectId: '',
    date: dayjs(),
    location: '',
    files: []
  });
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  
  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  // Simulate file upload
  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files);
    const mockFiles = files.map(file => ({
      id: Date.now() + Math.random(),
      name: file.name,
      size: (file.size / (1024 * 1024)).toFixed(2), // Convert to MB
      type: file.type,
      uploadProgress: 0
    }));
    
    setFormData(prev => ({
      ...prev,
      files: [...prev.files, ...mockFiles]
    }));
    
    // Simulate upload progress
    mockFiles.forEach(file => {
      let progress = 0;
      const interval = setInterval(() => {
        progress += 10;
        setFormData(prev => ({
          ...prev,
          files: prev.files.map(f => 
            f.id === file.id ? { ...f, uploadProgress: progress } : f
          )
        }));
        
        if (progress >= 100) {
          clearInterval(interval);
        }
      }, 200);
    });
  };
  
  const handleRemoveFile = (fileId) => {
    setFormData(prev => ({
      ...prev,
      files: prev.files.filter(f => f.id !== fileId)
    }));
  };
  
  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!formData.projectId || !formData.location || formData.files.length === 0) {
      actions.addNotification({
        type: 'error',
        title: 'Validation Error',
        message: 'Please fill all required fields and upload at least one file.'
      });
      return;
    }
    
    setUploading(true);
    
    // Simulate submission delay
    setTimeout(() => {
      actions.submitMRVData({
        projectId: parseInt(formData.projectId),
        date: formData.date.format('YYYY-MM-DD'),
        location: formData.location,
        files: formData.files.map(f => ({ name: f.name, size: f.size }))
      });
      
      setUploading(false);
      setUploadSuccess(true);
      
      // Reset form
      setFormData({
        projectId: '',
        date: dayjs(),
        location: '',
        files: []
      });
      
      // Hide success message after 5 seconds
      setTimeout(() => setUploadSuccess(false), 5000);
    }, 2000);
  };
  
  const getStatusIcon = (status) => {
    switch (status) {
      case 'Approved':
        return <CheckCircleIcon color="success" />;
      case 'Pending':
        return <ScheduleIcon color="warning" />;
      case 'Rejected':
        return <ErrorIcon color="error" />;
      default:
        return <ScheduleIcon color="action" />;
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
  
  return (
    <Box>
      <Typography variant="h4" gutterBottom fontWeight="bold">
        MRV Data Upload
      </Typography>
      <Typography variant="body1" color="text.secondary" gutterBottom>
        Upload monitoring, reporting, and verification data for your blue carbon projects.
      </Typography>
      
      <Grid container spacing={3}>
        {/* Upload Form */}
        <Grid item xs={12} lg={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom fontWeight="bold">
                Upload New MRV Data
              </Typography>
              
              {uploadSuccess && (
                <Alert severity="success" sx={{ mb: 3 }}>
                  MRV data has been successfully submitted and is now pending review!
                </Alert>
              )}
              
              <Box component="form" onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                  {/* Project Selection */}
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth required>
                      <InputLabel>Select Project</InputLabel>
                      <Select
                        value={formData.projectId}
                        onChange={(e) => handleInputChange('projectId', e.target.value)}
                        label="Select Project"
                      >
                        {state.projects.map((project) => (
                          <MenuItem key={project.id} value={project.id}>
                            {project.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  
                  {/* Date */}
                  <Grid item xs={12} md={6}>
                    <DatePicker
                      label="Monitoring Date *"
                      value={formData.date}
                      onChange={(newValue) => handleInputChange('date', newValue)}
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          required: true
                        }
                      }}
                    />
                  </Grid>
                  
                  {/* Location */}
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      required
                      label="Specific Location/Site"
                      value={formData.location}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      placeholder="e.g., Sector A-1, GPS coordinates, or site description"
                      helperText="Provide specific location details for the monitoring site"
                    />
                  </Grid>
                  
                  {/* File Upload */}
                  <Grid item xs={12}>
                    <Paper 
                      variant="outlined" 
                      sx={{ 
                        p: 3, 
                        textAlign: 'center',
                        borderStyle: 'dashed',
                        backgroundColor: 'background.default'
                      }}
                    >
                      <input
                        accept="*/*"
                        style={{ display: 'none' }}
                        id="file-upload"
                        multiple
                        type="file"
                        onChange={handleFileUpload}
                      />
                      <label htmlFor="file-upload">
                        <Button
                          variant="outlined"
                          component="span"
                          startIcon={<UploadIcon />}
                          size="large"
                        >
                          Choose Files
                        </Button>
                      </label>
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        Upload monitoring reports, photos, data files, and other supporting documents
                      </Typography>
                    </Paper>
                  </Grid>
                  
                  {/* File List */}
                  {formData.files.length > 0 && (
                    <Grid item xs={12}>
                      <Typography variant="subtitle1" gutterBottom>
                        Uploaded Files ({formData.files.length})
                      </Typography>
                      <List>
                        {formData.files.map((file) => (
                          <ListItem key={file.id} divider>
                            <ListItemIcon>
                              <AttachFileIcon />
                            </ListItemIcon>
                            <ListItemText
                              primary={file.name}
                              secondary={`${file.size} MB`}
                            />
                            {file.uploadProgress < 100 ? (
                              <Box sx={{ width: 100, mr: 2 }}>
                                <LinearProgress 
                                  variant="determinate" 
                                  value={file.uploadProgress} 
                                />
                              </Box>
                            ) : (
                              <CheckCircleIcon color="success" sx={{ mr: 2 }} />
                            )}
                            <IconButton 
                              edge="end" 
                              onClick={() => handleRemoveFile(file.id)}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </ListItem>
                        ))}
                      </List>
                    </Grid>
                  )}
                  
                  {/* Submit Button */}
                  <Grid item xs={12}>
                    <Button
                      type="submit"
                      variant="contained"
                      size="large"
                      disabled={uploading}
                      startIcon={uploading ? null : <UploadIcon />}
                      fullWidth
                    >
                      {uploading ? (
                        <>
                          <LinearProgress sx={{ width: 100, mr: 2 }} />
                          Submitting...
                        </>
                      ) : (
                        'Submit MRV Data'
                      )}
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        {/* Recent Submissions */}
        <Grid item xs={12} lg={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom fontWeight="bold">
                Recent Submissions
              </Typography>
              
              {state.mrvSubmissions.length === 0 ? (
                <Typography variant="body2" color="text.secondary">
                  No submissions yet
                </Typography>
              ) : (
                <List>
                  {state.mrvSubmissions.slice(0, 5).map((submission, index) => (
                    <React.Fragment key={submission.id}>
                      <ListItem sx={{ px: 0 }}>
                        <ListItemIcon>
                          {getStatusIcon(submission.status)}
                        </ListItemIcon>
                        <ListItemText
                          primary={submission.projectName}
                          secondary={
                            <Box>
                              <Typography variant="caption" component="div">
                                {new Date(submission.submittedAt).toLocaleDateString()}
                              </Typography>
                              <Chip
                                label={submission.status}
                                color={getStatusColor(submission.status)}
                                size="small"
                                sx={{ mt: 0.5 }}
                              />
                            </Box>
                          }
                        />
                      </ListItem>
                      {index < state.mrvSubmissions.slice(0, 5).length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </List>
              )}
            </CardContent>
          </Card>
          
          {/* Upload Guidelines */}
          <Card sx={{ mt: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom fontWeight="bold">
                Upload Guidelines
              </Typography>
              
              <Typography variant="body2" color="text.secondary" paragraph>
                Please ensure your MRV data includes:
              </Typography>
              
              <List dense>
                <ListItem sx={{ px: 0 }}>
                  <ListItemText 
                    primary="• Vegetation surveys and biomass measurements"
                    primaryTypographyProps={{ variant: 'body2' }}
                  />
                </ListItem>
                <ListItem sx={{ px: 0 }}>
                  <ListItemText 
                    primary="• Water quality and soil carbon data"
                    primaryTypographyProps={{ variant: 'body2' }}
                  />
                </ListItem>
                <ListItem sx={{ px: 0 }}>
                  <ListItemText 
                    primary="• Site photographs with GPS coordinates"
                    primaryTypographyProps={{ variant: 'body2' }}
                  />
                </ListItem>
                <ListItem sx={{ px: 0 }}>
                  <ListItemText 
                    primary="• Monitoring equipment calibration reports"
                    primaryTypographyProps={{ variant: 'body2' }}
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default MRVUpload;
