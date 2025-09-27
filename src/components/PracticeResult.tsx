import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import './PracticeResult.css';

export function PracticeResult() {
  const { test, score, total } = useParams<{ test: string; score: string; total: string }>();
  const { t_nested } = useLanguage();
  const navigate = useNavigate();

  const scoreNum = parseInt(score || '0');
  const totalNum = parseInt(total || '0');
  const percentage = totalNum > 0 ? Math.round((scoreNum / totalNum) * 100) : 0;

  const getResultMessage = () => {
    if (percentage >= 80) {
      return t_nested('results.congratulations');
    } else if (percentage >= 60) {
      return t_nested('results.wellDone');
    } else {
      return t_nested('results.keepPracticing');
    }
  };

  const getResultColor = () => {
    if (percentage >= 80) return 'blue';
    if (percentage >= 60) return 'neutral';
    return 'red';
  };

  return (
    <div className="result-page">
      <div className="result-content-row">
        <div className="result-content-main">
          <div className="result-card">
            <div className="result-header">
              <h1>{t_nested('results.title')}</h1>
              <div className={`result-message ${getResultColor()}`}>
                {getResultMessage()}
              </div>
            </div>

            <div className="result-stats">
              <div className="stat-row">
                <span className="stat-label">{t_nested('results.score')}:</span>
                <span className="stat-value">{scoreNum} / {totalNum}</span>
              </div>
              <div className="stat-row">
                <span className="stat-label">{t_nested('results.percentage')}:</span>
                <span className={`stat-value ${getResultColor()}`}>{percentage}%</span>
              </div>
              <div className="stat-row">
                <span className="stat-label">{t_nested('results.correct')}:</span>
                <span className="stat-value blue">{scoreNum}</span>
              </div>
              <div className="stat-row">
                <span className="stat-label">{t_nested('results.incorrect')}:</span>
                <span className="stat-value red">{totalNum - scoreNum}</span>
              </div>
            </div>

            <div className="result-actions">
              <button 
                className="action-btn primary"
                onClick={() => navigate('/')}
              >
                Back to Dashboard
              </button>
              <button 
                className="action-btn secondary"
                onClick={() => navigate(`/practice/${test}`)}
              >
                Retake Test
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 