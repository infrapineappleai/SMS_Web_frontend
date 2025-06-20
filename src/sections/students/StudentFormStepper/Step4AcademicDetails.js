import React, { useState, useEffect } from 'react';
import '../../../Styles/Students-css/StudentFormStepper/Step4AcademicDetails.css';
import FilterIcon from '../../../assets/icons/Filter.png';
import Delete from '../../../assets/icons/Delete.png';
import Edit from '../../../assets/icons/Edit.png';
import ConfirmDeleteModal from '../../../modals/DeleteConfirmModal';
import { useToast } from '../../../modals/ToastProvider';

const Step4AcademicDetails = ({ formData, onChange, errors }) => {
  const { showToast } = useToast();
  const [scheduleInput, setScheduleInput] = useState({ branch: '', studentId: '', day: '', time: '' });
  const [editId, setEditId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    console.log('Step4AcademicDetails rendered with formData:', formData);
    setScheduleInput(prev => ({
      ...prev,
      branch: formData.branch || '',
      studentId: formData.studentId || ''
    }));
  }, [formData]);

  const handleInputChange = (e) => {
    e.stopPropagation();
    const { name, value } = e.target;
    setScheduleInput(prev => ({ ...prev, [name]: value }));
    if (name === 'branch' || name === 'studentId') {
      onChange({ [name]: value });
    }
  };

  const handleAssign = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const { branch, studentId, day, time } = scheduleInput;

    if (!day || !time) {
      showToast({ title: 'Error', message: 'Day and Time are required', isError: true });
      return;
    }

    if (editId !== null) {
      const updated = formData.schedules.map(item =>
        item.id === editId ? { id: editId, branch, studentId, day, time } : item
      );
      console.log('Before onChange (Update):', formData.schedules);
      onChange({ schedules: updated });
      console.log('After onChange (Update):', updated);
      showToast({ title: 'Success', message: 'Schedule updated successfully!' });
    } else {
      const newEntry = {
        id: Date.now(),
        branch,
        studentId,
        day,
        time
      };
      const updatedSchedules = [...(formData.schedules || []), newEntry];
      console.log('Before onChange (Assign):', formData.schedules);
      onChange({ schedules: updatedSchedules });
      console.log('After onChange (Assign):', updatedSchedules);
      showToast({ title: 'Success', message: 'Schedule assigned successfully!' });
    }

    setScheduleInput(prev => ({ ...prev, day: '', time: '' }));
    setEditId(null);
  };

  const handleEdit = (e, id) => {
    e.preventDefault();
    e.stopPropagation();
    const item = formData.schedules.find(item => item.id === id);
    setScheduleInput({ branch: item.branch, studentId: item.studentId, day: item.day, time: item.time });
    setEditId(id);
    console.log('Editing schedule with ID:', id);
  };

  const confirmDelete = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    const updated = formData.schedules.filter(item => item.id !== deleteId);
    console.log('Before onChange (Delete):', formData.schedules);
    onChange({ schedules: updated });
    console.log('After onChange (Delete):', updated);
    setShowDeleteModal(false);
    setDeleteId(null);
    showToast({ title: 'Success', message: 'Schedule deleted successfully!', isDelete: true });
    console.log('Deleted Successfully');
  };

  const handleDeleteClick = (e, id) => {
    e.preventDefault();
    e.stopPropagation();
    setDeleteId(id);
    setShowDeleteModal(true);
    console.log('Opening delete modal for ID:', id);
  };

  return (
    <div className="step-four-fields" onClick={(e) => e.stopPropagation()}>
      <div className="form-row">
        <div className="form-group">
          <label className="input-label">Branch</label>
          <div className="input-icon-container">
            <select
              name="branch"
              className="input-box with-icon"
              value={scheduleInput.branch}
              onChange={handleInputChange}
            >
              <option value="">Select Branch</option>
              <option value="Main">Main</option>
              <option value="Sub">Sub</option>
            </select>
            <img src={FilterIcon} alt="dropdown" className="input-icon dropdown-icon" />
          </div>
        </div>

        <div className="form-group">
          <label className="input-label">Student ID</label>
          <input
            name="studentId"
            type="text"
            className="input-box"
            value={scheduleInput.studentId}
            onChange={handleInputChange}
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="input-label">Schedule Day</label>
          <div className="input-icon-container">
            <select
              name="day"
              className="input-box with-icon"
              value={scheduleInput.day}
              onChange={handleInputChange}
            >
              <option value="">Select Day</option>
              <option value="Monday">Monday</option>
              <option value="Tuesday">Tuesday</option>
              <option value="Wednesday">Wednesday</option>
              <option value="Thursday">Thursday</option>
              <option value="Friday">Friday</option>
              <option value="Saturday">Saturday</option>
            </select>
            <img src={FilterIcon} alt="dropdown" className="input-icon dropdown-icon" />
          </div>
        </div>

        <div className="form-group">
          <label className="input-label">Schedule Time</label>
          <div className="input-icon-container">
            <select
              name="time"
              className="input-box with-icon"
              value={scheduleInput.time}
              onChange={handleInputChange}
            >
              <option value="">Select Time</option>
              <option value="9:00 AM">9:00 AM</option>
              <option value="11:00 AM">11:00 AM</option>
              <option value="2:00 PM">2:00 PM</option>
              <option value="4:00 PM">4:00 PM</option>
            </select>
            <img src={FilterIcon} alt="dropdown" className="input-icon dropdown-icon" />
          </div>
        </div>
      </div>

      <button type="button" className="assign-btn" onClick={handleAssign}>
        {editId !== null ? 'Update Schedule' : 'Assign Schedule'}
      </button>

      {errors?.schedules && <p className="error-msg">{errors.schedules}</p>}

      {formData.schedules && formData.schedules.length > 0 && (
        <div className="assigned-table-wrapper">
          <table className="assigned-table">
            <thead>
              <tr>
                <th className="day-col">Day</th>
                <th className="time-col">Time</th>
                <th className="actions-col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {formData.schedules.map(({ id, branch, studentId, day, time }) => (
                <tr key={id}>
                  <td className="day-col">{day}</td>
                  <td className="time-col">{time}</td>
                  <td className="actions-col">
                    <div className="table-actions">
                      <button
                        className="action-icon edit-icon"
                        onClick={(e) => handleEdit(e, id)}
                      >
                        <img src={Edit} alt="Edit" />
                      </button>
                      <button
                        className="action-icon delete-icon"
                        onClick={(e) => handleDeleteClick(e, id)}
                      >
                        <img src={Delete} alt="Delete" />
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

export default Step4AcademicDetails;