import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import '../../Styles/payment/Payment.css';
import eyeIcon from '../../assets/icons/Eye.png';
import filterIcon from '../../assets/icons/filter2.png';
import PaymentDetailsModal from '../payments/models/PaymentDetailsModal';
import PaymentSuccessModal from '../payments/models/SuccesPaymentModel';
import Receipt from './Recipt';
import Step1StudentsDetails from '../payments/stepper/Step1StudentsDetails';
import Step2Courses from '../payments/stepper/Step2Courses';
import Step3PaymentInfo from '../payments/stepper/Step3PaymentInfo';
import StepperHeader from '../payments/stepper/StepperHeader';

const PaymentTable = ({ selectedState: propSelectedState = 'State' }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [isStepperOpen, setIsStepperOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);
  const [receiptData, setReceiptData] = useState(null);
  const [selectedState, setSelectedState] = useState(propSelectedState);
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [isStateDropdownOpen, setIsStateDropdownOpen] = useState(false);
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const stateDropdownRef = useRef(null);
  const statusDropdownRef = useRef(null);
  const [payments, setPayments] = useState([]);

  // Fetch payments based on state and status using /api/searchmain
  useEffect(() => {
    const fetchPayments = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get('https://pineappleai.cloud/api/sms/api/searchmain', {
          params: {
            state: selectedState !== 'State' ? selectedState : undefined,
            status: selectedStatus !== 'All' ? selectedStatus : undefined,
          },
        });
        setPayments(response.data);
      } catch (err) {
        console.error('Error fetching payments:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPayments();
  }, [selectedState, selectedStatus]);

  // Fetch payments based on search query using /filterstatus/search
  useEffect(() => {
    const fetchSearchResults = async () => {
      if (searchQuery.trim() === '') {
        // Reset to state/status data when search query is cleared
        const fetchPayments = async () => {
          try {
            setIsLoading(true);
            const response = await axios.get('https://pineappleai.cloud/api/sms/api/searchmain', {
              params: {
                state: selectedState !== 'State' ? selectedState : undefined,
                status: selectedStatus !== 'All' ? selectedStatus : undefined,
              },
            });
            setPayments(response.data);
          } catch (err) {
            console.error('Error resetting payments:', err);
          } finally {
            setIsLoading(false);
          }
        };
        fetchPayments();
        return;
      }
      try {
        setIsLoading(true);
        const response = await axios.get('https://pineappleai.cloud/api/sms/api/filterstatus/search', {
          params: {
            status: selectedStatus !== 'All' ? selectedStatus.toLowerCase() : undefined,
            search: searchQuery,
          },
        });
        setPayments(response.data);
      } catch (err) {
        console.error('Error fetching search results:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSearchResults();
  }, [searchQuery, selectedStatus, selectedState]); // Added selectedState to dependencies

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (stateDropdownRef.current && !stateDropdownRef.current.contains(event.target)) {
        setIsStateDropdownOpen(false);
      }
      if (statusDropdownRef.current && !statusDropdownRef.current.contains(event.target)) {
        setIsStatusDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleAddPayment = () => {
    setIsStepperOpen(true);
  };

  const handlePaymentSuccess = async (data) => {
    console.log('Payment Success Data:', data);
    try {
      setIsLoading(true);
      const response = await axios.post('https://pineappleai.cloud/api/sms/api/payments', {
        full_name: data.fullName || data.studentName || 'N/A',
        student_no: data.studentId || `STU_${Date.now()}`,
        course: data.course || 'Violin',
        amount: parseInt(data.totalAmount) || parseInt(data.amount),
        payDate: data.date || new Date().toLocaleDateString('en-GB', { timeZone: 'Asia/Colombo' }),
        status: data.status || 'Paid',
        branch_name: data.location || 'N/A',
      });
      const newPayment = response.data;

      setReceiptData({
        student_no: newPayment.student_no || data.studentId || `STU_${Date.now()}`,
        full_name: newPayment.full_name || data.fullName || data.studentName || 'N/A',
        branch_name: newPayment.branch_name || data.location || 'N/A',
        course_fees: {},
        total_course_fees: parseInt(data.monthlyFee) || parseInt(data.amount) || 0,
        admission_fee: parseInt(data.admissionFee) || 0,
        total_fees: parseInt(data.totalAmount) || parseInt(data.amount) || 0,
        date: newPayment.payDate || data.date || new Date().toLocaleDateString('en-GB', { timeZone: 'Asia/Colombo' }),
        status: newPayment.status || data.status || 'Paid',
      });

      // Filter out duplicates and update payments
      setPayments((prev) => {
        const existingPayments = prev.filter(
          (p) => p.student_no !== newPayment.student_no && p.full_name !== newPayment.full_name
        );
        return [...existingPayments, newPayment].sort((a, b) => new Date(b.payDate) - new Date(a.payDate)); // Sort by date
      });
      setIsSuccessModalOpen(true);
    } catch (error) {
      console.error('Error processing payment:', error);
      const newPayment = {
        id: Date.now(),
        name: data.fullName || data.studentName || 'N/A',
        course: data.course || 'Violin',
        payDate: data.date || new Date().toLocaleDateString('en-GB', { timeZone: 'Asia/Colombo' }),
        amount: parseInt(data.totalAmount) || parseInt(data.amount),
        status: data.status || 'Paid',
        student_no: data.studentId || `STU_${Date.now()}`,
        full_name: data.fullName || data.studentName || 'N/A',
      };
      setReceiptData({
        student_no: newPayment.student_no,
        full_name: newPayment.full_name,
        branch_name: data.location || 'N/A',
        course_fees: {},
        total_course_fees: parseInt(data.monthlyFee) || parseInt(data.amount) || 0,
        admission_fee: parseInt(data.admissionFee) || 0,
        total_fees: parseInt(data.totalAmount) || parseInt(data.amount) || 0,
        date: newPayment.payDate,
        status: newPayment.status,
      });
      setPayments((prev) => {
        const existingPayments = prev.filter(
          (p) => p.student_no !== newPayment.student_no && p.full_name !== newPayment.full_name
        );
        return [...existingPayments, newPayment].sort((a, b) => new Date(b.payDate) - new Date(a.payDate));
      });
      setIsSuccessModalOpen(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStateDropdownToggle = () => {
    setIsStateDropdownOpen(!isStateDropdownOpen);
    setIsStatusDropdownOpen(false);
  };

  const handleStatusDropdownToggle = () => {
    setIsStatusDropdownOpen(!isStatusDropdownOpen);
    setIsStateDropdownOpen(false);
  };

  const handleStateSelect = (state) => {
    setSelectedState(state.value);
    setIsStateDropdownOpen(false);
  };

  const handleStatusSelect = (status) => {
    setSelectedStatus(status.value);
    setIsStatusDropdownOpen(false);
  };

  const handleIconClick = (action, paymentId) => {
    if (action === 'View') {
      const payment = payments.find((p) => p.id === paymentId);
      if (payment) {
        setSelectedPayment(payment);
        setIsModalOpen(true);
      } else {
        console.warn(`Payment with id ${paymentId} not found`);
      }
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedPayment(null);
  };

  const closeStepper = () => {
    setIsStepperOpen(false);
  };

  const closeSuccessModal = () => {
    setIsSuccessModalOpen(false);
    setReceiptData(null);
  };

  const handleGenerateReceipt = async (studentId) => {
    if (studentId && !isLoading) {
      setIsLoading(true);
      try {
        const response = await axios.get(`https://pineappleai.cloud/api/sms/api/payment/${studentId}`);
        const formattedData = {
          full_name: response.data.full_name || receiptData?.full_name || 'N/A',
          branch_name: response.data.branch_name || receiptData?.branch_name || 'N/A',
          student_no: response.data.student_no || studentId,
          course_fees: response.data.course_fees || receiptData?.course_fees || {},
          total_course_fees: response.data.total_course_fees || receiptData?.total_course_fees || 0,
          admission_fee: response.data.admission_fee || receiptData?.admission_fee || 0,
          total_fees: response.data.total_fees || receiptData?.total_fees || 0,
          date: response.data.date || receiptData?.date || new Date().toLocaleDateString('en-GB', { timeZone: 'Asia/Colombo' }),
        };
        setReceiptData(formattedData);
        setIsReceiptOpen(true);
        setIsSuccessModalOpen(false);
      } catch (error) {
        console.error('Error fetching receipt data for studentId:', studentId, error);
        setReceiptData({
          full_name: receiptData?.full_name || 'N/A',
          branch_name: receiptData?.branch_name || 'N/A',
          student_no: studentId,
          course_fees: receiptData?.course_fees || {},
          total_course_fees: receiptData?.total_course_fees || 0,
          admission_fee: receiptData?.admission_fee || 0,
          total_fees: receiptData?.total_fees || 0,
          date: receiptData?.date || new Date().toLocaleDateString('en-GB', { timeZone: 'Asia/Colombo' }),
        });
        setIsReceiptOpen(true);
        setIsSuccessModalOpen(false);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const closeReceipt = () => {
    setIsReceiptOpen(false);
    setReceiptData(null);
  };

  const getFilteredPayments = () => {
    return payments.filter(payment =>
      (searchQuery === '' ||
        payment.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        payment.payDate?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        payment.amount?.toString().includes(searchQuery))
    );
  };

  const stateOptions = [
    { value: 'State', label: 'State' },
    { value: 'Active', label: 'Active' },
    { value: 'Inactive', label: 'Inactive' },
  ];

  const statusOptions = [
    { value: 'All', label: 'All' },
    { value: 'Paid', label: 'Paid' },
    { value: 'Pending', label: 'Pending' },
  ];

  const selectedStateOption = stateOptions.find((option) => option.value === selectedState) || stateOptions[0];

  const StudentFeeStepperModal = ({ isOpen, onClose, onPaymentSuccess }) => {
    const [currentStep, setCurrentStep] = useState(1);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [feesData, setFeesData] = useState(null);
    const [selectedCourse, setSelectedCourse] = useState('Violin');

    useEffect(() => {
      if (isOpen) {
        setCurrentStep(1);
        setSelectedStudent(null);
        setFeesData(null);
        setSelectedCourse('Violin');
      }
    }, [isOpen]);

    const handleNext = async () => {
      if (currentStep === 1 && selectedStudent) {
        try {
          const response = await axios.get(`https://pineappleai.cloud/api/sms/api/payment/${selectedStudent.student_no}`, {
            headers: { 'Content-Type': 'application/json' },
          });
          setFeesData({ ...response.data, course: selectedCourse });
          setCurrentStep(2);
        } catch (err) {
          console.error('Error fetching fees for student_no:', selectedStudent.student_no, err);
        }
      } else if (currentStep === 2) {
        setCurrentStep(3);
      }
    };

    const handlePrev = () => {
      if (currentStep > 1) {
        setCurrentStep((prev) => prev - 1);
      }
    };

    const handleSubmit = async () => {
      if (selectedStudent && feesData) {
        try {
          const paymentData = {
            full_name: selectedStudent.full_name || 'N/A',
            student_no: selectedStudent.student_no || `STU_${Date.now()}`,
            course: selectedCourse || 'Violin',
            total_fees: feesData.total_fees || 4000,
            date: new Date().toLocaleDateString('en-GB', { timeZone: 'Asia/Colombo' }),
            status: 'Paid',
            branch_name: selectedStudent.branch_name || 'N/A',
            course_fees: feesData.course_fees || {},
            admission_fee: feesData.admission_fee || 0,
          };

          const paymentResponse = await axios.post(
            `https://pineappleai.cloud/api/sms/api/payment/${selectedStudent.student_no}`,
            paymentData,
            { headers: { 'Content-Type': 'application/json' } }
          );

          const successData = {
            fullName: paymentResponse.data.full_name || selectedStudent.full_name || 'N/A',
            studentId: paymentResponse.data.student_no || selectedStudent.student_no || `STU_${Date.now()}`,
            course: paymentResponse.data.course || selectedCourse || 'Violin',
            amount: paymentResponse.data.total_fees || feesData.total_fees || 4000,
            date: paymentResponse.data.date || new Date().toLocaleDateString('en-GB', { timeZone: 'Asia/Colombo' }),
            transactionId: Math.random().toString(36).substr(2, 9).toUpperCase(),
            status: paymentResponse.data.status || 'Paid',
            location: paymentResponse.data.branch_name || selectedStudent.branch_name || 'N/A',
            subjects: Object.entries(paymentResponse.data.course_fees || feesData.course_fees || {}).flatMap(([month, grades]) =>
              Object.entries(grades).flatMap(([grade, courses]) =>
                Object.entries(courses).map(([courseName]) => ({ name: courseName, grade: grade.replace('Grade ', '') }))
              )
            ),
            paidFor: Object.keys(paymentResponse.data.course_fees || feesData.course_fees || {}).join(' & ') || 'N/A',
            admissionFee: paymentResponse.data.admission_fee || feesData.admission_fee || '0',
            monthlyFee: paymentResponse.data.total_course_fees || feesData.total_course_fees || feesData.total_fees || '0',
            totalAmount: paymentResponse.data.total_fees || feesData.total_fees || '0',
          };

          onPaymentSuccess(successData);
          onClose();
        } catch (err) {
          console.error('Error posting payment data:', err);
          const fallbackData = {
            fullName: selectedStudent.full_name || 'N/A',
            studentId: selectedStudent.student_no || `STU_${Date.now()}`,
            course: selectedCourse,
            amount: feesData.total_fees || 4000,
            date: new Date().toLocaleDateString('en-GB', { timeZone: 'Asia/Colombo' }),
            transactionId: Math.random().toString(36).substr(2, 9).toUpperCase(),
            status: 'Paid',
            location: selectedStudent.branch_name || 'N/A',
            subjects: Object.entries(feesData.course_fees || {}).flatMap(([month, grades]) =>
              Object.entries(grades).flatMap(([grade, courses]) =>
                Object.entries(courses).map(([courseName]) => ({ name: courseName, grade: grade.replace('Grade ', '') }))
              )
            ),
            paidFor: Object.keys(feesData.course_fees || {}).join(' & ') || 'N/A',
            admissionFee: feesData.admission_fee || '0',
            monthlyFee: feesData.total_course_fees || feesData.total_fees || '0',
            totalAmount: feesData.total_fees || '0',
          };
          onPaymentSuccess(fallbackData);
          onClose();
        }
      }
    };

    const renderStepContent = () => {
      switch (currentStep) {
        case 1:
          return <Step1StudentsDetails onStudentSelect={setSelectedStudent} />;
        case 2:
          return selectedStudent ? (
            <Step2Courses
              studentId={selectedStudent.student_no}
              onCourseSelect={setSelectedCourse}
              currentCourse={selectedCourse}
            />
          ) : (
            <p>Select a student first.</p>
          );
        case 3:
          return selectedStudent && feesData ? (
            <Step3PaymentInfo selectedStudent={{ ...selectedStudent, ...feesData, course: selectedCourse }} />
          ) : (
            <p>Loading payment info...</p>
          );
        default:
          return null;
      }
    };

    if (!isOpen) return null;

    return (
      <div className="modal-overlay">
        <div className="modal-content student-fee-entry-modal">
          <div className="modal-header">
            <h2>Student Fee Entry</h2>
            <button className="close-btn" onClick={onClose}>×</button>
          </div>
          <StepperHeader currentStep={currentStep} />
          <div className="modal-body">{renderStepContent()}</div>
          <div className="modal-footer">
            {currentStep > 1 && (
              <button className="prev-btn" onClick={handlePrev}>
                Previous
              </button>
            )}
            {currentStep < 3 ? (
              <button
                className="next-btn"
                onClick={handleNext}
                disabled={currentStep === 1 && !selectedStudent}
              >
                Next
              </button>
            ) : (
              <button className="submit-btn" onClick={handleSubmit} disabled={!selectedStudent || !feesData}>
                Submit Payment
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="payment-header">
        <input
          type="text"
          placeholder="Search..."
          className="search-bar"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button className="add-payment-btn" onClick={handleAddPayment}>
          + Add Payment
        </button>
      </div>

      <div className="filter-controls-container">
        <div className="filter-dropdown-container" ref={stateDropdownRef}>
          <button
            className={`filter-dropdown-btn ${isStateDropdownOpen ? 'open' : ''}`}
            onClick={handleStateDropdownToggle}
            type="button"
          >
            <span>{selectedStateOption.label}</span>
            <svg
              className={`dropdown-arrow ${isStateDropdownOpen ? 'rotated' : ''}`}
              width="12"
              height="8"
              viewBox="0 0 12 8"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M1 1.5L6 6.5L11 1.5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          {isStateDropdownOpen && (
            <div className="filter-dropdown-menu">
              {stateOptions.map((option) => (
                <div
                  key={option.value}
                  className={`filter-dropdown-item ${selectedState === option.value ? 'selected' : ''}`}
                  onClick={() => handleStateSelect(option)}
                >
                  {option.label}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Pay Date</th>
              <th>Amount (Rs)</th>
              <th>
                <div className="status-filter-container" ref={statusDropdownRef}>
                  Status
                  <img
                    src={filterIcon}
                    alt="Filter"
                    className="icon filter-icon"
                    onClick={handleStatusDropdownToggle}
                  />
                  {isStatusDropdownOpen && (
                    <div className="status-dropdown-menu">
                      {statusOptions.map((option) => (
                        <div
                          key={option.value}
                          className={`status-dropdown-item ${selectedStatus === option.value ? 'selected' : ''}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleStatusSelect(option);
                          }}
                        >
                          {option.label}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {getFilteredPayments().map((payment) => (
              <tr key={payment.id}>
                <td>{payment.full_name || payment.name || 'Unknown Name'}</td>
                <td>{payment.payDate || payment.payment_date || 'N/A'}</td>
                <td>{payment.amount || 0}</td> {/* Default to 0 if undefined */}
                <td>
                  <span className={payment.status === 'Paid' ? 'status-paid' : 'status-pending'}>
                    {payment.status || 'Unknown'}
                  </span>
                </td>
                <td className="action-icons">
                  <img
                    src={eyeIcon}
                    alt="View"
                    className="icon"
                    onClick={() => handleIconClick('View', payment.id)}
                    title="View Details"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {getFilteredPayments().length === 0 && (
          <div className="no-data">
            <p>No payments found for the selected filters.</p>
          </div>
        )}
      </div>

      <PaymentDetailsModal isOpen={isModalOpen} onClose={closeModal} paymentData={selectedPayment} />
      <StudentFeeStepperModal
        isOpen={isStepperOpen}
        onClose={closeStepper}
        onPaymentSuccess={handlePaymentSuccess}
      />
      <PaymentSuccessModal
        isOpen={isSuccessModalOpen}
        onClose={closeSuccessModal}
        onGenerateReceipt={() => handleGenerateReceipt(receiptData?.student_no)}
        receiptData={receiptData}
      />
      <Receipt
        isOpen={isReceiptOpen}
        onClose={closeReceipt}
        receiptData={receiptData}
      />
    </>
  );
};

export default PaymentTable;