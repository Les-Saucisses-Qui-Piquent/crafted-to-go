import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "expo-router";

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
type Nav = {
    navigate: (value: string) => void
}

// Add Welcome Screen
const index = () => {
    const { navigate } = useNavigation<Nav>();

    return (
        <SafeAreaView style={[styles.area, ]}>
            <View style={[styles.container, ]}>
                <Text style={styles.title}>Welcome Back!</Text>
                <Text style={[styles.subtitle, { color: "black" }]}>
                    Hello there, continue with and search the movies from around the world.
                </Text>
           
                <View style={{ flexDirection: "row" }}>
                    <Text style={[styles.loginTitle, {
                        color: "black"
                    }]}>Already have account? </Text>
                    <TouchableOpacity
                        onPress={() => navigate("login")}>
                        <Text style={styles.loginSubtitle}>Log In</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <View style={styles.bottomContainer}>
                <Text style={[styles.bottomTitle, ]}>
                    By continuing, you accept the Terms Of Use and
                </Text>
                <TouchableOpacity onPress={() => navigate("login")}>
                    <Text style={[styles.bottomSubtitle,]}>Privacy Policy.</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    area: {
        flex: 1,
    },
    container: {
        flex: 1,
        padding: 16,
        alignItems: "center",
        justifyContent: "center",
    },
    logo: {
        width: 72,
        height: 72,
        marginBottom: 22,
        marginTop: -22,
    },
    title: {
        fontSize: 28,
        fontFamily: "bold",
        marginVertical: 12,
        textAlign: "center",
    },
    subtitle: {
        fontSize: 12,
        fontFamily: "regular",
        color: "black",
        textAlign: "center",
        paddingHorizontal: 16,
    },
    loginTitle: {
        fontSize: 14,
        fontFamily: "regular",
        color: "black",
    },
    loginSubtitle: {
        fontSize: 14,
        fontFamily: "semiBold",
    },
    bottomContainer: {
        position: "absolute",
        bottom: 32,
        right: 0,
        left: 0,
        alignItems: "center",
    },
    bottomTitle: {
        fontSize: 12,
        fontFamily: "regular",
    },
    bottomSubtitle: {
        fontSize: 12,
        fontFamily: "regular",
        textDecorationLine: "underline",
        marginTop: 2,
    },
});

export default index;