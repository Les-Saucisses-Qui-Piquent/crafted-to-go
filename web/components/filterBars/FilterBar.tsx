import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

interface FilterBarProps {
  filters: string[];
  selectedIndex: number;
  onSelect: (index: number) => void;
}

export default function FilterBar({ filters, selectedIndex, onSelect }: FilterBarProps) {
  return (
    <View style={styles.container}>
      <View style={styles.background} />
      <View style={styles.filtersRow}>
        {filters.map((label, idx) => (
          <TouchableOpacity
            key={label}
            style={[styles.filterButton, selectedIndex === idx && styles.selectedFilter]}
            activeOpacity={0.7}
            onPress={() => onSelect(idx)}
          >
            <Text style={[styles.filterText, selectedIndex === idx && styles.selectedFilterText]}>
              {label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 51,
    width: 250,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  background: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#fff",
    borderColor: "#D9D9D9",
    borderWidth: 0.5,
    borderRadius: 8,
    shadowColor: "rgba(0,0,0,0.25)",
    shadowOffset: { width: 0, height: 0.5 },
    shadowRadius: 4,
    shadowOpacity: 1,
  },
  filtersRow: {
    flexDirection: "row",
    width: "92%",
    height: 36,
    alignItems: "center",
    justifyContent: "space-between",
  },
  filterButton: {
    flex: 1,
    marginHorizontal: 3,
    backgroundColor: "#F7F7F7",
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#F7F7F7",
    alignItems: "center",
    justifyContent: "center",
    height: 36,
  },
  selectedFilter: {
    backgroundColor: "#D5E9E1",
    borderColor: "#D5E9E1",
  },
  filterText: {
    color: "#000",
    fontFamily: "Hanken Grotesk",
    fontSize: 11,
    fontWeight: "400",
    letterSpacing: -0.33,
    lineHeight: 18,
  },
  selectedFilterText: {
    fontWeight: "700",
  },
});
