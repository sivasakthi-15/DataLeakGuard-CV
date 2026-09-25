import React, { createContext, useContext, useState } from 'react';

export interface User {
  name: string;
  email: string;
  role: string;
  organization: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, pass: string, rememberMe?: boolean) => Promise<boolean>;
  register: (name: string, email: string, pass: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const local = localStorage.getItem('dlg_user');
    if (local) {
      try {
        return JSON.parse(local);
      } catch {
        // invalid JSON
      }
    }
    const session = sessionStorage.getItem('dlg_user');
    if (session) {
      try {
        return JSON.parse(session);
      } catch {
        // invalid JSON
      }
    }
    return null;
  });

  const login = async (email: string, pass: string, rememberMe = true) => {
    // Simulate verification
    await new Promise((r) => setTimeout(r, 300));

    const storedUsersJson = localStorage.getItem('dlg_registered_users');
    let registeredUsers: Array<{ name: string; email: string; pass: string }> = [];
    if (storedUsersJson) {
      try {
        registeredUsers = JSON.parse(storedUsersJson);
      } catch {
        registeredUsers = [];
      }
    }

    // Default demo credentials: a.vance@integrity-lab.org
    const matched = registeredUsers.find(
      (u) => u.email.toLowerCase() === email.trim().toLowerCase()
    );

    if (matched && matched.pass && matched.pass !== pass) {
      throw new Error('Incorrect password');
    }

    const userName =
      matched?.name ||
      (email.toLowerCase().includes('vance')
        ? 'Dr. Alexis Vance'
        : email.split('@')[0].replace(/[._-]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())) ||
      'ML Auditor';

    const newUser: User = {
      name: userName,
      email: email.trim().toLowerCase(),
      role: 'ML Security Lead',
      organization: 'Integrity Assurance Lab'
    };

    setUser(newUser);
    if (rememberMe) {
      localStorage.setItem('dlg_user', JSON.stringify(newUser));
      sessionStorage.removeItem('dlg_user');
    } else {
      sessionStorage.setItem('dlg_user', JSON.stringify(newUser));
      localStorage.removeItem('dlg_user');
    }
    return true;
  };

  const register = async (name: string, email: string, pass: string) => {
    await new Promise((r) => setTimeout(r, 300));
    const storedUsersJson = localStorage.getItem('dlg_registered_users');
    let registeredUsers: Array<{ name: string; email: string; pass: string }> = [];
    if (storedUsersJson) {
      try {
        registeredUsers = JSON.parse(storedUsersJson);
      } catch {
        registeredUsers = [];
      }
    }

    const normalizedEmail = email.trim().toLowerCase();
    const existingIndex = registeredUsers.findIndex(
      (u) => u.email.toLowerCase() === normalizedEmail
    );

    if (existingIndex >= 0) {
      registeredUsers[existingIndex] = { name: name.trim(), email: normalizedEmail, pass };
    } else {
      registeredUsers.push({ name: name.trim(), email: normalizedEmail, pass });
    }

    localStorage.setItem('dlg_registered_users', JSON.stringify(registeredUsers));
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('dlg_user');
    sessionStorage.removeItem('dlg_user');
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
