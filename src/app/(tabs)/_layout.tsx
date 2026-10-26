import Ionicons from '@expo/vector-icons/Ionicons';
import { Tabs } from 'expo-router';
import { StyleSheet } from 'react-native';
import { colores } from '@/constants/colores';

export default function TabsLayout() {
  return <Tabs screenOptions={opciones}>
    <Tabs.Screen name="index" options={{ title: 'Publicaciones', tabBarIcon: ({ color, size }) =>
      <Ionicons name="chatbubbles-outline" color={color} size={size} /> }} />
    <Tabs.Screen name="usuarios" options={{ title: 'Usuarios', tabBarIcon: ({ color, size }) =>
      <Ionicons name="people-outline" color={color} size={size} /> }} />
  </Tabs>;
}

const styles = StyleSheet.create({
  barra: { backgroundColor: colores.fondo, borderTopColor: colores.borde, paddingTop: 8, minHeight: 64 },
  etiqueta: { fontSize: 12, fontWeight: '600', marginTop: 3 },
});

const opciones = {
  headerShown: false,
  tabBarActiveTintColor: colores.acento,
  tabBarInactiveTintColor: colores.secundario,
  tabBarStyle: styles.barra,
  tabBarLabelStyle: styles.etiqueta,
};
