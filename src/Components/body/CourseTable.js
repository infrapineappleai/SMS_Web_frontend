import React from 'react';
import './BodyStyles.css';

const courses = [
  { id: 'IT101', name: 'Web Development', credits: 3 },
  { id: 'IT102', name: 'Database Systems', credits: 4 },
];

const CourseTable = () => (
  <div className="table-container">
    <table>
      <thead>
        <tr>
          <th>Course ID</th>
          <th>Course Name</th>
          <th>Credits</th>
        </tr>
      </thead>
      <tbody>
        {courses.map(course => (
          <tr key={course.id}>
            <td>{course.id}</td>
            <td>{course.name}</td>
            <td>{course.credits}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default CourseTable;
