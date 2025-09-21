import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  IconButton,
  Badge,
  Menu,
  MenuItem,
  Divider,
  useTheme,
  useMediaQuery,
  Chip,
  SwipeableDrawer,
  BottomNavigation,
  BottomNavigationAction,
  Paper
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  Upload as UploadIcon,
  Token as TokenIcon,
  AdminPanelSettings as AdminIcon,
  Timeline as ActivityIcon,
  AccountBalanceWallet as WalletIcon,
  Notifications as NotificationsIcon,
  Person as PersonIcon,
  Logout as LogoutIcon,
  Refresh as RefreshIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import { useApp } from '../context/AppContext';
import NotificationSnackbar from './NotificationSnackbar';

const drawerWidth = 240;

const Layout = () => {
  const { state, actions } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isTablet = useMediaQuery(theme.breakpoints.down('lg'));
  
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notificationAnchor, setNotificationAnchor] = useState(null);
  const [userMenuAnchor, setUserMenuAnchor] = useState(null);
  
  // Redirect to login if not connected
  React.useEffect(() => {
    if (!state.isConnected) {
      navigate('/login');
    }
  }, [state.isConnected, navigate]);
  
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };
  
  const handleNotificationClick = (event) => {
    setNotificationAnchor(event.currentTarget);
  };
  
  const handleUserMenuClick = (event) => {
    setUserMenuAnchor(event.currentTarget);
  };
  
  const handleLogout = () => {
    actions.disconnectWallet();
    setUserMenuAnchor(null);
  };
  
  const handleResetDemo = () => {
    actions.resetDemo();
    actions.addNotification({
      type: 'info',
      title: 'Demo Reset',
      message: 'All data has been reset to initial state for demo purposes.'
    });
    setUserMenuAnchor(null);
  };
  
  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/' },
    { text: 'MRV Upload', icon: <UploadIcon />, path: '/mrv-upload' },
    { text: 'Carbon Credits', icon: <TokenIcon />, path: '/carbon-credits' },
    ...(state.userRole === 'Admin' ? [{ text: 'Admin Panel', icon: <AdminIcon />, path: '/admin' }] : []),
    { text: 'Activity Feed', icon: <ActivityIcon />, path: '/activity' },
  ];
  
  // Mobile Bottom Navigation
  const BottomNav = () => {
    const currentPath = location.pathname;
    
    return (
      <Paper 
        sx={{ 
          position: 'fixed', 
          bottom: 0, 
          left: 0, 
          right: 0, 
          zIndex: 1000,
          display: { xs: 'block', md: 'none' }
        }} 
        elevation={3}
      >
        <BottomNavigation
          value={currentPath}
          onChange={(event, newValue) => {
            navigate(newValue);
          }}
          showLabels
        >
          {menuItems.slice(0, 4).map((item) => (
            <BottomNavigationAction
              key={item.path}
              label={item.text.split(' ')[0]} // Show only first word on mobile
              value={item.path}
              icon={item.icon}
            />
          ))}
        </BottomNavigation>
      </Paper>
    );
  };
  
  const drawer = (
    <div>
      <Box sx={{ 
        p: 2, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        gap: 1 
      }}>
        <Box display="flex" alignItems="center" gap={1}>
          <TokenIcon color="primary" />
          <Typography variant="h6" color="primary" fontWeight="bold">
            {isMobile ? 'BCR' : 'Blue Carbon Registry'}
          </Typography>
        </Box>
        {isMobile && (
          <IconButton onClick={handleDrawerToggle}>
            <CloseIcon />
          </IconButton>
        )}
      </Box>
      <Divider />
      
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              selected={location.pathname === item.path}
              onClick={() => {
                navigate(item.path);
                if (isMobile) setMobileOpen(false);
              }}
              sx={{
                '&.Mui-selected': {
                  backgroundColor: theme.palette.primary.main + '10',
                  borderRight: `3px solid ${theme.palette.primary.main}`,
                }
              }}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </div>
  );
  
  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar
        position="fixed"
        sx={{
          width: { md: `calc(100% - ${drawerWidth}px)` },
          ml: { md: `${drawerWidth}px` },
          zIndex: theme.zIndex.drawer + 1
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          
          <Typography 
            variant={isMobile ? "h6" : "h5"} 
            noWrap 
            component="div" 
            sx={{ flexGrow: 1 }}
          >
            {isMobile ? 'BCR' : 'Blue Carbon Registry'}
          </Typography>
          
          {/* Wallet connection status - Responsive */}
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: { xs: 0.5, sm: 1 }, 
            mr: { xs: 1, sm: 2 } 
          }}>
            <WalletIcon />
            <Box>
              <Typography variant="body2" sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' } }}>
                {state.walletAddress?.slice(0, isMobile ? 4 : 6)}...{state.walletAddress?.slice(-4)}
              </Typography>
              <Chip 
                label={state.userRole} 
                size="small" 
                color="secondary" 
                sx={{ 
                  height: { xs: 14, sm: 16 }, 
                  fontSize: { xs: '0.55rem', sm: '0.6rem' } 
                }}
              />
            </Box>
          </Box>
          
          {/* Notifications */}
          <IconButton
            color="inherit"
            onClick={handleNotificationClick}
            size={isMobile ? "small" : "medium"}
          >
            <Badge badgeContent={state.notifications.length} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>
          
          {/* User menu */}
          <IconButton
            color="inherit"
            onClick={handleUserMenuClick}
            size={isMobile ? "small" : "medium"}
          >
            <PersonIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      
      {/* Navigation drawer */}
      <Box
        component="nav"
        sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
      >
        {isMobile ? (
          <SwipeableDrawer
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            onOpen={handleDrawerToggle}
            ModalProps={{ keepMounted: true }}
            sx={{
              '& .MuiDrawer-paper': {
                boxSizing: 'border-box',
                width: drawerWidth,
              },
            }}
          >
            {drawer}
          </SwipeableDrawer>
        ) : (
          <Drawer
            variant="permanent"
            sx={{
              '& .MuiDrawer-paper': {
                boxSizing: 'border-box',
                width: drawerWidth,
              },
            }}
            open
          >
            {drawer}
          </Drawer>
        )}
      </Box>
      
      {/* Main content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2, sm: 3 },
          width: { md: `calc(100% - ${drawerWidth}px)` },
          mt: 8,
          mb: { xs: 8, md: 0 } // Add bottom margin for mobile bottom nav
        }}
      >
        <Outlet />
      </Box>
      
      {/* Mobile Bottom Navigation */}
      <BottomNav />
      
      {/* Notification Menu */}
      <Menu
        anchorEl={notificationAnchor}
        open={Boolean(notificationAnchor)}
        onClose={() => setNotificationAnchor(null)}
        PaperProps={{
          sx: { 
            width: { xs: 280, sm: 320 }, 
            maxHeight: 400 
          }
        }}
      >
        {state.notifications.length === 0 ? (
          <MenuItem disabled>
            <Typography variant="body2" color="text.secondary">
              No new notifications
            </Typography>
          </MenuItem>
        ) : (
          state.notifications.map((notification) => (
            <MenuItem
              key={notification.id}
              onClick={() => {
                actions.removeNotification(notification.id);
                setNotificationAnchor(null);
              }}
            >
              <Box>
                <Typography variant="subtitle2">{notification.title}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {notification.message}
                </Typography>
              </Box>
            </MenuItem>
          ))
        )}
      </Menu>
      
      {/* User Menu */}
      <Menu
        anchorEl={userMenuAnchor}
        open={Boolean(userMenuAnchor)}
        onClose={() => setUserMenuAnchor(null)}
      >
        <MenuItem onClick={handleResetDemo}>
          <ListItemIcon>
            <RefreshIcon fontSize="small" />
          </ListItemIcon>
          Reset Demo Data
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <LogoutIcon fontSize="small" />
          </ListItemIcon>
          Disconnect Wallet
        </MenuItem>
      </Menu>
      
      {/* Notification Snackbars */}
      <NotificationSnackbar />
    </Box>
  );
};

export default Layout;
