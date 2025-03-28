import { Image, StyleSheet, View, Text, Button } from "react-native";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import Link from "expo-router/link";

export default function HomeScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#A1CEDC", dark: "#1D3D47" }}
      headerImage={
        <Image
          source={require("@/assets/images/partial-react-logo.png")}
          style={styles.reactLogo}
        />
      }
    >
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Welcome!</ThemedText>
      </ThemedView>
      <View style={styles.buttonContainer}>
        <Text>Brewery</Text>
        <Link href="/(brewery)" asChild>
          <Button title="Go to Brewery" />
        </Link>
      </View>

      <View style={styles.buttonContainer}>
        <Text>API TEST</Text>
        <Button
          title="FETCH API TEST"
          onPress={() => {
            fetch("http://localhost:3000/test", {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
              },
            })
              .then((res) => res.json())
              .then((data) => console.log(data));
          }}
        />
      </View>

      <View style={styles.buttonContainer}>
        <Text>Custodedededmer</Text>
        <Link href="/(customer)" asChild>
          <Button title="Go to Custededomer" />
        </Link>
      </View>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: "absolute",
  },
  buttonContainer: {
    marginTop: 20,
    alignItems: "center",
  },
});
