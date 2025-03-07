import { View, StyleSheet, Pressable } from "react-native";
import Link from "expo-router/link";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";

export default function AuthIndex() {
  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Welcome to Crafted-to-Go!</ThemedText>
        <ThemedText type="subtitle" style={styles.subtitle}>
          Choose your account type
        </ThemedText>
      </ThemedView>

      <View style={styles.section}>
        <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>
          Brewery Account
        </ThemedText>
        <View style={styles.buttonGroup}>
          <Link href="/(auth)/(brewery)/(tabs)/sign-in" asChild>
            <Pressable style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}>
              <ThemedText style={styles.buttonText}>Sign In</ThemedText>
            </Pressable>
          </Link>
          <Link href="/(auth)/(brewery)/(tabs)/sign-up" asChild>
            <Pressable
              style={({ pressed }) => [
                styles.button,
                styles.secondaryButton,
                pressed && styles.secondaryButtonPressed,
              ]}
            >
              <ThemedText style={styles.secondaryButtonText}>Create Account</ThemedText>
            </Pressable>
          </Link>
        </View>
      </View>

      <View style={styles.section}>
        <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>
          Customer Account
        </ThemedText>
        <View style={styles.buttonGroup}>
          <Link href="/(auth)/(costumer)/(tabs)/sign-in" asChild>
            <Pressable style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}>
              <ThemedText style={styles.buttonText}>Sign In</ThemedText>
            </Pressable>
          </Link>
          <Link href="/(auth)/(costumer)/(tabs)/sign-up" asChild>
            <Pressable
              style={({ pressed }) => [
                styles.button,
                styles.secondaryButton,
                pressed && styles.secondaryButtonPressed,
              ]}
            >
              <ThemedText style={styles.secondaryButtonText}>Create Account</ThemedText>
            </Pressable>
          </Link>
        </View>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
  titleContainer: {
    alignItems: "center",
    marginVertical: 32,
  },
  subtitle: {
    marginTop: 8,
    opacity: 0.7,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    marginBottom: 16,
    textAlign: "center",
  },
  buttonGroup: {
    gap: 12,
    alignItems: "stretch",
  },
  button: {
    backgroundColor: "#7EA4FF",
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonPressed: {
    opacity: 0.8,
  },
  secondaryButton: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#7EA4FF",
  },
  secondaryButtonPressed: {
    backgroundColor: "rgba(126, 164, 255, 0.1)",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  secondaryButtonText: {
    color: "#7EA4FF",
    fontSize: 16,
    fontWeight: "600",
  },
});
