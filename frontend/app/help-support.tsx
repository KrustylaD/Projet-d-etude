import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../src/constants/theme';

export default function HelpSupportScreen() {
  const router = useRouter();

  const handleEmail = () => {
    Linking.openURL('mailto:contact@agriscan.ai');
  };

  return (
    <LinearGradient colors={[Colors.forest, Colors.black]} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.closeButton}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="close" size={28} color={Colors.creamLow} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Aide &amp; Support</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.section}>
            <Ionicons name="headset" size={48} color={Colors.lime} />
            <Text style={styles.sectionTitle}>Besoin d&apos;assistance ?</Text>
            <Text style={styles.description}>
              Notre equipe est la pour vous aider avec AgriScan AI. Consultez les
              ressources ci-dessous ou contactez-nous directement.
            </Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Nous contacter</Text>

            <TouchableOpacity style={styles.contactRow} onPress={handleEmail} activeOpacity={0.7}>
              <View style={[styles.iconCircle, { backgroundColor: Colors.lime10 }]}>
                <Ionicons name="mail" size={22} color={Colors.lime} />
              </View>
              <View style={styles.contactInfo}>
                <Text style={styles.contactLabel}>Email</Text>
                <Text style={styles.contactValue}>contact@agriscan.ai</Text>
              </View>
              <Ionicons name="open-outline" size={18} color={Colors.cream50} />
            </TouchableOpacity>

            <View style={styles.contactRow}>
              <View style={[styles.iconCircle, { backgroundColor: Colors.lime10 }]}>
                <Ionicons name="call" size={22} color={Colors.lime} />
              </View>
              <View style={styles.contactInfo}>
                <Text style={styles.contactLabel}>Telephone</Text>
                <Text style={styles.contactValue}>+33 5 12 34 56 78</Text>
              </View>
            </View>

            <View style={styles.contactRow}>
              <View style={[styles.iconCircle, { backgroundColor: Colors.lime10 }]}>
                <Ionicons name="time" size={22} color={Colors.lime} />
              </View>
              <View style={styles.contactInfo}>
                <Text style={styles.contactLabel}>Horaires</Text>
                <Text style={styles.contactValue}>Lundi - Vendredi, 9h - 18h</Text>
              </View>
            </View>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Questions frequentes</Text>

            <FaqItem
              question="Comment realiser un diagnostic ?"
              answer="Rendez-vous dans l&apos;onglet Diagnostic, indiquez le type de culture et les symptomes observes. Vous pourrez ensuite echanger avec l&apos;IA et joindre des photos."
            />
            <FaqItem
              question="Comment sont traitees mes donnees ?"
              answer="Vos donnees sont traitees conformement au RGPD. Consultez notre politique de confidentialite dans les mentions legales."
            />
            <FaqItem
              question="Puis-je supprimer mon compte ?"
              answer="Contactez notre support par email a contact@agriscan.ai pour demander la suppression de votre compte et de vos donnees."
            />
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Ressources</Text>

            <TouchableOpacity
              style={styles.linkRow}
              onPress={() => router.push('/legal-notices')}
              activeOpacity={0.7}
            >
              <Ionicons name="document-text-outline" size={20} color={Colors.lime} />
              <Text style={styles.linkText}>Mentions legales</Text>
              <Ionicons name="chevron-forward" size={18} color={Colors.cream50} />
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

function FaqItem({ question, answer }: { question: string; answer: string }) {
  return (
    <View style={styles.faqItem}>
      <Text style={styles.faqQuestion}>{question}</Text>
      <Text style={styles.faqAnswer}>{answer}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.card,
  },
  closeButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.cream,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 48,
  },
  section: {
    alignItems: 'center',
    marginBottom: 28,
    paddingTop: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Colors.cream,
    marginTop: 16,
  },
  description: {
    fontSize: 14,
    color: Colors.creamLow,
    textAlign: 'center',
    lineHeight: 22,
    marginTop: 12,
    paddingHorizontal: 16,
  },
  card: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.lime,
    marginBottom: 16,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    gap: 12,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contactInfo: {
    flex: 1,
  },
  contactLabel: {
    fontSize: 12,
    color: Colors.cream50,
    marginBottom: 2,
  },
  contactValue: {
    fontSize: 15,
    color: Colors.cream,
    fontWeight: '500',
  },
  faqItem: {
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  faqQuestion: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.cream,
    marginBottom: 6,
  },
  faqAnswer: {
    fontSize: 14,
    color: Colors.creamLow,
    lineHeight: 20,
  },
  linkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    gap: 10,
  },
  linkText: {
    flex: 1,
    fontSize: 15,
    color: Colors.cream,
  },
});
