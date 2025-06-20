import React, { useState } from 'react';
import StudentsList from './StudentsList';
import StudentProfilePopup from './StudentProfilePopup';
import AddStudentForm from './AddStudentForm';

const StudentsPage = ({ initialStudents }) => {
  const [students, setStudents] = useState(initialStudents || []); // Manage students state
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showProfilePopup, setShowProfilePopup] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);

  const handleStudentClick = (student) => {
    setSelectedStudent(student);
    setShowProfilePopup(true);
  };

  const handleCloseProfile = () => {
    setShowProfilePopup(false);
    setSelectedStudent(null);
  };

  const handleEditClick = (student) => {
    setShowProfilePopup(false); // Close profile popup
    setSelectedStudent(student);
    setShowEditForm(true); // Open stepper form in edit mode
  };

  const handleCloseForm = () => {
    setShowEditForm(false);
    setSelectedStudent(null);
  };

  const handleSaveStudent = (updatedStudent) => {
    setStudents((prevStudents) =>
      prevStudents.map((student) =>
        student.id === updatedStudent.id ? { ...student, ...updatedStudent } : student
      )
    ); // Update student in list
    setShowEditForm(false);
    setSelectedStudent(null);
  };

  return (
    <>
      <StudentsList students={students} onStudentClick={handleStudentClick} />

      {showProfilePopup && selectedStudent && (
        <StudentProfilePopup
          isOpen={showProfilePopup}
          onClose={handleCloseProfile}
          studentData={selectedStudent}
          onEdit={handleEditClick}
        />
      )}

      {showEditForm && selectedStudent && (
        <AddStudentForm
          isOpen={showEditForm}
          onClose={handleCloseForm}
          onAddStudent={handleSaveStudent}
          initialData={selectedStudent} // Pass initial data for prefill
        />
      )}
    </>
  );
};

export default StudentsPage;
