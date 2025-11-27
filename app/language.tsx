import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { ArrowLeft, Check } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';

export default function LanguageScreen() {
  const router = useRouter();
  const [selectedLanguage, setSelectedLanguage] = useState('English (UK)');

  const suggestedLanguages = ['English (UK)', 'English', 'Hindi'];
  const otherLanguages = ['Chinese', 'Croatian', 'Czech', 'Danish', 'Filipino', 'Finland'];

  const renderLanguageItem = (language: string) => {
    const isSelected = selectedLanguage === language;

    return (
      <TouchableOpacity
        key={language}
        style={styles.languageItem}
        onPress={() => setSelectedLanguage(language)}>
        <Text style={[styles.languageText, isSelected && styles.selectedText]}>
          {language}
        </Text>
        {isSelected && <Check size={20} color="#0f4c8b" />}
      </TouchableOpacity>
    );
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Language</Text>
        <View style={styles.spacer} />
      </View>

      <View style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Suggested Languages</Text>
          {suggestedLanguages.map((language) => renderLanguageItem(language))}
        </View>

        <View style={[styles.section, styles.otherSection]}>
          <Text style={styles.sectionTitle}>Other Languages</Text>
          {otherLanguages.map((language) => renderLanguageItem(language))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  spacer: {
    width: 24,
  },
  content: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  section: {
    marginBottom: 32,
  },
  otherSection: {
    paddingBottom: 20,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#9ca3af',
    marginBottom: 16,
    textTransform: 'uppercase',
  },
  languageItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  languageText: {
    fontSize: 14,
    color: '#6b7280',
  },
  selectedText: {
    color: '#000',
    fontWeight: '600',
  },
});
