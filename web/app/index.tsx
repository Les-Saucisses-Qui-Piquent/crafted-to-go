import { View, Text, StyleSheet, Image, TouchableOpacity, Button } from "react-native";
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
                <Text style={styles.title}>Bienvenue</Text>
                <Text style={[styles.subtitle, { color: "black" }]}>
                              BIERE COUCOU                </Text>
           
                
                <TouchableOpacity
                        onPress={() => navigate("login")}>
                  <View style={[styles.boutton, { flexDirection: "row" }]}>
                  
                      <Text style={[styles.loginTitle, {
                          color: "white"
                      }]}>Already have account? </Text>
                      
                          <Text style={styles.loginSubtitle}>Log In</Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                        onPress={() => navigate("registerBrewery")}>
                <View style={[styles.boutton, { flexDirection: "row" }]}>
                    <Text style={[styles.loginTitle, {
                        color: "white"
                    }]}>Vous êtes une brasserie </Text>
                  
                        <Text style={styles.loginSubtitle}>REGISTER</Text>
                </View>
                </TouchableOpacity>

                <TouchableOpacity
                        onPress={() => navigate("registerClient")}>
                <View style={[styles.boutton, { flexDirection: "row" }]}>
                    <Text style={[styles.loginTitle, {
                        color: "white"
                    }]}>Vous voulez des bières ? </Text>
                   
                        <Text style={styles.loginSubtitle}>REGISTER</Text>
                </View>
                </TouchableOpacity>

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
        gap : 10,
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
    boutton: {
      width:400,
      height:50,
      padding:10,
      backgroundColor:"red",
      borderRadius:15,
    }
});

export default index;