import React, { memo } from 'react';
import { Tooltip } from 'react-tooltip';

interface TestButtonProps {
  test: {
    label: string;
    icon: React.ReactNode;
    route: string;
    importance: number;
  };
  importanceColor: string;
  tooltipMessage: string;
  isHovered: boolean;
  isLoading: boolean;
  onHover: (route: string | null) => void;
  onClick: (route: string) => void;
}

const LazyTestButton: React.FC<TestButtonProps> = memo(({
  test,
  importanceColor,
  tooltipMessage,
  isHovered,
  isLoading,
  onHover,
  onClick
}) => {
  const handleClick = () => {
    if (!isLoading) {
      onClick(test.route);
    }
  };

  const handleMouseEnter = () => {
    onHover(test.route);
  };

  const handleMouseLeave = () => {
    onHover(null);
  };

  const handleTouchStart = () => {
    onHover(test.route);
  };

  const handleTouchEnd = () => {
    setTimeout(() => onHover(null), 100);
  };

  return (
    <div className="test-button-container">
      <button
        className={`test-button ${isHovered ? 'test-button-hovered' : ''} ${isLoading ? 'test-button-loading' : ''}`}
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        disabled={isLoading}
        data-tooltip-id={`tooltip-${test.route}`}
        data-tooltip-content={tooltipMessage}
        aria-label={`Practice ${test.label}`}
        style={{
          '--importance-color': importanceColor
        } as React.CSSProperties}
      >
        <div className="test-button-content">
          <div className="test-button-icon">
            {test.icon}
          </div>
          <div className="test-button-text">
            <span className="test-button-label">{test.label}</span>
            <div className="test-button-importance" style={{ backgroundColor: importanceColor }}>
              {test.importance === 3 ? 'Critical' : test.importance === 2 ? 'Important' : 'Basic'}
            </div>
          </div>
          <div className="test-button-arrow">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </div>
        </div>
        
        {isLoading && (
          <div className="test-button-loading-indicator">
            <div className="loading-spinner" />
          </div>
        )}
      </button>
      
      <Tooltip
        id={`tooltip-${test.route}`}
        className="test-button-tooltip"
        place="top"
        delayShow={300}
        delayHide={100}
      />
    </div>
  );
});

LazyTestButton.displayName = 'LazyTestButton';

export default LazyTestButton;
