// src/Components/ToggleSwitch.js
import React from 'react';
import '../Styles/ToggleSwitch.css';

const ToggleSwitch = ({ isActive, onToggle }) => {
  return (
    <div className="status-toggle-container">
      <span className="status-label">Status</span>

      <div className="toggle-wrapper">
        <div
          className={`toggle-switch ${isActive ? 'active' : 'inactive'}`}
          onClick={onToggle}
          role="switch"
          aria-checked={isActive}
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') onToggle();
          }}
        >
          <div className="toggle-track">
            <div
              className="toggle-ball"
              style={{
                transform: isActive ? 'translateX(19px)' : 'translateX(19px)',
              }}
            />
          </div>
        </div>
        <span className="toggle-state-label">
          {isActive ? 'Active' : 'Inactive'}
        </span>
      </div>
    </div>
  );
};

export default ToggleSwitch;
