// Mock data for Manufacturing Operations Platform
// Expanded with more plants, suppliers, and detailed metrics

export const plants = [
  { id: 'plant-a', name: 'Plant A', region: 'North', country: 'USA', city: 'Detroit' },
  { id: 'plant-b', name: 'Plant B', region: 'South', country: 'USA', city: 'Austin' },
  { id: 'plant-c', name: 'Plant C', region: 'West', country: 'USA', city: 'Fremont' },
  { id: 'plant-d', name: 'Plant D', region: 'East', country: 'USA', city: 'Charlotte' },
  { id: 'plant-e', name: 'Plant E', region: 'Central', country: 'Mexico', city: 'Monterrey' },
  { id: 'plant-f', name: 'Plant F', region: 'Europe', country: 'Germany', city: 'Munich' },
];

// NPI Programs - 8 programs
export const npiPrograms = [
  {
    id: 'prog-001',
    name: 'Vehicle Refresh 2026',
    code: 'VR-26',
    phase: 'pre-production',
    sopDate: '2026-06-15',
    daysToSOP: 84,
    budget: 125000000,
    spent: 98000000,
    readiness: { engineering: 100, manufacturing: 78, supplyChain: 85, quality: 92 },
    overallReadiness: 89,
    status: 'on-track',
    risks: [
      { id: 'r1', severity: 'high', category: 'supply', description: 'Battery supplier 3-week delay', owner: 'Supply Chain', dueDate: '2026-04-01' },
      { id: 'r2', severity: 'medium', category: 'manufacturing', description: 'Tooling validation pending', owner: 'Manufacturing', dueDate: '2026-04-15' }
    ],
    milestones: [
      { name: 'Concept Approval', date: '2025-06-15', status: 'complete' },
      { name: 'Design Freeze', date: '2025-12-01', status: 'complete' },
      { name: 'PPAP Approval', date: '2026-02-15', status: 'complete' },
      { name: 'Line Trial', date: '2026-04-15', status: 'in-progress' },
      { name: 'Pilot Build', date: '2026-05-15', status: 'pending' },
      { name: 'SOP', date: '2026-06-15', status: 'pending' }
    ]
  },
  {
    id: 'prog-002',
    name: 'EV Powertrain Gen 3',
    code: 'EP-G3',
    phase: 'validation',
    sopDate: '2026-09-01',
    daysToSOP: 162,
    budget: 280000000,
    spent: 145000000,
    readiness: { engineering: 85, manufacturing: 45, supplyChain: 62, quality: 70 },
    overallReadiness: 66,
    status: 'at-risk',
    risks: [
      { id: 'r3', severity: 'high', category: 'engineering', description: 'Thermal management redesign required', owner: 'Engineering', dueDate: '2026-04-30' },
      { id: 'r4', severity: 'high', category: 'supply', description: 'Semiconductor shortage risk', owner: 'Supply Chain', dueDate: '2026-05-15' },
      { id: 'r5', severity: 'medium', category: 'quality', description: 'Durability test failures', owner: 'Quality', dueDate: '2026-04-20' }
    ],
    milestones: [
      { name: 'Concept Approval', date: '2025-09-01', status: 'complete' },
      { name: 'Design Freeze', date: '2026-02-01', status: 'complete' },
      { name: 'Prototype Build', date: '2026-03-15', status: 'in-progress' },
      { name: 'Validation Complete', date: '2026-06-01', status: 'pending' },
      { name: 'PPAP Approval', date: '2026-07-15', status: 'pending' },
      { name: 'SOP', date: '2026-09-01', status: 'pending' }
    ]
  },
  {
    id: 'prog-003',
    name: 'Compact SUV Platform',
    code: 'CS-PLT',
    phase: 'design',
    sopDate: '2027-03-01',
    daysToSOP: 343,
    budget: 450000000,
    spent: 112000000,
    readiness: { engineering: 62, manufacturing: 25, supplyChain: 30, quality: 40 },
    overallReadiness: 39,
    status: 'on-track',
    risks: [
      { id: 'r6', severity: 'low', category: 'supply', description: 'New supplier qualification needed', owner: 'Supply Chain', dueDate: '2026-08-01' }
    ],
    milestones: [
      { name: 'Concept Approval', date: '2025-12-01', status: 'complete' },
      { name: 'Architecture Freeze', date: '2026-03-01', status: 'in-progress' },
      { name: 'Design Freeze', date: '2026-08-01', status: 'pending' },
      { name: 'Prototype Build', date: '2026-11-01', status: 'pending' },
      { name: 'Validation Complete', date: '2027-01-15', status: 'pending' },
      { name: 'SOP', date: '2027-03-01', status: 'pending' }
    ]
  },
  {
    id: 'prog-004',
    name: 'Battery Pack Gen 4',
    code: 'BP-G4',
    phase: 'concept',
    sopDate: '2027-06-01',
    daysToSOP: 435,
    budget: 320000000,
    spent: 28000000,
    readiness: { engineering: 35, manufacturing: 10, supplyChain: 15, quality: 20 },
    overallReadiness: 20,
    status: 'on-track',
    risks: [],
    milestones: [
      { name: 'Concept Approval', date: '2026-06-01', status: 'in-progress' },
      { name: 'Architecture Freeze', date: '2026-09-01', status: 'pending' },
      { name: 'Design Freeze', date: '2027-01-01', status: 'pending' },
      { name: 'Prototype Build', date: '2027-03-01', status: 'pending' },
      { name: 'Validation Complete', date: '2027-05-01', status: 'pending' },
      { name: 'SOP', date: '2027-06-01', status: 'pending' }
    ]
  },
  {
    id: 'prog-005',
    name: 'Autonomous Driving Module',
    code: 'AD-M1',
    phase: 'validation',
    sopDate: '2026-12-01',
    daysToSOP: 253,
    budget: 180000000,
    spent: 95000000,
    readiness: { engineering: 72, manufacturing: 55, supplyChain: 68, quality: 60 },
    overallReadiness: 64,
    status: 'at-risk',
    risks: [
      { id: 'r7', severity: 'high', category: 'engineering', description: 'Sensor calibration issues', owner: 'Engineering', dueDate: '2026-05-01' },
      { id: 'r8', severity: 'medium', category: 'quality', description: 'Software certification pending', owner: 'Quality', dueDate: '2026-06-15' }
    ],
    milestones: [
      { name: 'Concept Approval', date: '2025-08-01', status: 'complete' },
      { name: 'Design Freeze', date: '2026-01-15', status: 'complete' },
      { name: 'Prototype Build', date: '2026-04-01', status: 'complete' },
      { name: 'Validation Complete', date: '2026-08-01', status: 'in-progress' },
      { name: 'PPAP Approval', date: '2026-10-15', status: 'pending' },
      { name: 'SOP', date: '2026-12-01', status: 'pending' }
    ]
  },
  {
    id: 'prog-006',
    name: 'Interior Refresh 2027',
    code: 'IR-27',
    phase: 'design',
    sopDate: '2027-01-15',
    daysToSOP: 298,
    budget: 85000000,
    spent: 32000000,
    readiness: { engineering: 55, manufacturing: 40, supplyChain: 50, quality: 45 },
    overallReadiness: 48,
    status: 'on-track',
    risks: [
      { id: 'r9', severity: 'low', category: 'manufacturing', description: 'New trim supplier onboarding', owner: 'Manufacturing', dueDate: '2026-07-01' }
    ],
    milestones: [
      { name: 'Concept Approval', date: '2025-10-01', status: 'complete' },
      { name: 'Design Freeze', date: '2026-05-01', status: 'in-progress' },
      { name: 'Prototype Build', date: '2026-08-01', status: 'pending' },
      { name: 'Validation Complete', date: '2026-11-01', status: 'pending' },
      { name: 'PPAP Approval', date: '2026-12-15', status: 'pending' },
      { name: 'SOP', date: '2027-01-15', status: 'pending' }
    ]
  },
  {
    id: 'prog-007',
    name: 'Hybrid Powertrain HV2',
    code: 'HP-HV2',
    phase: 'pre-production',
    sopDate: '2026-05-01',
    daysToSOP: 39,
    budget: 95000000,
    spent: 88000000,
    readiness: { engineering: 98, manufacturing: 92, supplyChain: 95, quality: 96 },
    overallReadiness: 95,
    status: 'on-track',
    risks: [],
    milestones: [
      { name: 'Concept Approval', date: '2025-03-01', status: 'complete' },
      { name: 'Design Freeze', date: '2025-08-01', status: 'complete' },
      { name: 'PPAP Approval', date: '2025-12-01', status: 'complete' },
      { name: 'Line Trial', date: '2026-02-15', status: 'complete' },
      { name: 'Pilot Build', date: '2026-04-01', status: 'in-progress' },
      { name: 'SOP', date: '2026-05-01', status: 'pending' }
    ]
  },
  {
    id: 'prog-008',
    name: 'Charging System V3',
    code: 'CS-V3',
    phase: 'validation',
    sopDate: '2026-08-15',
    daysToSOP: 145,
    budget: 65000000,
    spent: 41000000,
    readiness: { engineering: 82, manufacturing: 65, supplyChain: 78, quality: 72 },
    overallReadiness: 74,
    status: 'on-track',
    risks: [
      { id: 'r10', severity: 'medium', category: 'supply', description: 'Connector supplier capacity constraints', owner: 'Supply Chain', dueDate: '2026-05-20' }
    ],
    milestones: [
      { name: 'Concept Approval', date: '2025-07-01', status: 'complete' },
      { name: 'Design Freeze', date: '2025-11-01', status: 'complete' },
      { name: 'Prototype Build', date: '2026-02-01', status: 'complete' },
      { name: 'Validation Complete', date: '2026-05-15', status: 'in-progress' },
      { name: 'PPAP Approval', date: '2026-07-01', status: 'pending' },
      { name: 'SOP', date: '2026-08-15', status: 'pending' }
    ]
  }
];

// Production Data with more stations
export const productionData = {
  summary: {
    taktTime: 52,
    target: 1200,
    actual: 1087,
    gap: -113,
    gapPercent: -9.4
  },
  oee: {
    overall: 84.2,
    availability: 91.5,
    performance: 94.8,
    quality: 97.1,
    trend: [
      { day: 'Mon', oee: 82.1, availability: 90.2, performance: 93.5, quality: 97.4 },
      { day: 'Tue', oee: 83.5, availability: 91.0, performance: 94.2, quality: 97.3 },
      { day: 'Wed', oee: 81.8, availability: 89.5, performance: 94.0, quality: 97.2 },
      { day: 'Thu', oee: 85.2, availability: 92.1, performance: 95.0, quality: 97.4 },
      { day: 'Fri', oee: 84.8, availability: 91.8, performance: 94.9, quality: 97.2 },
      { day: 'Sat', oee: 85.6, availability: 92.5, performance: 95.2, quality: 97.0 },
      { day: 'Sun', oee: 84.2, availability: 91.5, performance: 94.8, quality: 97.1 }
    ]
  },
  stations: [
    { id: 's1', name: 'Body Weld', cycleTime: 48, utilization: 92, status: 'ok', defectRate: 0.8 },
    { id: 's2', name: 'Paint Booth', cycleTime: 51, utilization: 98, status: 'ok', defectRate: 1.2 },
    { id: 's3', name: 'Powertrain Install', cycleTime: 58, utilization: 112, status: 'bottleneck', defectRate: 0.5 },
    { id: 's4', name: 'Chassis Assembly', cycleTime: 45, utilization: 87, status: 'ok', defectRate: 0.6 },
    { id: 's5', name: 'Interior Trim', cycleTime: 50, utilization: 96, status: 'ok', defectRate: 1.5 },
    { id: 's6', name: 'Final Assembly', cycleTime: 49, utilization: 94, status: 'ok', defectRate: 0.9 },
    { id: 's7', name: 'Quality Check', cycleTime: 32, utilization: 62, status: 'ok', defectRate: 0.0 },
    { id: 's8', name: 'Battery Install', cycleTime: 47, utilization: 90, status: 'ok', defectRate: 0.3 },
    { id: 's9', name: 'Electronics Test', cycleTime: 38, utilization: 73, status: 'ok', defectRate: 0.4 }
  ],
  downtime: [
    { reason: 'Equipment Failure', minutes: 126, percentage: 42, trend: 'up' },
    { reason: 'Material Shortage', minutes: 84, percentage: 28, trend: 'down' },
    { reason: 'Changeover', minutes: 45, percentage: 15, trend: 'stable' },
    { reason: 'Planned Maintenance', minutes: 30, percentage: 10, trend: 'stable' },
    { reason: 'Other', minutes: 15, percentage: 5, trend: 'down' }
  ],
  outputTrend: [
    { day: 'Mon', target: 1200, actual: 1050 },
    { day: 'Tue', target: 1200, actual: 1120 },
    { day: 'Wed', target: 1200, actual: 980 },
    { day: 'Thu', target: 1200, actual: 1150 },
    { day: 'Fri', target: 1200, actual: 1100 },
    { day: 'Sat', target: 1200, actual: 1180 },
    { day: 'Sun', target: 1200, actual: 1087 }
  ],
  shifts: [
    { name: 'Morning', start: '06:00', end: '14:00', output: 420, efficiency: 87 },
    { name: 'Afternoon', start: '14:00', end: '22:00', output: 385, efficiency: 82 },
    { name: 'Night', start: '22:00', end: '06:00', output: 282, efficiency: 78 }
  ]
};

// BOM Cost Data - 15 suppliers
export const bomData = {
  summary: {
    vehicle: 'Standard Model',
    totalCost: 38450,
    shouldCost: 36200,
    variance: 2250,
    variancePercent: 6.2,
    partCount: 2847,
    ytdSavings: 2400000
  },
  commodities: [
    { name: 'Powertrain', cost: 12400, target: 11600, variance: 6.9, color: '#c41230', parts: 342 },
    { name: 'Body Structure', cost: 5100, target: 5300, variance: -3.8, color: '#10b981', parts: 456 },
    { name: 'Electronics', cost: 4800, target: 4500, variance: 6.7, color: '#f59e0b', parts: 628 },
    { name: 'Interior', cost: 3200, target: 3100, variance: 3.2, color: '#6366f1', parts: 512 },
    { name: 'Chassis', cost: 4200, target: 4000, variance: 5.0, color: '#8b5cf6', parts: 289 },
    { name: 'Thermal Systems', cost: 2800, target: 2600, variance: 7.7, color: '#ec4899', parts: 198 },
    { name: 'Safety Systems', cost: 2100, target: 2000, variance: 5.0, color: '#14b8a6', parts: 156 },
    { name: 'Other', cost: 3850, target: 3100, variance: 24.2, color: '#64748b', parts: 266 }
  ],
  suppliers: [
    { id: 'sup1', name: 'Apex Motors', part: 'Motor Assembly', quote: 3150, shouldCost: 3200, variance: -1.6, leadTime: 8, quality: 98.2, status: 'preferred', country: 'USA', onTimeDelivery: 96 },
    { id: 'sup2', name: 'TechDrive Inc', part: 'Motor Assembly', quote: 3380, shouldCost: 3200, variance: 5.6, leadTime: 6, quality: 99.1, status: 'backup', country: 'Germany', onTimeDelivery: 98 },
    { id: 'sup3', name: 'GlobalParts Co', part: 'Motor Assembly', quote: 2980, shouldCost: 3200, variance: -6.9, leadTime: 10, quality: 97.5, status: 'new', country: 'China', onTimeDelivery: 92 },
    { id: 'sup4', name: 'Premier Supply', part: 'Motor Assembly', quote: 3420, shouldCost: 3200, variance: 6.9, leadTime: 7, quality: 98.8, status: 'backup', country: 'Japan', onTimeDelivery: 99 },
    { id: 'sup5', name: 'ElectroPower', part: 'Battery Cells', quote: 8500, shouldCost: 8200, variance: 3.7, leadTime: 12, quality: 99.5, status: 'preferred', country: 'Korea', onTimeDelivery: 97 },
    { id: 'sup6', name: 'VoltMax Systems', part: 'Battery Cells', quote: 8900, shouldCost: 8200, variance: 8.5, leadTime: 10, quality: 98.9, status: 'backup', country: 'China', onTimeDelivery: 94 },
    { id: 'sup7', name: 'SteelForm Ltd', part: 'Body Panels', quote: 1850, shouldCost: 1800, variance: 2.8, leadTime: 6, quality: 97.8, status: 'preferred', country: 'USA', onTimeDelivery: 95 },
    { id: 'sup8', name: 'MetalWorks Pro', part: 'Body Panels', quote: 1720, shouldCost: 1800, variance: -4.4, leadTime: 8, quality: 96.5, status: 'new', country: 'Mexico', onTimeDelivery: 91 },
    { id: 'sup9', name: 'ChipTech Global', part: 'ECU Module', quote: 425, shouldCost: 400, variance: 6.3, leadTime: 14, quality: 99.2, status: 'preferred', country: 'Taiwan', onTimeDelivery: 93 },
    { id: 'sup10', name: 'SemiCore Inc', part: 'ECU Module', quote: 395, shouldCost: 400, variance: -1.3, leadTime: 16, quality: 98.1, status: 'new', country: 'USA', onTimeDelivery: 89 },
    { id: 'sup11', name: 'ComfortTech', part: 'Seats', quote: 1240, shouldCost: 1200, variance: 3.3, leadTime: 5, quality: 98.5, status: 'preferred', country: 'USA', onTimeDelivery: 97 },
    { id: 'sup12', name: 'SafetyFirst Inc', part: 'Airbag System', quote: 680, shouldCost: 650, variance: 4.6, leadTime: 7, quality: 99.8, status: 'preferred', country: 'Germany', onTimeDelivery: 99 },
    { id: 'sup13', name: 'GlassClear Co', part: 'Windshield', quote: 285, shouldCost: 280, variance: 1.8, leadTime: 4, quality: 99.0, status: 'preferred', country: 'USA', onTimeDelivery: 96 },
    { id: 'sup14', name: 'WireHarness Ltd', part: 'Wiring Harness', quote: 520, shouldCost: 500, variance: 4.0, leadTime: 6, quality: 97.2, status: 'preferred', country: 'Mexico', onTimeDelivery: 94 },
    { id: 'sup15', name: 'CoolFlow Systems', part: 'HVAC Unit', quote: 890, shouldCost: 850, variance: 4.7, leadTime: 8, quality: 98.0, status: 'backup', country: 'Japan', onTimeDelivery: 95 }
  ],
  substitutions: [
    {
      id: 'sub1',
      part: 'Rear Subframe',
      current: { material: 'Steel', weight: 28.5, cost: 185 },
      proposed: { material: 'Aluminum', weight: 19.2, cost: 240 },
      impact: { weightReduction: 9.3, weightReductionPercent: 33, costIncrease: 55, costIncreasePercent: 30, rangeGain: 8 }
    },
    {
      id: 'sub2',
      part: 'Control Arms',
      current: { material: 'Cast Iron', weight: 12.4, cost: 78 },
      proposed: { material: 'Forged Aluminum', weight: 7.8, cost: 112 },
      impact: { weightReduction: 4.6, weightReductionPercent: 37, costIncrease: 34, costIncreasePercent: 44, rangeGain: 3 }
    },
    {
      id: 'sub3',
      part: 'Hood Panel',
      current: { material: 'Steel', weight: 18.2, cost: 145 },
      proposed: { material: 'Aluminum', weight: 10.8, cost: 195 },
      impact: { weightReduction: 7.4, weightReductionPercent: 41, costIncrease: 50, costIncreasePercent: 34, rangeGain: 5 }
    },
    {
      id: 'sub4',
      part: 'Bumper Beam',
      current: { material: 'Steel', weight: 8.5, cost: 65 },
      proposed: { material: 'Carbon Fiber', weight: 4.2, cost: 180 },
      impact: { weightReduction: 4.3, weightReductionPercent: 51, costIncrease: 115, costIncreasePercent: 177, rangeGain: 3 }
    }
  ]
};

// Capacity Data - 6 plants with detailed metrics
export const capacityData = {
  summary: {
    totalCapacity: 3200000,
    totalDemand: 2850000,
    gap: 350000,
    utilization: 89.1
  },
  plants: [
    { id: 'plant-a', name: 'Plant A', region: 'North', city: 'Detroit', country: 'USA', nameplateCapacity: 750000, effectiveCapacity: 650000, demand: 580000, utilization: 89, status: 'ok', products: ['Sedan', 'SUV'], employees: 3200, shifts: 3 },
    { id: 'plant-b', name: 'Plant B', region: 'South', city: 'Austin', country: 'USA', nameplateCapacity: 500000, effectiveCapacity: 450000, demand: 302000, utilization: 67, status: 'ok', products: ['SUV', 'Truck'], employees: 2100, shifts: 2 },
    { id: 'plant-c', name: 'Plant C', region: 'West', city: 'Fremont', country: 'USA', nameplateCapacity: 1000000, effectiveCapacity: 950000, demand: 922000, utilization: 97, status: 'warning', products: ['Sedan', 'Compact', 'EV'], employees: 4500, shifts: 3 },
    { id: 'plant-d', name: 'Plant D', region: 'East', city: 'Charlotte', country: 'USA', nameplateCapacity: 400000, effectiveCapacity: 350000, demand: 252000, utilization: 72, status: 'ok', products: ['Compact', 'EV'], employees: 1800, shifts: 2 },
    { id: 'plant-e', name: 'Plant E', region: 'Central', city: 'Monterrey', country: 'Mexico', nameplateCapacity: 600000, effectiveCapacity: 520000, demand: 498000, utilization: 96, status: 'warning', products: ['Truck', 'SUV'], employees: 2800, shifts: 3 },
    { id: 'plant-f', name: 'Plant F', region: 'Europe', city: 'Munich', country: 'Germany', nameplateCapacity: 450000, effectiveCapacity: 400000, demand: 296000, utilization: 74, status: 'ok', products: ['Sedan', 'EV'], employees: 2200, shifts: 2 }
  ],
  quarterlyTrend: [
    { quarter: 'Q1 25', capacity: 2800, demand: 2400 },
    { quarter: 'Q2 25', capacity: 2900, demand: 2520 },
    { quarter: 'Q3 25', capacity: 3000, demand: 2650 },
    { quarter: 'Q4 25', capacity: 3100, demand: 2750 },
    { quarter: 'Q1 26', capacity: 3200, demand: 2850 },
    { quarter: 'Q2 26', capacity: 3200, demand: 2950 },
    { quarter: 'Q3 26', capacity: 3300, demand: 3050 },
    { quarter: 'Q4 26', capacity: 3400, demand: 3150 }
  ],
  investments: [
    { id: 'inv1', plant: 'Plant C', type: 'Expansion', amount: 120000000, status: 'approved', capacityGain: 150000, completionDate: '2026-09-01' },
    { id: 'inv2', plant: 'Plant E', type: 'Automation', amount: 45000000, status: 'in-progress', capacityGain: 50000, completionDate: '2026-06-01' },
    { id: 'inv3', plant: 'Plant B', type: 'New Line', amount: 85000000, status: 'planned', capacityGain: 100000, completionDate: '2027-03-01' }
  ]
};

// Dashboard aggregated data
export const dashboardData = {
  kpis: {
    activePrograms: 8,
    programsAtRisk: 2,
    oee: 84.2,
    oeeChange: 2.1,
    costSavings: 2400000,
    capacity: 89.1,
    totalPlants: 6,
    totalEmployees: 16600
  },
  alerts: [
    { id: 'a1', type: 'danger', title: 'Bottleneck Detected', description: 'Powertrain Install — Cycle time 58s vs takt 52s', module: 'production', time: '2 min ago' },
    { id: 'a2', type: 'warning', title: 'Capacity Warning', description: 'Plant C approaching max utilization (97%)', module: 'capacity', time: '15 min ago' },
    { id: 'a3', type: 'warning', title: 'Capacity Warning', description: 'Plant E at 96% utilization', module: 'capacity', time: '18 min ago' },
    { id: 'a4', type: 'warning', title: 'NPI Risk', description: 'EV Powertrain Gen 3 — Thermal redesign required', module: 'npi', time: '1 hr ago' },
    { id: 'a5', type: 'success', title: 'NPI Milestone', description: 'Hybrid Powertrain HV2 — Pilot build started', module: 'npi', time: '2 hr ago' },
    { id: 'a6', type: 'warning', title: 'Supplier Risk', description: 'VoltMax Systems — Lead time increased to 10 weeks', module: 'bom', time: '3 hr ago' },
    { id: 'a7', type: 'info', title: 'Cost Savings', description: 'GlobalParts Co quote 6.9% below should-cost', module: 'bom', time: '4 hr ago' },
    { id: 'a8', type: 'success', title: 'Quality Achievement', description: 'Plant F achieved 99.2% first-pass yield', module: 'production', time: '5 hr ago' }
  ],
  plantUtilization: [
    { name: 'Plant A', region: 'North', utilization: 89, status: 'ok', city: 'Detroit' },
    { name: 'Plant B', region: 'South', utilization: 67, status: 'ok', city: 'Austin' },
    { name: 'Plant C', region: 'West', utilization: 97, status: 'warning', city: 'Fremont' },
    { name: 'Plant D', region: 'East', utilization: 72, status: 'ok', city: 'Charlotte' },
    { name: 'Plant E', region: 'Central', utilization: 96, status: 'warning', city: 'Monterrey' },
    { name: 'Plant F', region: 'Europe', utilization: 74, status: 'ok', city: 'Munich' }
  ]
};

// Global search index
export const searchIndex = [
  // NPI Programs
  ...npiPrograms.map(p => ({ type: 'npi', id: p.id, title: p.name, subtitle: `${p.code} • ${p.phase}`, path: '/npi', data: p })),
  // Suppliers
  ...bomData.suppliers.map(s => ({ type: 'supplier', id: s.id, title: s.name, subtitle: `${s.part} • $${s.quote}`, path: '/bom', data: s })),
  // Plants
  ...capacityData.plants.map(p => ({ type: 'plant', id: p.id, title: p.name, subtitle: `${p.city}, ${p.country}`, path: '/capacity', data: p })),
  // Stations
  ...productionData.stations.map(s => ({ type: 'station', id: s.id, title: s.name, subtitle: `Cycle: ${s.cycleTime}s • ${s.status}`, path: '/production', data: s })),
];