import { useLanguage } from '../contexts/LanguageContext';
import type { Language } from '../types';
import './LanguageSelection.css';

export function LanguageSelection() {
  const { setLanguage } = useLanguage();

  const handleLanguageSelect = (language: Language) => {
    setLanguage(language);
  };

  return (
    <div className="language-selection">
      <div className="language-card">
        <div className="language-header">
          <h1>Choose Your Language</h1>
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