import React, { createContext, useContext, useState, ReactNode } from 'react';

interface UserProfile {
  name: string;
  relation: string;
  role: string;
}

interface UserData {
  user_id: number;
  membership_no: string;
  profile: UserProfile;
  token: string;
}

interface DetailedProfile {
  id: number;
  user_id: number;
  name: string;
  anniversary: string | null;
  category: string | null;
  relation: string;
  email: string;
  mobile: string;
  gender: string;
  city: string;
  pin: string;
  address: string;
  status: number;
  created_at: string;
  updated_at: string;
  role: string;
  dob: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  userData: UserData | null;
  login: (membershipNo: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  verifyDOB: (membershipNo: string, dob: string) => Promise<{ success: boolean; userId?: number; error?: string }>;
  resetPassword: (userId: number, password: string, passwordConfirmation: string) => Promise<{ success: boolean; error?: string }>;
  getUserProfile: () => Promise<{ success: boolean; data?: DetailedProfile; error?: string }>;
  updateProfile: (profileData: {
    dob: string;
    name: string;
    email: string;
    mobile: string;
    gender: string;
    pin: string;
    city: string;
    address: string;
    anniversary?: string;
  }) => Promise<{ success: boolean; error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);

  const login = async (membershipNo: string, password: string) => {
    try {
      const response = await fetch(
        `https://doonclub.in/api/login?membership_no=${membershipNo}&password=${password}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setUserData(data);
        setIsAuthenticated(true);
        return { success: true };
      } else {
        return { success: false, error: 'Invalid membership ID or password' };
      }
    } catch (error) {
      return { success: false, error: 'Network error. Please try again.' };
    }
  };

  const verifyDOB = async (membershipNo: string, dob: string) => {
    try {
      const response = await fetch(
        `https://doonclub.in/api/verify-dob?dob=${dob}&membership_no=${membershipNo}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        return { success: true, userId: data.user_id };
      } else {
        return { success: false, error: 'Invalid membership ID or date of birth' };
      }
    } catch (error) {
      return { success: false, error: 'Network error. Please try again.' };
    }
  };

  const resetPassword = async (userId: number, password: string, passwordConfirmation: string) => {
    try {
      const response = await fetch(
        `https://doonclub.in/api/set-new-password?user_id=${userId}&password=${password}&password_confirmation=${passwordConfirmation}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.ok) {
        return { success: true };
      } else {
        return { success: false, error: 'Failed to reset password. Please try again.' };
      }
    } catch (error) {
      return { success: false, error: 'Network error. Please try again.' };
    }
  };

  const getUserProfile = async () => {
    if (!userData?.token) {
      return { success: false, error: 'Not authenticated' };
    }

    try {
      const response = await fetch('https://doonclub.in/api/get-user-profile', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userData.token}`,
        },
      });

      if (response.ok) {
        const result = await response.json();
        if (result.status && result.data) {
          return { success: true, data: result.data };
        }
        return { success: false, error: 'Invalid response format' };
      } else {
        return { success: false, error: 'Failed to fetch profile' };
      }
    } catch (error) {
      return { success: false, error: 'Network error. Please try again.' };
    }
  };

  const updateProfile = async (profileData: {
    dob: string;
    name: string;
    email: string;
    mobile: string;
    gender: string;
    pin: string;
    city: string;
    address: string;
    anniversary?: string;
  }) => {
    if (!userData?.token) {
      return { success: false, error: 'Not authenticated' };
    }

    try {
      const response = await fetch('https://doonclub.in/api/update-profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userData.token}`,
        },
        body: JSON.stringify(profileData),
      });

      if (response.ok) {
        return { success: true };
      } else {
        return { success: false, error: 'Failed to update profile' };
      }
    } catch (error) {
      return { success: false, error: 'Network error. Please try again.' };
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUserData(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, userData, login, logout, verifyDOB, resetPassword, getUserProfile, updateProfile }}>
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
