import { Tabs } from "expo-router";
import { View, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import TabBar from "@/components/TabBar";
import TopBar from "@/components/TopBar";
import { COLORS } from "@/constants";

export default function BreweryTabsLayout() {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <TopBar variant="brewery" />
      <Tabs
        screenOptions={{
          headerShown: false,
        }}
        tabBar={({ navigation, state }) => (
          <TabBar
            isClient={false}
            activeTab={state.routeNames[state.index]}
            onTabPress={(tabName) => navigation.navigate(tabName)}
          />
        )}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Home",
          }}
        />
        <Tabs.Screen
          name="dashboard"
          options={{
            title: "Dashboard",
          }}
        />
        <Tabs.Screen
          name="inventory"
          options={{
            title: "Inventory",
          }}
        />
        <Tabs.Screen
          name="orders"
          options={{
            title: "Orders",
          }}
        />
      </Tabs>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.tansparentPrimary,
  },
});
