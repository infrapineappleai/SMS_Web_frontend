import React, { useState, useEffect } from 'react';
import Stepper from './StudentFormStepper/StudentFormStepper';
import Step1PersonalInfo from './StudentFormStepper/Step1PersonalInfo';
import Step2ContactDetails from './StudentFormStepper/Step2ContactDetails';
import Step3EducationalRecords from './StudentFormStepper/Step3EducationalRecords';
import Step4AcademicDetails from './StudentFormStepper/Step4AcademicDetails';
import Step5Summary from './StudentFormStepper/Step5Summary';
import '../../Styles/Students-css/AddStudentForm.css';
import closeIcon from '../../assets/icons/Close.png';
import { useToast } from '../../modals/ToastProvider';
import NextButton from '../../Components/Buttons/Next_button';
import PreviousButton from '../../Components/Buttons/PreviousButton';

const getInitialFormData = () => ({
  status: 'Active',
  assignedCourses: [],
  schedules: [],
  salutation: '',
  fullName: '',
  name: '',
  dob: '',
  gender: '',
  whatsapp: '',
  phone: '',
  email: '',
  address: '',
  profileImage: null,
  branch: '',
  studentId: '',
  admissionFee: '',
  iceContact: '',
});

const AddStudentForm = ({ isOpen, onClose, onAddStudent, initialData }) => {
  const { showToast } = useToast();
  const [step, setStep] = useState(1);
  const totalSteps = 4;
  const [formData, setFormData] = useState(getInitialFormData);
  const [errors, setErrors] = useState({});
  const [showSummary, setShowSummary] = useState(false);

  const steps = ['Personal Information', 'Contact Details', 'Educational Records', 'Academic Details'];

  // Prefill form if initialData changes or modal opens
  useEffect(() => {
    if (initialData && isOpen) {
      setFormData({
        status: initialData.status || 'Active',
        assignedCourses: initialData.assignedCourses || [],
        schedules: initialData.schedules || [],
        salutation: initialData.salutation || '',
        fullName: initialData.fullName || initialData.name || '',
        name: initialData.name || '',
        dob: initialData.dob || '',
        gender: initialData.gender || '',
        whatsapp: initialData.whatsapp || '',
        phone: initialData.phone || '',
        email: initialData.email || '',
        address: initialData.address || '',
        profileImage: initialData.profileImage || null,
        branch: initialData.branch || '',
        studentId: initialData.studentId || '',
        admissionFee: initialData.admissionFee || '',
        iceContact: initialData.iceContact || '',
      });
      setStep(1);
      setErrors({});
      setShowSummary(false);
    } else if (!isOpen) {
      setFormData(getInitialFormData());
      setStep(1);
      setErrors({});
      setShowSummary(false);
    }
  }, [initialData, isOpen]);

  const validateStep = (cur) => {
    const errs = {};
    if (cur === 1) {
      ['salutation', 'fullName', 'dob', 'gender'].forEach(f => {
        if (!formData[f]) errs[f] = 'Required';
      });
    }
    if (cur === 2) {
      ['whatsapp', 'phone', 'email', 'address'].forEach(f => {
        if (!formData[f]) errs[f] = 'Required';
      });
    }
    if (cur === 3 && formData.assignedCourses.length === 0) {
      errs.assignedCourses = 'At least one course is required';
    }
    return errs;
  };

  const handleNext = () => {
    const errs = validateStep(step);
    if (Object.keys(errs).length) {
      setErrors(errs);
      showToast({
        title: 'Validation Error',
        message: 'Please fill all required fields',
        isError: true
      });
      return;
    }

    setErrors({});
    if (step < totalSteps) {
      setStep(step + 1);
    } else if (step === totalSteps) {
      setFormData(prev => ({
        ...prev,
        name: `${prev.salutation} ${prev.fullName}`.trim(),
      }));
      setShowSummary(true);
    }
  };

  const handleBack = () => {
    setShowSummary(false);
  };

  const handleFormDataChange = (updates) => {
    setFormData(prev => {
      const newData = { ...prev, ...updates };
      if ('salutation' in updates || 'fullName' in updates) {
        newData.name = `${newData.salutation} ${newData.fullName}`.trim();
      }
      return newData;
    });

    setErrors(prev => {
      const updated = { ...prev };
      Object.keys(updates).forEach(k => delete updated[k]);
      return updated;
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      handleFormDataChange({ profileImage: reader.result });
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = () => {
    const payload = {
      ...formData,
      name: formData.name,
    };

    onAddStudent(payload);

    showToast({
      title: 'Success',
      message: 'Student saved successfully!',
      isError: false
    });

    setShowSummary(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {!showSummary && (
        <div className="student-modal-overlay">
          <div className="student-modal">
            <div className="modal-header">
              <h2 className="popup-header">{initialData ? 'Edit Student' : 'Student Registration'}</h2>
              <img src={closeIcon} alt="close" className="close-icon" onClick={onClose} />
            </div>

            <div className="stepper-wrapper-unique">
              <Stepper steps={steps} currentStep={step} />
            </div>

            <div className="modal-content-wrapper">
              {step === 1 && (
                <Step1PersonalInfo
                  formData={formData}
                  onChange={handleFormDataChange}
                  errors={errors}
                  onImageChange={handleImageChange}
                />
              )}
              {step === 2 && (
                <Step2ContactDetails
                  formData={formData}
                  onChange={handleFormDataChange}
                  errors={errors}
                />
              )}
              {step === 3 && (
                <Step3EducationalRecords
                  formData={formData}
                  onChange={handleFormDataChange}
                  errors={errors}
                />
              )}
              {step === 4 && (
                <Step4AcademicDetails
                  formData={formData}
                  onChange={handleFormDataChange}
                  errors={errors}
                />
              )}
            </div>

            <div className="modal-actions">
              {step > 1 && (
                <PreviousButton onClick={() => setStep(prev => Math.max(prev - 1, 1))} />
              )}
              <NextButton onClick={handleNext} />
            </div>
          </div>
        </div>
      )}

      <Step5Summary
        isOpen={showSummary}
        onClose={handleBack}
        studentData={formData}
        onSave={handleSubmit}
      />
    </>
  );
};

export default AddStudentForm;
