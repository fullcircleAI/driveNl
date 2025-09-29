import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { dataPersistence } from '../services/dataPersistence';
import { studyScheduler } from '../services/studyScheduler';
import { useStreak } from './StreakCounter';
import type { Question } from '../types';
import './PracticeTest.css';
import './Dashboard.css';

// Import all question data for instant loading
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


export const PracticeTest: React.FC = () => {
  const { testType } = useParams<{ testType: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { recordStudySession } = useStreak();
  
  // Simple state management
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [isFinished, setIsFinished] = useState(false);
  const [motivationWord, setMotivationWord] = useState('');
  
  // Session tracking for studyScheduler
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [sessionStartTime, setSessionStartTime] = useState<Date | null>(null);
  
  // Voice features (text-to-speech only) - ON by default for better UX
  const [isMuted, setIsMuted] = useState(false);
  
  const speechRef = useRef<SpeechSynthesisUtterance | null>(null);
  const correctSoundRef = useRef<HTMLAudioElement | null>(null);

  const correctWords = ['Great job!', 'Well done!', 'Excellent!', 'Nice work!', 'You got it!', 'Fantastic!', 'Correct!', 'Awesome!', 'Brilliant!', 'Keep it up!'];
  const wrongWords = ['Keep trying!', 'Don\'t give up!', 'Almost!', 'Try again!', 'You can do it!', 'Not quite.', 'Stay focused!', 'Keep practicing!', 'Don\'t worry!', 'Learn and improve!'];

  // Get test data based on testType
  const getTestData = (testType: string) => {
        const questionMap: Record<string, { questions: Question[], name: string }> = {
          'traffic-rules-signs': { 
            questions: [...mandatorySignQuestions, ...warningSignsQuestions, ...prohibitorySignsQuestions, ...trafficLightsSignalsQuestions], 
            name: 'Traffic Rules & Signs' 
          },
          'priority-rules': { 
            questions: [...priorityRulesQuestions, ...expandedPriorityRulesQuestions], 
            name: 'Priority & Right of Way' 
          },
          'hazard-perception': { 
            questions: [...hazardPerceptionQuestions], 
            name: 'Hazard Perception' 
          },
          'speed-safety': { 
            questions: [...speedLimitQuestions, ...roadMarkingsQuestions], 
            name: 'Speed & Safety' 
          },
          'road-signs': { 
            questions: [...mandatorySigns2Questions, ...prohibitorySigns2Questions, ...roadInformationQuestions, ...signIdentificationQuestions], 
            name: 'Road Signs' 
          },
          'motorway-rules': { 
            questions: [...motorwayRulesQuestions], 
            name: 'Motorway Rules' 
          },
          'vehicle-knowledge': { 
            questions: [...vehicleCategoriesQuestions, ...vehicleDocumentationQuestions], 
            name: 'Vehicle Knowledge' 
          },
          'parking-rules': { 
            questions: [...parkingRulesQuestions], 
            name: 'Parking Rules' 
          },
          'environmental': { 
            questions: [...environmentalZonesQuestions], 
            name: 'Environmental Zones' 
          },
          'technology-safety': { 
            questions: [...technologySafetyQuestions], 
            name: 'Technology & Safety' 
          },
          'alcohol-drugs': { 
            questions: [...alcoholDrugsQuestions], 
            name: 'Alcohol & Drugs' 
          },
          'fatigue-rest': { 
            questions: [...fatigueRestQuestions], 
            name: 'Fatigue & Rest' 
          },
          'emergency-procedures': { 
            questions: [...emergencyProceduresQuestions], 
            name: 'Emergency Procedures' 
          },
          'insight-practice': { 
            questions: [...insightPracticeQuestions], 
            name: 'Insight Practice' 
          },
          'bicycle-interactions': { 
            questions: [...bicycleInteractionsQuestions], 
            name: 'Bicycle Interactions' 
          },
          'roundabout-rules': { 
            questions: [...roundaboutRulesQuestions], 
            name: 'Roundabout Rules' 
          },
          'tram-interactions': { 
            questions: [...tramInteractionsQuestions], 
            name: 'Tram Interactions' 
          },
          'pedestrian-crossings': { 
            questions: [...pedestrianCrossingsQuestions], 
            name: 'Pedestrian Crossings' 
          },
          'construction-zones': { 
            questions: [...constructionZonesQuestions], 
            name: 'Construction Zones' 
          },
          'weather-conditions': { 
            questions: [...weatherConditionsQuestions], 
            name: 'Weather Conditions' 
          }
        };
        
    const result = questionMap[testType];
    
    return result || {
      questions: [
        {
          id: "1",
          text: "What does this sign mean?",
          options: [
            { id: "A", text: "Stop" },
            { id: "B", text: "Yield" },
            { id: "C", text: "No Entry" },
            { id: "D", text: "Speed Limit" }
          ],
          correctAnswerId: "A",
          explanation: "This is a stop sign.",
          subject: "Traffic Signs",
          image: null
        }
      ],
      name: 'Practice Test'
    };
  };

  // Initialize questions immediately
  useEffect(() => {
    const testData = getTestData(testType || 'traffic-rules-signs');
    setQuestions(testData.questions);
    
    // Reset test state when changing tests
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setScore(0);
    setIsAnswered(false);
    setIsCorrect(null);
    setIsFinished(false);
    setMotivationWord('');
    
    // Start study session tracking
    const topicName = testData.name;
    const newSessionId = studyScheduler.startPracticeSession(topicName, testData.questions.length);
    setSessionId(newSessionId);
    setSessionStartTime(new Date());
  }, [testType]);
  
  // Add practice-page class to body for white background
  useEffect(() => {
    document.body.classList.add('practice-page');
    return () => {
      document.body.classList.remove('practice-page');
    };
  }, []);


  // Load voices for speech synthesis
  useEffect(() => {
    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      if (voices.length > 0) {
        // Voices are loaded, we can now speak
        if (questions[currentQuestionIndex] && !isMuted) {
          speakQuestionAndOptions(questions[currentQuestionIndex]);
        }
      }
    };

    // Load voices immediately
    loadVoices();

    // Also listen for voice changes
    if ('speechSynthesis' in window) {
      window.speechSynthesis.addEventListener('voiceschanged', loadVoices);
      return () => {
        window.speechSynthesis.removeEventListener('voiceschanged', loadVoices);
      };
    }
  }, [questions, currentQuestionIndex, isMuted, user?.language]);

  // Reset question state when moving to next question
  useEffect(() => {
    setIsAnswered(false);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setIsCorrect(null);
  }, [currentQuestionIndex]);

  // Auto-speak questions when they change (if not muted)
  useEffect(() => {
    if (questions[currentQuestionIndex] && !isMuted) {
      speakQuestionAndOptions(questions[currentQuestionIndex]);
    }
  }, [currentQuestionIndex, questions, isMuted]);

  // Speech synthesis
  const speakQuestionAndOptions = (question: Question) => {
    if (isMuted) return;
    
    window.speechSynthesis.cancel();
    let fullText = question.text;
    question.options.forEach((option, idx) => {
      fullText += ` ${String.fromCharCode(65 + idx)}. ${option.text}.`;
    });
    
    speechRef.current = new SpeechSynthesisUtterance(fullText);
    speechRef.current.rate = 0.9;
    speechRef.current.pitch = 1;
    speechRef.current.lang = user?.language === 'nl' ? 'nl-NL' : 'en-US';
    
    // Try to set voice, with fallback
    const voiceName = user?.language === 'nl' ? 'Xander' : 'Samantha';
      const voices = window.speechSynthesis.getVoices();
    
    if (voices.length > 0) {
      const voice = voices.find(v => v.name === voiceName);
      if (voice) {
        speechRef.current.voice = voice;
      } else {
        // Fallback to first available voice in the language
        const fallbackVoice = voices.find(v => v.lang.startsWith(user?.language === 'nl' ? 'nl' : 'en'));
        if (fallbackVoice) {
          speechRef.current.voice = fallbackVoice;
        }
      }
    }
    
    // Add error handling
    speechRef.current.onerror = (event) => {
      // Speech synthesis error handled silently
    };
    
    window.speechSynthesis.speak(speechRef.current);
  };


  // Answer handling
  const handleAnswer = (answerId: string) => {
    if (isAnswered || !questions[currentQuestionIndex]) return;

    setIsAnswered(true);
    setSelectedAnswer(answerId);
    window.speechSynthesis.cancel();
    
    const correct = answerId === questions[currentQuestionIndex].correctAnswerId;
    setIsCorrect(correct);
    
    if (correct) {
      setScore(score + 1);
      setMotivationWord(correctWords[Math.floor(Math.random() * correctWords.length)]);
    } else {
      setMotivationWord(wrongWords[Math.floor(Math.random() * wrongWords.length)]);
    }

    setShowExplanation(true);
    
    // Update session progress in studyScheduler
    if (sessionId) {
      studyScheduler.updatePracticeSession(sessionId, currentQuestionIndex + 1);
    }
  };

  // Next question
  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setIsFinished(true);
    }
  };


  // Mute toggle
  const toggleMute = () => {
    const newMutedState = !isMuted;
    setIsMuted(newMutedState);
    
    if (newMutedState) {
      // Muting - stop speech
      window.speechSynthesis.cancel();
    } else {
      // Unmuting - start speaking current question
      if (questions[currentQuestionIndex]) {
        speakQuestionAndOptions(questions[currentQuestionIndex]);
      }
    }
  };

  // Test progression
  const getNextTest = (currentTest: string) => {
    const testProgression: Record<string, string> = {
      'traffic-rules-signs': 'priority-rules',
      'priority-rules': 'hazard-perception',
      'hazard-perception': 'speed-safety',
      'speed-safety': 'road-signs',
      'road-signs': 'motorway-rules',
      'motorway-rules': 'vehicle-knowledge',
      'vehicle-knowledge': 'parking-rules',
      'parking-rules': 'environmental',
      'environmental': 'technology-safety',
      'technology-safety': 'alcohol-drugs',
      'alcohol-drugs': 'fatigue-rest',
      'fatigue-rest': 'emergency-procedures',
      'emergency-procedures': 'insight-practice',
      'insight-practice': 'bicycle-interactions',
      'bicycle-interactions': 'roundabout-rules',
      'roundabout-rules': 'tram-interactions',
      'tram-interactions': 'pedestrian-crossings',
      'pedestrian-crossings': 'construction-zones',
      'construction-zones': 'weather-conditions',
      'weather-conditions': 'traffic-rules-signs'
    };
    return testProgression[currentTest] || 'traffic-rules-signs';
  };

  const getTestDisplayName = (testRoute: string) => {
    const testNames: Record<string, string> = {
      'traffic-rules-signs': 'Traffic Signs',
      'priority-rules': 'Priority Rules',
      'hazard-perception': 'Hazard Perception',
      'speed-safety': 'Speed & Safety',
      'road-signs': 'Road Signs',
      'motorway-rules': 'Motorway Rules',
      'vehicle-knowledge': 'Vehicle Knowledge',
      'parking-rules': 'Parking Rules',
      'environmental': 'Environmental Zones',
      'technology-safety': 'Technology & Safety',
      'alcohol-drugs': 'Alcohol & Drugs',
      'fatigue-rest': 'Fatigue & Rest',
      'emergency-procedures': 'Emergency Procedures',
      'insight-practice': 'Insight Practice',
      'bicycle-interactions': 'Bicycle Interactions',
      'roundabout-rules': 'Roundabout Rules',
      'tram-interactions': 'Tram Interactions',
      'pedestrian-crossings': 'Pedestrian Crossings',
      'construction-zones': 'Construction Zones',
      'weather-conditions': 'Weather Conditions'
    };
    return testNames[testRoute] || 'Practice Test';
  };

  const handleNextTest = () => {
    const nextTest = getNextTest(testType || 'traffic-rules-signs');
    navigate(`/practice/${nextTest}`);
  };

  // Save results when finished
  useEffect(() => {
    if (isFinished && sessionId) {
      // Record study session for streak tracking
      recordStudySession();
      
      // Complete the study session with real performance data
      const performance = Math.round((score / questions.length) * 100);
      studyScheduler.completePracticeSession(sessionId, performance);
      
      // Calculate actual time spent
      const actualTimeSpent = sessionStartTime ? 
        Math.round((Date.now() - sessionStartTime.getTime()) / 1000 / 60) : 
        questions.length * 0.5; // Fallback: 30 seconds per question
      
      const result = {
        testId: testType || 'practice',
        score: score,
        category: getTestData(testType || 'traffic-rules-signs').name,
        date: new Date().toISOString(),
        timeSpent: actualTimeSpent,
        correctAnswers: score,
        totalQuestions: questions.length,
        percentage: Math.round((score / questions.length) * 100)
      };
      
      if (user) {
        dataPersistence.saveTestResult(result).catch(() => {});
      } else {
        const prev = localStorage.getItem('practiceResults');
        const arr = prev ? JSON.parse(prev) : [];
        arr.unshift(result);
        localStorage.setItem('practiceResults', JSON.stringify(arr));
      }
      
      localStorage.setItem('refreshProgress', '1');
    }
  }, [isFinished, user, testType, score, questions.length, sessionId, sessionStartTime, recordStudySession]);

  // Results page
  if (isFinished) {
    const percentage = Math.round((score / questions.length) * 100);
    const nextTestRoute = getNextTest(testType || 'traffic-rules-signs');
    const nextTestName = getTestDisplayName(nextTestRoute);
    
    return (
      <div className="practice-test-result-emotional">
        <div className="result-card-emotional">
          <div className="result-title-emotional">Test Complete!</div>
          <div className="result-score-emotional">
            Score: <span>{score} / {questions.length}</span>
            <div className="result-percentage">({percentage}%)</div>
          </div>
          
          {percentage >= 80 && (
            <div className="result-message success">
              Excellent
            </div>
          )}
          {percentage >= 60 && percentage < 80 && (
            <div className="result-message good">
              Good Job
            </div>
          )}
          {percentage < 60 && (
            <div className="result-message practice">
              Keep Practicing
            </div>
          )}
          
          <div className="progress-details">
            <div className="weak-areas">
              Next Topic: <strong>{nextTestName}</strong>
            </div>
          </div>
          
          <div className="result-actions-row">
            <button 
              className="practice-nav-btn result-btn-emotional primary" 
              onClick={handleNextTest}
            >
              Start {nextTestName}
            </button>
            <button 
              className="practice-nav-btn result-btn-emotional" 
              onClick={() => window.location.reload()}
            >
              Retake Test
            </button>
            <button 
              className="practice-nav-btn result-btn-emotional" 
              onClick={() => navigate('/')}
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Main test interface - ALWAYS render something
  const currentQuestion = questions[currentQuestionIndex];
  const progress = questions.length > 0 ? ((currentQuestionIndex + 1) / questions.length) * 100 : 0;

  // If no questions loaded yet, show loading
  if (questions.length === 0) {
    return (
      <div className="practice-test">
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <div>Loading questions...</div>
        </div>
      </div>
    );
  }

  // If no current question, show error
  if (!currentQuestion) {
    return (
      <div className="practice-test">
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <div>Question not found. Please try again.</div>
          <button onClick={() => navigate('/dashboard')} className="practice-nav-btn">
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="quiz-page-wrapper">
      <audio ref={correctSoundRef} src="/sounds/correct.mp3" preload="auto" />
      <div className="practice-test">
        
        <div className="practice-progress-bar">
          <div className="practice-progress-fill" style={{ width: `${progress}%` }} />
        </div>
        
        <div className="practice-header-row">
          <div className="practice-subject-row">
            <span className="practice-question-number">
              Question {currentQuestionIndex + 1} of {questions.length}:
            </span>
            <span className="practice-question-subject">{currentQuestion.subject}</span>
          </div>
          <div className="practice-header-controls">
              <button
              className="practice-exit-btn" 
              onClick={() => navigate('/dashboard')}
              aria-label="Back to Dashboard"
              title="Back to Dashboard"
            >
              ←
              </button>
            <button className={`practice-mute-btn${isMuted ? ' muted' : ''}`} onClick={toggleMute} aria-label={isMuted ? 'Unmute' : 'Mute'}>
              {isMuted ? '🔇' : '🔊'}
            </button>
          </div>
        </div>

        <div className="practice-question-text">
          {currentQuestion.text}
        </div>

        {currentQuestion.imageUrl && (
          <div className="practice-question-image">
            <img src={currentQuestion.imageUrl} alt="question visual" style={{ maxHeight: '220px', width: 'auto', objectFit: 'contain' }} />
          </div>
        )}

        <div className="practice-options-list">
          {currentQuestion.options.map((option, idx) => (
            <label key={option.id} className={`practice-option-label${selectedAnswer === option.id ? ' selected' : ''}${isAnswered && currentQuestion.correctAnswerId === option.id ? ' correct' : ''}${isAnswered && selectedAnswer === option.id && selectedAnswer !== currentQuestion.correctAnswerId ? ' incorrect' : ''}`}> 
              <input
                type="radio"
                name="practice-option"
                value={option.id}
                checked={selectedAnswer === option.id}
                onChange={() => handleAnswer(option.id)}
                disabled={isAnswered}
              />
              <span className="practice-option-letter">{String.fromCharCode(65 + idx)}</span>
              <span className="practice-option-text">{option.text}</span>
            </label>
          ))}
        </div>

        {showExplanation && (
          <div className="practice-explanation-section">
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {isAnswered && (
                <span style={{
                  position: 'absolute',
                  left: 0,
                  color: isCorrect ? '#059669' : '#dc2626',
                  background: isCorrect ? 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)' : 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  marginRight: '0.7rem',
                  minWidth: 0,
                  whiteSpace: 'nowrap',
                  borderRadius: '8px',
                  padding: '0.25em 0.6em',
                  display: 'inline-block',
                  boxShadow: isCorrect ? '0 1px 4px rgba(5, 150, 105, 0.2)' : '0 1px 4px rgba(220, 38, 38, 0.2)',
                  border: isCorrect ? '1px solid #a7f3d0' : '1px solid #fecaca',
                  textTransform: 'uppercase',
                  letterSpacing: '0.3px',
                }}>
                  {motivationWord}
                </span>
              )}
              <div className="practice-explanation-label" style={{ fontSize: '1rem', margin: '0 auto' }}>Explanation</div>
            </div>
            <div className="practice-explanation-text" style={{ fontSize: '0.95rem' }}>{currentQuestion.explanation}</div>
          </div>
        )}
        
        {/* Always show Next button after answering */}
        {isAnswered && (
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '0' }}>
            <button
              className="practice-nav-btn"
              onClick={() => {
                if (currentQuestionIndex < questions.length - 1) {
                  nextQuestion();
                } else {
                  nextQuestion();
                }
              }}
            >
              {currentQuestionIndex < questions.length - 1 ? 'Next' : 'Finish'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};