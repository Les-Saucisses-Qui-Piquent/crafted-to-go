import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

interface MainButtonProps {
  onPress: () => void;
  title: string;
  subtitle?: string;
  isBlack?: boolean;
  isSecondary?: boolean;
}

export default function MainButton({
  onPress,
  title,
  subtitle,
  isBlack = false,
  isSecondary = false,
}: MainButtonProps) {
  // Determine background color
  let backgroundColor = "rgba(201, 227, 217, 1)";
  if (isBlack) backgroundColor = "#000";
  else if (isSecondary) backgroundColor = "#FDFFD0";

  // Determine text color
  let textColor = isBlack ? "#FFF" : "#000";

  return (
    <TouchableOpacity style={styles.mainButtonContainer} onPress={onPress}>
      <View style={[styles.rectangle20, { backgroundColor }]} />
      <Text style={[styles.mainButton, { color: textColor }]}>{title}</Text>
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  mainButtonContainer: {
    position: "relative",
    flexShrink: 0,
    height: 36,
    width: 208,
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    rowGap: 0,
  },
  rectangle20: {
    position: "absolute",
    flexShrink: 0,
    width: 208,
    height: 36,
    backgroundColor: "rgba(201, 227, 217, 1)",
    shadowColor: "rgba(0, 0, 0, 0.25)",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowRadius: 4,
  },
  mainButton: {
    position: "absolute",
    flexShrink: 0,
    top: 8,
    left: 29,
    width: 158,
    height: 20,
    textAlign: "center",
    color: "rgba(0, 0, 0, 1)",
    fontFamily: "HankenGrotesk",
    fontSize: 14,
    fontWeight: "800",
  },
  subtitle: {
    position: "absolute",
    top: 24,
    left: 29,
    width: 158,
    textAlign: "center",
    color: "#333",
    fontFamily: "HankenGrotesk",
    fontSize: 12,
    fontWeight: "600",
  },
});
