import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { colores } from '@/constants/colores';
import type { DatosPost } from '@/types/post';
import type { Usuario } from '@/types/usuario';
import { mensajeError } from '@/utils/errores';
import { validarPost, type ErroresPost } from '@/validaciones/post';
import { Boton } from './boton';
import { EstadoError } from './estado-error';
import { SelectorAutor } from './selector-autor';

type Props = {
  usuarios: Usuario[];
  inicial?: DatosPost;
  modo: 'crear' | 'editar';
  onGuardar: (datos: DatosPost) => Promise<void>;
};

export function FormularioPost({ usuarios, inicial, modo, onGuardar }: Props) {
  const [title, setTitle] = useState(inicial?.title ?? '');
  const [body, setBody] = useState(inicial?.body ?? '');
  const [userId, setUserId] = useState(inicial?.userId ?? 0);
  const [errores, setErrores] = useState<ErroresPost>({});
  const [enviando, setEnviando] = useState(false);
  const [errorEnvio, setErrorEnvio] = useState<string | null>(null);

  function cambiarTitulo(texto: string) {
    setTitle(texto);
    setErrores(actuales => ({ ...actuales, title: undefined }));
  }

  function cambiarCuerpo(texto: string) {
    setBody(texto);
    setErrores(actuales => ({ ...actuales, body: undefined }));
  }

  function cambiarAutor(id: number) {
    setUserId(id);
    setErrores(actuales => ({ ...actuales, userId: undefined }));
  }

  async function guardar() {
    if (enviando) return;
    const datos = { title: title.trim(), body: body.trim(), userId };
    const nuevosErrores = validarPost(datos, usuarios);
    setErrores(nuevosErrores);
    if (Object.keys(nuevosErrores).length) return;
    setEnviando(true);
    setErrorEnvio(null);
    try { await onGuardar(datos); }
    catch (error) { setErrorEnvio(mensajeError(error)); }
    finally { setEnviando(false); }
  }

  return <KeyboardAvoidingView style={styles.pantalla} behavior={Platform.OS === 'ios' ? 'padding' : undefined} keyboardVerticalOffset={96}>
    <ScrollView contentContainerStyle={styles.contenido} keyboardShouldPersistTaps="handled" automaticallyAdjustKeyboardInsets>
      <Text style={styles.encabezado}>{modo === 'crear' ? 'Compartí una idea' : 'Editá tu publicación'}</Text>
      <Text style={styles.intro}>Completá el título, el mensaje y su autor.</Text>
      <View style={styles.campo}>
        <Text style={styles.etiqueta}>Título</Text>
        <TextInput accessibilityLabel="Título" value={title} onChangeText={cambiarTitulo} editable={!enviando}
          placeholder="¿Sobre qué querés hablar?" placeholderTextColor={colores.secundario}
          style={[styles.input, errores.title && styles.bordeError]} />
        <Text style={styles.ayuda}>Mínimo 5 caracteres.</Text>
        {errores.title ? <Text style={styles.error} accessibilityLiveRegion="polite">{errores.title}</Text> : null}
      </View>
      <View style={styles.campo}>
        <Text style={styles.etiqueta}>Cuerpo</Text>
        <TextInput accessibilityLabel="Cuerpo" value={body} onChangeText={cambiarCuerpo} editable={!enviando}
          placeholder="Escribí tu mensaje para la comunidad…" placeholderTextColor={colores.secundario}
          multiline textAlignVertical="top" style={[styles.input, styles.cuerpo, errores.body && styles.bordeError]} />
        <Text style={styles.ayuda}>Mínimo 20 caracteres.</Text>
        {errores.body ? <Text style={styles.error} accessibilityLiveRegion="polite">{errores.body}</Text> : null}
      </View>
      <SelectorAutor usuarios={usuarios} valor={userId} onChange={cambiarAutor} deshabilitado={enviando} error={errores.userId} />
      {errorEnvio ? <EstadoError compacto mensaje={errorEnvio} onRetry={() => { void guardar(); }} /> : null}
      <Boton titulo={modo === 'crear' ? 'Guardar publicación' : 'Guardar cambios'} ocupado={enviando}
        onPress={() => { void guardar(); }} />
    </ScrollView>
  </KeyboardAvoidingView>;
}

const styles = StyleSheet.create({
  pantalla: { flex: 1, backgroundColor: colores.fondo },
  contenido: { padding: 24, gap: 22, paddingBottom: 48, maxWidth: 640, width: '100%', alignSelf: 'center' },
  encabezado: { color: colores.texto, fontSize: 28, fontWeight: '800', letterSpacing: -0.7 },
  intro: { color: colores.secundario, fontSize: 15, lineHeight: 23, marginTop: -12 },
  campo: { gap: 8 },
  etiqueta: { color: colores.texto, fontSize: 15, fontWeight: '600' },
  input: { backgroundColor: colores.superficie, color: colores.texto, borderColor: colores.borde, borderWidth: 1,
    borderRadius: 14, padding: 16, fontSize: 15, minHeight: 54 },
  cuerpo: { minHeight: 162, lineHeight: 23 },
  ayuda: { color: colores.secundario, fontSize: 12 },
  bordeError: { borderColor: colores.acento },
  error: { color: colores.texto, fontSize: 13, fontWeight: '600' },
});
