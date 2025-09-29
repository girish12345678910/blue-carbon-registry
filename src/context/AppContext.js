import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { mockProjects, mockCarbonCredits, mockMRVSubmissions } from '../data/mockData';

// ---------- Helpers ----------
const rand = (min, max) => +(min + Math.random() * (max - min)).toFixed(2);

// Simple sequestration estimator (shared with Sensors page)
export const estimateSequestration = ({ temp, dox, soilC, sal }) => {
  const k = 0.0025;
  const tempFactor = Math.max(0.6, Math.min(1.4, 1 + (temp - 26) * 0.02));
  const doFactor = Math.max(0.7, Math.min(1.3, 0.8 + dox * 0.05));
  const soilFactor = 0.5 + soilC * 0.1;
  const salPenalty = Math.max(0.75, 1 - Math.abs(sal - 28) * 0.01);
  return +(k * tempFactor * doFactor * soilFactor * salPenalty).toFixed(4);
};

// ---------- Initial State ----------
const initialState = {
  // Auth
  isConnected: false,
  walletAddress: null,
  userRole: null, // 'NGO', 'Community', 'Admin'

  // Data
  projects: mockProjects,
  carbonCredits: mockCarbonCredits,
  mrvSubmissions: mockMRVSubmissions,

  // Notifications
  notifications: [],

  // Activities
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
  ],

  // Sensors
  sensors: {
    1: { enabled: true, lastSeen: new Date(), battery: 86, deviceId: 'SND-001-A' },
    2: { enabled: true, lastSeen: new Date(), battery: 73, deviceId: 'KRL-014-B' },
    3: { enabled: false, lastSeen: null, battery: null, deviceId: 'TNM-203-C' },
    4: { enabled: true, lastSeen: new Date(), battery: 62, deviceId: 'AND-077-D' },
    5: { enabled: true, lastSeen: new Date(), battery: 91, deviceId: 'GUJ-311-E' }
  },
  sensorStreams: {
    1: [],
    2: [],
    3: [],
    4: [],
    5: []
  },

  // Marketplace (Updated with INR prices)
  marketplace: {
    listings: [
      {
        id: 1,
        sellerId: 1,
        sellerName: 'Marine Conservation NGO',
        projectId: 1,
        projectName: 'Sundarbans Mangrove Restoration',
        creditType: 'Blue Carbon Credit',
        quantity: 1500,
        pricePerCredit: 2365, // ₹2,365
        totalValue: 3547500, // ₹35,47,500
        vintage: 2024,
        status: 'active',
        expiryDate: '2034-01-15',
        verifier: 'Global Carbon Verification Ltd.',
        location: 'West Bengal, India',
        ecosystem: 'Mangroves',
        listedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        description: 'Premium blue carbon credits from certified mangrove restoration project'
      },
      {
        id: 2,
        sellerId: 2,
        sellerName: 'Coastal Community Group',
        projectId: 2,
        projectName: 'Kerala Coastal Blue Carbon',
        creditType: 'Blue Carbon Credit',
        quantity: 800,
        pricePerCredit: 2137, // ₹2,137
        totalValue: 1709600, // ₹17,09,600
        vintage: 2024,
        status: 'active',
        expiryDate: '2034-02-20',
        verifier: 'Ocean Conservation Verifiers',
        location: 'Kerala, India',
        ecosystem: 'Seagrass',
        listedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        description: 'High-quality seagrass restoration credits with co-benefits'
      },
      {
        id: 3,
        sellerId: 3,
        sellerName: 'Gujarat Coastal Initiative',
        projectId: 5,
        projectName: 'Gujarat Mangrove Expansion',
        creditType: 'Blue Carbon Credit',
        quantity: 2200,
        pricePerCredit: 2490, // ₹2,490
        totalValue: 5478000, // ₹54,78,000
        vintage: 2024,
        status: 'active',
        expiryDate: '2034-03-05',
        verifier: 'Wetland Conservation Authority',
        location: 'Gujarat, India',
        ecosystem: 'Mangroves',
        listedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        description: 'Premium credits from large-scale mangrove plantation'
      }
    ],
    orders: [
      {
        id: 1,
        buyerId: 'corp-001',
        buyerName: 'Tech Solutions Inc.',
        listingId: 1,
        quantity: 500,
        pricePerCredit: 2365,
        totalAmount: 1182500, // ₹11,82,500
        status: 'completed',
        orderDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        completedDate: new Date(Date.now() - 23 * 60 * 60 * 1000)
      },
      {
        id: 2,
        buyerId: 'corp-002',
        buyerName: 'Green Manufacturing Ltd.',
        listingId: 2,
        quantity: 300,
        pricePerCredit: 2137,
        totalAmount: 641100, // ₹6,41,100
        status: 'pending',
        orderDate: new Date(Date.now() - 2 * 60 * 60 * 1000)
      }
    ],
    buyers: [
      {
        id: 'corp-001',
        name: 'Tech Solutions Inc.',
        type: 'Technology',
        size: 'Large Enterprise',
        carbonFootprint: 15000,
        offsetGoal: 20,
        wallet: '0x1a2b3c4d5e6f7890abcdef1234567890abcdef12'
      },
      {
        id: 'corp-002',
        name: 'Green Manufacturing Ltd.',
        type: 'Manufacturing',
        size: 'Medium Enterprise',
        carbonFootprint: 8500,
        offsetGoal: 15,
        wallet: '0x2b3c4d5e6f7890abcdef1234567890abcdef1234'
      }
    ]
  },

  // Geographic Data for Satellite Mapping (NEW)
  geographicData: {
    projects: {
      1: { // Sundarbans Mangrove Restoration
        coordinates: [21.9497, 88.2519], // West Bengal, India
        bounds: [[21.9297, 88.2319], [21.9697, 88.2719]],
        area: 1250, // hectares
        ecosystem: 'Mangroves',
        beforeImage: 'https://images.unsplash.com/photo-1534536281715-e28d76689b4d?w=400&h=300&fit=crop', // Degraded coastal area
        afterImage: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop', // Lush mangrove forest
        growthData: [
          { date: '2024-01-01', coverage: 15, biomass: 12.5, co2Sequestered: 125 },
          { date: '2024-04-01', coverage: 25, biomass: 18.2, co2Sequestered: 182 },
          { date: '2024-07-01', coverage: 40, biomass: 28.7, co2Sequestered: 287 },
          { date: '2024-10-01', coverage: 65, biomass: 45.3, co2Sequestered: 453 }
        ]
      },
      2: { // Kerala Coastal Blue Carbon
        coordinates: [8.5241, 76.9366], // Kerala Coast
        bounds: [[8.5041, 76.9166], [8.5441, 76.9566]],
        area: 850,
        ecosystem: 'Seagrass',
        beforeImage: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop', // Barren seabed
        afterImage: 'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=400&h=300&fit=crop', // Vibrant seagrass beds
        growthData: [
          { date: '2024-01-01', coverage: 20, biomass: 15.8, co2Sequestered: 158 },
          { date: '2024-04-01', coverage: 32, biomass: 22.4, co2Sequestered: 224 },
          { date: '2024-07-01', coverage: 48, biomass: 35.1, co2Sequestered: 351 },
          { date: '2024-10-01', coverage: 70, biomass: 52.7, co2Sequestered: 527 }
        ]
      },
      3: { // Tamil Nadu Salt Marsh Protection
        coordinates: [10.7905, 79.1378], // Tamil Nadu
        bounds: [[10.7705, 79.1178], [10.8105, 79.1578]],
        area: 650,
        ecosystem: 'Salt Marsh',
        beforeImage: 'https://images.unsplash.com/photo-1615729947596-a598e5de0ab3?w=400&h=300&fit=crop', // Eroded coastline
        afterImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop', // Protected salt marsh
        growthData: [
          { date: '2024-01-01', coverage: 10, biomass: 8.2, co2Sequestered: 82 },
          { date: '2024-04-01', coverage: 18, biomass: 14.6, co2Sequestered: 146 },
          { date: '2024-07-01', coverage: 35, biomass: 26.8, co2Sequestered: 268 },
          { date: '2024-10-01', coverage: 55, biomass: 41.2, co2Sequestered: 412 }
        ]
      },
      4: { // Andhra Pradesh Coastal Restoration
        coordinates: [15.9129, 79.7400], // Andhra Pradesh Coast
        bounds: [[15.8929, 79.7200], [15.9329, 79.7600]],
        area: 1100,
        ecosystem: 'Mixed Coastal',
        beforeImage: 'https://images.unsplash.com/photo-1582739448916-2d6b37f7f440?w=400&h=300&fit=crop', // Degraded coastline
        afterImage: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop', // Restored coastal ecosystem
        growthData: [
          { date: '2024-01-01', coverage: 12, biomass: 9.8, co2Sequestered: 98 },
          { date: '2024-04-01', coverage: 22, biomass: 17.3, co2Sequestered: 173 },
          { date: '2024-07-01', coverage: 38, biomass: 29.5, co2Sequestered: 295 },
          { date: '2024-10-01', coverage: 60, biomass: 47.1, co2Sequestered: 471 }
        ]
      },
      5: { // Gujarat Mangrove Expansion
        coordinates: [21.1702, 72.8311], // Gujarat Coast
        bounds: [[21.1502, 72.8111], [21.1902, 72.8511]],
        area: 1800,
        ecosystem: 'Mangroves',
        beforeImage: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop', // Bare mudflats
        afterImage: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=400&h=300&fit=crop', // Dense mangrove plantation
        growthData: [
          { date: '2024-01-01', coverage: 18, biomass: 14.2, co2Sequestered: 142 },
          { date: '2024-04-01', coverage: 30, biomass: 23.7, co2Sequestered: 237 },
          { date: '2024-07-01', coverage: 50, biomass: 38.9, co2Sequestered: 389 },
          { date: '2024-10-01', coverage: 75, biomass: 58.4, co2Sequestered: 584 }
        ]
      }
    },
    
    // Overall statistics
    totalArea: 5650, // hectares
    totalCO2Sequestered: 2472, // tons CO2e
    averageCoverage: 45.4, // percentage
    ecosystemDistribution: {
      'Mangroves': 54, // percentage
      'Seagrass': 23,
      'Salt Marsh': 15,
      'Mixed Coastal': 8
    }
  }
};

// ---------- Action Types ----------
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

  // Sensors
  TOGGLE_SENSOR: 'TOGGLE_SENSOR',
  PUSH_SENSOR_SAMPLE: 'PUSH_SENSOR_SAMPLE',

  // Marketplace
  PLACE_BUY_ORDER: 'PLACE_BUY_ORDER',
  CREATE_LISTING: 'CREATE_LISTING',
  UPDATE_LISTING_STATUS: 'UPDATE_LISTING_STATUS',
  COMPLETE_ORDER: 'COMPLETE_ORDER',

  // Satellite/Geographic (NEW)
  UPDATE_PROJECT_COVERAGE: 'UPDATE_PROJECT_COVERAGE',
  ADD_SATELLITE_DATA: 'ADD_SATELLITE_DATA',

  RESET_DEMO: 'RESET_DEMO'
};

// ---------- Reducer ----------
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
      return { ...state, userRole: action.payload };

    case ActionTypes.SUBMIT_MRV_DATA: {
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
    }

    case ActionTypes.APPROVE_MRV: {
      const approvedSubmission = state.mrvSubmissions.find(sub => sub.id === action.payload.id);
      const updatedSubmissions = state.mrvSubmissions.map(sub =>
        sub.id === action.payload.id
          ? { ...sub, status: 'Approved', approvedBy: 'Admin', approvedAt: new Date() }
          : sub
      );

      const CREDIT_ISSUED_ON_APPROVAL = 500;
      const updatedProjects = state.projects.map(project => {
        if (approvedSubmission && project.id === approvedSubmission.projectId) {
          return {
            ...project,
            status: 'Approved',
            creditsIssued: (project.creditsIssued || 0) + CREDIT_ISSUED_ON_APPROVAL,
            updatedAt: new Date()
          };
        }
        return project;
      });

      const newCredit = approvedSubmission ? {
        id: Date.now(),
        tokenId: `BCR-${String(Date.now()).slice(-6)}-2025`,
        projectId: approvedSubmission.projectId,
        projectName: approvedSubmission.projectName,
        tokenType: 'Blue Carbon Credit',
        amount: CREDIT_ISSUED_ON_APPROVAL,
        status: 'Active',
        issuedDate: new Date().toISOString().split('T')[0],
        expiryDate: new Date(Date.now() + 10 * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        verifier: 'Admin Verifier',
        price: 2075 // ₹2,075 (was $25.00)
      } : null;

      return {
        ...state,
        mrvSubmissions: updatedSubmissions,
        projects: updatedProjects,
        carbonCredits: newCredit ? [...state.carbonCredits, newCredit] : state.carbonCredits,
        activities: [{
          id: Date.now(),
          type: 'mrv_approved',
          title: 'MRV Approved & Credits Issued',
          description: `Approved ${approvedSubmission?.projectName} — ${CREDIT_ISSUED_ON_APPROVAL} credits issued`,
          timestamp: new Date(),
          user: 'Admin'
        }, ...state.activities]
      };
    }

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
      return { ...state, activities: [action.payload, ...state.activities] };

    // ----- Sensors -----
    case ActionTypes.TOGGLE_SENSOR:
      return {
        ...state,
        sensors: {
          ...state.sensors,
          [action.payload.projectId]: {
            ...(state.sensors[action.payload.projectId] || {}),
            enabled: action.payload.enabled,
            lastSeen: action.payload.enabled ? new Date() : state.sensors[action.payload.projectId]?.lastSeen,
            battery: state.sensors[action.payload.projectId]?.battery ?? 80
          }
        }
      };

    case ActionTypes.PUSH_SENSOR_SAMPLE: {
      const { projectId, sample } = action.payload;
      const prev = state.sensorStreams[projectId] || [];
      const next = [...prev, sample].slice(-180);
      return {
        ...state,
        sensorStreams: { ...state.sensorStreams, [projectId]: next },
        sensors: {
          ...state.sensors,
          [projectId]: {
            ...(state.sensors[projectId] || {}),
            lastSeen: new Date(),
            battery: Math.max(5, (state.sensors[projectId]?.battery ?? 90) - 0.002)
          }
        }
      };
    }

    // ----- Marketplace -----
    case ActionTypes.PLACE_BUY_ORDER: {
      const { listingId, quantity, buyerInfo } = action.payload;
      const listing = state.marketplace.listings.find(l => l.id === listingId);
      
      if (!listing || listing.quantity < quantity) {
        return state;
      }

      const newOrder = {
        id: Date.now(),
        buyerId: buyerInfo.id,
        buyerName: buyerInfo.name,
        listingId,
        quantity,
        pricePerCredit: listing.pricePerCredit,
        totalAmount: quantity * listing.pricePerCredit,
        status: 'pending',
        orderDate: new Date()
      };

      return {
        ...state,
        marketplace: {
          ...state.marketplace,
          orders: [...state.marketplace.orders, newOrder],
          listings: state.marketplace.listings.map(l =>
            l.id === listingId
              ? { ...l, quantity: l.quantity - quantity }
              : l
          )
        },
        activities: [{
          id: Date.now(),
          type: 'order_placed',
          title: 'Carbon Credits Purchase Order',
          description: `${buyerInfo.name} placed order for ${quantity} credits from ${listing.projectName}`,
          timestamp: new Date(),
          user: buyerInfo.name
        }, ...state.activities]
      };
    }

    case ActionTypes.CREATE_LISTING: {
      const newListing = {
        id: Date.now(),
        ...action.payload,
        status: 'active',
        listedAt: new Date()
      };

      return {
        ...state,
        marketplace: {
          ...state.marketplace,
          listings: [...state.marketplace.listings, newListing]
        },
        activities: [{
          id: Date.now(),
          type: 'listing_created',
          title: 'New Credits Listed',
          description: `${action.payload.sellerName} listed ${action.payload.quantity} credits for sale`,
          timestamp: new Date(),
          user: action.payload.sellerName
        }, ...state.activities]
      };
    }

    case ActionTypes.COMPLETE_ORDER: {
      const orderId = action.payload;
      
      return {
        ...state,
        marketplace: {
          ...state.marketplace,
          orders: state.marketplace.orders.map(order =>
            order.id === orderId
              ? { ...order, status: 'completed', completedDate: new Date() }
              : order
          )
        },
        activities: [{
          id: Date.now(),
          type: 'order_completed',
          title: 'Purchase Completed',
          description: `Carbon credits purchase order #${orderId} has been completed`,
          timestamp: new Date(),
          user: 'System'
        }, ...state.activities]
      };
    }

    // ----- Satellite/Geographic (NEW) -----
    case ActionTypes.UPDATE_PROJECT_COVERAGE: {
      const { projectId, coverage, biomass } = action.payload;
      return {
        ...state,
        geographicData: {
          ...state.geographicData,
          projects: {
            ...state.geographicData.projects,
            [projectId]: {
              ...state.geographicData.projects[projectId],
              growthData: [
                ...state.geographicData.projects[projectId].growthData,
                {
                  date: new Date().toISOString().split('T')[0],
                  coverage,
                  biomass,
                  co2Sequestered: biomass * 10 // Simple calculation
                }
              ]
            }
          }
        }
      };
    }

    case ActionTypes.RESET_DEMO:
      return initialState;

    default:
      return state;
  }
}

// ---------- Context ----------
const AppContext = createContext();

// ---------- Provider ----------
export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

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
    // Auth
    connectWallet: (address, role) => {
      dispatch({ type: ActionTypes.CONNECT_WALLET, payload: { address, role } });
    },
    disconnectWallet: () => dispatch({ type: ActionTypes.DISCONNECT_WALLET }),
    setUserRole: (role) => dispatch({ type: ActionTypes.SET_USER_ROLE, payload: role }),

    // MRV
    submitMRVData: (data) => {
      dispatch({ type: ActionTypes.SUBMIT_MRV_DATA, payload: data });
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
      dispatch({ type: ActionTypes.APPROVE_MRV, payload: { id } });
      dispatch({
        type: ActionTypes.ADD_NOTIFICATION,
        payload: {
          type: 'success',
          title: 'MRV Approved & Credits Issued',
          message: 'Monitoring data approved. Credits have been issued and dashboard updated.'
        }
      });
    },
    rejectMRV: (id) => {
      dispatch({ type: ActionTypes.REJECT_MRV, payload: { id } });
      dispatch({
        type: ActionTypes.ADD_NOTIFICATION,
        payload: {
          type: 'error',
          title: 'MRV Rejected',
          message: 'Monitoring data has been rejected. Please review and resubmit.'
        }
      });
    },

    // Credits
    retireCredit: (id, amount, projectName) => {
      dispatch({ type: ActionTypes.RETIRE_CREDIT, payload: { id, amount, projectName } });
      dispatch({
        type: ActionTypes.ADD_NOTIFICATION,
        payload: {
          type: 'info',
          title: 'Credit Retired',
          message: `${amount} carbon credits have been permanently retired.`
        }
      });
    },

    // Notifications / Activity
    addNotification: (notification) => dispatch({ type: ActionTypes.ADD_NOTIFICATION, payload: notification }),
    removeNotification: (id) => dispatch({ type: ActionTypes.REMOVE_NOTIFICATION, payload: id }),
    addActivity: (activity) => dispatch({ type: ActionTypes.ADD_ACTIVITY, payload: activity }),

    // Sensors
    toggleSensor: (projectId, enabled) => dispatch({ type: ActionTypes.TOGGLE_SENSOR, payload: { projectId, enabled } }),
    pushSensorSample: (projectId, sample) => dispatch({ type: ActionTypes.PUSH_SENSOR_SAMPLE, payload: { projectId, sample } }),

    // Marketplace
    placeBuyOrder: (listingId, quantity, buyerInfo) => {
      dispatch({
        type: ActionTypes.PLACE_BUY_ORDER,
        payload: { listingId, quantity, buyerInfo }
      });
      
      dispatch({
        type: ActionTypes.ADD_NOTIFICATION,
        payload: {
          type: 'success',
          title: 'Order Placed',
          message: `Successfully placed order for ${quantity} carbon credits`
        }
      });
    },

    createListing: (listingData) => {
      dispatch({
        type: ActionTypes.CREATE_LISTING,
        payload: listingData
      });
      
      dispatch({
        type: ActionTypes.ADD_NOTIFICATION,
        payload: {
          type: 'success',
          title: 'Listing Created',
          message: 'Your carbon credits are now available for purchase'
        }
      });
    },

    completeOrder: (orderId) => {
      dispatch({
        type: ActionTypes.COMPLETE_ORDER,
        payload: orderId
      });
      
      dispatch({
        type: ActionTypes.ADD_NOTIFICATION,
        payload: {
          type: 'success',
          title: 'Transaction Complete',
          message: 'Carbon credits have been transferred to buyer'
        }
      });
    },

    // Satellite/Geographic (NEW)
    updateProjectCoverage: (projectId, coverage, biomass) => {
      dispatch({
        type: ActionTypes.UPDATE_PROJECT_COVERAGE,
        payload: { projectId, coverage, biomass }
      });
    },

    // Demo
    resetDemo: () => dispatch({ type: ActionTypes.RESET_DEMO })
  };

  return (
    <AppContext.Provider value={{ state, actions }}>
      {children}
    </AppContext.Provider>
  );
}

// ---------- Hook ----------
export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
