import { Stack } from "expo-router";

export default function CustomerLayout() {
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="BeerDetails" options={{ headerShown: false }} />
      <Stack.Screen name="BreweryDetails" options={{ headerShown: false }} />
    </Stack>
  );
}
