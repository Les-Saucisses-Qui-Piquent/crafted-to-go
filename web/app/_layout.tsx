import { TopBar } from "@/components/TopBar";
import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function RootLayout() {

    return (
      <SafeAreaProvider>
        <TopBar />
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="+not-found" />
        </Stack>
      </SafeAreaProvider>
    );
  }