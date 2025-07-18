import { icons } from "@/constants/icons";
import AppIcon from "@/utils/AppIcon";
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

interface TabBarProps {
  isClient: boolean;
  activeTab?: string;
  onTabPress?: (tabName: string) => void;
}

interface TabItem {
  name: string;
  label: string;
  iconName: keyof typeof icons;
}

// Define tab configurations
const clientTabs: TabItem[] = [
  { name: "index", label: "Accueil", iconName: "home" },
  { name: "explore", label: "Explorer", iconName: "grid" },
  { name: "favorite", label: "Favoris", iconName: "heart" },
  { name: "basket", label: "Panier", iconName: "cart" },
  { name: "orders", label: "Commandes", iconName: "receipt" },
  { name: "profile", label: "Profil", iconName: "person" },
];

const nonClientTabs: TabItem[] = [
  { name: "home", label: "Accueil", iconName: "home" },
  { name: "profile", label: "Profil", iconName: "person" },
  { name: "orders", label: "Commandes", iconName: "receipt" },
];

// Individual Tab Component
const TabButton: React.FC<{
  item: TabItem;
  isActive: boolean;
  onPress: () => void;
}> = ({ item, isActive, onPress }) => {
  return (
    <TouchableOpacity style={styles.tabButton} onPress={onPress}>
      <AppIcon name={item.iconName} size={20} color={isActive ? "#007AFF" : "#636360"} />
      <Text style={[styles.tabLabel, isActive && styles.activeTabLabel]}>{item.label}</Text>
    </TouchableOpacity>
  );
};

// Main TabBar Component
const TabBar: React.FC<TabBarProps> = ({
  isClient,
  activeTab = "home",
  onTabPress = (tabName) => console.log(`Tab pressed: ${tabName}`),
}) => {
  const tabs = isClient ? clientTabs : nonClientTabs;

  return (
    <View style={styles.tabBarContainer}>
      <View style={styles.tabBarContent}>
        {tabs.map((tab) => (
          <TabButton
            key={tab.name}
            item={tab}
            isActive={activeTab === tab.name}
            onPress={() => onTabPress(tab.name)}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  tabBarContainer: {
    height: 71,
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderTopWidth: 0.2,
    borderTopColor: "rgba(0, 0, 0, 1)",
    justifyContent: "center",
    paddingHorizontal: 16,
  },
  tabBarContent: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    height: "100%",
  },
  tabButton: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    paddingVertical: 8,
  },
  tabLabel: {
    marginTop: 4,
    fontSize: 12,
    fontWeight: "600",
    color: "#636360",
    textAlign: "center",
    fontFamily: "Hanken Grotesk",
  },
  activeTabLabel: {
    color: "#007AFF",
  },
});

export default TabBar;
