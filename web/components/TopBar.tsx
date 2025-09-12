import { useNotifications } from "@/contexts/NotificationContext";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import React, { useState } from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import CartModal from "./modals/CartModal";

interface TopBarProps {
  variant: "client" | "brewery";
  onNotificationPress?: () => void;
  onCartPress?: () => void;
}

const TopBar: React.FC<TopBarProps> = ({ variant, onNotificationPress, onCartPress }) => {
  const { unreadCount } = useNotifications();
  const { totalItems } = useCart();
  const { user } = useAuth();
  const isClient = variant === "client";
  const [cartVisible, setCartVisible] = useState(false);

  const handleCartPress = () => {
    if (onCartPress) {
      onCartPress();
    } else {
      setCartVisible(true);
    }
  };

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
      {/* Greeting */}
      <Text style={styles.greeting}>
        Hi, {(() => {
          const username = user?.email?.split('@')[0];
          return username ? username.charAt(0).toUpperCase() + username.slice(1) : 'there';
        })()} 
      </Text>
      
      <View style={styles.iconsContainer}>
        {/* Cart Icon (only for client) */}
        {isClient && (
          <TouchableOpacity style={styles.iconButton} onPress={handleCartPress} activeOpacity={0.7}>
            <Text style={styles.iconEmoji}>🛒</Text>
            {renderBadge(totalItems)}
          </TouchableOpacity>
        )}

        {/* Notification Bell */}
        <TouchableOpacity
          style={styles.iconButton}
          onPress={onNotificationPress}
          activeOpacity={0.7}
        >
          <Text style={styles.iconEmoji}>🔔</Text>
          {renderBadge(unreadCount)}
        </TouchableOpacity>
      </View>

      {/* Cart modal */}
      <CartModal visible={cartVisible} onClose={() => setCartVisible(false)} />
    </View>
  );
};

const styles = StyleSheet.create({
  topBarContainer: {
    height: 90,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    borderBottomWidth: 2,
    borderBottomColor: "#E0E0E0",
  },
  greeting: {
    fontSize: 35,
    fontWeight: "800",
    color: "black",
    fontFamily: "HankenGrotesk",
  },
  iconsContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  iconButton: {
    position: "relative",
    padding: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  iconEmoji: {
    fontSize: 22,
  },
  badge: {
    position: "absolute",
    top: 0,
    right: 0,
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
