import axios from 'axios';

const API_BASE_URL = 'https://pineappleai.cloud/api/sms/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const transformCourseData = (course) => {
  if (!course) return null;

  return {
    uniqueId: course?.id?.toString() || '',
    id: course?.course_code || '',
    name: course?.name || '',
    status: course?.status || 'Active',
    grades: (course?.grades || []).map(grade => {
      const fee = grade.gradeFees?.[0] || {};
      return {
        uniqueId: grade?.id?.toString() || '',
        grade: grade?.grade_name || '',
        fees: fee?.fee || 0,
        status: grade?.status || 'Active',
        branchId: fee?.branch?.id?.toString() || '',
        gradeFeeId: fee?.id ? fee.id.toString() : ''
      };
    }) || []
  };
};

const getDefaultBranchId = async () => {
  try {
    const response = await apiClient.get('/branch');
    if (response.data.length > 0) {
      return response.data[0].id;
    }
    throw new Error('No branches available');
  } catch (error) {
    console.error('Failed to get default branch ID:', error);
    throw error;
  }
};

export const getCourses = async () => {
  try {
    const response = await apiClient.get('/course');
    
    let courses = [];
    if (Array.isArray(response.data)) {
      courses = response.data;
    } else if (response.data?.courses) {
      courses = response.data.courses;
    } else if (response.data) {
      courses = [response.data];
    }
    const transformedCourses = courses
      .filter(course => course !== null)
      .map(transformCourseData)
      .filter(course => course !== null);

    return { data: transformedCourses };
  } catch (error) {
    console.error('Get Courses Error:', error);
    throw new Error(error.response?.data?.error || 'Failed to fetch courses');
  }
};

export const searchCourses = async (searchTerm) => {
  try {
    const response = await apiClient.get('/course/search', {
      params: { query: searchTerm }
    });
    let courses = response.data.courses || response.data;
    if (!Array.isArray(courses)) {
      courses = [courses];
    }
    return { 
      data: courses.map(transformCourseData) 
    };
  } catch (error) {
    console.error('Search Courses Error:', error);
    throw new Error(error.response?.data?.error || 'Failed to search courses');
  }
};

export const addCourse = async (courseData) => {
  try {
    const grades = courseData.grades?.length > 0 ? 
      await Promise.all(courseData.grades.map(async detail => {
        const branchId = detail.branchId || await getDefaultBranchId();
        return {
          grade_name: detail.grade,
          status: detail.status || 'Active',
          gradeFees: [{
            fee: parseFloat(detail.fees) || 0,
            branch_id: branchId
          }]
        };
      })) : [];

    const response = await apiClient.post('/course', {
      course_code: courseData.id,
      name: courseData.name,
      status: courseData.status || 'Active',
      ...(grades.length > 0 && { grades })
    });

    return { 
      data: transformCourseData(response.data) 
    };
  } catch (error) {
    console.error('Add Course Error:', error);
    throw new Error(error.response?.data?.error || 'Failed to add course');
  }
};

export const updateCourse = async (uniqueId, courseData) => {
  try {
    const response = await apiClient.patch(`/course/${uniqueId}`, courseData);
    
    const updatedCourse = {
      uniqueId: response.data.id?.toString() || uniqueId,
      id: response.data.course_code || courseData.id,
      name: response.data.name || courseData.name,
      status: response.data.status || courseData.status,
      details: (response.data.grades || []).map(grade => ({
        uniqueId: grade.id?.toString() || '',
        grade: grade.grade_name || '',
        fees: (grade.gradeFees?.[0]?.fee || 0).toString(),
        status: grade.status || 'Active',
        gradeFeeId: grade.gradeFees?.[0]?.id?.toString() || ''
      }))
    };
    
    return { 
      data: updatedCourse 
    };
  } catch (error) {
    console.error('Update Course Error:', error);
    throw new Error(error.response?.data?.error || 'Failed to update course');
  }
};

export const deleteCourse = async (uniqueId) => {
  try {
    const courseId = parseInt(uniqueId);
    if (isNaN(courseId)) throw new Error('Invalid course ID');
    
    await apiClient.delete(`/course/${courseId}`);
    return { 
      message: 'Course deleted successfully' 
    };
  } catch (error) {
    console.error('Delete Course Error:', error);
    throw new Error(error.response?.data?.error || 'Failed to delete course');
  }
};

export const deleteCourseDetail = async (courseId, gradeFeeId) => {
  if (!gradeFeeId || isNaN(parseInt(gradeFeeId))) {
    throw new Error('Invalid grade fee ID');
  }
  
  try {
    await apiClient.delete(`/grade-fee/${gradeFeeId}`);
    return { 
      message: 'Course detail deleted successfully' 
    };
  } catch (error) {
    console.error('Delete Course Detail Error:', error);
    throw new Error(error.response?.data?.error || 'Failed to delete course detail');
  }
};
export const getBranches = async () => {
  try {
    const response = await apiClient.get('/branch');
    return response.data;
  } catch (error) {
    console.error('Get Branches Error:', error);
    throw new Error(error.response?.data?.error || 'Failed to fetch branches');
  }
};