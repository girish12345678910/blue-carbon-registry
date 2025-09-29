import React, { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Avatar,
  Divider,
  Alert,
  Tab,
  Tabs,
  LinearProgress,
  IconButton,
  Tooltip,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  ShoppingCart as ShoppingCartIcon,
  Sell as SellIcon,
  TrendingUp as TrendingUpIcon,
  VerifiedUser as VerifiedIcon,
  LocationOn as LocationIcon,
  CalendarToday as CalendarIcon,
  Business as BusinessIcon,
  Store as StoreIcon,
  Receipt as ReceiptIcon,
  AccountBalance as BankIcon,
  FilterList as FilterIcon,
  Search as SearchIcon
} from '@mui/icons-material';
import { useApp } from '../context/AppContext';

const TabPanel = ({ children, value, index, ...other }) => (
  <div role="tabpanel" hidden={value !== index} {...other}>
    {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
  </div>
);

const Marketplace = () => {
  const { state, actions } = useApp();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [tabValue, setTabValue] = useState(0);
  const [buyDialogOpen, setBuyDialogOpen] = useState(false);
  const [sellDialogOpen, setSellDialogOpen] = useState(false);
  const [selectedListing, setSelectedListing] = useState(null);
  const [buyQuantity, setBuyQuantity] = useState('');
  const [buyerInfo, setBuyerInfo] = useState({
    name: 'Sustainable Corp Ltd.',
    type: 'Technology',
    id: 'corp-' + Date.now()
  });
  
  const [sellForm, setSellForm] = useState({
    projectId: '',
    quantity: '',
    pricePerCredit: '',
    description: ''
  });

  const marketplace = state.marketplace || { listings: [], orders: [], buyers: [] };
  
  // Calculate market stats
  const totalListings = marketplace.listings?.filter(l => l.status === 'active').length || 0;
  const totalCredits = marketplace.listings?.reduce((sum, l) => l.status === 'active' ? sum + l.quantity : sum, 0) || 0;
  const avgPrice = marketplace.listings?.length > 0 
    ? (marketplace.listings.reduce((sum, l) => sum + l.pricePerCredit, 0) / marketplace.listings.length).toFixed(2)
    : 0;
  const totalVolume = marketplace.orders?.reduce((sum, o) => o.status === 'completed' ? sum + o.totalAmount : sum, 0) || 0;

  const handleBuyCredits = () => {
    if (!selectedListing || !buyQuantity || buyQuantity <= 0) return;
    
    const quantity = parseInt(buyQuantity);
    if (quantity > selectedListing.quantity) {
      actions.addNotification({
        type: 'error',
        title: 'Insufficient Credits',
        message: `Only ${selectedListing.quantity} credits available`
      });
      return;
    }
    
    actions.placeBuyOrder(selectedListing.id, quantity, buyerInfo);
    setBuyDialogOpen(false);
    setBuyQuantity('');
    setSelectedListing(null);
  };

  const handleCreateListing = () => {
    const project = state.projects.find(p => p.id === parseInt(sellForm.projectId));
    if (!project || !sellForm.quantity || !sellForm.pricePerCredit) return;
    
    const listingData = {
      sellerId: Date.now(),
      sellerName: 'Current User Organization',
      projectId: project.id,
      projectName: project.name,
      creditType: 'Blue Carbon Credit',
      quantity: parseInt(sellForm.quantity),
      pricePerCredit: parseFloat(sellForm.pricePerCredit),
      totalValue: parseInt(sellForm.quantity) * parseFloat(sellForm.pricePerCredit),
      vintage: new Date().getFullYear(),
      expiryDate: '2034-12-31',
      verifier: project.verifier || 'Certified Verifier',
      location: project.location,
      ecosystem: project.ecosystem || 'Blue Carbon',
      description: sellForm.description || 'High-quality verified carbon credits'
    };
    
    actions.createListing(listingData);
    setSellDialogOpen(false);
    setSellForm({ projectId: '', quantity: '', pricePerCredit: '', description: '' });
  };

  const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0 // Remove decimals for cleaner INR display
  }).format(amount || 0);
};

  const getEcosystemColor = (ecosystem) => {
    switch (ecosystem) {
      case 'Mangroves': return 'success';
      case 'Seagrass': return 'info';
      case 'Salt Marsh': return 'warning';
      default: return 'default';
    }
  };

  return (
    <Box>
      <Typography variant={isMobile ? "h5" : "h4"} gutterBottom fontWeight="bold">
        Carbon Credits Marketplace
      </Typography>
      <Typography variant="body1" color="text.secondary" gutterBottom>
        Buy and sell verified blue carbon credits from certified restoration projects
      </Typography>

      {/* Market Stats */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Avatar sx={{ bgcolor: 'primary.main', mx: 'auto', mb: 1 }}>
                <StoreIcon />
              </Avatar>
              <Typography variant="h5" color="primary" fontWeight="bold">
                {totalListings}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Active Listings
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Avatar sx={{ bgcolor: 'success.main', mx: 'auto', mb: 1 }}>
                <TrendingUpIcon />
              </Avatar>
              <Typography variant="h5" color="success.main" fontWeight="bold">
                {totalCredits.toLocaleString()}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Credits Available
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Avatar sx={{ bgcolor: 'secondary.main', mx: 'auto', mb: 1 }}>
                <BankIcon />
              </Avatar>
              <Typography variant="h5" color="secondary.main" fontWeight="bold">
                ${avgPrice}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Avg Price/Credit
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Avatar sx={{ bgcolor: 'warning.main', mx: 'auto', mb: 1 }}>
                <ReceiptIcon />
              </Avatar>
              <Typography variant="h5" color="warning.main" fontWeight="bold">
                {formatCurrency(totalVolume)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Volume
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Main Content Tabs */}
      <Card>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs 
            value={tabValue} 
            onChange={(e, newValue) => setTabValue(newValue)}
            variant={isMobile ? "fullWidth" : "standard"}
          >
            <Tab label="Browse & Buy" icon={<ShoppingCartIcon />} />
            <Tab label="My Orders" icon={<ReceiptIcon />} />
            <Tab label="Sell Credits" icon={<SellIcon />} />
          </Tabs>
        </Box>

        {/* Browse & Buy Tab */}
        <TabPanel value={tabValue} index={0}>
          <Box display="flex" justifyContent="between" alignItems="center" mb={3}>
            <Typography variant="h6" fontWeight="bold">
              Available Carbon Credits
            </Typography>
            <Button
              variant="contained"
              startIcon={<ShoppingCartIcon />}
              onClick={() => {
                actions.addNotification({
                  type: 'info',
                  title: 'Bulk Purchase',
                  message: 'Contact us for volume discounts on bulk orders'
                });
              }}
            >
              Bulk Purchase
            </Button>
          </Box>

          <Grid container spacing={3}>
            {marketplace.listings?.filter(l => l.status === 'active').map((listing) => (
              <Grid item xs={12} md={6} lg={4} key={listing.id}>
                <Card 
                  sx={{ 
                    height: '100%',
                    transition: 'transform 0.2s',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: 3
                    }
                  }}
                >
                  <CardContent>
                    <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                      <Typography variant="h6" fontWeight="bold">
                        {listing.projectName}
                      </Typography>
                      <Chip
                        label={listing.ecosystem}
                        color={getEcosystemColor(listing.ecosystem)}
                        size="small"
                      />
                    </Box>

                    <Box display="flex" alignItems="center" gap={0.5} mb={1}>
                      <LocationIcon fontSize="small" color="action" />
                      <Typography variant="body2" color="text.secondary">
                        {listing.location}
                      </Typography>
                    </Box>

                    <Box display="flex" alignItems="center" gap={0.5} mb={2}>
                      <VerifiedIcon fontSize="small" color="success" />
                      <Typography variant="body2" color="text.secondary">
                        {listing.verifier}
                      </Typography>
                    </Box>

                    <Typography variant="body2" color="text.secondary" mb={2}>
                      {listing.description}
                    </Typography>

                    <Divider sx={{ my: 2 }} />

                    <Box display="flex" justifyContent="space-between" mb={1}>
                      <Typography variant="body2">Available:</Typography>
                      <Typography variant="body2" fontWeight="bold">
                        {listing.quantity.toLocaleString()} credits
                      </Typography>
                    </Box>

                    <Box display="flex" justifyContent="space-between" mb={1}>
                      <Typography variant="body2">Price per credit:</Typography>
                      <Typography variant="body2" fontWeight="bold" color="primary">
                        {formatCurrency(listing.pricePerCredit)}
                      </Typography>
                    </Box>

                    <Box display="flex" justifyContent="space-between" mb={2}>
                      <Typography variant="body2">Vintage:</Typography>
                      <Typography variant="body2">{listing.vintage}</Typography>
                    </Box>

                    <Button
                      fullWidth
                      variant="contained"
                      startIcon={<ShoppingCartIcon />}
                      onClick={() => {
                        setSelectedListing(listing);
                        setBuyDialogOpen(true);
                      }}
                    >
                      Buy Credits
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </TabPanel>

        {/* My Orders Tab */}
        <TabPanel value={tabValue} index={1}>
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            Purchase History
          </Typography>

          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Order ID</TableCell>
                  <TableCell>Project</TableCell>
                  <TableCell>Quantity</TableCell>
                  <TableCell>Price</TableCell>
                  <TableCell>Total</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Date</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {marketplace.orders?.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell>#{order.id}</TableCell>
                    <TableCell>
                      {marketplace.listings.find(l => l.id === order.listingId)?.projectName || 'Unknown'}
                    </TableCell>
                    <TableCell>{order.quantity.toLocaleString()}</TableCell>
                    <TableCell>{formatCurrency(order.pricePerCredit)}</TableCell>
                    <TableCell fontWeight="bold">{formatCurrency(order.totalAmount)}</TableCell>
                    <TableCell>
                      <Chip
                        label={order.status}
                        color={order.status === 'completed' ? 'success' : 'warning'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{order.orderDate.toLocaleDateString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>

        {/* Sell Credits Tab */}
        <TabPanel value={tabValue} index={2}>
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            List Your Credits for Sale
          </Typography>

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Create New Listing
                  </Typography>

                  <FormControl fullWidth sx={{ mb: 2 }}>
                    <InputLabel>Select Project</InputLabel>
                    <Select
                      value={sellForm.projectId}
                      onChange={(e) => setSellForm({...sellForm, projectId: e.target.value})}
                      label="Select Project"
                    >
                      {state.projects?.filter(p => p.status === 'Approved').map(project => (
                        <MenuItem key={project.id} value={project.id}>
                          {project.name} ({project.creditsIssued} available)
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <TextField
                    fullWidth
                    label="Quantity to Sell"
                    type="number"
                    value={sellForm.quantity}
                    onChange={(e) => setSellForm({...sellForm, quantity: e.target.value})}
                    sx={{ mb: 2 }}
                  />

                  <TextField
  fullWidth
  label="Price per Credit (INR)"
  type="number"
  step="1"
  value={sellForm.pricePerCredit}
  onChange={(e) => setSellForm({...sellForm, pricePerCredit: e.target.value})}
  sx={{ mb: 2 }}
  inputProps={{ min: 100, max: 4150 }} // ₹100 to ₹4,150 range
/>

                  <TextField
                    fullWidth
                    label="Description"
                    multiline
                    rows={3}
                    value={sellForm.description}
                    onChange={(e) => setSellForm({...sellForm, description: e.target.value})}
                    sx={{ mb: 2 }}
                  />

                  <Button
                    fullWidth
                    variant="contained"
                    startIcon={<SellIcon />}
                    onClick={handleCreateListing}
                    disabled={!sellForm.projectId || !sellForm.quantity || !sellForm.pricePerCredit}
                  >
                    List for Sale
                  </Button>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Selling Guidelines
                  </Typography>
                  
                  <Alert severity="info" sx={{ mb: 2 }}>
                    Only verified carbon credits from approved projects can be listed for sale.
                  </Alert>

                  <Typography variant="body2" paragraph>
                    <strong>Requirements:</strong>
                  </Typography>
                  <ul>
                    <li>Project must have "Approved" status</li>
                    <li>Credits must be from certified MRV data</li>
                    <li>Minimum listing: 10 credits</li>
                   <li>Maximum price: ₹4,150 per credit</li>
                  </ul>

                  <Typography variant="body2" paragraph>
                    <strong>Transaction Process:</strong>
                  </Typography>
                  <ol>
                    <li>Create listing with your available credits</li>
                    <li>Buyers place orders through escrow system</li>
                    <li>Smart contract handles secure transfer</li>
                    <li>Funds released upon delivery confirmation</li>
                  </ol>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>
      </Card>

      {/* Buy Dialog */}
      <Dialog open={buyDialogOpen} onClose={() => setBuyDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Purchase Carbon Credits</DialogTitle>
        <DialogContent>
          {selectedListing && (
            <Box>
              <Typography variant="h6" gutterBottom>
                {selectedListing.projectName}
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                {selectedListing.description}
              </Typography>
              
              <Box display="flex" justifyContent="space-between" mb={1}>
                <Typography>Available Credits:</Typography>
                <Typography fontWeight="bold">{selectedListing.quantity.toLocaleString()}</Typography>
              </Box>
              
              <Box display="flex" justifyContent="space-between" mb={2}>
                <Typography>Price per Credit:</Typography>
                <Typography fontWeight="bold">{formatCurrency(selectedListing.pricePerCredit)}</Typography>
              </Box>
              
              <TextField
                fullWidth
                label="Quantity to Purchase"
                type="number"
                value={buyQuantity}
                onChange={(e) => setBuyQuantity(e.target.value)}
                sx={{ mb: 2 }}
                inputProps={{ max: selectedListing.quantity, min: 1 }}
              />
              
              {buyQuantity && (
                <Alert severity="info">
                  Total Cost: {formatCurrency(buyQuantity * selectedListing.pricePerCredit)}
                </Alert>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setBuyDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleBuyCredits} variant="contained">
            Place Order
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Marketplace;
