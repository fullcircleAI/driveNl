import React, { useState, useEffect } from 'react';
import './StreakCounter.css';

interface StreakData {
  currentStreak: number;
  lastStudyDate: string;
  longestStreak: number;
  totalStudyDays: number;
}

export const StreakCounter: React.FC = () => {
  const [streakData, setStreakData] = useState<StreakData>({
    currentStreak: 0,
    lastStudyDate: '',
    longestStreak: 0,
    totalStudyDays: 0
  });

  const [showCelebration, setShowCelebration] = useState(false);

  useEffect(() => {
    loadStreakData();
  }, []);

  const loadStreakData = () => {
    try {
      const saved = localStorage.getItem('drivenl-streak-data');
      if (saved) {
        const data = JSON.parse(saved);
        const today = new Date().toDateString();
        const lastDate = new Date(data.lastStudyDate).toDateString();
        
        // Check if user studied today
        if (lastDate === today) {
          setStreakData(data);
        } else {
          // Check if streak should continue (studied yesterday)
          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);
          const yesterdayString = yesterday.toDateString();
          
          if (lastDate === yesterdayString) {
            // Continue streak
            const updatedData = {
              ...data,
              currentStreak: data.currentStreak + 1,
              lastStudyDate: today,
              totalStudyDays: data.totalStudyDays + 1
            };
            setStreakData(updatedData);
            saveStreakData(updatedData);
            
            // Show celebration for milestone streaks
            if (updatedData.currentStreak % 7 === 0) {
              setShowCelebration(true);
              setTimeout(() => setShowCelebration(false), 3000);
            }
          } else {
            // Streak broken
            setStreakData({
              currentStreak: 0,
              lastStudyDate: '',
              longestStreak: Math.max(data.longestStreak, data.currentStreak),
              totalStudyDays: data.totalStudyDays
            });
          }
        }
      }
    } catch (error) {
      console.error('Error loading streak data:', error);
    }
  };

  const saveStreakData = (data: StreakData) => {
    try {
      localStorage.setItem('drivenl-streak-data', JSON.stringify(data));
    } catch (error) {
      console.error('Error saving streak data:', error);
    }
  };

  const recordStudySession = () => {
    const today = new Date().toDateString();
    const newStreakData = {
      ...streakData,
      currentStreak: streakData.currentStreak + 1,
      lastStudyDate: today,
      totalStudyDays: streakData.totalStudyDays + 1,
      longestStreak: Math.max(streakData.longestStreak, streakData.currentStreak + 1)
    };
    
    setStreakData(newStreakData);
    saveStreakData(newStreakData);
    
    // Show celebration for milestone streaks
    if (newStreakData.currentStreak % 7 === 0) {
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 3000);
    }
  };

  const getStreakLevel = (streak: number) => {
    if (streak === 0) return { level: 0, progress: 0, nextMilestone: 1 };
    if (streak < 7) return { level: 1, progress: (streak / 7) * 100, nextMilestone: 7 };
    if (streak < 14) return { level: 2, progress: ((streak - 7) / 7) * 100, nextMilestone: 14 };
    if (streak < 30) return { level: 3, progress: ((streak - 14) / 16) * 100, nextMilestone: 30 };
    if (streak < 60) return { level: 4, progress: ((streak - 30) / 30) * 100, nextMilestone: 60 };
    return { level: 5, progress: 100, nextMilestone: streak + 1 };
  };

         const getStreakMessage = (streak: number) => {
           if (streak === 0) return '';
           if (streak === 1) return 'Great start!';
           if (streak < 7) return 'Keep it up!';
           if (streak < 14) return 'ON FIRE!';
           if (streak < 30) return 'INCREDIBLE!';
           if (streak < 60) return 'LEGENDARY!';
           return 'UNSTOPPABLE!';
         };

  const getLevelEmoji = (level: number) => {
    return '';
  };

  // Expose function to parent components
  React.useImperativeHandle(React.forwardRef(() => null), () => ({
    recordStudySession
  }));

  const levelData = getStreakLevel(streakData.currentStreak);

  return (
    <div className={`streak-counter ${showCelebration ? 'celebrating' : ''}`}>
      <div className="streak-display">
        <div className="circular-progress">
          <svg className="progress-ring" width="40" height="40">
            <circle
              className="progress-ring-circle-bg"
              stroke="rgba(255, 255, 255, 0.2)"
              strokeWidth="3"
              fill="transparent"
              r="16"
              cx="20"
              cy="20"
            />
            <circle
              className="progress-ring-circle"
              stroke="white"
              strokeWidth="3"
              fill="transparent"
              r="16"
              cx="20"
              cy="20"
              style={{
                strokeDasharray: `${2 * Math.PI * 16}`,
                strokeDashoffset: `${2 * Math.PI * 16 * (1 - levelData.progress / 100)}`,
                transition: 'stroke-dashoffset 0.6s ease-in-out'
              }}
            />
          </svg>
          <div className="progress-content">
            <div className="streak-number">{streakData.currentStreak}</div>
          </div>
        </div>
               <div className="streak-info">
                 <div className="streak-label">Topics Studied</div>
               </div>
      </div>
      <div className="streak-message">{getStreakMessage(streakData.currentStreak)}</div>
      
             {showCelebration && (
               <div className="celebration-overlay">
                 <div className="celebration-text">
                   LEVEL {levelData.level} UNLOCKED!
                   <br />
                   <span className="celebration-subtext">{streakData.currentStreak} Topics Studied!</span>
                 </div>
               </div>
             )}
    </div>
  );
};

// Hook to use streak functionality
export const useStreak = () => {
  const recordStudySession = () => {
    try {
      const saved = localStorage.getItem('drivenl-streak-data');
      if (saved) {
        const data = JSON.parse(saved);
        const today = new Date().toDateString();
        const lastDate = new Date(data.lastStudyDate).toDateString();
        
        if (lastDate !== today) {
          const newStreakData = {
            ...data,
            currentStreak: data.currentStreak + 1,
            lastStudyDate: today,
            totalStudyDays: data.totalStudyDays + 1,
            longestStreak: Math.max(data.longestStreak, data.currentStreak + 1)
          };
          localStorage.setItem('drivenl-streak-data', JSON.stringify(newStreakData));
        }
      } else {
        // First time user
        const newStreakData = {
          currentStreak: 1,
          lastStudyDate: today,
          longestStreak: 1,
          totalStudyDays: 1
        };
        localStorage.setItem('drivenl-streak-data', JSON.stringify(newStreakData));
      }
    } catch (error) {
      console.error('Error recording study session:', error);
    }
  };

  return { recordStudySession };
};
