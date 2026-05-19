import React, { useState, useEffect, useRef } from 'react';
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
} from 'react-native';
import { useAuthStore } from '../../src/store/authStore';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Message } from '../../src/types';
import { Colors, Typography, Spacing, BorderRadius } from '../../src/constants/theme';
import { MarkdownMessage } from '../../src/components/MarkdownMessage';

export default function DiagnosticScreen() {
  const { user } = useAuthStore();
  const scrollViewRef = useRef<ScrollView>(null);
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [culture, setCulture] = useState('');
  const [symptoms, setSymptoms] = useState('');
  const [diagnosticId, setDiagnosticId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showInitialForm, setShowInitialForm] = useState(true);

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
      
      // Ajouter un message d'accueil
      const welcomeMessage: Message = {
        role: 'assistant',
        content: `Bonjour ! Je vais vous aider à diagnostiquer les problèmes de votre ${culture}.\n\nVous avez mentionné : "${symptoms}"\n\nPouvez-vous me donner plus de détails sur ces symptômes ?`,
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

  const sendMessage = async () => {
    if (!inputText.trim() || !diagnosticId || !user) return;

    const userMessage: Message = {
      role: 'user',
      content: inputText,
      created_at: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText('');
    setLoading(true);

    try {
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_BACKEND_URL}/api/chat?user_id=${user.uid}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            diagnostic_id: diagnosticId,
            message: inputText,
          }),
        }
      );

      if (!response.ok) throw new Error('Failed to send message');

      const aiMessage = await response.json();
      setMessages((prev) => [...prev, aiMessage]);
      
      // Scroll to bottom
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
      
    } catch (error) {
      console.error('Error sending message:', error);
      Alert.alert('Erreur', 'Impossible d\'envoyer le message');
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
  };

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
                  {message.role === 'user' ? (
                    <Text style={[styles.messageText, styles.userText]}>
                      {message.content}
                    </Text>
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
                <ActivityIndicator size="small" color="#4ade80" />
              </View>
            )}
          </ScrollView>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.messageInput}
              placeholder="Posez votre question..."
              placeholderTextColor="#666"
              value={inputText}
              onChangeText={setInputText}
              multiline
              maxLength={500}
            />
            <TouchableOpacity
              style={[styles.sendButton, (!inputText.trim() || loading) && styles.sendButtonDisabled]}
              onPress={sendMessage}
              disabled={!inputText.trim() || loading}
            >
              <Ionicons name="send" size={24} color={inputText.trim() && !loading ? '#000' : '#666'} />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
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
  form: {
    width: '100%',
  },
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
  buttonDisabled: {
    opacity: 0.6,
  },
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
  chatContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: 16,
    paddingBottom: 8,
  },
  messageBubble: {
    flexDirection: 'row',
    marginBottom: 16,
    maxWidth: '85%',
  },
  userBubble: {
    alignSelf: 'flex-end',
  },
  aiBubble: {
    alignSelf: 'flex-start',
  },
  messageIcon: {
    marginRight: 8,
    marginTop: 2,
  },
  messageContent: {
    flex: 1,
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
  aiText: {
    backgroundColor: '#1a1a1a',
    color: '#ffffff',
    padding: 12,
    borderRadius: 16,
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: '#2a2a2a',
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
  inputContainer: {
    flexDirection: 'row',
    padding: 16,
    alignItems: 'flex-end',
    borderTopWidth: 1,
    borderTopColor: '#1a1a1a',
  },
  messageInput: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: '#ffffff',
    fontSize: 16,
    maxHeight: 100,
    borderWidth: 1,
    borderColor: '#2a2a2a',
  },
  sendButton: {
    width: 48,
    height: 48,
    backgroundColor: '#4ade80',
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  sendButtonDisabled: {
    backgroundColor: '#1a1a1a',
  },
});
