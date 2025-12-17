import { useState } from 'react';

const RUET_EMAIL_PATTERN = /^24080\d{2}@student\.ruet\.ac\.bd$/;

interface ValidationError {
  email?: string;
  password?: string;
  name?: string;
}

export function useAuthValidation() {
  const [errors, setErrors] = useState<ValidationError>({});

  const validateEmail = (email: string): boolean => {
    if (!email) {
      setErrors(prev => ({ ...prev, email: 'Email is required' }));
      return false;
    }

    if (!RUET_EMAIL_PATTERN.test(email)) {
      setErrors(prev => ({
        ...prev,
        email: 'Email must be in format: 24080xx@student.ruet.ac.bd'
      }));
      return false;
    }

    setErrors(prev => {
      const { email: _, ...rest } = prev;
      return rest;
    });
    return true;
  };

  const validatePassword = (password: string): boolean => {
    if (!password) {
      setErrors(prev => ({ ...prev, password: 'Password is required' }));
      return false;
    }

    if (password.length < 6) {
      setErrors(prev => ({ ...prev, password: 'Password must be at least 6 characters' }));
      return false;
    }

    setErrors(prev => {
      const { password: _, ...rest } = prev;
      return rest;
    });
    return true;
  };

  const validateName = (name: string): boolean => {
    if (name.trim().length === 0) {
      setErrors(prev => ({ ...prev, name: 'Name is required' }));
      return false;
    }

    setErrors(prev => {
      const { name: _, ...rest } = prev;
      return rest;
    });
    return true;
  };

  const clearErrors = () => {
    setErrors({});
  };

  return {
    errors,
    validateEmail,
    validatePassword,
    validateName,
    clearErrors
  };
}
