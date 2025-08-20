import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useParams, useNavigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';
import { Dashboard } from './components/Dashboard';
import { Practice } from './components/Practice';
import { PracticeResult } from './components/PracticeResult';
import { LanguageSelection } from './components/LanguageSelection';
import { Navigation } from './components/Navigation';
import { PracticeTest } from './components/PracticeTest';
import './App.css';
// import { ClerkProvider } from '@clerk/clerk-react';
import { PremiumUpgrade } from './components/PremiumUpgrade';
import { MockExamPage } from './components/MockExamPage';
import { Settings } from './components/Settings';
import React, { useRef } from 'react';
import { QuizSelectionPage } from './components/QuizSelectionPage';
import { EnhancedQuizPage } from './components/EnhancedQuizPage';

// Import all question data
import { hazardPerceptionQuestions } from './question_data/hazardPerceptionQuestions';
import { insightPracticeQuestions } from './question_data/insightPracticeQuestions';
import { mandatorySignQuestions } from './question_data/mandatorySignsQuestions';
import { warningSignsQuestions } from './question_data/warningSignsQuestions';
import { prohibitorySignsQuestions } from './question_data/prohibitorySignsQuestions';
import { prohibitorySigns2Questions } from './question_data/prohibitorySigns2Questions';
import { trafficLightsSignalsQuestions } from './question_data/trafficLightsSignalsQuestions';
import { roadInformationQuestions } from './question_data/roadInformationQuestions';
import { signIdentificationQuestions } from './question_data/signIdentificationQuestions';
import { priorityRulesQuestions } from './question_data/priorityRulesQuestions';
import { mandatorySigns2Questions } from './question_data/mandatorySigns2Questions';
// New Phase 1 question sets
import { speedLimitQuestions } from './question_data/speedLimitQuestions';
import { roadMarkingsQuestions } from './question_data/roadMarkingsQuestions';
import { expandedPriorityRulesQuestions } from './question_data/expandedPriorityRulesQuestions';
// New Phase 2 question sets
import { motorwayRulesQuestions } from './question_data/motorwayRulesQuestions';
import { vehicleCategoriesQuestions } from './question_data/vehicleCategoriesQuestions';
import { parkingRulesQuestions } from './question_data/parkingRulesQuestions';
// New Phase 3 question sets
import { environmentalZonesQuestions } from './question_data/environmentalZonesQuestions';
import { technologySafetyQuestions } from './question_data/technologySafetyQuestions';
// Critical CBR Content
import { alcoholDrugsQuestions } from './question_data/alcoholDrugsQuestions';
import { fatigueRestQuestions } from './question_data/fatigueRestQuestions';
import { vehicleDocumentationQuestions } from './question_data/vehicleDocumentationQuestions';
import { emergencyProceduresQuestions } from './question_data/emergencyProceduresQuestions';

// Question data mapping
const questionDataMap: { [key: string]: any } = {
  'hazard-perception': hazardPerceptionQuestions,
  'insight-practice': insightPracticeQuestions,
  'mandatory-signs': mandatorySignQuestions,
  'warning-signs': warningSignsQuestions,
  'prohibitory-signs': prohibitorySignsQuestions,
  'prohibitory-signs-2': prohibitorySigns2Questions,
  'traffic-lights-signals': trafficLightsSignalsQuestions,
  'road-information': roadInformationQuestions,
  'sign-identification': signIdentificationQuestions,
  'priority-rules': priorityRulesQuestions,
  'mandatory-signs-2': mandatorySigns2Questions,
  // New Phase 1 question sets
  'speed-limits': speedLimitQuestions,
  'road-markings': roadMarkingsQuestions,
  'expanded-priority-rules': expandedPriorityRulesQuestions,
  // New Phase 2 question sets
  'motorway-rules': motorwayRulesQuestions,
  'vehicle-categories': vehicleCategoriesQuestions,
  'parking-rules': parkingRulesQuestions,
  // New Phase 3 question sets
  'environmental-zones': environmentalZonesQuestions,
  'technology-safety': technologySafetyQuestions,
  // Critical CBR Content
  'alcohol-drugs': alcoholDrugsQuestions,
  'fatigue-rest': fatigueRestQuestions,
  'vehicle-documentation': vehicleDocumentationQuestions,
  'emergency-procedures': emergencyProceduresQuestions,
};

// Test name mapping
const testNameMap: { [key: string]: string } = {
  'hazard-perception': 'Hazard Perception',
  'insight-practice': 'Insight Practice',
  'mandatory-signs': 'Mandatory Signs',
  'warning-signs': 'Warning Signs',
  'prohibitory-signs': 'Prohibitory Signs',
  'prohibitory-signs-2': 'Prohibitory Signs 2',
  'traffic-lights-signals': 'Traffic Lights & Signals',
  'road-information': 'Road Information',
  'sign-identification': 'Sign Identification',
  'priority-rules': 'Priority Rules',
  'mandatory-signs-2': 'Mandatory Signs 2',
  // New Phase 1 question sets
  'speed-limits': 'Speed Limits',
  'road-markings': 'Road Markings',
  'expanded-priority-rules': 'Expanded Priority Rules',
  // New Phase 2 question sets
  'motorway-rules': 'Motorway Rules',
  'vehicle-categories': 'Vehicle Categories',
  'parking-rules': 'Parking Rules',
  // New Phase 3 question sets
  'environmental-zones': 'Environmental Zones',
  'technology-safety': 'Technology & Safety',
  // Critical CBR Content
  'alcohol-drugs': 'Alcohol & Drugs',
  'fatigue-rest': 'Fatigue & Rest',
  'vehicle-documentation': 'Vehicle Documentation',
  'emergency-procedures': 'Emergency Procedures',
};

function TestLoader() {
  const { test } = useParams<{ test: string }>();
  
  if (!test || !questionDataMap[test]) {
    return <div style={{padding: '2rem', textAlign: 'center'}}>Test not found</div>;
  }

  const questions = questionDataMap[test];
  const testName = testNameMap[test];

  return <PracticeTest questions={questions} testKey={test} testName={testName} />;
}

function AppRoutes() {
  const { user, loading } = useAuth();
  const { currentLanguage } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const mainContentRef = useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    const handler = (e: any) => {
      if (mainContentRef.current) {
        if (e.detail.settingsScroll) {
          mainContentRef.current.classList.add('settings-scroll');
        } else {
          mainContentRef.current.classList.remove('settings-scroll');
        }
      }
    };
    window.addEventListener('settings-scroll', handler);
    return () => window.removeEventListener('settings-scroll', handler);
  }, []);

  // Debug logging
  console.log('AppRoutes: loading =', loading);
  console.log('AppRoutes: user =', user);
  console.log('AppRoutes: currentLanguage =', currentLanguage);

  // Set language attribute on HTML element for RTL support
  useEffect(() => {
    if (currentLanguage) {
      document.documentElement.lang = currentLanguage;
      document.documentElement.dir = currentLanguage === 'ar' ? 'rtl' : 'ltr';
    }
  }, [currentLanguage]);

  if (loading) {
    console.log('AppRoutes: Showing loading screen');
    return <div className="loading">Loading...</div>;
  }

  // If user has no language preference, show language selection
  if (!currentLanguage) {
    console.log('AppRoutes: No language set, showing language selection page');
    return <LanguageSelection />;
  }

  const isDashboard = location.pathname === '/dashboard';

  console.log('AppRoutes: Rendering main app layout');
  return (
    <div className="main-layout">
      <Navigation />
      <div ref={mainContentRef} className={`main-content${isDashboard ? ' dashboard-active' : ''}`}>
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/practice" element={<div className="scrollable-content"><Practice /></div>} />

          <Route path="/practice/:test" element={<div className="scrollable-content"><TestLoader /></div>} />
          <Route path="/practice/results/:test/:score/:total" element={<div className="scrollable-content"><PracticeResult /></div>} />
          <Route path="/premium" element={<div className="scrollable-content"><PremiumUpgrade /></div>} />
          <Route path="/mock-exam" element={<div className="scrollable-content"><MockExamPage /></div>} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/language-selection" element={<div className="scrollable-content"><LanguageSelection /></div>} />
          <Route path="/quiz-selection" element={<div className="scrollable-content"><QuizSelectionPage /></div>} />
          <Route path="/quiz/:quizId" element={<div className="scrollable-content"><EnhancedQuizPage /></div>} />
          <Route path="*" element={<Navigate to="/dashboard" />} />
        </Routes>
      </div>
    </div>
  );
}

// Error Boundary Component
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ 
          padding: '2rem', 
          textAlign: 'center', 
          color: '#721c24',
          backgroundColor: '#f8d7da',
          border: '1px solid #f5c6cb',
          borderRadius: '8px',
          margin: '2rem'
        }}>
          <h2>Something went wrong</h2>
          <p>Please refresh the page to try again.</p>
          <button 
            onClick={() => window.location.reload()}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#721c24',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Refresh Page
          </button>
          <details style={{ marginTop: '1rem', textAlign: 'left' }}>
            <summary>Error Details</summary>
            <pre style={{ fontSize: '0.8rem', overflow: 'auto' }}>
              {this.state.error?.toString()}
            </pre>
          </details>
        </div>
      );
    }

    return this.props.children;
  }
}

function App() {
  console.log('App: Rendering main App component');
  
  return (
    <ErrorBoundary>
      <Router>
        <LanguageProvider>
          <AuthProvider>
            <AppRoutes />
          </AuthProvider>
        </LanguageProvider>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
