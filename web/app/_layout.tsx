import { TopBar } from "@/components/TopBar";
import { useFonts } from "expo-font";
import { AuthProvider } from "@/contexts/AuthContext";
import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { View, ActivityIndicator } from "react-native";

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    HankenGrotesk: require("./assets/fonts/HankenGrotesk-VariableFont_wght.ttf"),
    "HankenGrotesk-italic": require("./assets/fonts/HankenGrotesk-Italic-VariableFont_wght.ttf"),
    // Add other weights/styles as needed
  });

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <AuthProvider>
        <TopBar />
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="+not-found" />
        </Stack>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
