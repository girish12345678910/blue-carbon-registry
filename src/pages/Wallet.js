import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  Avatar,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  AccountBalanceWallet as WalletIcon,
  Token as TokenIcon,
  Send as SendIcon,
  CallReceived as ReceiveIcon,
  TrendingUp as TrendingUpIcon,
} from '@mui/icons-material';
import { useApp } from '../context/AppContext';

const Wallet = () => {
  const { state, actions } = useApp();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Mock wallet data
  const walletData = {
    totalBalance: 61250.50,
    carbonCredits: 2450,
    monthlyChange: 12.5,
  };

  const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0 // Remove decimals for cleaner look
  }).format(amount || 0);
};

  return (
    <Box>
      <Typography variant={isMobile ? "h5" : "h4"} gutterBottom fontWeight="bold">
        Wallet
      </Typography>
      <Typography variant="body1" color="text.secondary" gutterBottom>
        Manage your digital assets and carbon credits securely
      </Typography>

      {/* Wallet Overview */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Main Balance Card */}
        <Grid item xs={12} md={8}>
          <Card sx={{ background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)', color: 'white' }}>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                <Box>
                  <Typography variant="h6" sx={{ opacity: 0.9 }}>
                    Total Portfolio Value
                  </Typography>
                  <Typography variant={isMobile ? "h4" : "h3"} fontWeight="bold">
                    {formatCurrency(walletData.totalBalance)}
                  </Typography>
                </Box>
                <WalletIcon sx={{ fontSize: 40, opacity: 0.7 }} />
              </Box>

              <Box display="flex" alignItems="center" gap={1} mb={3}>
                <TrendingUpIcon sx={{ color: '#4caf50' }} />
                <Typography variant="body1">
                  +{walletData.monthlyChange}% this month
                </Typography>
              </Box>

              <Box display="flex" gap={2}>
                <Button 
                  variant="contained" 
                  startIcon={<SendIcon />}
                  onClick={() => actions.addNotification({
                    type: 'info',
                    title: 'Send Feature',
                    message: 'Send feature coming soon!'
                  })}
                  sx={{ 
                    bgcolor: 'rgba(255,255,255,0.2)', 
                    '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' }
                  }}
                >
                  Send
                </Button>
                <Button 
                  variant="contained" 
                  startIcon={<ReceiveIcon />}
                  onClick={() => actions.addNotification({
                    type: 'info',
                    title: 'Receive Feature',
                    message: 'Receive feature coming soon!'
                  })}
                  sx={{ 
                    bgcolor: 'rgba(255,255,255,0.2)', 
                    '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' }
                  }}
                >
                  Receive
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Quick Stats */}
        <Grid item xs={12} md={4}>
          <Grid container spacing={2}>
            <Grid item xs={6} md={12}>
              <Card>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Avatar sx={{ bgcolor: 'primary.main', mx: 'auto', mb: 1 }}>
                    <TokenIcon />
                  </Avatar>
                  <Typography variant="h6" color="primary" fontWeight="bold">
                    {walletData.carbonCredits}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Carbon Credits
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={6} md={12}>
              <Card>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Avatar sx={{ bgcolor: 'success.main', mx: 'auto', mb: 1 }}>
                    <WalletIcon />
                  </Avatar>
                  <Typography variant="h6" color="success.main" fontWeight="bold">
                    Connected
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Wallet Status
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      {/* Connected Wallet Info */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom fontWeight="bold">
            Connected Wallet
          </Typography>
          <Box display="flex" alignItems="center" gap={2}>
            <Avatar sx={{ bgcolor: 'secondary.main' }}>
              <WalletIcon />
            </Avatar>
            <Box>
              <Typography variant="body1" fontWeight="bold">
                {state.walletAddress}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Role: {state.userRole}
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Wallet;
