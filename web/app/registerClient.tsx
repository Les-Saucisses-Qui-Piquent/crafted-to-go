import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS, SIZES } from "../constants";
import { router } from "expo-router";
import Input from "../components/form/Input";
import TextCTA from "../components/Buttons/TextCTA";
import { useAuth } from "@/contexts/AuthContext";
import DateTimePicker from "@react-native-community/datetimepicker";

const SignupClient = () => {
  const { setToken, setUser } = useAuth();
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [formState, setFormState] = useState<{
    first_name: string;
    last_name: string;
    phone_number: string;
    birth_date: Date | undefined;
    email: string;
    password: string;
    confirmPassword: string;
  }>({
    first_name: "",
    last_name: "",
    phone_number: "",
    birth_date: undefined,
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
      Alert.alert("Erreur", passwordError);
      return false;
    }
    if (formState.password.length < 12) {
      setPasswordError("Le mot de passe doit contenir au moins 12 caractères");
      Alert.alert("Erreur", passwordError);
      return false;
    }
    console.info("Passwords are matching");
    return true;
  };

  const validateForm = () => {
    const { first_name, last_name, phone_number, birth_date, email, password } = formState;

    // Validate missing fields
    if (!first_name || !last_name || !email || !password || !phone_number || !birth_date) {
      console.warn("All fields are required");
      const trad = {
        first_name: "Prénom",
        last_name: "Nom",
        phone_number: "Numéro de téléphone",
        birth_date: "Date de naissance",
        email: "Email",
        password: "Mot de passe",
        confirmPassword: "Confirmation du mot de passe",
      };

      const missingFields = Object.entries(formState)
        .filter(([, value]) => !value || value.toString().trim() === "")
        .map(([key]) => trad[key as keyof typeof trad])
        .join(", ");

      Alert.alert("Oops", `Les champs ${missingFields} sont requis`);
      return false;
    }

    if (phone_number.length !== 10) {
      Alert.alert("Oops", "Le numéro de téléphone doit contenir 10 chiffres");
      return false;
    }

    if (birth_date) return true;
  };

  const handleSubmit = async () => {
    if (validatePasswords() && validateForm()) {
      // Proceed with form submission
      try {
        const { email, password, first_name, last_name, birth_date, phone_number } = formState;

        const body = JSON.stringify({
          email,
          password,
          first_name,
          last_name,
          birth_date,
          phone_number,
        });
        console.info("Registering user...");

        const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/auth/register`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body,
        });

        const data = await response.json();

        if (!response.ok) {
          console.warn("Registration failed");
          if (data.errors && data.errors.length) {
            Alert.alert("Erreur", `${data.errors[0].message}: ${data.errors[0].code}`);
          }
          return;
        }

        // Retrieve token and basic user info
        setToken(data.token);
        setUser(data.user);

        if (data.user.role === "client") {
          router.push("/customer/(tabs)");
        }

        if (data.user.role === "brewer") {
          router.push("/brewery/(tabs)");
        }
      } catch (error) {
        console.error("Registration failed from client front:");
        console.error(error);
        Alert.alert("Erreur", "Une erreur est survenue lors de l'inscription");
      }
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

            <TextCTA
              title="Date de naissance"
              onPress={() => setShowDatePicker(true)}
              width={350}
            />
            {showDatePicker && (
              <DateTimePicker
                value={new Date()}
                mode="date"
                display="inline"
                onChange={(event, selectedDate) => {
                  setShowDatePicker(false);
                  setFormState((prev) => ({
                    ...prev,
                    birth_date: selectedDate,
                  }));
                }}
                maximumDate={new Date()}
              />
            )}

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
              <TouchableOpacity onPress={() => router.push("/login")}>
                <Text style={styles.bottomRight}> Sign In</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
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
    marginTop: 18,
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
  text: {
    color: "black",
    fontSize: 12,
  },
});

export default SignupClient;
