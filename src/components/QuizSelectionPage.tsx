import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navigation } from './Navigation';
import { FiAward, FiTrendingUp, FiZap, FiLock, FiCheckCircle } from 'react-icons/fi';
import './QuizSelectionPage.css';

interface QuizLevel {
  id: string;
  title: string;
  subtitle: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  description: string;
  timeLimit: number;
  questions: number;
  passRate: string;
  icon: React.ReactNode;
  color: string;
  requiredScore: number;
}

export const QuizSelectionPage: React.FC = () => {
  const navigate = useNavigate();
  const isPremium = true; // All users get full access
  const [userProgress, setUserProgress] = useState<{
    beginner: { passed: boolean; bestScore: number; attempts: number };
    intermediate: { passed: boolean; bestScore: number; attempts: number };
    advanced: { passed: boolean; bestScore: number; attempts: number };
  }>({
    beginner: { passed: false, bestScore: 0, attempts: 0 },
    intermediate: { passed: false, bestScore: 0, attempts: 0 },
    advanced: { passed: false, bestScore: 0, attempts: 0 }
  });
  const [hasCompletedPractice, setHasCompletedPractice] = useState(false);
  const [practiceProgress, setPracticeProgress] = useState(0);
  const [completedTests, setCompletedTests] = useState<string[]>([]);

  // Load user progress from localStorage
  useEffect(() => {
    const savedProgress = localStorage.getItem('quizProgress');
    if (savedProgress) {
      try {
        const progress = JSON.parse(savedProgress);
        setUserProgress(progress);
      } catch (error) {
        // Error loading quiz progress
      }
    }
  }, []);

  // Check practice test completion
  useEffect(() => {
    checkPracticeCompletion();
  }, [isPremium]);

  const checkPracticeCompletion = () => {
    // Get completed tests from localStorage
    const completedTestsData = localStorage.getItem('completedTests');
    const completed = completedTestsData ? JSON.parse(completedTestsData) : [];
    
    // Define required practice tests (all available practice tests)
    const requiredTests = [
      'hazard-perception',
      'insight-practice',
      'mandatory-signs',
      'warning-signs',
      'prohibitory-signs',
      'prohibitory-signs-2',
      'traffic-lights-signals',
      'road-information',
      'sign-identification',
      'priority-rules',
      'mandatory-signs-2',
      'speed-limits',
      'road-markings',
      'expanded-priority-rules',
      'motorway-rules',
      'vehicle-categories',
      'parking-rules',
      'environmental-zones',
      'technology-safety',
      'alcohol-drugs',
      'fatigue-rest',
      'vehicle-documentation',
      'emergency-procedures'
    ];

    // Filter out premium tests if user is not premium
    const availableTests = isPremium ? requiredTests : ['hazard-perception'];
    
    const completedAvailableTests = completed.filter((test: string) => 
      availableTests.includes(test)
    );

    setCompletedTests(completedAvailableTests);
    setPracticeProgress(Math.round((completedAvailableTests.length / availableTests.length) * 100));
    setHasCompletedPractice(completedAvailableTests.length >= availableTests.length);
  };

  const quizLevels: QuizLevel[] = [
    {
      id: 'mock-quiz-1',
      title: 'Mock Exam 1',
      subtitle: 'Foundation Level',
      difficulty: 'beginner',
      description: 'Official format: 50 questions (25 Traffic Rules, 15 Hazard Perception, 10 Traffic Insight)',
      timeLimit: 30,
      questions: 50,
      passRate: '88%',
      icon: <FiAward size={32} />,
      color: '#28a745',
      requiredScore: 88
    },
    {
      id: 'mock-quiz-2',
      title: 'Mock Exam 2',
      subtitle: 'Standard Level',
      difficulty: 'intermediate',
      description: 'Official format: 50 questions (25 Traffic Rules, 15 Hazard Perception, 10 Traffic Insight)',
      timeLimit: 30,
      questions: 50,
      passRate: '88%',
      icon: <FiTrendingUp size={32} />,
      color: '#ffc107',
      requiredScore: 88
    },
    {
      id: 'mock-quiz-3',
      title: 'Mock Exam 3',
      subtitle: 'Expert Level',
      difficulty: 'advanced',
      description: 'Official format: 50 questions (25 Traffic Rules, 15 Hazard Perception, 10 Traffic Insight)',
      timeLimit: 30,
      questions: 50,
      passRate: '88%',
      icon: <FiZap size={32} />,
      color: '#dc3545',
      requiredScore: 88
    }
  ];

  const isLevelUnlocked = (difficulty: string): boolean => {
    switch (difficulty) {
      case 'beginner':
        return hasCompletedPractice; // Beginner is unlocked if practice tests are completed
      case 'intermediate':
        return hasCompletedPractice && userProgress.beginner.passed;
      case 'advanced':
        return hasCompletedPractice && userProgress.beginner.passed && userProgress.intermediate.passed;
      default:
        return false;
    }
  };

  const getLevelStatus = (difficulty: string) => {
    const progress = userProgress[difficulty as keyof typeof userProgress];
    
    if (progress.passed) {
      return {
        status: 'completed',
        icon: <FiCheckCircle size={20} />,
        text: 'Completed',
        color: '#28a745'
      };
    } else if (isLevelUnlocked(difficulty)) {
      return {
        status: 'available',
        icon: null,
        text: progress.attempts > 0 ? `Attempted (${progress.bestScore}%)` : 'Available',
        color: '#6c757d'
      };
    } else {
      return {
        status: 'locked',
        icon: <FiLock size={20} />,
        text: 'Locked',
        color: '#dc3545'
      };
    }
  };

  const handleQuizSelect = (quizId: string, difficulty: string) => {
    if (isLevelUnlocked(difficulty)) {
      navigate(`/quiz/${quizId}`);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return '#28a745';
      case 'intermediate': return '#ffc107';
      case 'advanced': return '#dc3545';
      default: return '#6c757d';
    }
  };

  const getDifficultyLabel = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'Beginner';
      case 'intermediate': return 'Intermediate';
      case 'advanced': return 'Advanced';
      default: return difficulty;
    }
  };



  return (
    <div className="main-layout quiz-selection-layout">
      <Navigation />
      <main className="main-content quiz-selection-main-content">
        <div className="quiz-selection-page">
          <div style={{ height: '3rem' }} />
          <div className="quiz-selection-header">
            <h1 className="quiz-selection-title">Theory24</h1>
          </div>

      <div className="quiz-levels-container">
        {quizLevels.map((level, index) => {
          const isUnlocked = isLevelUnlocked(level.difficulty);
          const status = getLevelStatus(level.difficulty);
          const progress = userProgress[level.difficulty as keyof typeof userProgress];
          
          return (
            <div 
              key={level.id} 
              className={`quiz-level-card ${!isUnlocked ? 'locked' : ''} ${status.status === 'completed' ? 'completed' : ''}`}
              onClick={() => handleQuizSelect(level.id, level.difficulty)}
            >
              <div className="quiz-level-header">
                <div 
                  className="quiz-level-icon"
                  style={{ backgroundColor: isUnlocked ? level.color : '#6c757d' }}
                >
                  {isUnlocked ? level.icon : <FiLock size={32} />}
                </div>
                               <div className="quiz-level-info">
                 <h2>{level.title}</h2>
                  <div className="quiz-level-badges">
                    <span 
                      className="quiz-difficulty-badge"
                      style={{ backgroundColor: getDifficultyColor(level.difficulty) }}
                    >
                      {getDifficultyLabel(level.difficulty)}
                    </span>
                    <span 
                      className="quiz-status-badge"
                      style={{ backgroundColor: status.color }}
                    >
                      {status.icon}
                      {status.text}
                    </span>
                  </div>
                </div>
              </div>

                             <div className="quiz-level-details">
                
                <div className="quiz-specs">
                  <div className="quiz-spec-item">
                    <span className="spec-label">Questions:</span>
                    <span className="spec-value">{level.questions}</span>
                  </div>
                  <div className="quiz-spec-item">
                    <span className="spec-label">Time Limit:</span>
                    <span className="spec-value">{level.timeLimit} minutes</span>
                  </div>
                  <div className="quiz-spec-item">
                    <span className="spec-label">Pass Rate:</span>
                    <span className="spec-value">{level.passRate}</span>
                  </div>
                  {progress.attempts > 0 && (
                    <div className="quiz-spec-item">
                      <span className="spec-label">Best Score:</span>
                      <span className="spec-value">{progress.bestScore}%</span>
                    </div>
                  )}
                </div>

                {!isUnlocked && (
                  <div className="quiz-lock-message">
                    {level.difficulty === 'beginner' ? (
                      <div>
                        <p>Complete all practice tests to unlock this quiz</p>
                        <div className="practice-progress">
                          <div className="progress-bar">
                            <div 
                              className="progress-fill" 
                              style={{ width: `${practiceProgress}%` }}
                            ></div>
                          </div>
                          <span className="progress-text">{completedTests.length}/{isPremium ? 23 : 1} practice tests completed</span>
                        </div>
                      </div>
                    ) : (
                      <p>Complete {getDifficultyLabel(level.difficulty === 'intermediate' ? 'beginner' : 'intermediate')} quiz to unlock</p>
                    )}
                  </div>
                )}
              </div>

              {level.difficulty === 'beginner' && !isUnlocked ? (
                <button 
                  className="start-quiz-btn practice-btn" 
                  style={{ backgroundColor: '#17a2b8' }}
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate('/practice');
                  }}
                >
                  Go to Practice
                </button>
              ) : (
                <button 
                  className={`start-quiz-btn ${!isUnlocked ? 'disabled' : ''}`} 
                  style={{ backgroundColor: isUnlocked ? level.color : '#6c757d' }}
                  disabled={!isUnlocked}
                >
                  {isUnlocked ? 'Start Quiz' : 'Locked'}
                </button>
              )}
            </div>
          );
        })}
      </div>

        </div>
      </main>
    </div>
  );
};
