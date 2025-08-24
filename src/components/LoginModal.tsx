import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { Mascot } from './Mascot';
import SocialAuthService from '../services/socialAuthService';
import './Mascot.css';
import './LoginModal.css';

interface LoginPageProps {
  onLoginSuccess?: () => void;
}

type OnboardingStep = 'welcome' | 'signup' | 'signin' | 'complete';

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const { login, loading, error } = useAuth();
  const [currentStep, setCurrentStep] = useState<OnboardingStep>('welcome');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [validationErrors, setValidationErrors] = useState<{[key: string]: string}>({});

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear validation error when user starts typing
    if (validationErrors[field]) {
      setValidationErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const errors: {[key: string]: string} = {};

    if (currentStep === 'signup') {
      if (!formData.email.trim()) {
        errors.email = 'Email is required';
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        errors.email = 'Please enter a valid email';
      }

      if (!formData.password) {
        errors.password = 'Password is required';
      } else if (formData.password.length < 6) {
        errors.password = 'Password must be at least 6 characters';
      }

      if (formData.password !== formData.confirmPassword) {
        errors.confirmPassword = 'Passwords do not match';
      }
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      // Use email prefix as username
      const username = formData.email.split('@')[0];
      await login(username, formData.email, 'en');
      setCurrentStep('complete');
      if (onLoginSuccess) {
        onLoginSuccess();
      }
    } catch (error) {
      console.error('Sign up failed:', error);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      setValidationErrors({ email: 'Email and password are required' });
      return;
    }

    try {
      // For now, create a user with the email as username
      await login(formData.email.split('@')[0], formData.email, 'en');
      setCurrentStep('complete');
      if (onLoginSuccess) {
        onLoginSuccess();
      }
    } catch (error) {
      console.error('Sign in failed:', error);
    }
  };

  const handleGuestContinue = async () => {
    try {
      const guestUsername = `guest_${Math.random().toString(36).substr(2, 9)}`;
      // Don't set language here - let the user choose in language selection
      await login(guestUsername, `${guestUsername}@guest.com`);
      if (onLoginSuccess) {
        onLoginSuccess();
      }
    } catch (error) {
      console.error('Failed to create guest user:', error);
    }
  };

  const handleSocialSignIn = async (provider: 'google' | 'facebook' | 'apple') => {
    try {
      let result;
      
      switch (provider) {
        case 'google':
          result = await SocialAuthService.signInWithGoogle();
          break;
        case 'facebook':
          result = await SocialAuthService.signInWithFacebook();
          break;
        case 'apple':
          result = await SocialAuthService.signInWithApple();
          break;
        default:
          throw new Error('Invalid provider');
      }

      // Convert cloud user to our app's user format
      const username = result.user.displayName || result.user.email?.split('@')[0] || 'user';
      const email = result.user.email || `${username}@${provider}.com`;
      
      // Use our existing login function to integrate with app
      await login(username, email, 'en');
      
      if (onLoginSuccess) {
        onLoginSuccess();
      }
    } catch (error: any) {
      console.error(`${provider} sign in failed:`, error);
      // You could show this error in the UI
      alert(error.message);
    }
  };

  const renderWelcomeStep = () => (
    <div className="login-container">
      <div className="login-header">
        <div className="login-mascot">
          <Mascot size={120} />
        </div>
        <h1>SmartTheory</h1>
        <p>Smarter way to learn Dutch driving theory</p>
      </div>

      <div className="login-actions">
        <button 
          className="btn-primary" 
          onClick={() => setCurrentStep('signup')}
        >
          Get Started
        </button>
        <button 
          className="btn-secondary" 
          onClick={() => setCurrentStep('signin')}
        >
          Sign In
        </button>
        <button 
          className="btn-guest" 
          onClick={handleGuestContinue}
        >
          Continue as Guest
        </button>
      </div>
    </div>
  );

  const renderSignUpStep = () => (
    <div className="login-container">
      <div className="login-header">
        <button 
          className="back-button"
          onClick={() => setCurrentStep('welcome')}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
        </button>
        <h1>Sign up</h1>
      </div>

      <form onSubmit={handleSignUp} className="login-form">
        <div className="form-group">
          <input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            className={validationErrors.email ? 'error' : ''}
          />
          {validationErrors.email && <span className="error-message">{validationErrors.email}</span>}
        </div>

        <div className="form-group">
          <input
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={(e) => handleInputChange('password', e.target.value)}
            className={validationErrors.password ? 'error' : ''}
          />
          {validationErrors.password && <span className="error-message">{validationErrors.password}</span>}
        </div>

        <div className="form-group">
          <input
            type="password"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
            className={validationErrors.confirmPassword ? 'error' : ''}
          />
          {validationErrors.confirmPassword && <span className="error-message">{validationErrors.confirmPassword}</span>}
        </div>

        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? 'Creating Account...' : 'Create Account'}
        </button>
      </form>

      <div className="social-login">
        <div className="divider">
          <span>or</span>
        </div>
        <div className="social-buttons">
          <button onClick={() => handleSocialSignIn('google')} className="social-btn google">
            <svg width="20" height="20" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </button>
          <button onClick={() => handleSocialSignIn('facebook')} className="social-btn facebook">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="#1877F2">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
            Continue with Facebook
          </button>
          <button onClick={() => handleSocialSignIn('apple')} className="social-btn apple">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="#000">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
            </svg>
            Continue with Apple
          </button>
        </div>
      </div>
    </div>
  );

  const renderSignInStep = () => (
    <div className="login-container">
      <div className="login-header">
        <button 
          className="back-button"
          onClick={() => setCurrentStep('welcome')}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
        </button>
        <div className="login-mascot">
          <Mascot size={120} />
        </div>
        <h1>Log in</h1>
        <p>Smarter way to learn Dutch driving theory</p>
      </div>

      <form onSubmit={handleSignIn} className="login-form">
        <div className="form-group">
          <input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            className={validationErrors.email ? 'error' : ''}
          />
          {validationErrors.email && <span className="error-message">{validationErrors.email}</span>}
        </div>

        <div className="form-group">
          <input
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={(e) => handleInputChange('password', e.target.value)}
            className={validationErrors.password ? 'error' : ''}
          />
          {validationErrors.password && <span className="error-message">{validationErrors.password}</span>}
        </div>

        <div className="forgot-password">
          <a href="#" onClick={(e) => e.preventDefault()}>Forgot Password?</a>
        </div>

        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? 'Signing In...' : 'Sign In'}
        </button>
      </form>

      <div className="social-login">
        <div className="divider">
          <span>or</span>
        </div>
        <div className="social-buttons">
          <button onClick={() => handleSocialSignIn('google')} className="social-btn google">
            <svg width="20" height="20" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </button>
          <button onClick={() => handleSocialSignIn('facebook')} className="social-btn facebook">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="#1877F2">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
            Continue with Facebook
          </button>
          <button onClick={() => handleSocialSignIn('apple')} className="social-btn apple">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="#000">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
            </svg>
            Continue with Apple
          </button>
        </div>
      </div>
    </div>
  );

  const renderCompleteStep = () => (
    <div className="login-container">
      <div className="login-header">
        <div className="login-mascot">
          <Mascot size={120} />
        </div>
        <h1>Welcome!</h1>
        <p>Your account has been created successfully</p>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="login-container">
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  switch (currentStep) {
    case 'welcome':
      return renderWelcomeStep();
    case 'signup':
      return renderSignUpStep();
    case 'signin':
      return renderSignInStep();
    case 'complete':
      return renderCompleteStep();
    default:
      return renderWelcomeStep();
  }
}; 