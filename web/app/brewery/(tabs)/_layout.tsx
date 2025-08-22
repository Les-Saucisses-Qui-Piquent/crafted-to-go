import { Tabs } from "expo-router";
import { View, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import TabBar from "@/components/TabBar";
import TopBar from "@/components/TopBar";
import { COLORS } from "@/constants";
import { BreweryDataProvider } from "@/contexts/BreweryDataContext";

export default function BreweryTabsLayout() {
  const insets = useSafeAreaInsets();

  return (
    <BreweryDataProvider>
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <TopBar variant="brewery" />
        <Tabs
          screenOptions={{ headerShown: false }}
          tabBar={({ navigation, state }) => (
            <TabBar
              isClient={false}
              activeTab={state.routeNames[state.index]}
              onTabPress={(tabName) => navigation.navigate(tabName)}
            />
          )}
        >
          <Tabs.Screen name="index" />
          <Tabs.Screen name="dashboard" />
          <Tabs.Screen name="inventory" />
          <Tabs.Screen name="orders" />
          <Tabs.Screen name="profile" />
        </Tabs>
      </View>
    </BreweryDataProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.tansparentPrimary,
  },
});
