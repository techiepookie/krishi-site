import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { authService, UserProfile } from '@/lib/auth';
import { storage } from '@/lib/storage';

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  isAuthenticated: boolean;
  onboardingCompleted: boolean;
  signIn: (phone: string, otp: string) => Promise<any>;
  signOut: () => Promise<void>;
  sendOTP: (phone: string) => Promise<any>;
  createProfile: (profileData: Partial<UserProfile>) => Promise<any>;
  updateProfile: (profileData: Partial<UserProfile>) => Promise<void>;
  checkExistingUser: (phone: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [onboardingCompleted, setOnboardingCompleted] = useState(false);

  const isAuthenticated = !!user;

  useEffect(() => {
    loadUserSession();
  }, []);

  async function loadUserSession() {
    try {
      setLoading(true);
      
      const currentUser = await authService.getCurrentUser();
      if (currentUser) {
        const profile = await authService.getProfile();
        setUser(profile);
        setOnboardingCompleted(!!profile);
      }

      const onboardingStatus = await storage.getItem('onboardingCompleted');
      setOnboardingCompleted(onboardingStatus === 'true');
    } catch (error) {
      console.error('Load user session error:', error);
    } finally {
      setLoading(false);
    }
  }

  async function sendOTP(phone: string) {
    return await authService.sendOTP(phone);
  }

  async function signIn(phone: string, otp: string) {
    try {
      const result = await authService.verifyOTP(phone, otp);
      if (result.data?.user) {
        const profile = await authService.getProfile();
        setUser(profile);
        setOnboardingCompleted(!!profile);
      }
      return result;
    } catch (error) {
      console.error('Sign in error:', error);
      return { data: null, error };
    }
  }

  async function checkExistingUser(phone: string) {
    try {
      return await authService.checkExistingUser(phone);
    } catch (error) {
      console.error('Check existing user error:', error);
      return false;
    }
  }

  async function signOut() {
    await authService.logout();
    setUser(null);
    setOnboardingCompleted(false);
    await storage.removeItem('userProfile');
    await storage.removeItem('onboardingCompleted');
    await storage.removeItem('connectedDevice');
    await storage.removeItem('aiApiKey');
  }

  async function createProfile(profileData: Partial<UserProfile>) {
    try {
      // First check if profile already exists
      const existingProfile = await authService.getProfile();
      
      if (existingProfile) {
        // Profile exists, update it instead
        const result = await authService.updateProfile(profileData);
        if (result.data) {
          setUser(result.data);
          setOnboardingCompleted(true);
          await storage.setItem('onboardingCompleted', 'true');
        }
        return result;
      } else {
        // No profile exists, create new one
        const result = await authService.createProfile(profileData);
        if (result.data) {
          setUser(result.data);
          setOnboardingCompleted(true);
          await storage.setItem('onboardingCompleted', 'true');
        }
        return result;
      }
    } catch (error) {
      console.error('Profile creation/update error:', error);
      return { data: null, error };
    }
  }

  async function updateProfile(profileData: Partial<UserProfile>) {
    if (user) {
      const updatedUser = { ...user, ...profileData };
      setUser(updatedUser);
      await storage.setItem('userProfile', JSON.stringify(updatedUser));
      
      // Also update in database
      try {
        await authService.updateProfile(profileData);
      } catch (error) {
        console.error('Failed to update profile in database:', error);
      }
    }
  }

  const value = {
    user,
    loading,
    isAuthenticated,
    onboardingCompleted,
    signIn,
    signOut,
    sendOTP,
    createProfile,
    updateProfile,
    checkExistingUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}