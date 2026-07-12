import { createContext, useContext, useState, useEffect } from 'react';

const SettingsContext = createContext(null);

export const translations = {
  en: {
    dashboard: 'Dashboard', vehicles: 'Vehicles', drivers: 'Drivers', trips: 'Trips',
    maintenance: 'Maintenance', finance: 'Finance', reports: 'Reports', aiAssistant: 'AI Assistant',
    signOut: 'Sign Out', fleetManagement: 'Fleet Management',
    totalVehicles: 'Total Vehicles', activeVehicles: 'Active Vehicles',
    inMaintenance: 'In Maintenance', activeTrips: 'Active Trips',
    activeDrivers: 'Active Drivers', fleetUtilization: 'Fleet Utilization',
    addVehicle: 'Add Vehicle', editVehicle: 'Edit Vehicle',
    registration: 'Registration Number', make: 'Make', model: 'Model',
    year: 'Year', fuelType: 'Fuel Type', mileage: 'Current Mileage (km)',
    capacity: 'Capacity (kg)', status: 'Status', actions: 'Actions',
    save: 'Save', cancel: 'Cancel', delete: 'Delete', search: 'Search vehicles...',
    searchDrivers: 'Search drivers...',
    allStatuses: 'All Statuses', noVehicles: 'No vehicles found',
    addDriver: 'Add Driver', editDriver: 'Edit Driver',
    name: 'Full Name', licenseNumber: 'License Number', licenseClass: 'License Class',
    licenseExpiry: 'License Expiry', phone: 'Phone', noDrivers: 'No drivers found',
    fullName: 'Full Name',
    licenseAlerts: 'License Alerts', expired: 'license EXPIRED', expiringSoon: 'expiring soon',
    newTrip: 'New Trip', startLocation: 'Start Location', endLocation: 'End Location',
    selectVehicle: 'Select vehicle...', selectDriver: 'Select driver...',
    startMileage: 'Start Mileage (km)', noTrips: 'No trips found',
    addRecord: 'Add Record', description: 'Description', cost: 'Cost (₹)',
    scheduledDate: 'Scheduled Date', serviceProvider: 'Service Provider',
    noMaintenance: 'No maintenance records', type: 'Type',
    addFuelLog: 'Add Fuel Log', addExpense: 'Add Expense',
    totalFuelCost: 'Total Fuel Cost', totalExpenses: 'Total Expenses',
    totalOperationalCost: 'Total Operational Cost', noFuelLogs: 'No fuel logs',
    noExpenses: 'No expenses', category: 'Category', amount: 'Amount (₹)',
    operationalCosts: 'Operational Costs', vehicleStatusDist: 'Vehicle Status Distribution',
    costSummary: 'Cost Summary', tripSummary: 'Trip Summary', driverSummary: 'Driver Summary',
    fuelCosts: 'Fuel Costs', otherExpenses: 'Other Expenses', total: 'Total',
    scheduled: 'Scheduled', inProgress: 'In Progress', completed: 'Completed',
    active: 'Active', inactive: 'Inactive', suspended: 'Suspended',
    language: 'Language', theme: 'Theme', dark: 'Dark', light: 'Light',
    totalDrivers: 'total drivers', totalTrips: 'total trips',
    creating: 'Creating...', saving: 'Saving...',
    vehicle: 'Vehicle', driverOptional: 'Driver (optional)', vehicleOptional: 'Vehicle (optional)',
    quantityLiters: 'Quantity (Liters)', unitPricePerL: 'Unit Price (₹/L)',
    odometerKm: 'Odometer (km)', date: 'Date',
    route: 'Route', cargoKg: 'Cargo (kg)', startMileageKm: 'Start Mileage (km)',
    cargoWeightKg: 'Cargo Weight (kg)', cargoExceedsCapacity: 'Cargo weight exceeds vehicle capacity!',
    noEligibleVehicles: 'No active vehicles can handle',
    fleetPerformanceAnalytics: 'Fleet performance analytics', exportCSV: 'Export CSV',
    monthlyFuelCostTrend: 'Monthly Fuel Cost Trend', vehiclePerformanceReport: 'Vehicle Performance Report',
    distanceKm: 'Distance (km)', fuelCost: 'Fuel Cost', maintCost: 'Maint. Cost',
    opCost: 'Op. Cost', efficiencyKmL: 'Efficiency (km/L)', roiPercent: 'ROI %',
    noDataAvailable: 'No data available', suggestedQuestions: 'Suggested Questions',
    poweredByFleetDataAnalysis: 'Powered by fleet data analysis',
    mustBe10Digits: 'Must be 10 digits',
    totalRecords: 'total records', addMaintenanceRecord: 'Add Maintenance Record',
    start: 'Start', complete: 'Complete',
    fleetOperationsOverview: 'Fleet operations overview',
  },
  hi: {
    dashboard: 'डैशबोर्ड', vehicles: 'वाहन', drivers: 'चालक', trips: 'यात्राएं',
    maintenance: 'रखरखाव', finance: 'वित्त', reports: 'रिपोर्ट', aiAssistant: 'AI सहायक',
    signOut: 'साइन आउट', fleetManagement: 'बेड़ा प्रबंधन',
    totalVehicles: 'कुल वाहन', activeVehicles: 'सक्रिय वाहन',
    inMaintenance: 'रखरखाव में', activeTrips: 'सक्रिय यात्राएं',
    activeDrivers: 'सक्रिय चालक', fleetUtilization: 'बेड़ा उपयोग',
    addVehicle: 'वाहन जोड़ें', editVehicle: 'वाहन संपादित करें',
    registration: 'पंजीकरण संख्या', make: 'निर्माता', model: 'मॉडल',
    year: 'वर्ष', fuelType: 'ईंधन प्रकार', mileage: 'वर्तमान माइलेज (km)',
    capacity: 'क्षमता (kg)', status: 'स्थिति', actions: 'कार्रवाई',
    save: 'सहेजें', cancel: 'रद्द करें', delete: 'हटाएं', search: 'वाहन खोजें...',
    searchDrivers: 'चालक खोजें...',
    allStatuses: 'सभी स्थितियां', noVehicles: 'कोई वाहन नहीं मिला',
    addDriver: 'चालक जोड़ें', editDriver: 'चालक संपादित करें',
    name: 'पूरा नाम', licenseNumber: 'लाइसेंस नंबर', licenseClass: 'लाइसेंस वर्ग',
    licenseExpiry: 'लाइसेंस समाप्ति', phone: 'फ़ोन', noDrivers: 'कोई चालक नहीं मिला',
    fullName: 'पूरा नाम',
    licenseAlerts: 'लाइसेंस अलर्ट', expired: 'लाइसेंस समाप्त', expiringSoon: 'जल्द समाप्त होगा',
    newTrip: 'नई यात्रा', startLocation: 'प्रारंभ स्थान', endLocation: 'अंत स्थान',
    selectVehicle: 'वाहन चुनें...', selectDriver: 'चालक चुनें...',
    startMileage: 'प्रारंभ माइलेज (km)', noTrips: 'कोई यात्रा नहीं मिली',
    addRecord: 'रिकॉर्ड जोड़ें', description: 'विवरण', cost: 'लागत (₹)',
    scheduledDate: 'निर्धारित तिथि', serviceProvider: 'सेवा प्रदाता',
    noMaintenance: 'कोई रखरखाव रिकॉर्ड नहीं', type: 'प्रकार',
    addFuelLog: 'ईंधन लॉग जोड़ें', addExpense: 'खर्च जोड़ें',
    totalFuelCost: 'कुल ईंधन लागत', totalExpenses: 'कुल खर्च',
    totalOperationalCost: 'कुल परिचालन लागत', noFuelLogs: 'कोई ईंधन लॉग नहीं',
    noExpenses: 'कोई खर्च नहीं', category: 'श्रेणी', amount: 'राशि (₹)',
    operationalCosts: 'परिचालन लागत', vehicleStatusDist: 'वाहन स्थिति वितरण',
    costSummary: 'लागत सारांश', tripSummary: 'यात्रा सारांश', driverSummary: 'चालक सारांश',
    fuelCosts: 'ईंधन लागत', otherExpenses: 'अन्य खर्च', total: 'कुल',
    scheduled: 'निर्धारित', inProgress: 'प्रगति में', completed: 'पूर्ण',
    active: 'सक्रिय', inactive: 'निष्क्रिय', suspended: 'निलंबित',
    language: 'भाषा', theme: 'थीम', dark: 'डार्क', light: 'लाइट',
    totalDrivers: 'कुल चालक', totalTrips: 'कुल यात्राएं',
    creating: 'बना रहा है...', saving: 'सहेज रहा है...',
    vehicle: 'वाहन', driverOptional: 'चालक (वैकल्पिक)', vehicleOptional: 'वाहन (वैकल्पिक)',
    quantityLiters: 'मात्रा (लीटर)', unitPricePerL: 'इकाई मूल्य (₹/लीटर)',
    odometerKm: 'ओडोमीटर (km)', date: 'तिथि',
    route: 'मार्ग', cargoKg: 'कार्गो (kg)', startMileageKm: 'प्रारंभ माइलेज (km)',
    cargoWeightKg: 'कार्गो भार (kg)', cargoExceedsCapacity: 'कार्गो भार वाहन क्षमता से अधिक है!',
    noEligibleVehicles: 'कोई सक्रिय वाहन नहीं बोल सकता',
    fleetPerformanceAnalytics: 'बेड़ा प्रदर्शन विश्लेषण', exportCSV: 'CSV निर्यात करें',
    monthlyFuelCostTrend: 'मासिक ईंधन लागत प्रवृत्ति', vehiclePerformanceReport: 'वाहन प्रदर्शन रिपोर्ट',
    distanceKm: 'दूरी (km)', fuelCost: 'ईंधन लागत', maintCost: 'रखरखाव लागत',
    opCost: 'संचालन लागत', efficiencyKmL: 'दक्षता (km/L)', roiPercent: 'ROI %',
    noDataAvailable: 'कोई डेटा उपलब्ध नहीं', suggestedQuestions: 'सुझाए गए प्रश्न',
    poweredByFleetDataAnalysis: 'बेड़ा डेटा विश्लेषण द्वारा संचालित',
    mustBe10Digits: '10 अंकों का होना चाहिए',
    totalRecords: 'कुल रिकॉर्ड', addMaintenanceRecord: 'रखरखाव रिकॉर्ड जोड़ें',
    start: 'शुरू करें', complete: 'पूर्ण करें',
    fleetOperationsOverview: 'बेड़ा संचालन अवलोकन',
  },
};

export function SettingsProvider({ children }) {
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark');
  const [lang, setLang] = useState(() => localStorage.getItem('lang') || 'en');

  useEffect(() => {
    localStorage.setItem('theme', theme);
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('lang', lang);
  }, [lang]);

  const t = translations[lang];
  const toggleTheme = () => setTheme(p => p === 'dark' ? 'light' : 'dark');
  const toggleLang = () => setLang(p => p === 'en' ? 'hi' : 'en');

  return (
    <SettingsContext.Provider value={{ theme, lang, t, toggleTheme, toggleLang }}>
      {children}
    </SettingsContext.Provider>
  );
}

export const useSettings = () => useContext(SettingsContext);
