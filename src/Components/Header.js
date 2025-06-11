import React from 'react';
import { useLocation } from 'react-router-dom';
import NotificationIcon from '../assets/icons/Notification.png' ;
import SearchIcon from '../assets/icons/searchButton.png';
import FilterIcon from '../assets/icons/Filter.png';
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
  const path = location.pathname;
  const pageTitle = routeTitles[path] || 'Dashboard';

  const isMobile = window.innerWidth <= 768;

  // Your filter flags (unchanged)
  const showSearch = ['/students', '/course', '/payments' , '/schedule'].includes(path);
  const showAddStudent = ['/students', '/course', '/payments' , '/schedule'].includes(path);
  const showStateFilter = path === '/payments' || path === '/students';
  const showPaymentFilter = path === '/students';
  const showCourseFilter = path === '/students';

  return (
    <div className="content-header">
      <div className="header-row">
        {/* ✅ Mobile menu button */}
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

      {(showSearch || showAddStudent || showStateFilter || showPaymentFilter || showCourseFilter) && (
        <div className="actions-row">
          {showSearch && (
            <div className="search-box">
              <input type="text" placeholder="Search..." />
              <img src={SearchIcon} alt="Search" className="search-img" />
            </div>
          )}
          <div className="filter-add-container">
            <div className="filter-buttons">
              {showStateFilter && (
                <button className="filter-btn filter-State-btn">
                  State
                  <img src={FilterIcon} alt="Filter" className="filter-btn-icon" />
                </button>
              )}
              {showPaymentFilter && (
                <button className="filter-btn filter-Payment-btn">
                  Payment
                  <img src={FilterIcon} alt="Filter" className="filter-btn-icon" />
                </button>
              )}
              {showCourseFilter && (
                <button className="filter-btn filter-Course-btn">
                  Course
                  <img src={FilterIcon} alt="Filter" className="filter-btn-icon" />
                </button>
              )}
            </div>
            {showAddStudent && <button className="add-btn">+ Add Student</button>}
          </div>
        </div>
      )}
    </div>
  );
};

export default Header;
