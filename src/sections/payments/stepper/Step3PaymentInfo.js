import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../../Styles/payment/stepper/Step3PaymentInfo.css';
import user from '../../../assets/icons/user-solid.svg';
import user_address from '../../../assets/icons/address-card-solid.svg';
import location from '../../../assets/icons/location-dot-solid.svg';
const API_BASE_URL = "https://pineappleai.cloud/api/sms/api/api";

const Step3PaymentInfo = ({ selectedStudent, onSelectPayment }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [feesData, setFeesData] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(null); // Track selected month

  useEffect(() => {
    const fetchFees = async () => {
      setLoading(true);
      setError(null);
      if (selectedStudent && selectedStudent.student_details_id) { // Use student_details_id
        try {
          const response = await axios.get(API_BASE_URL + `/payment/${selectedStudent.student_details_id}`, {
            headers: { 'Content-Type': 'application/json' },
          });
          console.log('Fees data in Step3:', response.data);
          setFeesData(response.data);

          // Set initial selected month to the next unpaid month
          const currentDate = new Date(); // July 18, 2025, 09:41 PM +0530
          const currentMonth = currentDate.toLocaleString('en-US', { month: 'short' }); // 'Jul'
          const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
          const paidMonths = (response.data.payments || []).map(p => p.split(' ')[0]); // Extract month from "MMM yyyy"
          const lastPaidIndex = paidMonths.length > 0 ? months.indexOf(paidMonths[paidMonths.length - 1]) : -1;
          const dueMonthIndex = lastPaidIndex >= 0 ? (lastPaidIndex + 1) % 12 : months.indexOf(currentMonth);
          const dueMonth = months[dueMonthIndex];
          setSelectedMonth(dueMonth);

          // Prepare data for receipt with filtered course_fees
          const filteredCourseFees = { [dueMonth]: response.data.course_fees?.[dueMonth] || {} };
          let totalCourseFees = 0;
          Object.values(filteredCourseFees[dueMonth]).forEach(grade =>
            Object.values(grade).forEach(fee => {
              totalCourseFees += fee || 0;
            })
          );

          const totalFees = totalCourseFees + (response.data.admission_fee || 0);

          // Pass data to parent for receipt
          if (onSelectPayment) {
            onSelectPayment({
              ...response.data,
              course_fees: filteredCourseFees,
              total_course_fees: totalCourseFees,
              total_fees: totalFees,
              selectedMonth: dueMonth,
            });
          }
        } catch (err) {
          setError(`Failed to fetch fees for student_details_id: ${selectedStudent.student_details_id}. ${err.response?.data?.message || err.message}`);
          console.error('Error fetching fees:', err);
          setFeesData(null); // Reset feesData on error
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
        setError('No student selected or invalid student_details_id.');
      }
    };
    fetchFees();
  }, [selectedStudent, onSelectPayment]);

  if (loading) return <div className="step-container"><p>Loading...</p></div>;
  if (error) return <div className="step-container"><p className="error">{error}</p></div>;
  if (!selectedStudent) {
    return (
      <div className="step-container">
        <p className="error">No student selected. Please go back and select a student.</p>
      </div>
    );
  }

  const { course_fees, total_course_fees, admission_fee, total_fees } = feesData || {};

  // Flatten course_fees into an array of rows for the selected month
  const feeRows = course_fees && selectedMonth && course_fees[selectedMonth]
    ? Object.entries(course_fees[selectedMonth]).flatMap(([grade, courses]) =>
        Object.entries(courses).map(([courseName, fee]) => ({
          month: selectedMonth,
          courseName: courseName.charAt(0).toUpperCase() + courseName.slice(1),
          grade: grade.replace('Grade ', ''),
          fee: fee || 0,
        }))
      )
    : [];

  console.log('Selected Month in Step3:', selectedMonth, 'Fee Rows:', feeRows, 'Course Fees:', course_fees);

  return (
    <div className="step-container">
      <h4>Payment Summary</h4>
      <div className="payment-student-details">
        <div className="align-items-center">
          <img src={user} alt="Icon" className="icon-style" />
          <div className="text">
            <span><strong>Full Name</strong></span>
            <span>{selectedStudent.full_name || 'N/A'}</span>
          </div>
        </div>
        <div className="align-items-center">
          <img src={user_address} alt="Icon" className="icon-style" />
          <div className="text">
            <span><strong>Student Id</strong></span>
            <span>{selectedStudent.student_no || 'N/A'}</span>
          </div>
        </div>
        <div className="align-items-center">
          <img src={location} alt="Icon" className="icon-style" />
          <div className="text">
            <span><strong>Branch</strong></span>
            <span>{selectedStudent.branch_name || 'N/A'}</span>
          </div>
        </div>
      </div>

      <table className="fees-table">
        <thead>
          <tr>
            <th>Month</th>
            <th>Course</th>
            <th>Grade</th>
            <th>Fees (Rs)</th>
          </tr>
        </thead>
        <tbody>
          {feeRows.length > 0 ? (
            feeRows.map((row, index) => (
              <tr key={index}>
                <td>{row.month}</td>
                <td>{row.courseName}</td>
                <td>{row.grade}</td>
                <td>{row.fee}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4">No fee details available for {selectedMonth}.</td>
            </tr>
          )}
        </tbody>
      </table>

      <div className="payment-summary">
        <div className="summary-row"><span>Payment Total</span><span>{total_course_fees || 0}</span></div>
        <div className="summary-row"><span>Admission Fee</span><span>{admission_fee || 0}</span></div>
        <div className="summary-row total"><span>Total</span><span>{total_fees || 0}</span></div>
      </div>
    </div>
  );
};

export default Step3PaymentInfo;