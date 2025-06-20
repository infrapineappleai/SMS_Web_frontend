import React, { useState, useEffect } from 'react';
import StudentsList from '../sections/students/StudentsList';
import AddStudentForm from '../sections/students/AddStudentForm';
import '../pages/Students.css';
import { useToast } from '../modals/ToastProvider';
import StudentDetailsPopup from '../sections/students/editStepper/StudentDetailsPopup';
import SearchIcon from '../assets/icons/searchButton.png';
import FilterIcon from '../assets/icons/Filter.png';

const Students = () => {
  const { showToast } = useToast();

  const [students, setStudents] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [editMode, setEditMode] = useState(false);

  const [showSearch] = useState(true);
  const [showStateFilter] = useState(true);
  const [showPaymentFilter] = useState(true);
  const [showCourseFilter] = useState(true);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('students');
      const savedStudents = saved ? JSON.parse(saved) : [];
      setStudents(Array.isArray(savedStudents) ? savedStudents : []);
    } catch (error) {
      console.error('Failed to load students:', error);
      setStudents([]);
    }
  }, []);

  const addStudent = (newStudent) => {
    try {
      const updatedStudents = [...students, newStudent];
      setStudents(updatedStudents);
      localStorage.setItem('students', JSON.stringify(updatedStudents));
      setIsFormOpen(false);
      setSelectedStudent(null);
      setEditMode(false);
      showToast({ title: 'Success', message: 'Student added successfully!' });
    } catch (error) {
      showToast({
        title: 'Error',
        message: `Failed to add student: ${error.message}`,
        isError: true,
      });
    }
  };

  const updateStudent = (updatedStudent) => {
    try {
      const updatedList = students.map((student) =>
        student.id === updatedStudent.id ? updatedStudent : student
      );
      setStudents(updatedList);
      localStorage.setItem('students', JSON.stringify(updatedList));
      setIsFormOpen(false);
      setSelectedStudent(null);
      setEditMode(false);
      showToast({ title: 'Success', message: 'Student updated successfully!' });
    } catch (error) {
      showToast({
        title: 'Error',
        message: `Failed to update student: ${error.message}`,
        isError: true,
      });
    }
  };

  const deleteStudent = (studentId) => {
    const updated = students.filter((s) => s.id !== studentId);
    setStudents(updated);
    localStorage.setItem('students', JSON.stringify(updated));
    setSelectedStudent(null);
    showToast({
      title: 'Deleted',
      message: 'Student deleted successfully!',
      isDelete: true,
    });
  };

  const handleStudentClick = (student) => {
    setSelectedStudent(student);
    setEditMode(false);
  };

  const handleEditStudent = () => {
    setIsFormOpen(true);
    setEditMode(true);
  };

  return (
    <div className="students-container">
      {/* Search + Add Button Row */}
      <div className="search-add-row">
        {showSearch && (
          <div className="search-box">
            <input type="text" placeholder="Search..." />
            <img src={SearchIcon} alt="Search" className="search-img" />
          </div>
        )}
        <div className="add-btn-wrapper">
          <button
            className="add-student-btn"
            onClick={() => {
              setSelectedStudent(null);
              setEditMode(false);
              setIsFormOpen(true);
            }}
          >
            + Add Student
          </button>
        </div>
      </div>

      {/* Filter Buttons Row */}
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

      {/* Student List + Forms */}
      <StudentsList students={students} onStudentClick={handleStudentClick} />

      <AddStudentForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditMode(false);
        }}
        onAddStudent={editMode ? updateStudent : addStudent}
        initialData={editMode ? selectedStudent : null}
      />

      <StudentDetailsPopup
        isOpen={!!selectedStudent && !editMode}
        onClose={() => setSelectedStudent(null)}
        student={selectedStudent}
        onSave={updateStudent}
        onDelete={deleteStudent}
        onEdit={handleEditStudent}
      />
    </div>
  );
};

export default Students;
