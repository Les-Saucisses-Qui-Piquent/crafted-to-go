import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Image } from "expo-image";

interface CommandCardProps {
  title?: string;
  number?: number;
  total?: string;
  imgPath?: string;
}

export default function CommandCard({ title, number, total, imgPath }: CommandCardProps) {
  return (
    <View style={styles.commandCardContainer}>
      <Text style={styles.title}>{title ?? ""}</Text>
      <Text style={styles._title}>{number ?? ""}</Text>
      <Text style={styles.__title}>Total</Text>
      {imgPath ? (
        <Image
          style={styles.image}
          source={{ uri: imgPath }}
          accessibilityLabel={title ? `${title} image` : "Command image"}
        />
      ) : null}
      <View style={styles.rectangle44} />
      <Text style={styles.___title}>{total ?? ""}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  commandCardContainer: {
    position: "relative",
    flexShrink: 0,
    height: 34,
    width: 234,
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    rowGap: 0,
  },
  title: {
    position: "absolute",
    flexShrink: 0,
    top: 5,
    right: 58,
    bottom: 21,
    left: 39,
    textAlign: "left",
    color: "rgba(0, 0, 0, 1)",
    fontFamily: "Hanken Grotesk",
    fontSize: 11,
    fontWeight: "700",
  },
  _title: {
    position: "absolute",
    flexShrink: 0,
    top: 6,
    right: 23,
    bottom: 21,
    left: 196,
    textAlign: "right",
    color: "rgba(0, 0, 0, 1)",
    fontFamily: "Hanken Grotesk",
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: -0.3,
    lineHeight: 34,
  },
  __title: {
    position: "absolute",
    flexShrink: 0,
    top: 18,
    right: 173,
    bottom: 9,
    left: 38,
    textAlign: "left",
    color: "rgba(99, 99, 96, 1)",
    fontFamily: "Hanken Grotesk",
    fontSize: 10,
    fontWeight: "300",
    letterSpacing: -0.3,
    lineHeight: 34,
  },
  image: {
    position: "absolute",
    flexShrink: 0,
    top: 0,
    right: 200,
    bottom: 0,
    left: 0,
    borderRadius: 50,
  },
  rectangle44: {
    position: "absolute",
    flexShrink: 0,
    top: 3,
    right: 0,
    bottom: 18,
    left: 221,
    borderStyle: "solid",
    backgroundColor: "rgba(255, 255, 255, 1)",
    borderWidth: 0.5,
    borderColor: "rgba(0, 0, 0, 1)",
  },
  ___title: {
    position: "absolute",
    flexShrink: 0,
    top: 18,
    right: 134,
    bottom: 9,
    left: 67,
    textAlign: "left",
    color: "rgba(99, 99, 96, 1)",
    fontFamily: "Hanken Grotesk",
    fontSize: 10,
    fontWeight: "300",
    letterSpacing: -0.3,
    lineHeight: 34,
  },
});
