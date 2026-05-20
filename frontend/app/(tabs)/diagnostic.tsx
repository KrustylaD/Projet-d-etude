import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
  Image,
} from 'react-native';
import { useAuthStore } from '../../src/store/authStore';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Message } from '../../src/types';
import { MarkdownMessage } from '../../src/components/MarkdownMessage';
import * as ImagePicker from 'expo-image-picker';
import { useLocalSearchParams, useRouter } from 'expo-router';

export default function DiagnosticScreen() {
  const { user } = useAuthStore();
  const router = useRouter();
  const params = useLocalSearchParams<{ id?: string }>();
  const scrollViewRef = useRef<ScrollView>(null);

  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [pendingImage, setPendingImage] = useState<string | null>(null); // base64 data URI
  const [culture, setCulture] = useState('');
  const [symptoms, setSymptoms] = useState('');
  const [diagnosticId, setDiagnosticId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [showInitialForm, setShowInitialForm] = useState(true);

  // Si un id est passé en paramètre, charger le diagnostic et son historique
  useEffect(() => {
    const id = params.id;
    if (id && user && id !== diagnosticId) {
      loadExistingDiagnostic(id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id, user]);

  const loadExistingDiagnostic = async (id: string) => {
    if (!user) return;
    setLoadingHistory(true);
    try {
      // Charger le diagnostic
      const diagResp = await fetch(
        `${process.env.EXPO_PUBLIC_BACKEND_URL}/api/diagnostics/${id}/detail?user_id=${user.uid}`
      );
      if (!diagResp.ok) throw new Error('Diagnostic introuvable');
      const diagnostic = await diagResp.json();

      // Charger les messages
      const msgsResp = await fetch(
        `${process.env.EXPO_PUBLIC_BACKEND_URL}/api/messages/${id}?user_id=${user.uid}`
      );
      const msgs = msgsResp.ok ? await msgsResp.json() : [];

      setCulture(diagnostic.culture);
      setSymptoms(diagnostic.symptoms);
      setDiagnosticId(id);

      // S'il n'y a aucun message historique, ajouter un message d'accueil
      if (msgs.length === 0) {
        setMessages([
          {
            role: 'assistant',
            content: `Reprise du diagnostic pour **${diagnostic.culture}**.\n\nSymptômes initialement décrits : *"${diagnostic.symptoms}"*\n\nComment puis-je vous aider à poursuivre ?`,
            created_at: new Date().toISOString(),
          },
        ]);
      } else {
        setMessages(msgs);
      }

      setShowInitialForm(false);
    } catch (error) {
      console.error('Error loading diagnostic:', error);
      Alert.alert('Erreur', 'Impossible de charger ce diagnostic');
    } finally {
      setLoadingHistory(false);
    }
  };

  const createDiagnostic = async () => {
    if (!culture.trim() || !symptoms.trim()) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_BACKEND_URL}/api/diagnostics?user_id=${user?.uid}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ culture, symptoms }),
        }
      );

      if (!response.ok) throw new Error('Failed to create diagnostic');

      const diagnostic = await response.json();
      setDiagnosticId(diagnostic.id);
      setShowInitialForm(false);

      const welcomeMessage: Message = {
        role: 'assistant',
        content: `Bonjour ! Je vais vous aider à diagnostiquer les problèmes de votre **${culture}**.\n\nVous avez mentionné : *"${symptoms}"*\n\nPour un diagnostic plus précis, vous pouvez :\n- Décrire plus en détail les symptômes observés\n- 📸 **Joindre une photo** de la plante en cliquant sur l'icône appareil photo\n\nQue souhaitez-vous me partager ?`,
        created_at: new Date().toISOString(),
      };
      setMessages([welcomeMessage]);
    } catch (error) {
      console.error('Error creating diagnostic:', error);
      Alert.alert('Erreur', 'Impossible de créer le diagnostic');
    } finally {
      setLoading(false);
    }
  };

  const pickImageFromSource = async (source: 'camera' | 'library') => {
    try {
      if (source === 'camera') {
        const { status, canAskAgain } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
          if (!canAskAgain) {
            Alert.alert(
              'Permission requise',
              "L'accès à la caméra est nécessaire. Activez-le dans les réglages."
            );
          }
          return;
        }
        const result = await ImagePicker.launchCameraAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [4, 3],
          quality: 0.5,
          base64: true,
        });
        if (!result.canceled && result.assets[0]?.base64) {
          setPendingImage(`data:image/jpeg;base64,${result.assets[0].base64}`);
        }
      } else {
        const { status, canAskAgain } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          if (!canAskAgain) {
            Alert.alert(
              'Permission requise',
              "L'accès aux photos est nécessaire. Activez-le dans les réglages."
            );
          }
          return;
        }
        const result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [4, 3],
          quality: 0.5,
          base64: true,
        });
        if (!result.canceled && result.assets[0]?.base64) {
          setPendingImage(`data:image/jpeg;base64,${result.assets[0].base64}`);
        }
      }
    } catch (error) {
      console.error('Image picker error:', error);
      Alert.alert('Erreur', "Impossible de sélectionner l'image");
    }
  };

  const handleAttachPhoto = () => {
    Alert.alert(
      'Ajouter une photo',
      'Choisissez la source de la photo',
      [
        { text: 'Annuler', style: 'cancel' },
        { text: '📷 Caméra', onPress: () => pickImageFromSource('camera') },
        { text: '🖼️ Galerie', onPress: () => pickImageFromSource('library') },
      ]
    );
  };

  const sendMessage = async () => {
    if ((!inputText.trim() && !pendingImage) || !diagnosticId || !user) return;

    const messageText = inputText.trim() || (pendingImage ? 'Analyse cette photo de ma plante.' : '');

    const userMessage: Message = {
      role: 'user',
      content: messageText,
      image_base64: pendingImage || undefined,
      created_at: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    const imageToSend = pendingImage;
    setInputText('');
    setPendingImage(null);
    setLoading(true);

    try {
      const body: any = {
        diagnostic_id: diagnosticId,
        message: messageText,
      };
      if (imageToSend) {
        body.image_base64 = imageToSend;
      }

      const response = await fetch(
        `${process.env.EXPO_PUBLIC_BACKEND_URL}/api/chat?user_id=${user.uid}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        }
      );

      if (!response.ok) throw new Error('Failed to send message');

      const aiMessage = await response.json();
      setMessages((prev) => [...prev, aiMessage]);

      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    } catch (error) {
      console.error('Error sending message:', error);
      Alert.alert('Erreur', "Impossible d'envoyer le message");
    } finally {
      setLoading(false);
    }
  };

  const startNewDiagnostic = () => {
    setShowInitialForm(true);
    setMessages([]);
    setDiagnosticId(null);
    setCulture('');
    setSymptoms('');
    setInputText('');
    setPendingImage(null);
    // Effacer le paramètre URL si présent (sinon useEffect rechargerait)
    if (params.id) {
      router.setParams({ id: '' });
    }
  };

  if (loadingHistory) {
    return (
      <LinearGradient colors={['#1a2f1a', '#0a1a0a', '#000000']} style={styles.container}>
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#4ade80" />
            <Text style={styles.loadingText}>Chargement de la conversation...</Text>
          </View>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  if (showInitialForm) {
    return (
      <LinearGradient colors={['#1a2f1a', '#0a1a0a', '#000000']} style={styles.container}>
        <SafeAreaView style={styles.safeArea}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.keyboardView}
          >
            <ScrollView contentContainerStyle={styles.formContent}>
              <View style={styles.formHeader}>
                <Ionicons name="chatbubbles" size={60} color="#4ade80" />
                <Text style={styles.formTitle}>Nouveau Diagnostic</Text>
                <Text style={styles.formSubtitle}>
                  Décrivez les problèmes de votre culture
                </Text>
              </View>

              <View style={styles.form}>
                <Text style={styles.label}>Type de culture *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Ex: Tomates, Maïs, Blé..."
                  placeholderTextColor="#666"
                  value={culture}
                  onChangeText={setCulture}
                />

                <Text style={styles.label}>Symptômes observés *</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  placeholder="Décrivez les symptômes : taches, flétrissement, décoloration..."
                  placeholderTextColor="#666"
                  value={symptoms}
                  onChangeText={setSymptoms}
                  multiline
                  numberOfLines={4}
                />

                <View style={styles.tipCard}>
                  <Ionicons name="camera" size={18} color="#4ade80" />
                  <Text style={styles.tipText}>
                    Vous pourrez joindre une photo de votre plante depuis le chat pour une analyse visuelle par l&apos;IA.
                  </Text>
                </View>

                <TouchableOpacity
                  style={[styles.button, loading && styles.buttonDisabled]}
                  onPress={createDiagnostic}
                  disabled={loading}
                >
                  {loading ? (
                    <ActivityIndicator color="#000" />
                  ) : (
                    <>
                      <Ionicons name="arrow-forward" size={20} color="#000" />
                      <Text style={styles.buttonText}>Commencer le diagnostic</Text>
                    </>
                  )}
                </TouchableOpacity>
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={['#1a2f1a', '#0a1a0a', '#000000']} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.chatHeader}>
          <TouchableOpacity onPress={startNewDiagnostic} style={styles.newChatButton}>
            <Ionicons name="add-circle-outline" size={24} color="#4ade80" />
          </TouchableOpacity>
          <View style={styles.chatHeaderInfo}>
            <Text style={styles.chatTitle}>{culture}</Text>
            <Text style={styles.chatSubtitle}>Diagnostic en cours</Text>
          </View>
          <View style={{ width: 40 }} />
        </View>

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.chatContainer}
          keyboardVerticalOffset={90}
        >
          <ScrollView
            ref={scrollViewRef}
            contentContainerStyle={styles.messagesContent}
            onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
          >
            {messages.map((message, index) => (
              <View
                key={index}
                style={[
                  styles.messageBubble,
                  message.role === 'user' ? styles.userBubble : styles.aiBubble,
                ]}
              >
                {message.role !== 'user' && (
                  <Ionicons
                    name="leaf"
                    size={20}
                    color="#4ade80"
                    style={styles.messageIcon}
                  />
                )}
                <View style={styles.messageContent}>
                  {message.image_base64 && (
                    <Image
                      source={{ uri: message.image_base64 }}
                      style={styles.messageImage}
                      resizeMode="cover"
                    />
                  )}
                  {message.role === 'user' ? (
                    message.content ? (
                      <Text style={[styles.messageText, styles.userText]}>
                        {message.content}
                      </Text>
                    ) : null
                  ) : (
                    <View style={styles.aiTextWrapper}>
                      <MarkdownMessage content={message.content} />
                    </View>
                  )}
                </View>
              </View>
            ))}
            {loading && (
              <View style={[styles.messageBubble, styles.aiBubble]}>
                <Ionicons name="leaf" size={20} color="#4ade80" style={styles.messageIcon} />
                <View style={styles.aiTextWrapper}>
                  <View style={styles.typingContainer}>
                    <ActivityIndicator size="small" color="#4ade80" />
                    <Text style={styles.typingText}>L&apos;IA analyse...</Text>
                  </View>
                </View>
              </View>
            )}
          </ScrollView>

          {/* Image Preview */}
          {pendingImage && (
            <View style={styles.previewContainer}>
              <Image source={{ uri: pendingImage }} style={styles.previewImage} />
              <View style={styles.previewInfo}>
                <Ionicons name="image" size={16} color="#4ade80" />
                <Text style={styles.previewText}>Photo prête à envoyer</Text>
              </View>
              <TouchableOpacity
                onPress={() => setPendingImage(null)}
                style={styles.previewRemove}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Ionicons name="close-circle" size={24} color="#ef4444" />
              </TouchableOpacity>
            </View>
          )}

          <View style={styles.inputContainer}>
            <TouchableOpacity
              style={styles.attachButton}
              onPress={handleAttachPhoto}
              disabled={loading}
              activeOpacity={0.7}
            >
              <Ionicons
                name="camera"
                size={24}
                color={pendingImage ? '#4ade80' : '#a3a3a3'}
              />
            </TouchableOpacity>
            <TextInput
              style={styles.messageInput}
              placeholder={pendingImage ? 'Ajouter un message (optionnel)' : 'Posez votre question...'}
              placeholderTextColor="#666"
              value={inputText}
              onChangeText={setInputText}
              multiline
              maxLength={500}
            />
            <TouchableOpacity
              style={[
                styles.sendButton,
                (!inputText.trim() && !pendingImage) || loading ? styles.sendButtonDisabled : null,
              ]}
              onPress={sendMessage}
              disabled={(!inputText.trim() && !pendingImage) || loading}
            >
              <Ionicons
                name="send"
                size={22}
                color={(inputText.trim() || pendingImage) && !loading ? '#000' : '#666'}
              />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1 },
  keyboardView: { flex: 1 },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  loadingText: {
    color: '#a3a3a3',
    fontSize: 14,
  },
  formContent: {
    padding: 24,
    paddingTop: 48,
  },
  formHeader: {
    alignItems: 'center',
    marginBottom: 48,
  },
  formTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    marginTop: 16,
  },
  formSubtitle: {
    fontSize: 16,
    color: '#a3a3a3',
    marginTop: 8,
    textAlign: 'center',
  },
  form: { width: '100%' },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 16,
    color: '#ffffff',
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#2a2a2a',
    marginBottom: 24,
  },
  textArea: {
    height: 120,
    textAlignVertical: 'top',
  },
  tipCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(74, 222, 128, 0.08)',
    borderRadius: 10,
    padding: 12,
    gap: 10,
    borderWidth: 1,
    borderColor: '#1f3a1f',
    marginBottom: 24,
  },
  tipText: {
    color: '#a3a3a3',
    fontSize: 13,
    flex: 1,
    lineHeight: 18,
  },
  button: {
    backgroundColor: '#4ade80',
    borderRadius: 12,
    height: 56,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    marginTop: 8,
  },
  buttonDisabled: { opacity: 0.6 },
  buttonText: {
    color: '#000000',
    fontSize: 18,
    fontWeight: 'bold',
  },
  chatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#1a1a1a',
  },
  newChatButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chatHeaderInfo: {
    flex: 1,
    alignItems: 'center',
  },
  chatTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  chatSubtitle: {
    fontSize: 14,
    color: '#4ade80',
    marginTop: 2,
  },
  chatContainer: { flex: 1 },
  messagesContent: {
    padding: 16,
    paddingBottom: 8,
  },
  messageBubble: {
    flexDirection: 'row',
    marginBottom: 16,
    maxWidth: '88%',
  },
  userBubble: { alignSelf: 'flex-end' },
  aiBubble: { alignSelf: 'flex-start' },
  messageIcon: {
    marginRight: 8,
    marginTop: 2,
  },
  messageContent: { flex: 1 },
  messageImage: {
    width: 220,
    height: 165,
    borderRadius: 12,
    marginBottom: 6,
    backgroundColor: '#1a1a1a',
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  userText: {
    backgroundColor: '#4ade80',
    color: '#000000',
    padding: 12,
    borderRadius: 16,
    borderBottomRightRadius: 4,
    overflow: 'hidden',
  },
  aiTextWrapper: {
    backgroundColor: '#1a1a1a',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 16,
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: '#2a2a2a',
  },
  typingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 4,
  },
  typingText: {
    color: '#a3a3a3',
    fontSize: 14,
    fontStyle: 'italic',
  },
  previewContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    marginHorizontal: 16,
    marginBottom: 8,
    borderRadius: 12,
    padding: 8,
    borderWidth: 1,
    borderColor: '#2a3a2a',
  },
  previewImage: {
    width: 56,
    height: 56,
    borderRadius: 8,
    marginRight: 12,
  },
  previewInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  previewText: {
    color: '#4ade80',
    fontSize: 14,
    fontWeight: '600',
  },
  previewRemove: {
    padding: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingVertical: 10,
    alignItems: 'flex-end',
    gap: 6,
    borderTopWidth: 1,
    borderTopColor: '#1a1a1a',
  },
  attachButton: {
    width: 44,
    height: 44,
    backgroundColor: '#1a1a1a',
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2a2a2a',
  },
  messageInput: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    borderRadius: 22,
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: '#ffffff',
    fontSize: 16,
    maxHeight: 100,
    borderWidth: 1,
    borderColor: '#2a2a2a',
  },
  sendButton: {
    width: 44,
    height: 44,
    backgroundColor: '#4ade80',
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#1a1a1a',
  },
});
