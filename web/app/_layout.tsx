import { Stack, Tabs } from "expo-router";
import { useAuth } from "@/hooks/useAuth";
import { Redirect } from "expo-router/build/link/Link";

export default function RootLayout() {
  const { user, isLoading } = useAuth();

  // Show loading screen while checking auth status
  if (isLoading) {
    return (
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="loading" options={{ title: "Loading..." }} />
      </Stack>
    );
  }

  // If not authenticated, show auth routes only
  if (!user || !["brewery", "customer", "admin"].includes(user.role)) {
    return (
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)" />
        <Stack.Screen
          name="index"
          options={{
            href: "/(auth)",
          }}
        />
      </Stack>
    );
  }

  // Handle role-based routing
  switch (user.role) {
    case "brewery":
      return (
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(brewery)" />
          <Stack.Screen name="index" redirect={true} />
        </Stack>
      );

    case "customer":
      return (
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(customer)" />
          <Stack.Screen name="index" redirect={true} />
        </Stack>
      );

    case "admin":
      return (
        <Tabs
          screenOptions={{
            headerShown: false,
            tabBarLabelStyle: { fontSize: 12 },
          }}
        >
          <Tabs.Screen
            name="(auth)"
            options={{
              title: "Authentication",
              tabBarLabel: "Auth",
              href: "/(auth)/welcome",
            }}
          />
          <Tabs.Screen
            name="(brewery)"
            options={{
              title: "Breweries",
              tabBarLabel: "Breweries",
              href: "/(brewery)/(tabs)",
            }}
          />
          <Tabs.Screen
            name="(customer)"
            options={{
              title: "Customers",
              tabBarLabel: "Customers",
              href: "/(customer)/(tabs)",
            }}
          />
        </Tabs>
      );

    default:
      // Invalid role or logged out - redirect to welcome
      return <Redirect href="/(auth)/index" />;
  }
}
