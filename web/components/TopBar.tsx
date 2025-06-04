import AppIcon from "@/utils/AppIcon";
import React from "react";
import { View, ImageBackground, StyleSheet } from "react-native";

interface TopBarProps {
  variant: "client" | "brewery";
}

const TopBar: React.FC<TopBarProps> = ({ variant }) => {
  // You can further customize these based on the variant if needed
  const isClient = variant === "client";

  return (
    <View style={styles.topBarContainer}>
      <ImageBackground
        style={styles.image}
        source={{
          uri: "https://dummyimage.com/41.700565338134766x37.59886932373047/000/fff.png",
        }}
      />
      {/* Notification/Bell Icon */}
      <View style={[styles.bell, isClient ? styles.bellClient : styles.bellBrewery]}>
        <AppIcon name="notifications-outline" size={27} color="#1E1E1E" />
      </View>

      {/* Brewery can have a different right icon or none */}
      {!isClient && (
        <View style={styles.rightIcon}>
          <AppIcon name="cart-outline" size={28} color="#040404" />
        </View>
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
});

export default TopBar;
