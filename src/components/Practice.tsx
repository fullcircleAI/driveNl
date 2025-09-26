import { useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { Navigation } from './Navigation';
import { 
  FiEye, FiActivity, FiFlag, FiShield, FiRotateCcw, FiTruck, FiUsers, FiCloud, FiTool
} from 'react-icons/fi';
import './Practice.css';

import LazyTestButton from './LazyTestButton';

export function Practice() {
  useAuthStore();
  const navigate = useNavigate();
  const [hoveredTest, setHoveredTest] = useState<string | null>(null);

  const tooltipMessages = useMemo(() => ({
    'traffic-rules-signs': 'Master Dutch traffic rules, signs, and regulations',
    'priority-rules': 'Understand right of way and priority rules',
    'hazard-perception': 'Learn to recognize dangerous situations on the road',
    'speed-safety': 'Speed limits, safety rules, and vehicle regulations',
    'bicycle-interactions': 'Learn to safely interact with cyclists on the road',
    'roundabout-rules': 'Master roundabout navigation and priority rules',
    'tram-interactions': 'Understand how to safely interact with trams',
    'pedestrian-crossings': 'Learn pedestrian crossing rules and safety',
    'construction-zones': 'Navigate construction zones safely',
    'weather-conditions': 'Drive safely in various weather conditions',
    'road-signs': 'Advanced road signs and identification practice',
    'motorway-rules': 'Specific rules for motorway driving',
    'vehicle-knowledge': 'Vehicle categories and documentation requirements',
    'parking-rules': 'Parking regulations and restrictions',
    'environmental': 'Environmental zones and restrictions',
    'technology-safety': 'Modern vehicle technology and safety features',
    'alcohol-drugs': 'Alcohol and drug regulations for drivers',
    'fatigue-rest': 'Driver fatigue and rest requirements',
    'emergency-procedures': 'Emergency procedures and protocols',
    'insight-practice': 'Practice understanding traffic scenarios and making decisions'
  }), []);

  const tests = useMemo(() => [
    { 
      label: 'Traffic Rules & Signs', 
      icon: <FiActivity />, 
      route: 'traffic-rules-signs', 
      importance: 3,
      description: 'Master Dutch traffic rules, signs, and regulations'
    },
    { 
      label: 'Priority & Right of Way', 
      icon: <FiFlag />, 
      route: 'priority-rules', 
      importance: 3,
      description: 'Understand priority rules and right of way situations'
    },
    { 
      label: 'Hazard Perception', 
      icon: <FiEye />, 
      route: 'hazard-perception', 
      importance: 3,
      description: 'Learn to recognize and respond to dangerous situations'
    },
    { 
      label: 'Speed & Safety', 
      icon: <FiShield />, 
      route: 'speed-safety', 
      importance: 2,
      description: 'Speed limits, safety rules, and vehicle regulations'
    },
    { 
      label: 'Bicycle Interactions', 
      icon: <FiActivity />, 
      route: 'bicycle-interactions', 
      importance: 3,
      description: 'Learn to safely interact with cyclists on the road'
    },
    { 
      label: 'Roundabout Rules', 
      icon: <FiRotateCcw />, 
      route: 'roundabout-rules', 
      importance: 3,
      description: 'Master roundabout navigation and priority rules'
    },
    { 
      label: 'Tram Interactions', 
      icon: <FiTruck />, 
      route: 'tram-interactions', 
      importance: 2,
      description: 'Understand how to safely interact with trams'
    },
    { 
      label: 'Pedestrian Crossings', 
      icon: <FiUsers />, 
      route: 'pedestrian-crossings', 
      importance: 2,
      description: 'Learn pedestrian crossing rules and safety'
    },
    { 
      label: 'Construction Zones', 
      icon: <FiTool />, 
      route: 'construction-zones', 
      importance: 2,
      description: 'Navigate construction zones safely'
    },
    { 
      label: 'Weather Conditions', 
      icon: <FiCloud />, 
      route: 'weather-conditions', 
      importance: 1,
      description: 'Drive safely in various weather conditions'
    },
    { 
      label: 'Road Signs', 
      icon: <FiActivity />, 
      route: 'road-signs', 
      importance: 2,
      description: 'Advanced road signs and identification'
    },
    { 
      label: 'Motorway Rules', 
      icon: <FiTruck />, 
      route: 'motorway-rules', 
      importance: 2,
      description: 'Specific rules for motorway driving'
    },
    { 
      label: 'Vehicle Knowledge', 
      icon: <FiShield />, 
      route: 'vehicle-knowledge', 
      importance: 2,
      description: 'Vehicle categories and documentation'
    },
    { 
      label: 'Parking Rules', 
      icon: <FiFlag />, 
      route: 'parking-rules', 
      importance: 2,
      description: 'Parking regulations and restrictions'
    },
    { 
      label: 'Environmental Zones', 
      icon: <FiCloud />, 
      route: 'environmental', 
      importance: 1,
      description: 'Environmental zones and restrictions'
    },
    { 
      label: 'Technology & Safety', 
      icon: <FiShield />, 
      route: 'technology-safety', 
      importance: 1,
      description: 'Modern vehicle technology and safety features'
    },
    { 
      label: 'Alcohol & Drugs', 
      icon: <FiActivity />, 
      route: 'alcohol-drugs', 
      importance: 3,
      description: 'Alcohol and drug regulations for drivers'
    },
    { 
      label: 'Fatigue & Rest', 
      icon: <FiUsers />, 
      route: 'fatigue-rest', 
      importance: 2,
      description: 'Driver fatigue and rest requirements'
    },
    { 
      label: 'Emergency Procedures', 
      icon: <FiShield />, 
      route: 'emergency-procedures', 
      importance: 3,
      description: 'Emergency procedures and protocols'
    },
    { 
      label: 'Insight Practice', 
      icon: <FiEye />, 
      route: 'insight-practice', 
      importance: 2,
      description: 'Practice understanding traffic scenarios'
    }
  ], []);

  const getImportanceColor = useCallback((importance: number) => {
    switch (importance) {
      case 3: return '#e74c3c';
      case 2: return '#f39c12';
      case 1: return '#27ae60';
      default: return '#95a5a6';
    }
  }, []);

  const handleTestClick = useCallback((route: string) => {
    navigate(`/practice/${route}`);
  }, [navigate]);

  const handleTestHover = useCallback((route: string | null) => {
    setHoveredTest(route);
  }, []);

  return (
    <div className="main-layout practice-layout">
      <Navigation />
      <main className="main-content practice-main-content">
        <div className="practice-page">
          <div style={{ height: '3rem' }} />
          <div className="practice-header">
            <h1 className="practice-title">Practice</h1>
          </div>

      <div className="practice-content">
        <div className="practice-grid">
          {tests.map((test) => (
            <LazyTestButton
              key={test.route}
              test={test}
              importanceColor={getImportanceColor(test.importance)}
              tooltipMessage={tooltipMessages[test.route as keyof typeof tooltipMessages]}
              isHovered={hoveredTest === test.route}
              isLoading={false}
              onHover={handleTestHover}
              onClick={handleTestClick}
            />
          ))}
        </div>
      </div>

        </div>
      </main>
    </div>
  );
} 