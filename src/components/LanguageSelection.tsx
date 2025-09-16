// React import removed - not needed in newer versions
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import type { Language } from '../types';
import './LanguageSelection.css';

export function LanguageSelection() {
  const navigate = useNavigate();
  const { setLanguage } = useAuthStore();

  const handleLanguageSelect = (language: Language) => {
    setLanguage(language);
    navigate('/dashboard');
  };

  return (
    <div className="language-selection">
      <div className="language-card">
        <div className="language-header">
          <h1 style={{
            fontSize: 'var(--font-size-display)', 
            margin: 0, 
            fontWeight: 900, 
            color: '#002868', 
            letterSpacing: '-0.5px', 
            lineHeight: 1.1, 
            fontFamily: "'Nunito', system-ui, -apple-system, sans-serif"
          }}>
            Language
          </h1>
        </div>
        
        <div className="language-options">
          <button
            className="language-option"
            onClick={() => handleLanguageSelect('en')}
            aria-label="Select English language"
          >
            <div className="language-content">
              <span className="flag">🇬🇧</span>
              <span className="language-name">English</span>
            </div>
          </button>
          
          <button
            className="language-option"
            onClick={() => handleLanguageSelect('nl')}
            aria-label="Select Dutch language"
          >
            <div className="language-content">
              <span className="flag">🇳🇱</span>
              <span className="language-name">Dutch</span>
            </div>
          </button>

          <button
            className="language-option"
            onClick={() => handleLanguageSelect('ar')}
            aria-label="Select Arabic language"
          >
            <div className="language-content">
              <span className="flag">🇸🇦</span>
              <span className="language-name">Arabic</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
} 