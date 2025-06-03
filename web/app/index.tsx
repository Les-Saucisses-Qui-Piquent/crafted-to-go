import { View, Text, StyleSheet, Image, TouchableOpacity, Button } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "expo-router";
import MainButton from "../components/Buttons/MainButton";

type Nav = {
  navigate: (value: string) => void;
};

// Add Welcome Screen
const index = () => {
  const { navigate } = useNavigation<Nav>();

  return (
    <SafeAreaView style={[styles.area]}>
      <View style={[styles.container]}>
        <Text style={styles.title}>Bienvenue</Text>
        <Text style={[styles.subtitle, { color: "black" }]}>BIERE COUCOU</Text>

        <MainButton onPress={() => navigate("login")} title="LOGIN" isBlack />

        <MainButton
          onPress={() => navigate("registerBrewery")}
          title="BREWERY REGISTER"
          isSecondary
        />

        <MainButton onPress={() => navigate("registerClient")} title="CLIENT REGISTER" />
      </View>
      <View style={styles.bottomContainer}>
        <Text style={[styles.bottomTitle]}>By continuing, you accept the Terms Of Use and</Text>
        <TouchableOpacity onPress={() => navigate("login")}>
          <Text style={[styles.bottomSubtitle]}>Privacy Policy.</Text>
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
    gap: 10,
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
  },
  loginSubtitle: {
    fontSize: 14,
    fontFamily: "semiBold",
    color: "yellow",
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
