import React, { useState } from 'react';
import StudentProfilePopup from './StudentProfilePopup'; // Adjust path if needed
import '../../Styles/Students-css/StudentsList.css';


const StudentsList = ({ students = [], onEditStudent }) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  const handleProfileClick = (student) => {
    setSelectedStudent(student);
    setIsPopupOpen(true);
  };

  const handleClosePopup = () => {
    setSelectedStudent(null);
    setIsPopupOpen(false);
  };

  return (
    <div className="main-content">
      <div className="container">
        <div className="card-grid">
          {students.map((student) => (
            <div
              key={student.id}
              className="profile-card"
              onClick={() => handleProfileClick(student)}
              style={{ cursor: 'pointer' }}
            >
              <img
                src={student.profileImage || 'https://i.pravatar.cc/100?img=1'}
                alt={student.name}
                className="profile-img"
              />
              <p className="student-name">{student.name}</p>
              <p className="student-course">Courses: {student.Course}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Profile Popup */}
      <StudentProfilePopup
        isOpen={isPopupOpen}
        onClose={handleClosePopup}
        studentData={selectedStudent}
        onEdit={(student) => {
          onEditStudent(student);   // You pass this to parent to open form with data
          setIsPopupOpen(false);
        }}
      />
    </div>
  );
};

export default StudentsList;
