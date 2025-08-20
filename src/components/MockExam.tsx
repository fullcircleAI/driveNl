import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import type { Question } from '../types';
import './MockExam.css';

// Import all question data for the mock exam
import { hazardPerceptionQuestions } from '../question_data/hazardPerceptionQuestions';
import { insightPracticeQuestions } from '../question_data/insightPracticeQuestions';
import { mandatorySignQuestions } from '../question_data/mandatorySignsQuestions';
import { warningSignsQuestions } from '../question_data/warningSignsQuestions';
import { prohibitorySignsQuestions } from '../question_data/prohibitorySignsQuestions';
import { prohibitorySigns2Questions } from '../question_data/prohibitorySigns2Questions';
import { trafficLightsSignalsQuestions } from '../question_data/trafficLightsSignalsQuestions';
import { roadInformationQuestions } from '../question_data/roadInformationQuestions';
import { signIdentificationQuestions } from '../question_data/signIdentificationQuestions';
import { priorityRulesQuestions } from '../question_data/priorityRulesQuestions';
import { mandatorySigns2Questions } from '../question_data/mandatorySigns2Questions';

interface MockExamProps {
  onComplete: (score: number, total: number, timeSpent: number, questions: Question[], selectedAnswers: { [key: string]: string }) => void;
}

export const MockExam: React.FC<MockExamProps> = ({ onComplete }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: string]: string }>({});
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes in seconds (official exam time)
  const [examStarted, setExamStarted] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [examQuestions, setExamQuestions] = useState<Question[]>([]);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [examPhase, setExamPhase] = useState<'intro' | 'exam' | 'results'>('intro');
  
  const { t_nested } = useLanguage();
  const navigate = useNavigate();
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Generate mock exam questions on component mount
  useEffect(() => {
    generateMockExam();
  }, []);

  // Timer countdown
  useEffect(() => {
    if (examStarted && timeLeft > 0) {
      timerRef.current = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    } else if (timeLeft === 0 && examStarted) {
      finishExam();
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [timeLeft, examStarted]);

  const generateMockExam = () => {
    // Official exam question distribution (approximate)
    const questionDistribution = {
      trafficRules: 12,      // Traffic rules and regulations
      hazardPerception: 8,   // Hazard perception and insight
      roadSigns: 5          // Road signs and markings
    };

    // Select questions according to official distribution
    const trafficRulesQuestions = [
      ...priorityRulesQuestions,
      ...trafficLightsSignalsQuestions,
      ...roadInformationQuestions
    ].sort(() => 0.5 - Math.random()).slice(0, questionDistribution.trafficRules);

    const hazardPerceptionExamQuestions = [
      ...hazardPerceptionQuestions,
      ...insightPracticeQuestions
    ].sort(() => 0.5 - Math.random()).slice(0, questionDistribution.hazardPerception);

    const roadSignsQuestions = [
      ...mandatorySignQuestions,
      ...warningSignsQuestions,
      ...prohibitorySignsQuestions,
      ...prohibitorySigns2Questions,
      ...signIdentificationQuestions,
      ...mandatorySigns2Questions
    ].sort(() => 0.5 - Math.random()).slice(0, questionDistribution.roadSigns);

    // Combine all questions and shuffle for final exam
    const allQuestions = [
      ...trafficRulesQuestions,
      ...hazardPerceptionExamQuestions,
      ...roadSignsQuestions
    ];

    const finalQuestions = allQuestions.sort(() => 0.5 - Math.random());
    
    setExamQuestions(finalQuestions);
  };

  const startExam = () => {
    setExamStarted(true);
    setStartTime(new Date());
    setExamPhase('exam');
  };

  const handleAnswerSelect = (questionId: string, answerId: string) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: answerId
    }));
  };

  const finishExam = () => {
    if (!startTime) return;

    const endTime = new Date();
    const timeSpent = Math.round((endTime.getTime() - startTime.getTime()) / 1000);

    // Calculate score
    let correctAnswers = 0;
    examQuestions.forEach(question => {
      const selectedAnswer = selectedAnswers[question.id];
      if (selectedAnswer === question.correctAnswerId) {
        correctAnswers++;
      }
    });

    onComplete(correctAnswers, examQuestions.length, timeSpent, examQuestions, selectedAnswers);
  };

  const confirmFinish = () => {
    setShowConfirmation(true);
  };

  const cancelFinish = () => {
    setShowConfirmation(false);
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const currentQuestion = examQuestions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / examQuestions.length) * 100;
  const answeredQuestions = Object.keys(selectedAnswers).length;

  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (!isMuted) {
      window.speechSynthesis.cancel();
    } else if (currentQuestion) {
      const utter = new window.SpeechSynthesisUtterance(currentQuestion.text);
      window.speechSynthesis.speak(utter);
    }
  };

  if (examPhase === 'intro') {
    return (
      <div className="quiz-exam-intro">
        <div className="exam-intro-content">
          <div className="quiz-logo">
            <h1>{t_nested('quiz.title')}</h1>
            <span>{t_nested('quiz.subtitle')}</span>
          </div>
          <div className="exam-info">
            <h2>{t_nested('quiz.officialStyle')}</h2>
            <div className="exam-details">
              <div className="detail-item">
                <span className="detail-label">{t_nested('quiz.questions')}:</span>
                <span className="detail-value">25</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">{t_nested('quiz.timeLimit')}:</span>
                <span className="detail-value">25 {t_nested('practice.timeLeft')}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">{t_nested('quiz.passRate')}:</span>
                <span className="detail-value">{t_nested('quiz.variesByCategory')}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">{t_nested('quiz.testType')}:</span>
                <span className="detail-value">{t_nested('quiz.computerBased')}</span>
              </div>
            </div>
          </div>
          <div className="exam-instructions">
            <h3>{t_nested('quiz.instructions')}</h3>
            <ul>
              <li>{t_nested('quiz.instruction1')}</li>
              <li>{t_nested('quiz.instruction2')}</li>
              <li>{t_nested('quiz.instruction3')}</li>
              <li>{t_nested('quiz.instruction4')}</li>
              <li>{t_nested('quiz.instruction5')}</li>
            </ul>
          </div>
          <div className="exam-warning">
            <p>⚠️ {t_nested('quiz.warning')}</p>
          </div>
          <button className="start-exam-btn" onClick={startExam}>
            {t_nested('quiz.startQuiz')}
          </button>
        </div>
      </div>
    );
  }

  if (!currentQuestion) {
    return <div className="loading">{t_nested('quiz.loading')}</div>;
  }

  return (
    <div className="quiz-exam">
      {/* Official Quiz Header */}
      <div className="quiz-exam-header">
        <div className="quiz-exam-logo">
          <span>{t_nested('quiz.title')}</span>
        </div>
        <div className="quiz-exam-info">
          <div className="exam-timer">
            <span className="timer-label">{t_nested('quiz.timeLeft')}:</span>
            <span className={`timer-value ${timeLeft < 300 ? 'urgent' : ''}`}>
              {formatTime(timeLeft)}
            </span>
          </div>
          <div className="exam-progress">
            <span className="progress-label">{t_nested('quiz.question')}:</span>
            <span className="progress-value">{currentQuestionIndex + 1} / {examQuestions.length}</span>
          </div>
        </div>
        <div className="quiz-exam-controls">
          <button className="quiz-mute-btn" onClick={toggleMute} aria-label={isMuted ? t_nested('practice.unmute') : t_nested('practice.mute')}>
            {isMuted ? '🔇' : '🔊'}
          </button>
          <button className="quiz-finish-btn" onClick={confirmFinish}>
            {t_nested('quiz.finishQuiz')}
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="quiz-progress-bar">
        <div className="quiz-progress-fill" style={{ width: `${progress}%` }} />
      </div>

      {/* Question Content */}
      <div className="quiz-question-container">
        <div className="quiz-question-header">
          <span className="quiz-question-number">{t_nested('quiz.question')} {currentQuestionIndex + 1}</span>
          <span className="quiz-question-category">{currentQuestion.subject}</span>
        </div>

        <div className="quiz-question-text">
          {currentQuestion.text}
        </div>

        {currentQuestion.imageUrl && (
          <div className="quiz-question-image">
            <img src={currentQuestion.imageUrl} alt={currentQuestion.imageHint || 'Question image'} />
          </div>
        )}

        <div className="quiz-options-list">
          {currentQuestion.options.map((option) => (
            <button
              key={option.id}
              className={`quiz-option-btn ${selectedAnswers[currentQuestion.id] === option.id ? 'selected' : ''}`}
              onClick={() => handleAnswerSelect(currentQuestion.id, option.id)}
            >
              <span className="option-letter">
                {option.id.slice(-1).toUpperCase()}
              </span>
              <span className="option-text">{option.text}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <div className="quiz-navigation">
        <button 
          className="quiz-nav-btn quiz-prev-btn"
          disabled={currentQuestionIndex === 0}
          onClick={() => setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1))}
        >
          ← {t_nested('quiz.previous')}
        </button>
        <div className="quiz-question-indicators">
          {examQuestions.map((_, index) => (
            <button
              key={index}
              className={`quiz-indicator ${index === currentQuestionIndex ? 'current' : ''} ${selectedAnswers[examQuestions[index].id] ? 'answered' : ''}`}
              onClick={() => setCurrentQuestionIndex(index)}
            >
              {index + 1}
            </button>
          ))}
        </div>
        <button 
          className="quiz-nav-btn quiz-next-btn"
          disabled={currentQuestionIndex === examQuestions.length - 1}
          onClick={() => setCurrentQuestionIndex(Math.min(examQuestions.length - 1, currentQuestionIndex + 1))}
        >
          {t_nested('quiz.next')} →
        </button>
      </div>

      {/* Confirmation Dialog */}
      {showConfirmation && (
        <div className="quiz-confirmation-overlay">
          <div className="quiz-confirmation-dialog">
            <h3>{t_nested('quiz.finishQuizConfirm')}</h3>
            <p>{t_nested('quiz.finishQuizMessage')}</p>
            <p>{t_nested('quiz.answeredQuestions').replace('{answered}', answeredQuestions.toString()).replace('{total}', examQuestions.length.toString())}</p>
            <div className="quiz-confirmation-buttons">
              <button className="quiz-cancel-btn" onClick={cancelFinish}>
                {t_nested('quiz.cancel')}
              </button>
              <button className="quiz-confirm-btn" onClick={finishExam}>
                {t_nested('quiz.finishQuiz')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}; 