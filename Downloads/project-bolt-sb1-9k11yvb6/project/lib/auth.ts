import { supabase } from './supabase';
import { storage } from './storage';

export interface UserProfile {
  id: string;
  phone: string;
  full_name: string;
  profile_photo?: string;
  land_type: string;
  agriculture_type: string;
  crops: string[];
  location: {
    latitude: number;
    longitude: number;
    address: string;
  };
  language: string;
  created_at: string;
  updated_at: string;
}

export const authService = {
  async sendOTP(phone: string) {
    try {
      const { data, error } = await supabase.auth.signInWithOtp({
        phone: phone,
      });
      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  },

  async verifyOTP(phone: string, token: string) {
    try {
      const { data, error } = await supabase.auth.verifyOtp({
        phone: phone,
        token: token,
        type: 'sms',
      });
      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  },

  async checkExistingUser(phone: string) {
    try {
      // First check auth.users table
      const { data: authUser } = await supabase.auth.admin.listUsers();
      const userExists = authUser?.users?.some(user => user.phone === phone);
      
      if (!userExists) return false;
      
      // Then check if profile exists
      const { data, error } = await supabase
        .from('profiles')
        .select('id')
        .eq('phone', phone)
        .single();
      
      return !!data && !error;
    } catch (error) {
      console.error('Check existing user error:', error);
      return false;
    }
  },

  async logout() {
    try {
      await supabase.auth.signOut();
      await storage.removeItem('userProfile');
      await storage.removeItem('onboardingCompleted');
    } catch (error) {
      console.error('Logout error:', error);
    }
  },

  async getCurrentUser() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      return user;
    } catch (error) {
      console.error('Get current user error:', error);
      return null;
    }
  },

  async createProfile(profileData: Partial<UserProfile>) {
    try {
      const user = await this.getCurrentUser();
      if (!user) throw new Error('No authenticated user');

      const { data, error } = await supabase
        .from('profiles')
        .insert([{ ...profileData, id: user.id, phone: user.phone }])
        .select()
        .single();

      if (!error) {
        await storage.setItem('userProfile', JSON.stringify(data));
        await storage.setItem('onboardingCompleted', 'true');
      }

      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  },

  async getProfile() {
    try {
      const user = await this.getCurrentUser();
      if (!user) return null;

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('phone', user.phone)
        .single();

      if (data && !error) {
        await storage.setItem('userProfile', JSON.stringify(data));
        return data;
      }

      return null;
    } catch (error) {
      console.error('Get profile error:', error);
      return null;
    }
  },

  async updateProfile(profileData: Partial<UserProfile>) {
    try {
      const user = await this.getCurrentUser();
      if (!user) throw new Error('No authenticated user');

      const { data, error } = await supabase
        .from('profiles')
        .update(profileData)
        .eq('phone', user.phone)
        .select()
        .single();

      if (!error && data) {
        await storage.setItem('userProfile', JSON.stringify(data));
      }

      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  },
};