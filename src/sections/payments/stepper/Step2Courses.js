import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../../Styles/payment/stepper/Step2Courses.css'; // Ensure this CSS file exists
const API_BASE_URL = "https://pineappleai.cloud/api/sms/api/api";

const Step2Courses = ({ student_no,student_details_id, onMonthSelect }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [feesData, setFeesData] = useState(null);
  const [payments, setPayments] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(null); // Track selected month

 useEffect(() => {
  const fetchFees = async () => {
    setLoading(true);
    setError(null);
    console.log('Fetching fees for student_details_id:', student_details_id);
    let effectiveStudentId = student_details_id;

    if (!effectiveStudentId && student_no) {
      try {
        const searchResponse = await axios.get(API_BASE_URL + '/student/search', {
          params: { student_no: student_no, _t: Date.now() }
        });
        const student = searchResponse.data;
        if (student && student.student_details_id) {
          effectiveStudentId = student.student_details_id;
        } else {
          setError('No valid student_details_id found for the given student_no.');
          setLoading(false);
          return;
        }
      } catch (err) {
        setError(`Failed to fetch student_details_id: ${err.message}`);
        setLoading(false);
        return;
      }
    }

    if (!effectiveStudentId) {
      setError('No valid student_details_id provided.');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get(API_BASE_URL + `/payment/${effectiveStudentId}`, {
        headers: { 'Content-Type': 'application/json' },
      });
      console.log('Fees data response:', response.data);
      const data = response.data;
      setFeesData(data);
      setPayments(data.payments || []);
      const availableMonths = data.course_fees ? Object.keys(data.course_fees) : [];
      const initialMonth = data.due_month || (availableMonths.length > 0 ? availableMonths[0] : null);
      setSelectedMonth(initialMonth);
      if (onMonthSelect && initialMonth) onMonthSelect(initialMonth);
    } catch (err) {
      setError(`Failed to fetch fees for student_details_id: ${effectiveStudentId}. ${err.response?.status} - ${err.response?.data?.message || err.message}`);
      console.error('API Error:', err);
    } finally {
      setLoading(false);
    }
  };
  fetchFees();
}, [student_details_id, student_no, onMonthSelect]);

  if (loading) return <div className="step-container"><p>Loading...</p></div>;
  if (error) return <div className="step-container"><p className="error">{error}</p></div>;
  if (!feesData) return <div className="step-container"><p>No data available for student_details_id: {student_details_id}.</p></div>;

  const { course_fees, total_course_fees, admission_fee, total_fees, due_month } = feesData;
  const currentDate = new Date(); // July 18, 2025, 09:48 PM +0530
  const currentYear = currentDate.getFullYear(); // 2025
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  // Determine paid months from payments
  const paidMonths = payments.map(p => p.split(' ')[0]); // Extract month from "MMM yyyy"

  // Determine the status of each month for this student
  const getMonthStatus = (month) => {
    if (paidMonths.includes(month)) return 'paid';
    if (due_month === month) return 'due';
    if (course_fees && month in course_fees) return 'upcoming';
    return '';
  };

  // Determine if a month is clickable (any month with course fees)
  const isMonthClickable = (month) => {
    return course_fees && month in course_fees; // Clickable if month exists in course_fees
  };

  // Handle month click
  const handleMonthClick = (month) => {
    if (isMonthClickable(month)) {
      setSelectedMonth(month);
      if (onMonthSelect) onMonthSelect(month); // Notify parent of selected month
    }
  };

  // Flatten course_fees into an array of rows for the selected month
  const feeRows = course_fees && selectedMonth && course_fees[selectedMonth]
    ? Object.entries(course_fees[selectedMonth]).flatMap(([grade, courses]) =>
        Object.entries(courses).map(([courseName, fee]) => ({
          month: selectedMonth,
          courseName: courseName.charAt(0).toUpperCase() + courseName.slice(1),
          grade: grade.replace('Grade ', ''),
          fee,
        }))
      )
    : [];

  console.log('Selected Month:', selectedMonth, 'Fee Rows:', feeRows, 'Course Fees:', course_fees, 'Due Month:', due_month); // Debug log

  return (
    <div className="step-container">
      <div className="courses-fees-header">
        <h4>Courses & Fees</h4>
        <div className='date-container'>
          <div className="period-selector-container">
            <select className="year-dropdown" defaultValue={currentYear}>
              <option>2025</option>
              <option>2024</option>
            </select>
            <div className="legend">
              <span className="legend-item paid">Paid</span>
              <span className="legend-item due">Due</span>
              <span className="legend-item upcoming">Upcoming</span>
            </div>
          </div>
          <div className="month-grid">
            {months.map((month) => {
              const status = getMonthStatus(month);
              const isClickable = isMonthClickable(month);
              return (
                <button
                  key={month}
                  className={`month-btn ${month === selectedMonth ? 'selected' : ''} ${status}`}
                  onClick={() => handleMonthClick(month)}
                  disabled={!isClickable}
                >
                  {month}
                </button>
              );
            })}
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
              <td colSpan="4">No fee details available for student {student_details_id} for {selectedMonth}.</td>
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

export default Step2Courses;