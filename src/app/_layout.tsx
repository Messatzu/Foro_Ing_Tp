import { DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Aviso } from '@/components/aviso';
import { colores } from '@/constants/colores';
import { PostsProvider } from '@/context/posts-context';

export const unstable_settings = { initialRouteName: '(tabs)' };

export default function RootLayout() {
  return <SafeAreaProvider>
    <ThemeProvider value={tema}>
      <PostsProvider>
        <View style={styles.pantalla}>
          <StatusBar style="dark" />
          <Stack screenOptions={opciones}>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="post/[id]" options={{ title: 'Publicación' }} />
            <Stack.Screen name="post/nuevo" options={{ title: 'Nueva publicación' }} />
            <Stack.Screen name="post/editar/[id]" options={{ title: 'Editar publicación' }} />
            <Stack.Screen name="usuario/[id]" options={{ title: 'Perfil de usuario' }} />
          </Stack>
          <Aviso />
        </View>
      </PostsProvider>
    </ThemeProvider>
  </SafeAreaProvider>;
}

const tema = { ...DefaultTheme, colors: { ...DefaultTheme.colors, primary: colores.acento,
  background: colores.fondo, card: colores.fondo, text: colores.texto,
  border: colores.borde, notification: colores.acento } };

const styles = StyleSheet.create({
  pantalla: { flex: 1, backgroundColor: colores.fondo },
  cabecera: { backgroundColor: colores.fondo },
  titulo: { color: colores.texto, fontSize: 16, fontWeight: '600' },
});

const opciones = {
  headerStyle: styles.cabecera,
  headerTintColor: colores.texto,
  headerTitleStyle: styles.titulo,
  headerShadowVisible: false,
  contentStyle: styles.pantalla,
  headerBackButtonDisplayMode: 'minimal' as const,
};
