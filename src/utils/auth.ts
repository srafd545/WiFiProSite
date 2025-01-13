import bcrypt from 'bcryptjs';
import emailjs from '@emailjs/browser';

interface User {
  email: string;
  password: string;
  recoveryCode?: string;
  recoveryExpires?: number;
}

// Helper functions to read and write the database
const readDB = (): User[] => {
  try {
    const data = localStorage.getItem('users') || '[]';
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
};

const writeDB = (users: User[]) => {
  localStorage.setItem('users', JSON.stringify(users));
};

export const registerUser = async (email: string, password: string) => {
  try {
    const users = readDB();
    
    // Check if user already exists
    if (users.some(user => user.email === email)) {
      return { success: false, message: 'Email already registered' };
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Add new user
    users.push({
      email,
      password: hashedPassword
    });
    
    writeDB(users);
    return { success: true, message: 'Registration successful' };
  } catch (error) {
    return { success: false, message: 'Registration failed' };
  }
};

export const loginUser = async (email: string, password: string) => {
  try {
    const users = readDB();
    const user = users.find(u => u.email === email);
    
    if (!user) {
      return { success: false, message: 'Invalid credentials' };
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return { success: false, message: 'Invalid credentials' };
    }

    return { success: true, message: 'Login successful', user };
  } catch (error) {
    return { success: false, message: 'Login failed' };
  }
};

export const initiatePasswordRecovery = async (email: string) => {
  try {
    const users = readDB();
    const user = users.find(u => u.email === email);
    
    if (!user) {
      return { success: false, message: 'Email not found' };
    }

    // Generate 6-digit recovery code
    const recoveryCode = Math.floor(100000 + Math.random() * 900000).toString();
    const recoveryExpires = Date.now() + 30 * 60 * 1000; // 30 minutes

    // Update user with recovery code
    const updatedUsers = users.map(u => {
      if (u.email === email) {
        return { ...u, recoveryCode, recoveryExpires };
      }
      return u;
    });

    writeDB(updatedUsers);
    
    // For development purposes, show the code in console
    console.log('Recovery code:', recoveryCode);
    
    return { success: true, message: 'Recovery code generated! Check the console for the code.' };
  } catch (error) {
    return { success: false, message: 'Failed to generate recovery code' };
  }
};

export const verifyRecoveryCode = (email: string, code: string) => {
  const users = readDB();
  const user = users.find(u => u.email === email);
  
  if (!user || !user.recoveryCode || !user.recoveryExpires) {
    return false;
  }

  return user.recoveryCode === code && user.recoveryExpires > Date.now();
};

export const updatePassword = async (email: string, code: string, newPassword: string) => {
  try {
    if (!verifyRecoveryCode(email, code)) {
      return { success: false, message: 'Invalid or expired recovery code' };
    }

    const users = readDB();
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const updatedUsers = users.map(u => {
      if (u.email === email) {
        return {
          ...u,
          password: hashedPassword,
          recoveryCode: undefined,
          recoveryExpires: undefined
        };
      }
      return u;
    });

    writeDB(updatedUsers);
    return { success: true, message: 'Password updated successfully' };
  } catch (error) {
    return { success: false, message: 'Failed to update password' };
  }
};