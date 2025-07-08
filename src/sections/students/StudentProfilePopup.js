



import React from "react";
import Modal from "react-modal";
import "../../Styles/Students-css/SummaryPopup.css";

import CloseIcon from "../../assets/icons/Close.png";
import UserIcon from "../../assets/icons/User.png";
import AddressIcon from "../../assets/icons/Address.png";
import CalendarIcon from "../../assets/icons/Calendar2.png";
import GenderIcon from "../../assets/icons/Gender.png";
import EmailIcon from "../../assets/icons/Email.png";
import WhatsAppIcon from "../../assets/icons/WhatsApp.png";
import PhoneIcon from "../../assets/icons/Phone.png";
import BranchIcon from "../../assets/icons/Branch.png";
import StudentIcon from "../../assets/icons/Student.png";

const StudentProfilePopup = ({
  isOpen,
  onClose,
  studentData,
  onEdit,
  onSave,
  onUpdate,
  onPrevious,
  mode = "profile",
}) => {
  if (!isOpen || !studentData) return null;

  // Helper to normalize photo URL
  const getFullImageUrl = (url) => {
    if (!url) return "/default-avatar.png";
    if (url.startsWith("http") || url.startsWith("data:image/")) return url;
    return `http://localhost:5000/uploads/${url.replace(/^\/?Uploads\//i, "")}`;
  };

  const profileImageUrl = getFullImageUrl(studentData.photo_url);

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className="summary-modal"
      overlayClassName="modal-overlay"
      ariaHideApp={false}
    >
      <button className="close-btn" onClick={onClose} aria-label="Close Popup">
        <img src={CloseIcon} alt="Close" />
      </button>

      <div className="summary-header-bg">
        <div className="summary-header"></div>
        <img
          src={profileImageUrl}
          alt="Profile"
          className="profile-pic-round"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "/default-avatar.png";
          }}
        />
        <h2>Student Details</h2>
      </div>

      <div className="summary-scroll-container">
        <section className="popup-section">
          <h3>Personal Information</h3>
          <div className="info-2col">
            <div className="info-block full-name">
              <div className="info-label">
                <img src={UserIcon} alt="Full Name" className="user-icon" />
                <span>Full Name</span>
              </div>
              <div className="info-value">
                {`${studentData.salutation || ""} ${
                  studentData.first_name || ""
                } ${studentData.last_name || ""}`.trim() || "N/A"}
              </div>
            </div>

            <div className="info-block address">
              <div className="info-label">
                <img src={AddressIcon} alt="Address" className="Address-icon" />
                <span>Address</span>
              </div>
              <div className="info-value">{studentData.address || "N/A"}</div>
            </div>

            <div className="info-block dob">
              <div className="info-label">
                <img src={CalendarIcon} alt="DOB" className="DOB-icon" />
                <span>Date of Birth</span>
              </div>
              <div className="info-value">
                {studentData.date_of_birth || "N/A"}
              </div>
            </div>

            <div className="info-block gender">
              <div className="info-label">
                <img src={GenderIcon} alt="Gender" className="Gender-icon" />
                <span>Gender</span>
              </div>
              <div className="info-value">{studentData.gender || "N/A"}</div>
            </div>
          </div>
        </section>

        <section className="summary-section">
          <h3>Contact Details</h3>
          <div className="info-2col">
            <div className="info-block">
              <div className="info-label">
                <img src={EmailIcon} alt="Email" className="Email-icon" />
                <span>Email Address</span>
              </div>
              <div className="info-value">{studentData.email || "N/A"}</div>
            </div>

            <div className="info-block">
              <div className="info-label">
                <img
                  src={WhatsAppIcon}
                  alt="Phone Number"
                  className="WhatsApp-icon"
                />
                <span>Phone Number</span>
              </div>
              <div className="info-value">{studentData.phn_num || "N/A"}</div>
            </div>

            <div className="info-block">
              <div className="info-label">
                <img src={PhoneIcon} alt="ICE Contact" className="ICE-icon" />
                <span>ICE Contact</span>
              </div>
              <div className="info-value">
                {studentData.ice_contact || "N/A"}
              </div>
            </div>
          </div>
        </section>

        <section className="summary-section scrollable-section">
          <h3>Educational Records</h3>
          <div className="course-table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Course Name</th>
                  <th>Grade</th>
                </tr>
              </thead>
              <tbody>
                {(studentData.assignedCourses || []).length > 0 ? (
                  studentData.assignedCourses.map((c, i) => (
                    <tr key={i}>
                      <td>{c.course || "N/A"}</td>
                      <td>{c.grade || "N/A"}</td>
                    </tr>
                  ))
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
                <img src={BranchIcon} alt="Branch" className="Branch-icon" />
                <span>Branch</span>
              </div>
              <div className="info-value">{studentData.branch || "N/A"}</div>
            </div>

            <div className="info-block">
              <div className="info-label">
                <img src={StudentIcon} alt="Student ID" className="ID-icon" />
                <span>Student ID</span>
              </div>
              <div className="info-value">
                {studentData.student_no || "N/A"}
              </div>
            </div>
          </div>
        </section>

        <section className="summary-section scrollable-section">
          <div className="scroll-table">
            <table>
              <thead>
                <tr>
                  <th>Day</th>
                  <th>Time</th>
                </tr>
              </thead>
              <tbody>
                {(studentData.schedules || []).length > 0 ? (
                  studentData.schedules.map((s, i) => (
                    <tr key={i}>
                      <td>{s.day || "N/A"}</td>
                      <td>{s.time || "N/A"}</td>
                    </tr>
                  ))
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
          {mode === "summary" && (
            <>
              <button className="prev-btn" onClick={onPrevious}>
                Previous
              </button>
              <button className="save-btn" onClick={onSave}>
                Save
              </button>
            </>
          )}
          {mode === "profile" && (
            <button className="edit-btn" onClick={() => onEdit(studentData)}>
              Edit
            </button>
          )}
          {mode === "edit-summary" && (
            <button className="save-btn" onClick={onUpdate}>
              Update
            </button>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default StudentProfilePopup;