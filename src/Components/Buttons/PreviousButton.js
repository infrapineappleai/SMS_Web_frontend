import React from 'react';

const PreviousButton = ({onClick}) => {
  const style = {
    width: '427px', height: '46px',
    borderRadius: '5px',
    background: '#FFFFFF',
    color: '#1F6978',
    fontWeight: 600,
    fontSize: '16px',
    border: '1px solid #1F6978',
    cursor: 'pointer'
  };
  return <button type="button" style={style} onClick={onClick}>Previous</button>;
};

export default PreviousButton;
