import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import './Settings.css';
import { QRCodeSVG } from 'qrcode.react';
import { FiUser, FiLock, FiFileText, FiHelpCircle, FiAlertCircle } from 'react-icons/fi';

interface FAQ {
  question: string;
  answer: string;
}

const faqs: FAQ[] = [
  {
    question: "How does the progress tracking work?",
    answer: "Your progress is automatically saved as you complete practice tests. You can view detailed analytics including your average score, weak areas, and study streak. Data is synced across all your devices when you create an account."
  },
  {
    question: "Is my data secure and private?",
    answer: "Yes! Your data is stored securely in the cloud and is only accessible to you. We don't share your personal information with third parties. You can delete your account and all data at any time."
  },
  {
    question: "Can I use the app offline?",
    answer: "Yes, you can use the app offline for practice tests. Your progress will be saved locally and synced to the cloud when you're back online. However, some features like cloud sync require an internet connection."
  },
  {
    question: "How accurate is the mock exam?",
    answer: "The mock exam follows the same format and difficulty as the real Dutch driving theory exam with 25 questions and a 30-minute time limit. It covers all the same topics and question types you'll encounter on the actual test."
  },
  {
    question: "What if I lose my device or clear my browser?",
    answer: "If you've created an account, your progress is safely stored in the cloud and can be restored on any device. Simply log in with your name and all your data will be available. For anonymous users, data is stored locally and may be lost if the browser is cleared."
  }
];

export const Settings: React.FC = () => {
  const { user, logout, updateUserProfile } = useAuth();
  const { t_nested, currentLanguage, setLanguage } = useLanguage();
  const [activeTab, setActiveTab] = useState<'account' | 'privacy' | 'terms' | 'faq' | 'support'>('account');
  const [isEditing, setIsEditing] = useState(false);
  const [editUsername, setEditUsername] = useState(user?.username || '');
  const [supportSubject, setSupportSubject] = useState('');
  const [supportMessage, setSupportMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [sendSuccess, setSendSuccess] = useState(false);
  const [showMenu, setShowMenu] = useState(true);
  const [personalizedLearning, setPersonalizedLearning] = useState(true);

  useEffect(() => {
    // Load personalized learning preference
    const stored = localStorage.getItem('personalizedLearning');
    if (stored !== null) {
      setPersonalizedLearning(JSON.parse(stored));
    }
  }, []);

  const handlePersonalizedLearningToggle = () => {
    const newValue = !personalizedLearning;
    setPersonalizedLearning(newValue);
    localStorage.setItem('personalizedLearning', JSON.stringify(newValue));
  };

  const handleUpdateProfile = async () => {
    if (editUsername.trim() && editUsername !== user?.username) {
      try {
        await updateUserProfile({ username: editUsername.trim() });
        setIsEditing(false);
      } catch (error) {
        console.error('Error updating profile:', error);
      }
    }
  };

  const handleDeleteAccount = async () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently deleted.')) {
      try {
        // TODO: Implement account deletion
        logout();
      } catch (error) {
        console.error('Error deleting account:', error);
      }
    }
  };

  const handleSendSupportEmail = async () => {
    if (!supportSubject.trim() || !supportMessage.trim()) {
      alert('Please fill in both subject and message fields.');
      return;
    }

    setIsSending(true);
    try {
      const mailtoLink = `mailto:victory.ai@gmail.com?subject=${encodeURIComponent(supportSubject)}&body=${encodeURIComponent(`From: ${user?.email || user?.username || 'Unknown User'}\n\n${supportMessage}`)}`;
      window.open(mailtoLink);
      setSendSuccess(true);
      setSupportSubject('');
      setSupportMessage('');
      
      // Reset success message after 3 seconds
      setTimeout(() => setSendSuccess(false), 3000);
    } catch (error) {
      console.error('Error sending support email:', error);
      alert('Failed to open email client. Please send an email manually to victory.ai@gmail.com');
    } finally {
      setIsSending(false);
    }
  };

  /**
   * For the Account tab, render a right-aligned header with a back arrow and 'Settings', then 'Account' as the page name.
   * Remove the Settings title. Right-align all content. No hover effects.
   */
  const renderAccountTab = () => (
    <div className="account-page-simple">
      <div className="account-header-row account-header-flex">
        <button className="account-back-btn" onClick={() => setShowMenu(true)} style={{ border: 'none', background: 'none', color: '#002868', fontSize: '1.1rem', fontWeight: 700, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', boxShadow: 'none', outline: 'none', transition: 'none', minWidth: 110 }}>
          <span style={{ fontSize: '1.3rem', marginRight: 4, display: 'inline-block', lineHeight: 1 }}>&larr;</span> Settings
        </button>
        <span className="account-page-title" style={{ fontSize: '1.4rem', fontWeight: 900, color: '#002868', margin: '0 auto', textAlign: 'center', display: 'block', flex: 1 }}>Account</span>
        <div style={{ minWidth: 110 }} />
      </div>
      <div className="account-content-left">
        {/* Profile Information, Learning Preferences, Data Management, Danger Zone, etc. */}
        <div className="account-section" style={{ textAlign: 'left' }}>
        <h4>Profile Information</h4>
        <div className="profile-field">
            <label>Username</label>
          {isEditing ? (
            <div className="edit-field">
              <input
                type="text"
                  value={editUsername}
                  onChange={(e) => setEditUsername(e.target.value)}
                  placeholder="Enter your username"
                maxLength={50}
                  style={{ textAlign: 'left' }}
              />
              <div className="edit-actions">
                  <button onClick={handleUpdateProfile} className="save-btn" style={{ transition: 'none', boxShadow: 'none', outline: 'none' }}>Save</button>
                  <button onClick={() => setIsEditing(false)} className="cancel-btn" style={{ transition: 'none', boxShadow: 'none', outline: 'none' }}>Cancel</button>
                </div>
            </div>
          ) : (
            <div className="display-field">
                <span>{user?.username}</span>
                <button onClick={() => setIsEditing(true)} className="edit-btn" style={{ transition: 'none', boxShadow: 'none', outline: 'none' }}>Edit</button>
            </div>
          )}
        </div>
        <div className="profile-field">
          <label>Email</label>
          <div className="display-field">
            <span>{user?.email}</span>
            <span className="email-note">(Auto-generated for account sync)</span>
          </div>
        </div>
        <div className="profile-field">
          <label>Language</label>
          <div className="display-field">
            <select
                value={currentLanguage || ''}
              onChange={(e) => setLanguage(e.target.value as 'en' | 'nl' | 'ar')}
              className="language-select"
                style={{ textAlign: 'left' }}
            >
              <option value="en">English</option>
              <option value="nl">Nederlands</option>
              <option value="ar">العربية</option>
            </select>
          </div>
        </div>
        <div className="profile-field">
          <label>Account Status</label>
          <div className="display-field">
            <span className="premium-badge">🌟 Premium User</span>
          </div>
        </div>
      </div>
        <div className="settings-section" style={{ textAlign: 'left' }}>
          <h4>Learning Preferences</h4>
        <div className="setting-item">
          <div className="setting-info">
            <label>Personalized Practice</label>
            <p>Questions are tailored to your learning needs and weak areas</p>
          </div>
          <div className="setting-control">
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={personalizedLearning}
                onChange={handlePersonalizedLearningToggle}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>
        </div>
      </div>
        <div className="account-section" style={{ textAlign: 'left' }}>
        <h4>Data Management</h4>
        <div className="data-actions">
            <button className="action-btn secondary" style={{ transition: 'none', boxShadow: 'none', outline: 'none' }}>
            Export My Data
          </button>
            <button className="action-btn secondary" style={{ transition: 'none', boxShadow: 'none', outline: 'none' }}>
            Download Progress Report
          </button>
        </div>
      </div>
        <div className="account-section danger-zone" style={{ textAlign: 'left' }}>
        <h4>Danger Zone</h4>
        <p>These actions cannot be undone.</p>
          <button onClick={handleDeleteAccount} className="action-btn danger" style={{ transition: 'none', boxShadow: 'none', outline: 'none' }}>
          Delete Account & All Data
        </button>
      </div>
      </div>
    </div>
  );

  const renderPrivacyTab = () => (
    <div className="settings-tab-content">
      <div className="account-header-row account-header-flex">
        <button className="account-back-btn" onClick={() => setShowMenu(true)} style={{ border: 'none', background: 'none', color: '#002868', fontSize: '1.1rem', fontWeight: 700, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', boxShadow: 'none', outline: 'none', transition: 'none', minWidth: 110 }}>
          <span style={{ fontSize: '1.3rem', marginRight: 4, display: 'inline-block', lineHeight: 1 }}>&larr;</span> Settings
        </button>
        <span className="account-page-title" style={{ fontSize: '1.4rem', fontWeight: 900, color: '#002868', margin: '0 auto', textAlign: 'center', display: 'block', flex: 1 }}>Privacy Policy</span>
        <div style={{ minWidth: 110 }} />
      </div>
      <div className="settings-section">
      <div className="policy-content">
        <p><strong>Last updated:</strong> {new Date().toLocaleDateString()}</p>
          <div className="settings-section">
        <h4>Information We Collect</h4>
        <p>We collect only the information necessary to provide you with the best learning experience:</p>
        <ul>
          <li><strong>Account Information:</strong> Your name and language preference</li>
          <li><strong>Learning Data:</strong> Test results, progress, and study patterns</li>
          <li><strong>Usage Data:</strong> How you interact with the app to improve features</li>
        </ul>
          </div>
          <div className="settings-section">
        <h4>How We Use Your Information</h4>
        <ul>
          <li>To save and sync your learning progress across devices</li>
          <li>To provide personalized study recommendations</li>
          <li>To improve the app's features and user experience</li>
          <li>To analyze learning patterns and optimize content</li>
        </ul>
          </div>
          <div className="settings-section">
        <h4>Data Security</h4>
        <p>Your data is protected using industry-standard security measures:</p>
        <ul>
          <li>All data is encrypted in transit and at rest</li>
          <li>We use secure cloud infrastructure</li>
          <li>Regular security audits and updates</li>
          <li>No third-party access to your personal data</li>
        </ul>
          </div>
          <div className="settings-section">
        <h4>Your Rights</h4>
        <p>You have full control over your data:</p>
        <ul>
          <li>Access all your data at any time</li>
          <li>Export your data in a readable format</li>
          <li>Delete your account and all data permanently</li>
          <li>Use the app anonymously without creating an account</li>
        </ul>
          </div>
          <div className="settings-section">
        <h4>Contact Us</h4>
        <p>If you have any questions about this privacy policy, please contact us through the app or create an issue in our repository.</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTermsTab = () => (
    <div className="settings-tab-content">
      <div className="account-header-row account-header-flex">
        <button className="account-back-btn" onClick={() => setShowMenu(true)} style={{ border: 'none', background: 'none', color: '#002868', fontSize: '1.1rem', fontWeight: 700, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', boxShadow: 'none', outline: 'none', transition: 'none', minWidth: 110 }}>
          <span style={{ fontSize: '1.3rem', marginRight: 4, display: 'inline-block', lineHeight: 1 }}>&larr;</span> Settings
        </button>
        <span className="account-page-title" style={{ fontSize: '1.4rem', fontWeight: 900, color: '#002868', margin: '0 auto', textAlign: 'center', display: 'block', flex: 1 }}>Terms and Conditions</span>
        <div style={{ minWidth: 110 }} />
      </div>
      <div className="settings-section">
      <div className="policy-content">
        <p><strong>Last updated:</strong> {new Date().toLocaleDateString()}</p>
          <div className="settings-section">
        <h4>Acceptance of Terms</h4>
        <p>By using this Smart Dutch Driving Theory App, you agree to be bound by these terms and conditions.</p>
          </div>
          <div className="settings-section">
        <h4>Use of the App</h4>
        <ul>
          <li>This app is designed to help you learn Dutch driving theory</li>
          <li>While we strive for accuracy, we cannot guarantee exam success</li>
          <li>Use the app responsibly and in accordance with local laws</li>
          <li>Do not attempt to cheat or manipulate the learning system</li>
        </ul>
          </div>
          <div className="settings-section">
        <h4>User Responsibilities</h4>
        <ul>
          <li>Provide accurate information when creating an account</li>
          <li>Keep your account information secure</li>
          <li>Use the app for educational purposes only</li>
          <li>Respect the intellectual property rights of the content</li>
        </ul>
          </div>
          <div className="settings-section">
        <h4>Content and Accuracy</h4>
        <ul>
          <li>We regularly update content to match current Dutch driving theory standards</li>
          <li>While we strive for accuracy, official Dutch driving materials should be your primary reference</li>
          <li>We are not responsible for any discrepancies with official exam content</li>
          <li>Always verify information with official Dutch driving sources</li>
        </ul>
          </div>
          <div className="settings-section">
        <h4>Limitation of Liability</h4>
        <p>This app is provided "as is" without warranties. We are not liable for:</p>
        <ul>
          <li>Any damages resulting from use of the app</li>
          <li>Loss of data or progress due to technical issues</li>
          <li>Failure to pass the Dutch driving theory exam</li>
          <li>Any indirect or consequential damages</li>
        </ul>
          </div>
          <div className="settings-section">
        <h4>Changes to Terms</h4>
        <p>We may update these terms from time to time. Continued use of the app constitutes acceptance of any changes.</p>
          </div>
          <div className="settings-section">
        <h4>Governing Law</h4>
        <p>These terms are governed by the laws of the Netherlands, where Dutch driving theory exams are administered.</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderFAQTab = () => (
    <div className="settings-tab-content">
      <div className="account-header-row account-header-flex">
        <button className="account-back-btn" onClick={() => setShowMenu(true)} style={{ border: 'none', background: 'none', color: '#002868', fontSize: '1.1rem', fontWeight: 700, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', boxShadow: 'none', outline: 'none', transition: 'none', minWidth: 110 }}>
          <span style={{ fontSize: '1.3rem', marginRight: 4, display: 'inline-block', lineHeight: 1 }}>&larr;</span> Settings
        </button>
        <span className="account-page-title" style={{ fontSize: '1.4rem', fontWeight: 900, color: '#002868', margin: '0 auto', textAlign: 'center', display: 'block', flex: 1 }}>FAQ</span>
        <div style={{ minWidth: 110 }} />
      </div>
      <div className="settings-section">
      <div className="faq-content">
        {faqs.map((faq, index) => (
            <div key={index} className="settings-section">
            <h4 className="faq-question">{faq.question}</h4>
            <p className="faq-answer">{faq.answer}</p>
          </div>
        ))}
          <div className="settings-section">
          <h4>Still have questions?</h4>
          <p>If you can't find the answer you're looking for, please contact our support team.</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSupportTab = () => (
    <div className="settings-tab-content">
      <div className="account-header-row account-header-flex">
        <button className="account-back-btn" onClick={() => setShowMenu(true)} style={{ border: 'none', background: 'none', color: '#002868', fontSize: '1.1rem', fontWeight: 700, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', boxShadow: 'none', outline: 'none', transition: 'none', minWidth: 110 }}>
          <span style={{ fontSize: '1.3rem', marginRight: 4, display: 'inline-block', lineHeight: 1 }}>&larr;</span> Settings
        </button>
        <span className="account-page-title" style={{ fontSize: '1.4rem', fontWeight: 900, color: '#002868', margin: '0 auto', textAlign: 'center', display: 'block', flex: 1 }}>Support</span>
        <div style={{ minWidth: 110 }} />
      </div>
      <div className="settings-section">
      <div className="support-content">
          <div className="settings-section">
            <h4>Send us a message</h4>
        <div className="support-form">
          <div className="form-field">
            <label>From</label>
            <div className="sender-info">
                  <span>{user?.email || user?.username || 'Unknown User'}</span>
              <span className="sender-note">(Your email will be automatically included)</span>
            </div>
          </div>
          <div className="form-field">
            <label htmlFor="support-subject">Subject *</label>
            <input
              id="support-subject"
              type="text"
              value={supportSubject}
              onChange={(e) => setSupportSubject(e.target.value)}
              placeholder="Brief description of your issue or question"
              maxLength={100}
                  style={{ fontSize: '1.15rem', minHeight: 48, padding: '0.8rem 1.2rem', borderRadius: 10, border: '1.5px solid #e6eaf3', marginBottom: 8 }}
            />
          </div>
          <div className="form-field">
            <label htmlFor="support-message">Message *</label>
            <textarea
              id="support-message"
              value={supportMessage}
              onChange={(e) => setSupportMessage(e.target.value)}
              placeholder="Please describe your issue or question in detail. Include any relevant information such as your device type, browser, and steps to reproduce the issue."
              rows={8}
              maxLength={2000}
                  style={{ fontSize: '1.05rem', padding: '0.8rem 1.2rem', borderRadius: 10, border: '1.5px solid #e6eaf3', marginBottom: 8 }}
            />
            <div className="char-count">
              {supportMessage.length}/2000 characters
            </div>
          </div>
          {sendSuccess && (
            <div className="success-message">
              ✅ Your message has been sent! We'll get back to you soon.
            </div>
          )}
          <button 
            onClick={handleSendSupportEmail}
            disabled={isSending || !supportSubject.trim() || !supportMessage.trim()}
                className="send-support-btn pro-btn"
                style={{
                  background: '#002868',
                  color: '#fff',
                  fontWeight: 700,
                  fontSize: '1.1rem',
                  borderRadius: 12,
                  padding: '1rem 2.2rem',
                  boxShadow: '0 2px 8px rgba(0,40,104,0.10)',
                  border: 'none',
                  marginTop: 12,
                  cursor: 'pointer',
                  transition: 'background 0.2s, box-shadow 0.2s',
                  minHeight: 48,
                }}
          >
            {isSending ? 'Sending...' : 'Send Message'}
          </button>
        </div>
          </div>
          <div className="settings-section">
          <h4>Other ways to get help</h4>
            <ul style={{ paddingLeft: 0, listStyle: 'none', fontSize: '1rem', color: '#002868', fontWeight: 600 }}>
              <li>Check our <span style={{ textDecoration: 'underline', cursor: 'pointer', color: '#002868' }} onClick={() => setActiveTab('faq')}>FAQ section</span> for common questions</li>
              <li>Review our <span style={{ textDecoration: 'underline', cursor: 'pointer', color: '#002868' }} onClick={() => setActiveTab('privacy')}>Privacy Policy</span> and <span style={{ textDecoration: 'underline', cursor: 'pointer', color: '#002868' }} onClick={() => setActiveTab('terms')}>Terms & Conditions</span></li>
            <li>Make sure you're using the latest version of the app</li>
          </ul>
          </div>
        </div>
      </div>
    </div>
  );

  // Main menu list
  const mainMenu = [
    { key: 'account', label: 'Account', icon: <FiUser /> },
    { key: 'privacy', label: 'Privacy Policy', icon: <FiLock /> },
    { key: 'terms', label: 'Terms & Conditions', icon: <FiFileText /> },
    { key: 'faq', label: 'FAQ', icon: <FiHelpCircle /> },
    { key: 'support', label: 'Support', icon: <FiAlertCircle /> },
  ];

  // Notify parent for conditional scrolling
  useEffect(() => {
    const event = new CustomEvent('settings-scroll', { detail: { settingsScroll: !showMenu } });
    window.dispatchEvent(event);
  }, [showMenu]);

  return (
    <div className="settings-container">
      <div style={{ height: '3rem' }} />
      {showMenu ? (
        <>
      <div className="settings-header">
        <h2>Settings</h2>
      </div>
          <div className="settings-main-menu">
              {mainMenu.map(item => (
              <div className="settings-btn-wrapper" key={item.key}>
                <button
                  className="settings-main-menu-btn"
                  style={{
                    background: '#002868',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '12px',
                    padding: '1.2rem 1.5rem',
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    boxShadow: '0 2px 8px rgba(0, 40, 104, 0.15)',
                    minHeight: '60px',
                    width: '95%',
                    minWidth: '220px',
                    maxWidth: '570px',
                    margin: '0 auto',
                    fontFamily: 'inherit',
                    transition: 'none',
                  }}
                  onClick={() => { setActiveTab(item.key as any); setShowMenu(false); }}
                >
                  <span className="settings-icon">{item.icon}</span>
                  <span className="settings-label">{item.label}</span>
                  <span className="settings-arrow">&gt;</span>
                </button>
              </div>
              ))}
          </div>
        </>
      ) : (
        activeTab === 'account' ? (
          renderAccountTab()
        ) : (
          <>
            {activeTab === 'privacy' && renderPrivacyTab()}
            {activeTab === 'terms' && renderTermsTab()}
            {activeTab === 'faq' && renderFAQTab()}
            {activeTab === 'support' && renderSupportTab()}
          </>
        )
        )}
    </div>
  );
}; 