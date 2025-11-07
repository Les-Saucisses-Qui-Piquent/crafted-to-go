import { Tabs } from "expo-router";
import { View, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import TabBar from "@/components/TabBar";
import TopBar from "@/components/TopBar";
import { COLORS } from "@/constants";
import { ClientDataProvider } from "@/contexts/CostumerDataProvider";

export default function CustomerTabsLayout() {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <TopBar variant="client" />
      <ClientDataProvider>
        <Tabs
          screenOptions={{ headerShown: false }}
          tabBar={({ navigation, state }) => (
            <TabBar
              isClient={true}
              activeTab={state.routeNames[state.index]}
              onTabPress={(tabName) => navigation.navigate(tabName)}
            />
          )}
        >
          <Tabs.Screen name="index" options={{ title: "index" }} />
          <Tabs.Screen name="explore" options={{ title: "Explore" }} />
          <Tabs.Screen name="favorite" options={{ title: "Favorites", headerShown: false }} />
          <Tabs.Screen name="basket" options={{ title: "Basket", headerShown: false }} />
          <Tabs.Screen name="orders" options={{ title: "Orders", headerShown: false }} />
          <Tabs.Screen name="profile" options={{ title: "Profile" }} />
          <Tabs.Screen name="orderDetails" options={{ href: null }} />
          <Tabs.Screen name="payment" options={{ href: null }} />
        </Tabs>
      </ClientDataProvider>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
