

import React, { useState, useEffect } from 'react';
import '../../../Styles/Students-css/StudentFormStepper/Step4AcademicDetails.css';
import FilterIcon from '../../../assets/icons/Filter.png';
import { useToast } from '../../../modals/ToastProvider';
import { getDropdownOptions } from '../../../integration/studentAPI';

const Step4AcademicDetails = ({ formData, onChange, errors }) => {
  const { showToast } = useToast();
  const [scheduleInput, setScheduleInput] = useState({
    branch: formData.branch || '',
    student_no: formData.student_no || '',
    schedule_day: formData.schedule_day || '',
    schedule_time: formData.schedule_time || ''
  });
  const [dropdownOptions, setDropdownOptions] = useState({ branches: [], slots: [], courses: [], grades: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        setLoading(true);
        const options = await getDropdownOptions();
        console.log('Step4: Received dropdown options:', JSON.stringify(options, null, 2));
        setDropdownOptions({
          branches: options.branches || [],
          slots: options.slots || [],
          courses: options.courses || [],
          grades: options.grades || []
        });
        if (!options.branches.length || !options.slots.length) {
          showToast({ title: 'Warning', message: 'No branches or slots available', isError: true });
        }
      } catch (error) {
        console.error('Step4: Error fetching options:', error);
        showToast({ title: 'Error', message: 'Failed to fetch branches/slots', isError: true });
      } finally {
        setLoading(false);
      }
    };
    fetchOptions();
  }, [showToast]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setScheduleInput(prev => {
      const updated = { ...prev, [name]: value };
      if (name === 'branch' || name === 'schedule_day') {
        updated.schedule_time = ''; // Reset schedule_time when branch or day changes
      }
      return updated;
    });
    onChange({
      ...formData,
      [name]: value,
      schedule_time: (name === 'branch' || name === 'schedule_day') ? '' : formData.schedule_time
    });
  };

  const handleAssign = (e) => {
    e.preventDefault();
    const { branch, student_no, schedule_day, schedule_time } = scheduleInput;
    if (!branch || !student_no || !schedule_day || !schedule_time) {
      showToast({ title: 'Error', message: 'Branch, Student ID, Schedule Day, and Schedule Time are required', isError: true });
      return;
    }
    onChange({
      ...formData,
      branch,
      student_no,
      schedule_day,
      schedule_time,
      schedules: [...(formData.schedules || []), { id: Date.now(), branch, studentId: student_no, day: schedule_day, time: schedule_time }]
    });
    showToast({ title: 'Success', message: 'Schedule assigned successfully!' });
    setScheduleInput(prev => ({ ...prev, schedule_day: '', schedule_time: '' }));
  };

  const availableDays = [...new Set(dropdownOptions.slots
    .filter(slot => {
      const selectedBranch = dropdownOptions.branches.find(b => b.branch_name === scheduleInput.branch);
      const matchesBranch = selectedBranch ? slot.branch_id === selectedBranch.id : true;
      return matchesBranch && slot.day && slot.day !== '0000-00-00';
    })
    .map(slot => slot.day))]
    .sort(); // Sort days for better UX

  const filteredSlots = dropdownOptions.slots.filter(slot => {
    const selectedBranch = dropdownOptions.branches.find(b => b.branch_name === scheduleInput.branch);
    const matchesBranch = selectedBranch ? slot.branch_id === selectedBranch.id : true;
    const matchesDay = scheduleInput.schedule_day ? slot.day === scheduleInput.schedule_day : true;
    return matchesBranch && matchesDay && slot.time && slot.day && slot.day !== '0000-00-00';
  });

  console.log('Step4: formData:', JSON.stringify(formData, null, 2));
  console.log('Step4: scheduleInput:', JSON.stringify(scheduleInput, null, 2));
  console.log('Step4: availableDays:', JSON.stringify(availableDays, null, 2));
  console.log('Step4: filteredSlots:', JSON.stringify(filteredSlots, null, 2));

  return (
    <div className="step-four-fields">
      <h3 className="section-header">Academic Details</h3>
      {loading && <div>Loading options...</div>}
      <div className="form-row">
        <div className="form-group">
          <label className="input-label">Branch</label>
          <div className="input-icon-container">
            <select
              name="branch"
              className="input-box with-icon"
              value={scheduleInput.branch}
              onChange={handleInputChange}
              disabled={loading}
            >
              <option value="">Select Branch</option>
              {dropdownOptions.branches.map(branch => (
                <option key={branch.id} value={branch.branch_name}>{branch.branch_name}</option>
              ))}
            </select>
            <img src={FilterIcon} alt="dropdown" className="input-icon dropdown-icon" />
          </div>
          {errors.branch && <span className="error">{errors.branch}</span>}
        </div>
        <div className="form-group">
          <label className="input-label">Student ID</label>
          <input
            name="student_no"
            type="text"
            className="input-box"
            value={scheduleInput.student_no}
            placeholder="e.g. ST-001"
            onChange={handleInputChange}
          />
          {errors.student_no && <span className="error">{errors.student_no}</span>}
        </div>
      </div>
      <div className="form-row">
        <div className="form-group">
          <label className="input-label">Schedule Day</label>
          <div className="input-icon-container">
            <select
              name="schedule_day"
              className="input-box with-icon"
              value={scheduleInput.schedule_day}
              onChange={handleInputChange}
              disabled={loading || !scheduleInput.branch || !availableDays.length}
            >
              <option value="">Select Day</option>
              {availableDays.length > 0 ? (
                availableDays.map(day => (
                  <option key={day} value={day}>{day}</option>
                ))
              ) : (
                <option value="" disabled>No available days for selected branch</option>
              )}
            </select>
            <img src={FilterIcon} alt="dropdown" className="input-icon dropdown-icon" />
          </div>
          {errors.schedule_day && <span className="error">{errors.schedule_day}</span>}
        </div>
        <div className="form-group">
          <label className="input-label">Schedule Time</label>
          <div className="input-icon-container">
            <select
              name="schedule_time"
              className="input-box with-icon"
              value={scheduleInput.schedule_time}
              onChange={handleInputChange}
              disabled={loading || !scheduleInput.branch || !scheduleInput.schedule_day || !filteredSlots.length}
            >
              <option value="">Select Time</option>
              {filteredSlots.length > 0 ? (
                filteredSlots.map(slot => (
                  <option key={slot.id} value={slot.time}>{slot.time}</option>
                ))
              ) : (
                <option value="" disabled>No available times for selected branch and day</option>
              )}
            </select>
            <img src={FilterIcon} alt="dropdown" className="input-icon dropdown-icon" />
          </div>
          {errors.schedule_time && <span className="error">{errors.schedule_time}</span>}
        </div>
      </div>
      <button type="button" className="assign-btn" onClick={handleAssign} disabled={loading}>
        Assign Schedule
      </button>
      {errors.schedules && <p className="error-msg">{errors.schedules}</p>}
      {formData.schedules?.length > 0 && (
        <div className="assigned-table-wrapper">
          <table className="assigned-table">
            <thead>
              <tr>
                <th className="day-col">Day</th>
                <th className="time-col">Time</th>
              </tr>
            </thead>
            <tbody>
              {formData.schedules.map(({ id, day, time }) => (
                <tr key={id}>
                  <td className="day-col">{day}</td>
                  <td className="time-col">{time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Step4AcademicDetails;