import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { dataPersistence } from '../services/dataPersistence';
import { performanceTracker } from '../services/performanceTracker';
import { smartQuestionSelector } from '../services/smartQuestionSelector';
import './ProgressTracker.css';

export const ProgressTracker: React.FC = () => {
  const { user } = useAuth();
  const { t_nested } = useLanguage();
  const [progressData, setProgressData] = useState<any>(null);
  const [learningInsights, setLearningInsights] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Only reload if refreshProgress flag is set, otherwise use cached
    const refresh = localStorage.getItem('refreshProgress');
    const cached = localStorage.getItem('dashboardProgressCache');
    if (!refresh && cached) {
      try {
        const parsed = JSON.parse(cached);
        if (parsed && typeof parsed === 'object' && 'progress' in parsed && 'insights' in parsed) {
          setProgressData(parsed.progress);
          setLearningInsights(parsed.insights);
          setIsLoading(false);
        } else {
          throw new Error('Invalid cache structure');
        }
      } catch (error) {
        console.warn('Failed to parse cached progress data:', error);
        localStorage.removeItem('dashboardProgressCache');
        loadProgressAndInsights();
      }
    } else {
      loadProgressAndInsights();
    }
  }, []);

  const loadProgressAndInsights = async () => {
    try {
      setIsLoading(true);
      
      // Load progress data
      let progress = null;
      if (user) {
        try {
          const results = await dataPersistence.getUserTestResults();
          progress = processProgressData(results);
        } catch (error) {
          console.error('Error loading progress:', error);
        }
      } else {
        // Load from localStorage for anonymous users
        const stored = localStorage.getItem('practiceResults');
        if (stored) {
          try {
            const results = JSON.parse(stored);
            progress = processProgressData(results);
          } catch (error) {
            console.error('Error parsing stored progress:', error);
          }
        }
      }

      // If no progress data, create demo data for testing
      if (!progress) {
        progress = {
          totalTests: 3,
          averageScore: 75,
          recentScore: 82,
          trend: 'improving',
          lastTestDate: new Date().toISOString()
        };
      }

      // Load learning insights
      let insights = null;
      try {
        await performanceTracker.initialize();
        if (smartQuestionSelector.hasEnoughData()) {
          const recommendations = await smartQuestionSelector.getPracticeRecommendations();
          const focus = smartQuestionSelector.getPracticeFocus();
          insights = { recommendations, focus };
        }
      } catch (error) {
        console.error('Error loading insights:', error);
      }

      // If no insights data, create demo data for testing
      if (!insights) {
        insights = {
          focus: {
            primaryFocus: 'Road Signs',
            confidence: 0.8
          },
          recommendations: [
            {
              priority: 'high',
              subject: 'Traffic Lights',
              reason: 'Focus on Traffic Lights - you\'re struggling with this topic'
            },
            {
              priority: 'medium',
              subject: 'Priority Rules',
              reason: 'Improve Priority Rules - you\'re doing well but can get better'
            }
          ]
        };
      }

      setProgressData(progress);
      setLearningInsights(insights);
      
      // Cache the loaded data
      try {
        const cacheData = { progress, insights };
        localStorage.setItem('dashboardProgressCache', JSON.stringify(cacheData));
        localStorage.removeItem('refreshProgress');
      } catch (cacheError) {
        console.error('Error caching data:', cacheError);
      }

    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const processProgressData = (results: any[]) => {
    try {
      if (!results || !Array.isArray(results) || results.length === 0) {
        return null;
      }

      // Validate each result has required properties
      const validResults = results.filter(result => 
        result && 
        typeof result === 'object' && 
        typeof result.score === 'number' &&
        result.score >= 0 && 
        result.score <= 100
      );

      if (validResults.length === 0) {
        return null;
      }

      const totalTests = validResults.length;
      const totalScore = validResults.reduce((sum, result) => sum + (result.score || 0), 0);
      const averageScore = Math.round(totalScore / totalTests);
      const recentScore = validResults[validResults.length - 1]?.score || 0;

      // Calculate trend
      const recentScores = validResults.slice(-3).map(r => r.score || 0);
      const trend = recentScores.length >= 2 
        ? recentScores[recentScores.length - 1] > recentScores[0] ? 'improving' : 'declining'
        : 'stable';

      return {
        totalTests,
        averageScore,
        recentScore,
        trend,
        lastTestDate: validResults[validResults.length - 1]?.date || new Date().toISOString()
      };
    } catch (error) {
      console.error('Error processing progress data:', error);
      return null;
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'improving': return '📈';
      case 'declining': return '📉';
      default: return '➡️';
    }
  };

  if (isLoading) {
    return (
      <div className="progress-tracker">
        <div className="progress-loading">Loading your progress...</div>
      </div>
    );
  }

  return (
    <div className="progress-tracker">
      <div className="progress-header">
        <h2>Progress</h2>
        <div className="trend-indicator">
          <span>{progressData ? getTrendIcon(progressData.trend) : '➡️'}</span>
          <span>{progressData ? progressData.trend : 'No Data'}</span>
        </div>
      </div>

      <div className="progress-content">
        {/* Stats Section */}
        <div className="stats-section">
          <div className="stat-row">
            <div className="stat-item">
              <div className="stat-value">{progressData ? progressData.totalTests : 0}</div>
              <div className="stat-label">Tests</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">{(progressData && typeof progressData.averageScore === 'number' ? progressData.averageScore : 0) + '%'}</div>
              <div className="stat-label">Average</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">{(progressData && typeof progressData.recentScore === 'number' ? progressData.recentScore : 0) + '%'}</div>
              <div className="stat-label">Recent</div>
            </div>
          </div>
        </div>
        
        {/* Learning Focus Section */}
        <div className="learning-focus-section">
          <h3>Focus</h3>
          <div className="focus-item primary">
            <div className="focus-content">
              <div className="focus-title">{learningInsights?.focus?.primaryFocus || 'Road Signs'}</div>
            </div>
          </div>
        </div>


      </div>
    </div>
  );
}; 