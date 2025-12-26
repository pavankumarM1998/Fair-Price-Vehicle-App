# Fair Vehicle Price - Technical Documentation

## Overview

Fair Vehicle Price is a mobile application that calculates the fair market price of used cars and bikes in India. This is a valuation-only app (NOT a buying or selling marketplace).

## App Logic & Pricing Algorithm

### Core Pricing Formula

The app calculates fair market prices using a sophisticated multi-factor algorithm that considers:

#### 1. Base Price
- Starting point based on vehicle brand
- **Cars**: ₹450,000 - ₹3,000,000
- **Bikes**: ₹70,000 - ₹800,000

#### 2. Age Depreciation

The most significant factor in vehicle valuation:

```
Year 1: 15% depreciation
Year 2: Additional 10% depreciation
Year 3+: 8% per year depreciation
Minimum value: 20% of original price
```

**Example:** A 4-year-old car:
- Year 1: -15%
- Year 2: -10%
- Year 3: -8%
- Year 4: -8%
- **Total: -41% depreciation**

**Code Implementation:**
```typescript
let depreciation = 1.0;
if (age >= 1) depreciation -= 0.15;
if (age >= 2) depreciation -= 0.10;
if (age >= 3) depreciation -= (age - 2) * 0.08;
depreciation = Math.max(0.2, depreciation);
```

#### 3. Usage Adjustment

Accounts for kilometers driven vs. expected usage:

```
Expected km per year: 12,000 km
Excess km penalty: -5% per 100,000 km over expected
```

**Example:** 5-year-old car with 100,000 km:
- Expected: 60,000 km (5 × 12,000)
- Excess: 40,000 km
- Adjustment: -2% (40,000 / 100,000 × 5%)

**Code Implementation:**
```typescript
const expectedKm = age * 12000;
const excessKm = Math.max(0, kilometers - expectedKm);
const usageAdjustment = excessKm > 0 ? -(excessKm / 100000) * 0.05 : 0;
```

#### 4. Ownership Impact

Multiple owners reduce buyer trust and resale value:

```
1st Owner: 0% adjustment
2nd Owner: -8%
3rd Owner: -15%
4th+ Owner: -22%
```

#### 5. Accident History

Accidents significantly impact value due to potential structural damage:

```
No Accident: 0%
Minor Accident (Repaired): -10%
Major Accident (Repaired): -25%
```

#### 6. Service Record

Full service history proves proper maintenance:

```
Full Service History: +5%
Partial Service History: 0%
No Service History: -8%
```

#### 7. City Demand Multiplier

Vehicle prices vary by city based on local demand, infrastructure, and buyer preferences:

```
Bangalore: 1.12x (highest demand - IT hub, young buyers)
Mumbai: 1.10x (metro city, high purchasing power)
Delhi: 1.08x (large market, good infrastructure)
Pune: 1.06x (growing IT sector)
Hyderabad: 1.05x (tech hub)
Chennai: 1.04x (automotive industry hub)
Chandigarh: 1.04x (planned city, high living standards)
Ahmedabad: 1.03x (business hub)
Kolkata: 1.02x (metro city)
Kochi: 1.01x (port city)
Surat: 0.98x (tier-2 city)
Jaipur: 0.97x (tourism city)
Lucknow: 0.96x (tier-2 city)
Indore: 0.95x (emerging city)
Other Cities: 0.92x (smaller markets)
```

### Price Calculation Flow

The algorithm applies adjustments sequentially:

```typescript
// Step 1: Apply age depreciation
const afterDepreciation = basePrice * depreciation;

// Step 2: Apply usage adjustment
const afterUsage = afterDepreciation * (1 + usageAdjustment);

// Step 3: Apply ownership adjustment
const afterOwnership = afterUsage * (1 + ownershipAdjustment);

// Step 4: Apply accident impact
const afterAccident = afterOwnership * (1 + accidentAdjustment);

// Step 5: Apply service record
const afterService = afterAccident * (1 + serviceAdjustment);

// Step 6: Apply city demand
const finalPrice = afterService * cityMultiplier;
```

### Complete Example Calculation

**Input:**
- Brand: Hyundai Creta
- Year: 2019 (5 years old)
- Kilometers: 80,000 km
- Owners: 2
- Accident: No
- Service: Full
- City: Bangalore

**Calculation:**
1. Base Price: ₹600,000
2. Age Depreciation (5 years):
   - Year 1: -15% = ₹90,000
   - Year 2: -10% = ₹60,000
   - Years 3-5: -24% (8% × 3) = ₹144,000
   - Total: -49% = ₹294,000
   - After depreciation: ₹306,000

3. Usage Adjustment:
   - Expected: 60,000 km
   - Actual: 80,000 km
   - Excess: 20,000 km (within acceptable range)
   - Adjustment: -1% = -₹3,060
   - After usage: ₹302,940

4. Ownership (2nd owner):
   - Adjustment: -8% = -₹24,235
   - After ownership: ₹278,705

5. Accident (None):
   - Adjustment: 0%
   - After accident: ₹278,705

6. Service Record (Full):
   - Adjustment: +5% = +₹13,935
   - After service: ₹292,640

7. City Demand (Bangalore):
   - Multiplier: 1.12×
   - Final Price: ₹327,757 ≈ **₹328,000**

**Price Range:**
- Minimum (Excellent): ₹295,200 (90% of fair value)
- Fair: ₹328,000
- Maximum (Overpriced): ₹360,800 (110% of fair value)

## Deal Score System

The app generates three price scenarios to help users understand market dynamics:

### Price Scenarios

1. **Excellent Price (0-33 on slider)**: 90% of fair value
   - Represents a buyer's best deal
   - Urgent seller or below-market pricing
   - Green color indicator

2. **Fair Price (34-66 on slider)**: 100% of calculated fair value
   - Market standard pricing
   - Balanced deal for both parties
   - Yellow color indicator

3. **Overpriced (67-100 on slider)**: 110% of fair value
   - Seller's advantage or dealer margin
   - Above-market pricing
   - Red color indicator

### Dynamic Breakdown by Deal Type

The price breakdown changes based on selected deal type:

**Excellent Price Breakdown:**
- Base Fair Value: ₹328,000
- Negotiation Benefit: -₹32,800 (savings)
- Urgent Seller Discount: ₹0
- **Your Price: ₹295,200**

**Fair Price Breakdown:**
- Original Price: ₹600,000
- Standard Market Depreciation: -₹272,000
- **Your Price: ₹328,000**

**Overpriced Breakdown:**
- Base Fair Value: ₹328,000
- Dealer Margin: +₹19,680 (60% of markup)
- High Demand Premium: +₹13,120 (40% of markup)
- **Your Price: ₹360,800**

## Negotiation Strategy

### Price Guidelines

1. **Smart Starting Offer**: Excellent Price (10% below fair value)
   - Opens negotiation at favorable position
   - Leaves room for seller counter-offer

2. **Maximum Acceptable Price**: Fair Price
   - Do not exceed calculated fair value
   - Market-aligned pricing

3. **Walk-Away Point**: >10% above fair value
   - Indicates overpriced deal
   - Risk of overpaying

### Negotiation Points Generated

The app automatically identifies leverage points based on vehicle data:

- Vehicle age and natural depreciation
- Higher than average usage (if applicable)
- Multiple previous owners
- Accident history
- Service record gaps
- Market comparison in specific city

### Negotiation Scripts

Three tone options provided:

1. **Polite**: Professional and respectful
2. **Confident**: Assertive with data backing
3. **Firm**: Direct and non-negotiable stance

## Data Storage

### AsyncStorage Schema

Evaluations are stored locally using AsyncStorage:

```typescript
interface VehicleEvaluation {
  id: string;                    // Unique identifier (timestamp)
  vehicleType: 'car' | 'bike';
  brand: string;
  model: string;
  variant?: string;
  year: number;
  kilometers: number;
  owners: number;
  fuelType: string;
  city: string;
  hasAccident: string;
  serviceRecord: string;
  estimatedPrice: number;
  priceRange: {
    min: number;
    max: number;
  };
  breakdown: PriceBreakdown;
  excellentPrice: number;
  fairPrice: number;
  overpricedPrice: number;
  date: string;                  // ISO format
}
```

**Storage Key**: `vehicle_evaluations`

## Project Architecture

### State Management

**Context Provider**: `VehicleContext.tsx`
- Uses `@nkzw/create-context-hook` for type-safe context
- Manages evaluation CRUD operations
- Syncs with AsyncStorage for persistence

**Operations:**
- `saveEvaluation()` - Saves new evaluation
- `deleteEvaluation()` - Removes evaluation by ID
- `loadEvaluations()` - Loads from AsyncStorage on mount

### Screen Flow

```
Home (index.tsx)
  ↓
Evaluate (evaluate.tsx)
  ↓ [Calculate Price]
  ↓
Results (results.tsx)
  ← [View from History]
  ↑
History (history.tsx)
```

### Key Components

#### Home Screen (`app/index.tsx`)
- Vehicle type selection (Car/Bike)
- Access to evaluation history
- Clean card-based UI

#### Evaluate Screen (`app/evaluate.tsx`)
- Dynamic form based on vehicle type
- Cascading dropdowns: Brand → Model → Variant
- Form validation
- Calls `calculateVehiclePrice()` on submit

#### Results Screen (`app/results.tsx`)
- Interactive deal score slider
- Real-time price updates
- Expandable calculation sections
- Bar chart comparison
- Negotiation assistant
- Trust & transparency notes

#### History Screen (`app/history.tsx`)
- List of past evaluations
- Swipe-to-delete functionality
- Sort by date (newest first)
- Quick navigation to saved reports

## Vehicle Data

### Supported Brands

**Cars (17 brands):**
Maruti Suzuki, Hyundai, Tata, Mahindra, Kia, Honda, Toyota, Renault, Volkswagen, Skoda, MG, Nissan, Ford, Jeep, BMW, Mercedes-Benz, Audi

**Bikes (12 brands):**
Hero, Honda, Bajaj, TVS, Royal Enfield, Yamaha, Suzuki, KTM, Kawasaki, Harley-Davidson, Jawa, Benelli

### Models and Variants

Each brand has multiple models with specific variants pre-defined. Examples:

**Maruti Swift:**
- VXi
- ZXi
- ZXi+

**Royal Enfield Classic 350:**
- Single Channel
- Dual Channel

Total coverage: 100+ models with 500+ variants

## UI/UX Features

### Real-Time Updates

The results screen updates instantly as the user interacts:

1. **Slider Interaction**: Dragging updates all values in real-time
   - Current price changes
   - Deal type label updates
   - Price breakdown recalculates
   - Bar chart highlights
   - Color scheme adapts

2. **Visual Feedback**:
   - Smooth animations on load
   - Color-coded deal types (Green/Yellow/Red)
   - Progress indicators
   - Touch feedback on all interactions

3. **Expandable Sections**:
   - Tap to expand/collapse
   - Smooth transitions
   - Preserves state

### Accessibility

- Clear labels and explanations
- High contrast colors
- Large touch targets
- Readable font sizes
- Status bar management
- Safe area handling

## Technical Stack

- **Framework**: React Native + Expo SDK 54
- **Language**: TypeScript (strict mode)
- **Routing**: Expo Router (file-based)
- **Storage**: AsyncStorage
- **State**: React Context + Hooks
- **Icons**: Lucide React Native
- **Animations**: React Native Animated API

## Future Enhancements

Potential features for future versions:

1. **Market Comparison**: Show similar vehicles currently listed
2. **Price Trends**: Historical price trends by model
3. **Insurance Calculator**: Estimate insurance costs
4. **Loan EMI Calculator**: Financing options
5. **PDF Export**: Export valuation reports
6. **Share Feature**: Share reports via WhatsApp/Email
7. **Photo Upload**: Vehicle condition assessment
8. **Location-based Dealers**: Find nearby dealers
9. **Notifications**: Price alerts for saved searches
10. **Multi-language Support**: Regional languages

## Performance Considerations

- Calculations run in <10ms on average devices
- AsyncStorage operations are async and non-blocking
- Dropdown lists use nested ScrollView for smooth scrolling
- Animations use native driver where possible
- Images optimized for mobile screens

## Testing Strategy

### Manual Testing Checklist

- [ ] Test all brands, models, variants
- [ ] Validate year input (1990 - current year)
- [ ] Validate km input (positive numbers)
- [ ] Test all city selections
- [ ] Verify calculation accuracy
- [ ] Test AsyncStorage persistence
- [ ] Test delete functionality
- [ ] Test navigation flow
- [ ] Test on iOS and Android
- [ ] Test web compatibility

### Edge Cases

- Very old vehicles (>15 years)
- Very high mileage (>300,000 km)
- Low mileage (< expected)
- Multiple accidents
- No service history
- 4+ owners

## Disclaimers

The app includes multiple disclaimers to set proper expectations:

1. **Home Screen**: "Prices are estimates only"
2. **Evaluate Screen**: "All estimates are based on current market data"
3. **Results Screen**: Comprehensive disclaimer about accuracy and market variations

**Legal Note**: This is an estimation tool. Users should conduct thorough inspections and professional assessments before purchasing vehicles.

## Contact & Support

For questions about the app logic or implementation, refer to:
- `constants/vehicleData.ts` - Pricing algorithm
- `contexts/VehicleContext.tsx` - State management
- This documentation file

---

**Version**: 1.0.0  
**Last Updated**: 2024  
**Platform**: React Native + Expo
