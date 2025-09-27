import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { Mascot } from './Mascot';
import './SimpleLogin.css';
import './Mascot.css';

type OnboardingStep = 'welcome' | 'signup' | 'signin';

export const SimpleLogin: React.FC = () => {
  const { login, loginAsGuest, loading } = useAuthStore();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<OnboardingStep>('welcome');
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [validationErrors, setValidationErrors] = useState<{[key: string]: string}>({});

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (validationErrors[field]) {
      setValidationErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const errors: {[key: string]: string} = {};

    if (currentStep === 'signup') {
      if (!formData.username.trim()) {
        errors.username = 'Username is required';
      }
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
      navigate('/language');
      await login(formData.username, formData.email, undefined);
    } catch (error) {
      // Sign up failed
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      setValidationErrors({ email: 'Email and password are required' });
      return;
    }

    try {
      navigate('/language');
      await login(formData.email.split('@')[0], formData.email, undefined);
    } catch (error) {
      // Sign in failed
    }
  };

  const handleGuestContinue = async () => {
    try {
      navigate('/language');
      await loginAsGuest();
    } catch (error) {
      // Failed to create guest user
    }
  };

  const handleSocialSignIn = async (provider: 'google' | 'facebook' | 'apple') => {
    try {
      navigate('/language');
      
      const username = `user_${provider}_${Math.random().toString(36).substr(2, 6)}`;
      const email = `${username}@${provider}.com`;
      
      await login(username, email, undefined);
    } catch (error: any) {
      // Social sign in failed
    }
  };

  const renderWelcomeStep = () => (
    <div className="login-page welcome-page">
      <div className="login-container">
        <div className="login-header">
          <div className="login-mascot">
            <Mascot size={120} />
          </div>
          <h1>Theory24</h1>
          <p>learn dutch driving theory with AI in 24 hours</p>
        </div>

        <div className="login-actions">
          <button 
            className="login-btn-primary" 
            onClick={() => setCurrentStep('signup')}
          >
            Get Started
          </button>
          <button 
            className="login-btn-secondary" 
            onClick={() => setCurrentStep('signin')}
          >
            Sign In
          </button>
          <button 
            className="login-btn-guest" 
            onClick={handleGuestContinue}
          >
            Continue as Guest
          </button>
        </div>
      </div>
    </div>
  );

  const renderSignUpStep = () => (
    <div className="login-page">
      <div className="login-container">
        <div className="nav-bar">
          <button 
            className="back-button"
            onClick={() => setCurrentStep('welcome')}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            <span>Back</span>
          </button>
          <h1>Sign up</h1>
        </div>

        <form onSubmit={handleSignUp} className="login-form">
          <div className="form-group">
            <label>Username</label>
            <input
              type="text"
              placeholder="Username"
              value={formData.username}
              onChange={(e) => handleInputChange('username', e.target.value)}
              className={validationErrors.username ? 'error' : ''}
            />
            {validationErrors.username && <span className="error-message">{validationErrors.username}</span>}
          </div>

          <div className="form-group">
            <label>Email</label>
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
            <label>Password</label>
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
            <label>Confirm Password</label>
            <input
              type="password"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
              className={validationErrors.confirmPassword ? 'error' : ''}
            />
            {validationErrors.confirmPassword && <span className="error-message">{validationErrors.confirmPassword}</span>}
          </div>

          <button type="submit" className="login-btn-primary">
            Sign up
          </button>
        </form>

        <div className="social-login">
          <div className="social-section-title">
            <span>OR</span>
          </div>
          <div className="social-buttons">
            <button onClick={() => handleSocialSignIn('facebook')} className="social-btn facebook">
              <span style={{ color: 'white', fontSize: '18px', fontWeight: 'bold' }}>f</span>
            </button>
            <button onClick={() => handleSocialSignIn('google')} className="social-btn google">
              <span style={{ color: 'white', fontSize: '18px', fontWeight: 'bold' }}>G</span>
            </button>
            <button onClick={() => handleSocialSignIn('apple')} className="social-btn apple">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                <path d="M14.94,5.19A4.38,4.38,0,0,0,16,2,4.44,4.44,0,0,0,13,3.52,4.17,4.17,0,0,0,12,6.61,3.69,3.69,0,0,0,14.94,5.19Zm2.52,7.44a4.51,4.51,0,0,1,2.16-3.81,4.66,4.66,0,0,0-3.66-2c-1.56-.16-3,.91-3.83.91s-2-.89-3.3-.87A4.92,4.92,0,0,0,4.69,9.39C2.93,12.45,4.24,17,6,19.47,6.8,20.68,7.8,22.05,9.12,22s1.75-.82,3.28-.82,2,.82,3.3.79,2.22-1.24,3.06-2.45a11,11,0,0,0,1.38-2.85A4.41,4.41,0,0,1,17.46,12.63Z"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSignInStep = () => (
    <div className="login-page">
      <div className="login-container">
        <div className="nav-bar">
          <button 
            className="back-button"
            onClick={() => setCurrentStep('welcome')}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            <span>Back</span>
          </button>
          <h1>Log in</h1>
        </div>

        <form onSubmit={handleSignIn} className="login-form">
          <div className="form-group">
            <label>Email</label>
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
            <label>Password</label>
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

          <button type="submit" className="login-btn-primary">
            Log in
          </button>
        </form>

        <div className="social-login">
          <div className="social-section-title">
            <span>OR</span>
          </div>
          <div className="social-buttons">
            <button onClick={() => handleSocialSignIn('facebook')} className="social-btn facebook">
              <span style={{ color: 'white', fontSize: '18px', fontWeight: 'bold' }}>f</span>
            </button>
            <button onClick={() => handleSocialSignIn('google')} className="social-btn google">
              <span style={{ color: 'white', fontSize: '18px', fontWeight: 'bold' }}>G</span>
            </button>
            <button onClick={() => handleSocialSignIn('apple')} className="social-btn apple">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                <path d="M14.94,5.19A4.38,4.38,0,0,0,16,2,4.44,4.44,0,0,0,13,3.52,4.17,4.17,0,0,0,12,6.61,3.69,3.69,0,0,0,14.94,5.19Zm2.52,7.44a4.51,4.51,0,0,1,2.16-3.81,4.66,4.66,0,0,0-3.66-2c-1.56-.16-3,.91-3.83.91s-2-.89-3.3-.87A4.92,4.92,0,0,0,4.69,9.39C2.93,12.45,4.24,17,6,19.47,6.8,20.68,7.8,22.05,9.12,22s1.75-.82,3.28-.82,2,.82,3.3.79,2.22-1.24,3.06-2.45a11,11,0,0,0,1.38-2.85A4.41,4.41,0,0,1,17.46,12.63Z"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // No loading screen - instant access for competition

  switch (currentStep) {
    case 'welcome':
      return renderWelcomeStep();
    case 'signup':
      return renderSignUpStep();
    case 'signin':
      return renderSignInStep();
    default:
      return renderWelcomeStep();
  }
};
