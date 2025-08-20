import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

export function usePremiumStatus() {
  const { user } = useAuth();
  const [isPremium, setIsPremium] = useState(false);

  useEffect(() => {
    // Check localStorage for dev access
    if (localStorage.getItem('devPremium') === 'true' || localStorage.getItem('isPremium') === 'true') {
      setIsPremium(true);
      return;
    }
    // Check user data for premium status
    if (user && user.isPremium) {
      setIsPremium(true);
      return;
    }
    setIsPremium(false);
  }, [user]);

  return isPremium;
} 