// src/components/course/CourseActions.js
import React from 'react';
import eyeIcon from '../../assets/icons/Eye.png';
import pencilIcon from '../../assets/icons/pencil_line.png';
import deleteIcon from '../../assets/icons/Delete.png';
import '../../Styles/Course-css.css/CourseActions.css';

const CourseActions = ({
  course,
  setSelectedCourse,
  setEditCourse,
  setShowDeleteConfirm,
  hideView = false,
  isDetailView = false,
}) => {
  const handleIconClick = (action) => {
    if (action === 'View') {
      setSelectedCourse(course);
      if (setEditCourse) setEditCourse(null);
    } else if (action === 'Edit') {
      setEditCourse(course); 
    } else if (action === 'Delete') {
      if (isDetailView) {
        // FIX: Use gradeFeeId instead of uniqueId
        setShowDeleteConfirm({ 
          courseId: course.courseUniqueId, 
          detailId: course.gradeFeeId
        });
      } else {
        setShowDeleteConfirm(course.uniqueId);
      }
      if (setSelectedCourse) setSelectedCourse(null); 
      if (setEditCourse) setEditCourse(null);
    }
  };

  return (
    <div className="action-icons">
      {!hideView && (
        <img
          src={eyeIcon}
          alt="View"
          className="action-icon"
          onClick={() => handleIconClick('View')}
        />
      )}
      {setEditCourse && (
        <img
          src={pencilIcon}
          alt="Edit"
          className="action-icon"
          onClick={() => handleIconClick('Edit')}
        />
      )}
      {setShowDeleteConfirm && (
        <img
          src={deleteIcon}
          alt="Delete"
          className="action-icon"
          onClick={() => handleIconClick('Delete')}
        />
      )}
    </div>
  );
};

export default CourseActions;