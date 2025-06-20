// src/sections/students/StudentFormStepper/Step2ContactDetails.js
import React from 'react';
import '../../../Styles/Students-css/AddStudentForm.css';

const Step2ContactDetails = ({ formData, onChange, errors }) => {
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    onChange({ [name]: value });
  };

  return (
    <div className="step-two-fields">
      <h3 className="section-header">Contact Details</h3>

      <div className="form-row">
        <div className="form-group">
  <label htmlFor="whatsapp">WhatsApp Number</label>
  <input
    id="whatsapp"
    name="whatsapp"
    placeholder="eg: WhatsApp Number"
    value={formData.whatsapp}
    onChange={(e) => onChange({ whatsapp: e.target.value })}
  />
</div>

<div className="form-group">
  <label htmlFor="phone">ICE Contact</label>
  <input
    id="phone"
    name="phone"
    placeholder="eg: ICE Contact"
    value={formData.phone}
    onChange={(e) => onChange({ phone: e.target.value })}
  />
</div>

{/* Repeat for email and address */}

      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            name="email"
            placeholder="eg: Joshap09@gmail.com"
            value={formData.email || ''}
            onChange={handleInputChange}
          />

        </div>

        <div className="form-group">
          <label>Address</label>
          <input
            type="text"
            name="address"
            placeholder="eg: Koppay, Jaffna."
            value={formData.address || ''}
            onChange={handleInputChange}
          />

        </div>
      </div>
    </div>
  );
};

export default Step2ContactDetails;
