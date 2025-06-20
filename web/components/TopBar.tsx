import AppIcon from "@/utils/AppIcon";
import { useNotifications } from "@/contexts/NotificationContext";
import { useCart } from "@/contexts/CartContext";
import React from "react";
import { View, ImageBackground, StyleSheet, Text, TouchableOpacity } from "react-native";

interface TopBarProps {
  variant: "client" | "brewery";
  onNotificationPress?: () => void;
  onCartPress?: () => void;
}

const TopBar: React.FC<TopBarProps> = ({ variant, onNotificationPress, onCartPress }) => {
  const { unreadCount } = useNotifications();
  const { totalItems } = useCart();
  const isClient = variant === "client";

  const renderBadge = (count: number) => {
    if (count === 0) return null;

    return (
      <View style={styles.badge}>
        <Text style={styles.badgeText}>{count > 99 ? "99+" : count.toString()}</Text>
      </View>
    );
  };

  return (
    <View style={styles.topBarContainer}>
      <ImageBackground
        style={styles.image}
        source={{
          uri: "https://dummyimage.com/41.700565338134766x37.59886932373047/000/fff.png",
        }}
      />

      {/* Notification Bell */}
      <TouchableOpacity
        style={[styles.bell, isClient ? styles.bellClient : styles.bellBrewery]}
        onPress={onNotificationPress}
        activeOpacity={0.7}
      >
        <AppIcon name="notifications-outline" size={27} color="#1E1E1E" />
        {renderBadge(unreadCount)}
      </TouchableOpacity>

      {/* Cart Icon (only for client) */}
      {isClient && (
        <TouchableOpacity style={styles.rightIcon} onPress={onCartPress} activeOpacity={0.7}>
          <AppIcon name="cart-outline" size={28} color="#040404" />
          {renderBadge(totalItems)}
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  topBarContainer: {
    position: "relative",
    flexShrink: 0,
    height: 38,
    width: 331,
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
  },
  image: {
    position: "absolute",
    flexShrink: 0,
    top: 0,
    right: 289,
    bottom: 0,
    left: 0,
  },
  bell: {
    position: "absolute",
    flexShrink: 0,
    top: 0,
    bottom: 4,
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "center",
  },
  bellClient: {
    left: 252,
    right: 46,
  },
  bellBrewery: {
    left: 298,
    right: 0,
  },
  rightIcon: {
    position: "absolute",
    top: 8,
    right: 0,
    bottom: 13,
    left: 303,
    justifyContent: "center",
    alignItems: "center",
  },
  badge: {
    position: "absolute",
    top: -5,
    right: -5,
    backgroundColor: "#FF4444",
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 4,
  },
  badgeText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default TopBar;
