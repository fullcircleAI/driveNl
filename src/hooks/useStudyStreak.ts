import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

export const useStudyStreak = () => {
  const { user } = useAuth();
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    if (!user?.practiceResults?.length) {
      setStreak(0);
      return;
    }

    // Calculate current streak
    const today = new Date().toDateString();
    const yesterday = new Date(Date.now() - 86400000).toDateString();
    
    const testDates = user.practiceResults.map((result: any) => 
      new Date(result.date).toDateString()
    );

    let currentStreak = 0;
    
    // Check if user tested today
    if (testDates.includes(today)) {
      currentStreak = 1;
      
      // Count consecutive days backwards
      let checkDate = yesterday;
      while (testDates.includes(checkDate)) {
        currentStreak++;
        checkDate = new Date(new Date(checkDate).getTime() - 86400000).toDateString();
      }
    }

    setStreak(currentStreak);
  }, [user?.practiceResults]);

  return streak;
}; 