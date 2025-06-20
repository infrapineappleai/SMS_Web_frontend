// src/Components/Buttons/Next_button.js
import React from 'react';

const NextButton = ({ label = 'Next', onClick }) => {
  const style = {
    width: '427px',
    height: '46px',
    borderRadius: '5px',
    background: '#1F6978',
    color: '#FFFFFF',
    fontWeight: 700,
    fontSize: '16px',
    border: 'none',
    cursor: 'pointer'
  };

  return (
    <button type="button" style={style} onClick={onClick}>
      {label}
    </button>
  );
};

export default NextButton;
