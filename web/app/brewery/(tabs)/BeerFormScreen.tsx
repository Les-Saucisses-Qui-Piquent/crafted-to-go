import React, { useState, useEffect, useRef } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Image,
  ActivityIndicator,
  Alert,
  Keyboard,
  TouchableOpacity,
  Platform,
  TextInput,
  KeyboardAvoidingView,
} from "react-native";
import Input from "@/components/form/Input";
import SelectInput from "@/components/form/SelectInput";
import SecondaryCTA from "@/components/Buttons/SecondaryCTA";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useApiClient } from "@/utils/api-client";
import { useBreweryData } from "@/contexts/BreweryDataContext";
import * as ImagePicker from "expo-image-picker";
import AppIcon from "@/utils/AppIcon";
import BeerImageUploader from "@/components/form/BeerImageUploader";
import { COLORS, SIZES } from "@/constants/theme";

// ===== TYPES (originaux, tous présents) =====

export interface BeerForm {
  name: string;
  beer_style_id: string;
  beer_color_id: string;
  abv_rate: string;
  ibu_rate: string;
  quantity: string;
  price: string;
  image: ImageAsset | null;
  existingImage?: string;
  value?: string;
}

export interface BeerBody {
  name: string;
  beer_color?: { connect: { id: string } };
  beer_style?: { connect: { id: string } };
  abv_rate: GLfloat;
  ibu_rate: number;
  quantity: number;
  price: GLfloat;
}

export interface BeerStyleOption {
  label: string;
  value: string;
}
export interface BeerColorOption {
  label: string;
  value: string;
}

export interface BeerApiResponse {
  id: string;
  name: string;
  beer_style_id: string;
  beer_color_id: string;
  abv_rate: number;
  ibu_rate?: number;
  format?: string;
  quantity: number;
  price: number;
  description?: string;
  image?: string;
}

export interface ImageAsset {
  uri: string;
  width?: number;
  height?: number;
  type?: string;
  fileName?: string;
}

export interface BeerStyle {
  id: string;
  label: string;
}
export interface BeerColor {
  id: string;
  label: string;
}

export type ExpoFileObject = {
  uri: string;
  name: string;
  type: string;
};

export default function BeerForm() {
  const router = useRouter();
  const { isEdit, beerId } = useLocalSearchParams<{ isEdit?: string; beerId?: string }>();
  const isEditMode = isEdit === "true";
  const { apiClient } = useApiClient();
  const { brewery } = useBreweryData();

  const [beerStyles, setBeerStyles] = useState<BeerStyleOption[]>([]);
  const [beerColors, setBeerColors] = useState<BeerColorOption[]>([]);
  const [form, setForm] = useState<BeerForm>({
    name: "",
    beer_style_id: "",
    beer_color_id: "",
    abv_rate: "",
    ibu_rate: "",
    quantity: "",
    price: "",
    image: null,
    existingImage: undefined,
  });
  const [loading, setLoading] = useState(false);

  const nameInputRef = useRef<TextInput>(null);
  const scrollRef = useRef<ScrollView>(null);
  const scrollToTop = () => {
    scrollRef.current?.scrollTo({ y: 0, animated: true });
  };

  useEffect(() => {
    let mounted = true;
    async function fetchOptions() {
      try {
        const styles = await apiClient("/beer-styles", { method: "GET" });
        const colors = await apiClient("/beer-colors", { method: "GET" });
        if (!mounted) return;
        setBeerStyles(styles.map((s: BeerStyle) => ({ label: s.label, value: s.id })));
        setBeerColors(colors.map((c: BeerColor) => ({ label: c.label, value: c.id })));
      } catch (e) {
        Alert.alert("Erreur chargement styles/couleurs", "Impossible de charger les options.");
      }
    }
    fetchOptions();
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (isEditMode && beerId) {
      setLoading(true);
      apiClient(`/beers/${beerId}`, { method: "GET" })
        .then((beer: BeerApiResponse) => {
          setForm({
            name: beer.name || "",
            beer_style_id: beer.beer_style_id || "",
            beer_color_id: beer.beer_color_id || "",
            abv_rate: beer.abv_rate ? String(beer.abv_rate) : "",
            ibu_rate: beer.ibu_rate ? String(beer.ibu_rate) : "",
            quantity: beer.quantity ? String(beer.quantity) : "",
            price: beer.price ? String(beer.price) : "",
            image: null,
            existingImage: beer.image || undefined,
          });
        })
        .finally(() => setLoading(false));
    }
  }, []);

  const handleInputChange = (id: string, value: string) => {
    setForm((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleSelectChange = (key: keyof BeerForm, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const pickImage = async () => {
    Keyboard.dismiss();
    if (Platform.OS === "ios") {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission requise", "Veuillez autoriser l’accès à vos images.");
        return;
      }
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });
    if (!result.canceled && result.assets?.length > 0) {
      setForm((prev) => ({
        ...prev,
        image: result.assets[0] as ImageAsset,
        existingImage: undefined,
      }));
    }
  };

  const handleSubmit = async () => {
    if (!form.name) {
      nameInputRef.current?.focus?.();
      scrollToTop();
      Alert.alert("Champ requis", "Merci d'indiquer le nom de la bière.");
      return;
    }
    if (
      !form.beer_style_id ||
      !form.beer_color_id ||
      !form.abv_rate ||
      !form.quantity ||
      !form.price
    ) {
      scrollToTop();
      Alert.alert("Champs manquants", "Merci de remplir tous les champs obligatoires.");
      return;
    }
    setLoading(true);

    try {
      let newBeerId: string | undefined;
      if (isEditMode && beerId) {
        const body = {
          name: form.name,
          beer_color_id: form.beer_color_id,
          beer_style_ids: form.beer_style_id,
          abv_rate: Number(form.abv_rate),
          ibu_rate: form.ibu_rate ? Number(form.ibu_rate) : undefined,
          quantity: Number(form.quantity),
          price: Number(form.price),
        };

        await apiClient(`/beers/${beerId}`, {
          method: "PUT",
          body: JSON.stringify(body),
          headers: { "Content-Type": "application/json" },
        });
        newBeerId = beerId;
        Alert.alert("Succès", "Bière modifiée !");
      } else {
        const body = {
          name: form.name,
          beer_color_id: form.beer_color_id,
          brewery_id: brewery?.id,
          beer_style_ids: form.beer_style_id,
          abv_rate: Number(form.abv_rate),
          ibu_rate: form.ibu_rate ? Number(form.ibu_rate) : undefined,
          quantity: Number(form.quantity),
          price: Number(form.price),
        };

        const newBeer: BeerApiResponse = await apiClient("/beers", {
          method: "POST",
          body: JSON.stringify(body),
        });
        newBeerId = newBeer.id;
        Alert.alert("Succès", "Bière créée !");
      }

      if (form.image?.uri && newBeerId) {
        await uploadBeerImage(newBeerId, form.image);
      }

      router.back();
    } catch (e) {
      console.log("Erreur handleSubmit:", e);
      const errorMessage =
        typeof e === "object" && e !== null && "message" in e
          ? (e as { message?: string }).message
          : "Erreur inconnue";
      Alert.alert("Erreur", errorMessage || "Erreur inconnue");
    } finally {
      setLoading(false);
    }
  };

  const uploadBeerImage = async (beerId: string, imageAsset: ImageAsset) => {
    const formData = new FormData();
    // @ts-expect-error React Native FormData file object
    formData.append("image", {
      uri: imageAsset.uri,
      name: imageAsset.fileName || "beer.jpg",
      type: imageAsset.type || "image/jpeg",
    } as { uri: string; name: string; type: string });

    await apiClient(`/beers/${beerId}/upload-image`, {
      method: "POST",
      body: formData,
    });
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.select({ ios: 0, android: 24 })}
    >
      <View style={styles.flex}>
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
          ref={scrollRef}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.headerRow}>
            <Image style={styles.logo} />
            <View style={{ flex: 1 }} />
            <TouchableOpacity hitSlop={16}>
              <AppIcon name="notifications-outline" size={22} color="#222" />
            </TouchableOpacity>
          </View>
          <View style={styles.formCard}>
            <View style={styles.row}>
              <Input
                label="Nom"
                id="name"
                placeholder="Nom de la bière"
                onInputChanged={handleInputChange}
                value={form.name}
              />
            </View>
            <View style={styles.row}>
              <SelectInput
                label="Type"
                items={beerStyles}
                onValueChange={(v: string) => handleSelectChange("beer_style_id", v)}
                selectedValue={form.beer_style_id}
                small
              />
              <View style={{ width: 12 }} />
              <SelectInput
                label="Couleur"
                items={beerColors}
                onValueChange={(v: string) => handleSelectChange("beer_color_id", v)}
                selectedValue={form.beer_color_id}
                small
              />
            </View>
            <View style={styles.row}>
              <Input
                label="ABV"
                id="abv_rate"
                placeholder="Taux d'alcool (%)"
                onInputChanged={handleInputChange}
                keyboardType="numeric"
                value={form.abv_rate}
                small
              />
              <View style={{ width: 12 }} />
              <Input
                label="IBU"
                id="ibu_rate"
                placeholder="Amertume"
                onInputChanged={handleInputChange}
                keyboardType="numeric"
                value={form.ibu_rate}
                small
              />
            </View>
            <BeerImageUploader
              image={form.image}
              existingImage={form.existingImage}
              onPickImage={pickImage}
              loading={loading}
            />
            <View style={styles.row}>
              <Input
                label="Quantité"
                id="quantity"
                placeholder="Quantité"
                onInputChanged={handleInputChange}
                keyboardType="numeric"
                value={form.quantity}
                small
              />
              <View style={{ width: 12 }} />
              <Input
                label="Prix"
                id="price"
                placeholder="Prix (€)"
                onInputChanged={handleInputChange}
                keyboardType="numeric"
                value={form.price}
                small
              />
            </View>
            {loading && (
              <ActivityIndicator
                size="large"
                color={COLORS.greyscale900}
                style={{ marginVertical: 20 }}
              />
            )}
            <SecondaryCTA
              title={isEditMode ? "Modifier la bière" : "Créer la bière"}
              style={styles.submitBtn}
              onPress={handleSubmit}
            />
          </View>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: COLORS.secondaryWhite,
  },
  scrollContainer: {
    padding: SIZES.padding3,
    alignItems: "center",
    paddingBottom: 56,
    // Pas de minHeight, pas de flexGrow ici !
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    marginTop: Platform.select({ ios: SIZES.padding2 * 2, android: SIZES.padding2 }),
    marginBottom: SIZES.padding2,
  },
  logo: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: COLORS.greyscale300,
  },
  formCard: {
    width: "100%",
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius,
    padding: SIZES.padding3,
    shadowColor: COLORS.black,
    shadowOpacity: 0.09,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
    marginBottom: SIZES.padding2,
    flexShrink: 0,
  },
  row: {
    flexDirection: "row",
    gap: SIZES.padding,
    width: "100%",
    marginBottom: SIZES.padding2,
    alignItems: "center",
  },
  input: {
    flex: 1,
    minWidth: 120,
  },
  submitBtn: {
    marginTop: 24,
    alignSelf: "center",
    width: 220,
    borderRadius: SIZES.radius / 1.5,
    height: 48,
    justifyContent: "center",
  },
});
