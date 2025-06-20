import React, { useState, useEffect } from 'react';
import '../../../Styles/Students-css/StudentFormStepper/Step3EducationalRecords.css';
import ToggleSwitch from '../../../Components/ToggleSwitch';
import FilterIcon from '../../../assets/icons/Filter.png';
import Delete from '../../../assets/icons/Delete.png';
import Edit from '../../../assets/icons/Edit.png';
import ConfirmDeleteModal from '../../../modals/DeleteConfirmModal';
import { useToast } from '../../../modals/ToastProvider';

const Step3EducationalRecords = ({ formData, onChange, errors }) => {
  const { showToast } = useToast();
  const [courseInput, setCourseInput] = useState({ Course: '', Grade: '' });
  const [editId, setEditId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const isActive = formData.status === 'Active';

  useEffect(() => {
    console.log('Step3EducationalRecords rendered with formData:', formData);
  }, [formData]);

  const handleInputChange = (e) => {
    e.stopPropagation();
    const { name, value } = e.target;
    setCourseInput(prev => ({ ...prev, [name]: value }));
  };

  const toggleStatus = () => {
    onChange({ ...formData, status: isActive ? 'Inactive' : 'Active' });
  };

  const handleAssign = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const { Course, Grade } = courseInput;

    if (!Course || !Grade) {
      showToast({ title: 'Error', message: 'Please select both Course and Grade', isError: true });
      return;
    }

    if (editId !== null) {
      const updated = formData.assignedCourses.map(item =>
        item.id === editId ? { id: editId, course: Course, grade: Grade } : item
      );
      console.log('Before onChange (Update):', formData.assignedCourses);
      onChange({ ...formData, assignedCourses: updated });
      console.log('After onChange (Update):', updated);
      showToast({ title: 'Success', message: 'Course updated successfully!' });
      setEditId(null);
    } else {
      const newEntry = {
        id: Date.now(),
        course: Course,
        grade: Grade,
      };
      const updatedCourses = [...(formData.assignedCourses || []), newEntry];
      console.log('Before onChange (Assign):', formData.assignedCourses);
      onChange({ ...formData, assignedCourses: updatedCourses });
      console.log('After onChange (Assign):', updatedCourses);
      showToast({ title: 'Success', message: 'Course assigned successfully!' });
    }

    setCourseInput({ Course: '', Grade: '' });
  };

  const handleEdit = (e, id) => {
    e.preventDefault();
    e.stopPropagation();
    const item = formData.assignedCourses.find(item => item.id === id);
    setCourseInput({ Course: item.course, Grade: item.grade });
    setEditId(id);
    console.log('Editing course with ID:', id);
  };

  const handleDeleteClick = (e, id) => {
    e.preventDefault();
    e.stopPropagation();
    setDeleteId(id);
    setShowDeleteModal(true);
    console.log('Opening delete modal for ID:', id);
  };

  const confirmDelete = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    const updated = formData.assignedCourses.filter(item => item.id !== deleteId);
    console.log('Before onChange (Delete):', formData.assignedCourses);
    onChange({ ...formData, assignedCourses: updated });
    console.log('After onChange (Delete):', updated);
    setShowDeleteModal(false);
    setDeleteId(null);
    showToast({ title: 'Success', message: 'Course deleted successfully!', isDelete: true });
    console.log('Deleted Successfully');
  };

  return (
    <div className="step-three-fields" onClick={(e) => e.stopPropagation()}>
      <div className="form-header-row">
        <h3 className="section-header">Course</h3>
        <ToggleSwitch isActive={isActive} onToggle={toggleStatus} />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="input-label">Course</label>
          <div className="input-icon-container">
            <select
              name="Course"
              className="input-box with-icon"
              value={courseInput.Course}
              onChange={handleInputChange}
            >
              <option value="">Select Course</option>
              <option value="Piano">Piano</option>
              <option value="Violin">Violin</option>
              <option value="Miruthangam">Miruthangam</option>
            </select>
            <img src={FilterIcon} alt="dropdown" className="input-icon dropdown-icon" />
          </div>
        </div>

        <div className="form-group">
          <label className="input-label">Grade</label>
          <div className="input-icon-container">
            <select
              name="Grade"
              className="input-box with-icon"
              value={courseInput.Grade}
              onChange={handleInputChange}
            >
              <option value="">Select Grade</option>
              <option value="02">02</option>
              <option value="03">03</option>
              <option value="04">04</option>
            </select>
            <img src={FilterIcon} alt="dropdown" className="input-icon dropdown-icon" />
          </div>
        </div>
      </div>

      <button type="button" className="assign-btn" onClick={handleAssign}>
        {editId !== null ? 'Update Course' : 'Assign Course'}
      </button>

      {errors?.Course && <p className="error-msg">{errors.Course}</p>}

      {formData.assignedCourses && formData.assignedCourses.length > 0 && (
        <div className="assigned-table-wrapper">
          <table className="assigned-table">
            <thead>
              <tr>
                <th className="course-col">Course</th>
                <th className="grade-col">Grade</th>
                <th className="actions-col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {formData.assignedCourses.map(({ id, course, grade }) => (
                <tr key={id}>
                  <td className="course-col">{course}</td>
                  <td className="grade-col">{grade}</td>
                  <td className="actions-col">
                    <div className="table-actions">
                      <button
                        className="action-icon edit-icon"
                        onClick={(e) => handleEdit(e, id)}
                        title="Edit"
                      >
                        <img src={Edit} alt="Edit" className="action-icon-img" />
                      </button>
                      <button
                        className="action-icon delete-icon"
                        onClick={(e) => handleDeleteClick(e, id)}
                        title="Delete"
                      >
                        <img src={Delete} alt="Delete" className="action-icon-img" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showDeleteModal && (
        <div onClick={(e) => e.stopPropagation()}>
          <ConfirmDeleteModal
            isOpen={showDeleteModal}
            onClose={() => {
              setShowDeleteModal(false);
              setDeleteId(null);
              console.log('Delete modal closed');
            }}
            onDelete={confirmDelete}
          />
        </div>
      )}
    </div>
  );
};

export default Step3EducationalRecords;