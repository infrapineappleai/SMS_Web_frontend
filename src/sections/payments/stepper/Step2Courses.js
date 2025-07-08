import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../../Styles/payment/stepper/Step2Courses.css'; // Ensure this CSS file exists

const Step2Courses = ({ studentId, onMonthSelect }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [feesData, setFeesData] = useState(null);
  const [payments, setPayments] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(null); // Track selected month

  useEffect(() => {
    const fetchFees = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(`https://pineappleai.cloud/api/sms/api/payment/${studentId}`, {
          headers: { 'Content-Type': 'application/json' },
        });
        console.log('Fees data for studentId', studentId, ':', response.data);
        setFeesData(response.data);
        setPayments(response.data.payments || []);
        // Set initial selected month to due_month from API
        const dueMonth = response.data.due_month || Object.keys(response.data.course_fees || {})[0];
        setSelectedMonth(dueMonth);
        if (onMonthSelect) onMonthSelect(dueMonth); // Notify parent of initial month
      } catch (err) {
        setError('Failed to fetch fees. Please try again.');
        console.error('Error fetching fees:', err.response?.data || err.message);
      } finally {
        setLoading(false);
      }
    };
    if (studentId) fetchFees();
  }, [studentId, onMonthSelect]);

  if (loading) return <div className="step-container"><p>Loading...</p></div>;
  if (error) return <div className="step-container"><p className="error">{error}</p></div>;
  if (!feesData) return <div className="step-container"><p>No data available.</p></div>;

  const { course_fees, total_course_fees, admission_fee, total_fees, due_month } = feesData;
  const currentDate = new Date(); // July 02, 2025, 02:19 PM +0530
  const currentYear = currentDate.getFullYear(); // 2025
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  // Determine paid months from payments
  const paidMonths = payments.map(p => p.split(' ')[0]); // Extract month from "MMM yyyy"

  // Determine the status of each month for this student
  const getMonthStatus = (month) => {
    if (paidMonths.includes(month)) return 'paid';
    if (due_month === month) return 'due';
    if (course_fees && Object.keys(course_fees)[1] === month) return 'upcoming';
    return '';
  };

  // Determine if a month is clickable (only due month if not paid)
  const isMonthClickable = (month) => {
    const isPaid = paidMonths.includes(month);
    return due_month === month && !isPaid; // Only due month is clickable if not paid
  };

  // Handle month click
  const handleMonthClick = (month) => {
    if (isMonthClickable(month) && course_fees && (month in course_fees)) {
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
              <option>2023</option>
              <option>2022</option>
              <option>2021</option>
              <option>2020</option>
              <option>2019</option>
              <option>2018</option>
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
              <td colSpan="4">No fee details available for student {studentId} for {selectedMonth}.</td>
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