import React, { useState, useEffect, useMemo } from 'react';
import Stepper from './StudentFormStepper/StudentFormStepper';
import Step1PersonalInfo from './StudentFormStepper/Step1PersonalInfo';
import Step2ContactDetails from './StudentFormStepper/Step2ContactDetails';
import Step3EducationalRecords from './StudentFormStepper/Step3EducationalRecords';
import Step4AcademicDetails from './StudentFormStepper/Step4AcademicDetails';
import Step5Summary from './StudentFormStepper/Step5Summary';
import '../../Styles/Students-css/AddStudentForm.css';
import closeIcon from '../../assets/icons/Close.png';
import { useToast } from '../../modals/ToastProvider';
import { createStudent, updateStudent } from '../../integration/studentAPI';
import NextButton from '../../Components/Buttons/Next_button';
import PreviousButton from '../../Components/Buttons/PreviousButton';

const getInitialFormData = () => ({
  status: 'Active',
  salutation: '',
  first_name: '',
  last_name: '',
  name: '',
  date_of_birth: '',
  gender: '',
  phn_num: '',
  ice_contact: '',
  email: '',
  address: '',
  photo_url: '',
  branch: '',
  student_no: '',
  course: '',
  grade: '',
  schedule_day: '',
  schedule_time: '',
  payment: { amount: '', status: 'pending' },
  assignedCourses: [],
  schedules: []
});

const AddStudentForm = ({ isOpen, onClose, onAddStudent, initialData }) => {
  const { showToast } = useToast();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState(getInitialFormData);
  const [errors, setErrors] = useState({});
  const [showSummary, setShowSummary] = useState(false);
  const totalSteps = 4;

  const steps = useMemo(() => [
    'Personal Information',
    'Contact Details',
    'Educational Records',
    'Academic Details'
  ], []);

  useEffect(() => {
    if (initialData && isOpen) {
      setFormData({
        ...getInitialFormData(),
        ...initialData,
        name: `${initialData.salutation || ''} ${initialData.first_name || ''} ${initialData.last_name || ''}`.trim(),
        assignedCourses: initialData.course ? [{ course: initialData.course, grade: initialData.grade, id: Date.now() }] : [],
        schedules: initialData.schedule_day ? [{ day: initialData.schedule_day, time: initialData.schedule_time, branch: initialData.branch, id: Date.now() }] : [],
        payment: initialData.payment || { amount: '', status: 'pending' }
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
      ['salutation', 'first_name', 'last_name', 'date_of_birth', 'gender'].forEach(f => {
        if (!formData[f]) errs[f] = 'Required';
      });
    }
    if (cur === 2) {
      ['phn_num', 'ice_contact', 'email', 'address'].forEach(f => {
        if (!formData[f]) errs[f] = 'Required';
      });
      if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
        errs.email = 'Invalid email format';
      }
    }
    if (cur === 3) {
      if (!formData.course) errs.course = 'Course is required';
      if (!formData.grade) errs.grade = 'Grade is required';
    }
    if (cur === 4) {
      if (!formData.branch) errs.branch = 'Branch is required';
      if (!formData.student_no) errs.student_no = 'Student ID is required';
      if (!formData.schedule_day) errs.schedule_day = 'Schedule day is required';
      if (!formData.schedule_time) errs.schedule_time = 'Schedule time is required';
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
        isError: true,
      });
      return;
    }
    setErrors({});
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      if (!formData.grade || !formData.schedule_time) {
        showToast({
          title: 'Validation Error',
          message: 'Grade and schedule time are required before submission',
          isError: true,
        });
        return;
      }
      setShowSummary(true);
    }
  };

  const handleBack = () => {
    setStep(prev => Math.max(prev - 1, 1));
  };

  const handleFormDataChange = (updates) => {
    setFormData(prev => {
      const newData = { ...prev, ...updates };
      if ('salutation' in updates || 'first_name' in updates || 'last_name' in updates) {
        newData.name = `${newData.salutation || ''} ${newData.first_name || ''} ${newData.last_name || ''}`.trim();
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
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        handleFormDataChange({ 
          
        photo_url: reader.result, // for preview
        photoFile: file           // for backend FormData upload

         });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    try {
      const errs = validateStep(4);
      if (Object.keys(errs).length || !formData.grade || !formData.schedule_time) {
        setErrors({ ...errs, grade: !formData.grade ? 'Grade is required' : errs.grade, schedule_time: !formData.schedule_time ? 'Schedule time is required' : errs.schedule_time });
        showToast({
          title: 'Validation Error',
          message: 'Please ensure all required fields, including grade and schedule time, are filled',
          isError: true,
        });
        return;
      }



 // Prepare FormData instead of JSON payload
    const formDataToSend = new FormData();

    formDataToSend.append('salutation', formData.salutation);
    formDataToSend.append('first_name', formData.first_name);
    formDataToSend.append('last_name', formData.last_name);
    formDataToSend.append('email', formData.email);
    formDataToSend.append('phn_num', formData.phn_num);
    formDataToSend.append('ice_contact', formData.ice_contact);
    formDataToSend.append('address', formData.address);
    formDataToSend.append('gender', formData.gender);
    formDataToSend.append('date_of_birth', formData.date_of_birth);
    formDataToSend.append('student_no', formData.student_no);
    formDataToSend.append('status', formData.status.toLowerCase());
    formDataToSend.append('course', formData.course);
    formDataToSend.append('grade', formData.grade);
    formDataToSend.append('branch', formData.branch);
    formDataToSend.append('schedule_day', formData.schedule_day);
    formDataToSend.append('schedule_time', formData.schedule_time);
    formDataToSend.append('payment', JSON.stringify(formData.payment));

    // Append image file if present
    if (formData.photoFile) {
      formDataToSend.append('photo', formData.photoFile); // 'photo' is key expected by backend
    }

    let result;
    if (initialData?.id) {
      result = await updateStudent(initialData.id, formDataToSend); // updateStudent must handle FormData now
      showToast({ title: 'Success', message: 'Student updated successfully!' });
    } else {
      result = await createStudent(formDataToSend); // createStudent must handle FormData now
      showToast({ title: 'Success', message: 'Student created successfully!' });
    }

    await onAddStudent(result);
    setShowSummary(false);
    onClose();
  } catch (error) {
    showToast({
      title: 'Error',
      message: `Failed to save student: ${error.message}`,
      isError: true,
    });
  }
};




























  //     const payload = {
  //       salutation: formData.salutation,
  //       first_name: formData.first_name,
  //       last_name: formData.last_name,
  //       email: formData.email,
  //       phn_num: formData.phn_num,
  //       ice_contact: formData.ice_contact,
  //       address: formData.address,
  //       gender: formData.gender,
  //       date_of_birth: formData.date_of_birth,
  //       student_no: formData.student_no,
  //       photo_url: formData.photo_url,
  //       status: formData.status.toLowerCase(),
  //       course: formData.course,
  //       grade: formData.grade,
  //       branch: formData.branch,
  //       schedule_day: formData.schedule_day,
  //       schedule_time: formData.schedule_time,
  //       payment: formData.payment
  //     };

  //     let result;
  //     if (initialData?.id) {
  //       result = await updateStudent(initialData.id, payload);
  //       showToast({ title: 'Success', message: 'Student updated successfully!' });
  //     } else {
  //       result = await createStudent(payload);
  //       showToast({ title: 'Success', message: 'Student created successfully!' });
  //     }

  //     await onAddStudent(result);
  //     setShowSummary(false);
  //     onClose();
  //   } catch (error) {
  //     showToast({
  //       title: 'Error',
  //       message: `Failed to save student: ${error.message}`,
  //       isError: true,
  //     });
  //   }
  // };

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
            <div className={`modal-actions ${step === 1 ? 'long-next-layout' : 'standard-buttons'}`}>
              {step === 1 ? (
                <NextButton onClick={handleNext} />
              ) : (
                <>
                  <PreviousButton onClick={handleBack} />
                  <NextButton onClick={handleNext} />
                </>
              )}
            </div>
          </div>
        </div>
      )}
      {showSummary && (
        <Step5Summary
          isOpen={showSummary}
          studentData={formData}
          onClose={() => {
            setShowSummary(false);
            onClose();
          }}
          onSave={handleSubmit}
          onEdit={() => {
            setShowSummary(false);
            setStep(1);
          }}
        />
      )}
    </>
  );
};

export default AddStudentForm;