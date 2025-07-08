import React, { useState, useEffect } from 'react';
import '../../Styles/Course-css.css/AddCourseForm.css';
import closeicon from '../../assets/icons/closeicon.png';
import pencilIcon from '../../assets/icons/pencil_line.png';
import deleteIcon from '../../assets/icons/Delete.png';
import Toast from '../../modals/ToastModel';
import successToastIcon from '../../assets/icons/Success.png';
import DeleteConfirmModal from '../../modals/DeleteConfirmModal';
import deleteToastIcon from '../../assets/icons/Delete.png';
import { addCourse } from '../../integration/courseAPI'; // Only addCourse is needed

const CourseCatalog = ({ onSubmit, onClose, initialCourse }) => {
  const [formData, setFormData] = useState({
    courseId: '',
    courseName: '',
    grade: '',
    status: '',
    fees: '',
  });
  const [courses, setCourses] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [hasCourses, setHasCourses] = useState(!!initialCourse);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null);

  useEffect(() => {
    if (initialCourse) {
      setFormData({
        courseId: initialCourse.id || '',
        courseName: initialCourse.name || '',
        grade: initialCourse.details?.[0]?.grade || '',
        status: initialCourse.status || '',
        fees: initialCourse.details?.[0]?.fees?.toString() || '',
      });
      setCourses([{
        courseId: initialCourse.id,
        courseName: initialCourse.name,
        grade: initialCourse.details?.[0]?.grade,
        status: initialCourse.status,
        fees: initialCourse.details?.[0]?.fees?.toString(),
      }]);
      setEditIndex(0);
    } else {
      // Reset courses when no initialCourse is provided
      setCourses([]);
    }
  }, [initialCourse]);

  useEffect(() => {
    setHasCourses(courses.length > 0);
  }, [courses]);

  const showToastNotification = (message, isSuccess = true) => {
    setToastMessage(message);
    setIsSuccess(isSuccess);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.courseId || !formData.courseName || !formData.grade || !formData.status || !formData.fees) {
      showToastNotification('Please fill in all fields before submitting.', false);
      return;
    }
    if (editIndex !== null) {
      handleUpdate();
    } else {
      setCourses(prevCourses => [...prevCourses, { ...formData }]);
      setFormData({
        courseId: '',
        courseName: '',
        grade: '',
        status: '',
        fees: '',
      });
      showToastNotification('Course added to list!');
    }
  };

  const handleClose = () => {
    if (formData.courseId || formData.courseName || formData.grade || formData.status || formData.fees) {
      if (window.confirm('Are you sure you want to close? Unsaved data will be lost.')) {
        onClose();
      }
    } else {
      onClose();
    }
  };

  const handleFinalSubmit = async () => {
  try {
    console.log(' Courses array before submission:', courses);

    if (!Array.isArray(courses) || courses.length === 0) {
      showToastNotification('No courses to submit.', false);
      return;
    }

    const savedCourses = [];

    // Filter out invalid course entries
    const validCourses = courses.filter((course, index) => {
      const courseId = course.courseId?.trim();
      const courseName = course.courseName?.trim();
      const grade = course.grade?.trim();
      const status = course.status?.trim();
      const fees = course.fees?.toString().trim();

      const isValid =
        courseId && courseName && grade && status && fees && !isNaN(parseInt(fees, 10));

      if (!isValid) {
        console.warn(`Skipping invalid course at index ${index}:`, course);
      }

      return isValid;
    });

    if (validCourses.length === 0) {
      showToastNotification('All course entries are invalid. Please fill all fields properly.', false);
      return;
    }

    for (const [index, course] of validCourses.entries()) {
      console.log(`\n Submitting valid course at index ${index}:`, course);

      const courseData = {
        id: course.courseId.trim(),
        name: course.courseName.trim(),
        status: course.status.trim(),
        details: [{
          grade: course.grade.trim(),
          fees: parseInt(course.fees.toString().trim(), 10),
        }],
        branch_id: 4, 
      };

      console.log(' Submitting courseData to API:', courseData);

      const response = await addCourse(courseData);
      savedCourses.push(response.data);
    }

    showToastNotification(' Courses saved successfully!');
    onSubmit(savedCourses);
    setCourses([]);
    onClose();
  } catch (error) {
    console.error(' Submit Error:', error.response?.data || error.message);
    showToastNotification(
      error.response?.data?.error || error.message || 'Failed to save courses.',
      false
    );
  }
};


  const handleEdit = (index) => {
    const courseToEdit = courses[index];
    setFormData({ ...courseToEdit });
    setEditIndex(index);
  };

  const handleDelete = (index) => {
    setDeleteIndex(index);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (deleteIndex !== null) {
      setCourses(prevCourses => prevCourses.filter((_, i) => i !== deleteIndex));
      showToastNotification('Course removed from list!');
      setShowDeleteModal(false);
      setDeleteIndex(null);
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setDeleteIndex(null);
  };

  const handleUpdate = () => {
    if (editIndex !== null) {
      const updatedCourses = [...courses];
      updatedCourses[editIndex] = { ...formData };
      setCourses(updatedCourses);
      setFormData({
        courseId: '',
        courseName: '',
        grade: '',
        status: '',
        fees: '',
      });
      setEditIndex(null);
      showToastNotification('Course updated in list!');
    }
  };

  return (
    <div className="course-catalog-overlay">
      <div className={`course-catalog-modal ${hasCourses ? 'expanded' : ''}`}>
        <div className="course-catalog-header">
          <h3>{initialCourse ? 'Edit Course' : 'Course Catalog'}</h3>
          <button className="close-btn" onClick={handleClose}>
            <img src={closeicon} alt="Close" />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>Course Code</label>
              <input
                type="text"
                name="courseId"
                value={formData.courseId}
                onChange={handleChange}
                placeholder="eg.099"
                required
              />
            </div>
            <div className="form-group">
              <label>Course Name</label>
              <input
                type="text"
                name="courseName"
                value={formData.courseName}
                onChange={handleChange}
                placeholder="eg.piano"
                required
              />
            </div>
          </div>
          <h3>Course Record</h3>
          <div className="form-row">
            <div className="form-group">
              <label>Grade</label>
              <input
                type="text"
                name="grade"
                value={formData.grade}
                onChange={handleChange}
                placeholder="eg.02"
                required
              />
            </div>
            <div className="form-group">
              <label>Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                required
              >
                <option value="" disabled>Select the Status</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          </div>
          <div className="form-group">
            <label>Fees</label>
            <input
              type="text"
              name="fees"
              value={formData.fees}
              onChange={handleChange}
              placeholder="eg.3000"
              required
            />
          </div>
          <button type="submit" className="button-btn">
            {editIndex !== null ? 'Update Course' : 'Add Course'}
          </button>
        </form>
        {courses.length > 0 && (
          <div className="added-courses">
            <table className="courses-table">
              <thead>
                <tr>
                  <th>Grade</th>
                  <th>Status</th>
                  <th>Fees(Rs)</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody className="table-body">
                {courses.map((course, index) => (
                  <tr key={index}>
                    <td>{course.grade}</td>
                    <td>{course.status}</td>
                    <td>{course.fees}</td>
                    <td>
                      <button className="action-btn edit" onClick={() => handleEdit(index)}>
                        <img src={pencilIcon} alt="Edit" />
                      </button>
                      <button className="action-btn delete" onClick={() => handleDelete(index)}>
                        <img src={deleteIcon} alt="Delete" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button type="button" className="submit-btn" onClick={handleFinalSubmit}>
              Submit
            </button>
          </div>
        )}
      </div>
      <Toast
        showToast={showToast}
        isError={!isSuccess}
        onClose={() => setShowToast(false)}
        title={isSuccess ? 'Success' : 'Error'}
        message={toastMessage}
        icon={toastMessage.includes('deleted') ? deleteToastIcon : successToastIcon}
        isDelete={toastMessage.includes('deleted')}
      />
      <DeleteConfirmModal
        isOpen={showDeleteModal}
        onClose={cancelDelete}
        onDelete={confirmDelete}
      />
    </div>
  );
};

export default CourseCatalog;