import { Stack } from "expo-router";

export default function PaymentLayout() {
  return (
    <Stack>
      <Stack.Screen name="Checkout" options={{ headerShown: false }} />
      <Stack.Screen name="CheckoutConfirmation" options={{ headerShown: false }} />
    </Stack>
  );
}
