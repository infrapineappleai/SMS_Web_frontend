import React, { useEffect } from 'react';
import '../../Styles/payment/Recipt.css';
import logo from '../../assets/images/Aradana-logo.png';
import { jsPDF } from 'jspdf/dist/jspdf.umd.min.js';

const Receipt = ({ isOpen, onClose, receiptData }) => {
  useEffect(() => {
    console.log('Receipt component mounted/updated with data:', JSON.stringify(receiptData, null, 2));
  }, [receiptData]);

  if (!isOpen || !receiptData) {
    console.log('Receipt not open or receiptData is missing:', { isOpen, receiptData });
    return null;
  }

  const {
    full_name = 'N/A',
    branch_name = 'N/A',
    course_fees = {},
    total_course_fees = 0,
    admission_fee = 0,
    total_fees = 0,
    student_no = 'N/A',
  } = receiptData;

  const currentDate = new Date();
  const currentMonth = currentDate.toLocaleString('en-US', { month: 'long', timeZone: 'Asia/Colombo' });
  const currentYear = currentDate.getFullYear();

  const paymentMonth = Object.keys(course_fees)[0] || currentMonth;
  const subjects = Object.entries(course_fees[paymentMonth] || {}).map(([grade, courses]) =>
    Object.entries(courses || {}).map(([courseName, fee]) => ({
      name: courseName || 'N/A',
      grade: (grade || '').replace('Grade ', '') || 'N/A',
      fee: fee || 0,
    }))
  ).flat() || [];

  const handlePrintAsPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(12);
    doc.text(`Receipt - ${new Date().toLocaleDateString('en-GB', { timeZone: 'Asia/Colombo' })}`, 10, 10);
    doc.text(`Full Name: ${full_name}`, 10, 20);
    doc.text(`Student ID: ${student_no}`, 10, 30);
    doc.text(`Subject: ${subjects.map(s => `${s.name} Grade: ${s.grade}`).join(', ')}`, 10, 40);
    doc.text(`Paid for: ${currentMonth} ${currentYear}`, 10, 50);
    doc.text(`Admission Fee: Rs.${admission_fee}/=`, 10, 60);
    doc.text(`Monthly Fee: Rs.${total_course_fees}/=`, 10, 70);
    doc.text(`Total Amount: Rs.${total_fees}/=`, 10, 80);
    doc.text(`Branch: ${branch_name}`, 10, 90);
    doc.text('Note: Kindly pay your fee before 10th of every month', 10, 100);
    doc.text('Thank You For Your Payment!', 10, 110);
    doc.save('receipt.pdf');
  };

  const handleSkip = () => {
    onClose(); // Simply close the modal
  };

  const logoSrc = `${logo}?t=${Date.now()}`;

  return (
    <div className="receipt-modal-overlay" onClick={onClose}>
      <div className="receipt-modal" onClick={(e) => e.stopPropagation()}>
        <div className="receipt-top-header">
          <div className="header-logo-container">
            <img
              src={logoSrc}
              alt="ARADANA Logo"
              className="logo"
              onError={(e) => console.error('Logo image load error:', e, 'Src:', e.target.src)}
            />
          </div>
          <div className="header-title-container">
            <h1 className="academy-name">ARADANA</h1>
            <p className="academy-subtitle">Music Academy</p>
          </div>
        </div>

        <div className="receipt-content-body">
          <div className="receipt-info">
            <h2 className="receipt-title">Receipt</h2>
            <p className="receipt-date">Date: {new Date().toLocaleDateString('en-GB', { timeZone: 'Asia/Colombo' })}</p>
          </div>

          <div className="payment-details">
            <h3 className="payment-details-title">Payment Details</h3>
            <div className="detail-row"><span className="detail-label">Full Name</span><span className="detail-colon">:</span><span className="detail-value">{full_name}</span></div>
            <div className="detail-row"><span className="detail-label">Student ID</span><span className="detail-colon">:</span><span className="detail-value">{student_no}</span></div>
            {subjects.length > 0 ? subjects.map((subject, index) => (
              <div className="detail-row" key={index}><span className="detail-label">Subject</span><span className="detail-colon">:</span><span className="detail-value">{subject.name} Grade: {subject.grade}</span></div>
            )) : <div className="detail-row"><span className="detail-label">Subject</span><span className="detail-colon">:</span><span className="detail-value">N/A</span></div>}
            <div className="detail-row"><span className="detail-label">Paid for</span><span className="detail-colon">:</span><span className="detail-value">{currentMonth} {currentYear}</span></div>
            <div className="detail-row"><span className="detail-label">Admission Fee</span><span className="detail-colon">:</span><span className="detail-value">Rs.{admission_fee}/=</span></div>
            <div className="detail-row"><span className="detail-label">Monthly Fee</span><span className="detail-colon">:</span><span className="detail-value">Rs.{total_course_fees}/=</span></div>
            <div className="total-amount-row"><span className="detail-label">Total Amount</span><span className="detail-colon">:</span><span className="detail-value">Rs.{total_fees}/=</span></div>
            <div className="location-row"><span>{branch_name}</span></div>
          </div>

          <div className="receipt-footer">
            <p className="receipt-note">Note: Kindly pay your fee before 10th of every month</p>
            <p className="thank-you">Thank You For Your Payment!</p>
            <button className="btn-pdf" onClick={handlePrintAsPDF}>Print as PDF</button>
            <button className="btn-skip" onClick={handleSkip}>Skip</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Receipt;