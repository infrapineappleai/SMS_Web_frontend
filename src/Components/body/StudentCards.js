import React from 'react';
import './BodyStyles.css';

const students = [
  { id: 1, name: 'Ayesha', program: 'HNDIT', batch: '2024' },
  { id: 2, name: 'Nimal', program: 'HNDA', batch: '2023' },
];

const StudentCards = () => (
  <div className="card-grid">
    {students.map(student => (
      <div key={student.id} className="profile-card">
        <h3>{student.name}</h3>
        <p>Program: {student.program}</p>
        <p>Batch: {student.batch}</p>
      </div>
    ))}
  </div>
);

export default StudentCards;
