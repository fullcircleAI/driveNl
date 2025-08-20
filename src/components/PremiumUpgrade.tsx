import React from 'react';
import './PremiumUpgrade.css';

export function PremiumUpgrade() {
  return (
    <div className="premium-upgrade">
      <div className="premium-content">
        <h2>Upgrade to Premium</h2>
        <p>Get access to all features and unlimited practice tests.</p>
        {/* Remove: <AnimatedLogo /> */}
        <button className="upgrade-btn">Upgrade Now</button>
      </div>
    </div>
  );
} 