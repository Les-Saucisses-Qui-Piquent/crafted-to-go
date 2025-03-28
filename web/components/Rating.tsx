import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { AntDesign } from "@expo/vector-icons";
import { COLORS } from '../constants';

interface RatingProps {
  color: string;
}

const Rating: React.FC<RatingProps> = ({ color }) => {
  const [rating, setRating] = useState<number>(0);

  const handleRating = (value: number): void => {
    setRating(value);
  };

  const renderRatingIcons = (): JSX.Element[] => {
    const maxRating = 5;
    const ratingIcons: JSX.Element[] = [];

    for (let i = 1; i <= maxRating; i++) {
      const iconName = i <= rating ? 'star' : 'staro';

      ratingIcons.push(
        <TouchableOpacity
          key={i}
          onPress={() => handleRating(i)}
          style={styles.iconContainer}
        >
          <AntDesign name={iconName} size={30} color={color} />
        </TouchableOpacity>
      );
    }

    return ratingIcons;
  };

  return (
    <View style={styles.container}>
      <View style={styles.ratingIcons}>{renderRatingIcons()}</View>
      {/* <Text style={styles.ratingText}>{rating} / 5</Text> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 16,
  },
  ratingIcons: {
    flexDirection: 'row',
  },
  iconContainer: {
    margin: 5,
  },
  ratingText: {
    fontFamily: "medium",
    fontSize: 20,
    marginLeft: 10,
    color: COLORS.primary,
  },
});

export default Rating;
