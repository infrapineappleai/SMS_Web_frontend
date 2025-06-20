import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import NotificationIcon from '../assets/icons/Notification.png';
import '../Styles/Header.css';

const routeTitles = {
  '/': 'Dashboard',
  '/dashboard': 'Dashboard',
  '/students': 'Students List',
  '/course': 'Course',
  '/payments': 'Payments',
  '/exam': 'Exam',
  '/schedule': 'Schedule',
  '/report': 'Report',
  '/settings': 'Settings',
  '/logout': 'Logout',
};

const Header = ({ onMenuClick }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const path = location.pathname;
  const pageTitle = routeTitles[path] || 'Dashboard';
  const isMobile = window.innerWidth <= 768;

  const showSearch = ['/students', '/course', '/payments', '/schedule'].includes(path);
  const showAddButton = ['/course', '/payments', '/schedule'].includes(path);
  const showStateFilter = path === '/payments' || path === '/students';
  const showPaymentFilter = path === '/students';
  const showCourseFilter = path === '/students';

  const handleAddClick = () => {
    navigate('/students');
  };

  return (
    <div className="content-header">
      <div className="header-row">
        {isMobile && (
          <button className="mobile-menu-btn" onClick={onMenuClick}>
            ☰
          </button>
        )}
        <div className="header-title">{pageTitle}</div>
        <div className="notification-container">
          <img src={NotificationIcon} alt="Notification" className="notification-img" />
        </div>
      </div>
      <div></div>
      
      {(showSearch || showAddButton || showStateFilter || showPaymentFilter || showCourseFilter) && (
        <div className="actions-row">
          {showAddButton && (
            <div className="add-btn-wrapper">
              <button className="add-btn" onClick={handleAddClick}>
                {path === '/course' && '+ Add Course'}
                {path === '/payments' && '+ Add Payment'}
                {path === '/schedule' && '+ Add Schedule'}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Header;