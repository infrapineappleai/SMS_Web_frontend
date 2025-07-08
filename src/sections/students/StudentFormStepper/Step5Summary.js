





import React from 'react';
import Modal from 'react-modal';
import '../../../Styles/Students-css/SummaryPopup.css';
import CloseIcon from '../../../assets/icons/Close.png';
import UserIcon from '../../../assets/icons/User.png';
import AddressIcon from '../../../assets/icons/Address.png';
import CalendarIcon from '../../../assets/icons/Calendar2.png';
import GenderIcon from '../../../assets/icons/Gender.png';
import EmailIcon from '../../../assets/icons/Email.png';
import PhoneIcon from '../../../assets/icons/Phone.png';
import BranchIcon from '../../../assets/icons/Branch.png';
import StudentIcon from '../../../assets/icons/Student.png';
import { useToast } from '../../../modals/ToastProvider';
import { createStudent, updateStudent } from '../../../integration/studentAPI';

// Set appElement once
if (typeof document !== 'undefined') {
  Modal.setAppElement('#root');
}

const safeString = (val) => (typeof val === 'string' && val.trim() !== '' ? val : 'N/A');

const Step5Summary = ({ isOpen, onClose, studentData, onSave, onEdit }) => {
  const { showToast } = useToast();

  if (!isOpen || !studentData) return null;

  const assignedCourses = Array.isArray(studentData.assignedCourses) ? studentData.assignedCourses : [];
  const schedules = Array.isArray(studentData.schedules) ? studentData.schedules : [];
  const latestSchedule = schedules.length > 0 ? schedules[schedules.length - 1] : {};
  const firstAssigned = assignedCourses.length > 0 ? assignedCourses[0] : {};

  const handleSave = async () => {
    try {
      console.log('Save button clicked with studentData:', JSON.stringify(studentData, null, 2));

      const payload = {
        first_name: studentData.first_name || '',
        last_name: studentData.last_name || '',
        email: studentData.email || '',
        phn_num: studentData.phn_num || '',
        ece_conduct: studentData.ece_conduct || studentData.phn_num || '',
        address: studentData.address || '',
        gender: studentData.gender || '',
        date_of_birth: studentData.date_of_birth || '',
        student_no: studentData.student_no || '',
        status: (studentData.status || 'active').toLowerCase(),
        course: studentData.course || firstAssigned.course || '',
        grade: studentData.grade || firstAssigned.grade || '',
        branch: studentData.branch || latestSchedule.branch || '',
        schedule_day: latestSchedule.day || '',
        schedule_time: latestSchedule.time || '',
        photoFile: studentData.photoFile
      };

      let response;
      if (studentData.id || studentData.user_id) {
        const id = studentData.id || studentData.user_id;
        response = await updateStudent(id, payload);
        showToast({ title: 'Success', message: 'Student updated successfully!' });
      } else {
        response = await createStudent(studentData);
        showToast({ title: 'Success', message: 'Student created successfully!' });
      }

      console.log('Save response:', response);
      onSave?.(response);
      onClose?.();
    } catch (error) {
      console.error('Error saving student:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data
      });
      showToast({
        title: 'Error',
        message: error.message || 'Failed to save student',
        isError: true
      });
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className="summary-modal"
      overlayClassName="modal-overlay"
      ariaHideApp={true}
    >
      <div className="summary-container scrollable">
        <button className="close-btn" onClick={onClose} aria-label="Close Summary Popup">
          <img src={CloseIcon} alt="Close" />
        </button>

        <div className="summary-header-bg">
          <div className="summary-header"></div>
          <img
            src={studentData.photo_url || 'https://example.com/default-avatar.png'}
            alt="Profile"
            className="profile-pic-round"
            onError={(e) => { e.target.src = '/default-avatar.png'; }}
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
                {studentData.name?.trim() ||
                  `${studentData.first_name || ''} ${studentData.last_name || ''}`.trim() ||
                  'N/A'}
              </div>
            </div>

            <div className="info-block">
              <div className="info-label">
                <img src={AddressIcon} alt="Address" className="icon" />
                <span>Address</span>
              </div>
              <div className="info-value">{safeString(studentData.address)}</div>
            </div>

            <div className="info-block">
              <div className="info-label">
                <img src={CalendarIcon} alt="DOB" className="icon" />
                <span>Date of Birth</span>
              </div>
              <div className="info-value">{safeString(studentData.date_of_birth)}</div>
            </div>

            <div className="info-block">
              <div className="info-label">
                <img src={GenderIcon} alt="Gender" className="icon" />
                <span>Gender</span>
              </div>
              <div className="info-value">{safeString(studentData.gender)}</div>
            </div>
          </div>
        </section>

        <section className="summary-section">
          <h3>Contact Details</h3>
          <div className="info-2col">
            <div className="info-block">
              <div className="info-label">
                <img src={PhoneIcon} alt="Phone" className="icon" />
                <span>Phone Number</span>
              </div>
              <div className="info-value">{safeString(studentData.phn_num)}</div>
            </div>

            <div className="info-block">
              <div className="info-label">
                <img src={PhoneIcon} alt="ICE Contact" className="icon" />
                <span>ICE Contact</span>
              </div>
              <div className="info-value">{safeString(studentData.ice_contact)}</div>
            </div>

            <div className="info-block">
              <div className="info-label">
                <img src={EmailIcon} alt="Email" className="icon" />
                <span>Email Address</span>
              </div>
              <div className="info-value">{safeString(studentData.email)}</div>
            </div>

            <div className="info-block">
              <div className="info-label">
                <img src={AddressIcon} alt="Address" className="icon" />
                <span>Address</span>
              </div>
              <div className="info-value">{safeString(studentData.address)}</div>
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
                {assignedCourses.length > 0 ? (
                  assignedCourses.map((c, i) => {
                    if (typeof c !== 'object' || c === null) return null;
                    return (
                      <tr key={i}>
                        <td>{safeString(c.course)}</td>
                        <td>{safeString(c.grade)}</td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="2">No courses assigned.</td>
                  </tr>
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
              <div className="info-value">{safeString(studentData.branch)}</div>
            </div>

            <div className="info-block">
              <div className="info-label">
                <img src={StudentIcon} alt="Student ID" className="icon" />
                <span>Student ID</span>
              </div>
              <div className="info-value">{safeString(studentData.student_no)}</div>
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
                {schedules.length > 0 ? (
                  schedules.map((s, i) => {
                    if (typeof s !== 'object' || s === null) return null;
                    return (
                      <tr key={i}>
                        <td>{safeString(s.day)}</td>
                        <td>{safeString(s.time)}</td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="2">No schedules available.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        <div className="summary-buttons">
          <button className="prev-btn" onClick={onClose}>
            Close
          </button>
          {onSave && (
            <button className="save-btn" onClick={handleSave}>
              Save
            </button>
          )}
          {onEdit && (
            <button
              className="edit-btn"
              onClick={() => {
                onEdit(studentData);
              }}
            >
              Edit
            </button>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default Step5Summary;