export const vehicleTypes = ['car', 'bike'] as const;

export const carBrands = [
  'Maruti Suzuki',
  'Hyundai',
  'Tata',
  'Mahindra',
  'Kia',
  'Honda',
  'Toyota',
  'Renault',
  'Volkswagen',
  'Skoda',
  'MG',
  'Nissan',
  'Ford',
  'Jeep',
  'BMW',
  'Mercedes-Benz',
  'Audi',
];

export const bikeBrands = [
  'Hero',
  'Honda',
  'Bajaj',
  'TVS',
  'Royal Enfield',
  'Yamaha',
  'Suzuki',
  'KTM',
  'Kawasaki',
  'Harley-Davidson',
  'Jawa',
  'Benelli',
];

export const carModels: Record<string, { models: Record<string, string[]> }> = {
  'Maruti Suzuki': {
    models: {
      'Swift': ['VXi', 'ZXi', 'ZXi+'],
      'Baleno': ['Sigma', 'Delta', 'Zeta', 'Alpha'],
      'WagonR': ['LXi', 'VXi', 'ZXi'],
      'Alto': ['Std', 'LXi', 'VXi'],
      'Dzire': ['LXi', 'VXi', 'ZXi', 'ZXi+'],
      'Brezza': ['LXi', 'VXi', 'ZXi', 'ZXi+'],
      'Ertiga': ['LXi', 'VXi', 'ZXi', 'ZXi+'],
      'Ciaz': ['Sigma', 'Delta', 'Zeta', 'Alpha'],
    }
  },
  'Hyundai': {
    models: {
      'i20': ['Magna', 'Sportz', 'Asta'],
      'Creta': ['E', 'EX', 'S', 'SX'],
      'Venue': ['E', 'S', 'SX', 'SX(O)'],
      'Verna': ['E', 'S', 'SX', 'SX(O)'],
      'Grand i10 Nios': ['Era', 'Magna', 'Sportz', 'Asta'],
      'Elantra': ['S', 'SX', 'SX(O)'],
    }
  },
  'Tata': {
    models: {
      'Nexon': ['XE', 'XM', 'XT', 'XZ+'],
      'Harrier': ['XE', 'XM', 'XT', 'XZ'],
      'Tiago': ['XE', 'XT', 'XZ', 'XZ+'],
      'Altroz': ['XE', 'XM', 'XT', 'XZ'],
      'Safari': ['XE', 'XM', 'XT', 'XZ+'],
      'Punch': ['Pure', 'Adventure', 'Accomplished', 'Creative'],
    }
  },
  'Mahindra': {
    models: {
      'Scorpio': ['S3', 'S5', 'S7', 'S11'],
      'XUV700': ['MX', 'AX3', 'AX5', 'AX7'],
      'XUV500': ['W5', 'W7', 'W9', 'W11'],
      'Bolero': ['B4', 'B6', 'B6(O)'],
      'Thar': ['AX', 'LX'],
      'XUV300': ['W4', 'W6', 'W8', 'W8(O)'],
    }
  },
  'Kia': {
    models: {
      'Seltos': ['HTE', 'HTK', 'HTX', 'GTX'],
      'Sonet': ['HTE', 'HTK', 'HTX', 'GTX+'],
      'Carens': ['Premium', 'Prestige', 'Prestige Plus', 'Luxury'],
    }
  },
  'Honda': {
    models: {
      'City': ['V', 'VX', 'ZX'],
      'Amaze': ['E', 'S', 'V', 'VX'],
      'Jazz': ['V', 'VX', 'ZX'],
      'WR-V': ['SV', 'VX'],
      'Civic': ['V', 'VX', 'ZX'],
    }
  },
  'Toyota': {
    models: {
      'Innova Crysta': ['GX', 'VX', 'ZX'],
      'Fortuner': ['4x2 MT', '4x2 AT', '4x4 MT'],
      'Glanza': ['G', 'V'],
      'Urban Cruiser': ['Mid', 'High', 'Premium'],
    }
  },
  'Renault': {
    models: {
      'Kwid': ['RXE', 'RXL', 'RXT', 'Climber'],
      'Triber': ['RXE', 'RXL', 'RXZ'],
      'Kiger': ['RXE', 'RXL', 'RXT', 'RXZ'],
    }
  },
  'Volkswagen': {
    models: {
      'Polo': ['Trendline', 'Comfortline', 'Highline'],
      'Vento': ['Trendline', 'Comfortline', 'Highline'],
      'Tiguan': ['Comfortline', 'Highline'],
    }
  },
  'Skoda': {
    models: {
      'Rapid': ['Rider', 'Rider Plus', 'Ambition', 'Style'],
      'Kushaq': ['Active', 'Ambition', 'Style'],
      'Octavia': ['Ambition', 'Style', 'L&K'],
    }
  },
  'MG': {
    models: {
      'Hector': ['Style', 'Super', 'Smart', 'Sharp'],
      'Astor': ['Style', 'Super', 'Smart', 'Sharp'],
      'ZS EV': ['Excite', 'Exclusive'],
    }
  },
  'Nissan': {
    models: {
      'Magnite': ['XE', 'XL', 'XV', 'XV Premium'],
      'Kicks': ['XL', 'XV', 'XV Premium'],
    }
  },
  'Ford': {
    models: {
      'EcoSport': ['Ambiente', 'Trend', 'Titanium'],
      'Endeavour': ['Trend', 'Titanium', 'Titanium+'],
      'Figo': ['Ambiente', 'Trend', 'Titanium'],
    }
  },
  'Jeep': {
    models: {
      'Compass': ['Sport', 'Longitude', 'Limited', 'Model S'],
      'Meridian': ['Longitude', 'Limited', 'Limited(O)'],
    }
  },
  'BMW': {
    models: {
      '3 Series': ['Sport Line', 'Luxury Line', 'M Sport'],
      '5 Series': ['Sport Line', 'Luxury Line', 'M Sport'],
      'X1': ['sDrive20d', 'sDrive20d M Sport'],
      'X3': ['xDrive20d', 'xDrive30d M Sport'],
    }
  },
  'Mercedes-Benz': {
    models: {
      'C-Class': ['Progressive', 'AMG Line'],
      'E-Class': ['Exclusive', 'AMG Line'],
      'GLA': ['Progressive', 'AMG Line'],
      'GLC': ['Progressive', 'AMG Line'],
    }
  },
  'Audi': {
    models: {
      'A4': ['Premium', 'Premium Plus', 'Technology'],
      'A6': ['Premium Plus', 'Technology'],
      'Q3': ['Premium', 'Premium Plus', 'Technology'],
      'Q5': ['Premium Plus', 'Technology'],
    }
  },
};

export const bikeModels: Record<string, { models: Record<string, string[]> }> = {
  'Hero': {
    models: {
      'Splendor Plus': ['Self Start', 'Kick Start'],
      'HF Deluxe': ['Self Start', 'i3S'],
      'Passion Pro': ['Self Drum', 'Self Disc'],
      'Glamour': ['Drum Brake', 'Disc Brake'],
      'Xtreme 160R': ['Single Disc', 'Double Disc'],
      'XPulse 200': ['2V', '4V'],
    }
  },
  'Honda': {
    models: {
      'Activa': ['6G STD', '6G DLX'],
      'Shine': ['Drum', 'Disc'],
      'SP 125': ['Drum', 'Disc'],
      'Unicorn': ['Standard', 'BS6'],
      'Hornet 2.0': ['Standard', 'Repsol Edition'],
      'CB350': ['DLX', 'DLX Pro'],
    }
  },
  'Bajaj': {
    models: {
      'Pulsar': ['150', '180', '220F', 'NS200', 'RS200'],
      'Dominar': ['250', '400'],
      'Platina': ['100', '110'],
      'CT': ['100', '110'],
      'Avenger': ['Street 160', 'Cruise 220'],
    }
  },
  'TVS': {
    models: {
      'Apache': ['RTR 160 2V', 'RTR 160 4V', 'RTR 200 4V', 'RR 310'],
      'Jupiter': ['Drum', 'Disc', 'ZX'],
      'Ntorq': ['125', '125 XT', '125 Race Edition'],
      'Radeon': ['Drum', 'Disc'],
      'Sport': ['Single Disc', 'Double Disc'],
    }
  },
  'Royal Enfield': {
    models: {
      'Classic 350': ['Single Channel', 'Dual Channel'],
      'Meteor 350': ['Fireball', 'Stellar', 'Supernova'],
      'Himalayan': ['Standard'],
      'Interceptor 650': ['Standard', 'Chrome'],
      'Continental GT 650': ['Standard', 'Rocker Red'],
      'Hunter 350': ['Metro', 'Retro'],
    }
  },
  'Yamaha': {
    models: {
      'FZ': ['V3', 'S V3', 'X'],
      'MT-15': ['Standard', 'Version 2.0'],
      'R15': ['V3', 'V4', 'M'],
      'Fascino': ['125', '125 Hybrid'],
      'Ray ZR': ['Street Rally', 'Hybrid'],
    }
  },
  'Suzuki': {
    models: {
      'Gixxer': ['150', '250', 'SF 250'],
      'Access': ['125', '125 Special Edition'],
      'Burgman Street': ['125', '125 EX'],
      'Avenis': ['Drum', 'Disc'],
    }
  },
  'KTM': {
    models: {
      'Duke': ['125', '200', '250', '390'],
      'RC': ['125', '200', '390'],
      'Adventure': ['250', '390'],
    }
  },
  'Kawasaki': {
    models: {
      'Ninja': ['300', '650', 'ZX-6R'],
      'Z': ['650', '900'],
      'Versys': ['650', '1000'],
    }
  },
  'Harley-Davidson': {
    models: {
      'Street': ['750', 'Rod'],
      'Iron': ['883', '1200'],
      'Sportster': ['S'],
    }
  },
  'Jawa': {
    models: {
      'Classic': ['Standard'],
      'Forty Two': ['Standard'],
      'Perak': ['Bobber'],
    }
  },
  'Benelli': {
    models: {
      'Imperiale': ['400'],
      'Leoncino': ['500'],
      'TRK': ['502', '502X'],
    }
  },
};

export const fuelTypes = [
  { label: 'Petrol', value: 'petrol' },
  { label: 'Diesel', value: 'diesel' },
  { label: 'CNG', value: 'cng' },
  { label: 'Electric', value: 'electric' },
  { label: 'Hybrid', value: 'hybrid' },
];

export const indianCities = [
  { name: 'Mumbai', demandMultiplier: 1.1 },
  { name: 'Delhi', demandMultiplier: 1.08 },
  { name: 'Bangalore', demandMultiplier: 1.12 },
  { name: 'Hyderabad', demandMultiplier: 1.05 },
  { name: 'Chennai', demandMultiplier: 1.04 },
  { name: 'Pune', demandMultiplier: 1.06 },
  { name: 'Kolkata', demandMultiplier: 1.02 },
  { name: 'Ahmedabad', demandMultiplier: 1.03 },
  { name: 'Surat', demandMultiplier: 0.98 },
  { name: 'Jaipur', demandMultiplier: 0.97 },
  { name: 'Lucknow', demandMultiplier: 0.96 },
  { name: 'Chandigarh', demandMultiplier: 1.04 },
  { name: 'Kochi', demandMultiplier: 1.01 },
  { name: 'Indore', demandMultiplier: 0.95 },
  { name: 'Other', demandMultiplier: 0.92 },
];

export const ownershipOptions = [
  { label: '1st Owner', value: 1, adjustment: 0 },
  { label: '2nd Owner', value: 2, adjustment: -0.08 },
  { label: '3rd Owner', value: 3, adjustment: -0.15 },
  { label: '4th+ Owner', value: 4, adjustment: -0.22 },
];

export const serviceRecords = [
  { label: 'Full Service History', value: 'full', adjustment: 0.05 },
  { label: 'Partial Service History', value: 'partial', adjustment: 0 },
  { label: 'No Service History', value: 'none', adjustment: -0.08 },
];

export const accidentHistory = [
  { label: 'No Accident', value: 'no', adjustment: 0 },
  { label: 'Minor Accident (Repaired)', value: 'minor', adjustment: -0.1 },
  { label: 'Major Accident (Repaired)', value: 'major', adjustment: -0.25 },
];

const basePrices: Record<string, number> = {
  'Maruti Suzuki': 500000,
  'Hyundai': 600000,
  'Tata': 550000,
  'Mahindra': 700000,
  'Kia': 800000,
  'Honda': 750000,
  'Toyota': 900000,
  'Renault': 450000,
  'Volkswagen': 850000,
  'Skoda': 900000,
  'MG': 800000,
  'Nissan': 600000,
  'Ford': 650000,
  'Jeep': 1200000,
  'BMW': 2500000,
  'Mercedes-Benz': 3000000,
  'Audi': 2800000,
  'Hero': 80000,
  'Bajaj': 90000,
  'TVS': 70000,
  'Royal Enfield': 150000,
  'Yamaha': 100000,
  'Suzuki': 95000,
  'KTM': 180000,
  'Kawasaki': 200000,
  'Harley-Davidson': 800000,
  'Jawa': 180000,
  'Benelli': 250000,
};

export interface VehicleInput {
  vehicleType: 'car' | 'bike';
  brand: string;
  model: string;
  variant?: string;
  engineCC?: number;
  year: number;
  kilometers: number;
  owners: number;
  fuelType: string;
  city: string;
  hasAccident: string;
  serviceRecord: string;
}

export interface PriceBreakdown {
  originalPrice: number;
  ageDepreciation: number;
  usageAdjustment: number;
  ownershipAdjustment: number;
  accidentAdjustment: number;
  serviceAdjustment: number;
  cityDemandAdjustment: number;
  finalPrice: number;
}

export const calculateVehiclePrice = (input: VehicleInput) => {
  const currentYear = new Date().getFullYear();
  const age = currentYear - input.year;
  
  const basePrice = basePrices[input.brand] || 500000;
  
  let depreciation = 1.0;
  if (age >= 1) {
    depreciation -= 0.15;
  }
  if (age >= 2) {
    depreciation -= 0.10;
  }
  if (age >= 3) {
    depreciation -= (age - 2) * 0.08;
  }
  depreciation = Math.max(0.2, depreciation);
  
  const expectedKm = age * 12000;
  const excessKm = Math.max(0, input.kilometers - expectedKm);
  const usageAdjustment = excessKm > 0 ? -(excessKm / 100000) * 0.05 : 0;
  
  const ownershipData = ownershipOptions.find(o => o.value === input.owners);
  const ownershipAdjustment = ownershipData?.adjustment || -0.22;
  
  const accidentData = accidentHistory.find(a => a.value === input.hasAccident);
  const accidentAdjustment = accidentData?.adjustment || 0;
  
  const serviceData = serviceRecords.find(s => s.value === input.serviceRecord);
  const serviceAdjustment = serviceData?.adjustment || 0;
  
  const cityData = indianCities.find(c => c.name === input.city);
  const cityMultiplier = cityData?.demandMultiplier || 0.92;
  
  const afterDepreciation = basePrice * depreciation;
  const afterUsage = afterDepreciation * (1 + usageAdjustment);
  const afterOwnership = afterUsage * (1 + ownershipAdjustment);
  const afterAccident = afterOwnership * (1 + accidentAdjustment);
  const afterService = afterAccident * (1 + serviceAdjustment);
  const finalPrice = afterService * cityMultiplier;
  
  const breakdown: PriceBreakdown = {
    originalPrice: basePrice,
    ageDepreciation: basePrice - afterDepreciation,
    usageAdjustment: afterUsage - afterDepreciation,
    ownershipAdjustment: afterOwnership - afterUsage,
    accidentAdjustment: afterAccident - afterOwnership,
    serviceAdjustment: afterService - afterAccident,
    cityDemandAdjustment: finalPrice - afterService,
    finalPrice: Math.round(finalPrice),
  };
  
  return {
    estimatedPrice: Math.round(finalPrice),
    priceRange: {
      min: Math.round(finalPrice * 0.9),
      max: Math.round(finalPrice * 1.1),
    },
    breakdown,
    excellentPrice: Math.round(finalPrice * 0.9),
    fairPrice: Math.round(finalPrice),
    overpricedPrice: Math.round(finalPrice * 1.1),
  };
};
