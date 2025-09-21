import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { mockProjects, mockCarbonCredits, mockMRVSubmissions } from '../data/mockData';

// Initial state with all mock data
const initialState = {
  // User authentication state
  isConnected: false,
  walletAddress: null,
  userRole: null, // 'NGO', 'Community', 'Admin'
  
  // App data
  projects: mockProjects,
  carbonCredits: mockCarbonCredits,
  mrvSubmissions: mockMRVSubmissions,
  
  // Notifications
  notifications: [],
  
  // Activity feed
  activities: [
    {
      id: 1,
      type: 'project_created',
      title: 'New Mangrove Project Created',
      description: 'Sundarbans Restoration Phase II has been added to the registry',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      user: 'Marine Conservation NGO'
    },
    {
      id: 2,
      type: 'mrv_submitted',
      title: 'MRV Data Submitted',
      description: 'Monthly monitoring data uploaded for Kerala Coastal Project',
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
      user: 'Coastal Community Group'
    }
  ]
};

// Action types
const ActionTypes = {
  CONNECT_WALLET: 'CONNECT_WALLET',
  DISCONNECT_WALLET: 'DISCONNECT_WALLET',
  SET_USER_ROLE: 'SET_USER_ROLE',
  SUBMIT_MRV_DATA: 'SUBMIT_MRV_DATA',
  APPROVE_MRV: 'APPROVE_MRV',
  REJECT_MRV: 'REJECT_MRV',
  RETIRE_CREDIT: 'RETIRE_CREDIT',
  ADD_NOTIFICATION: 'ADD_NOTIFICATION',
  REMOVE_NOTIFICATION: 'REMOVE_NOTIFICATION',
  ADD_ACTIVITY: 'ADD_ACTIVITY',
  RESET_DEMO: 'RESET_DEMO'
};

// Reducer function
function appReducer(state, action) {
  switch (action.type) {
    case ActionTypes.CONNECT_WALLET:
      return {
        ...state,
        isConnected: true,
        walletAddress: action.payload.address,
        userRole: action.payload.role
      };
      
    case ActionTypes.DISCONNECT_WALLET:
      return {
        ...state,
        isConnected: false,
        walletAddress: null,
        userRole: null
      };
      
    case ActionTypes.SET_USER_ROLE:
      return {
        ...state,
        userRole: action.payload
      };
      
    case ActionTypes.SUBMIT_MRV_DATA:
      const newSubmission = {
        id: Date.now(),
        projectId: action.payload.projectId,
        projectName: state.projects.find(p => p.id === action.payload.projectId)?.name || 'Unknown Project',
        date: action.payload.date,
        location: action.payload.location,
        files: action.payload.files,
        status: 'Pending',
        submittedBy: 'Current User',
        submittedAt: new Date()
      };
      
      return {
        ...state,
        mrvSubmissions: [...state.mrvSubmissions, newSubmission],
        activities: [{
          id: Date.now(),
          type: 'mrv_submitted',
          title: 'MRV Data Submitted',
          description: `New monitoring data uploaded for ${newSubmission.projectName}`,
          timestamp: new Date(),
          user: 'You'
        }, ...state.activities]
      };
      
    case ActionTypes.APPROVE_MRV:
      return {
        ...state,
        mrvSubmissions: state.mrvSubmissions.map(sub =>
          sub.id === action.payload.id
            ? { ...sub, status: 'Approved', approvedBy: 'Admin', approvedAt: new Date() }
            : sub
        ),
        projects: state.projects.map(project => {
          const submission = state.mrvSubmissions.find(sub => sub.id === action.payload.id);
          if (submission && project.id === submission.projectId) {
            return { ...project, status: 'Approved' };
          }
          return project;
        }),
        activities: [{
          id: Date.now(),
          type: 'mrv_approved',
          title: 'MRV Data Approved',
          description: `Monitoring data approved for submission #${action.payload.id}`,
          timestamp: new Date(),
          user: 'Admin'
        }, ...state.activities]
      };
      
    case ActionTypes.REJECT_MRV:
      return {
        ...state,
        mrvSubmissions: state.mrvSubmissions.map(sub =>
          sub.id === action.payload.id
            ? { ...sub, status: 'Rejected', rejectedBy: 'Admin', rejectedAt: new Date() }
            : sub
        ),
        activities: [{
          id: Date.now(),
          type: 'mrv_rejected',
          title: 'MRV Data Rejected',
          description: `Monitoring data rejected for submission #${action.payload.id}`,
          timestamp: new Date(),
          user: 'Admin'
        }, ...state.activities]
      };
      
    case ActionTypes.RETIRE_CREDIT:
      return {
        ...state,
        carbonCredits: state.carbonCredits.map(credit =>
          credit.id === action.payload.id
            ? { ...credit, status: 'Retired', retiredAt: new Date() }
            : credit
        ),
        activities: [{
          id: Date.now(),
          type: 'credit_retired',
          title: 'Carbon Credit Retired',
          description: `${action.payload.amount} credits retired from ${action.payload.projectName}`,
          timestamp: new Date(),
          user: 'You'
        }, ...state.activities]
      };
      
    case ActionTypes.ADD_NOTIFICATION:
      return {
        ...state,
        notifications: [...state.notifications, {
          id: Date.now(),
          ...action.payload,
          timestamp: new Date()
        }]
      };
      
    case ActionTypes.REMOVE_NOTIFICATION:
      return {
        ...state,
        notifications: state.notifications.filter(n => n.id !== action.payload)
      };
      
    case ActionTypes.ADD_ACTIVITY:
      return {
        ...state,
        activities: [action.payload, ...state.activities]
      };
      
    case ActionTypes.RESET_DEMO:
      return initialState;
      
    default:
      return state;
  }
}

// Create context
const AppContext = createContext();

// Provider component
export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);
  
  // Auto-remove notifications after 5 seconds
  useEffect(() => {
    if (state.notifications.length > 0) {
      const timer = setTimeout(() => {
        dispatch({
          type: ActionTypes.REMOVE_NOTIFICATION,
          payload: state.notifications[0].id
        });
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [state.notifications]);
  
  const actions = {
    connectWallet: (address, role) => {
      dispatch({
        type: ActionTypes.CONNECT_WALLET,
        payload: { address, role }
      });
    },
    
    disconnectWallet: () => {
      dispatch({ type: ActionTypes.DISCONNECT_WALLET });
    },
    
    setUserRole: (role) => {
      dispatch({
        type: ActionTypes.SET_USER_ROLE,
        payload: role
      });
    },
    
    submitMRVData: (data) => {
      dispatch({
        type: ActionTypes.SUBMIT_MRV_DATA,
        payload: data
      });
      
      // Add success notification
      dispatch({
        type: ActionTypes.ADD_NOTIFICATION,
        payload: {
          type: 'success',
          title: 'MRV Data Submitted',
          message: 'Your monitoring data has been successfully uploaded and is pending review.'
        }
      });
    },
    
    approveMRV: (id) => {
      dispatch({
        type: ActionTypes.APPROVE_MRV,
        payload: { id }
      });
      
      dispatch({
        type: ActionTypes.ADD_NOTIFICATION,
        payload: {
          type: 'success',
          title: 'MRV Approved',
          message: 'Monitoring data has been approved and credits will be issued.'
        }
      });
    },
    
    rejectMRV: (id) => {
      dispatch({
        type: ActionTypes.REJECT_MRV,
        payload: { id }
      });
      
      dispatch({
        type: ActionTypes.ADD_NOTIFICATION,
        payload: {
          type: 'error',
          title: 'MRV Rejected',
          message: 'Monitoring data has been rejected. Please review and resubmit.'
        }
      });
    },
    
    retireCredit: (id, amount, projectName) => {
      dispatch({
        type: ActionTypes.RETIRE_CREDIT,
        payload: { id, amount, projectName }
      });
      
      dispatch({
        type: ActionTypes.ADD_NOTIFICATION,
        payload: {
          type: 'info',
          title: 'Credit Retired',
          message: `${amount} carbon credits have been permanently retired.`
        }
      });
    },
    
    addNotification: (notification) => {
      dispatch({
        type: ActionTypes.ADD_NOTIFICATION,
        payload: notification
      });
    },
    
    removeNotification: (id) => {
      dispatch({
        type: ActionTypes.REMOVE_NOTIFICATION,
        payload: id
      });
    },
    
    resetDemo: () => {
      dispatch({ type: ActionTypes.RESET_DEMO });
    }
  };
  
  return (
    <AppContext.Provider value={{ state, actions }}>
      {children}
    </AppContext.Provider>
  );
}

// Custom hook to use the context
export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
