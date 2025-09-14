import { useState } from 'react';
import { KeyIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { usePasswordForm } from '@/hooks/security';
import { useNotifications } from '@/components/notifications';
import PasswordStrengthIndicator from './PasswordStrengthIndicator';
import StatusIndicator from './StatusIndicator';
import type { PasswordValidation } from '@/utils/security';

interface PasswordFormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

// Move PasswordInput outside to prevent recreation on each render
const PasswordInput = ({ 
  label, 
  field, 
  placeholder, 
  showPassword, 
  toggleVisibility,
  showStrengthIndicator = false,
  formData,
  updateField,
  getFieldError,
  submitAttempted,
  validation
}: {
  label: string;
  field: keyof PasswordFormData;
  placeholder: string;
  showPassword: boolean;
  toggleVisibility: () => void;
  showStrengthIndicator?: boolean;
  formData: PasswordFormData;
  updateField: (field: keyof PasswordFormData, value: string) => void;
  getFieldError: (field: keyof PasswordFormData) => string;
  submitAttempted: boolean;
  validation: {
    currentPassword: { isValid: boolean; message: string };
    newPassword: PasswordValidation;
    confirmPassword: { isValid: boolean; message: string };
    isFormValid: boolean;
  };
}) => {
  const error = getFieldError(field);
  const hasError = submitAttempted && error;

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-slate-300">
        {label}
      </label>
      <div className="relative">
        <input
          type={showPassword ? 'text' : 'password'}
          value={formData[field]}
          onChange={(e) => updateField(field, e.target.value)}
          className={`w-full bg-slate-600 border rounded-lg px-3 py-2 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:border-transparent transition-colors ${
            hasError 
              ? 'border-red-500 focus:ring-red-500' 
              : 'border-slate-500 focus:ring-yellow-500'
          }`}
          placeholder={placeholder}
          required
        />
        <button
          type="button"
          onClick={toggleVisibility}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-300 transition-colors"
        >
          {showPassword ? (
            <EyeSlashIcon className="h-4 w-4" />
          ) : (
            <EyeIcon className="h-4 w-4" />
          )}
        </button>
      </div>
      
      {hasError && (
        <p className="text-red-400 text-xs">{error}</p>
      )}
      
      {showStrengthIndicator && formData.newPassword && (
        <PasswordStrengthIndicator 
          validation={validation.newPassword}
          showDetails={true}
        />
      )}
    </div>
  );
};

export default function PasswordChangeForm() {
  const [isLoading, setIsLoading] = useState(false);
  const { success: showSuccess, error: showError } = useNotifications();
  
  const {
    formData,
    validation,
    showPasswords,
    updateField,
    togglePasswordVisibility,
    resetForm,
    getFieldError,
    isFormValid
  } = usePasswordForm();

  const [submitAttempted, setSubmitAttempted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitAttempted(true);

    if (!isFormValid) {
      showError('Invalid Form', 'Please fix all errors before submitting');
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock successful password change
      showSuccess('Password Changed', 'Your password has been updated successfully');
      resetForm();
      setSubmitAttempted(false);
    } catch (error) {
      showError('Change Failed', 'Failed to change password. Please try again.');
      console.error('Password change error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-slate-700 rounded-lg p-6">
      <div className="flex items-center mb-4">
        <KeyIcon className="h-5 w-5 text-yellow-500 mr-2" />
        <h4 className="text-white font-medium">Change Password</h4>
      </div>
      <p className="text-slate-400 text-sm mb-6">
        Change your password regularly to keep your account secure.
      </p>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <PasswordInput
          label="Current Password"
          field="currentPassword"
          placeholder="Enter current password"
          showPassword={showPasswords.current}
          toggleVisibility={() => togglePasswordVisibility('current')}
          formData={formData}
          updateField={updateField}
          getFieldError={getFieldError}
          submitAttempted={submitAttempted}
          validation={validation}
        />

        <PasswordInput
          label="New Password"
          field="newPassword"
          placeholder="Enter new password"
          showPassword={showPasswords.new}
          toggleVisibility={() => togglePasswordVisibility('new')}
          showStrengthIndicator={true}
          formData={formData}
          updateField={updateField}
          getFieldError={getFieldError}
          submitAttempted={submitAttempted}
          validation={validation}
        />

        <PasswordInput
          label="Confirm New Password"
          field="confirmPassword"
          placeholder="Confirm new password"
          showPassword={showPasswords.confirm}
          toggleVisibility={() => togglePasswordVisibility('confirm')}
          formData={formData}
          updateField={updateField}
          getFieldError={getFieldError}
          submitAttempted={submitAttempted}
          validation={validation}
        />

        {/* Password Match Status */}
        {formData.confirmPassword && (
          <StatusIndicator
            type={validation.confirmPassword.isValid ? 'success' : 'error'}
            title={validation.confirmPassword.isValid ? 'Passwords Match' : 'Password Mismatch'}
            message={validation.confirmPassword.message || 'Passwords match perfectly'}
          />
        )}

        <div className="flex items-center justify-between pt-4">
          <button
            type="button"
            onClick={() => {
              resetForm();
              setSubmitAttempted(false);
            }}
            className="text-slate-400 hover:text-slate-300 text-sm transition-colors"
          >
            Reset Form
          </button>
          
          <button
            type="submit"
            disabled={isLoading || (!isFormValid && submitAttempted)}
            className="bg-yellow-500 hover:bg-yellow-600 disabled:bg-slate-600 disabled:cursor-not-allowed text-slate-900 disabled:text-slate-400 px-6 py-2 rounded-lg font-medium transition-colors duration-200"
          >
            {isLoading ? 'Changing...' : 'Change Password'}
          </button>
        </div>
      </form>
    </div>
  );
}