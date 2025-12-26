import { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, Animated, TouchableOpacity, StatusBar } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  Calendar, 
  Gauge, 
  Users, 
  AlertCircle,
  Wrench,
  MapPin,
  ChevronDown,
  ChevronUp,
  Info,
  MessageSquare,
  DollarSign,
  ArrowLeft,
} from 'lucide-react-native';
import { useVehicleContext } from '@/contexts/VehicleContext';

type DealType = 'excellent' | 'fair' | 'overpriced';

export default function ResultsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { evaluations } = useVehicleContext();
  const [fadeAnim] = useState(new Animated.Value(0));
  const [scaleAnim] = useState(new Animated.Value(0.8));
  const [dealScore, setDealScore] = useState(50);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    calculation: true,
  });

  const evaluation = evaluations.find(e => e.id === id);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, scaleAnim]);

  if (!evaluation) {
    return (
      <View style={styles.wrapper}>
        <StatusBar barStyle="dark-content" />
        <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>Evaluation not found</Text>
          </View>
        </SafeAreaView>
      </View>
    );
  }

  const getDealType = (): DealType => {
    if (dealScore <= 33) return 'excellent';
    if (dealScore <= 66) return 'fair';
    return 'overpriced';
  };

  const dealType = getDealType();

  const getCurrentPrice = () => {
    if (dealType === 'excellent') return evaluation.excellentPrice;
    if (dealType === 'fair') return evaluation.fairPrice;
    return evaluation.overpricedPrice;
  };

  const getDealColor = () => {
    if (dealType === 'excellent') return '#00ff88';
    if (dealType === 'fair') return '#ffc800';
    return '#ff4444';
  };

  const getDealLabel = () => {
    if (dealType === 'excellent') return 'Excellent Price';
    if (dealType === 'fair') return 'Fair Price';
    return 'Overpriced';
  };

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const currentYear = new Date().getFullYear();
  const age = currentYear - evaluation.year;
  const expectedKm = age * 12000;

  const getDealBreakdown = () => {
    const currentPrice = getCurrentPrice();
    if (dealType === 'excellent') {
      return [
        { label: 'Base Fair Value', amount: evaluation.fairPrice, positive: false },
        { label: 'Negotiation Benefit', amount: -(evaluation.fairPrice - currentPrice), positive: true },
        { label: 'Urgent Seller Discount', amount: 0, positive: true },
      ];
    }
    if (dealType === 'fair') {
      return [
        { label: 'Original Price', amount: evaluation.breakdown.originalPrice, positive: false },
        { label: 'Standard Market Depreciation', amount: -evaluation.breakdown.ageDepreciation, positive: true },
      ];
    }
    return [
      { label: 'Base Fair Value', amount: evaluation.fairPrice, positive: false },
      { label: 'Dealer Margin', amount: (currentPrice - evaluation.fairPrice) * 0.6, positive: false },
      { label: 'High Demand Premium', amount: (currentPrice - evaluation.fairPrice) * 0.4, positive: false },
    ];
  };

  const maxPrice = Math.max(evaluation.excellentPrice, evaluation.fairPrice, evaluation.overpricedPrice);

  return (
    <View style={styles.wrapper}>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <ArrowLeft size={24} color="#000000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Valuation Report</Text>
          <View style={styles.headerSpacer} />
        </View>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Animated.View
            style={[
              styles.mainCard,
              {
                opacity: fadeAnim,
                transform: [{ scale: scaleAnim }],
              },
            ]}
          >
            <View style={styles.vehicleHeader}>
              <Text style={styles.vehicleTitle}>
                {evaluation.year} {evaluation.brand} {evaluation.model}
              </Text>
              {evaluation.variant && (
                <Text style={styles.vehicleVariant}>{evaluation.variant}</Text>
              )}
            </View>

            <View style={[styles.dealBadge, { backgroundColor: getDealColor() + '20', borderColor: getDealColor() }]}>
              <Text style={[styles.dealLabel, { color: getDealColor() }]}>{getDealLabel()}</Text>
            </View>

            <Text style={[styles.currentPrice, { color: getDealColor() }]}>
              ₹{getCurrentPrice().toLocaleString()}
            </Text>

            <Text style={styles.priceRangeLabel}>Market Price Range</Text>
            <Text style={styles.priceRange}>
              ₹{evaluation.priceRange.min.toLocaleString()} - ₹{evaluation.priceRange.max.toLocaleString()}
            </Text>

            <Text style={styles.explanation}>
              Based on vehicle age, usage, ownership, condition, and local demand, this is a realistic price for this vehicle.
            </Text>
          </Animated.View>

          <View style={styles.sliderCard}>
            <Text style={styles.sectionTitle}>Interactive Deal Score</Text>
            <Text style={styles.sliderDescription}>
              Drag the slider to explore different price scenarios
            </Text>

            <View style={styles.sliderContainer}>
              <View style={styles.sliderTrack}>
                <View style={[styles.sliderFill, { width: `${dealScore}%`, backgroundColor: getDealColor() }]} />
              </View>
              <View
                style={styles.sliderThumbWrapper}
                onStartShouldSetResponder={() => true}
                onResponderMove={(e) => {
                  const touch = e.nativeEvent;
                  const width = 300;
                  const percentage = Math.max(0, Math.min(100, (touch.locationX / width) * 100));
                  setDealScore(Math.round(percentage));
                }}
              >
                <View style={[styles.sliderThumb, { left: `${dealScore}%`, backgroundColor: getDealColor() }]} />
              </View>
            </View>

            <View style={styles.sliderLabels}>
              <View style={styles.sliderLabel}>
                <View style={[styles.labelDot, { backgroundColor: '#00ff88' }]} />
                <Text style={styles.labelText}>0-33: Excellent</Text>
              </View>
              <View style={styles.sliderLabel}>
                <View style={[styles.labelDot, { backgroundColor: '#ffc800' }]} />
                <Text style={styles.labelText}>34-66: Fair</Text>
              </View>
              <View style={styles.sliderLabel}>
                <View style={[styles.labelDot, { backgroundColor: '#ff4444' }]} />
                <Text style={styles.labelText}>67-100: Overpriced</Text>
              </View>
            </View>
          </View>

          <View style={styles.chartCard}>
            <Text style={styles.sectionTitle}>Price Comparison</Text>
            <View style={styles.chart}>
              <View style={styles.chartBar}>
                <Text style={styles.chartLabel}>Excellent</Text>
                <View style={styles.barContainer}>
                  <View
                    style={[
                      styles.bar,
                      {
                        width: `${(evaluation.excellentPrice / maxPrice) * 100}%`,
                        backgroundColor: dealType === 'excellent' ? '#00ff88' : 'rgba(0, 255, 136, 0.3)',
                      },
                    ]}
                  />
                </View>
                <Text style={styles.chartValue}>₹{evaluation.excellentPrice.toLocaleString()}</Text>
              </View>

              <View style={styles.chartBar}>
                <Text style={styles.chartLabel}>Fair</Text>
                <View style={styles.barContainer}>
                  <View
                    style={[
                      styles.bar,
                      {
                        width: `${(evaluation.fairPrice / maxPrice) * 100}%`,
                        backgroundColor: dealType === 'fair' ? '#ffc800' : 'rgba(255, 200, 0, 0.3)',
                      },
                    ]}
                  />
                </View>
                <Text style={styles.chartValue}>₹{evaluation.fairPrice.toLocaleString()}</Text>
              </View>

              <View style={styles.chartBar}>
                <Text style={styles.chartLabel}>Overpriced</Text>
                <View style={styles.barContainer}>
                  <View
                    style={[
                      styles.bar,
                      {
                        width: `${(evaluation.overpricedPrice / maxPrice) * 100}%`,
                        backgroundColor: dealType === 'overpriced' ? '#ff4444' : 'rgba(255, 68, 68, 0.3)',
                      },
                    ]}
                  />
                </View>
                <Text style={styles.chartValue}>₹{evaluation.overpricedPrice.toLocaleString()}</Text>
              </View>
            </View>
          </View>

          <TouchableOpacity
            style={styles.expandableCard}
            onPress={() => toggleSection('calculation')}
            activeOpacity={0.8}
          >
            <View style={styles.expandableHeader}>
              <Text style={styles.sectionTitle}>Detailed Price Calculation</Text>
              {expandedSections.calculation ? (
                <ChevronUp size={24} color="#00d4ff" />
              ) : (
                <ChevronDown size={24} color="#00d4ff" />
              )}
            </View>

            {expandedSections.calculation && (
              <View style={styles.expandedContent}>
                <View style={styles.calculationStep}>
                  <View style={styles.stepHeader}>
                    <DollarSign size={20} color="#00d4ff" />
                    <Text style={styles.stepTitle}>A. Original Price</Text>
                  </View>
                  <View style={styles.priceRow}>
                    <Text style={styles.stepValue}>₹{evaluation.breakdown.originalPrice.toLocaleString()}</Text>
                    <View style={styles.badge}>
                      <Text style={styles.badgeText}>Starting Point</Text>
                    </View>
                  </View>
                  <View style={styles.progressBarContainer}>
                    <View style={[styles.progressBar, { width: '100%', backgroundColor: '#00d4ff' }]} />
                  </View>
                  <Text style={styles.stepExplanation}>
                    Base ex-showroom/on-road price at the time of purchase. This is the starting point for all calculations.
                  </Text>
                </View>

                <View style={styles.calculationStep}>
                  <View style={styles.stepHeader}>
                    <Calendar size={20} color="#ff4444" />
                    <Text style={styles.stepTitle}>B. Age Depreciation</Text>
                  </View>
                  <View style={styles.priceRow}>
                    <Text style={[styles.stepValue, styles.negativeValue]}>
                      -₹{evaluation.breakdown.ageDepreciation.toLocaleString()}
                    </Text>
                    <View style={[styles.badge, styles.negativeBadge]}>
                      <Text style={[styles.badgeText, styles.negativeBadgeText]}>-{((evaluation.breakdown.ageDepreciation / evaluation.breakdown.originalPrice) * 100).toFixed(1)}%</Text>
                    </View>
                  </View>
                  <View style={styles.progressBarContainer}>
                    <View style={[styles.progressBar, { width: `${(evaluation.breakdown.ageDepreciation / evaluation.breakdown.originalPrice) * 100}%`, backgroundColor: '#ff4444' }]} />
                  </View>
                  <View style={styles.detailsCard}>
                    <Text style={styles.stepDetail}>• Vehicle Age: {age} years</Text>
                    <Text style={styles.stepDetail}>• Depreciation: Year 1 (15%), Year 2 (10%), Year 3+ (8% per year)</Text>
                    <Text style={styles.stepDetail}>• Price after this step: ₹{(evaluation.breakdown.originalPrice - evaluation.breakdown.ageDepreciation).toLocaleString()}</Text>
                  </View>
                  <Text style={styles.stepExplanation}>
                    Cars lose value every year due to wear, newer models entering the market, and general aging of components.
                  </Text>
                </View>

                <View style={styles.calculationStep}>
                  <View style={styles.stepHeader}>
                    <Gauge size={20} color={evaluation.breakdown.usageAdjustment < 0 ? '#ff4444' : '#00ff88'} />
                    <Text style={styles.stepTitle}>C. Usage (Kilometers Driven)</Text>
                  </View>
                  <View style={styles.priceRow}>
                    <Text style={[styles.stepValue, evaluation.breakdown.usageAdjustment < 0 && styles.negativeValue]}>
                      {evaluation.breakdown.usageAdjustment >= 0 ? '+' : ''}₹{Math.abs(evaluation.breakdown.usageAdjustment).toLocaleString()}
                    </Text>
                    <View style={[styles.badge, evaluation.breakdown.usageAdjustment < 0 ? styles.negativeBadge : styles.positiveBadge]}>
                      <Text style={[styles.badgeText, evaluation.breakdown.usageAdjustment < 0 ? styles.negativeBadgeText : styles.positiveBadgeText]}>
                        {evaluation.breakdown.usageAdjustment >= 0 ? '+' : ''}{((Math.abs(evaluation.breakdown.usageAdjustment) / (evaluation.breakdown.originalPrice - evaluation.breakdown.ageDepreciation)) * 100).toFixed(1)}%
                      </Text>
                    </View>
                  </View>
                  <View style={styles.progressBarContainer}>
                    <View style={[styles.progressBar, { width: `${Math.min(100, (Math.abs(evaluation.kilometers - expectedKm) / expectedKm) * 100)}%`, backgroundColor: evaluation.breakdown.usageAdjustment < 0 ? '#ff4444' : '#00ff88' }]} />
                  </View>
                  <View style={styles.detailsCard}>
                    <Text style={styles.stepDetail}>• Expected km for {age} years: {expectedKm.toLocaleString()} km</Text>
                    <Text style={styles.stepDetail}>• Actual km driven: {evaluation.kilometers.toLocaleString()} km</Text>
                    <Text style={styles.stepDetail}>• Difference: {Math.abs(evaluation.kilometers - expectedKm).toLocaleString()} km {evaluation.kilometers > expectedKm ? '(excess)' : '(below expected)'}</Text>
                    <Text style={styles.stepDetail}>• Price after this step: ₹{(evaluation.breakdown.originalPrice - evaluation.breakdown.ageDepreciation + evaluation.breakdown.usageAdjustment).toLocaleString()}</Text>
                  </View>
                  <Text style={styles.stepExplanation}>
                    Higher usage increases engine and component wear, reducing value. Lower usage can maintain value better.
                  </Text>
                </View>

                <View style={styles.calculationStep}>
                  <View style={styles.stepHeader}>
                    <Users size={20} color="#ff4444" />
                    <Text style={styles.stepTitle}>D. Ownership Impact</Text>
                  </View>
                  <View style={styles.priceRow}>
                    <Text style={[styles.stepValue, evaluation.breakdown.ownershipAdjustment < 0 && styles.negativeValue]}>
                      {evaluation.breakdown.ownershipAdjustment >= 0 ? '+' : ''}₹{Math.abs(evaluation.breakdown.ownershipAdjustment).toLocaleString()}
                    </Text>
                    <View style={[styles.badge, styles.negativeBadge]}>
                      <Text style={[styles.badgeText, styles.negativeBadgeText]}>
                        {evaluation.breakdown.ownershipAdjustment >= 0 ? '+' : ''}{evaluation.owners === 1 ? '0' : evaluation.owners === 2 ? '-8' : evaluation.owners === 3 ? '-15' : '-22'}%
                      </Text>
                    </View>
                  </View>
                  <View style={styles.progressBarContainer}>
                    <View style={[styles.progressBar, { width: `${(evaluation.owners - 1) * 25}%`, backgroundColor: '#ff4444' }]} />
                  </View>
                  <View style={styles.detailsCard}>
                    <Text style={styles.stepDetail}>• Number of owners: {evaluation.owners}</Text>
                    <Text style={styles.stepDetail}>• Owner rating: {evaluation.owners === 1 ? 'Excellent (1st owner)' : evaluation.owners === 2 ? 'Good (2nd owner)' : evaluation.owners === 3 ? 'Fair (3rd owner)' : 'Poor (4th+ owner)'}</Text>
                    <Text style={styles.stepDetail}>• Price after this step: ₹{(evaluation.breakdown.originalPrice - evaluation.breakdown.ageDepreciation + evaluation.breakdown.usageAdjustment + evaluation.breakdown.ownershipAdjustment).toLocaleString()}</Text>
                  </View>
                  <Text style={styles.stepExplanation}>
                    More owners usually reduce buyer trust and resale value. First-owner vehicles command premium prices.
                  </Text>
                </View>

                <View style={styles.calculationStep}>
                  <View style={styles.stepHeader}>
                    <AlertCircle size={20} color="#ff4444" />
                    <Text style={styles.stepTitle}>E. Condition & History</Text>
                  </View>
                  <Text style={[styles.stepValue, evaluation.breakdown.accidentAdjustment < 0 && styles.negativeValue]}>
                    {evaluation.breakdown.accidentAdjustment >= 0 ? '+' : ''}₹{Math.abs(evaluation.breakdown.accidentAdjustment).toLocaleString()}
                  </Text>
                  <Text style={styles.stepDetail}>Accident History: {evaluation.hasAccident === 'no' ? 'Clean' : evaluation.hasAccident === 'minor' ? 'Minor' : 'Major'}</Text>
                  <Text style={styles.stepExplanation}>
                    Accident history significantly impacts value due to potential structural damage and reduced buyer confidence.
                  </Text>
                </View>

                <View style={styles.calculationStep}>
                  <View style={styles.stepHeader}>
                    <Wrench size={20} color={evaluation.breakdown.serviceAdjustment > 0 ? '#00ff88' : '#ff4444'} />
                    <Text style={styles.stepTitle}>F. Service Record</Text>
                  </View>
                  <Text style={[styles.stepValue, evaluation.breakdown.serviceAdjustment < 0 && styles.negativeValue]}>
                    {evaluation.breakdown.serviceAdjustment >= 0 ? '+' : ''}₹{Math.abs(evaluation.breakdown.serviceAdjustment).toLocaleString()}
                  </Text>
                  <Text style={styles.stepDetail}>Service History: {evaluation.serviceRecord === 'full' ? 'Complete' : evaluation.serviceRecord === 'partial' ? 'Partial' : 'None'}</Text>
                  <Text style={styles.stepExplanation}>
                    Full service history proves proper maintenance and increases buyer confidence, commanding higher prices.
                  </Text>
                </View>

                <View style={styles.calculationStep}>
                  <View style={styles.stepHeader}>
                    <MapPin size={20} color="#00d4ff" />
                    <Text style={styles.stepTitle}>G. City Demand Adjustment</Text>
                  </View>
                  <Text style={[styles.stepValue, evaluation.breakdown.cityDemandAdjustment < 0 && styles.negativeValue]}>
                    {evaluation.breakdown.cityDemandAdjustment >= 0 ? '+' : ''}₹{Math.abs(evaluation.breakdown.cityDemandAdjustment).toLocaleString()}
                  </Text>
                  <Text style={styles.stepDetail}>City: {evaluation.city}</Text>
                  <Text style={styles.stepExplanation}>
                    Some vehicles sell faster and at higher prices in certain cities due to local demand, infrastructure, and buyer preferences.
                  </Text>
                </View>

                <View style={[styles.calculationStep, styles.finalStep]}>
                  <Text style={styles.finalLabel}>Final Calculated Price</Text>
                  <Text style={styles.finalPrice}>₹{evaluation.fairPrice.toLocaleString()}</Text>
                </View>
              </View>
            )}
          </TouchableOpacity>

          <View style={styles.breakdownCard}>
            <Text style={styles.sectionTitle}>Current Deal Breakdown</Text>
            {getDealBreakdown().map((item, index) => (
              <View key={index} style={styles.breakdownRow}>
                <Text style={styles.breakdownLabel}>{item.label}</Text>
                <Text style={[styles.breakdownValue, item.positive ? styles.positiveBreakdown : styles.negativeBreakdown]}>
                  {item.positive && item.amount !== 0 ? '-' : '+'}₹{Math.abs(item.amount).toLocaleString()}
                </Text>
              </View>
            ))}
            <View style={styles.breakdownDivider} />
            <View style={styles.breakdownRow}>
              <Text style={styles.breakdownTotalLabel}>Your Price</Text>
              <Text style={[styles.breakdownTotalValue, { color: getDealColor() }]}>
                ₹{getCurrentPrice().toLocaleString()}
              </Text>
            </View>
          </View>

          <View style={styles.negotiationCard}>
            <View style={styles.negotiationHeader}>
              <MessageSquare size={24} color="#00d4ff" />
              <Text style={styles.sectionTitle}>Negotiation Assistant</Text>
            </View>

            <View style={styles.priceGuide}>
              <View style={styles.guideRow}>
                <Text style={styles.guideLabel}>Smart Starting Offer</Text>
                <Text style={styles.guideValue}>₹{evaluation.excellentPrice.toLocaleString()}</Text>
              </View>
              <View style={styles.guideRow}>
                <Text style={styles.guideLabel}>Do Not Pay Above</Text>
                <Text style={[styles.guideValue, styles.maxPrice]}>₹{evaluation.fairPrice.toLocaleString()}</Text>
              </View>
            </View>

            <View style={styles.reasonsBox}>
              <Text style={styles.reasonsTitle}>Negotiation Points:</Text>
              {age > 3 && (
                <Text style={styles.reasonItem}>• Vehicle is {age} years old with natural depreciation</Text>
              )}
              {evaluation.kilometers > expectedKm && (
                <Text style={styles.reasonItem}>
                  • Higher than average usage ({Math.round(((evaluation.kilometers - expectedKm) / expectedKm) * 100)}% more than expected)
                </Text>
              )}
              {evaluation.owners > 1 && (
                <Text style={styles.reasonItem}>• {evaluation.owners} previous owners affects resale value</Text>
              )}
              {evaluation.hasAccident !== 'no' && (
                <Text style={styles.reasonItem}>• Accident history impacts market value</Text>
              )}
              <Text style={styles.reasonItem}>
                • Similar vehicles in {evaluation.city} are selling for ₹{evaluation.priceRange.min.toLocaleString()}-₹{evaluation.priceRange.max.toLocaleString()}
              </Text>
            </View>

            <View style={styles.scriptBox}>
              <Text style={styles.scriptTitle}>Polite Negotiation Script:</Text>
              <Text style={styles.scriptText}>
                &quot;I&apos;ve researched the market value for this {evaluation.year} {evaluation.brand} {evaluation.model}. 
                Considering its {evaluation.kilometers.toLocaleString()}km usage and {age}-year age, 
                similar vehicles are selling for around ₹{evaluation.fairPrice.toLocaleString()}. 
                Would you consider ₹{evaluation.excellentPrice.toLocaleString()}?&quot;
              </Text>
            </View>

            <View style={styles.warningBox}>
              <Info size={18} color="#ffc800" />
              <Text style={styles.warningText}>
                If the seller does not agree within ₹{evaluation.priceRange.min.toLocaleString()}-₹{evaluation.priceRange.max.toLocaleString()} range, 
                this deal may not be financially safe.
              </Text>
            </View>
          </View>

          <View style={styles.trustCard}>
            <View style={styles.trustHeader}>
              <Info size={20} color="#00d4ff" />
              <Text style={styles.trustTitle}>Trust & Transparency</Text>
            </View>
            <Text style={styles.trustText}>
              • This is an estimated price, not an exact guarantee
            </Text>
            <Text style={styles.trustText}>
              • Prices vary by seller urgency and negotiation skills
            </Text>
            <Text style={styles.trustText}>
              • Our logic is based on Indian used vehicle market patterns
            </Text>
            <Text style={styles.trustText}>
              • Always inspect the vehicle thoroughly before purchase
            </Text>
          </View>

          <View style={styles.disclaimerCard}>
            <Text style={styles.disclaimerText}>
              ⚠️ Disclaimer: Prices are estimates only. Actual market value may vary based on vehicle condition, 
              documentation, market demand, and seller circumstances. Always conduct a thorough inspection before purchasing.
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
  },
  headerSpacer: {
    width: 32,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 18,
    color: '#666666',
  },
  mainCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  vehicleHeader: {
    marginBottom: 16,
  },
  vehicleTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 4,
  },
  vehicleVariant: {
    fontSize: 16,
    color: '#666666',
  },
  dealBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 2,
    marginBottom: 16,
  },
  dealLabel: {
    fontSize: 14,
    fontWeight: '700',
  },
  currentPrice: {
    fontSize: 42,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  priceRangeLabel: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 4,
  },
  priceRange: {
    fontSize: 16,
    color: '#0066FF',
    fontWeight: '600',
    marginBottom: 16,
  },
  explanation: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 22,
  },
  sliderCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 8,
  },
  sliderDescription: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 20,
  },
  sliderContainer: {
    marginBottom: 20,
  },
  sliderTrack: {
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  sliderFill: {
    height: '100%',
    borderRadius: 4,
  },
  sliderThumbWrapper: {
    height: 30,
    marginTop: -19,
  },
  sliderThumb: {
    position: 'absolute',
    width: 24,
    height: 24,
    borderRadius: 12,
    marginLeft: -12,
    top: 3,
    borderWidth: 3,
    borderColor: '#0f0f1e',
  },
  sliderLabels: {
    gap: 8,
  },
  sliderLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  labelDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  labelText: {
    fontSize: 13,
    color: '#666666',
  },
  chartCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  chart: {
    gap: 16,
  },
  chartBar: {
    gap: 8,
  },
  chartLabel: {
    fontSize: 14,
    color: '#000000',
    fontWeight: '600',
  },
  barContainer: {
    height: 32,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 8,
    overflow: 'hidden',
  },
  bar: {
    height: '100%',
    borderRadius: 8,
  },
  chartValue: {
    fontSize: 13,
    color: '#666666',
  },
  expandableCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  expandableHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  expandedContent: {
    marginTop: 20,
    gap: 20,
  },
  calculationStep: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#0066FF',
  },
  stepHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000000',
  },
  stepValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#00ff88',
    marginBottom: 8,
  },
  negativeValue: {
    color: '#ff4444',
  },
  stepDetail: {
    fontSize: 13,
    color: '#0066FF',
    marginBottom: 4,
  },
  stepExplanation: {
    fontSize: 13,
    color: '#666666',
    lineHeight: 20,
    marginTop: 8,
  },
  finalStep: {
    backgroundColor: '#EBF4FF',
    borderLeftColor: '#0066FF',
  },
  finalLabel: {
    fontSize: 16,
    color: '#0066FF',
    fontWeight: '600',
    marginBottom: 8,
  },
  finalPrice: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#0066FF',
  },
  breakdownCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  breakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  breakdownLabel: {
    fontSize: 14,
    color: '#666666',
  },
  breakdownValue: {
    fontSize: 15,
    fontWeight: '600',
  },
  positiveBreakdown: {
    color: '#00ff88',
  },
  negativeBreakdown: {
    color: '#ff4444',
  },
  breakdownDivider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginVertical: 12,
  },
  breakdownTotalLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000000',
  },
  breakdownTotalValue: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  negotiationCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  negotiationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  priceGuide: {
    backgroundColor: '#EBF4FF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  guideRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  guideLabel: {
    fontSize: 14,
    color: '#0066FF',
    fontWeight: '600',
  },
  guideValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#00ff88',
  },
  maxPrice: {
    color: '#ffc800',
  },
  reasonsBox: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  reasonsTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 8,
  },
  reasonItem: {
    fontSize: 13,
    color: '#666666',
    lineHeight: 20,
    marginBottom: 4,
  },
  scriptBox: {
    backgroundColor: 'rgba(0, 255, 136, 0.05)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#00ff88',
  },
  scriptTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#00ff88',
    marginBottom: 8,
  },
  scriptText: {
    fontSize: 13,
    color: '#333333',
    lineHeight: 20,
  },
  warningBox: {
    flexDirection: 'row',
    gap: 12,
    backgroundColor: 'rgba(255, 200, 0, 0.1)',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#ffc800',
  },
  warningText: {
    flex: 1,
    fontSize: 13,
    color: '#ffc800',
    lineHeight: 20,
  },
  trustCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  trustHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  trustTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0066FF',
  },
  trustText: {
    fontSize: 13,
    color: '#666666',
    lineHeight: 20,
    marginBottom: 6,
  },
  disclaimerCard: {
    backgroundColor: '#FFF9E6',
    borderRadius: 12,
    padding: 16,
  },
  disclaimerText: {
    fontSize: 12,
    color: '#666666',
    lineHeight: 18,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: 'rgba(0, 212, 255, 0.15)',
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#00d4ff',
  },
  negativeBadge: {
    backgroundColor: 'rgba(255, 68, 68, 0.15)',
  },
  negativeBadgeText: {
    color: '#ff4444',
  },
  positiveBadge: {
    backgroundColor: 'rgba(0, 255, 136, 0.15)',
  },
  positiveBadgeText: {
    color: '#00ff88',
  },
  progressBarContainer: {
    height: 6,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 12,
  },
  progressBar: {
    height: '100%',
    borderRadius: 3,
  },
  detailsCard: {
    backgroundColor: 'rgba(0, 102, 255, 0.05)',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
});
