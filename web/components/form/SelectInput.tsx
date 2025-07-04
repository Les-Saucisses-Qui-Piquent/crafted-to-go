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
  width?: number;
  onValueChange?: (value: string) => void;
  selectedValue?: string;
}

export default function SelectInput({
  label,
  items,
  small = false,
  width,
  onValueChange,
  selectedValue: propSelectedValue,
}: SelectInputProps) {
  const [internalSelectedValue, setInternalSelectedValue] = useState<string>(items[0]?.value ?? "");

  const selectedValue = propSelectedValue || internalSelectedValue;
  const containerWidth = width || (small ? 292 : 391);

  const handleValueChange = (value: string) => {
    if (onValueChange) {
      onValueChange(value);
    } else {
      setInternalSelectedValue(value);
    }
  };

  return (
    <View style={[styles.inputContainer, { width: containerWidth }]}>
      <Text style={styles.label}>{label}</Text>
      <Picker selectedValue={selectedValue} onValueChange={handleValueChange} style={styles.picker}>
        {items.map((item) => (
          <Picker.Item key={item.value} label={item.label} value={item.value} />
        ))}
      </Picker>
    </View>
  );
}

const styles = StyleSheet.create({
  inputContainer: {
    position: "relative",
    flexShrink: 0,
    //height: 80,
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    rowGap: 0,
    //marginBottom: 12,
  },
  label: {
    textAlign: "left",
    color: "rgb(76, 81, 81)",
    fontFamily: "HankenGrotesk",
    fontSize: 13,
    fontWeight: "700",
    //marginBottom: 5,
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
    marginTop: 5,
    height: 40,
    width: "100%",
  },
});
