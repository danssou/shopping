'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { validatePassword, validatePasswordMatch, type PasswordValidation } from '@/utils/security';

interface PasswordFormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface PasswordFormValidation {
  currentPassword: { isValid: boolean; message: string };
  newPassword: PasswordValidation;
  confirmPassword: { isValid: boolean; message: string };
  isFormValid: boolean;
}

export function usePasswordForm() {
  const [formData, setFormData] = useState<PasswordFormData>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [validation, setValidation] = useState<PasswordFormValidation>({
    currentPassword: { isValid: false, message: '' },
    newPassword: {
      isValid: false,
      strength: 'weak',
      score: 0,
      feedback: [],
      requirements: {
        minLength: false,
        hasUppercase: false,
        hasLowercase: false,
        hasNumbers: false,
        hasSpecialChars: false,
        noCommonWords: false,
        noSequential: false
      }
    },
    confirmPassword: { isValid: false, message: '' },
    isFormValid: false
  });

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });

  // Validate form whenever data changes with optimized checks
  const validationResult = useMemo(() => {
    const currentPasswordValid = {
      isValid: formData.currentPassword.length >= 6,
      message: formData.currentPassword.length >= 6 ? '' : 'Current password is required'
    };

    const newPasswordValidation = validatePassword(formData.newPassword);
    
    const confirmPasswordValid = validatePasswordMatch(
      formData.newPassword, 
      formData.confirmPassword
    );

    const isFormValid = 
      currentPasswordValid.isValid && 
      newPasswordValidation.isValid && 
      confirmPasswordValid.isValid;

    return {
      currentPassword: currentPasswordValid,
      newPassword: newPasswordValidation,
      confirmPassword: confirmPasswordValid,
      isFormValid
    };
  }, [formData]);

  useEffect(() => {
    setValidation(validationResult);
  }, [validationResult]);

  const updateField = useCallback((field: keyof PasswordFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  }, []);

  const togglePasswordVisibility = (field: 'current' | 'new' | 'confirm') => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const resetForm = () => {
    setFormData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
    setShowPasswords({
      current: false,
      new: false,
      confirm: false
    });
  };

  const getFieldError = (field: keyof PasswordFormData) => {
    if (field === 'currentPassword') {
      return !validation.currentPassword.isValid && formData.currentPassword.length > 0
        ? validation.currentPassword.message
        : '';
    }
    
    if (field === 'newPassword') {
      return !validation.newPassword.isValid && formData.newPassword.length > 0
        ? validation.newPassword.feedback[0] || 'Password is too weak'
        : '';
    }
    
    if (field === 'confirmPassword') {
      return !validation.confirmPassword.isValid && formData.confirmPassword.length > 0
        ? validation.confirmPassword.message
        : '';
    }
    
    return '';
  };

  return {
    formData,
    validation,
    showPasswords,
    updateField,
    togglePasswordVisibility,
    resetForm,
    getFieldError,
    isFormValid: validation.isFormValid
  };
}
