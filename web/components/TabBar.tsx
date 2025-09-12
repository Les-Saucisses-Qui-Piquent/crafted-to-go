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
  emoji: string;
}

// Define tab configurations
const clientTabs: TabItem[] = [
  { name: "index", label: "Accueil", emoji: "🏠" },
  { name: "explore", label: "Explorer", emoji: "🔍" },
  { name: "favorite", label: "Favoris", emoji: "❤️" },
  { name: "basket", label: "Panier", emoji: "🛒" },
  { name: "orders", label: "Commandes", emoji: "📋" },
  { name: "profile", label: "Profil", emoji: "👤" },
];

const nonClientTabs: TabItem[] = [
  { name: "index", label: "Accueil", emoji: "🏠" },
  { name: "inventory", label: "Inventaire", emoji: "📦" },
  { name: "orders", label: "Commandes", emoji: "📋" },
  { name: "profile", label: "Profil", emoji: "👤" },
];

// Individual Tab Component
const TabButton: React.FC<{
  item: TabItem;
  isActive: boolean;
  onPress: () => void;
}> = ({ item, isActive, onPress }) => {
  return (
    <TouchableOpacity style={styles.tabButton} onPress={onPress}>
      <Text style={[styles.tabEmoji, isActive && styles.activeTabEmoji]}>{item.emoji}</Text>
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
  tabEmoji: {
    fontSize: 20,
    opacity: 1,
  },
  activeTabEmoji: {
    opacity: 1,
  },
  tabLabel: {
    marginTop: 4,
    fontSize: 12,
    fontWeight: "600",
    color: "#636360",
    textAlign: "center",
    fontFamily: "HankenGrotesk",
  },
  activeTabLabel: {
    color: "#007AFF",
  },
});

export default TabBar;
