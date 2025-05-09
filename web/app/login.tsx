import { View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS, SIZES } from "../constants";
import { useNavigation, useRouter } from "expo-router";
import Checkbox from "expo-checkbox";
import Button from "@/components/Button";
import Input from "@/components/Input";
import { useAuth } from "@/contexts/AuthContext";

type Nav = {
  navigate: (value: string) => void;
};

export const Login = () => {
  const { navigate } = useNavigation<Nav>();
  const [error, setError] = useState(null);
  const [isChecked, setChecked] = useState(false);
  const router = useRouter();
  const { test, user } = useAuth();

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
    console.log("handleLogin");
    try {
      const { email, password } = formState;
      await test(email, password);

      if (!user) {
        console.warn("User not found");
        return;
      }

      if (user.role === "member") {
        router.push("/customer/(tabs)");
      }

      if (user.role === "brewer") {
        router.push("/brewery/(tabs)");
      }
    } catch (error) {
      console.log(error);
      throw new Error("Login failed from front");
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
        <ScrollView showsVerticalScrollIndicator={false}>
          <Text
            style={[
              styles.title,
              {
                color: COLORS.black,
              },
            ]}
          >
            Login to Your Account
          </Text>

          <View>
            <Input
              id="email"
              onInputChanged={inputChangedHandler}
              placeholder="Email"
              placeholderTextColor={COLORS.black}
              keyboardType="email-address"
            />

            <Input
              id="password"
              secureTextEntry
              onInputChanged={inputChangedHandler}
              placeholder="Password"
              placeholderTextColor={COLORS.black}
            />
            <View>
              <Button title="Se connecter" onPress={handleLogin}></Button>
            </View>
          </View>

          <View style={styles.checkBoxContainer}>
            <View style={{ flexDirection: "row" }}>
              <Checkbox
                style={styles.checkbox}
                value={isChecked}
                color={isChecked ? COLORS.primary : "gray"}
                onValueChange={setChecked}
              />

              <View style={{ flex: 1 }}>
                <Text
                  style={[
                    styles.privacy,
                    {
                      color: COLORS.black,
                    },
                  ]}
                >
                  Remember me
                </Text>
              </View>
            </View>
          </View>

          <TouchableOpacity onPress={() => navigate("/forgotmypassword")}>
            <Text style={styles.forgotPasswordBtnText}>Forgot the password?</Text>
          </TouchableOpacity>
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
  forgotPasswordBtnText: {
    fontSize: 16,
    fontFamily: "semiBold",
    color: COLORS.primary,
    textAlign: "center",
    marginTop: 12,
  },
});

export default Login;
