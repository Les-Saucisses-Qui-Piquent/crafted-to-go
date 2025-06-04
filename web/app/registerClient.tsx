import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Button } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS, SIZES } from "../constants";
import { useNavigation } from "expo-router";
import Input from "@/components/Input";
import DateTimePicker, { DateType, useDefaultStyles } from "react-native-ui-datepicker";
import { debounce } from "lodash";

type Nav = {
  navigate: (value: string) => void;
};

const SignupClient = () => {
  const { navigate } = useNavigation<Nav>();
  const defaultStyles = useDefaultStyles("light");
  const [selectedDate, setSelectedDate] = useState<DateType>();

  const [formData, setFormData] = useState<{
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    phone_number: string;
    birth_date: DateType;
  }>({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    phone_number: "",
    birth_date: "",
  });

  useEffect(() => {
    console.log(formData);
  }, [formData]);

  const debounceForm = useRef(
    debounce((key: keyof typeof formData, value: string) => {
      setFormData((prev) => ({ ...prev, [key]: value }));
    }, 200),
  ).current;

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

          <View>
            <Input
              id="first_name"
              onInputChanged={(_, value) => {
                debounceForm("first_name", value);
              }}
              placeholder="First Name"
              placeholderTextColor={COLORS.black}
            />

            <Input
              id="last_name"
              onInputChanged={(_, value) => {
                debounceForm("last_name", value);
              }}
              placeholder="Last Name"
              placeholderTextColor={COLORS.black}
            />

            <Input
              id="email"
              onInputChanged={(_, value) => {
                debounceForm("email", value);
              }}
              placeholder="Email"
              placeholderTextColor={COLORS.black}
              keyboardType="email-address"
            />

            <Input
              id="password"
              secureTextEntry
              onInputChanged={(_, value) => {
                debounceForm("password", value);
              }}
              placeholder="Password"
              placeholderTextColor={COLORS.black}
            />

            <Input
              id="phone_number"
              onInputChanged={(_, value) => {
                debounceForm("phone_number", value);
              }}
              placeholder="Phone Number"
              placeholderTextColor={COLORS.black}
              keyboardType="phone-pad"
            />

            <DateTimePicker
              mode="single"
              date={selectedDate}
              onChange={({ date }) => {
                setSelectedDate(date);
                setFormData((prev) => ({ ...prev, birth_date: date }));
              }}
              styles={defaultStyles}
              initialView="year"
            />

            <View>
              <Button title="Se connecter" onPress={() => console.log("button pressed")}></Button>
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
});

export default SignupClient;
