import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from "react-native";
import React, { useState } from "react";
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

  const [formState, setFormState] = useState({
    first_name: "",
    last_name: "",
    phone_number: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [passwordError, setPasswordError] = useState("");

  const inputChangedHandler = (id: string, text: string) => {
    setFormState((prev) => ({
      ...prev,
      [id]: text,
    }));

    // Clear password error when user starts typing
    if (id === "password" || id === "confirmPassword") {
      setPasswordError("");
    }
  };

  const validatePasswords = () => {
    if (formState.password !== formState.confirmPassword) {
      setPasswordError("Les mots de passe ne correspondent pas");
      return false;
    }
    if (formState.password.length < 6) {
      setPasswordError("Le mot de passe doit contenir au moins 6 caractères");
      return false;
    }
    return true;
  };

  const handleSubmit = () => {
    if (validatePasswords()) {
      console.log("Form is valid, proceeding...", formState);
      // Proceed with form submission
    } else {
      Alert.alert("Erreur", passwordError);
    }
  };

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
            CREATE YOUR ACCOUNT
          </Text>

          <View style={styles.formContainer}>
            <Input
              label="Prénom"
              id="first_name"
              onInputChanged={inputChangedHandler}
              placeholder="First Name"
              placeholderTextColor={COLORS.black}
            />

            <Input
              label="Nom"
              id="last_name"
              onInputChanged={inputChangedHandler}
              placeholder="Last Name"
              placeholderTextColor={COLORS.black}
            />

            <Input
              label="Numéro de téléphone"
              id="phone_number"
              onInputChanged={inputChangedHandler}
              placeholder="Phone Number"
              placeholderTextColor={COLORS.black}
              keyboardType="phone-pad"
            />

            <Input
              label="Email"
              id="email"
              onInputChanged={inputChangedHandler}
              placeholder="Email"
              placeholderTextColor={COLORS.black}
              keyboardType="email-address"
            />

            <Input
              label="Mot de passe"
              id="password"
              secureTextEntry
              onInputChanged={inputChangedHandler}
              placeholder="Password"
              placeholderTextColor={COLORS.black}
            />

            <Input
              label="Confirmer le mot de passe"
              id="confirmPassword"
              secureTextEntry
              onInputChanged={inputChangedHandler}
              placeholder="Confirm Password"
              placeholderTextColor={COLORS.black}
            />

            {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}

            <View style={styles.buttonContainer}>
              <TextCTA
                title="Valider et passer à l'étape suivante"
                onPress={handleSubmit}
                width={350}
              />
            </View>

            <View style={styles.checkBoxContainer}>
              <View style={{ flexDirection: "row" }}>
                <View style={{ flex: 1 }}>
                  <Text
                    style={[
                      styles.privacy,
                      {
                        color: "#666666",
                        fontWeight: "700",
                      },
                    ]}
                  >
                    By continuing you accept our Privacy Policy
                  </Text>
                </View>
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
    fontSize: 28,
    fontFamily: "HankenGrotesk",
    color: COLORS.black,
    textAlign: "center",
    marginBottom: 10,
    fontWeight: "700",
  },
  checkBoxContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 0,
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
    fontFamily: "HankenGrotesk",
    color: "#666666",
    fontWeight: "400",
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
  errorText: {
    color: "red",
    fontSize: 12,
    marginBottom: 10,
  },
});

export default SignupClient;
