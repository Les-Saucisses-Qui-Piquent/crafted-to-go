import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS, SIZES } from "../constants";
import { useNavigation } from "expo-router";
import Input from "../components/form/Input";
import TextCTA from "../components/Buttons/TextCTA";

type Nav = {
  navigate: (value: string) => void;
};

const SignupClient = () => {
  const { navigate } = useNavigation<Nav>();
  const { navigate } = useNavigation<Nav>();

  return (
    <SafeAreaView style={[styles.area, { backgroundColor: COLORS.white }]}>
      <View style={[styles.container, { backgroundColor: COLORS.white }]}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.logoContainer}></View>
          <Text
            style={[
              styles.title,
              {
                color: COLORS.black,
              },
            ]}
          >
            Create Your Account
          </Text>

          <View style={styles.formContainer}>
            <Input
              label="Prénom"
              id="first_name"
              onInputChanged={console.log}
              placeholder="First Name"
              placeholderTextColor={COLORS.black}
            />

            <Input
              label="Nom"
              id="last_name"
              onInputChanged={console.log}
              placeholder="Last Name"
              placeholderTextColor={COLORS.black}
            />

            <Input
              label="Numéro de téléphone"
              id="phone_number"
              onInputChanged={console.log}
              placeholder="Phone Number"
              placeholderTextColor={COLORS.black}
              keyboardType="phone-pad"
            />

            <Input
              label="Email"
              id="email"
              onInputChanged={console.log}
              placeholder="Email"
              placeholderTextColor={COLORS.black}
              keyboardType="email-address"
            />

            <Input
              label="Mot de passe"
              id="password"
              secureTextEntry
              onInputChanged={console.log}
              placeholder="Password"
              placeholderTextColor={COLORS.black}
            />

            <View style={styles.buttonContainer}>
              <TextCTA 
                title="Valider et passer à l'étape suivante" 
                onPress={() => console.log("button pressed")}
                width={350}
              />
            </View>
          </View>

          <View style={styles.checkBoxContainer}>
            <View style={{ flexDirection: "row" }}>
              <View style={{ flex: 1 }}>
                <Text
                  style={[
                    styles.privacy,
                    {
                      color: COLORS.black,
                    },
                  ]}
                >
                  By continuing you accept our Privacy Policy
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>
        <View style={styles.bottomContainer}>
          <Text
            style={[
              styles.bottomLeft,
              {
                color: COLORS.black,
              },
            ]}
          >
            Already have an account ?
          </Text>
          <TouchableOpacity onPress={() => navigate("login")}>
            <Text style={styles.bottomRight}> Sign In</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  area: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: COLORS.white,
  },
  logo: {
    width: 100,
    height: 100,
    tintColor: COLORS.primary,
  },
  logoContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 32,
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 26,
    fontFamily: "semiBold",
    color: COLORS.black,
    textAlign: "center",
    marginBottom: 22,
  },
  checkBoxContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 18,
  },
  checkbox: {
    marginRight: 8,
    height: 16,
    width: 16,
    borderRadius: 4,
    borderColor: COLORS.primary,
    borderWidth: 2,
  },
  privacy: {
    fontSize: 12,
    fontFamily: "regular",
    color: COLORS.black,
  },
  socialTitle: {
    fontSize: 19.25,
    fontFamily: "medium",
    color: COLORS.black,
    textAlign: "center",
    marginVertical: 26,
  },
  socialBtnContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  bottomContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 18,
    position: "absolute",
    bottom: 12,
    right: 0,
    left: 0,
  },
  bottomLeft: {
    fontSize: 14,
    fontFamily: "regular",
    color: "black",
  },
  bottomRight: {
    fontSize: 16,
    fontFamily: "medium",
    color: COLORS.primary,
  },
  button: {
    marginVertical: 6,
    width: SIZES.width - 32,
    borderRadius: 30,
  },
  formContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  buttonContainer: {
    alignItems: "center",
  },
});

export default SignupClient;