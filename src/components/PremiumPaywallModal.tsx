import React from 'react';
import './PremiumPaywallModal.css';

export function PremiumPaywallModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Premium Feature</h2>
        <p>This feature is only available to premium users.</p>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
} 