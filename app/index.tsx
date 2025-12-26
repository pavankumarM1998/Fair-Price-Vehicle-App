import { StyleSheet, Text, View, TouchableOpacity, ScrollView, StatusBar } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Car, Bike, History, Clock } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useVehicleContext } from '@/contexts/VehicleContext';
export default function HomeScreen() {
  const { evaluations } = useVehicleContext();
  const recentEvaluations = evaluations.slice(0, 3);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <View style={styles.wrapper}>
      <StatusBar barStyle="light-content" />
      <LinearGradient
        colors={['#0066FF', '#0099FF', '#00CCFF']}
        style={StyleSheet.absoluteFill}
      />
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <Text style={styles.title}>Fair Vehicle Price</Text>
            <Text style={styles.subtitle}>Get instant valuation for used cars & bikes</Text>
          </View>

          <View style={styles.cardsContainer}>
            <TouchableOpacity
              style={styles.vehicleCard}
              activeOpacity={0.9}
              onPress={() => router.push('/evaluate')}
            >
              <View style={styles.iconCircle}>
                <Car size={56} color="#0066FF" strokeWidth={2} />
              </View>
              <Text style={styles.vehicleTitle}>Car</Text>
              <Text style={styles.vehicleSubtitle}>Value your used{"\n"}car instantly</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.vehicleCard}
              activeOpacity={0.9}
              onPress={() => router.push('/evaluate')}
            >
              <View style={styles.iconCircle}>
                <Bike size={56} color="#0066FF" strokeWidth={2} />
              </View>
              <Text style={styles.vehicleTitle}>Bike</Text>
              <Text style={styles.vehicleSubtitle}>Value your used{"\n"}bike instantly</Text>
            </TouchableOpacity>
          </View>

          {recentEvaluations.length > 0 && (
            <View style={styles.historySection}>
              <View style={styles.historySectionHeader}>
                <View style={styles.historyTitleRow}>
                  <History size={20} color="#FFFFFF" />
                  <Text style={styles.historySectionTitle}>Recent Evaluations</Text>
                </View>
                <TouchableOpacity onPress={() => router.push('/history')}>
                  <Text style={styles.viewAllText}>View All</Text>
                </TouchableOpacity>
              </View>

              {recentEvaluations.map((evaluation) => (
                <TouchableOpacity
                  key={evaluation.id}
                  style={styles.historyCard}
                  activeOpacity={0.8}
                  onPress={() => router.push({ pathname: '/results', params: { id: evaluation.id } })}
                >
                  <View style={styles.historyCardContent}>
                    <View style={styles.historyCardHeader}>
                      <Text style={styles.historyVehicleName}>
                        {evaluation.brand} {evaluation.model}
                      </Text>
                      <Text style={styles.historyPrice}>
                        ₹{(evaluation.estimatedPrice / 100000).toFixed(2)}L
                      </Text>
                    </View>
                    <View style={styles.historyCardDetails}>
                      <Text style={styles.historyDetail}>
                        {evaluation.year} • {evaluation.kilometers.toLocaleString()} km
                      </Text>
                      <View style={styles.historyDateRow}>
                        <Clock size={12} color="#FFFFFF" opacity={0.7} />
                        <Text style={styles.historyDate}>{formatDate(evaluation.date)}</Text>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}

          <View style={styles.disclaimerBox}>
            <Text style={styles.disclaimerText}>
              All prices are estimates based on market trends and vehicle condition. Actual prices may vary.
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
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 60,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: '#FFFFFF',
    opacity: 0.9,
    textAlign: 'center',
  },
  cardsContainer: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 40,
  },
  vehicleCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  iconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#EBF4FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  vehicleTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 8,
  },
  vehicleSubtitle: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 20,
  },
  disclaimerBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    borderRadius: 16,
    padding: 20,
    marginTop: 20,
  },
  disclaimerText: {
    fontSize: 13,
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 20,
  },
  historySection: {
    marginBottom: 24,
  },
  historySectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  historyTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  historySectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  viewAllText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    opacity: 0.8,
  },
  historyCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  historyCardContent: {
    gap: 8,
  },
  historyCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  historyVehicleName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  historyPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  historyCardDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  historyDetail: {
    fontSize: 13,
    color: '#FFFFFF',
    opacity: 0.8,
  },
  historyDateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  historyDate: {
    fontSize: 12,
    color: '#FFFFFF',
    opacity: 0.7,
  },
});
