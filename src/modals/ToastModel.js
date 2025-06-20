// src/modals/ToastModel.js
import React from 'react';
import '../Styles/ToastMsg.css';

const Toast = ({ showToast, isError, onClose, title, message, icon, isDelete }) => {
  if (!showToast) return null;

  return (
    <div className={`toast ${isDelete ? 'toast-delete' : isError ? 'toast-error' : 'toast-success'}`}>
      <div className="toast-icon">
      </div>
      <div className="toast-content">
        <span className="toast-title">{title}</span>
        <span className="toast-message">{message}</span>
      </div>
      <button className="toast-close" onClick={onClose}>
      </button>
    </div>
  );
};

export default Toast;
