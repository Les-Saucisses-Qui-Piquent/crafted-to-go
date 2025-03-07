import { Tabs } from 'expo-router';

export default function CustomerLayout() {
  return (
    <Tabs>
      <Tabs.Screen name="explore" options={{ title: 'Explore' }} />
      <Tabs.Screen name="basket" options={{ title: 'Basket' }} />
      <Tabs.Screen name="orders" options={{ title: 'Orders' }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile' }} />
    </Tabs>
  );
}