import { Tabs } from "expo-router";
import TabBar from "@/components/TabBar";

export default function CustomerTabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
      }}
      tabBar={({ navigation, state }) => (
        <TabBar
          isClient={true}
          activeTab={state.routeNames[state.index]}
          onTabPress={(tabName) => navigation.navigate(tabName)}
        />
      )}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "index",
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: "Explore",
        }}
      />
      <Tabs.Screen
        name="favorite"
        options={{
          title: "Favorites",
        }}
      />
      <Tabs.Screen
        name="basket"
        options={{
          title: "Basket",
        }}
      />
      <Tabs.Screen
        name="orders"
        options={{
          title: "Orders",
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
        }}
      />
      {/* Hidden screens: not in TabBar config, but still routable */}
      <Tabs.Screen
        name="order-details"
        options={{
          href: null, // Prevents from showing in the tab bar
        }}
      />
      <Tabs.Screen
        name="payment"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}
