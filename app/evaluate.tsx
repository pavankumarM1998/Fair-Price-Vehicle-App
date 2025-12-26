import { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  StatusBar,
} from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronDown, ArrowLeft } from 'lucide-react-native';
import {
  carBrands,
  bikeBrands,
  carModels,
  bikeModels,
  fuelTypes,
  indianCities,
  ownershipOptions,
  serviceRecords,
  accidentHistory,
  calculateVehiclePrice,
  VehicleInput,
} from '@/constants/vehicleData';
import { useVehicleContext } from '@/contexts/VehicleContext';

export default function EvaluateScreen() {
  const { saveEvaluation } = useVehicleContext();
  const [vehicleType, setVehicleType] = useState<'car' | 'bike'>('car');
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [variant, setVariant] = useState('');
  const [year, setYear] = useState('');
  const [kilometers, setKilometers] = useState('');
  const [owners, setOwners] = useState(1);
  const [fuelType, setFuelType] = useState('petrol');
  const [city, setCity] = useState('');
  const [hasAccident, setHasAccident] = useState('no');
  const [serviceRecord, setServiceRecord] = useState('partial');

  const [showBrandDropdown, setShowBrandDropdown] = useState(false);
  const [showModelDropdown, setShowModelDropdown] = useState(false);
  const [showVariantDropdown, setShowVariantDropdown] = useState(false);
  const [showFuelDropdown, setShowFuelDropdown] = useState(false);
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const [showOwnerDropdown, setShowOwnerDropdown] = useState(false);
  const [showServiceDropdown, setShowServiceDropdown] = useState(false);
  const [showAccidentDropdown, setShowAccidentDropdown] = useState(false);

  const brands = vehicleType === 'car' ? carBrands : bikeBrands;
  const vehicleModels = vehicleType === 'car' ? carModels : bikeModels;
  const availableModels = brand && vehicleModels[brand] ? Object.keys(vehicleModels[brand].models) : [];
  const availableVariants = brand && model && vehicleModels[brand]?.models[model] ? vehicleModels[brand].models[model] : [];

  const handleEvaluate = () => {
    if (!brand || !model || !year || !kilometers || !city) {
      Alert.alert('Missing Information', 'Please fill in all required fields');
      return;
    }

    const yearNum = parseInt(year);
    const kilometersNum = parseInt(kilometers);

    if (isNaN(yearNum) || yearNum < 1990 || yearNum > new Date().getFullYear() + 1) {
      Alert.alert('Invalid Year', 'Please enter a valid year (1990 onwards)');
      return;
    }

    if (isNaN(kilometersNum) || kilometersNum < 0) {
      Alert.alert('Invalid Kilometers', 'Please enter valid kilometers');
      return;
    }

    const input: VehicleInput = {
      vehicleType,
      brand,
      model,
      variant: variant || undefined,
      engineCC: undefined,
      year: yearNum,
      kilometers: kilometersNum,
      owners,
      fuelType,
      city,
      hasAccident,
      serviceRecord,
    };

    const pricing = calculateVehiclePrice(input);

    const evaluation = {
      id: Date.now().toString(),
      vehicleType,
      brand,
      model,
      variant: variant || undefined,
      engineCC: undefined,
      year: yearNum,
      kilometers: kilometersNum,
      owners,
      fuelType,
      city,
      hasAccident,
      serviceRecord,
      estimatedPrice: pricing.estimatedPrice,
      priceRange: pricing.priceRange,
      breakdown: pricing.breakdown,
      excellentPrice: pricing.excellentPrice,
      fairPrice: pricing.fairPrice,
      overpricedPrice: pricing.overpricedPrice,
      date: new Date().toISOString(),
    };

    saveEvaluation(evaluation);
    
    router.push({
      pathname: '/results',
      params: {
        id: evaluation.id,
      },
    });
  };

  return (
    <View style={styles.wrapper}>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <ArrowLeft size={24} color="#000000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Vehicle Details</Text>
          <View style={styles.headerSpacer} />
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Text style={styles.sectionTitle}>Vehicle Information</Text>

          <View style={styles.typeSelector}>
            <TouchableOpacity
              style={[styles.typeButton, vehicleType === 'car' && styles.typeButtonActive]}
              onPress={() => {
                setVehicleType('car');
                setBrand('');
                setModel('');
                setVariant('');
              }}
            >
              <Text style={[styles.typeButtonText, vehicleType === 'car' && styles.typeButtonTextActive]}>
                Car
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.typeButton, vehicleType === 'bike' && styles.typeButtonActive]}
              onPress={() => {
                setVehicleType('bike');
                setBrand('');
                setModel('');
                setVariant('');
              }}
            >
              <Text style={[styles.typeButtonText, vehicleType === 'bike' && styles.typeButtonTextActive]}>
                Bike
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Brand *</Text>
            <TouchableOpacity
              style={styles.dropdown}
              onPress={() => setShowBrandDropdown(!showBrandDropdown)}
            >
              <Text style={brand ? styles.dropdownText : styles.placeholderText}>
                {brand || 'Select brand'}
              </Text>
              <ChevronDown size={20} color="#666" />
            </TouchableOpacity>
            {showBrandDropdown && (
              <View style={styles.dropdownList}>
                <ScrollView style={styles.dropdownScroll} nestedScrollEnabled>
                  {brands.map((b: string) => (
                    <TouchableOpacity
                      key={b}
                      style={styles.dropdownItem}
                      onPress={() => {
                        setBrand(b);
                        setModel('');
                        setVariant('');
                        setShowBrandDropdown(false);
                      }}
                    >
                      <Text style={styles.dropdownItemText}>{b}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Model *</Text>
            <TouchableOpacity
              style={styles.dropdown}
              onPress={() => {
                if (brand && availableModels.length > 0) {
                  setShowModelDropdown(!showModelDropdown);
                } else {
                  Alert.alert('Select Brand First', 'Please select a brand to see available models');
                }
              }}
            >
              <Text style={model ? styles.dropdownText : styles.placeholderText}>
                {model || 'Select model'}
              </Text>
              <ChevronDown size={20} color="#666" />
            </TouchableOpacity>
            {showModelDropdown && availableModels.length > 0 && (
              <View style={styles.dropdownList}>
                <ScrollView style={styles.dropdownScroll} nestedScrollEnabled>
                  {availableModels.map((m: string) => (
                    <TouchableOpacity
                      key={m}
                      style={styles.dropdownItem}
                      onPress={() => {
                        setModel(m);
                        setVariant('');
                        setShowModelDropdown(false);
                      }}
                    >
                      <Text style={styles.dropdownItemText}>{m}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}
          </View>

          {vehicleType === 'car' && (
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Variant</Text>
              <TouchableOpacity
                style={styles.dropdown}
                onPress={() => {
                  if (model && availableVariants.length > 0) {
                    setShowVariantDropdown(!showVariantDropdown);
                  } else if (!model) {
                    Alert.alert('Select Model First', 'Please select a model to see available variants');
                  }
                }}
              >
                <Text style={variant ? styles.dropdownText : styles.placeholderText}>
                  {variant || 'Select variant'}
                </Text>
                <ChevronDown size={20} color="#666" />
              </TouchableOpacity>
              {showVariantDropdown && availableVariants.length > 0 && (
                <View style={styles.dropdownList}>
                  <ScrollView style={styles.dropdownScroll} nestedScrollEnabled>
                    {availableVariants.map((v: string) => (
                      <TouchableOpacity
                        key={v}
                        style={styles.dropdownItem}
                        onPress={() => {
                          setVariant(v);
                          setShowVariantDropdown(false);
                        }}
                      >
                        <Text style={styles.dropdownItemText}>{v}</Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              )}
            </View>
          )}

          {vehicleType === 'bike' && (
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Variant</Text>
              <TouchableOpacity
                style={styles.dropdown}
                onPress={() => {
                  if (model && availableVariants.length > 0) {
                    setShowVariantDropdown(!showVariantDropdown);
                  } else if (!model) {
                    Alert.alert('Select Model First', 'Please select a model to see available variants');
                  }
                }}
              >
                <Text style={variant ? styles.dropdownText : styles.placeholderText}>
                  {variant || 'Select variant'}
                </Text>
                <ChevronDown size={20} color="#666" />
              </TouchableOpacity>
              {showVariantDropdown && availableVariants.length > 0 && (
                <View style={styles.dropdownList}>
                  <ScrollView style={styles.dropdownScroll} nestedScrollEnabled>
                    {availableVariants.map((v: string) => (
                      <TouchableOpacity
                        key={v}
                        style={styles.dropdownItem}
                        onPress={() => {
                          setVariant(v);
                          setShowVariantDropdown(false);
                        }}
                      >
                        <Text style={styles.dropdownItemText}>{v}</Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              )}
            </View>
          )}

          <View style={styles.row}>
            <View style={[styles.inputGroup, styles.halfWidth]}>
              <Text style={styles.label}>Registration Year *</Text>
              <TextInput
                style={styles.input}
                value={year}
                onChangeText={setYear}
                placeholder="2020"
                placeholderTextColor="#666"
                keyboardType="number-pad"
                maxLength={4}
              />
            </View>

            <View style={[styles.inputGroup, styles.halfWidth]}>
              <Text style={styles.label}>Kilometers Driven *</Text>
              <TextInput
                style={styles.input}
                value={kilometers}
                onChangeText={setKilometers}
                placeholder="50000"
                placeholderTextColor="#666"
                keyboardType="number-pad"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Number of Owners *</Text>
            <TouchableOpacity
              style={styles.dropdown}
              onPress={() => setShowOwnerDropdown(!showOwnerDropdown)}
            >
              <Text style={styles.dropdownText}>
                {ownershipOptions.find(o => o.value === owners)?.label || 'Select'}
              </Text>
              <ChevronDown size={20} color="#666" />
            </TouchableOpacity>
            {showOwnerDropdown && (
              <View style={styles.dropdownList}>
                {ownershipOptions.map((o) => (
                  <TouchableOpacity
                    key={o.value}
                    style={styles.dropdownItem}
                    onPress={() => {
                      setOwners(o.value);
                      setShowOwnerDropdown(false);
                    }}
                  >
                    <Text style={styles.dropdownItemText}>{o.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Fuel Type *</Text>
            <TouchableOpacity
              style={styles.dropdown}
              onPress={() => setShowFuelDropdown(!showFuelDropdown)}
            >
              <Text style={styles.dropdownText}>
                {fuelTypes.find(f => f.value === fuelType)?.label || 'Select'}
              </Text>
              <ChevronDown size={20} color="#666" />
            </TouchableOpacity>
            {showFuelDropdown && (
              <View style={styles.dropdownList}>
                {fuelTypes.map((f) => (
                  <TouchableOpacity
                    key={f.value}
                    style={styles.dropdownItem}
                    onPress={() => {
                      setFuelType(f.value);
                      setShowFuelDropdown(false);
                    }}
                  >
                    <Text style={styles.dropdownItemText}>{f.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>City *</Text>
            <TouchableOpacity
              style={styles.dropdown}
              onPress={() => setShowCityDropdown(!showCityDropdown)}
            >
              <Text style={city ? styles.dropdownText : styles.placeholderText}>
                {city || 'Select city'}
              </Text>
              <ChevronDown size={20} color="#666" />
            </TouchableOpacity>
            {showCityDropdown && (
              <View style={styles.dropdownList}>
                <ScrollView style={styles.dropdownScroll} nestedScrollEnabled>
                  {indianCities.map((c) => (
                    <TouchableOpacity
                      key={c.name}
                      style={styles.dropdownItem}
                      onPress={() => {
                        setCity(c.name);
                        setShowCityDropdown(false);
                      }}
                    >
                      <Text style={styles.dropdownItemText}>{c.name}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Accident History *</Text>
            <TouchableOpacity
              style={styles.dropdown}
              onPress={() => setShowAccidentDropdown(!showAccidentDropdown)}
            >
              <Text style={styles.dropdownText}>
                {accidentHistory.find(a => a.value === hasAccident)?.label || 'Select'}
              </Text>
              <ChevronDown size={20} color="#666" />
            </TouchableOpacity>
            {showAccidentDropdown && (
              <View style={styles.dropdownList}>
                {accidentHistory.map((a) => (
                  <TouchableOpacity
                    key={a.value}
                    style={styles.dropdownItem}
                    onPress={() => {
                      setHasAccident(a.value);
                      setShowAccidentDropdown(false);
                    }}
                  >
                    <Text style={styles.dropdownItemText}>{a.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Service Record *</Text>
            <TouchableOpacity
              style={styles.dropdown}
              onPress={() => setShowServiceDropdown(!showServiceDropdown)}
            >
              <Text style={styles.dropdownText}>
                {serviceRecords.find(s => s.value === serviceRecord)?.label || 'Select'}
              </Text>
              <ChevronDown size={20} color="#666" />
            </TouchableOpacity>
            {showServiceDropdown && (
              <View style={styles.dropdownList}>
                {serviceRecords.map((s) => (
                  <TouchableOpacity
                    key={s.value}
                    style={styles.dropdownItem}
                    onPress={() => {
                      setServiceRecord(s.value);
                      setShowServiceDropdown(false);
                    }}
                  >
                    <Text style={styles.dropdownItemText}>{s.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          <TouchableOpacity style={styles.evaluateButton} onPress={handleEvaluate}>
            <Text style={styles.evaluateButtonText}>Calculate Fair Price</Text>
          </TouchableOpacity>

          <View style={styles.disclaimer}>
            <Text style={styles.disclaimerText}>
              💡 All estimates are based on current market data
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 20,
  },
  typeSelector: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  typeButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#D0D0D0',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
  },
  typeButtonActive: {
    borderColor: '#0066FF',
    backgroundColor: '#EBF4FF',
  },
  typeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666666',
  },
  typeButtonTextActive: {
    color: '#0066FF',
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D0D0D0',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#000000',
  },
  dropdown: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D0D0D0',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dropdownText: {
    fontSize: 16,
    color: '#000000',
  },
  placeholderText: {
    fontSize: 16,
    color: '#999999',
  },
  dropdownList: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D0D0D0',
    borderRadius: 12,
    marginTop: 8,
    maxHeight: 200,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  dropdownScroll: {
    maxHeight: 200,
  },
  dropdownItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  dropdownItemText: {
    fontSize: 16,
    color: '#000000',
  },
  row: {
    flexDirection: 'row',
    gap: 15,
  },
  halfWidth: {
    flex: 1,
  },
  evaluateButton: {
    backgroundColor: '#0066FF',
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#0066FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: 16,
  },
  evaluateButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
  disclaimer: {
    backgroundColor: '#FFF9E6',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  disclaimerText: {
    fontSize: 13,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 20,
  },
});
