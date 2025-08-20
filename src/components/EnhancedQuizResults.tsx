import React, { useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useNavigate } from 'react-router-dom';
import { FiAward, FiTrendingUp, FiZap, FiCheckCircle, FiXCircle, FiClock, FiBarChart } from 'react-icons/fi';
import './MockExamResults.css';

interface EnhancedQuizResultsProps {
  score: number;
  total: number;
  timeSpent: number;
  questions: any[];
  selectedAnswers: { [key: string]: string };
  difficulty: string;
  onRetry: () => void;
}

export const EnhancedQuizResults: React.FC<EnhancedQuizResultsProps> = ({
  score,
  total,
  timeSpent,
  questions,
  selectedAnswers,
  difficulty,
  onRetry
}) => {
  const { t_nested } = useLanguage();
  const navigate = useNavigate();

  const percentage = Math.round((score / total) * 100);
  const minutes = Math.floor(timeSpent / 60);
  const seconds = timeSpent % 60;

  const getDifficultyConfig = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return {
          passRate: 70,
          icon: <FiAward size={48} />,
          color: '#28a745',
          title: t_nested('quizSelection.level1.title'),
          subtitle: t_nested('quizSelection.level1.subtitle')
        };
      case 'intermediate':
        return {
          passRate: 75,
          icon: <FiTrendingUp size={48} />,
          color: '#ffc107',
          title: t_nested('quizSelection.level2.title'),
          subtitle: t_nested('quizSelection.level2.subtitle')
        };
      case 'advanced':
        return {
          passRate: 80,
          icon: <FiZap size={48} />,
          color: '#dc3545',
          title: t_nested('quizSelection.level3.title'),
          subtitle: t_nested('quizSelection.level3.subtitle')
        };
      default:
        return {
          passRate: 70,
          icon: <FiAward size={48} />,
          color: '#28a745',
          title: t_nested('quizSelection.level1.title'),
          subtitle: t_nested('quizSelection.level1.subtitle')
        };
    }
  };

  const config = getDifficultyConfig(difficulty);
  const passed = percentage >= config.passRate;

  // Save progress when component mounts
  useEffect(() => {
    const saveProgress = () => {
      const existingProgress = localStorage.getItem('quizProgress');
      let progress = existingProgress ? JSON.parse(existingProgress) : {
        beginner: { passed: false, bestScore: 0, attempts: 0 },
        intermediate: { passed: false, bestScore: 0, attempts: 0 },
        advanced: { passed: false, bestScore: 0, attempts: 0 }
      };

      const levelKey = difficulty as keyof typeof progress;
      const currentLevel = progress[levelKey];
      
      // Update attempts and best score
      currentLevel.attempts += 1;
      if (percentage > currentLevel.bestScore) {
        currentLevel.bestScore = percentage;
      }
      
      // Update passed status if they passed
      if (passed) {
        currentLevel.passed = true;
      }

      localStorage.setItem('quizProgress', JSON.stringify(progress));
    };

    saveProgress();
  }, [difficulty, percentage, passed]);

  const getResultMessage = () => {
    if (passed) {
      if (percentage >= 90) {
        return t_nested('quizResults.excellent');
      } else if (percentage >= 80) {
        return t_nested('quizResults.great');
      } else {
        return t_nested('quizResults.good');
      }
    } else {
      if (percentage >= config.passRate - 10) {
        return t_nested('quizResults.close');
      } else {
        return t_nested('quizResults.needPractice');
      }
    }
  };

  const getDifficultyLabel = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return t_nested('quizSelection.difficulty.beginner');
      case 'intermediate': return t_nested('quizSelection.difficulty.intermediate');
      case 'advanced': return t_nested('quizSelection.difficulty.advanced');
      default: return difficulty;
    }
  };

  return (
    <div className="mock-exam-results">
      <div className="mock-exam-results-card">
        <div className="results-header">
          <h1>{t_nested('quiz.results')}</h1>
          <div className="quiz-level-info">
            <div 
              className="quiz-level-icon"
              style={{ backgroundColor: config.color }}
            >
              {config.icon}
            </div>
            <div>
              <h2>{config.title}</h2>
              <p>{config.subtitle}</p>
              <span 
                className="difficulty-badge"
                style={{ backgroundColor: config.color }}
              >
                {getDifficultyLabel(difficulty)}
              </span>
            </div>
          </div>
        </div>

        <div className="results-summary">
          <div className="score-card">
            <div className="score-circle" style={{ borderColor: config.color }}>
              <div className="score-percentage" style={{ color: config.color }}>
                {percentage}%
              </div>
              <div className="score-fraction">
                {score}/{total}
              </div>
            </div>
            <div className="score-status">
              {passed ? (
                <div className="passed-status">
                  <FiCheckCircle size={24} />
                  <span>{t_nested('quizResults.passed')}</span>
                </div>
              ) : (
                <div className="failed-status">
                  <FiXCircle size={24} />
                  <span>{t_nested('quizResults.failed')}</span>
                </div>
              )}
            </div>
          </div>

          <div className="results-details">
            <div className="detail-item">
              <FiBarChart size={20} />
              <div>
                <span className="detail-label">{t_nested('quiz.score')}</span>
                <span className="detail-value">{score} {t_nested('quiz.correct')}</span>
              </div>
            </div>
            <div className="detail-item">
              <FiClock size={20} />
              <div>
                <span className="detail-label">{t_nested('quiz.timeSpent')}</span>
                <span className="detail-value">{minutes}:{seconds.toString().padStart(2, '0')}</span>
              </div>
            </div>
            <div className="detail-item">
              <FiAward size={20} />
              <div>
                <span className="detail-label">{t_nested('quiz.passRate')}</span>
                <span className="detail-value">{config.passRate}%</span>
              </div>
            </div>
          </div>
        </div>

        <div className="result-message">
          <h3>{getResultMessage()}</h3>
          <p>
            {passed 
              ? t_nested('quizResults.congratulations')
              : t_nested('quizResults.keepPracticing')
            }
          </p>
        </div>

        <div className="results-actions">
          <button 
            className="retry-btn"
            onClick={onRetry}
            style={{ backgroundColor: config.color }}
          >
            {t_nested('quiz.tryAgain')}
          </button>
          <button 
            className="back-to-quizzes-btn"
            onClick={() => navigate('/quiz-selection')}
          >
            {t_nested('quizResults.backToQuizzes')}
          </button>
          <button 
            className="back-to-practice-btn"
            onClick={() => navigate('/practice')}
          >
            {t_nested('quiz.backToPractice')}
          </button>
        </div>
      </div>
    </div>
  );
};
