import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { dataPersistence } from '../services/dataPersistence';
import { performanceTracker } from '../services/performanceTracker';
import { smartQuestionSelector } from '../services/smartQuestionSelector';
import type { Question } from '../types';
import './PracticeTest.css';
import { FiMic, FiMicOff } from 'react-icons/fi';

// Add this at the top of the file, after imports
// @ts-ignore
// eslint-disable-next-line
type SpeechRecognition = any;

interface PracticeTestProps {
  questions: Question[];
  testKey: string;
  testName: string;
}

export const PracticeTest: React.FC<PracticeTestProps> = ({ questions, testKey, testName }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [voiceMode, setVoiceMode] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30); // 30 seconds per question
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [smartQuestions, setSmartQuestions] = useState<Question[]>(questions);
  const [isPersonalized, setIsPersonalized] = useState(false);
  const [questionStartTime, setQuestionStartTime] = useState<number>(Date.now());
  const [isListening, setIsListening] = useState(false);
  const [voiceError, setVoiceError] = useState<string | null>(null);
  const [voiceSupported, setVoiceSupported] = useState<boolean>(true);
  const [isFinished, setIsFinished] = useState(false);
  
  const { t_nested, getVoiceCommands, getSpeechLang, getSpeechVoice } = useLanguage();
  const { user } = useAuth();
  const speechRef = useRef<SpeechSynthesisUtterance | null>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const navigate = useNavigate();
  const correctSoundRef = useRef<HTMLAudioElement | null>(null);

  const correctWords = [
    'Great job!', 'Well done!', 'Excellent!', 'Nice work!', 'You got it!', 'Fantastic!', 'Correct!', 'Awesome!', 'Brilliant!', 'Keep it up!'
  ];
  const wrongWords = [
    'Keep trying!', 'Don’t give up!', 'Almost!', 'Try again!', 'You can do it!', 'Not quite.', 'Stay focused!', 'Keep practicing!', 'Don’t worry!', 'Learn and improve!'
  ];
  const [motivationWord, setMotivationWord] = useState('');

  // Initialize smart question selection
  useEffect(() => {
    initializeSmartQuestions();
  }, []);

  const initializeSmartQuestions = async () => {
    try {
      // Initialize performance tracker
      await performanceTracker.initialize();
      
      // Check if we have enough data for personalization
      if (smartQuestionSelector.hasEnoughData()) {
        const personalizedSet = await smartQuestionSelector.getPersonalizedQuestions(
          questions,
          Math.min(questions.length, 15), // Use up to 15 questions for personalized set
          questions[0]?.subject
        );
        
        if (personalizedSet.isPersonalized) {
          setSmartQuestions(personalizedSet.questions);
          setIsPersonalized(true);
        }
      }
    } catch (error) {
      console.error('Error initializing smart questions:', error);
      // Fallback to original questions
      setSmartQuestions(questions);
    }
  };

  const currentQuestion = smartQuestions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / smartQuestions.length) * 100;

  // Initialize speech recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = getSpeechLang();

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript.toLowerCase();
        handleVoiceAnswer(transcript);
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
      };
    }
  }, [getSpeechLang]);

  // Feature detection for SpeechRecognition
  useEffect(() => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      setVoiceSupported(false);
    }
  }, []);

  // Timer countdown
  useEffect(() => {
    if (timeLeft > 0 && !isAnswered) {
      timerRef.current = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    } else if (timeLeft === 0 && !isAnswered) {
      handleAnswer(''); // Time's up, mark as incorrect
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [timeLeft, isAnswered]);

  // Reset timer and start time for new question
  useEffect(() => {
    setTimeLeft(30);
    setIsAnswered(false);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setIsCorrect(null);
    setQuestionStartTime(Date.now());
  }, [currentQuestionIndex]);

  // TTS for question and options reading
  useEffect(() => {
    if (!isMuted && currentQuestion) {
      speakQuestionAndOptions(currentQuestion);
    }
    // Stop TTS if muted
    if (isMuted) {
      window.speechSynthesis.cancel();
    }
  }, [currentQuestionIndex, isMuted, currentQuestion]);

  // Speak both question and all options
  const speakQuestionAndOptions = (question: Question) => {
    // Cancel any ongoing speech
    window.speechSynthesis.cancel();
    // Compose the full text: question + options
    let fullText = question.text;
    question.options.forEach((option, idx) => {
      fullText += ` ${String.fromCharCode(65 + idx)}. ${option.text}.`;
    });
    // Speak
    speechRef.current = new SpeechSynthesisUtterance(fullText);
    speechRef.current.rate = 0.9;
    speechRef.current.pitch = 1;
    speechRef.current.lang = getSpeechLang();
    const voiceName = getSpeechVoice();
    if (voiceName) {
      const voices = window.speechSynthesis.getVoices();
      const voice = voices.find(v => v.name === voiceName);
      if (voice) {
        speechRef.current.voice = voice;
      }
    }
    window.speechSynthesis.speak(speechRef.current);
  };

  const handleVoiceAnswer = (transcript: string) => {
    const answerMap = getVoiceCommands();
    const answer = answerMap[transcript];
    if (answer !== undefined && !isAnswered) {
      const optionIndex = answer - 1; // Convert 1-based to 0-based
      const optionId = currentQuestion.options[optionIndex]?.id;
      if (optionId) {
        handleAnswer(optionId);
      }
    }
  };

  const handleAnswer = async (answerId: string) => {
    if (isAnswered) return;

    setIsAnswered(true);
    setSelectedAnswer(answerId);
    
    // Stop TTS immediately
    window.speechSynthesis.cancel();
    
    const correct = answerId === currentQuestion.correctAnswerId;
    setIsCorrect(correct);
    
    // Calculate time spent on this question
    const timeSpent = Math.round((Date.now() - questionStartTime) / 1000);
    
    // Track performance for smart learning
    try {
      await performanceTracker.trackQuestionAttempt(
        currentQuestion.id,
        currentQuestion.subject,
        correct,
        timeSpent
      );
    } catch (error) {
      console.error('Error tracking performance:', error);
    }
    
    if (correct) {
      setScore(score + 1);
      setMotivationWord(correctWords[Math.floor(Math.random() * correctWords.length)]);
      if (correct && !isMuted && correctSoundRef.current) {
        correctSoundRef.current.currentTime = 0;
        correctSoundRef.current.play();
      }
    } else {
      setMotivationWord(wrongWords[Math.floor(Math.random() * wrongWords.length)]);
    }

    // Show explanation immediately
    setShowExplanation(true);
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < smartQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setIsFinished(true);
    }
  };

  // Automatically go to results when last question is answered
  // Remove this useEffect:
  // useEffect(() => {
  //   if (
  //     currentQuestionIndex === questions.length - 1 &&
  //     isAnswered
  //   ) {
  //     nextQuestion();
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [isAnswered, currentQuestionIndex]);

  // Voice mode toggle logic with error handling
  const toggleVoiceMode = () => {
    setVoiceError(null);
    setVoiceMode((prev) => {
      const next = !prev;
      if (recognitionRef.current && voiceSupported) {
        try {
          if (next && !isListening) {
            recognitionRef.current.start();
            setIsListening(true);
          } else if (!next && isListening) {
            recognitionRef.current.stop();
            setIsListening(false);
          }
        } catch (err: any) {
          if (err && err.name === 'NotAllowedError') {
            setVoiceError('Microphone access denied. Please allow microphone permissions in your browser settings.');
          } else if (err && err.name === 'NotSupportedError') {
            setVoiceError('Voice recognition is not supported in this browser. Please use Google Chrome.');
          } else {
            setVoiceError('Microphone error: Please refresh the page or check your browser permissions.');
          }
        }
      }
      return next;
    });
  };

  // Stop listening when question changes or voice mode is off
  useEffect(() => {
    if (!voiceMode && recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  }, [voiceMode, currentQuestionIndex]);

  // Listen for speech recognition events
  useEffect(() => {
    if (recognitionRef.current) {
      recognitionRef.current.onstart = () => setIsListening(true);
      recognitionRef.current.onend = () => setIsListening(false);
      recognitionRef.current.onerror = (event: any) => {
        setVoiceError('Microphone error: ' + (event.error || 'Unknown error. Please refresh the page.'));
        setIsListening(false);
        setVoiceMode(false);
      };
    }
  }, []);

  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (!isMuted) {
      window.speechSynthesis.cancel();
    } else {
      speakQuestionAndOptions(currentQuestion); // Re-speak question and options when unmuted
    }
  };

  const getLogoMood = () => {
    if (isCorrect === true) return 'success';
    if (isCorrect === false) return 'encouraging';
    if (timeLeft < 10) return 'thinking';
    return 'happy';
  };

  // Add motivational quotes for results
  // 1. Remove the drivingMotivations array, motivationResult state, setMotivationResult, and related useEffect.
  // 2. In the results page (isFinished block), remove the <div className="result-motivation-emotional">{motivationResult}</div>.
  // 3. Ensure all opened tags are closed and linter errors are fixed.

  useEffect(() => {
    if (isFinished) {
      // Save result to backend or localStorage
      const result = {
        testId: testKey,
        score: score,
        category: testName || 'Practice',
        date: new Date().toISOString(),
        timeSpent: smartQuestions.length * 30, // estimate, or track if you want
        correctAnswers: score,
        totalQuestions: smartQuestions.length,
      };
      if (user) { // Use user from AuthContext
        dataPersistence.saveTestResult(result).catch(console.error);
      } else {
        // Save to localStorage for anonymous users
        const prev = localStorage.getItem('practiceResults');
        const arr = prev ? JSON.parse(prev) : [];
        arr.unshift(result);
        localStorage.setItem('practiceResults', JSON.stringify(arr));
      }
      // Set flag to refresh dashboard performance
      localStorage.setItem('refreshProgress', '1');
    }
  }, [isFinished, user, testKey, testName, score, smartQuestions.length]);

  // Add a helper to get the next test key
  const testOrder = [
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
  ];
  const currentIndex = testOrder.indexOf(testKey);
  // Change nextTestKey logic to find the next test in the testOrder array (ascending order)
  const nextTestKey = currentIndex >= 0 && currentIndex < testOrder.length - 1 ? testOrder[currentIndex + 1] : null;

  if (isFinished) {
    return (
      <div className="practice-test-result-emotional">
        <div className="result-card-emotional">
          <div className="result-title-emotional">Test Complete!</div>
          <div className="result-score-emotional">Score: <span>{score} / {smartQuestions.length}</span></div>
          {isPersonalized && (
            <div className="personalized-completion-note">
              This practice was tailored to your learning needs
            </div>
          )}
          <div className="result-actions-row">
            <button className="practice-nav-btn result-btn-emotional" onClick={() => window.location.reload()}>Retake Test</button>
            <button className="practice-nav-btn result-btn-emotional" onClick={() => navigate('/practice')}>Return to Practice</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="quiz-page-wrapper">
      <audio ref={correctSoundRef} src="/sounds/correct.mp3" preload="auto" />
      <div className="practice-test">
        {/* Error message for voice mode */}
        {voiceError && (
          <div className="practice-voice-error">{voiceError}</div>
        )}
        {/* Progress Bar and Subject */}
        <div className="practice-progress-bar">
          <div className="practice-progress-fill" style={{ width: `${progress}%` }} />
        </div>
        <div className="practice-header-row">
          <div className="practice-subject-row">
            <span className="practice-question-number">Question {currentQuestionIndex + 1} of {smartQuestions.length}:</span>
            <span className="practice-question-subject">{currentQuestion.subject}</span>
            {isPersonalized && (
              <span className="personalized-indicator">✨</span>
            )}
          </div>
          <div className="practice-header-controls">
            {voiceSupported ? (
              <button
                className={`practice-voice-btn${voiceMode ? ' active' : ''}`}
                onClick={toggleVoiceMode}
                aria-label={voiceMode ? 'Disable Voice Mode' : 'Enable Voice Mode'}
                title={voiceMode ? 'Disable Voice Mode' : 'Enable Voice Mode'}
                type="button"
              >
                {voiceMode ? <FiMic color={isListening ? '#1A3E7A' : '#888'} /> : <FiMicOff color="#888" />}
                {voiceMode && isListening && <span className="voice-indicator-dot" />}
              </button>
            ) : (
              <button
                className="practice-voice-btn"
                disabled
                aria-label="Voice recognition not supported"
                title="Voice recognition is not supported in this browser. Please use Google Chrome."
                type="button"
              >
                <FiMicOff color="#ccc" />
              </button>
            )}
            <button className={`practice-mute-btn${isMuted ? ' muted' : ''}`} onClick={toggleMute} aria-label={isMuted ? 'Unmute' : 'Mute'}>
              {isMuted ? '🔇' : '🔊'}
            </button>
          </div>
        </div>

        {/* Question Text */}
        <div className="practice-question-text">
          {currentQuestion.text}
        </div>

        {/* Image (if any) */}
        {currentQuestion.imageUrl && (
          <div className="practice-question-image">
            <img src={currentQuestion.imageUrl} alt="question visual" style={{ maxHeight: '220px', width: 'auto', objectFit: 'contain' }} />
          </div>
        )}

        {/* Options */}
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

        {/* Explanation */}
        {showExplanation && (
          <div className="practice-explanation-section">
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {isAnswered && (
                <span style={{
                  position: 'absolute',
                  left: 0,
                  color: isCorrect ? '#00a651' : '#e53935',
                  background: isCorrect ? '#e6fbe6' : '#fdeaea',
                  fontSize: '0.95rem',
                  fontWeight: 500,
                  marginRight: '0.7rem',
                  minWidth: 0,
                  whiteSpace: 'nowrap',
                  borderRadius: '0.6em',
                  padding: '0.18em 0.7em',
                  display: 'inline-block',
                }}>
                  {motivationWord}
                </span>
              )}
              <div className="practice-explanation-label" style={{ fontSize: '1rem', margin: '0 auto' }}>{t_nested('practice.explanation')}</div>
            </div>
            <div className="practice-explanation-text" style={{ fontSize: '0.95rem' }}>{currentQuestion.explanation}</div>
          </div>
        )}
        {showExplanation && (
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1.5rem' }}>
            <button
              className="practice-nav-btn"
              onClick={() => {
                if (currentQuestionIndex < smartQuestions.length - 1) {
                  nextQuestion();
                } else {
                  if (!isAnswered) {
                    handleAnswer('');
                  }
                  nextQuestion();
                }
              }}
              disabled={currentQuestionIndex < smartQuestions.length - 1 && !isAnswered}
            >
              {currentQuestionIndex < smartQuestions.length - 1 ? 'Next Question' : 'Finish'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};