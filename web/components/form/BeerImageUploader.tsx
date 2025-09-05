import React from "react";
import { View, Button, Image, Text, StyleSheet } from "react-native";
import { ImageAsset } from "@/app/brewery/(tabs)/BeerFormScreen";

type Props = {
  image: ImageAsset | null;
  existingImage?: string;
  onPickImage: () => void | Promise<void>;
  loading?: boolean;
};

export default function BeerImageUploader({ image, existingImage, onPickImage, loading }: Props) {
  return (
    <View style={styles.container}>
      <Button
        title={loading ? "Chargement..." : "Ajouter/modifier la photo"}
        onPress={onPickImage}
        disabled={loading}
      />
      {(image?.uri || existingImage) && (
        <Image source={{ uri: image?.uri || existingImage! }} style={styles.imageThumb} />
      )}
      {!image?.uri && !existingImage && (
        <Text style={styles.placeholder}>Aucune image sélectionnée</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginVertical: 12,
    width: "100%",
  },
  imageThumb: {
    marginTop: 8,
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: "#E8E8E8",
  },
  placeholder: {
    color: "#999",
    marginTop: 8,
  },
});
