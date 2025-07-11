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
import { useRouter } from "expo-router";
import { useApiClient } from "@/utils/api-client";
import { useAuth } from "@/contexts/AuthContext";
import Button from "@/components/Button";
import AppIcon from "@/utils/AppIcon";
import { COLORS } from "@/constants";
import { Image } from "expo-image";

const Profile = () => {
  const { apiClient } = useApiClient();
  const { user } = useAuth();
  const router = useRouter();

  // States
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editMode, setEditMode] = useState(false);

  // User info
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState(""); // blank = no change
  const [profileImage, setProfileImage] = useState(""); // à compléter selon ton modèle

  // Address
  const [addressId, setAddressId] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [country, setCountry] = useState("");

  // Payment method
  const [paymentMethod, setPaymentMethod] = useState("");

  // User details id (for update)
  const [userDetailsId, setUserDetailsId] = useState("");

  // Load profile info
  useEffect(() => {
    if (!user?.id) return;
    setLoading(true);
    (async () => {
      try {
        // User info
        const userRes = await apiClient(`/users/${user.id}`, { method: "GET" });
        const userData = await userRes.json();
        setFirstName(userData.first_name || "");
        setLastName(userData.last_name || "");
        setEmail(userData.email || "");

        // User details (payment, address id, image)
        const detailsRes = await apiClient(`/user-details/user/${user.id}`, { method: "GET" });
        const detailsData = await detailsRes.json();
        if (detailsData) {
          setUserDetailsId(detailsData.id);
          setPaymentMethod(detailsData.payment_method || "");
          if (detailsData.address_id) setAddressId(detailsData.address_id);
          if (detailsData.image) setProfileImage(detailsData.image);
        }

        // Address
        if (detailsData?.address_id) {
          const addrRes = await apiClient(`/addresses/${detailsData.address_id}`, {
            method: "GET",
          });
          const addrData = await addrRes.json();
          setAddress(addrData.line_1 || "");
          setCity(addrData.city || "");
          setPostalCode(addrData.postal_code?.toString() || "");
          setCountry(addrData.country || "");
        }
      } catch (err) {
        Alert.alert("Erreur", "Impossible de charger le profil.");
      } finally {
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  // Save profile
  const handleSave = async () => {
    setSaving(true);
    try {
      // 1. Update user (email, password)
      await apiClient(`/users/${user?.id}`, {
        method: "PUT",
        body: JSON.stringify({
          email,
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
            // image: profileImage, // à gérer si tu veux permettre l'édition de la photo
          }),
        });
      }

      setEditMode(false);
      Alert.alert("Succès", "Profil mis à jour !");
    } catch (err) {
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
              autoCapitalize="none"
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
              keyboardType="numeric"
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

        <View style={styles.bottomRow}>
          <View style={styles.bottomRow}>
            <TouchableOpacity style={styles.bottomButton} onPress={() => router.push("/favorite")}>
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
