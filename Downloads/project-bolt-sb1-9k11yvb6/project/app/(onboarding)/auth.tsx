import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { router } from 'expo-router';
import { Phone, MessageSquare, Clock, RefreshCw } from 'lucide-react-native';
import { Colors } from '@/constants/Colors';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';

export default function AuthScreen() {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [otpAttempts, setOtpAttempts] = useState(0);
  const [resendTimer, setResendTimer] = useState(0);
  const [isExistingUser, setIsExistingUser] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  
  const { sendOTP, signIn, checkExistingUser } = useAuth();
  const { t } = useLanguage();

  const MAX_OTP_ATTEMPTS = 3;
  const RESEND_TIMEOUT = 30;

  // Resend timer countdown
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  const validatePhone = (phoneNumber: string): boolean => {
    const phoneRegex = /^[6-9]\d{9}$/;
    return phoneRegex.test(phoneNumber);
  };

  const validateOTP = (otpCode: string): boolean => {
    const otpRegex = /^\d{6}$/;
    return otpRegex.test(otpCode);
  };

  const clearErrors = () => {
    setErrors({});
  };

  const setError = (field: string, message: string) => {
    setErrors(prev => ({ ...prev, [field]: message }));
  };

  const handleSendOTP = async () => {
    clearErrors();

    // Validate phone number
    if (!phone) {
      setError('phone', t('Please enter your phone number'));
      return;
    }

    if (!validatePhone(phone)) {
      setError('phone', t('Please enter a valid 10-digit phone number'));
      return;
    }

    setLoading(true);
    try {
      const formattedPhone = `+91${phone}`;
      
      // Check if user already exists
      const userExists = await checkExistingUser(formattedPhone);
      setIsExistingUser(userExists);
      
      // Send OTP
      const result = await sendOTP(formattedPhone);
      
      if (result.error) {
        setError('phone', result.error.message || t('Failed to send OTP'));
      } else {
        setOtpSent(true);
        setOtpAttempts(0);
        setResendTimer(RESEND_TIMEOUT);
        Alert.alert(
          t('OTP Sent'), 
          userExists 
            ? t('Welcome back! OTP sent for login')
            : t('OTP sent for registration')
        );
      }
    } catch (error: any) {
      setError('phone', error.message || t('Network error. Please try again.'));
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    clearErrors();

    // Validate OTP
    if (!otp) {
      setError('otp', t('Please enter the OTP'));
      return;
    }

    if (!validateOTP(otp)) {
      setError('otp', t('Please enter a valid 6-digit OTP'));
      return;
    }

    // Check attempt limit
    if (otpAttempts >= MAX_OTP_ATTEMPTS) {
      setError('otp', t('Maximum OTP attempts exceeded. Please request a new OTP.'));
      return;
    }

    setLoading(true);
    try {
      const formattedPhone = `+91${phone}`;
      const result = await signIn(formattedPhone, otp);
      
      if (result.error) {
        setOtpAttempts(prev => prev + 1);
        const remainingAttempts = MAX_OTP_ATTEMPTS - (otpAttempts + 1);
        
        if (remainingAttempts > 0) {
          setError('otp', `${t('Invalid OTP')}. ${remainingAttempts} ${t('attempts remaining')}`);
        } else {
          setError('otp', t('Maximum attempts exceeded. Please request a new OTP.'));
        }
      } else {
        // Success - navigate based on user type
        if (isExistingUser) {
          router.replace('/(tabs)/home');
        } else {
          router.replace('/(onboarding)/profile-setup');
        }
      }
    } catch (error: any) {
      setOtpAttempts(prev => prev + 1);
      setError('otp', error.message || t('Verification failed. Please try again.'));
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (resendTimer > 0) return;

    setResendLoading(true);
    clearErrors();
    
    try {
      const formattedPhone = `+91${phone}`;
      const result = await sendOTP(formattedPhone);
      
      if (result.error) {
        setError('otp', result.error.message || t('Failed to resend OTP'));
      } else {
        setOtpAttempts(0); // Reset attempts on new OTP
        setResendTimer(RESEND_TIMEOUT);
        setOtp(''); // Clear previous OTP
        Alert.alert(t('OTP Resent'), t('A new OTP has been sent to your phone'));
      }
    } catch (error: any) {
      setError('otp', error.message || t('Failed to resend OTP'));
    } finally {
      setResendLoading(false);
    }
  };

  const resetAuth = () => {
    setOtpSent(false);
    setOtp('');
    setOtpAttempts(0);
    setResendTimer(0);
    setIsExistingUser(false);
    clearErrors();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            {otpSent ? (
              <MessageSquare size={48} color={Colors.primary} />
            ) : (
              <Phone size={48} color={Colors.primary} />
            )}
          </View>
          <Text style={styles.title}>
            {otpSent ? t('Enter OTP') : t('Phone Verification')}
          </Text>
          <Text style={styles.subtitle}>
            {otpSent 
              ? `${t('We have sent a 6-digit code to')} +91${phone}`
              : t('Enter your phone number to get started')
            }
          </Text>
          
          {otpSent && isExistingUser && (
            <View style={styles.userTypeIndicator}>
              <Text style={styles.userTypeText}>
                {t('Welcome back! Logging you in...')}
              </Text>
            </View>
          )}
          
          {otpSent && !isExistingUser && (
            <View style={[styles.userTypeIndicator, styles.newUserIndicator]}>
              <Text style={styles.userTypeText}>
                {t('New user registration')}
              </Text>
            </View>
          )}
        </View>

        <View style={styles.form}>
          {!otpSent ? (
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>{t('Phone Number')}</Text>
              <View style={[
                styles.phoneInputContainer,
                errors.phone && styles.inputError
              ]}>
                <Text style={styles.countryCode}>+91</Text>
                <TextInput
                  style={styles.phoneInput}
                  placeholder={t('Enter phone number')}
                  value={phone}
                  onChangeText={(text) => {
                    setPhone(text.replace(/[^0-9]/g, ''));
                    if (errors.phone) clearErrors();
                  }}
                  keyboardType="phone-pad"
                  maxLength={10}
                  editable={!loading}
                />
              </View>
              {errors.phone && (
                <Text style={styles.errorText}>{errors.phone}</Text>
              )}
            </View>
          ) : (
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>{t('OTP Code')}</Text>
              <TextInput
                style={[
                  styles.otpInput,
                  errors.otp && styles.inputError
                ]}
                placeholder={t('Enter 6-digit OTP')}
                value={otp}
                onChangeText={(text) => {
                  setOtp(text.replace(/[^0-9]/g, ''));
                  if (errors.otp) clearErrors();
                }}
                keyboardType="number-pad"
                maxLength={6}
                textAlign="center"
                editable={!loading && otpAttempts < MAX_OTP_ATTEMPTS}
              />
              {errors.otp && (
                <Text style={styles.errorText}>{errors.otp}</Text>
              )}
              
              <View style={styles.otpInfo}>
                <Text style={styles.attemptsText}>
                  {t('Attempts')}: {otpAttempts}/{MAX_OTP_ATTEMPTS}
                </Text>
                {resendTimer > 0 && (
                  <View style={styles.timerContainer}>
                    <Clock size={16} color={Colors.text.secondary} />
                    <Text style={styles.timerText}>
                      {t('Resend in')} {formatTime(resendTimer)}
                    </Text>
                  </View>
                )}
              </View>
            </View>
          )}

          <TouchableOpacity
            style={[
              styles.primaryButton, 
              loading && styles.primaryButtonDisabled
            ]}
            onPress={otpSent ? handleVerifyOTP : handleSendOTP}
            disabled={loading}
          >
            {loading && <ActivityIndicator size="small" color={Colors.text.inverse} />}
            <Text style={styles.primaryButtonText}>
              {loading 
                ? t('Please wait...') 
                : otpSent 
                  ? t('Verify OTP') 
                  : t('Send OTP')
              }
            </Text>
          </TouchableOpacity>

          {otpSent && (
            <View style={styles.secondaryActions}>
              <TouchableOpacity onPress={resetAuth} disabled={loading}>
                <Text style={styles.linkText}>{t('Change phone number')}</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                onPress={handleResendOTP} 
                disabled={resendTimer > 0 || resendLoading || loading}
                style={styles.resendButton}
              >
                {resendLoading && <ActivityIndicator size="small" color={Colors.primary} />}
                <RefreshCw 
                  size={16} 
                  color={resendTimer > 0 ? Colors.text.disabled : Colors.primary} 
                />
                <Text style={[
                  styles.linkText,
                  resendTimer > 0 && styles.disabledText
                ]}>
                  {t('Resend OTP')}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Help Section */}
        <View style={styles.helpSection}>
          <Text style={styles.helpTitle}>{t('Need Help?')}</Text>
          <Text style={styles.helpText}>
            {t('Make sure you have network connectivity and try again')}
          </Text>
          {otpSent && (
            <Text style={styles.helpText}>
              {t('Check your SMS inbox for the verification code')}
            </Text>
          )}
        </View>
      </View>
    </KeyboardAvoidingView>
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
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 48,
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
    marginBottom: 16,
  },
  userTypeIndicator: {
    backgroundColor: Colors.success + '20',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.success,
  },
  newUserIndicator: {
    backgroundColor: Colors.primary + '20',
    borderColor: Colors.primary,
  },
  userTypeText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.success,
  },
  form: {
    gap: 24,
  },
  inputContainer: {
    gap: 8,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  phoneInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.border,
    borderRadius: 12,
    backgroundColor: Colors.surface,
  },
  inputError: {
    borderColor: Colors.error,
  },
  countryCode: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderRightWidth: 1,
    borderRightColor: Colors.border,
  },
  phoneInput: {
    flex: 1,
    fontSize: 16,
    paddingHorizontal: 16,
    paddingVertical: 16,
    color: Colors.text.primary,
  },
  otpInput: {
    fontSize: 24,
    fontWeight: '600',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderWidth: 2,
    borderColor: Colors.border,
    borderRadius: 12,
    backgroundColor: Colors.surface,
    color: Colors.text.primary,
    letterSpacing: 8,
  },
  errorText: {
    fontSize: 14,
    color: Colors.error,
    marginTop: 4,
  },
  otpInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  attemptsText: {
    fontSize: 14,
    color: Colors.text.secondary,
  },
  timerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  timerText: {
    fontSize: 14,
    color: Colors.text.secondary,
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    paddingVertical: 16,
    borderRadius: 12,
    marginTop: 8,
    gap: 8,
  },
  primaryButtonDisabled: {
    backgroundColor: Colors.gray[400],
  },
  primaryButtonText: {
    color: Colors.text.inverse,
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
  },
  resendButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  linkText: {
    color: Colors.primary,
    fontSize: 14,
    fontWeight: '500',
  },
  disabledText: {
    color: Colors.text.disabled,
  },
  helpSection: {
    marginTop: 32,
    padding: 16,
    backgroundColor: Colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  helpTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 8,
  },
  helpText: {
    fontSize: 14,
    color: Colors.text.secondary,
    lineHeight: 20,
    marginBottom: 4,
  },
});