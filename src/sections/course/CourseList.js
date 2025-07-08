import React, { useState, useEffect, useRef } from 'react';
import '../../Styles/Course-css.css/CourseList.css';
import filterIcon from '../../assets/icons/filter2.png';
import closeicon from '../../assets/icons/closeicon.png';
import CourseCatalog from '../course/AddCourseForm';
import DeleteConfirmModal from '../../modals/DeleteConfirmModal';
import Toast from '../../modals/ToastModel';
import deleteToastIcon from '../../assets/icons/Delete.png';
import successToastIcon from '../../assets/icons/Success.png';
import CourseActions from '../course/CourseActions';
import { getCourses, addCourse, updateCourse, deleteCourse, deleteCourseDetail, searchCourses } from '../../integration/courseAPI';

const CourseList = () => {
  const [courses, setCourses] = useState([]);
  const [showCourseDropdown, setShowCourseDropdown] = useState(false);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [editCourse, setEditCourse] = useState(null);
  const [detailEditCourse, setDetailEditCourse] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [courseFilter, setCourseFilter] = useState(null);
  const [statusFilter, setStatusFilter] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCourseCatalog, setShowCourseCatalog] = useState(false);
  const [toast, setToast] = useState({
    showToast: false,
    isError: false,
    isDelete: false,
    title: '',
    message: '',
    icon: null,
  });

  const courseOptions = ['All', 'Piano', 'Mridangam', 'Keyboard', 'Violin'];
  const statusOptions = ['Active', 'Inactive', 'Completed'];

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await getCourses();
        setCourses(response.data);
      } catch (error) {
        setToast({
          showToast: true,
          isError: true,
          title: 'Error',
          message: error.message,
          icon: deleteToastIcon,
        });
        setTimeout(() => setToast((prev) => ({ ...prev, showToast: false })), 3000);
      }
    };
    fetchCourses();
  }, []);

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (searchTerm) {
        try {
          const response = await searchCourses(searchTerm);
          setCourses(response.data);
        } catch (error) {
          console.error('Search error:', error);
        }
      } else {
        const fetchCourses = async () => {
          try {
            const response = await getCourses();
            setCourses(response.data);
          } catch (error) {
            setToast({
              showToast: true,
              isError: true,
              title: 'Error',
              message: error.message,
              icon: deleteToastIcon,
            });
            setTimeout(() => setToast((prev) => ({ ...prev, showToast: false })), 3000);
          }
        };
        fetchCourses();
      }
    };
    fetchSearchResults();
  }, [searchTerm]);

  const handleDeleteConfirm = async (uniqueId) => {
    try {
      await deleteCourse(uniqueId);
      setCourses(courses.filter((course) => course.uniqueId !== uniqueId));
      setShowDeleteConfirm(null);
      setSelectedCourse(null);
      setToast({
        showToast: true,
        isError: false,
        isDelete: true,
        title: 'Success',
        message: 'Course deleted successfully',
        icon: deleteToastIcon,
      });
      setTimeout(() => setToast((prev) => ({ ...prev, showToast: false })), 3000);
    } catch (error) {
      setToast({
        showToast: true,
        isError: true,
        title: 'Error',
        message: error.message,
        icon: deleteToastIcon,
      });
      setTimeout(() => setToast((prev) => ({ ...prev, showToast: false })), 3000);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteConfirm(null);
  };

  const handleCourseFilterClick = () => {
    setShowCourseDropdown(!showCourseDropdown);
    setShowStatusDropdown(false);
  };

  const handleStatusFilterClick = () => {
    setShowStatusDropdown(!showStatusDropdown);
    setShowCourseDropdown(false);
  };

  const handleOptionClick = (option) => {
    setCourseFilter(option === 'All' ? null : option);
    setShowCourseDropdown(false);
  };

  const handleStatusOptionClick = (option) => {
    setStatusFilter(option === 'All' ? null : option);
    setShowStatusDropdown(false);
  };

  const handleAddCourseClick = () => {
    setEditCourse(null);
    setShowCourseCatalog(true);
  };

  const handleCourseCatalogSubmit = async (newCourses) => {
    try {
      for (const course of newCourses) {
        const formattedCourse = {
          id: course.courseId,
          name: course.courseName,
          status: course.status,
          details: [{ grade: course.grade, fees: course.fees, status: course.status }],
          branch_id: 1,
        };
        if (editCourse) {
          await updateCourse(editCourse.uniqueId, formattedCourse);
          setCourses((prevCourses) =>
            prevCourses.map((c) =>
              c.uniqueId === editCourse.uniqueId ? { ...formattedCourse, uniqueId: editCourse.uniqueId } : c
            )
          );
        } else {
          const response = await addCourse(formattedCourse);
          setCourses((prevCourses) => [...prevCourses, response.data]);
        }
      }
      setToast({
        showToast: true,
        isError: false,
        isDelete: false,
        title: 'Success',
        message: 'Courses saved successfully!',
        icon: successToastIcon,
      });
      setTimeout(() => setToast((prev) => ({ ...prev, showToast: false })), 3000);
      setShowCourseCatalog(false);
      setEditCourse(null);
      setSelectedCourse(null);
    } catch (error) {
      setToast({
        showToast: true,
        isError: true,
        title: 'Error',
        message: error.message,
        icon: deleteToastIcon,
      });
      setTimeout(() => setToast((prev) => ({ ...prev, showToast: false })), 3000);
    }
  };

  const handleCourseCatalogClose = () => {
    setShowCourseCatalog(false);
    setEditCourse(null);
  };

  const handleMainEditFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedCourse = {
        id: e.target.courseCode.value,
        name: e.target.courseName.value,
        status: e.target.status.value,
        details: [{
          uniqueId: editCourse.details?.[0]?.uniqueId || '',
          grade: e.target.grade.value,
          fees: e.target.fees.value,
          status: e.target.status.value,
        }],
        branch_id: 1,
      };
      await updateCourse(editCourse.uniqueId, updatedCourse);
      setCourses((prevCourses) =>
        prevCourses.map((course) =>
          course.uniqueId === editCourse.uniqueId ? updatedCourse : course
        )
      );
      setToast({
        showToast: true,
        isError: false,
        isDelete: false,
        title: 'Success',
        message: 'Course details have been changed',
        icon: successToastIcon,
      });
      setTimeout(() => setToast((prev) => ({ ...prev, showToast: false })), 3000);
      setEditCourse(null);
    } catch (error) {
      setToast({
        showToast: true,
        isError: true,
        title: 'Error',
        message: error.message,
        icon: deleteToastIcon,
      });
      setTimeout(() => setToast((prev) => ({ ...prev, showToast: false })), 3000);
    }
  };

  const handleDetailEditFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedDetail = {
        uniqueId: detailEditCourse.uniqueId,
        grade: e.target.grade.value,
        fees: e.target.fees.value,
        status: e.target.status.value,
      };
      const updatedCourse = {
        ...selectedCourse,
        details: selectedCourse.details.map((detail) =>
          detail.uniqueId === detailEditCourse.uniqueId ? updatedDetail : detail
        ),
        branch_id: 1,
      };
      await updateCourse(selectedCourse.uniqueId, updatedCourse);
      setCourses((prevCourses) =>
        prevCourses.map((course) =>
          course.uniqueId === selectedCourse.uniqueId ? updatedCourse : course
        )
      );
      setToast({
        showToast: true,
        isError: false,
        isDelete: false,
        title: 'Success',
        message: 'Course details have been changed.',
        icon: successToastIcon,
      });
      setTimeout(() => setToast((prev) => ({ ...prev, showToast: false })), 3000);
      setDetailEditCourse(null);
      setSelectedCourse(null);
    } catch (error) {
      setToast({
        showToast: true,
        isError: true,
        title: 'Error',
        message: error.message,
        icon: deleteToastIcon,
      });
      setTimeout(() => setToast((prev) => ({ ...prev, showToast: false })), 3000);
    }
  };

  const handleDetailDeleteConfirm = async (courseUniqueId, gradeFeeId) => {
    try {
      if (!gradeFeeId) {
        throw new Error('Invalid grade fee ID');
      }
      
      await deleteCourseDetail(courseUniqueId, gradeFeeId);
      setCourses(prev => prev.map(course => 
        course.uniqueId === courseUniqueId
          ? {
              ...course,
              details: course.details.filter(
                detail => detail.gradeFeeId !== gradeFeeId.toString()
              )
            }
          : course
      ));
      setShowDeleteConfirm(null);
      setSelectedCourse(null);
      setToast({
        showToast: true,
        isError: false,
        isDelete: true,
        title: 'Success',
        message: 'Course detail deleted successfully',
        icon: deleteToastIcon,
      });
      setTimeout(() => setToast((prev) => ({ ...prev, showToast: false })), 3000);
    } catch (error) {
      setToast({
        showToast: true,
        isError: true,
        title: 'Error',
        message: error.message,
        icon: deleteToastIcon,
      });
      setTimeout(() => setToast((prev) => ({ ...prev, showToast: false })), 3000);
    }
  };

  const handleToastClose = () => {
    setToast({ ...toast, showToast: false });
  };

  const wrapperRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowCourseDropdown(false);
        setShowStatusDropdown(false);
        if (editCourse) setEditCourse(null);
        if (detailEditCourse) setDetailEditCourse(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [editCourse, detailEditCourse]);

  const filteredCourses = courses.filter((course) => {
    const matchesSearch =
      course.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.status?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCourse = courseFilter ? course.name === courseFilter : true;
    const matchesStatus = statusFilter ? course.status === statusFilter : true;
    return matchesSearch && matchesCourse && matchesStatus;
  });

  const getCourseDetails = (course) => {
    return course?.details || [];
  };

  return (
    <div className="table-container" ref={wrapperRef}>
      <div className="table-header">
        <div className="search-container">
          <input
            type="text"
            placeholder="Search..."
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="add-btn" onClick={handleAddCourseClick}>
          + Add Course
        </button>
      </div>
      <div className="table-container1">
        <table>
          <thead>
            <tr>
              <th>Course Code</th>
              <th>
                Course Name
                <img
                  src={filterIcon}
                  alt="Filter"
                  className="icon filter-icon"
                  onClick={handleCourseFilterClick}
                />
                {showCourseDropdown && (
                  <div className="dropdown">
                    {courseOptions.map((option) => (
                      <div
                        key={option}
                        className="dropdown-item"
                        onClick={() => handleOptionClick(option)}
                      >
                        {option}
                      </div>
                    ))}
                  </div>
                )}
              </th>
              <th>
                Status
                <img
                  src={filterIcon}
                  alt="Filter"
                  className="icon filter-icon"
                  onClick={handleStatusFilterClick}
                />
                {showStatusDropdown && (
                  <div className="dropdown1">
                    <div className="dropdown-item" onClick={() => handleStatusOptionClick('All')}>
                      All
                    </div>
                    <div className="dropdown-item" onClick={() => handleStatusOptionClick('Active')}>
                      Active
                    </div>
                    <div className="dropdown-item" onClick={() => handleStatusOptionClick('Inactive')}>
                      Inactive
                    </div>
                    <div className="dropdown-item" onClick={() => handleStatusOptionClick('Completed')}>
                      Completed
                    </div>
                  </div>
                )}
              </th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredCourses.map((course, index) => (
              <tr key={course.uniqueId || `course-${index}`}>
                <td>{course.id}</td>
                <td>{course.name}</td>
                <td>{course.status}</td>
                <td className="action-icons">
                  <CourseActions
                    course={course}
                    setSelectedCourse={setSelectedCourse}
                    setEditCourse={setEditCourse}
                    setShowDeleteConfirm={setShowDeleteConfirm}
                    isDetailView={false}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {selectedCourse && (
          <div className="course-details-popup1">
            <div className="popup-content1">
              <img
                src={closeicon}
                alt="Close"
                className="close-btn"
                onClick={() => setSelectedCourse(null)}
              />
              <p>
                <strong>Course Code</strong><strong>: {selectedCourse.id}</strong>
              </p>
              <p>
                <strong>Course</strong><strong>: {selectedCourse.name}</strong>
              </p>
              <div className="details-table">
                <table>
                  <thead>
                    <tr>
                      <th>Grade</th>
                      <th>Status</th>
                      <th>Fees(Rs)</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {getCourseDetails(selectedCourse).map((detail, index) => (
                      <tr key={detail.uniqueId || `detail-${index}`}>
                        <td>{detail.grade}</td>
                        <td>{detail.status}</td>
                        <td>{detail.fees}</td>
                        <td className="action-icons1">
                          <CourseActions
                            course={{ ...detail, courseUniqueId: selectedCourse.uniqueId, gradeFeeId: detail.gradeFeeId }}
                            setSelectedCourse={setSelectedCourse}
                            setEditCourse={setDetailEditCourse}
                            setShowDeleteConfirm={(id) =>
                              setShowDeleteConfirm({ courseId: selectedCourse.uniqueId, detailId: id })
                            }
                            hideView={true}
                            isDetailView={true}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
        {editCourse && (
          <div className="course-details-popup">
            <div className="popup-content">
              <img
                src={closeicon}
                alt="Close"
                className="close-btn"
                onClick={() => setEditCourse(null)}
              />
              <h3>Edit Course</h3>
              <form onSubmit={handleMainEditFormSubmit}>
                <div className="form-row">
                  <div className="form-group">
                    <label>Course Code</label>
                    <input
                      type="text"
                      name="courseCode"
                      defaultValue={editCourse.id || ''}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Course Name</label>
                    <input
                      type="text"
                      name="courseName"
                      defaultValue={editCourse.name || ''}
                      required
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Grade</label>
                    <input
                      type="text"
                      name="grade"
                      defaultValue={editCourse.details?.[0]?.grade || ''}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Status</label>
                    <select 
                      name="status" 
                      defaultValue={editCourse.status || 'Active'}
                      required
                    >
                      {statusOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Fees</label>
                    <input
                      type="text"
                      name="fees"
                      defaultValue={editCourse.details?.[0]?.fees || ''}
                      required
                    />
                  </div>
                </div>
                <button type="submit" className="update-button">
                  Update
                </button>
              </form>
            </div>
          </div>
        )}
        {detailEditCourse && (
          <div className="course-details-popup">
            <div className="popup-content">
              <img
                src={closeicon}
                alt="Close"
                className="close-btn"
                onClick={() => setDetailEditCourse(null)}
              />
              <h3>Edit Course Detail</h3>
              <form onSubmit={handleDetailEditFormSubmit}>
                <div className="form-row">
                  <div className="form-group">
                    <label>Grade</label>
                    <input
                      type="text"
                      name="grade"
                      defaultValue={detailEditCourse.grade || ''}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Status</label>
                    <select 
                      name="status" 
                      defaultValue={detailEditCourse.status || 'Active'}
                      required
                    >
                      {statusOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Fees</label>
                    <input
                      type="text"
                      name="fees"
                      defaultValue={detailEditCourse.fees || ''}
                      required
                    />
                  </div>
                </div>
                <button type="submit" className="update-button1">
                  Update
                </button>
              </form>
            </div>
          </div>
        )}
        <DeleteConfirmModal
          isOpen={!!showDeleteConfirm}
          onClose={handleDeleteCancel}
          onDelete={() =>
            typeof showDeleteConfirm === 'object'
              ? handleDetailDeleteConfirm(showDeleteConfirm.courseId, showDeleteConfirm.detailId)
              : handleDeleteConfirm(showDeleteConfirm)
          }
        />
        {showCourseCatalog && (
          <CourseCatalog
            onSubmit={handleCourseCatalogSubmit}
            onClose={handleCourseCatalogClose}
            initialCourse={
              editCourse
                ? { 
                    ...editCourse, 
                    id: editCourse.id, 
                    name: editCourse.name, 
                    grade: editCourse.details?.[0]?.grade, 
                    fees: editCourse.details?.[0]?.fees, 
                    status: editCourse.status 
                  }
                : null
            }
          />
        )}
        <Toast
          showToast={toast.showToast}
          isError={toast.isError}
          isDelete={toast.isDelete}
          title={toast.title}
          message={toast.message}
          icon={toast.icon}
          onClose={handleToastClose}
        />
      </div>
    </div>
  );
};

export default CourseList;