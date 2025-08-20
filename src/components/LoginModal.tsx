import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { Mascot } from './Mascot';
import './Mascot.css';
import './LoginModal.css';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const { login, loading, error } = useAuth();
  const { t_nested } = useLanguage();
  const [username, setUsername] = useState('');
  const [language, setLanguage] = useState<'en' | 'nl' | 'ar'>('en');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      await login(username.trim(), language);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="login-modal-overlay" onClick={onClose}>
      <div className="login-modal" onClick={(e) => e.stopPropagation()}>
        <div className="welcome-mascot"><Mascot size={80} /></div>
        <div className="login-content">
          <h2>Welcome to Smart Dutch Driving Theory!</h2>
          <p>Create your account to save your progress across devices</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              required
              minLength={2}
              maxLength={50}
            />
          </div>

          <div className="form-group">
            <label htmlFor="language">Language</label>
            <select
              id="language"
              value={language}
              onChange={(e) => setLanguage(e.target.value as 'en' | 'nl' | 'ar')}
            >
              <option value="en">English</option>
              <option value="nl">Nederlands</option>
              <option value="ar">العربية</option>
            </select>
          </div>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <div className="login-benefits">
            <h4>✨ Benefits of creating an account:</h4>
            <ul>
              <li>📱 Sync progress across all devices</li>
              <li>☁️ Never lose your study data</li>
              <li>📊 Detailed progress analytics</li>
              <li>🎯 Personalized study recommendations</li>
            </ul>
          </div>

          <div className="login-actions">
            <button
              type="submit"
              className="login-btn primary"
              disabled={loading || !username.trim()}
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
            <button
              type="button"
              className="login-btn secondary"
              onClick={onClose}
            >
              Continue Without Account
            </button>
          </div>
        </form>

        <div className="login-footer">
          <p>Your data is stored securely and you can delete it anytime</p>
        </div>
      </div>
    </div>
  );
}; 