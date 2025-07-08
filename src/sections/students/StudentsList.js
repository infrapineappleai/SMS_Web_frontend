




import React, { useState, useEffect, useMemo } from "react";
import StudentProfilePopup from "./StudentProfilePopup";
import "../../Styles/Students-css/StudentsList.css";
import { getAllStudents, deleteStudent } from "../../integration/studentAPI";
import { useToast } from "../../modals/ToastProvider";

// ✅ Base URL for backend uploads folder
const baseImageUrl = "https://pineappleai.cloud/api/sms/uploads/";

// ✅ Validate URL or data URI
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

// ✅ Image component with URL normalization
const StudentImage = ({ photo_url, first_name, last_name }) => {
  let fullImageUrl = "";

  if (photo_url) {
    // If it's a relative path like "/Uploads/..." (case insensitive), normalize it
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { showToast } = useToast();

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true);
        setError(null);
        const fetchedStudents = await getAllStudents();
        setStudents(fetchedStudents);
      } catch (err) {
        const message = err.message || "Failed to fetch students";
        setError(message);
        showToast({ title: "Error", message, isError: true });
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, [showToast]);

  const handleProfileClick = (student) => {
    setSelectedStudent(student);
    setIsPopupOpen(true);
  };

  const handleDeleteClick = async (e, studentId) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this student?")) {
      try {
        await deleteStudent(studentId);
        setStudents((prev) =>
          prev.filter((student) => student.id !== studentId)
        );
        showToast({
          title: "Success",
          message: "Student deleted successfully!",
        });
        if (onDeleteStudent) onDeleteStudent(studentId);
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
                    top: "10px",
                    right: "10px",
                    background: "red",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    padding: "5px",
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
        onEdit={onEditStudent}
      />
    </div>
  );
};

export default StudentsList;