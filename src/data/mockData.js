// Mock data for the Blue Carbon Registry demo

export const mockProjects = [
  {
    id: 1,
    name: "Sundarbans Mangrove Restoration",
    location: "West Bengal, India",
    description: "Large-scale mangrove restoration project in the Sundarbans delta",
    creditsIssued: 12500,
    status: "Approved",
    verifier: "Global Carbon Verification Ltd.",
    area: "2,500 hectares",
    ecosystem: "Mangroves",
    startDate: "2023-01-15",
    estimatedCredits: 15000,
    imageUrl: "/api/placeholder/400/250"
  },
  {
    id: 2,
    name: "Kerala Coastal Blue Carbon",
    location: "Kerala, India",
    description: "Seagrass bed conservation and restoration along Kerala coast",
    creditsIssued: 8200,
    status: "Pending",
    verifier: "Ocean Conservation Verifiers",
    area: "1,800 hectares",
    ecosystem: "Seagrass",
    startDate: "2023-03-10",
    estimatedCredits: 10000,
    imageUrl: "/api/placeholder/400/250"
  },
  {
    id: 3,
    name: "Tamil Nadu Salt Marsh Protection",
    location: "Tamil Nadu, India",
    description: "Salt marsh ecosystem protection and enhancement project",
    creditsIssued: 6800,
    status: "Approved",
    verifier: "Coastal Ecosystem Validators",
    area: "1,200 hectares",
    ecosystem: "Salt Marsh",
    startDate: "2022-11-20",
    estimatedCredits: 8500,
    imageUrl: "/api/placeholder/400/250"
  },
  {
    id: 4,
    name: "Andaman Coral Reef Restoration",
    location: "Andaman Islands, India",
    description: "Coral reef restoration and blue carbon enhancement project",
    creditsIssued: 4500,
    status: "Rejected",
    verifier: "Marine Biodiversity Certifiers",
    area: "800 hectares",
    ecosystem: "Coral Reef",
    startDate: "2023-05-01",
    estimatedCredits: 6000,
    imageUrl: "/api/placeholder/400/250"
  },
  {
    id: 5,
    name: "Gujarat Mangrove Expansion",
    location: "Gujarat, India",
    description: "Mangrove plantation expansion in Gulf of Kutch",
    creditsIssued: 9200,
    status: "Approved",
    verifier: "Wetland Conservation Authority",
    area: "2,000 hectares",
    ecosystem: "Mangroves",
    startDate: "2023-02-14",
    estimatedCredits: 12000,
    imageUrl: "/api/placeholder/400/250"
  }
];

export const mockCarbonCredits = [
  {
    id: 1,
    tokenId: "BCR-001-2024",
    projectId: 1,
    projectName: "Sundarbans Mangrove Restoration",
    tokenType: "Blue Carbon Credit",
    amount: 1000,
    status: "Active",
    issuedDate: "2024-01-15",
    expiryDate: "2034-01-15",
    verifier: "Global Carbon Verification Ltd.",
    price: 25.50
  },
  {
    id: 2,
    tokenId: "BCR-002-2024",
    projectId: 2,
    projectName: "Kerala Coastal Blue Carbon",
    tokenType: "Blue Carbon Credit",
    amount: 750,
    status: "Active",
    issuedDate: "2024-02-20",
    expiryDate: "2034-02-20",
    verifier: "Ocean Conservation Verifiers",
    price: 22.75
  },
  {
    id: 3,
    tokenId: "BCR-003-2024",
    projectId: 3,
    projectName: "Tamil Nadu Salt Marsh Protection",
    tokenType: "Blue Carbon Credit",
    amount: 500,
    status: "Retired",
    issuedDate: "2024-01-10",
    expiryDate: "2034-01-10",
    verifier: "Coastal Ecosystem Validators",
    price: 20.00
  },
  {
    id: 4,
    tokenId: "BCR-004-2024",
    projectId: 5,
    projectName: "Gujarat Mangrove Expansion",
    tokenType: "Blue Carbon Credit",
    amount: 1250,
    status: "Active",
    issuedDate: "2024-03-05",
    expiryDate: "2034-03-05",
    verifier: "Wetland Conservation Authority",
    price: 28.00
  },
  {
    id: 5,
    tokenId: "BCR-005-2024",
    projectId: 1,
    projectName: "Sundarbans Mangrove Restoration",
    tokenType: "Blue Carbon Credit",
    amount: 800,
    status: "Pending",
    issuedDate: "2024-03-15",
    expiryDate: "2034-03-15",
    verifier: "Global Carbon Verification Ltd.",
    price: 25.50
  }
];

export const mockMRVSubmissions = [
  {
    id: 1,
    projectId: 1,
    projectName: "Sundarbans Mangrove Restoration",
    date: "2024-03-10",
    location: "Sector A-1, Sundarbans",
    files: [
      { name: "vegetation_survey_march.pdf", size: 2.4 },
      { name: "carbon_measurement_data.xlsx", size: 1.8 },
      { name: "site_photos_march.zip", size: 15.2 }
    ],
    status: "Pending",
    submittedBy: "Marine Conservation NGO",
    submittedAt: new Date("2024-03-10T10:30:00")
  },
  {
    id: 2,
    projectId: 2,
    projectName: "Kerala Coastal Blue Carbon",
    date: "2024-03-08",
    location: "Vembanad Lake Region",
    files: [
      { name: "seagrass_monitoring_report.pdf", size: 3.1 },
      { name: "water_quality_data.csv", size: 0.8 }
    ],
    status: "Approved",
    submittedBy: "Coastal Community Group",
    submittedAt: new Date("2024-03-08T14:20:00"),
    approvedBy: "Dr. Sarah Wilson",
    approvedAt: new Date("2024-03-12T09:15:00")
  },
  {
    id: 3,
    projectId: 5,
    projectName: "Gujarat Mangrove Expansion",
    date: "2024-03-05",
    location: "Gulf of Kutch Marine Park",
    files: [
      { name: "drone_survey_results.pdf", size: 5.7 },
      { name: "biomass_calculations.xlsx", size: 2.2 }
    ],
    status: "Rejected",
    submittedBy: "Gujarat Coastal Initiative",
    submittedAt: new Date("2024-03-05T16:45:00"),
    rejectedBy: "Dr. Mike Chen",
    rejectedAt: new Date("2024-03-07T11:30:00"),
    rejectionReason: "Insufficient sampling data for biomass calculations"
  }
];
