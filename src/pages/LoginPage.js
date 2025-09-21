import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Button,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
  Card,
  CardContent,
  Alert,
  Grid,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  AccountBalanceWallet as WalletIcon,
  Person as PersonIcon,
  Business as BusinessIcon,
  AdminPanelSettings as AdminIcon,
  Park as EcoIcon
} from '@mui/icons-material';
import { useApp } from '../context/AppContext';

const LoginPage = () => {
  const { actions } = useApp();
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  // Mock wallet addresses for different roles
  const mockWallets = {
    NGO: '0x742d35Cc6634C0532925a3b8D48C4Ef5e9F0',
    Community: '0x8ba1f109551bD432803012645Hac189B1c',
    Admin: '0x123d4567890abcdef1234567890abcdef123'
  };
  
  // Simulate MetaMask connection
  const handleWalletConnect = async (role = userRole) => {
    if (!role) {
      alert('Please select a user role first');
      return;
    }
    
    setIsConnecting(true);
    
    // Simulate connection delay
    setTimeout(() => {
      const mockAddress = mockWallets[role];
      actions.connectWallet(mockAddress, role);
      actions.addNotification({
        type: 'success',
        title: 'Wallet Connected',
        message: `Successfully connected as ${role} user`
      });
      navigate('/');
      setIsConnecting(false);
    }, 1500);
  };
  
  // Demo user quick login
  const handleDemoLogin = (role) => {
    setUserRole(role);
    handleWalletConnect(role);
  };
  
  const roleIcons = {
    NGO: <BusinessIcon />,
    Community: <PersonIcon />,
    Admin: <AdminIcon />
  };
  
  const roleDescriptions = {
    NGO: 'Non-profit organizations managing blue carbon projects',
    Community: 'Local coastal communities participating in restoration',
    Admin: 'System administrators with verification privileges'
  };
  
  return (
    <Container 
      maxWidth="md" 
      sx={{ 
        mt: { xs: 4, sm: 8 },
        px: { xs: 2, sm: 3 }
      }}
    >
      <Box textAlign="center" mb={{ xs: 3, sm: 4 }}>
        <EcoIcon sx={{ 
          fontSize: { xs: 50, sm: 60 }, 
          color: 'primary.main', 
          mb: 2 
        }} />
        <Typography 
          variant={isMobile ? "h4" : "h3"} 
          gutterBottom 
          fontWeight="bold"
        >
          Blue Carbon Registry
        </Typography>
        <Typography 
          variant={isMobile ? "subtitle1" : "h6"} 
          color="text.secondary" 
          gutterBottom
        >
          Blockchain-Powered Carbon Credit Management
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Connect your wallet to access the decentralized blue carbon marketplace
        </Typography>
      </Box>
      
      <Paper 
        elevation={3} 
        sx={{ 
          p: { xs: 3, sm: 4 }, 
          maxWidth: 500, 
          mx: 'auto' 
        }}
      >
        <Typography 
          variant={isMobile ? "h6" : "h5"} 
          gutterBottom 
          textAlign="center"
        >
          Connect Wallet
        </Typography>
        
        <Alert severity="info" sx={{ mb: 3 }}>
          <strong>Demo Mode:</strong> This is a frontend-only demonstration. 
          Wallet connections and blockchain interactions are simulated.
        </Alert>
        
        {/* Role Selection */}
        <FormControl fullWidth sx={{ mb: 3 }}>
          <InputLabel>Select User Role</InputLabel>
          <Select
            value={userRole}
            onChange={(e) => setUserRole(e.target.value)}
            label="Select User Role"
          >
            <MenuItem value="NGO">NGO - Project Manager</MenuItem>
            <MenuItem value="Community">Community - Local Participant</MenuItem>
            <MenuItem value="Admin">Admin - System Verifier</MenuItem>
          </Select>
        </FormControl>
        
        {/* Manual Connection */}
        <Button
          fullWidth
          variant="contained"
          size="large"
          startIcon={<WalletIcon />}
          onClick={() => handleWalletConnect()}
          disabled={!userRole || isConnecting}
          sx={{ mb: 3 }}
        >
          {isConnecting ? 'Connecting...' : 'Connect MetaMask (Simulated)'}
        </Button>
        
        <Divider sx={{ my: 3 }}>
          <Typography variant="body2" color="text.secondary">
            Or try demo users
          </Typography>
        </Divider>
        
        {/* Quick Demo Login */}
        <Grid container spacing={2}>
          {Object.keys(roleDescriptions).map((role) => (
            <Grid item xs={12} key={role}>
              <Card 
                variant="outlined" 
                sx={{ 
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  '&:hover': {
                    backgroundColor: 'action.hover',
                    transform: 'translateY(-2px)'
                  }
                }}
                onClick={() => handleDemoLogin(role)}
              >
                <CardContent sx={{ py: { xs: 2, sm: 3 } }}>
                  <Box display="flex" alignItems="center" gap={2}>
                    {roleIcons[role]}
                    <Box flexGrow={1}>
                      <Typography 
                        variant={isMobile ? "body1" : "subtitle1"} 
                        fontWeight="bold"
                      >
                        Demo {role} User
                      </Typography>
                      <Typography 
                        variant="body2" 
                        color="text.secondary"
                        sx={{
                          display: { xs: 'none', sm: 'block' }
                        }}
                      >
                        {roleDescriptions[role]}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
        
        <Box mt={3} textAlign="center">
          <Typography 
            variant="body2" 
            color="text.secondary"
            sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
          >
            This demo showcases blue carbon project management, MRV data upload,
            carbon credit tokenization, and administrative verification processes.
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default LoginPage;
