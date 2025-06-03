import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Picker } from "@react-native-picker/picker";

interface SelectItem {
  label: string;
  value: string;
}

interface SelectInputProps {
  label: string;
  items: SelectItem[];
  small?: boolean;
  multiple?: boolean;
}

export default function SelectInput({
  label,
  items,
  small = false,
  multiple = false,
}: SelectInputProps) {
  const [selectedValue, setSelectedValue] = useState<string>(items[0]?.value ?? "");

  let width = small ? 292 : 391;

  return (
    <View style={[styles.inputContainer, { width }]}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.rectangle94} />
      <Picker
        selectedValue={selectedValue}
        onValueChange={(itemValue) => setSelectedValue(itemValue)}
        style={styles.picker}
      >
        {items.map((item) => (
          <Picker.Item key={item.value} label={item.label} value={item.value} />
        ))}
      </Picker>
      <Text style={styles.selectedLabel}>
        Sélectionné : {items.find((i) => i.value === selectedValue)?.label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  inputContainer: {
    position: "relative",
    flexShrink: 0,
    height: 80,
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    rowGap: 0,
    marginBottom: 12,
  },
  label: {
    position: "absolute",
    flexShrink: 0,
    top: 0,
    left: 0,
    textAlign: "left",
    color: "rgba(0, 0, 0, 1)",
    fontFamily: "HankenGrotesk",
    fontSize: 15,
    fontWeight: "700",
    zIndex: 2,
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
    borderWidth: 0.2,
    borderColor: "rgba(0, 0, 0, 1)",
    borderRadius: 4,
    zIndex: 1,
  },
  picker: {
    position: "absolute",
    top: 24,
    left: 0,
    right: 0,
    height: 40,
    width: "100%",
    zIndex: 3,
  },
  selectedLabel: {
    marginTop: 60,
    color: "#333",
    fontSize: 13,
    fontFamily: "HankenGrotesk",
  },
});
