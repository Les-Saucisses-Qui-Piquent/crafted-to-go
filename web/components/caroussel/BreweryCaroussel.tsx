import React from "react";
import { View, ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import BreweryCardSmall, { BreweryProps } from "../brewery/BreweryCardSmall";
import { RelativePathString, useRouter } from "expo-router";

interface BreweryCarousselProps {
  breweries: BreweryProps[];
}

const BreweryCaroussel = ({ breweries }: BreweryCarousselProps) => {
  const router = useRouter();

  const handleNavigate = (brewery: BreweryProps) => {
    router.push({
      pathname: "/customer/BreweryDetails/[id]" as RelativePathString,
      params: {
        id: brewery.id,
      },
    });
  };

  return (
    <View style={styles.container}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {breweries.map((brewery) => (
          <TouchableOpacity
            key={brewery.id}
            style={styles.cardContainer}
            onPress={() => handleNavigate(brewery)}
          >
            <BreweryCardSmall {...brewery} />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 5,
  },
  cardContainer: {
    marginRight: 15,
    marginLeft: 10,
  },
});

export default BreweryCaroussel;
