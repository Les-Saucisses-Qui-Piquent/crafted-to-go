import { View, StyleSheet } from "react-native";
import Link from "expo-router/link";
import { Button } from "react-native";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";

export default function AuthIndex() {
  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Welcome!</ThemedText>
      </ThemedView>

      <View style={styles.buttonContainer}>
        <ThemedText>Brewery</ThemedText>
        <Link href="/(auth)/sign-in?role=brewery" asChild>
          <Button title="Sign in as Brewery" />
        </Link>
      </View>

      <View style={styles.buttonContainer}>
        <ThemedText>Customer</ThemedText>
        <Link href="/(auth)/sign-in?role=customer" asChild>
          <Button title="Sign in as Customer" />
        </Link>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  titleContainer: {
    alignItems: "center",
    marginVertical: 20,
  },
  buttonContainer: {
    marginVertical: 10,
    alignItems: "center",
  },
});
