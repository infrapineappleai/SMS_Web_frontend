// ✅ Updated Step1PersonalInfo.js (Now includes profile image upload logic)
import React from 'react';
import CalendarIcon from '../../../assets/icons/Calendar.png';
import FilterIcon from '../../../assets/icons/Filter.png';
import '../../../Styles/Students-css/StudentFormStepper/Step1PersonalInfo.css';


const Step1PersonalInfo = ({ formData, onChange, errors, onImageChange }) => {
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    onChange({ [name]: value });
  };

  return (
    <div className="step-one-fields-with-image">

      <div className="step1-top-row">
        {/* Upload Section centered at top */}
    <div className="profile-upload-section">
      <label htmlFor="profileUpload" className="profile-upload-label">
        {formData.profileImage ? (
          <img src={formData.profileImage} className="profile-preview" alt="Preview" />
        ) : (
          <div className="upload-placeholder">Upload Image</div>
        )}
      </label>
      <input id="profileUpload" type="file" accept="image/*" hidden onChange={onImageChange} />
      <button
        type="button"
        onClick={() => document.getElementById('profileUpload').click()}
        className="upload-btn"
      >
        Upload Photo
      </button>
    </div>

        <div className="step1-form-section">
          <div className="form-row">
            <div className="form-group">
              <label>Salutation</label>
              <input
                type="text"
                name="salutation"
                placeholder="e.g. Mr, Mrs, Miss"
                value={formData.salutation || ''}
                onChange={handleInputChange}
              />
              {errors.salutation && <span className="error">{errors.salutation}</span>}
            </div>
            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                name="fullName"
                placeholder="e.g. Joshap Jon"
                value={formData.fullName || ''}
                onChange={handleInputChange}
              />
              {errors.fullName && <span className="error">{errors.fullName}</span>}
            </div>
          </div>
          <div className="form-row">
            <div className="form-group dob-group">
              <label className="input-label">Date of Birth</label>
              <div className="input-icon-container">
                <input
                  type="date"
                  name="dob"
                  className="input-box with-icon"
                  value={formData.dob || ''}
                  onChange={handleInputChange}
                />


                
                <img src={CalendarIcon} alt="calendar" className="input-icon calendar-icon" />
              </div>
              {errors.dob && <span className="error">{errors.dob}</span>}
            </div>
            <div className="form-group">
              <label className="input-label">Gender</label>
              <div className="input-icon-container">
                <select
                  name="gender"
                  className="input-box with-icon"
                  value={formData.gender || ''}
                  onChange={handleInputChange}
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
                <img src={FilterIcon} alt="dropdown" className="input-icon dropdown-icon" />
              </div>
              {errors.gender && <span className="error">{errors.gender}</span>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Step1PersonalInfo;
