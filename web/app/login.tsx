import { View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS, SIZES } from "../constants";
import { useNavigation, useRouter } from "expo-router";
import Checkbox from "expo-checkbox";
import SecondaryCTA from "../components/Buttons/SecondaryCTA";
import Input from "../components/form/Input";
import { useAuth } from "@/contexts/AuthContext";

type Nav = {
  navigate: (value: string) => void;
};

export const Login = () => {
  const { navigate } = useNavigation<Nav>();
  const [error, setError] = useState(null);
  const [isChecked, setChecked] = useState(false);
  const router = useRouter();
  const { login, setUser, setToken } = useAuth();

  const [formState, setFormState] = useState({
    email: "",
    password: "",
  });

  useEffect(() => {
    if (error) {
      Alert.alert("An error occurred", error);
      setError(error);
    }
  }, [error]);

  const inputChangedHandler = (id: string, text: string) => {
    setFormState((prev) => ({
      ...prev,
      [id]: text,
    }));
  };

  const handleLogin = async () => {
    try {
      const { email, password } = formState;

      if (!email || !password) {
        Alert.alert("Email and password are required");
        return;
      }

      const response = await login(email, password);

      if (!response || !response.token || !response.user) {
        console.warn("User not found");
        return;
      }
      setUser(response.user);
      setToken(response.token);

      if (response.user.role === "client") {
        router.push("/customer/(tabs)");
      }

      if (response.user.role === "brewer") {
        router.push("/brewery/(tabs)");
      }

      if (response.user.role === "admin") {
        console.log("Admin role detected");
      }
    } catch (error) {
      console.error("Login failed from front:");
      console.error(error);
    }
  };

  return (
    <SafeAreaView
      style={[
        styles.area,
        {
          backgroundColor: COLORS.white,
        },
      ]}
    >
      <View
        style={[
          styles.container,
          {
            backgroundColor: COLORS.white,
          },
        ]}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.logoContainer}></View>
          <Text
            style={[
              styles.title,
              {
                color: COLORS.black,
              },
            ]}
          >
            LOGIN TO YOUR ACCOUNT
          </Text>

          <View style={styles.formContainer}>
            <Input
              label="Email"
              id="email"
              onInputChanged={inputChangedHandler}
              placeholder="Entrez votre email"
              placeholderTextColor={COLORS.black}
              keyboardType="email-address"
            />

            <Input
              label="Mot de passe"
              id="password"
              secureTextEntry
              onInputChanged={inputChangedHandler}
              placeholder="Entrez votre mot de passe"
              placeholderTextColor={COLORS.black}
            />
            <View style={styles.buttonContainer}>
              <SecondaryCTA
                title="Se connecter"
                isBlack={true}
                tablet={true}
                onPress={handleLogin}
              />
            </View>

            <View style={styles.checkBoxContainer}>
              <View style={styles.checkboxRow}>
                <Checkbox
                  style={[styles.checkbox, !isChecked && styles.checkboxUnchecked]}
                  value={isChecked}
                  color={isChecked ? "#000000" : "transparent"}
                  onValueChange={setChecked}
                />

                <Text
                  style={[
                    styles.privacy,
                    {
                      color: COLORS.black,
                    },
                  ]}
                >
                  Rester connecté
                </Text>
              </View>

              <TouchableOpacity onPress={() => navigate("/forgotmypassword")}>
                <Text style={styles.forgotPasswordBtnText}>Forgot the password?</Text>
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
  buttonContainer: {
    alignItems: "center",
    marginVertical: 20,
  },
  checkBoxContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    //marginVertical: 18,
    width: "100%",
  },
  checkbox: {
    marginRight: 8,
    height: 16,
    width: 16,
    borderRadius: 4,
    borderWidth: 0,
  },
  checkboxUnchecked: {
    borderColor: "#C9E3D9",
    borderWidth: 2,
  },
  privacy: {
    fontSize: 14,
    fontFamily: "HankenGrotesk",
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
    //marginVertical: 18,
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
  forgotPasswordBtnText: {
    fontSize: 14,
    fontFamily: "HankenGrotesk",
    color: COLORS.primary,
    textAlign: "center",
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: "center",
  },
  formContainer: {
    alignItems: "center",
    //marginBottom: 20,
  },
  checkboxRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  forgotPasswordContainer: {
    alignItems: "center",
    marginTop: 12,
  },
});

export default Login;
