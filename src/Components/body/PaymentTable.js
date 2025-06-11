import React from 'react';
import './BodyStyles.css';

const payments = [
  { id: 1, student: 'Ayesha', amount: 5000, date: '2025-06-01' },
  { id: 2, student: 'Nimal', amount: 4500, date: '2025-06-03' },
];

const PaymentTable = () => (
  <div className="table-container">
    <table>
      <thead>
        <tr>
          <th>Student</th>
          <th>Amount (LKR)</th>
          <th>Date</th>
        </tr>
      </thead>
      <tbody>
        {payments.map(payment => (
          <tr key={payment.id}>
            <td>{payment.student}</td>
            <td>{payment.amount}</td>
            <td>{payment.date}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default PaymentTable;
