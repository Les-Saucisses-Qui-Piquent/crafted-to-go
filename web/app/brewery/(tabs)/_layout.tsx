import { Tabs } from "expo-router";
import TabBar from "@/components/TabBar";

export default function BreweryTabsLayout() {
  return (
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
  );
}
