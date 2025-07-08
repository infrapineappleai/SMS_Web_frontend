import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../../../Styles/payment/PaymentDetailsModal.css';

const PaymentDetailsModal = ({ isOpen, onClose, paymentData }) => {
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [course, setCourse] = useState('Unknown');
  const [grade, setGrade] = useState('Unknown');

  useEffect(() => {
    if (isOpen && paymentData?.student_no) {
      const fetchPaymentHistory = async () => {
        try {
          const response = await axios.get(`https://pineappleai.cloud/api/sms/api/payment-history/${paymentData.student_no}`);
          const { course: fetchedCourse, grade: fetchedGrade, paidHistory = [], pendingHistory = [] } = response.data;
          setCourse(fetchedCourse || 'Unknown');
          setGrade(fetchedGrade || 'Unknown');
          setPaymentHistory([...paidHistory, ...pendingHistory]);
        } catch (error) {
          console.error('Error fetching payment history:', error);
          setPaymentHistory([]);
        }
      };
      fetchPaymentHistory();
    }
  }, [isOpen, paymentData?.student_no]);

  if (!isOpen || !paymentData) return null;

  return (
    <div className="payment-modal-overlay" onClick={onClose}>
      <div className="payment-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="payment-modal-header">
          <h2>Payment Details</h2>
          <button className="payment-close-button" onClick={onClose}>
            ×
          </button>
        </div>
        
        <div className="payment-modal-body">
          <div className="student-info-section">
            <p><strong>Name : </strong>{paymentData?.name || 'N/A'}</p>
          </div>

          <div className="course-info-section">
            <div className="course-header">
              <span className="course-header-title">Course</span>
              <span className="grade-header-title">Grade</span>
            </div>
            <div className="course-row">
              <span className="course-name">{course}</span>
              <span className="course-grade">{grade}</span>
            </div>
          </div>

          <div className="payment-history-section">
            <table className="payment-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Branch</th>
                  <th>Payment(Rs)</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {paymentHistory.map((detail, index) => (
                  <tr key={index}>
                    <td>{detail.date}</td>
                    <td>{detail.branch || 'N/A'}</td>
                    <td>{detail.payment}</td>
                    <td>
                      <span className={`payment-status ${detail.status.toLowerCase()}`}>
                        {detail.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentDetailsModal;