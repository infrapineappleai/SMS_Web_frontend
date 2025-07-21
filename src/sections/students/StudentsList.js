import React, { useState, useEffect, useMemo } from "react";
import StudentProfilePopup from "./StudentProfilePopup";
import "../../Styles/Students-css/StudentsList.css";
import { getAllStudents, deleteStudent } from "../../integration/studentAPI";
import { useToast } from "../../modals/ToastProvider";
import AddStudentForm from "../students/AddStudentForm";

const baseImageUrl = "https://pineappleai.cloud/api/sms/api/uploads/";

const isValidImageUrl = (url) => {
  if (!url || typeof url !== "string") return false;

  if (url.startsWith("data:image/")) {
    const parts = url.split("base64,");
    return parts.length === 2 && parts[1].length > 50;
  }

  return (
    url.startsWith("http://") ||
    url.startsWith("https://") ||
    url.startsWith("/uploads/")
  );
};

const StudentImage = ({ photo_url, first_name, last_name }) => {
  let fullImageUrl = "";

  if (photo_url) {
    if (!photo_url.startsWith("http") && !photo_url.startsWith("data:image/")) {
      fullImageUrl = baseImageUrl + photo_url.replace(/^\/?Uploads\//i, "");
    } else {
      fullImageUrl = photo_url;
    }
  }

  const suspicious = ["https/:", "wallpaper", "undefined", "null"];
  const shouldLog = suspicious.some((sub) => fullImageUrl?.includes(sub));

  if (!isValidImageUrl(fullImageUrl)) {
    if (shouldLog) {
      console.warn(
        `Invalid image URL for student: ${first_name} ${last_name}`,
        `Raw value: "${fullImageUrl}"`
      );
    }
    fullImageUrl = "/default-avatar.png";
  }

  return (
    <img
      src={fullImageUrl}
      alt={`${first_name} ${last_name}`}
      onError={(e) => {
        e.target.onerror = null;
        e.target.src = "/default-avatar.png";
      }}
      className="profile-img"
    />
  );
};

const StudentsList = ({ onEditStudent, onDeleteStudent }) => {
  const [students, setStudents] = useState([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isEditFormOpen, setIsEditFormOpen] = useState(false);
  const [editStudentData, setEditStudentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { showToast } = useToast();

  const fetchStudents = async () => {
    try {
      setLoading(true);
      setError(null);
      const fetchedStudents = await getAllStudents();
      console.log("StudentsList: Fetched students:", fetchedStudents);
      setStudents(fetchedStudents || []);
    } catch (err) {
      const message = err.message || "Failed to fetch students";
      setError(message);
      showToast({ title: "Error", message, isError: true });
    } finally {
      setLoading(false);
    }
  };

 
  useEffect(() => {
    fetchStudents();
  }, []);  

  const handleProfileClick = (student) => {
    setSelectedStudent(student);
    setIsPopupOpen(true);
  };

  const handleEdit = (studentData) => {
    console.log(
      "StudentsList: Opening AddStudentForm for editing with data=",
      JSON.stringify(studentData, null, 2)
    );
    setEditStudentData(studentData);
    setIsEditFormOpen(true);
    setIsPopupOpen(false);
    if (onEditStudent) {
      onEditStudent(studentData);
    }
  };

  const handleFormSave = async (updatedStudent) => {
    console.log(
      "StudentsList: handleFormSave updatedStudent=",
      JSON.stringify(updatedStudent, null, 2)
    );
    try {
       await fetchStudents(); 
      showToast({ title: "Success", message: "Student saved successfully!" });
      setIsEditFormOpen(false);
      setEditStudentData(null);

    } catch (error) {
      console.error("StudentsList: Error in handleFormSave:", error);
      showToast({
        title: "Error",
        message: error.message || "Failed to save student",
        isError: true,
      });
    }
  };

  const handleDeleteClick = async (e, studentId) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this student?")) {
      try {
        await deleteStudent(studentId);
        showToast({
          title: "Success",
          message: "Student deleted successfully!",
        });
        if (onDeleteStudent) onDeleteStudent(studentId);
        await fetchStudents(); // Refresh the list after deletion
      } catch (err) {
        showToast({
          title: "Error",
          message: err.message || "Failed to delete student",
          isError: true,
        });
      }
    }
  };

  const sortedStudents = useMemo(() => {
    return [...students].sort((a, b) => {
      const statusA = (a.status || "").toLowerCase();
      const statusB = (b.status || "").toLowerCase();
      return statusA === "active" ? -1 : statusB === "active" ? 1 : 0;
    });
  }, [students]);

  return (
    <div className="main-content">
      <div className="container">
        {loading && <div className="loading">Loading students...</div>}
        {error && <div className="error-message">{error}</div>}
        {!loading && !error && sortedStudents.length === 0 && (
          <div className="empty-message">No students found.</div>
        )}
        {!loading && sortedStudents.length > 0 && (
          <div className="card-grid">
            {sortedStudents.map((student) => (
              <div
                key={student.id}
                className={`profile-card ${
                  student.status === "Inactive" ? "inactive-card" : ""
                }`}
                onClick={() => handleProfileClick(student)}
                style={{ cursor: "pointer", position: "relative" }}
              >
                <StudentImage
                  photo_url={student.photo_url}
                  first_name={student.first_name}
                  last_name={student.last_name}
                />
                <p className="student-name">
                  {student.name || `${student.first_name} ${student.last_name}`}
                </p>
                <p className="student-course">
                  Course: {student.course || "N/A"}
                </p>
                {student.status === "Inactive" && (
                  <span className="inactive-label">Inactive</span>
                )}
                <button
                  className="delete-btn"
                  onClick={(e) => handleDeleteClick(e, student.id)}
                  style={{
                    position: "absolute",
                    top: "8px",
                    right: "8px",
                    backgroundColor: "red",
                    color: "white",
                    border: "none",
                    padding: "4px 8px",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <StudentProfilePopup
        isOpen={isPopupOpen}
        onClose={() => setIsPopupOpen(false)}
        studentData={selectedStudent}
        onEdit={handleEdit}
        onSave={handleFormSave}
      />
      {isEditFormOpen && editStudentData && (
        <AddStudentForm
          isOpen={isEditFormOpen}
          onClose={() => {
            console.log("StudentsList: Closing AddStudentForm");
            setIsEditFormOpen(false);
            setEditStudentData(null);
          }}
          onAddStudent={handleFormSave}
          initialData={editStudentData}
          isEditMode={true}
        />
      )}
    </div>
  );
};

export default StudentsList;