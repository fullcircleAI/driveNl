import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import type { Question } from '../types';
import './MockExamResults.css';

interface MockExamResultsProps {
  score: number;
  total: number;
  timeSpent: number;
  questions: Question[];
  selectedAnswers: { [key: string]: string };
  onRetry: () => void;
}

export const MockExamResults: React.FC<MockExamResultsProps> = ({
  score,
  total,
  timeSpent,
  questions,
  selectedAnswers,
  onRetry
}) => {
  const [showDetailedResults, setShowDetailedResults] = useState(false);
  const { t_nested } = useLanguage();
  const navigate = useNavigate();

  const percentage = Math.round((score / total) * 100);
  const passed = percentage >= 70; // 70% pass rate
  const passThreshold = Math.ceil(total * 0.7);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  const getCategoryBreakdown = () => {
    const categories: { [key: string]: { correct: number; total: number } } = {};
    
    questions.forEach(question => {
      const category = question.subject;
      if (!categories[category]) {
        categories[category] = { correct: 0, total: 0 };
      }
      categories[category].total++;
      
      if (selectedAnswers[question.id] === question.correctAnswerId) {
        categories[category].correct++;
      }
    });

    return Object.entries(categories).map(([category, stats]) => ({
      category,
      correct: stats.correct,
      total: stats.total,
      percentage: Math.round((stats.correct / stats.total) * 100)
    }));
  };

  const categoryBreakdown = getCategoryBreakdown();

  const getWeakestCategories = () => {
    return categoryBreakdown
      .filter(cat => cat.percentage < 70)
      .sort((a, b) => a.percentage - b.percentage)
      .slice(0, 3);
  };

  const weakestCategories = getWeakestCategories();

  return (
    <div className="container">
      <div className="mock-exam-results-card">
      <div className="results-header">
        <h1>{t_nested('quiz.results')}</h1>
        <div className="results-summary">
          <div className="score-card">
            <div className="score-final-simple">Score: {score} / {total}</div>
            <div className="score-percentage-simple">{percentage}%</div>
            <div className="score-status">
              <span className={`status-badge ${passed ? 'passed' : 'failed'}`}>{passed ? 'PASS' : 'FAIL'}</span>
              <div className="pass-threshold">Required: {passThreshold} correct (70%)</div>
            </div>
          </div>

          <div className="exam-stats">
            <div className="stat-item">
              <div className="stat-icon">⏱️</div>
              <div className="stat-content">
                <div className="stat-label">Time Spent</div>
                <div className="stat-value">{formatTime(timeSpent)}</div>
              </div>
            </div>
            <div className="stat-item">
              <div className="stat-icon">📊</div>
              <div className="stat-content">
                <div className="stat-label">Accuracy</div>
                <div className="stat-value">{percentage}%</div>
              </div>
            </div>
            <div className="stat-item">
              <div className="stat-icon">🎯</div>
              <div className="stat-content">
                <div className="stat-label">Questions Answered</div>
                <div className="stat-value">{Object.keys(selectedAnswers).length}/{total}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="category-performance">
        <h3>Performance by Category</h3>
        <div className="category-grid">
          {categoryBreakdown.map(category => (
            <div key={category.category} className="category-item">
              <div className="category-header">
                <span className="category-name">{category.category}</span>
                <span className="category-score">{category.correct}/{category.total}</span>
              </div>
              <div className="category-bar">
                <div 
                  className={`category-fill ${category.percentage >= 70 ? 'good' : category.percentage >= 50 ? 'average' : 'poor'}`}
                  style={{ width: `${category.percentage}%` }}
                />
              </div>
              <div className="category-percentage">{category.percentage}%</div>
            </div>
          ))}
        </div>
      </div>

      {weakestCategories.length > 0 && (
        <div className="focus-areas">
          <h3>Areas for Improvement</h3>
          <div className="focus-list">
            {weakestCategories.map(category => (
              <div key={category.category} className="focus-item">
                <span className="focus-category">{category.category}</span>
                <span className="focus-score">{category.percentage}%</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="results-actions">
        <button 
          className="action-btn detailed-btn"
          onClick={() => setShowDetailedResults(!showDetailedResults)}
        >
          {showDetailedResults ? 'Hide' : 'Show'} Detailed Results
        </button>
        
        <button 
          className="action-btn retry-btn"
          onClick={onRetry}
        >
          Try Again
        </button>
        
        <button 
          className="action-btn practice-btn"
          onClick={() => navigate('/practice')}
        >
          Practice More
        </button>
      </div>

      {showDetailedResults && (
        <div className="detailed-results">
          <h3>Question-by-Question Results</h3>
          <div className="questions-list">
            {questions.map((question, index) => {
              const selectedAnswer = selectedAnswers[question.id];
              const isCorrect = selectedAnswer === question.correctAnswerId;
              const correctOption = question.options.find(opt => opt.id === question.correctAnswerId);
              const selectedOption = question.options.find(opt => opt.id === selectedAnswer);
              
              return (
                <div key={question.id} className={`question-result ${isCorrect ? 'correct' : 'incorrect'}`}>
                  <div className="question-header">
                    <span className="question-number">Q{index + 1}</span>
                    <span className={`result-status ${isCorrect ? 'correct' : 'incorrect'}`}>
                      {isCorrect ? '✓' : '✗'}
                    </span>
                  </div>
                  
                  <div className="question-content">
                    <div className="question-text">{question.text}</div>
                    
                    {question.imageUrl && (
                      <div className="question-image">
                        <img 
                          src={question.imageUrl} 
                          alt={question.imageHint || 'Question image'}
                        />
                      </div>
                    )}
                    
                    <div className="answer-details">
                      <div className="correct-answer">
                        <strong>Correct Answer:</strong> {correctOption?.text}
                      </div>
                      {!isCorrect && selectedOption && (
                        <div className="your-answer">
                          <strong>Your Answer:</strong> {selectedOption.text}
                        </div>
                      )}
                      <div className="explanation">
                        <strong>Explanation:</strong> {question.explanation}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
      </div>
    </div>
  );
}; 