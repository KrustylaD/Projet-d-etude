import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../src/constants/theme';

export default function LegalNoticesScreen() {
  const router = useRouter();

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
          <Text style={styles.headerTitle}>Mentions legales</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Section title="Editeur du service">
            <Text style={styles.text}>
              Le service AgriScan AI est edite par la societe AgriScan AI, SAS au capital
              de 10 000 euros, immatriculee au Registre du Commerce et des Societes de
              Toulouse sous le numero 123 456 789.
            </Text>
            <InfoRow label="Siege social" value="123 Route des Champs, 31000 Toulouse, France" />
            <InfoRow label="SIRET" value="123 456 789 00012" />
            <InfoRow label="Code APE" value="6201Z (Programmation informatique)" />
            <InfoRow label="Ndeg TVA" value="FR12 345 678 900" />
          </Section>

          <Section title="Directeur de la publication">
            <Text style={styles.text}>
              Monsieur Jean Dupont, President d&apos;AgriScan AI.
            </Text>
          </Section>

          <Section title="Hebergement">
            <Text style={styles.text}>
              Le service AgriScan AI est heberge par Emergent Integrations, dont le siege
              social est situe aux Etats-Unis. Les donnees sont stockees sur des serveurs
              securises conformement aux normes en vigueur.
            </Text>
          </Section>

          <Section title="Propriete intellectuelle">
            <Text style={styles.text}>
              L&apos;ensemble des elements constituant le service AgriScan AI (textes, graphismes,
              logiciels, marques, logos, interfaces) est protege par les lois relatives a la
              propriete intellectuelle. Toute reproduction, representation, modification,
              adaptation ou exploitation non autorisee est strictement interdite.
            </Text>
            <Text style={[styles.text, { marginTop: 12 }]}>
              La marque &quot;AgriScan AI&quot; et le logo associe sont des marques deposees.
              Toute utilisation sans autorisation prealable constitue un acte de contrefacon.
            </Text>
          </Section>

          <Section title="Protection des donnees personnelles">
            <Text style={styles.text}>
              AgriScan AI s&apos;engage a proteger la vie privee de ses utilisateurs conformement
              au Reglement General sur la Protection des Donnees (RGPD) et a la Loi
              Informatique et Libertes.
            </Text>

            <Subsection title="Donnees collectees">
              <Text style={styles.text}>
                Nous collectons les donnees suivantes : adresse email, nom d&apos;affichage,
                numero de telephone (optionnel), localisation (optionnelle), nom
                d&apos;exploitation (optionnel), photos des cultures (optionnelles), historique
                des diagnostics et des conversations avec l&apos;assistant IA.
              </Text>
            </Subsection>

            <Subsection title="Finalites du traitement">
              <Text style={styles.text}>
                Ces donnees sont collectees pour les finalites suivantes : creation et
                gestion du compte utilisateur, fourniture du service de diagnostic
                agricole, amelioration du service et support technique.
              </Text>
            </Subsection>

            <Subsection title="Base legale">
              <Text style={styles.text}>
                Le traitement repose sur le consentement de l&apos;utilisateur (article 6.1.a
                du RGPD) et sur l&apos;execution du contrat de service (article 6.1.b du RGPD).
              </Text>
            </Subsection>

            <Subsection title="Conservation des donnees">
              <Text style={styles.text}>
                Les donnees sont conservees pendant la duree d&apos;utilisation du service. En
                cas de suppression du compte, les donnees sont effacees sous 30 jours.
                L&apos;utilisateur peut a tout moment demander la suppression de ses donnees
                en contactant le support.
              </Text>
            </Subsection>

            <Subsection title="Droits de l&apos;utilisateur">
              <Text style={styles.text}>
                Conformement au RGPD, vous disposez des droits suivants sur vos donnees :
                droit d&apos;acces, de rectification, d&apos;effacement, de limitation du traitement,
                de portabilite et d&apos;opposition. Pour exercer ces droits, contactez-nous a
                l&apos;adresse indiquee ci-dessous.
              </Text>
            </Subsection>
          </Section>

          <Section title="Cookies">
            <Text style={styles.text}>
              L&apos;application mobile AgriScan AI n&apos;utilise pas de cookies de suivi. Seuls
              les cookies techniques strictement necessaires au fonctionnement du service
              peuvent etre utilises.
            </Text>
          </Section>

          <Section title="Contact">
            <InfoRow label="Email" value="contact@agriscan.ai" />
            <InfoRow label="Telephone" value="+33 5 12 34 56 78" />
            <InfoRow label="Adresse" value="123 Route des Champs\n31000 Toulouse, France" />
          </Section>

          <Text style={styles.lastUpdate}>
            Derniere mise a jour : 21 mai 2026
          </Text>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.sectionContent}>{children}</View>
    </View>
  );
}

function Subsection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={{ marginTop: 16 }}>
      <Text style={styles.subsectionTitle}>{title}</Text>
      {children}
    </View>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
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
    marginBottom: 28,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.lime,
    marginBottom: 12,
  },
  sectionContent: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  subsectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.cream,
    marginBottom: 6,
  },
  text: {
    fontSize: 14,
    lineHeight: 22,
    color: Colors.creamLow,
  },
  infoRow: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  infoLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.cream50,
    marginBottom: 4,
    textTransform: 'uppercase' as any,
    letterSpacing: 0.5,
  },
  infoValue: {
    fontSize: 14,
    color: Colors.cream,
    lineHeight: 20,
  },
  lastUpdate: {
    textAlign: 'center',
    fontSize: 12,
    color: Colors.cream50,
    marginTop: 8,
  },
});
