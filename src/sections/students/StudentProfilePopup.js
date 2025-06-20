// src/sections/students/StudentProfilePopup.js
import React from 'react';
import Modal from 'react-modal';
import '../../Styles/Students-css/StudentProfilePopup.css';

import CloseIcon from '../../assets/icons/Close.png';
import UserIcon from '../../assets/icons/User.png';
import AddressIcon from '../../assets/icons/Address.png';
import CalendarIcon from '../../assets/icons/Calendar2.png';
import GenderIcon from '../../assets/icons/Gender.png';
import EmailIcon from '../../assets/icons/Email.png';
import WhatsAppIcon from '../../assets/icons/WhatsApp.png';
import PhoneIcon from '../../assets/icons/Phone.png';
import BranchIcon from '../../assets/icons/Branch.png';
import StudentIcon from '../../assets/icons/Student.png';
import CurrencyIcon from '../../assets/icons/currency.png';




const StudentProfilePopup = ({ isOpen, onClose, studentData, onEdit }) => {
  if (!isOpen || !studentData) return null;

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className="summary-modal"
      overlayClassName="modal-overlay"
      ariaHideApp={false}
    >
      <div className="summary-container scrollable">
        <button className="close-btn" onClick={onClose} aria-label="Close Summary Popup">
          <img src={CloseIcon} alt="Close" />
        </button>

        <div className="summary-header-bg">
          <div className="summary-header"></div>
          <img
            src={studentData.profileImage || 'https://i.pravatar.cc/120?img=1'}
            alt="Profile"
            className="profile-pic-round"
          />
          <h2>Student Details</h2>
        </div>

        <section className="summary-section">
          <h3>Personal Information</h3>
          <div className="info-2col">
            <div className="info-block">
              <div className="info-label">
                <img src={UserIcon} alt="Full Name" className="icon" />
                <span>Full Name</span>
              </div>
              <div className="info-value">
                {studentData.name || `${studentData.salutation || ''} ${studentData.fullName || ''}`.trim() || 'N/A'}
              </div>
            </div>

            <div className="info-block">
              <div className="info-label">
                <img src={AddressIcon} alt="Address" className="icon" />
                <span>Address</span>
              </div>
              <div className="info-value">{studentData.address || 'N/A'}</div>
            </div>

            <div className="info-block">
              <div className="info-label">
                <img src={CalendarIcon} alt="DOB" className="icon" />
                <span>Date of Birth</span>
              </div>
              <div className="info-value">{studentData.dob || 'N/A'}</div>
            </div>

            <div className="info-block">
              <div className="info-label">
                <img src={GenderIcon} alt="Gender" className="icon" />
                <span>Gender</span>
              </div>
              <div className="info-value">{studentData.gender || 'N/A'}</div>
            </div>
          </div>
        </section>

        <section className="summary-section">
          <h3>Contact Details</h3>
          <div className="info-2col">
            <div className="info-block">
              <div className="info-label">
                <img src={EmailIcon} alt="Email" className="icon" />
                <span>Email Address</span>
              </div>
              <div className="info-value">{studentData.email || 'N/A'}</div>
            </div>

            <div className="info-block">
              <div className="info-label">
                <img src={WhatsAppIcon} alt="WhatsApp" className="icon" />
                <span>WhatsApp Number</span>
              </div>
              <div className="info-value">{studentData.whatsapp || 'N/A'}</div>
            </div>

            <div className="info-block">
              <div className="info-label">
                <img src={PhoneIcon} alt="Phone" className="icon" />
                <span>ICE Contact</span>
              </div>
              <div className="info-value">{studentData.iceContact || 'N/A'}</div>
            </div>
          </div>
        </section>

        <section className="summary-section scrollable-section">
          <h3>Educational Records</h3>
          <div className="scroll-table">
            <table>
              <thead>
                <tr>
                  <th>Course Name</th>
                  <th>Grade</th>
                </tr>
              </thead>
              <tbody>
                {(studentData.assignedCourses || []).map((c, i) => (
                  <tr key={i}>
                    <td>{c.course || 'N/A'}</td>
                    <td>{c.grade || 'N/A'}</td>
                  </tr>
                ))}
                {(!studentData.assignedCourses || studentData.assignedCourses.length === 0) && (
                  <tr><td colSpan="2">No courses assigned.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        <section className="summary-section">
          <h3>Academic Details</h3>
          <div className="info-2col">
            <div className="info-block">
              <div className="info-label">
                <img src={BranchIcon} alt="Branch" className="icon" />
                <span>Branch</span>
              </div>
              <div className="info-value">{studentData.branch || 'N/A'}</div>
            </div>

            <div className="info-block">
              <div className="info-label">
                <img src={StudentIcon} alt="Student ID" className="icon" />
                <span>Student ID</span>
              </div>
              <div className="info-value">{studentData.studentId || 'N/A'}</div>
            </div>

            <div className="info-block">
              <div className="info-label">
                <img src={CurrencyIcon} alt="Admission Fee" className="icon" />
                <span>Admission Fee</span>
              </div>
              <div className="info-value">{studentData.admissionFee ? `Rs. ${studentData.admissionFee}` : 'N/A'}</div>
            </div>
          </div>
        </section>

        <section className="summary-section scrollable-section">
          <h3>Schedule</h3>
          <div className="scroll-table">
            <table>
              <thead>
                <tr>
                  <th>Day</th>
                  <th>Time</th>
                </tr>
              </thead>
              <tbody>
                {(studentData.schedules || []).map((s, i) => (
                  <tr key={i}>
                    <td>{s.day || 'N/A'}</td>
                    <td>{s.time || 'N/A'}</td>
                  </tr>
                ))}
                {(!studentData.schedules || studentData.schedules.length === 0) && (
                  <tr><td colSpan="2">No schedules available.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        <div className="summary-buttons">
          <button className="save-btn" onClick={() => onEdit(studentData)}>Edit</button>
        </div>
      </div>
    </Modal>
  );
};

export default StudentProfilePopup;
