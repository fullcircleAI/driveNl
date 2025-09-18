import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { Mascot } from './Mascot';
import { SimpleLogin } from './SimpleLogin';
import { Navigation } from './Navigation';
import { StreakCounter, useStreak } from './StreakCounter';
import { studyScheduler } from '../services/studyScheduler';
import type { StudyTracker, StudyProgress, PracticeSession } from '../services/studyScheduler';

import './Dashboard.css';
import './Mascot.css';

export const Dashboard: React.FC = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const { recordStudySession } = useStreak();
  // No initialization screen - instant access for competition


  const [tracker, setTracker] = useState<StudyTracker | null>(null);
  const [progress, setProgress] = useState<StudyProgress | null>(null);
  const [isStudyActive, setIsStudyActive] = useState(false);
  const [incompleteSession, setIncompleteSession] = useState<PracticeSession | null>(null);

  const handleStartStudy = () => {
    // Record study session for streak tracking
    recordStudySession();
    
    // Use smart coach recommendation instead of hardcoded logic
    const recommendation = studyScheduler.getCoachRecommendation();
    const nextTopic = recommendation.nextTopic;
    
    const topicRouteMap: Record<string, string> = {
      "Traffic Signs": "traffic-rules-signs",
      "Priority Rules": "priority-rules", 
      "Hazard Perception": "hazard-perception",
      "Speed & Safety": "speed-safety",
      "Road Signs": "road-signs",
      "Motorway Rules": "motorway-rules",
      "Vehicle Knowledge": "vehicle-knowledge",
      "Parking Rules": "parking-rules",
      "Environmental Zones": "environmental",
      "Technology & Safety": "technology-safety",
      "Alcohol & Drugs": "alcohol-drugs",
      "Fatigue & Rest": "fatigue-rest",
      "Emergency Procedures": "emergency-procedures",
      "Insight Practice": "insight-practice",
      "Bicycle Interactions": "bicycle-interactions",
      "Roundabout Rules": "roundabout-rules",
      "Tram Interactions": "tram-interactions",
      "Pedestrian Crossings": "pedestrian-crossings",
      "Construction Zones": "construction-zones",
      "Weather Conditions": "weather-conditions"
    };
    const topicRoute = topicRouteMap[nextTopic] || nextTopic.toLowerCase().replace(/\s+/g, '-');
    navigate(`/practice/${topicRoute}`);
    
    setTimeout(() => {
      studyScheduler.startStudy();
      updateData();
    }, 0);
  };

  const handleResumeStudy = () => {
    if (incompleteSession) {
      // Record study session for streak tracking
      recordStudySession();
      
      const topicRouteMap: Record<string, string> = {
        "Traffic Signs": "traffic-rules-signs",
        "Priority Rules": "priority-rules", 
        "Hazard Perception": "hazard-perception",
        "Speed & Safety": "speed-safety",
        "Road Signs": "road-signs",
        "Motorway Rules": "motorway-rules",
        "Vehicle Knowledge": "vehicle-knowledge",
        "Parking Rules": "parking-rules",
        "Environmental Zones": "environmental",
        "Technology & Safety": "technology-safety",
        "Alcohol & Drugs": "alcohol-drugs",
        "Fatigue & Rest": "fatigue-rest",
        "Emergency Procedures": "emergency-procedures",
        "Insight Practice": "insight-practice",
        "Bicycle Interactions": "bicycle-interactions",
        "Roundabout Rules": "roundabout-rules",
        "Tram Interactions": "tram-interactions",
        "Pedestrian Crossings": "pedestrian-crossings",
        "Construction Zones": "construction-zones",
        "Weather Conditions": "weather-conditions"
      };
      const topicRoute = topicRouteMap[incompleteSession.topic] || incompleteSession.topic.toLowerCase().replace(/\s+/g, '-');
      navigate(`/practice/${topicRoute}?resume=${incompleteSession.sessionId}`);
    }
  };

  const handleContinueStudy = () => {
    // Record study session for streak tracking
    recordStudySession();
    navigate('/practice');
  };

  const updateData = () => {
    const trackerData = studyScheduler.getTracker();
    const progressData = studyScheduler.getProgress();
    const incompleteSessionData = studyScheduler.getIncompleteSession();
    
    setTracker(trackerData);
    setProgress(progressData);
    setIncompleteSession(incompleteSessionData);
    
    if (trackerData.totalStudyTime > 0 || progressData.percentage > 0 || incompleteSessionData) {
      setIsStudyActive(true);
    }
  };

  useEffect(() => {
    useAuthStore.persist.rehydrate();
    
    const timer = setTimeout(() => {
      loadData();
    }, 100);
    
    return () => {
      clearTimeout(timer);
    };
  }, []);

  const loadData = async () => {
    try {
      await studyScheduler.initialize();
      updateData();
    } catch (error) {
      // Error loading data
    }
  };

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  // No loading screen - instant access for competition

  if (!user) {
    return <SimpleLogin />;
  }

  return (
    <div className="main-layout">
      <Navigation />
      <main className="main-content">
        <div className="dashboard">
          <div className="dashboard-header">
            <div className="dashboard-welcome">
              <div className="welcome-mascot">
                <Mascot size={80} />
              </div>
              <StreakCounter />
            </div>
          </div>
          <div className="dashboard-content">
            <div className="progress-tracker">
              {tracker && (
                <div className="progress-stats">
                  <div className="progress-stat">
                    <div className="stat-number">{formatTime(tracker.totalStudyTime)}</div>
                    <div className="stat-label">Time Studied</div>
                    <div className="progress-indicator">
                      <div className="progress-bar-bg">
                        <div className="progress-bar-fill" style={{ width: `${Math.min((tracker.totalStudyTime / 480) * 100, 100)}%` }}></div>
                      </div>
                    </div>
                  </div>
                  <div className="progress-stat">
                    <div className="stat-number">{formatTime(tracker.remainingTime)}</div>
                    <div className="stat-label">Time Remaining</div>
                    <div className="progress-indicator">
                      <div className="progress-bar-bg">
                        <div className="progress-bar-fill remaining" style={{ width: `${Math.max(100 - (tracker.totalStudyTime / 480) * 100, 0)}%` }}></div>
                      </div>
                    </div>
                  </div>
                  <div className="progress-stat">
                    <div className="stat-number">{progress?.percentage || 0}%</div>
                    <div className="stat-label">Prep Progress</div>
                    <div className="progress-indicator">
                      <div className="progress-bar-bg">
                        <div className="progress-bar-fill main" style={{ width: `${progress?.percentage || 0}%` }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}


              {!incompleteSession && (
                <div className="progress-details">
                  <div className="weak-areas">
                    Next Topic: <strong>{studyScheduler.getCoachRecommendation().nextTopic}</strong> {studyScheduler.getTopicTimeEstimate(studyScheduler.getCoachRecommendation().nextTopic)}
                  </div>
                </div>
              )}

              {incompleteSession && (
                <div className="progress-details">
                  <div className="weak-areas">
                    Resume: <strong>{incompleteSession.topic}</strong> {studyScheduler.getTopicTimeEstimate(incompleteSession.topic)}
                    <br />
                    <small>({incompleteSession.questionsAnswered}/{incompleteSession.totalQuestions} completed)</small>
                  </div>
                </div>
              )}
              <div className="progress-actions">
                <button 
                  className="action-button primary"
                  onClick={incompleteSession ? handleResumeStudy : (isStudyActive ? handleContinueStudy : handleStartStudy)}
                >
                  {incompleteSession 
                    ? "Resume"
                    : (isStudyActive ? "Continue" : "Start")
                  }
                </button>
                <button 
                  className="action-button secondary"
                  onClick={() => navigate('/practice')}
                >
                  Practice
                </button>
                <button 
                  className="action-button secondary"
                  onClick={() => navigate('/mock-exam')}
                >
                  Mock Exam
                </button>
              </div>

              {isStudyActive && (
                <div className="progress-notice">
                  <p>{studyScheduler.getCompletionStatus()}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}; 