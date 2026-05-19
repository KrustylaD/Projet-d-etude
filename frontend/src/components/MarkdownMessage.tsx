import React from 'react';
import { View, StyleSheet } from 'react-native';
import Markdown from 'react-native-markdown-display';

interface MarkdownMessageProps {
  content: string;
}

/**
 * Rendu Markdown de qualité ChatGPT pour les réponses IA.
 * Supporte : titres, gras, italique, listes à puces, listes numérotées,
 * code inline, blocs de code, citations, liens, séparateurs.
 */
export const MarkdownMessage: React.FC<MarkdownMessageProps> = ({ content }) => {
  return (
    <View style={styles.wrapper}>
      <Markdown style={markdownStyles}>{content}</Markdown>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
  },
});

const markdownStyles = StyleSheet.create({
  // Texte par défaut (paragraphes)
  body: {
    color: '#ffffff',
    fontSize: 15,
    lineHeight: 22,
  },
  paragraph: {
    color: '#ffffff',
    fontSize: 15,
    lineHeight: 22,
    marginTop: 0,
    marginBottom: 8,
  },
  // Titres
  heading1: {
    color: '#4ade80',
    fontSize: 22,
    fontWeight: '700',
    marginTop: 12,
    marginBottom: 8,
    lineHeight: 28,
  },
  heading2: {
    color: '#4ade80',
    fontSize: 19,
    fontWeight: '700',
    marginTop: 10,
    marginBottom: 6,
    lineHeight: 26,
  },
  heading3: {
    color: '#86efac',
    fontSize: 17,
    fontWeight: '700',
    marginTop: 8,
    marginBottom: 4,
    lineHeight: 24,
  },
  heading4: {
    color: '#86efac',
    fontSize: 16,
    fontWeight: '600',
    marginTop: 6,
    marginBottom: 4,
  },
  // Gras / italique
  strong: {
    color: '#bbf7d0',
    fontWeight: '700',
  },
  em: {
    fontStyle: 'italic',
    color: '#d1fae5',
  },
  // Listes
  bullet_list: {
    marginTop: 4,
    marginBottom: 8,
  },
  ordered_list: {
    marginTop: 4,
    marginBottom: 8,
  },
  list_item: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  bullet_list_icon: {
    color: '#4ade80',
    fontSize: 18,
    lineHeight: 22,
    marginRight: 8,
    marginLeft: 0,
  },
  bullet_list_content: {
    flex: 1,
    color: '#ffffff',
    fontSize: 15,
    lineHeight: 22,
  },
  ordered_list_icon: {
    color: '#4ade80',
    fontSize: 15,
    lineHeight: 22,
    marginRight: 8,
    fontWeight: '700',
  },
  ordered_list_content: {
    flex: 1,
    color: '#ffffff',
    fontSize: 15,
    lineHeight: 22,
  },
  // Code
  code_inline: {
    backgroundColor: '#0a1a0a',
    color: '#86efac',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    fontSize: 14,
    fontFamily: 'monospace',
  },
  code_block: {
    backgroundColor: '#0a1a0a',
    color: '#86efac',
    padding: 12,
    borderRadius: 8,
    fontSize: 14,
    fontFamily: 'monospace',
    marginVertical: 8,
  },
  fence: {
    backgroundColor: '#0a1a0a',
    color: '#86efac',
    padding: 12,
    borderRadius: 8,
    fontSize: 14,
    fontFamily: 'monospace',
    marginVertical: 8,
    borderWidth: 1,
    borderColor: '#1f3a1f',
  },
  // Citations
  blockquote: {
    backgroundColor: 'rgba(74, 222, 128, 0.08)',
    borderLeftWidth: 3,
    borderLeftColor: '#4ade80',
    paddingLeft: 12,
    paddingVertical: 6,
    marginVertical: 6,
  },
  // Liens
  link: {
    color: '#4ade80',
    textDecorationLine: 'underline',
  },
  // Séparateur
  hr: {
    backgroundColor: '#2a3a2a',
    height: 1,
    marginVertical: 12,
  },
  // Tableaux
  table: {
    borderWidth: 1,
    borderColor: '#2a3a2a',
    borderRadius: 6,
    marginVertical: 8,
  },
  th: {
    backgroundColor: '#1a2f1a',
    color: '#4ade80',
    padding: 8,
    fontWeight: '700',
  },
  td: {
    color: '#ffffff',
    padding: 8,
    borderTopWidth: 1,
    borderTopColor: '#2a3a2a',
  },
});

export default MarkdownMessage;
