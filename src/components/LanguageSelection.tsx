import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import type { Language } from '../types';
import './LanguageSelection.css';

export function LanguageSelection() {
  const { setLanguage } = useLanguage();
  const { logout } = useAuth();

  const handleLanguageSelect = (language: Language) => {
    setLanguage(language);
  };

  const handleBack = () => {
    logout();
  };

  return (
    <div className="language-selection">
      <div className="language-card">
        <div className="language-header">
          <button 
            className="back-button"
            onClick={handleBack}
            aria-label="Go back"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5"/>
              <path d="M12 19l-7-7 7-7"/>
            </svg>
          </button>
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