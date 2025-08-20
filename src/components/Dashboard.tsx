import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { ProgressTracker } from './ProgressTracker';
import { Mascot } from './Mascot';
import './Dashboard.css';
import './Mascot.css';


export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { t_nested } = useLanguage();
  const navigate = useNavigate();


  // Get random message from array or fallback
  const getRandomFromArray = (arr: string[] | undefined, fallback: string) => {
    if (Array.isArray(arr) && arr.length > 0) {
      return arr[Math.floor(Math.random() * arr.length)];
    }
    return fallback;
  };

  const handlePracticeClick = (testRoute?: string) => {
    if (testRoute) {
      navigate(`/practice/${testRoute}`);
    } else {
      navigate('/practice');
    }
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header" style={{paddingBottom: 0, width: '100%', maxWidth: '600px'}}>
        <div className="dashboard-welcome" style={{padding: '1.5rem 1rem', borderRadius: 20, boxShadow: '0 4px 16px rgba(0,40,104,0.10)', width: '100%', maxWidth: '600px', height: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1rem'}}>
          <div className="welcome-mascot" style={{marginBottom: 0}}>
            <Mascot size={80} />
              </div>
          <div className="welcome-text">
            <h1 style={{fontSize: '1.8rem', margin: 0, fontWeight: 900, color: '#002868', letterSpacing: '-0.5px', lineHeight: 1.2}}>Welcome, Driver!</h1>
            <p style={{fontSize: '1rem', margin: '0.5rem 0 0 0', color: '#666', textAlign: 'center'}}>Ready to learn Dutch driving theory?</p>
            </div>
          <div className="welcome-cta" style={{marginTop: 0}}>
            <button 
              className="primary-cta"
              style={{fontSize: '1.2rem', padding: '1rem 2rem', minHeight: 48, borderRadius: 16, minWidth: 140, fontWeight: 700}}
              onClick={() => handlePracticeClick()}
            >
              Start Learning
            </button>
          </div>
        </div>
      </div>
      <div className="dashboard-content" style={{paddingTop: '2rem', marginTop: '1rem', width: '100%', maxWidth: '600px'}}>
        <ProgressTracker />
      </div>
    </div>
  );
}; 