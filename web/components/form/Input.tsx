import React from "react";
import { View, Text, StyleSheet, TextInput } from "react-native";

interface InputProps {
  label: string;
  small?: boolean;
  id?: string;
  onInputChanged?: (id: string, text: string) => void;
  placeholder?: string;
  placeholderTextColor?: string;
  keyboardType?: "default" | "email-address" | "numeric" | "phone-pad";
  secureTextEntry?: boolean;
  error?: string;
}

export default function Input({
  label,
  small = false,
  id = "",
  onInputChanged,
  placeholder,
  placeholderTextColor = "rgba(99, 99, 96, 1)",
  keyboardType = "default",
  secureTextEntry = false,
  error,
}: InputProps) {
  const width = small ? 292 : 350;

  const handleTextChange = (text: string) => {
    if (onInputChanged && id) {
      onInputChanged(id, text);
    }
  };

  return (
    <View style={[styles.inputContainer, { width }]}>
      <Text style={styles.label}>{label}</Text>
      {/* <View style={styles.rectangle94} /> */}
      <TextInput
        style={styles.placeholder}
        placeholder={placeholder}
        placeholderTextColor={placeholderTextColor}
        keyboardType={keyboardType}
        secureTextEntry={secureTextEntry}
        onChangeText={handleTextChange}
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  inputContainer: {
    position: "relative",
    flexShrink: 0,
    height: 52,
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    rowGap: 0,
    marginVertical: 10,
  },
  label: {
    // position: "absolute",
    // flexShrink: 0,
    // top: 0,
    // right: 0,
    // bottom: 32,
    // left: 0,
    textAlign: "left",
    color: "rgba(0, 0, 0, 1)",
    fontFamily: "HankenGrotesk",
    fontSize: 15,
    fontWeight: "700",
  },
  rectangle94: {
    position: "absolute",
    flexShrink: 0,
    top: 24,
    right: 0,
    bottom: 0,
    left: 0,
    borderStyle: "solid",
    backgroundColor: "rgba(255, 255, 255, 1)",
    borderWidth: 0.5,
    borderColor: "rgba(0, 0, 0, 1)",
    borderRadius: 4,
  },
  placeholder: {
    // position: "absolute",
    // flexShrink: 0,
    // top: 31,
    // right: 10,
    // bottom: 7,
    // left: 9,
    textAlign: "left",
    color: "rgba(99, 99, 96, 1)",
    fontFamily: "HankenGrotesk",
    fontSize: 11,
    fontWeight: "300",
    width: "100%",
    height: "66%",
    borderStyle: "solid",
    backgroundColor: "rgba(255, 255, 255, 1)",
    borderWidth: 0.5,
    borderColor: "rgba(0, 0, 0, 1)",
    borderRadius: 4,
    paddingLeft: 10,
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginTop: 2,
  },
});
