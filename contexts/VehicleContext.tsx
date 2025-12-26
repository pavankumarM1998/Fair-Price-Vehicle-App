import createContextHook from '@nkzw/create-context-hook';
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { PriceBreakdown } from '@/constants/vehicleData';

export interface VehicleEvaluation {
  id: string;
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
  estimatedPrice: number;
  priceRange: {
    min: number;
    max: number;
  };
  breakdown: PriceBreakdown;
  excellentPrice: number;
  fairPrice: number;
  overpricedPrice: number;
  date: string;
}

export const [VehicleProvider, useVehicleContext] = createContextHook(() => {
  const [evaluations, setEvaluations] = useState<VehicleEvaluation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadEvaluations();
  }, []);

  const loadEvaluations = async () => {
    try {
      const stored = await AsyncStorage.getItem('vehicle_evaluations');
      if (stored) {
        setEvaluations(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Error loading evaluations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveEvaluation = async (evaluation: VehicleEvaluation) => {
    try {
      const updated = [evaluation, ...evaluations];
      setEvaluations(updated);
      await AsyncStorage.setItem('vehicle_evaluations', JSON.stringify(updated));
    } catch (error) {
      console.error('Error saving evaluation:', error);
    }
  };

  const deleteEvaluation = async (id: string) => {
    try {
      const updated = evaluations.filter(e => e.id !== id);
      setEvaluations(updated);
      await AsyncStorage.setItem('vehicle_evaluations', JSON.stringify(updated));
    } catch (error) {
      console.error('Error deleting evaluation:', error);
    }
  };

  return {
    evaluations,
    isLoading,
    saveEvaluation,
    deleteEvaluation,
  };
});
