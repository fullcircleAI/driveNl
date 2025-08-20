import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { FiCheckCircle, FiXCircle, FiAlertTriangle, FiTarget, FiTrendingUp, FiClock } from 'react-icons/fi';
import { performanceTracker } from '../services/performanceTracker';
import './ExamReadiness.css';

interface ExamReadinessProps {
  onClose: () => void;
}

interface ReadinessCategory {
  name: string;
  weight: number;
  score: number;
  status: 'excellent' | 'good' | 'needs-improvement' | 'critical';
  recommendations: string[];
}

export const ExamReadiness: React.FC<ExamReadinessProps> = ({ onClose }) => {
  const [readinessData, setReadinessData] = useState<ReadinessCategory[]>([]);
  const [overallScore, setOverallScore] = useState(0);
  const [examStatus, setExamStatus] = useState<'ready' | 'almost-ready' | 'needs-work' | 'not-ready'>('not-ready');
  const [loading, setLoading] = useState(true);
  const { t } = useLanguage();

  useEffect(() => {
    calculateExamReadiness();
  }, []);

  const calculateExamReadiness = async () => {
    setLoading(true);
    
    try {
      await performanceTracker.initialize();
      
      // Get mastery data for all categories
      const masteryData = performanceTracker.getAllTopicMastery();
      
      // Define critical categories with weights
      const criticalCategories = [
        { name: 'Alcohol & Drugs', weight: 25, minScore: 85 },
        { name: 'Fatigue & Rest', weight: 20, minScore: 80 },
        { name: 'Emergency Procedures', weight: 18, minScore: 80 },
        { name: 'Vehicle Documentation', weight: 15, minScore: 75 },
        { name: 'Traffic Lights & Signals', weight: 12, minScore: 80 },
        { name: 'Priority Rules', weight: 10, minScore: 85 }
      ];

      const readinessCategories: ReadinessCategory[] = criticalCategories.map(category => {
        const mastery = masteryData.find(m => m.subject === category.name);
        const score = mastery ? mastery.masteryLevel : 0;
        
        let status: ReadinessCategory['status'] = 'excellent';
        if (score < category.minScore - 10) status = 'critical';
        else if (score < category.minScore) status = 'needs-improvement';
        else if (score < category.minScore + 10) status = 'good';
        
        const recommendations = getRecommendations(category.name, score, category.minScore);
        
        return {
          name: category.name,
          weight: category.weight,
          score,
          status,
          recommendations
        };
      });

      // Calculate overall score
      const totalWeight = readinessCategories.reduce((sum, cat) => sum + cat.weight, 0);
      const weightedScore = readinessCategories.reduce((sum, cat) => sum + (cat.score * cat.weight), 0);
      const overall = Math.round(weightedScore / totalWeight);

      // Determine exam status
      let status: 'ready' | 'almost-ready' | 'needs-work' | 'not-ready' = 'not-ready';
      if (overall >= 85) status = 'ready';
      else if (overall >= 75) status = 'almost-ready';
      else if (overall >= 60) status = 'needs-work';
      else status = 'not-ready';

      setReadinessData(readinessCategories);
      setOverallScore(overall);
      setExamStatus(status);
    } catch (error) {
      console.error('Error calculating exam readiness:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRecommendations = (category: string, score: number, minScore: number): string[] => {
    const recommendations: string[] = [];
    
    if (score < minScore) {
      recommendations.push(`Focus on ${category} practice questions`);
      recommendations.push(`Review study materials for ${category}`);
      
      if (category === 'Alcohol & Drugs') {
        recommendations.push('Memorize BAC limits and penalties');
        recommendations.push('Practice identifying impaired driving scenarios');
      } else if (category === 'Fatigue & Rest') {
        recommendations.push('Learn fatigue warning signs');
        recommendations.push('Practice rest planning scenarios');
      } else if (category === 'Emergency Procedures') {
        recommendations.push('Memorize emergency number (112)');
        recommendations.push('Practice accident response procedures');
      } else if (category === 'Vehicle Documentation') {
        recommendations.push('Review required documents list');
        recommendations.push('Practice ownership transfer procedures');
      }
    }
    
    if (score < 70) {
      recommendations.push('Take multiple practice tests in this category');
      recommendations.push('Use study guide for detailed explanations');
    }
    
    return recommendations;
  };

  const getStatusIcon = (status: ReadinessCategory['status']) => {
    switch (status) {
      case 'excellent': return <FiCheckCircle className="status-icon excellent" />;
      case 'good': return <FiCheckCircle className="status-icon good" />;
      case 'needs-improvement': return <FiAlertTriangle className="status-icon needs-improvement" />;
      case 'critical': return <FiXCircle className="status-icon critical" />;
    }
  };

  const getStatusColor = (status: ReadinessCategory['status']) => {
    switch (status) {
      case 'excellent': return '#10b981';
      case 'good': return '#3b82f6';
      case 'needs-improvement': return '#f59e0b';
      case 'critical': return '#ef4444';
    }
  };

  const getExamStatusInfo = () => {
    switch (examStatus) {
      case 'ready':
        return {
          title: 'Ready for Exam',
          description: 'You have demonstrated strong knowledge across all critical areas.',
          color: '#10b981',
          icon: <FiCheckCircle />
        };
      case 'almost-ready':
        return {
          title: 'Almost Ready',
          description: 'You are close to being ready. Focus on the areas that need improvement.',
          color: '#3b82f6',
          icon: <FiTarget />
        };
      case 'needs-work':
        return {
          title: 'Needs More Work',
          description: 'You need to improve several areas before taking the exam.',
          color: '#f59e0b',
          icon: <FiTrendingUp />
        };
      case 'not-ready':
        return {
          title: 'Not Ready Yet',
          description: 'You need significant improvement before attempting the exam.',
          color: '#ef4444',
          icon: <FiClock />
        };
    }
  };

  if (loading) {
    return (
      <div className="exam-readiness-overlay">
        <div className="exam-readiness-modal">
          <div className="loading-spinner">Loading...</div>
        </div>
      </div>
    );
  }

  const statusInfo = getExamStatusInfo();

  return (
    <div className="exam-readiness-overlay">
      <div className="exam-readiness-modal">
        <div className="exam-readiness-header">
          <h2>Exam Readiness Assessment</h2>
          <button onClick={onClose} className="close-btn">×</button>
        </div>

        <div className="exam-readiness-content">
          {/* Overall Status */}
          <div className="overall-status" style={{ borderColor: statusInfo.color }}>
            <div className="status-icon-large" style={{ color: statusInfo.color }}>
              {statusInfo.icon}
            </div>
            <div className="status-info">
              <h3>{statusInfo.title}</h3>
              <p>{statusInfo.description}</p>
              <div className="overall-score">
                Overall Score: <span style={{ color: statusInfo.color }}>{overallScore}%</span>
              </div>
            </div>
          </div>

          {/* Category Breakdown */}
          <div className="categories-section">
            <h3>Category Breakdown</h3>
            <div className="categories-grid">
              {readinessData.map((category, index) => (
                <div key={index} className="category-card">
                  <div className="category-header">
                    {getStatusIcon(category.status)}
                    <h4>{category.name}</h4>
                    <div className="category-score" style={{ color: getStatusColor(category.status) }}>
                      {category.score}%
                    </div>
                  </div>
                  
                  <div className="category-weight">
                    Weight: {category.weight}%
                  </div>
                  
                  {category.recommendations.length > 0 && (
                    <div className="category-recommendations">
                      <h5>Recommendations:</h5>
                      <ul>
                        {category.recommendations.map((rec, recIndex) => (
                          <li key={recIndex}>{rec}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Action Plan */}
          <div className="action-plan">
            <h3>Recommended Action Plan</h3>
            <div className="action-steps">
              {examStatus === 'ready' && (
                <>
                  <div className="action-step">
                    <FiCheckCircle className="step-icon" />
                    <span>Schedule your CBR exam</span>
                  </div>
                  <div className="action-step">
                    <FiCheckCircle className="step-icon" />
                    <span>Review weak areas one more time</span>
                  </div>
                  <div className="action-step">
                    <FiCheckCircle className="step-icon" />
                    <span>Take a final mock exam</span>
                  </div>
                </>
              )}
              
              {examStatus === 'almost-ready' && (
                <>
                  <div className="action-step">
                    <FiTarget className="step-icon" />
                    <span>Focus on categories marked as "needs improvement"</span>
                  </div>
                  <div className="action-step">
                    <FiTarget className="step-icon" />
                    <span>Take targeted practice tests</span>
                  </div>
                  <div className="action-step">
                    <FiTarget className="step-icon" />
                    <span>Review study materials for weak areas</span>
                  </div>
                </>
              )}
              
              {(examStatus === 'needs-work' || examStatus === 'not-ready') && (
                <>
                  <div className="action-step">
                    <FiTrendingUp className="step-icon" />
                    <span>Complete all practice categories</span>
                  </div>
                  <div className="action-step">
                    <FiTrendingUp className="step-icon" />
                    <span>Use the study guide for detailed explanations</span>
                  </div>
                  <div className="action-step">
                    <FiTrendingUp className="step-icon" />
                    <span>Focus on critical categories first</span>
                  </div>
                  <div className="action-step">
                    <FiTrendingUp className="step-icon" />
                    <span>Take multiple mock exams</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
