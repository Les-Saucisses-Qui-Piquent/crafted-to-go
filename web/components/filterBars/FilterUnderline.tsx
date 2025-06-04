import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

interface FilterPillarProps {
  filters: string[];
  selectedIndex: number;
  onSelect: (index: number) => void;
}

export default function FilterPillar({ filters, selectedIndex, onSelect }: FilterPillarProps) {
  return (
    <View style={styles.container}>
      <View style={styles.underline} />
      <View style={styles.filtersRow}>
        {filters.map((label, idx) => (
          <TouchableOpacity
            key={label}
            style={styles.filterButton}
            activeOpacity={0.7}
            onPress={() => onSelect(idx)}
          >
            <Text style={[styles.filterText, idx === selectedIndex && styles.selectedText]}>
              {label}
            </Text>
            {/* Underline for selected */}
            {idx === selectedIndex && <View style={styles.selectedUnderline} />}
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    paddingTop: 4,
    paddingBottom: 8,
    backgroundColor: "#fff",
  },
  filtersRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    paddingHorizontal: 8,
  },
  filterButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-end",
    paddingVertical: 4,
    marginHorizontal: 4,
  },
  filterText: {
    color: "#636360",
    fontFamily: "Hanken Grotesk",
    fontSize: 16,
    fontWeight: "300",
  },
  selectedText: {
    color: "#000",
    fontWeight: "700",
  },
  underline: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: 2,
    backgroundColor: "#A09C9C",
    zIndex: 0,
  },
  selectedUnderline: {
    marginTop: 4,
    height: 2,
    width: "80%",
    backgroundColor: "#000",
    borderRadius: 1,
    alignSelf: "center",
  },
});
