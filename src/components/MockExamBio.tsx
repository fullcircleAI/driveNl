import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { usePremiumStatus } from './usePremiumStatus';
import './MockExamBio.css';

interface MockExamBioProps {
  onStartExam: () => void;
}

export const MockExamBio: React.FC<MockExamBioProps> = ({ onStartExam }) => {
  const [hasCompletedPractice, setHasCompletedPractice] = useState(false);
  const [practiceProgress, setPracticeProgress] = useState(0);
  const [completedTests, setCompletedTests] = useState<string[]>([]);
  const { t_nested } = useLanguage();
  const navigate = useNavigate();
  const isPremium = usePremiumStatus();

  // Check practice test completion on component mount
  useEffect(() => {
    checkPracticeCompletion();
  }, []);

  const checkPracticeCompletion = () => {
    // Get completed tests from localStorage
    const completedTestsData = localStorage.getItem('completedTests');
    const completed = completedTestsData ? JSON.parse(completedTestsData) : [];
    
    // Define required practice tests (excluding mock exam)
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
      'mandatory-signs-2'
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

  const handleStartExam = () => {
    if (hasCompletedPractice) {
      onStartExam();
    }
  };

  const handlePracticeClick = () => {
    navigate('/practice');
  };

  return (
    <div className="quiz-bio-container">
      <div className="quiz-bio-card">
        <h1 className="quiz-title">{t_nested('quiz.title')}</h1>
        <div className="quiz-info">
          <div className="quiz-item">
            <span className="quiz-label">{t_nested('quiz.questions')}:</span>
            <span className="quiz-value">25</span>
          </div>
          <div className="quiz-item">
            <span className="quiz-label">{t_nested('quiz.timeLimit')}:</span>
            <span className="quiz-value">25 {t_nested('practice.timeLeft')}</span>
          </div>
          <div className="quiz-item">
            <span className="quiz-label">{t_nested('quiz.passRate')}:</span>
            <span className="quiz-value">{t_nested('quiz.variesByCategory')}</span>
          </div>
        </div>
        <p className="quiz-description">
          {t_nested('mockExamBio.practiceRequirement')}
        </p>
        {!hasCompletedPractice && (
          <div className="practice-message">
            Complete all practice tests to take the quiz.
          </div>
        )}
        <div className="quiz-actions">
          <button 
            className={`start-quiz-btn ${!hasCompletedPractice ? 'disabled' : ''}`} 
            onClick={hasCompletedPractice ? handleStartExam : undefined}
            disabled={!hasCompletedPractice}
          >
            Start
          </button>
        </div>
      </div>
    </div>
  );
}; 