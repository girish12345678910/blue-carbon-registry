import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Avatar,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  Token as TokenIcon,
  Visibility as VisibilityIcon,
  Delete as RetireIcon,
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon,
  Cancel as CancelIcon
} from '@mui/icons-material';
import { useApp } from '../context/AppContext';

const CarbonCredits = () => {
  const { state, actions } = useApp();
  const [selectedCredit, setSelectedCredit] = useState(null);
  const [retireDialogOpen, setRetireDialogOpen] = useState(false);
  
  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return 'success';
      case 'Pending': return 'warning';
      case 'Retired': return 'error';
      default: return 'default';
    }
  };
  
  const getStatusIcon = (status) => {
    switch (status) {
      case 'Active': return <CheckCircleIcon fontSize="small" />;
      case 'Pending': return <ScheduleIcon fontSize="small" />;
      case 'Retired': return <CancelIcon fontSize="small" />;
      default: return <TokenIcon fontSize="small" />;
    }
  };
  
  const handleRetire = (credit) => {
    setSelectedCredit(credit);
    setRetireDialogOpen(true);
  };
  
  const confirmRetire = () => {
    if (selectedCredit) {
      actions.retireCredit(selectedCredit.id, selectedCredit.amount, selectedCredit.projectName);
      setRetireDialogOpen(false);
      setSelectedCredit(null);
    }
  };
  
  const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount);
};
  
  const totalActiveCredits = state.carbonCredits
    .filter(credit => credit.status === 'Active')
    .reduce((sum, credit) => sum + credit.amount, 0);
  
  const totalValue = state.carbonCredits
    .filter(credit => credit.status === 'Active')
    .reduce((sum, credit) => sum + (credit.amount * credit.price), 0);
  
  return (
    <Box>
      <Typography variant="h4" gutterBottom fontWeight="bold">
        Carbon Credits Portfolio
      </Typography>
      <Typography variant="body1" color="text.secondary" gutterBottom>
        Manage your tokenized blue carbon credits and track their performance.
      </Typography>
      
      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Avatar sx={{ bgcolor: 'primary.main', mx: 'auto', mb: 2 }}>
                <TokenIcon />
              </Avatar>
              <Typography variant="h4" color="primary" fontWeight="bold">
                {state.carbonCredits.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Credits
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Avatar sx={{ bgcolor: 'success.main', mx: 'auto', mb: 2 }}>
                <CheckCircleIcon />
              </Avatar>
              <Typography variant="h4" color="success.main" fontWeight="bold">
                {totalActiveCredits.toLocaleString()}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Active Credits (tCO₂e)
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Avatar sx={{ bgcolor: 'secondary.main', mx: 'auto', mb: 2 }}>
                <TokenIcon />
              </Avatar>
              <Typography variant="h4" color="secondary.main" fontWeight="bold">
                {formatCurrency(totalValue)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Portfolio Value
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Avatar sx={{ bgcolor: 'warning.main', mx: 'auto', mb: 2 }}>
                <ScheduleIcon />
              </Avatar>
              <Typography variant="h4" color="warning.main" fontWeight="bold">
                {state.carbonCredits.filter(c => c.status === 'Pending').length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Pending Credits
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      {/* Credits Table */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom fontWeight="bold">
            Your Carbon Credit Tokens
          </Typography>
          
          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Token ID</TableCell>
                  <TableCell>Project</TableCell>
                  <TableCell>Amount (tCO₂e)</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Price</TableCell>
                  <TableCell>Value</TableCell>
                  <TableCell>Expiry</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {state.carbonCredits.map((credit) => (
                  <TableRow key={credit.id}>
                    <TableCell>
                      <Box display="flex" alignItems="center">
                        <TokenIcon sx={{ mr: 1, color: 'primary.main' }} />
                        <Typography variant="body2" fontFamily="monospace">
                          {credit.tokenId}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight="medium">
                        {credit.projectName}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Verified by {credit.verifier}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight="bold">
                        {credit.amount.toLocaleString()}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        icon={getStatusIcon(credit.status)}
                        label={credit.status}
                        color={getStatusColor(credit.status)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {formatCurrency(credit.price)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight="bold">
                        {formatCurrency(credit.amount * credit.price)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {new Date(credit.expiryDate).toLocaleDateString()}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box display="flex" gap={1}>
                        <Tooltip title="View Details">
                          <IconButton size="small" color="primary">
                            <VisibilityIcon />
                          </IconButton>
                        </Tooltip>
                        {credit.status === 'Active' && (
                          <Tooltip title="Retire Credit">
                            <IconButton 
                              size="small" 
                              color="error"
                              onClick={() => handleRetire(credit)}
                            >
                              <RetireIcon />
                            </IconButton>
                          </Tooltip>
                        )}
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
      
      {/* Retire Confirmation Dialog */}
      <Dialog open={retireDialogOpen} onClose={() => setRetireDialogOpen(false)}>
        <DialogTitle>Retire Carbon Credit</DialogTitle>
        <DialogContent>
          <Typography gutterBottom>
            Are you sure you want to retire this carbon credit?
          </Typography>
          {selectedCredit && (
            <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
              <Typography variant="body2"><strong>Token:</strong> {selectedCredit.tokenId}</Typography>
              <Typography variant="body2"><strong>Amount:</strong> {selectedCredit.amount} tCO₂e</Typography>
              <Typography variant="body2"><strong>Project:</strong> {selectedCredit.projectName}</Typography>
            </Box>
          )}
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            Once retired, these credits cannot be traded or transferred.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRetireDialogOpen(false)}>Cancel</Button>
          <Button onClick={confirmRetire} color="error" variant="contained">
            Retire Credits
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CarbonCredits;
