import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { VehicleProvider } from "@/contexts/VehicleContext";

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

function RootLayoutNav() {
  return (
    <Stack screenOptions={{ headerBackTitle: "Back" }}>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen 
        name="evaluate" 
        options={{ 
          title: "Evaluate Vehicle",
          headerStyle: { backgroundColor: "#1a1a2e" },
          headerTintColor: "#fff"
        }} 
      />
      <Stack.Screen 
        name="results" 
        options={{ 
          title: "Price Estimation",
          headerStyle: { backgroundColor: "#1a1a2e" },
          headerTintColor: "#fff"
        }} 
      />
      <Stack.Screen 
        name="history" 
        options={{ 
          title: "Evaluation History",
          headerStyle: { backgroundColor: "#1a1a2e" },
          headerTintColor: "#fff"
        }} 
      />
    </Stack>
  );
}

export default function RootLayout() {
  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <VehicleProvider>
          <RootLayoutNav />
        </VehicleProvider>
      </GestureHandlerRootView>
    </QueryClientProvider>
  );
}
