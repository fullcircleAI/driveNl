import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { useStreak } from './StreakCounter';
import type { Question } from '../types';
import './MockExam.css';
import { FiMic, FiMicOff, FiClock, FiCheckCircle, FiXCircle } from 'react-icons/fi';

// Import all question data for randomization
import {
  mandatorySignQuestions,
  warningSignsQuestions,
  prohibitorySignsQuestions,
  prohibitorySigns2Questions,
  trafficLightsSignalsQuestions,
  roadInformationQuestions,
  signIdentificationQuestions,
  priorityRulesQuestions,
  mandatorySigns2Questions,
  speedLimitQuestions,
  roadMarkingsQuestions,
  expandedPriorityRulesQuestions,
  motorwayRulesQuestions,
  vehicleCategoriesQuestions,
  parkingRulesQuestions,
  environmentalZonesQuestions,
  technologySafetyQuestions,
  alcoholDrugsQuestions,
  fatigueRestQuestions,
  vehicleDocumentationQuestions,
  emergencyProceduresQuestions,
  hazardPerceptionQuestions,
  insightPracticeQuestions,
  bicycleInteractionsQuestions,
  roundaboutRulesQuestions,
  tramInteractionsQuestions,
  pedestrianCrossingsQuestions,
  constructionZonesQuestions,
  weatherConditionsQuestions
} from '../question_data';

// @ts-ignore
// eslint-disable-next-line
type SpeechRecognition = any;

interface MockExamConfig {
  questions: number;
  timeLimit: number; // in minutes
  passRate: number; // percentage
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

export const MockExam: React.FC = () => {
  const { quizId } = useParams<{ quizId: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { recordStudySession } = useStreak();
  
  // Mock exam configurations following official format
  const examConfigs: Record<string, MockExamConfig> = {
    'mock-quiz-1': { questions: 50, timeLimit: 30, passRate: 88, difficulty: 'beginner' }, // 44/50 = 88%
    'mock-quiz-2': { questions: 50, timeLimit: 30, passRate: 88, difficulty: 'intermediate' }, // 44/50 = 88%
    'mock-quiz-3': { questions: 50, timeLimit: 30, passRate: 88, difficulty: 'advanced' } // 44/50 = 88%
  };

  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [isAnswered, setIsAnswered] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0); // in seconds
  const [isFinished, setIsFinished] = useState(false);
  const [examConfig, setExamConfig] = useState<MockExamConfig | null>(null);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [showResults, setShowResults] = useState(false);
  const [isExamStarted, setIsExamStarted] = useState(false);

  // Voice recognition
  const [voiceMode, setVoiceMode] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [voiceError, setVoiceError] = useState<string | null>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  // Load exam configuration and questions following official format
  useEffect(() => {
    if (!quizId) return;

    const config = examConfigs[quizId];
    if (!config) {
      navigate('/quiz-selection');
      return;
    }

    setExamConfig(config);
    setTimeLeft(config.timeLimit * 60); // Convert minutes to seconds

    // Official Exam Format: 50 questions with specific distribution
    const formattedQuestions = createFormattedExam(config.difficulty);
    setQuestions(formattedQuestions);
  }, [quizId, navigate]);

  // Create formatted exam with proper question distribution
  const createFormattedExam = (_difficulty: 'beginner' | 'intermediate' | 'advanced'): Question[] => {
    // Official Format: 50 questions distributed as follows:
    // - 25 Traffic Rules & Signs questions
    // - 15 Hazard Perception questions  
    // - 10 Traffic Insight questions
    
    const trafficRulesQuestions = [
      ...mandatorySignQuestions,
      ...warningSignsQuestions,
      ...prohibitorySignsQuestions,
      ...prohibitorySigns2Questions,
      ...trafficLightsSignalsQuestions,
      ...roadInformationQuestions,
      ...signIdentificationQuestions,
      ...priorityRulesQuestions,
      ...mandatorySigns2Questions,
      ...speedLimitQuestions,
      ...roadMarkingsQuestions,
      ...expandedPriorityRulesQuestions,
      ...motorwayRulesQuestions,
      ...vehicleCategoriesQuestions,
      ...parkingRulesQuestions,
      ...environmentalZonesQuestions,
      ...technologySafetyQuestions,
      ...alcoholDrugsQuestions,
      ...fatigueRestQuestions,
      ...vehicleDocumentationQuestions,
      ...emergencyProceduresQuestions,
      ...bicycleInteractionsQuestions,
      ...roundaboutRulesQuestions,
      ...tramInteractionsQuestions,
      ...pedestrianCrossingsQuestions,
      ...constructionZonesQuestions,
      ...weatherConditionsQuestions
    ];

    const hazardPerceptionQuestionsList = [...hazardPerceptionQuestions];
    const trafficInsightQuestionsList = [...insightPracticeQuestions];

    // Shuffle each category separately
    const shuffledTrafficRules = [...trafficRulesQuestions].sort(() => Math.random() - 0.5);
    const shuffledHazardPerception = [...hazardPerceptionQuestionsList].sort(() => Math.random() - 0.5);
    const shuffledTrafficInsight = [...trafficInsightQuestionsList].sort(() => Math.random() - 0.5);

    // Select questions based on official format
    const selectedTrafficRules = shuffledTrafficRules.slice(0, 25);
    const selectedHazardPerception = shuffledHazardPerception.slice(0, 15);
    const selectedTrafficInsight = shuffledTrafficInsight.slice(0, 10);

    // Combine and shuffle the final exam to mix question types
    const exam = [
      ...selectedTrafficRules,
      ...selectedHazardPerception,
      ...selectedTrafficInsight
    ].sort(() => Math.random() - 0.5);

    return exam;
  };

  // Timer countdown
  useEffect(() => {
    if (!isExamStarted || isFinished || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          finishExam();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isExamStarted, isFinished, timeLeft]);

  // Voice recognition setup
  useEffect(() => {
    if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
      recognitionRef.current = new (window as any).webkitSpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = user?.language === 'nl' ? 'nl-NL' : user?.language === 'ar' ? 'ar-SA' : 'en-US';

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript.toLowerCase().trim();
        handleVoiceAnswer(transcript);
        setIsListening(false);
      };

      recognitionRef.current.onerror = () => {
        setVoiceError('Voice recognition error');
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, [user?.language]);

  const startExam = () => {
    setIsExamStarted(true);
  };

  const finishExam = () => {
    setIsFinished(true);
    setShowResults(true);
    
    // Record study session for streak tracking
    recordStudySession();
    
    // Calculate final score
    const correctAnswers = Object.values(answers).filter((answer, index) => 
      answer === questions[index]?.correctAnswerId
    ).length;
    
    setScore(correctAnswers);
    
    // Save results to localStorage
    saveExamResults(correctAnswers);
  };

  const saveExamResults = (correctAnswers: number) => {
    if (!examConfig || !quizId) return;

    const percentage = Math.round((correctAnswers / examConfig.questions) * 100);
    const passed = percentage >= examConfig.passRate;
    
    const results = {
      quizId,
      score: correctAnswers,
      percentage,
      passed,
      totalQuestions: examConfig.questions,
      timeUsed: (examConfig.timeLimit * 60) - timeLeft,
      timestamp: new Date().toISOString(),
      difficulty: examConfig.difficulty
    };

    // Load existing progress
    const existingProgress = localStorage.getItem('quizProgress');
    const progress = existingProgress ? JSON.parse(existingProgress) : {
      beginner: { passed: false, bestScore: 0, attempts: 0 },
      intermediate: { passed: false, bestScore: 0, attempts: 0 },
      advanced: { passed: false, bestScore: 0, attempts: 0 }
    };

    // Update progress for this difficulty level
    const difficulty = examConfig.difficulty;
    progress[difficulty].attempts += 1;
    if (percentage > progress[difficulty].bestScore) {
      progress[difficulty].bestScore = percentage;
    }
    if (passed) {
      progress[difficulty].passed = true;
    }

    // Save updated progress
    localStorage.setItem('quizProgress', JSON.stringify(progress));
    localStorage.setItem(`examResults_${quizId}`, JSON.stringify(results));
  };

  const handleAnswer = (answerId: string) => {
    if (isAnswered || !isExamStarted) return;

    setIsAnswered(true);
    setSelectedAnswer(answerId);
    setAnswers(prev => ({ ...prev, [currentQuestionIndex]: answerId }));

    // Auto-advance after 2 seconds
    setTimeout(() => {
      nextQuestion();
    }, 2000);
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
    } else {
      finishExam();
    }
  };

  const handleVoiceAnswer = (transcript: string) => {
    const answerMap: Record<string, number> = {
      'a': 1, 'b': 2, 'c': 3, 'd': 4,
      'one': 1, 'two': 2, 'three': 3, 'four': 4,
      'first': 1, 'second': 2, 'third': 3, 'fourth': 4
    };
    
    const answer = answerMap[transcript];
    if (answer !== undefined && !isAnswered && isExamStarted) {
      const optionIndex = answer - 1;
      const optionId = questions[currentQuestionIndex]?.options[optionIndex]?.id;
      if (optionId) {
        handleAnswer(optionId);
      }
    }
  };

  const toggleVoiceMode = () => {
    if (!voiceMode) {
      setVoiceMode(true);
      if (recognitionRef.current) {
        recognitionRef.current.start();
        setIsListening(true);
        setVoiceError(null);
      }
    } else {
      setVoiceMode(false);
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsListening(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const currentQuestion = questions[currentQuestionIndex];
  const progress = questions.length > 0 ? ((currentQuestionIndex + 1) / questions.length) * 100 : 0;

  if (!examConfig || questions.length === 0) {
    return null; // No loading screen - instant access for competition
  }

  if (showResults) {
    const percentage = Math.round((score / examConfig.questions) * 100);
    const passed = percentage >= examConfig.passRate;
    
    return (
      <div className="mock-exam-container">
        <div className="mock-exam-results">
          <div className="results-header">
            <h1>Mock Exam Results</h1>
            <div className={`results-status ${passed ? 'passed' : 'failed'}`}>
              {passed ? <FiCheckCircle size={48} /> : <FiXCircle size={48} />}
              <h2>{passed ? 'PASSED' : 'FAILED'}</h2>
            </div>
          </div>
          
          <div className="results-details">
            <div className="result-item">
              <span className="result-label">Score:</span>
              <span className="result-value">{score}/{examConfig.questions}</span>
            </div>
            <div className="result-item">
              <span className="result-label">Percentage:</span>
              <span className="result-value">{percentage}%</span>
            </div>
            <div className="result-item">
              <span className="result-label">Required:</span>
              <span className="result-value">{examConfig.passRate}%</span>
            </div>
            <div className="result-item">
              <span className="result-label">Time Used:</span>
              <span className="result-value">{formatTime((examConfig.timeLimit * 60) - timeLeft)}</span>
            </div>
          </div>

          <div className="results-actions">
            <button 
              className="retake-btn"
              onClick={() => window.location.reload()}
            >
              Retake Test
            </button>
            <button 
              className="dashboard-btn"
              onClick={() => navigate('/')}
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!isExamStarted) {
    return (
      <div className="mock-exam-container">
        <div className="mock-exam-intro">
          <h1>Mock Exam</h1>
          <h2>{examConfig.difficulty.charAt(0).toUpperCase() + examConfig.difficulty.slice(1)} Level</h2>
          
          <div className="exam-info">
            <div className="info-item">
              <span className="info-label">Questions:</span>
              <span className="info-value">{examConfig.questions}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Time Limit:</span>
              <span className="info-value">{examConfig.timeLimit} minutes</span>
            </div>
            <div className="info-item">
              <span className="info-label">Pass Rate:</span>
              <span className="info-value">{examConfig.passRate}%</span>
            </div>
          </div>

          <div className="exam-instructions">
            <h3>Instructions:</h3>
            <ul>
              <li>Answer all {examConfig.questions} questions</li>
              <li>You have {examConfig.timeLimit} minutes to complete the exam</li>
              <li>Need {examConfig.passRate}% correct to pass</li>
              <li>Questions are randomly selected from all topics</li>
              <li>No explanations during the exam</li>
            </ul>
          </div>

          <button className="start-exam-btn" onClick={startExam}>
            Start Mock Exam
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mock-exam-container">
      <div className="mock-exam-header">
        <div className="exam-progress">
          <span>Question {currentQuestionIndex + 1} of {questions.length}</span>
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
        
        <div className="exam-timer">
          <FiClock size={20} />
          <span className={timeLeft < 300 ? 'time-warning' : ''}>
            {formatTime(timeLeft)}
          </span>
        </div>
      </div>

      <div className="mock-exam-content">
        {currentQuestion && (
          <>
            <div className="question-container">
              <h2 className="question-text">{currentQuestion.text}</h2>
              
              {currentQuestion.imageUrl && (
                <div className="question-image">
                  <img src={currentQuestion.imageUrl} alt="Question" />
                </div>
              )}

              <div className="options-container">
                {currentQuestion.options.map((option, index) => {
                  const isSelected = selectedAnswer === option.id;
                  const isCorrect = option.id === currentQuestion.correctAnswerId;
                  const showResult = isAnswered;
                  
                  return (
                    <button
                      key={option.id}
                      className={`option-btn ${isSelected ? 'selected' : ''} ${
                        showResult ? (isCorrect ? 'correct' : isSelected ? 'incorrect' : '') : ''
                      }`}
                      onClick={() => handleAnswer(option.id)}
                      disabled={isAnswered}
                    >
                      <span className="option-letter">
                        {String.fromCharCode(65 + index)}
                      </span>
                      <span className="option-text">{option.text}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="exam-controls">
              <button 
                className={`voice-btn ${voiceMode ? 'active' : ''}`}
                onClick={toggleVoiceMode}
                disabled={isAnswered}
              >
                {isListening ? <FiMic size={20} /> : <FiMicOff size={20} />}
                Voice
              </button>
              
              {voiceError && (
                <div className="voice-error">{voiceError}</div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
