import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../../Styles/payment/stepper/Step1StudentsDetails.css';
import studentAvatar from '../../../assets/images/image1.jpg';
import FrameIcon from '../../../assets/icons/Frame.png';
import Group from '../../../assets/icons/Group 30437.png';
import user from '../../../assets/icons/user_2_fill.png';
import whatsapp from '../../../assets/icons/whatsapp_fill.png';

const Step1StudentsDetails = ({ onStudentSelect }) => {
  const [selectedStudentId, setSelectedStudentId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAllStudents = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get('https://pineappleai.cloud/api/sms/api/students');
setStudents(Array.isArray(response.data) ? response.data : response.data.data || []); // ✅
      console.log('Fetched students:', response.data); // Debug log
    } catch (err) {
      setError('Failed to fetch students. Please try again.');
      console.error('Error fetching students:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchSearchStudents = async (query = '') => {
    setLoading(true);
    setError(null);
    try {
      const params = {};
      if (query) {
        if (/^\d+$/.test(query)) {
          params.student_no = parseInt(query); // Match backend field
        } else {
          params.name = query; // Match backend search by name
        }
      }
      const response = await axios.get('https://pineappleai.cloud/api/sms/api/student/search', { params });
      setStudents(response.data);
      console.log('Searched students:', response.data); // Debug log
    } catch (err) {
      setError('Failed to fetch students. Please try again.');
      console.error('Error searching students:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (searchQuery.trim() === '') {
      fetchAllStudents();
    } else {
      fetchSearchStudents(searchQuery);
    }
  }, [searchQuery]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSelectStudent = (student) => {
    setSelectedStudentId(student.student_no); // Use student_no instead of id
    console.log('Selected student:', student); // Debug log
    onStudentSelect(student);
  };

  return (
    <div className="step-container">
      <div className="search-student-section">
        <label className="form-label">Search Student</label>
        <input
          type="text"
          className="form-input"
          placeholder="Type Student Name or Id"
          value={searchQuery}
          onChange={handleSearchChange}
        />
      </div>

      <div className="student-details-section">
        <label className="form-label">Student Details</label>
        {loading && <p>Loading...</p>}
        {error && <p className="error">{error}</p>}
        {!loading && !error && students.length === 0 && <p>No students found.</p>}
        <div className="student-cards-grid">
          {students.map((student) => (
            <div
              key={student.student_no} // Use student_no as key
              className={`student-card ${selectedStudentId === student.student_no ? 'selected' : ''}`}
              onClick={() => handleSelectStudent(student)}
            >
              <div className="student-card-name-container">
                <img
                  src={student.photo_url || studentAvatar}
                  alt="Student Avatar"
                  className="student-avatar"
                />
                <p className="student-card-name">{student.full_name}</p>
              </div>
              <div className="student-card-info">
                <div className="student-card-info-container">
                  <div className="icon-container">
                    <img src={user} alt="Icon" className="icon-style" />
                  </div>
                  <div className="details-container">
                    <p><strong>Student Id</strong></p>
                    <p className="p-a">{student.student_no}</p>
                  </div>
                </div>
                <div className="student-card-info-container">
                  <div className="icon-container">
                    <img src={whatsapp} alt="Icon" className="icon-style" />
                  </div>
                  <div className="details-container">
                    <p><strong>WhatsApp Number</strong></p>
                    <p className="p-a">{student.phn_num}</p>
                  </div>
                </div>
                <div className="student-card-info-container">
                  <div className="icon-container">
                    <img src={FrameIcon} alt="Icon" className="icon-style" />
                  </div>
                  <div className="details-container">
                    <p><strong>Email Address</strong></p>
                    <p className="p-a">{student.email}</p>
                  </div>
                </div>
                <div className="student-card-info-container">
                  <div className="icon-container">
                    <img src={Group} alt="Icon" className="icon-style" />
                  </div>
                  <div className="details-container">
                    <p><strong>Branch</strong></p>
                    <p className="p-a">{student.branch_name}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Step1StudentsDetails;