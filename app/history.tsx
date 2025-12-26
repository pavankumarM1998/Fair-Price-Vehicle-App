import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Trash2, Eye, Calendar } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useVehicleContext } from '@/contexts/VehicleContext';

export default function HistoryScreen() {
  const { evaluations, deleteEvaluation, isLoading } = useVehicleContext();

  const handleDelete = (id: string, vehicleName: string) => {
    Alert.alert(
      'Delete Evaluation',
      `Are you sure you want to delete the evaluation for ${vehicleName}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deleteEvaluation(id),
        },
      ]
    );
  };

  const handleView = (id: string) => {
    router.push({
      pathname: '/results',
      params: { id },
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  if (isLoading) {
    return (
      <View style={styles.wrapper}>
        <LinearGradient
          colors={['#0f0f1e', '#1a1a2e', '#0f0f1e']}
          style={StyleSheet.absoluteFill}
        />
        <SafeAreaView style={styles.container} edges={['bottom']}>
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Loading...</Text>
          </View>
        </SafeAreaView>
      </View>
    );
  }

  if (evaluations.length === 0) {
    return (
      <View style={styles.wrapper}>
        <LinearGradient
          colors={['#0f0f1e', '#1a1a2e', '#0f0f1e']}
          style={StyleSheet.absoluteFill}
        />
        <SafeAreaView style={styles.container} edges={['bottom']}>
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyEmoji}>📋</Text>
            <Text style={styles.emptyTitle}>No Evaluations Yet</Text>
            <Text style={styles.emptyText}>
              Start evaluating vehicles to see your history here
            </Text>
            <TouchableOpacity
              style={styles.startButton}
              onPress={() => router.push('/evaluate')}
            >
              <Text style={styles.startButtonText}>Evaluate Vehicle</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </View>
    );
  }

  return (
    <View style={styles.wrapper}>
      <LinearGradient
        colors={['#0f0f1e', '#1a1a2e', '#0f0f1e']}
        style={StyleSheet.absoluteFill}
      />
      <SafeAreaView style={styles.container} edges={['bottom']}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Text style={styles.count}>
            {evaluations.length} {evaluations.length === 1 ? 'Evaluation' : 'Evaluations'}
          </Text>

          {evaluations.map((evaluation) => (
            <View key={evaluation.id} style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.vehicleName}>
                  {evaluation.year} {evaluation.brand} {evaluation.model}
                </Text>
                <Text style={styles.price}>
                  ₹{evaluation.estimatedPrice.toLocaleString()}
                </Text>
              </View>

              <View style={styles.cardDetails}>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Kilometers:</Text>
                  <Text style={styles.detailValue}>
                    {evaluation.kilometers.toLocaleString()} km
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>City:</Text>
                  <Text style={styles.detailValue}>
                    {evaluation.city}
                  </Text>
                </View>
              </View>

              <View style={styles.dateRow}>
                <Calendar size={14} color="#666" />
                <Text style={styles.dateText}>{formatDate(evaluation.date)}</Text>
              </View>

              <View style={styles.cardActions}>
                <TouchableOpacity
                  style={styles.viewButton}
                  onPress={() => handleView(evaluation.id)}
                >
                  <Eye size={18} color="#00d4ff" />
                  <Text style={styles.viewButtonText}>View Details</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() =>
                    handleDelete(
                      evaluation.id,
                      `${evaluation.year} ${evaluation.brand} ${evaluation.model}`
                    )
                  }
                >
                  <Trash2 size={18} color="#ff4444" />
                </TouchableOpacity>
              </View>
            </View>
          ))}
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
    padding: 20,
    paddingBottom: 40,
  },
  count: {
    fontSize: 16,
    color: '#888',
    marginBottom: 20,
    fontWeight: '600',
  },
  card: {
    backgroundColor: 'rgba(26, 26, 46, 0.8)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: 'rgba(0, 212, 255, 0.2)',
  },
  cardHeader: {
    marginBottom: 15,
  },
  vehicleName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 6,
  },
  price: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#00d4ff',
  },
  cardDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.05)',
  },
  detailRow: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 13,
    color: '#888',
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 15,
    color: '#fff',
    fontWeight: '600',
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 15,
  },
  dateText: {
    fontSize: 13,
    color: '#666',
  },
  cardActions: {
    flexDirection: 'row',
    gap: 10,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.05)',
  },
  viewButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 212, 255, 0.1)',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    gap: 8,
  },
  viewButtonText: {
    color: '#00d4ff',
    fontSize: 14,
    fontWeight: '600',
  },
  deleteButton: {
    backgroundColor: 'rgba(255, 68, 68, 0.1)',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyEmoji: {
    fontSize: 60,
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  emptyText: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 24,
  },
  startButton: {
    backgroundColor: '#00d4ff',
    paddingHorizontal: 30,
    paddingVertical: 14,
    borderRadius: 10,
  },
  startButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '700',
  },
});
