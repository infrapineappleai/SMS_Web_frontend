





import React, { useState, useEffect } from 'react';
import '../../../Styles/Students-css/StudentFormStepper/Step3EducationalRecords.css';
import FilterIcon from '../../../assets/icons/Filter.png';
import { useToast } from '../../../modals/ToastProvider';
import { getDropdownOptions } from '../../../integration/studentAPI';
import EditIcon from '../../../assets/icons/Edit.png';
import DeleteIcon from '../../../assets/icons/Delete.png';


const Step3EducationalRecords = ({ formData, onChange, errors }) => {
  const { showToast } = useToast();
  const [courseInput, setCourseInput] = useState(formData.course || '');
  const [gradeInput, setGradeInput] = useState(formData.grade || '');
  const [dropdownOptions, setDropdownOptions] = useState({ courses: [], grades: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        setLoading(true);
        const options = await getDropdownOptions();
        // Validate and normalize API response
        const courses = Array.isArray(options.courses) ? options.courses : [];
        const grades = Array.isArray(options.grades) ? options.grades : [];
        
        setDropdownOptions({ courses, grades });

        if (!courses.length || !grades.length) {
          showToast({ 
            title: 'Warning', 
            message: 'No courses or grades available. Please add them in the system.', 
            isError: true 
          });
        }
      } catch (error) {
        console.error('Dropdown fetch error:', error);
        showToast({ 
          title: 'Error', 
          message: `Failed to load courses/grades: ${error.message || 'Unknown error'}`, 
          isError: true 
        });
        setDropdownOptions({ courses: [], grades: [] });
      } finally {
        setLoading(false);
      }
    };
    fetchOptions();
  }, [showToast]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'course') {
      setCourseInput(value);
      setGradeInput(''); // Clear grade when course changes
      onChange({ ...formData, course: value, grade: '' });
    } else if (name === 'grade') {
      setGradeInput(value);
      onChange({ ...formData, grade: value });
    }
  };

  const handleAssignCourse = (e) => {
    e.preventDefault();
    if (!courseInput || !gradeInput) {
      showToast({ 
        title: 'Error', 
        message: 'Please select both a course and a grade', 
        isError: true 
      });
      return;
    }

    const selectedCourse = dropdownOptions.courses.find(c => c.name === courseInput);
    const selectedGrade = dropdownOptions.grades.find(g => g.grade_name === gradeInput);

    if (!selectedCourse || !selectedGrade) {
      showToast({ 
        title: 'Error', 
        message: 'Invalid course or grade selected', 
        isError: true 
      });
      return;
    }

    if (selectedGrade.course_id !== selectedCourse.id) {
      showToast({ 
        title: 'Error', 
        message: `The selected grade "${gradeInput}" is not available for course "${courseInput}"`, 
        isError: true 
      });
      return;
    }

    const newCourse = {
      id: Date.now(),
      course: courseInput,
      grade: gradeInput
    };

    onChange({
      ...formData,
      course: courseInput,
      grade: gradeInput,
      assignedCourses: [...(formData.assignedCourses || []), newCourse]
    });

    showToast({ 
      title: 'Success', 
      message: 'Course and grade assigned successfully!' 
    });
    setCourseInput('');
    setGradeInput('');
  };

  const filteredGrades = dropdownOptions.grades.filter(grade => {
    const selectedCourse = dropdownOptions.courses.find(c => c.name === courseInput);
    return selectedCourse ? grade.course_id === selectedCourse.id : false;
  });

  return (
    <div className="step-three-fields">
      <h3 className="section-header">Educational Records</h3>
      <div className="form-row">
        <div className="form-group">
          <label className="input-label">Course</label>
          <div className="input-icon-container">
            <select
              name="course"
              className="input-box with-icon"
              value={courseInput}
              onChange={handleInputChange}
              disabled={loading || !dropdownOptions.courses.length}
            >
              <option value="">Select Course</option>
              {dropdownOptions.courses.map(course => (
                <option key={course.id} value={course.name}>
                  {course.name} {course.course_code ? `(${course.course_code})` : ''}
                </option>
              ))}
            </select>
            <img src={FilterIcon} alt="dropdown" className="input-icon dropdown-icon" />
          </div>
          {errors.course && <span className="error">{errors.course}</span>}
        </div>
        <div className="form-group">
          <label className="input-label">Grade</label>
          <div className="input-icon-container">
            <select
              name="grade"
              className="input-box with-icon"
              value={gradeInput}
              onChange={handleInputChange}
              disabled={loading || !courseInput || !filteredGrades.length}
            >
              <option value="">Select Grade</option>
              {filteredGrades.map(grade => (
                <option key={grade.id} value={grade.grade_name}>
                  {grade.grade_name}
                </option>
              ))}
            </select>
            <img src={FilterIcon} alt="dropdown" className="input-icon dropdown-icon" />
          </div>
          {errors.grade && <span className="error">{errors.grade}</span>}
        </div>
      </div>
      <button 
        type="button" 
        className="assign-btn" 
        onClick={handleAssignCourse} 
        disabled={loading || !courseInput || !gradeInput || !filteredGrades.length}
      >
        Assign Course
      </button>
      {errors.assignedCourses && <p className="error-msg">{errors.assignedCourses}</p>}
      {formData.assignedCourses?.length > 0 && (
        <div className="assigned-table-wrapper">
          <table className="assigned-table">
            <thead>
              <tr>
                <th>Course</th>
                <th>Grade</th>
              </tr>
            </thead>
            <tbody>
              {formData.assignedCourses.map(({ id, course, grade }) => (
                <tr key={id}>
                  <td>{course}</td>
                  <td>{grade}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Step3EducationalRecords;