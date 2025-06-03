import React from "react";
import { View, Text, StyleSheet, TextInput } from "react-native";

interface InputProps {
  label: string;
  small?: boolean;
}

export default function Input({ label, small = false }: InputProps) {
  let width = small ? 292 : 91;

  return (
    <View style={(styles.inputContainer, { width })}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.rectangle94} />
      <TextInput style={styles.placeholder} />
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
  },
  label: {
    position: "absolute",
    flexShrink: 0,
    top: 0,
    right: 255,
    bottom: 32,
    left: 0,
    textAlign: "left",
    color: "rgba(0, 0, 0, 1)",
    fontFamily: "HankenGrotesk",
    fontSize: 15,
    fontWeight: 700,
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
    borderWidth: 0.20000000298023224,
    borderColor: "rgba(0, 0, 0, 1)",
    borderRadius: 4,
  },
  placeholder: {
    position: "absolute",
    flexShrink: 0,
    top: 31,
    right: 224,
    bottom: 7,
    left: 9,
    textAlign: "left",
    color: "rgba(99, 99, 96, 1)",
    fontFamily: "HankenGrotesk",
    fontSize: 11,
    fontWeight: 300,
  },
});
