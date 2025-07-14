import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Image,
} from 'react-native';
import { router } from 'expo-router';
import { Camera, MapPin, User, ChevronDown } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { Colors } from '@/constants/Colors';
import { LAND_TYPES, AGRICULTURE_TYPES, CROP_OPTIONS, SUPPORTED_LANGUAGES } from '@/constants/Languages';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';

export default function ProfileSetupScreen() {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    full_name: '',
    profile_photo: '',
    land_type: '',
    agriculture_type: '',
    crops: [] as string[],
    location: {
      latitude: 0,
      longitude: 0,
      address: '',
    },
    language: 'hi',
  });
  const [loading, setLoading] = useState(false);
  const { createProfile } = useAuth();

  const handleImagePicker = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (permissionResult.granted === false) {
      Alert.alert('Permission required', 'Please allow access to your photo library');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setFormData(prev => ({ ...prev, profile_photo: result.assets[0].uri }));
    }
  };

  const handleCamera = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    
    if (permissionResult.granted === false) {
      Alert.alert('Permission required', 'Please allow access to your camera');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setFormData(prev => ({ ...prev, profile_photo: result.assets[0].uri }));
    }
  };

  const handleLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Permission required', 'Please allow access to your location');
      return;
    }

    try {
      const location = await Location.getCurrentPositionAsync({});
      const address = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      setFormData(prev => ({
        ...prev,
        location: {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          address: address[0] ? `${address[0].city}, ${address[0].region}` : 'Unknown location',
        },
      }));
    } catch (error) {
      Alert.alert('Error', 'Failed to get location. Please try again.');
    }
  };

  const toggleCrop = (crop: string) => {
    setFormData(prev => ({
      ...prev,
      crops: prev.crops.includes(crop)
        ? prev.crops.filter(c => c !== crop)
        : [...prev.crops, crop],
    }));
  };

  const handleSubmit = async () => {
    if (!formData.full_name.trim()) {
      Alert.alert('Error', 'Please enter your name');
      return;
    }

    if (!formData.land_type) {
      Alert.alert('Error', 'Please select your land type');
      return;
    }

    if (!formData.agriculture_type) {
      Alert.alert('Error', 'Please select your agriculture type');
      return;
    }

    if (formData.crops.length === 0) {
      Alert.alert('Error', 'Please select at least one crop');
      return;
    }

    setLoading(true);
    try {
      const result = await createProfile(formData);
      
      if (result.error) {
        Alert.alert('Error', result.error.message);
      } else {
        router.replace('/(tabs)/home');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to create profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>{t('Complete Your Profile')}</Text>
          <Text style={styles.subtitle}>{t('Help us personalize your farming experience')}</Text>
        </View>

        <View style={styles.form}>
          {/* Profile Photo */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t('Profile Photo')}</Text>
            <View style={styles.photoContainer}>
              {formData.profile_photo ? (
                <Image source={{ uri: formData.profile_photo }} style={styles.profileImage} />
              ) : (
                <View style={styles.photoPlaceholder}>
                  <User size={40} color={Colors.text.secondary} />
                </View>
              )}
              <View style={styles.photoActions}>
                <TouchableOpacity style={styles.photoButton} onPress={handleCamera}>
                  <Camera size={16} color={Colors.primary} />
                  <Text style={styles.photoButtonText}>{t('Camera')}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.photoButton} onPress={handleImagePicker}>
                  <Text style={styles.photoButtonText}>{t('Gallery')}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Name */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t('Full Name *')}</Text>
            <TextInput
              style={styles.textInput}
              placeholder={t('Enter your full name')}
              value={formData.full_name}
              onChangeText={(text) => setFormData(prev => ({ ...prev, full_name: text }))}
            />
          </View>

          {/* Location */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t('Location')}</Text>
            <TouchableOpacity style={styles.locationButton} onPress={handleLocation}>
              <MapPin size={20} color={Colors.primary} />
              <Text style={styles.locationText}>
                {formData.location.address || t('Detect current location')}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Land Type */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t('Land Type *')}</Text>
            <View style={styles.optionsGrid}>
              {LAND_TYPES.map((type) => (
                <TouchableOpacity
                  key={type}
                  style={[
                    styles.optionButton,
                    formData.land_type === type && styles.optionButtonSelected,
                  ]}
                  onPress={() => setFormData(prev => ({ ...prev, land_type: type }))}
                >
                  <Text
                    style={[
                      styles.optionText,
                      formData.land_type === type && styles.optionTextSelected,
                    ]}
                  >
                    {t(type)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Agriculture Type */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t('Agriculture Type *')}</Text>
            <View style={styles.optionsGrid}>
              {AGRICULTURE_TYPES.map((type) => (
                <TouchableOpacity
                  key={type}
                  style={[
                    styles.optionButton,
                    formData.agriculture_type === type && styles.optionButtonSelected,
                  ]}
                  onPress={() => setFormData(prev => ({ ...prev, agriculture_type: type }))}
                >
                  <Text
                    style={[
                      styles.optionText,
                      formData.agriculture_type === type && styles.optionTextSelected,
                    ]}
                  >
                    {t(type)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Primary Crops */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t('Primary Crops * (Select multiple)')}</Text>
            <View style={styles.optionsGrid}>
              {CROP_OPTIONS.map((crop) => (
                <TouchableOpacity
                  key={crop}
                  style={[
                    styles.optionButton,
                    formData.crops.includes(crop) && styles.optionButtonSelected,
                  ]}
                  onPress={() => toggleCrop(crop)}
                >
                  <Text
                    style={[
                      styles.optionText,
                      formData.crops.includes(crop) && styles.optionTextSelected,
                    ]}
                  >
                    {t(crop)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Language */}

          <TouchableOpacity
            style={[styles.submitButton, loading && styles.submitButtonDisabled]}
            onPress={handleSubmit}
            disabled={loading}
          >
            <Text style={styles.submitButtonText}>
              {loading ? t('Creating Profile...') : t('Complete Setup')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.text.primary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.text.secondary,
    lineHeight: 24,
  },
  form: {
    gap: 24,
  },
  section: {
    gap: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  textInput: {
    fontSize: 16,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderWidth: 2,
    borderColor: Colors.border,
    borderRadius: 12,
    backgroundColor: Colors.surface,
    color: Colors.text.primary,
  },
  photoContainer: {
    alignItems: 'center',
    gap: 16,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  photoPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.border,
  },
  photoActions: {
    flexDirection: 'row',
    gap: 12,
  },
  photoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: Colors.primary,
    borderRadius: 8,
    gap: 4,
  },
  photoButtonText: {
    color: Colors.primary,
    fontSize: 14,
    fontWeight: '500',
  },
  locationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderWidth: 2,
    borderColor: Colors.border,
    borderRadius: 12,
    backgroundColor: Colors.surface,
    gap: 12,
  },
  locationText: {
    flex: 1,
    fontSize: 16,
    color: Colors.text.primary,
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  optionButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderWidth: 2,
    borderColor: Colors.border,
    borderRadius: 8,
    backgroundColor: Colors.surface,
  },
  optionButtonSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary,
  },
  optionText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text.primary,
  },
  optionTextSelected: {
    color: Colors.text.inverse,
  },
  submitButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 16,
  },
  submitButtonDisabled: {
    backgroundColor: Colors.gray[400],
  },
  submitButtonText: {
    color: Colors.text.inverse,
    fontSize: 16,
    fontWeight: '600',
  },
});