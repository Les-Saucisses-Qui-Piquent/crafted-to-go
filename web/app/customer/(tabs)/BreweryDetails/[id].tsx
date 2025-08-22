import React from "react";
import { View, Text, ScrollView, StyleSheet, Image, Linking } from "react-native";
import { useLocalSearchParams } from "expo-router";

export interface BreweryDetailsProps {
  id: string;
  title: string;
  name?: string;
  image?: string | null;
  logo?: string | null;
  description?: string;
  phone_number?: string;
  email?: string;
  has_taproom?: boolean;
  taproom_hours?: Record<string, string>;
  opening_hours?: Record<string, string>;
  social_links?: string[];
}

export default function BreweryDetails() {
  const params = useLocalSearchParams();
  const { brewery } = params;

  let breweryData: BreweryDetailsProps | null = null;
  try {
    breweryData = brewery ? JSON.parse(brewery as string) : null;
  } catch (error) {
    console.error("Erreur parsing brewery param", error);
  }

  if (!breweryData) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Données de la brasserie introuvables.</Text>
      </View>
    );
  }

  const renderHours = (
    hoursObj?: Record<string, string | { isOpen: boolean; openTime: string; closeTime: string }>,
  ) => {
    if (!hoursObj) return null;

    return Object.entries(hoursObj).map(([day, hours]) => {
      if (typeof hours === "string") {
        return (
          <Text key={day} style={styles.text}>
            {capitalize(day)} : {hours}
          </Text>
        );
      }

      if (typeof hours === "object" && hours !== null) {
        const { isOpen, openTime, closeTime } = hours;
        return (
          <Text key={day} style={styles.text}>
            {capitalize(day)} : {isOpen ? `${openTime} - ${closeTime}` : "Fermé"}
          </Text>
        );
      }

      return null;
    });
  };

  // Fonction utilitaire pour mettre la première lettre en majuscule (pour affichage FR)
  const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

  // Affichage des liens sociaux
  const renderSocialLinks = () => {
    if (!breweryData?.social_links || breweryData.social_links.length === 0) return null;
    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Réseaux sociaux</Text>
        {breweryData.social_links.map((link, index) => (
          <Text key={index} style={styles.linkText} onPress={() => Linking.openURL(link)}>
            {link}
          </Text>
        ))}
      </View>
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 16 }}>
      <Text style={styles.title}>{breweryData.title ?? breweryData.name}</Text>

      {(breweryData.logo || breweryData.image) && (
        <Image
          source={{ uri: breweryData.logo ?? breweryData.image ?? "" }}
          style={styles.logo}
          resizeMode="contain"
        />
      )}

      <Text style={styles.description}>{breweryData.description}</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Contact</Text>
        {breweryData.phone_number && (
          <Text style={styles.text}>Téléphone: {breweryData.phone_number}</Text>
        )}
        {breweryData.email && <Text style={styles.text}>Email: {breweryData.email}</Text>}
      </View>

      {breweryData.opening_hours && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Horaires d&apos;ouverture</Text>
          {renderHours(breweryData.opening_hours)}
        </View>
      )}

      {breweryData.has_taproom && breweryData.taproom_hours && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Horaires du Taproom</Text>
          {renderHours(breweryData.taproom_hours)}
        </View>
      )}

      {renderSocialLinks()}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  errorContainer: { flex: 1, justifyContent: "center", alignItems: "center", padding: 16 },
  errorText: { color: "red", fontSize: 16, textAlign: "center" },
  title: { fontSize: 28, fontWeight: "bold", marginBottom: 12, textAlign: "center" },
  logo: { width: 200, height: 100, marginBottom: 16, alignSelf: "center" },
  description: { fontSize: 16, color: "#444", marginBottom: 16 },
  section: { marginBottom: 20 },
  sectionTitle: { fontSize: 18, fontWeight: "600", marginBottom: 8 },
  text: { fontSize: 14, color: "#555" },
  linkText: { color: "#1E90FF", textDecorationLine: "underline", marginBottom: 4 },
});
