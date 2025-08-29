import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ActivityIndicator,
  ScrollView,
  Alert,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { RelativePathString, useRouter } from "expo-router";
import { useApiClient } from "@/utils/api-client";
import { useAuth } from "@/contexts/AuthContext";
import { useClientData } from "@/contexts/CostumerDataProvider";
import Button from "@/components/Button";
import AppIcon from "@/utils/AppIcon";
import { COLORS } from "@/constants";
import { Image } from "expo-image";

export interface Address {
  id: string;
  line_1: string;
  city: string;
  postal_code: string;
  country: string;
}

export interface UserDetails {
  id: string;
  user_id: string;
  image?: string;
  payment_method?: string;
  address_id?: string;
  address?: Address;
}

export interface UserFull {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  userDetails: UserDetails;
}

const Profile = () => {
  const { apiClient } = useApiClient();
  const { user } = useAuth();
  const { userDetails, loading } = useClientData();
  const router = useRouter();

  const [saving, setSaving] = useState(false);
  const [editMode, setEditMode] = useState(false);

  const [email, setEmail] = useState(userDetails.email);
  const [firstName, setFirstName] = useState(userDetails.first_name);
  const [lastName, setLastName] = useState(userDetails.last_name);
  const [password, setPassword] = useState("");
  const [address, setAddress] = useState(userDetails.userDetails.address?.line_1 || "");
  const [city, setCity] = useState(userDetails.userDetails.address?.city || "");
  const [postalCode, setPostalCode] = useState(userDetails.userDetails.address?.postal_code || "");
  const [country, setCountry] = useState(userDetails.userDetails.address?.country || "");
  const [paymentMethod, setPaymentMethod] = useState(userDetails.userDetails.payment_method || "");
  const [profileImage, setProfileImage] = useState(userDetails.userDetails.image || "");

  const addressId = userDetails.userDetails.address_id;
  const userDetailsId = userDetails.userDetails.id;

  useEffect(() => {
    if (editMode) {
      setEmail(userDetails.email);
      setFirstName(userDetails.first_name);
      setLastName(userDetails.last_name);
      setProfileImage(userDetails.userDetails.image || "");
      setAddress(userDetails.userDetails.address?.line_1 || "");
      setCity(userDetails.userDetails.address?.city || "");
      setPostalCode(userDetails.userDetails.address?.postal_code || "");
      setCountry(userDetails.userDetails.address?.country || "");
      setPaymentMethod(userDetails.userDetails.payment_method || "");
    }
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      // 1. Update user (email, password)
      await apiClient(`/users/${user?.id}`, {
        method: "PUT",
        body: JSON.stringify({
          email,
          first_name: firstName,
          last_name: lastName,
          ...(password ? { password } : {}),
        }),
      });

      // 2. Update address
      if (addressId) {
        await apiClient(`/addresses/${addressId}`, {
          method: "PUT",
          body: JSON.stringify({
            line_1: address,
            city,
            postal_code: postalCode,
            country,
          }),
        });
      }

      // 3. Update payment method
      if (userDetailsId) {
        await apiClient(`/user-details/${userDetailsId}`, {
          method: "PUT",
          body: JSON.stringify({
            payment_method: paymentMethod,
            // image: profileImage, // à gérer si modification possible
          }),
        });
      }

      Alert.alert("Succès", "Profil mis à jour !");
      setEditMode(false);
    } catch (err) {
      console.error(err);
      Alert.alert("Erreur", "Impossible de sauvegarder le profil.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.area}>
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.area}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* --- HEADER --- */}
        <View style={styles.headerRow}>
          <View style={styles.profileHeader}>
            {profileImage ? (
              <View style={styles.avatarWrapper}>
                <Image source={{ uri: profileImage }} style={styles.avatar} />
              </View>
            ) : (
              <View style={styles.avatarPlaceholder}>
                <AppIcon name="person" size={64} color={COLORS.primary} />
              </View>
            )}
            <View style={styles.headerInfo}>
              <Text style={styles.name}>
                {firstName} {lastName}
              </Text>
              <Text style={styles.email}>{email}</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.editButton} onPress={() => setEditMode((prev) => !prev)}>
            <AppIcon name={editMode ? "close" : "edit"} size={28} color={COLORS.primary} />
          </TouchableOpacity>
        </View>

        {/* --- INFOS --- */}
        {editMode ? (
          <>
            <Text style={styles.label}>Prénom</Text>
            <TextInput style={styles.input} value={firstName} onChangeText={setFirstName} />

            <Text style={styles.label}>Nom</Text>
            <TextInput style={styles.input} value={lastName} onChangeText={setLastName} />

            <Text style={styles.label}>Adresse e-mail</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />

            <Text style={styles.label}>Nouveau mot de passe</Text>
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              placeholder="Laisser vide pour ne pas changer"
            />

            <Text style={styles.label}>Adresse</Text>
            <TextInput
              style={styles.input}
              value={address}
              onChangeText={setAddress}
              placeholder="Adresse"
            />
            <TextInput
              style={styles.input}
              value={city}
              onChangeText={setCity}
              placeholder="Ville"
            />
            <TextInput
              style={styles.input}
              value={postalCode}
              onChangeText={setPostalCode}
              placeholder="Code postal"
            />
            <TextInput
              style={styles.input}
              value={country}
              onChangeText={setCountry}
              placeholder="Pays"
            />

            <Text style={styles.label}>Moyen de paiement</Text>
            <TextInput
              style={styles.input}
              value={paymentMethod}
              onChangeText={setPaymentMethod}
              placeholder="Carte, Paypal, etc."
            />

            <Button
              title={saving ? "Sauvegarde..." : "Enregistrer"}
              onPress={handleSave}
              disabled={saving}
              style={styles.saveButton}
            />
          </>
        ) : (
          <>
            <View style={styles.infoBlock}>
              <AppIcon name="mail" size={20} color={COLORS.primary} />
              <Text style={styles.infoText}>{email}</Text>
            </View>
            <View style={styles.infoBlock}>
              <AppIcon name="location-on" size={20} color={COLORS.primary} />
              <Text style={styles.infoText}>
                {address}, {city} {postalCode} {country}
              </Text>
            </View>
            <View style={styles.infoBlock}>
              <AppIcon name="credit-card" size={20} color={COLORS.primary} />
              <Text style={styles.infoText}>{paymentMethod || "Aucun"}</Text>
            </View>
          </>
        )}

        {/* --- BOTTOM ACTIONS --- */}
        <View style={styles.bottomRow}>
          <TouchableOpacity
            style={styles.bottomButton}
            onPress={() =>
              router.push({
                pathname: "/favorite" as unknown as RelativePathString,
              })
            }
          >
            <AppIcon name="heart" size={22} color={COLORS.primary} />
            <Text style={styles.buttonText}>Mes favoris</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.bottomButton, { marginLeft: 8 }]}
            onPress={() =>
              Alert.alert("À venir", "Gestion des moyens de paiement bientôt disponible !")
            }
          >
            <AppIcon name="credit-card" size={22} color={COLORS.primary} />
            <Text style={styles.buttonText}>Moyens de paiement</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  area: { flex: 1, backgroundColor: COLORS.white },
  container: { padding: 20, backgroundColor: COLORS.white },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  profileHeader: { flexDirection: "row", alignItems: "center" },
  avatarWrapper: {
    width: 80,
    height: 80,
    borderRadius: 40,
    overflow: "hidden",
    marginRight: 16,
    backgroundColor: COLORS.grayscale200,
    alignItems: "center",
    justifyContent: "center",
  },
  avatar: { width: 80, height: 80, borderRadius: 40 },
  avatarPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.grayscale200,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  headerInfo: {},
  name: { fontSize: 20, fontWeight: "600", color: COLORS.greyscale900 },
  email: { fontSize: 15, color: COLORS.greyscale900, marginTop: 2 },
  editButton: { padding: 8 },
  label: { fontSize: 16, color: COLORS.greyscale900, marginTop: 18, marginBottom: 6 },
  input: {
    backgroundColor: COLORS.grayscale100,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 8,
    color: COLORS.greyscale900,
  },
  infoBlock: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    marginBottom: 2,
  },
  infoText: { marginLeft: 8, fontSize: 16, color: COLORS.greyscale900 },
  saveButton: { marginTop: 24 },
  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 36,
  },
  bottomButton: {
    flex: 1,
    borderRadius: 32,
    backgroundColor: COLORS.grayscale100,
    marginHorizontal: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    marginLeft: 8,
    fontSize: 16,
    color: COLORS.primary,
    fontWeight: "600",
  },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
});

export default Profile;
