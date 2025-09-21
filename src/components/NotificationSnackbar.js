import React from 'react';
import { Snackbar, Alert } from '@mui/material';
import { useApp } from '../context/AppContext';

const NotificationSnackbar = () => {
  const { state, actions } = useApp();
  
  const currentNotification = state.notifications[0];
  
  if (!currentNotification) return null;
  
  return (
    <Snackbar
      open={Boolean(currentNotification)}
      autoHideDuration={5000}
      onClose={() => actions.removeNotification(currentNotification.id)}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
    >
      <Alert
        onClose={() => actions.removeNotification(currentNotification.id)}
        severity={currentNotification.type}
        variant="filled"
        sx={{ width: '100%' }}
      >
        <strong>{currentNotification.title}</strong>
        <br />
        {currentNotification.message}
      </Alert>
    </Snackbar>
  );
};

export default NotificationSnackbar;
