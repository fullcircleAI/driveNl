import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { 
  FiZap, FiHelpCircle, FiEye, FiAlertOctagon, FiCheckCircle, FiAlertTriangle, 
  FiActivity, FiInfo, FiTag, FiFlag, FiTrendingUp, FiMap, FiShield, FiTruck, 
  FiBox, FiSquare, FiDroplet, FiCpu, FiClock, FiFileText, FiPhone 
} from 'react-icons/fi';
import './Practice.css';

// Lazy load test components for better performance
const LazyTestButton = React.lazy(() => import('./LazyTestButton'));

export function Practice() {
  const { user } = useAuth();
  const { t_nested, currentLanguage } = useLanguage();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [hoveredTest, setHoveredTest] = useState<string | null>(null);

  // Memoized tooltip messages for better performance
  const tooltipMessages = useMemo(() => ({
    'insight-practice': 'Practice understanding traffic scenarios and making decisions',
    'hazard-perception': 'Learn to recognize dangerous situations on the road',
    'prohibitory-signs': 'Master signs that prohibit certain actions',
    'mandatory-signs': 'Understand signs that require specific actions',
    'warning-signs': 'Learn to recognize warning signs',
    'prohibitory-signs-2': 'Advanced prohibitory signs practice',
    'traffic-lights-signals': 'Master traffic light rules and signals',
    'road-information': 'Learn about road markings and information signs',
    'sign-identification': 'Practice identifying different types of signs',
    'priority-rules': 'Understand right of way and priority rules',
    'mandatory-signs-2': 'Advanced mandatory signs practice',
    'speed-limits': 'Learn speed limit rules and regulations',
    'road-markings': 'Understand road markings and their meanings',
    'expanded-priority-rules': 'Advanced priority and right of way rules',
    'motorway-rules': 'Specific rules for motorway driving',
    'vehicle-categories': 'Different vehicle types and their rules',
    'parking-rules': 'Parking regulations and restrictions',
    'environmental-zones': 'Environmental zones and restrictions',
    'technology-safety': 'Modern vehicle technology and safety features',
    'alcohol-drugs': 'Alcohol and drug regulations for drivers',
    'fatigue-rest': 'Driver fatigue and rest requirements',
    'vehicle-documentation': 'Required vehicle documentation',
    'emergency-procedures': 'Emergency procedures and protocols'
  }), []);

  const toTitleCase = useCallback((str: string) =>
    str.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.slice(1).toLowerCase()), []);

  // Memoized tests array for better performance
  const tests = useMemo(() => [
    { label: 'Insight Practice', icon: <FiHelpCircle />, route: 'insight-practice', importance: 2 },
    { label: 'Hazard Perception', icon: <FiEye />, route: 'hazard-perception', importance: 3 },
    { label: 'Prohibitory Signs', icon: <FiAlertOctagon />, route: 'prohibitory-signs', importance: 2 },
    { label: 'Mandatory Signs', icon: <FiCheckCircle />, route: 'mandatory-signs', importance: 2 },
    { label: 'Warning Signs', icon: <FiAlertTriangle />, route: 'warning-signs', importance: 2 },
    { label: 'Prohibitory Signs 2', icon: <FiAlertOctagon />, route: 'prohibitory-signs-2', importance: 1 },
    { label: 'Traffic Lights & Signals', icon: <FiActivity />, route: 'traffic-lights-signals', importance: 2 },
    { label: 'Road Information', icon: <FiInfo />, route: 'road-information', importance: 1 },
    { label: 'Sign Identification', icon: <FiTag />, route: 'sign-identification', importance: 1 },
    { label: 'Priority Rules', icon: <FiFlag />, route: 'priority-rules', importance: 2 },
    { label: 'Mandatory Signs 2', icon: <FiCheckCircle />, route: 'mandatory-signs-2', importance: 1 },
    // Phase 1: Core Content
    { label: 'Speed Limits', icon: <FiTrendingUp />, route: 'speed-limits', importance: 2 },
    { label: 'Road Markings', icon: <FiMap />, route: 'road-markings', importance: 2 },
    { label: 'Expanded Priority Rules', icon: <FiShield />, route: 'expanded-priority-rules', importance: 2 },
    // Phase 2: Advanced Topics
    { label: 'Motorway Rules', icon: <FiTruck />, route: 'motorway-rules', importance: 2 },
    { label: 'Vehicle Categories', icon: <FiBox />, route: 'vehicle-categories', importance: 1 },
    { label: 'Parking Rules', icon: <FiSquare />, route: 'parking-rules', importance: 2 },
    // Phase 3: Modern Topics
    { label: 'Environmental Zones', icon: <FiDroplet />, route: 'environmental-zones', importance: 1 },
    { label: 'Technology & Safety', icon: <FiCpu />, route: 'technology-safety', importance: 1 },
    // Critical CBR Content
    { label: 'Alcohol & Drugs', icon: <FiAlertTriangle />, route: 'alcohol-drugs', importance: 3 },
    { label: 'Fatigue & Rest', icon: <FiClock />, route: 'fatigue-rest', importance: 3 },
    { label: 'Vehicle Documentation', icon: <FiFileText />, route: 'vehicle-documentation', importance: 2 },
    { label: 'Emergency Procedures', icon: <FiPhone />, route: 'emergency-procedures', importance: 3 },
  ], []);

  // Memoized importance colors for better performance
  const getImportanceColor = useCallback((importance: number) => {
    switch (importance) {
      case 3: return '#e74c3c'; // Critical - Red
      case 2: return '#f39c12'; // Important - Orange
      case 1: return '#27ae60'; // Basic - Green
      default: return '#95a5a6'; // Default - Gray
    }
  }, []);

  const handleTestClick = useCallback(async (route: string) => {
    setIsLoading(true);
    try {
      // Add a small delay for better UX feedback
      await new Promise(resolve => setTimeout(resolve, 150));
      navigate(`/practice/${route}`);
    } catch (error) {
      console.error('Navigation error:', error);
    } finally {
      setIsLoading(false);
    }
  }, [navigate]);

  const handleTestHover = useCallback((route: string | null) => {
    setHoveredTest(route);
  }, []);

  return (
    <div className="practice-page">
      <div className="practice-header">
        <h1 className="practice-title">{t_nested('practice.title')}</h1>
      </div>

      <div className="practice-content">
        <div className="practice-grid">
          {tests.map((test) => (
            <React.Suspense key={test.route} fallback={<div className="test-button-skeleton" />}>
              <LazyTestButton
                test={test}
                importanceColor={getImportanceColor(test.importance)}
                tooltipMessage={tooltipMessages[test.route as keyof typeof tooltipMessages]}
                isHovered={hoveredTest === test.route}
                isLoading={isLoading}
                onHover={handleTestHover}
                onClick={handleTestClick}
              />
            </React.Suspense>
          ))}
        </div>
      </div>

      {isLoading && (
        <div className="practice-loading-overlay">
          <div className="practice-loading-spinner" />
          <p>Loading...</p>
        </div>
      )}
    </div>
  );
} 