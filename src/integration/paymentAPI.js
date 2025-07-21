import React, { useState, useEffect } from 'react';
import Step1StudentsDetails from '../sections/payments/stepper/Step1StudentsDetails';
import Step2Courses from '../sections/payments/stepper/Step2Courses';
import Step3PaymentInfo from '../sections/payments/stepper/Step3PaymentInfo';
import axios from 'axios';
const API_BASE_URL = "http://localhost:5000/api";


const PaymentAPI = ({ isOpen, onClose, onPaymentSuccess }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [feesData, setFeesData] = useState(null);

  useEffect(() => {
    if (!isOpen) {
      setCurrentStep(1);
      setSelectedStudent(null);
      setFeesData(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleStudentSelect = (student) => {
  setSelectedStudent(student); // Ensure student includes student_details_id
  // If onStudentSelect is a prop, call it with the full student object
  if (onStudentSelect) onStudentSelect(student);
};

 const handleNext = async () => {
  if (currentStep === 2 && selectedStudent) {
    try {
      const response = await axios.get(API_BASE_URL + `/payment/${selectedStudent.student_details_id}`, {
        headers: { 'Content-Type': 'application/json' },
      });
      setFeesData(response.data);
      setCurrentStep(3);
    } catch (err) {
      console.error('Error fetching fees:', err);
    }
  }
};

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    if (selectedStudent && feesData) {
      try {
        const paymentData = {
          studentId: selectedStudent.id,
          amount: feesData.total_fees,
          payment_date: new Date().toLocaleDateString('en-GB', { timeZone: 'Asia/Colombo' }), // 30/06/2025
          status: 'Paid',
        };
        const response = await axios.post(API_BASE_URL +'/payments', paymentData, {
          headers: { 'Content-Type': 'application/json' },
        });
        const enrichedData = {
          fullName: selectedStudent.full_name || 'N/A',
          studentId: selectedStudent.id,
          subjects: Object.entries(feesData.course_fees || {}).flatMap(([month, grades]) =>
            Object.entries(grades).flatMap(([grade, courses]) =>
              Object.entries(courses).map(([courseName]) => ({ name: courseName, grade: grade.replace('Grade ', '') }))
            )
          ),
          paidFor: Object.keys(feesData.course_fees || {}).join(' & ') || 'N/A',
          admissionFee: feesData.admission_fee || '0',
          monthlyFee: feesData.total_course_fees || feesData.total_fees || '0',
          totalAmount: feesData.total_fees || '0',
          location: selectedStudent.branch_name || 'N/A',
          date: paymentData.payment_date,
          transactionId: response.data.transactionId || Math.random().toString(36).substr(2, 9).toUpperCase(),
          status: paymentData.status,
        };
        console.log('Enriched Data in PaymentAPI:', enrichedData);
        onPaymentSuccess(enrichedData); // Pass data to parent
        onClose(); // Close the current modal
      } catch (err) {
        console.error('Error submitting payment:', err);
        alert('Failed to submit payment.');
      }
    }
  };

  return (
    <div className="payment-api-container">
      <h2>Student Payment System</h2>
      {currentStep === 1 && <Step1StudentsDetails onStudentSelect={handleStudentSelect} />}
     {currentStep === 2 && selectedStudent && (
  <div>
    <Step2Courses 
      student_details_id={selectedStudent.student_details_id} 
      student_no={selectedStudent.student_no} 
    />
    <button onClick={handleBack} className="back-btn">Back</button>
    <button onClick={handleNext} className="next-btn" disabled={!selectedStudent}>Next</button>
  </div>
)}
      {currentStep === 3 && selectedStudent && feesData && (
        <div>
          <Step3PaymentInfo selectedStudent={{ ...selectedStudent, ...feesData }} />
          <button onClick={handleBack} className="back-btn">Back</button>
          <button onClick={handleSubmit} className="submit-btn">Submit Payment</button>
        </div>
      )}
    </div>
  );
};

export default PaymentAPI;