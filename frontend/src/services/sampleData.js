// Static sample data for dashboards when backend is unavailable

export const sampleFieldOfficerReports = [
  {
    _id: 'RPT-1001',
    location: { address: '12 Maple St, Ward 3' },
    status: 'Pending',
    severity: 'High',
    date: new Date('2024-01-15').toISOString(),
  },
  {
    _id: 'RPT-1002',
    location: { address: '88 Oak Ave, Ward 2' },
    status: 'Work Ordered',
    severity: 'Medium',
    date: new Date('2024-01-18').toISOString(),
  },
  {
    _id: 'RPT-1003',
    location: { address: '5 Riverside Blvd, Ward 1' },
    status: 'In Progress',
    severity: 'Low',
    date: new Date('2024-01-20').toISOString(),
  },
  {
    _id: 'RPT-1004',
    location: { address: '220 Market Rd, Ward 4' },
    status: 'Completed',
    severity: 'High',
    date: new Date('2024-01-21').toISOString(),
  },
];

export const sampleSupervisorReports = [
  {
    _id: 'RPT-1001',
    location: { address: '12 Maple St, Ward 3' },
    status: 'Pending',
    severity: 'High',
    assignedTo: { name: 'Officer A' },
    date: new Date('2024-01-15').toISOString(),
  },
  {
    _id: 'RPT-1002',
    location: { address: '88 Oak Ave, Ward 2' },
    status: 'Work Ordered',
    severity: 'Medium',
    assignedTo: { name: 'Officer B' },
    date: new Date('2024-01-18').toISOString(),
  },
  {
    _id: 'RPT-1003',
    location: { address: '5 Riverside Blvd, Ward 1' },
    status: 'In Progress',
    severity: 'Low',
    assignedTo: { name: 'Officer C' },
    date: new Date('2024-01-20').toISOString(),
  },
  {
    _id: 'RPT-1004',
    location: { address: '220 Market Rd, Ward 4' },
    status: 'Completed',
    severity: 'High',
    assignedTo: { name: 'Officer D' },
    date: new Date('2024-01-21').toISOString(),
  },
];
