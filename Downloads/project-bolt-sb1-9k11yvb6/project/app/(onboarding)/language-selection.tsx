import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { Globe, Check } from 'lucide-react-native';
import { Colors } from '@/constants/Colors';
import { SUPPORTED_LANGUAGES } from '@/constants/Languages';
import { useLanguage } from '@/contexts/LanguageContext';

export default function LanguageSelectionScreen() {
  const { selectedLanguage, setSelectedLanguage, t } = useLanguage();
  const [tempLanguage, setTempLanguage] = useState(selectedLanguage);
  const [loading, setLoading] = useState(false);

  const handleLanguageSelect = (languageCode: string) => {
    setTempLanguage(languageCode);
  };

  const handleContinue = async () => {
    if (!tempLanguage) {
      Alert.alert(t('Language Required'), t('Please select a language to continue'));
      return;
    }

    setLoading(true);
    try {
      await setSelectedLanguage(tempLanguage);
      router.replace('/(onboarding)/auth');
    } catch (error) {
      Alert.alert(t('Error'), t('Failed to save language preference'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <Globe size={48} color={Colors.primary} />
          </View>
          <Text style={styles.title}>Choose Your Language</Text>
          <Text style={styles.subtitle}>
            Select your preferred language for the best experience
          </Text>
        </View>

        {/* Language Options */}
        <ScrollView style={styles.languageList} showsVerticalScrollIndicator={false}>
          {SUPPORTED_LANGUAGES.map((language) => (
            <TouchableOpacity
              key={language.code}
              style={[
                styles.languageOption,
                tempLanguage === language.code && styles.languageOptionSelected,
              ]}
              onPress={() => handleLanguageSelect(language.code)}
            >
              <View style={styles.languageInfo}>
                <Text style={styles.languageName}>{language.name}</Text>
                <Text style={styles.languageNative}>{language.nativeName}</Text>
              </View>
              {tempLanguage === language.code && (
                <Check size={24} color={Colors.primary} />
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Continue Button */}
        <TouchableOpacity
          style={[styles.continueButton, loading && styles.continueButtonDisabled]}
          onPress={handleContinue}
          disabled={loading || !tempLanguage}
        >
          <Text style={styles.continueButtonText}>
            {loading ? 'Saving...' : 'Continue'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.text.primary,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: Colors.text.secondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  languageList: {
    flex: 1,
    marginBottom: 24,
  },
  languageOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginBottom: 8,
    backgroundColor: Colors.surface,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.border,
  },
  languageOptionSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary + '10',
  },
  languageInfo: {
    flex: 1,
  },
  languageName: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 4,
  },
  languageNative: {
    fontSize: 14,
    color: Colors.text.secondary,
  },
  continueButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  continueButtonDisabled: {
    backgroundColor: Colors.gray[400],
  },
  continueButtonText: {
    color: Colors.text.inverse,
    fontSize: 16,
    fontWeight: '600',
  },
});