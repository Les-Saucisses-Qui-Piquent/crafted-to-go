import { Tabs } from 'expo-router';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';

export default function CustomerLayout() {
  const colorScheme = useColorScheme();
  
  return (
    <Tabs screenOptions={{
      tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tabIconSelected,
      tabBarInactiveTintColor: Colors[colorScheme ?? 'light'].tabIconDefault,
      headerShown: false
    }}>
      <Tabs.Screen 
        name="(tabs)"
        options={{
          href: "/(customer)/(tabs)/",
        }}
      />
    </Tabs>
  );
}