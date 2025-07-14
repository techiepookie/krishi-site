import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  Modal,
  TextInput,
} from 'react-native';
import { User, Settings, Globe, Bell, Shield, CircleHelp as HelpCircle, LogOut, ChevronRight, CreditCard as Edit2, MapPin, Sprout, Camera, Save } from 'lucide-react-native';
import { router } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { Colors } from '@/constants/Colors';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { SUPPORTED_LANGUAGES } from '@/constants/Languages';

export default function ProfileScreen() {
  const { user, signOut, updateProfile } = useAuth();
  const { selectedLanguage, setSelectedLanguage, t } = useLanguage();
  const [showEditModal, setShowEditModal] = useState(false);
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [editForm, setEditForm] = useState({
    full_name: user?.full_name || '',
    profile_photo: user?.profile_photo || '',
  });

  const handleLogout = () => {
    Alert.alert(
      t('Logout'),
      t('Are you sure you want to logout?'),
      [
        { text: t('Cancel'), style: 'cancel' },
        { text: t('Logout'), style: 'destructive', onPress: signOut },
      ]
    );
  };

  const handleEditProfile = () => {
    setEditForm({
      full_name: user?.full_name || '',
      profile_photo: user?.profile_photo || '',
    });
    setShowEditModal(true);
  };

  const handleSaveProfile = async () => {
    try {
      await updateProfile(editForm);
      setShowEditModal(false);
      Alert.alert(t('Success'), t('Profile updated successfully'));
    } catch (error) {
      Alert.alert(t('Error'), t('Failed to update profile'));
    }
  };

  const handleImagePicker = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (permissionResult.granted === false) {
      Alert.alert(t('Permission required'), t('Please allow access to your photo library'));
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setEditForm(prev => ({ ...prev, profile_photo: result.assets[0].uri }));
    }
  };

  const handleLanguageChange = (languageCode: string) => {
    setSelectedLanguage(languageCode).then(() => {
      // Force component re-render by updating state
      setShowLanguageModal(false);
      // Small delay to ensure language is saved before closing modal
      setTimeout(() => {
        Alert.alert(t('Success'), t('Language updated successfully'));
      }, 100);
    });
  };

  const getSelectedLanguageName = () => {
    const lang = SUPPORTED_LANGUAGES.find(l => l.code === selectedLanguage);
    return lang?.name || 'हिंदी';
  };

  const profileStats = [
    { label: t('Posts'), value: '24' },
    { label: t('Following'), value: '156' },
    { label: t('Followers'), value: '89' },
  ];

  const menuItems = [
    {
      id: 'edit-profile',
      title: t('Edit Profile'),
      icon: Edit2,
      onPress: handleEditProfile,
    },
    {
      id: 'whatsapp-notifications',
      title: t('WhatsApp Notifications'),
      icon: Bell,
      onPress: () => Alert.alert(t('WhatsApp Notifications'), t('Enable WhatsApp alerts for important updates')),
    },
    {
      id: 'language',
      title: t('Language'),
      icon: Globe,
      subtitle: getSelectedLanguageName(),
      onPress: () => setShowLanguageModal(true),
    },
    {
      id: 'notifications',
      title: t('Notifications'),
      icon: Bell,
      onPress: () => Alert.alert(t('Notifications'), t('Notification settings will be implemented')),
    },
    {
      id: 'privacy',
      title: t('Privacy & Security'),
      icon: Shield,
      onPress: () => Alert.alert(t('Privacy & Security'), t('Data Protection') + '\n' + t('Account Security')),
    },
    {
      id: 'help',
      title: t('Help & Support'),
      icon: HelpCircle,
      onPress: () => Alert.alert(t('Help & Support'), t('Help Center') + '\n' + t('Contact Support') + '\n' + t('FAQ')),
    },
  ];

  const renderMenuItem = (item: typeof menuItems[0]) => {
    const IconComponent = item.icon;
    
    return (
      <TouchableOpacity key={item.id} style={styles.menuItem} onPress={item.onPress}>
        <View style={styles.menuItemLeft}>
          <View style={styles.menuIcon}>
            <IconComponent size={20} color={Colors.primary} />
          </View>
          <View style={styles.menuItemContent}>
            <Text style={styles.menuItemTitle}>{item.title}</Text>
            {item.subtitle && (
              <Text style={styles.menuItemSubtitle}>{item.subtitle}</Text>
            )}
          </View>
        </View>
        <ChevronRight size={20} color={Colors.text.secondary} />
      </TouchableOpacity>
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>{t('Profile')}</Text>
          <TouchableOpacity>
            <Settings size={24} color={Colors.text.primary} />
          </TouchableOpacity>
        </View>

        {/* Profile Info */}
        <View style={styles.profileCard}>
          <View style={styles.profileHeader}>
            <Image
              source={{
                uri: user?.profile_photo || 
                     'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=1'
              }}
              style={styles.profileImage}
            />
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>{user?.full_name || 'Farmer'}</Text>
              <View style={styles.profileLocation}>
                <MapPin size={14} color={Colors.text.secondary} />
                <Text style={styles.locationText}>
                  {user?.location?.address || t('Location not set')}
                </Text>
              </View>
              <View style={styles.farmingInfo}>
                <Sprout size={14} color={Colors.primary} />
                <Text style={styles.farmingText}>
                  {user?.agriculture_type || t('Agriculture Type')}
                </Text>
              </View>
            </View>
          </View>

          {/* Stats */}
          <View style={styles.statsContainer}>
            {profileStats.map((stat, index) => (
              <View key={index} style={styles.statItem}>
                <Text style={styles.statValue}>{stat.value}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </View>
            ))}
          </View>

          {/* Farming Details */}
          <View style={styles.farmingDetails}>
            <Text style={styles.detailsTitle}>{t('Farming Details')}</Text>
            <View style={styles.detailsGrid}>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>{t('Land Type')}</Text>
                <Text style={styles.detailValue}>{user?.land_type || t('Not specified')}</Text>
              </View>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>{t('Primary Crops')}</Text>
                <Text style={styles.detailValue}>
                  {user?.crops?.join(', ') || t('Not specified')}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Menu Items */}
        <View style={styles.menuSection}>
          {menuItems.map(renderMenuItem)}
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <LogOut size={20} color={Colors.error} />
          <Text style={styles.logoutText}>{t('Logout')}</Text>
        </TouchableOpacity>

        {/* App Info */}
        <View style={styles.appInfo}>
          <Text style={styles.appInfoText}>KrishiMitra v1.0.0</Text>
          <Text style={styles.appInfoText}>{t('Made with ❤️ for farmers')}</Text>
        </View>
      </View>

      {/* Edit Profile Modal */}
      <Modal
        visible={showEditModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{t('Edit Profile')}</Text>
            <TouchableOpacity onPress={() => setShowEditModal(false)}>
              <Text style={styles.cancelText}>{t('Cancel')}</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            <View style={styles.editPhotoContainer}>
              <Image
                source={{
                  uri: editForm.profile_photo || 
                       'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=1'
                }}
                style={styles.editProfileImage}
              />
              <TouchableOpacity style={styles.editPhotoButton} onPress={handleImagePicker}>
                <Camera size={20} color={Colors.primary} />
                <Text style={styles.editPhotoText}>{t('Change Photo')}</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.editField}>
              <Text style={styles.editLabel}>{t('Full Name')}</Text>
              <TextInput
                style={styles.editInput}
                value={editForm.full_name}
                onChangeText={(text) => setEditForm(prev => ({ ...prev, full_name: text }))}
                placeholder={t('Enter your full name')}
              />
            </View>

            <TouchableOpacity style={styles.saveButton} onPress={handleSaveProfile}>
              <Save size={20} color={Colors.text.inverse} />
              <Text style={styles.saveButtonText}>{t('Save Changes')}</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </Modal>

      {/* Language Selection Modal */}
      <Modal
        visible={showLanguageModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{t('Select Language')}</Text>
            <TouchableOpacity onPress={() => setShowLanguageModal(false)}>
              <Text style={styles.cancelText}>{t('Cancel')}</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            {SUPPORTED_LANGUAGES.map((language) => (
              <TouchableOpacity
                key={language.code}
                style={[
                  styles.languageOption,
                  selectedLanguage === language.code && styles.languageOptionSelected,
                ]}
                onPress={() => handleLanguageChange(language.code)}
              >
                <Text style={styles.languageName}>{language.name}</Text>
                <Text style={styles.languageNative}>{language.nativeName}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.text.primary,
  },
  profileCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 16,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.text.primary,
    marginBottom: 4,
  },
  profileLocation: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    gap: 4,
  },
  locationText: {
    fontSize: 14,
    color: Colors.text.secondary,
  },
  farmingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  farmingText: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '500',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: Colors.border,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.text.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.text.secondary,
  },
  farmingDetails: {
    gap: 12,
  },
  detailsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 8,
  },
  detailsGrid: {
    gap: 12,
  },
  detailItem: {
    gap: 4,
  },
  detailLabel: {
    fontSize: 12,
    color: Colors.text.secondary,
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 14,
    color: Colors.text.primary,
  },
  menuSection: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.primary + '10',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  menuItemContent: {
    flex: 1,
  },
  menuItemTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.text.primary,
  },
  menuItemSubtitle: {
    fontSize: 14,
    color: Colors.text.secondary,
    marginTop: 2,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.error,
    backgroundColor: Colors.error + '10',
    marginBottom: 24,
    gap: 8,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.error,
  },
  appInfo: {
    alignItems: 'center',
    gap: 4,
  },
  appInfoText: {
    fontSize: 12,
    color: Colors.text.secondary,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  cancelText: {
    fontSize: 16,
    color: Colors.primary,
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: 20,
  },
  editPhotoContainer: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  editProfileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
  },
  editPhotoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: Colors.primary,
    borderRadius: 8,
    gap: 8,
  },
  editPhotoText: {
    color: Colors.primary,
    fontSize: 14,
    fontWeight: '500',
  },
  editField: {
    marginBottom: 24,
  },
  editLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 8,
  },
  editInput: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
    marginBottom: 40,
  },
  saveButtonText: {
    color: Colors.text.inverse,
    fontSize: 16,
    fontWeight: '600',
  },
  languageOption: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  languageOptionSelected: {
    backgroundColor: Colors.primary + '10',
  },
  languageName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 4,
  },
  languageNative: {
    fontSize: 14,
    color: Colors.text.secondary,
  },
});