import React, { useState, useEffect } from "react";
import { View, StyleSheet, ScrollView, Image, ActivityIndicator, Alert } from "react-native";
import Input from "@/components/form/Input";
import SelectInput from "@/components/form/SelectInput";
import SecondaryCTA from "@/components/Buttons/SecondaryCTA";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useApiClient } from "@/utils/api-client";
import { useBreweryData } from "@/contexts/BreweryDataContext";
import * as ImagePicker from "expo-image-picker";
import AppIcon from "@/utils/AppIcon";
import BeerImageUploader from "@/components/form/BeerImageUploader";

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
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    async function fetchOptions() {
      const styles = await apiClient("/beer-styles", { method: "GET" });
      setBeerStyles(styles.map((s: BeerStyle) => ({ label: s.label, value: s.id })));
      const colors = await apiClient("/beer-colors", { method: "GET" });
      setBeerColors(colors.map((c: BeerColor) => ({ label: c.label, value: c.id })));
    }
    fetchOptions();
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
    if (
      !form.name ||
      !form.beer_style_id ||
      !form.beer_color_id ||
      !form.abv_rate ||
      !form.quantity ||
      !form.price
    ) {
      Alert.alert("Tous les champs obligatoires doivent être remplis.");
      return;
    }
    setLoading(true);

    try {
      if (isEditMode && beerId) {
        // Edition: PUT /beers/:id
        const body: Partial<BeerApiResponse> = {
          name: form.name,
          beer_color_id: form.beer_color_id,
          beer_style_id: form.beer_style_id,
          abv_rate: form.abv_rate ? Number(form.abv_rate) : undefined,
          ibu_rate: form.ibu_rate ? Number(form.ibu_rate) : undefined,
          quantity: form.quantity ? Number(form.quantity) : undefined,
          price: form.price ? Number(form.price) : undefined,
        };

        await apiClient(`/beers/${beerId}`, {
          method: "PUT",
          body: JSON.stringify(body),
          headers: { "Content-Type": "application/json" },
        });

        // Upload image si nouvelle
        if (form.image?.uri) {
          await uploadBeerImage(beerId, form.image);
        }
        Alert.alert("Bière modifiée !");
      } else {
        // Création: POST /beers
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
          headers: { "Content-Type": "application/json" },
        });

        if (form.image?.uri && newBeer.id) {
          await uploadBeerImage(newBeer.id, form.image);
        }
        Alert.alert("Bière créée !");
      }
      router.back();
    } catch (e) {
      const errorMessage =
        typeof e === "object" && e !== null && "message" in e
          ? (e as { message?: string }).message
          : "Erreur inconnue";
      Alert.alert("Erreur lors de l'enregistrement", errorMessage || "Erreur inconnue");
    } finally {
      setLoading(false);
    }
  };

  const uploadBeerImage = async (beerId: string, imageAsset: ImageAsset) => {
    const formData = new FormData();
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    formData.append("image", {
      uri: imageAsset.uri,
      name: imageAsset.fileName || "beer.jpg",
      type: imageAsset.type || "image/jpeg",
    });
    await apiClient(`/beers/${beerId}/upload-image`, {
      method: "POST",
      body: formData,
      headers: { "Content-Type": "multipart/form-data" },
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header */}
      <View style={styles.headerRow}>
        <Image style={styles.logo} />
        <View style={{ flex: 1 }} />
        <AppIcon name="notifications-outline" size={20} color="#000" />
      </View>

      {/* Champs */}
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
          placeholder="Taux d'alcool"
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

      {/* Loading */}
      {loading && <ActivityIndicator size="large" color="#A09C9C" style={{ marginVertical: 20 }} />}

      {/* Bouton submit */}
      <SecondaryCTA
        title={isEditMode ? "Modifier la bière" : "Créer la bière"}
        style={styles.submitBtn}
        onPress={handleSubmit}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    padding: 16,
    alignItems: "center",
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    marginVertical: 8,
  },
  logo: {
    width: 36,
    height: 36,
    borderRadius: 8,
  },
  row: {
    flexDirection: "row",
    gap: 12,
    width: "100%",
  },
  submitBtn: {
    marginTop: 30,
    alignSelf: "center",
    width: 200,
  },
});
