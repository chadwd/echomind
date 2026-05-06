// Persona roles derived from personas/*.yaml (role: field in each file).
// General Manager is first — it's the demo default.
// To add a persona: add the YAML to /personas/, then add the role name here.
export const personas: string[] = [
  'General Manager',
  'BDC Manager',
  'Car Detailer',
  'Customer Service Representative',
  'Finance Manager',
  'Lot Manager',
  'Parts Technician',
  'Property Maintenance',
  'Sales Consultant',
  'Sales Manager',
  'Service Lane Appraiser',
  'Service Technician',
  'Used Car Manager',
  'Vehicle Photographer',
];

export const defaultPersona = personas[0];
