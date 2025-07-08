import React, { useState, useEffect } from 'react';
import StudentsList from './StudentsList';
import AddStudentForm from './StudentFormStepper/AddStudentForm';
import { getAllStudents, createStudent, updateStudent, deleteStudent, searchStudents, filterStudents, filterStudentsByPayment, filterStudentsByCourse } from '../integration/studentAPI';
import { useToast } from '../modals/ToastProvider';

const StudentsPage = () => {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stateFilter, setStateFilter] = useState('');
  const [paymentFilter, setPaymentFilter] = useState('');
  const [courseFilter, setCourseFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editStudent, setEditStudent] = useState(null);
  const { showToast } = useToast();

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true);
        const response = await getAllStudents();
        if (!Array.isArray(response)) {
          throw new Error('Invalid response format');
        }
        setStudents(response);
        setFilteredStudents(response);
        setError(null);
      } catch (e) {
        setError(`Failed to load students: ${e.message}`);
        showToast({
          title: 'Error',
          message: `Failed to load students: ${e.message}`,
          isError: true,
        });
        setStudents([]);
        setFilteredStudents([]);
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, [showToast]);

  useEffect(() => {
    const applyFilters = async () => {
      try {
        let result = students;
        if (searchQuery) {
          result = await searchStudents(searchQuery);
        } else if (stateFilter) {
          result = await filterStudents(stateFilter.toLowerCase());
        } else if (paymentFilter) {
          result = await filterStudentsByPayment(paymentFilter.toLowerCase());
        } else if (courseFilter) {
          result = await filterStudentsByCourse(courseFilter);
        }
        setFilteredStudents(result);
      } catch (e) {
        setError(`Failed to apply filters: ${e.message}`);
        showToast({
          title: 'Error',
          message: `Failed to apply filters: ${e.message}`,
          isError: true,
        });
      }
    };
    applyFilters();
  }, [students, stateFilter, paymentFilter, courseFilter, searchQuery, showToast]);

  const handleAddStudent = async (studentData) => {
    try {
      setStudents(prev => [...prev, studentData]);
      setFilteredStudents(prev => [...prev, studentData]);
      setIsAddOpen(false);
      setEditStudent(null);
    } catch (e) {
      showToast({
        title: 'Error',
        message: `Failed to save student: ${e.message}`,
        isError: true,
      });
    }
  };

  const handleEditStudent = (student) => {
    setEditStudent(student);
    setIsAddOpen(true);
  };

  const handleDeleteStudent = async (id) => {
    try {
      await deleteStudent(id);
      setStudents(prev => prev.filter(s => s.id !== id));
      setFilteredStudents(prev => prev.filter(s => s.id !== id));
      showToast({
        title: 'Success',
        message: 'Student deleted successfully!',
        isDelete: true,
      });
    } catch (e) {
      showToast({
        title: 'Error',
        message: `Failed to delete student: ${e.message}`,
        isError: true,
      });
    }
  };

  return (
    <div>
      <h2>Students</h2>
      <div style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
        <button onClick={() => setIsAddOpen(true)} style={{ padding: '8px 16px' }}>
          Add Student
        </button>
        <input
          type="text"
          placeholder="Search by name, course, or student ID"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ padding: '8px', width: '200px' }}
          aria-label="Search students"
        />
        <select
          value={stateFilter}
          onChange={(e) => setStateFilter(e.target.value)}
          style={{ padding: '8px' }}
          aria-label="Filter by status"
        >
          <option value="">All Statuses</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
        <select
          value={paymentFilter}
          onChange={(e) => setPaymentFilter(e.target.value)}
          style={{ padding: '8px' }}
          aria-label="Filter by payment status"
        >
          <option value="">All Payments</option>
          <option value="paid">Paid</option>
          <option value="pending">Pending</option>
          <option value="overdue">Overdue</option>
        </select>
        <select
          value={courseFilter}
          onChange={(e) => setCourseFilter(e.target.value)}
          style={{ padding: '8px' }}
          aria-label="Filter by course"
        >
          <option value="">All Courses</option>
          <option value="Violin">Violin</option>
          <option value="Piano">Piano</option>
          <option value="Guitar">Guitar</option>
          <option value="HNDIT">HNDIT</option>
          <option value="IT">IT</option>
          <option value="Software">Software</option>
        </select>
      </div>
      {loading && <div style={{ color: 'blue', marginBottom: '10px' }}>Loading students...</div>}
      {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}
      {!loading && !error && filteredStudents.length === 0 && (
        <div style={{ color: 'orange', marginBottom: '10px' }}>
          No students found.
        </div>
      )}
      <StudentsList
        students={filteredStudents}
        onEditStudent={handleEditStudent}
        onDeleteStudent={handleDeleteStudent}
      />
      <AddStudentForm
        isOpen={isAddOpen}
        onClose={() => {
          setIsAddOpen(false);
          setEditStudent(null);
        }}
        onAddStudent={handleAddStudent}
        initialData={editStudent}
      />
    </div>
  );
};

export default StudentsPage;