import axios from "axios";

const API_BASE_URL = "https://pineappleai.cloud/api/sms/api";
const RETRIES = 2;
const DELAY = 1000;

// Helper function for retry logic
const withRetry = async (fn, retries = RETRIES, delay = DELAY) => {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      console.error(`Attempt ${attempt} failed:`, {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
      });
      if (attempt < retries) {
        await new Promise((resolve) => setTimeout(resolve, delay));
      } else {
        throw error;
      }
    }
  }
};

const mapStudentData = (student) => ({
  id: student.id || null,
  salutation: student.salutation || "",
  first_name: student.first_name || "",
  last_name: student.last_name || "",
  name:
    [student.salutation, student.first_name, student.last_name]
      .filter(Boolean)
      .join(" ")
      .trim() || "Unknown Student",
  email: student.email || "",
  phn_num: String(student.phn_num || ""),
  ice_contact: String(student.ice_contact || ""),
  address: student.address || "",
  gender: student.gender || "",
  date_of_birth: student.date_of_birth || "",
  student_no: String(student.student_no || ""),
  photo_url:
    typeof student.photo_url === "string" &&
    (student.photo_url.startsWith("http") ||
      student.photo_url.startsWith("/Uploads") ||
      student.photo_url.startsWith("data:image"))
      ? student.photo_url



      : "/default-avatar.png",  // <--- Use default avatar here


      
  status: student.status
    ? student.status.charAt(0).toUpperCase() +
      student.status.slice(1).toLowerCase()
    : "Active",
  course: student.course || "",
  grade: student.grade || "",
  branch: student.branch || "",
  schedule_day: student.schedule_day || "",
  schedule_time: student.schedule_time || "",
});


export const getDropdownOptions = async () => {
  return withRetry(async () => {
    console.log(
      `Fetching dropdown options: ${API_BASE_URL}/students/dropdown-options`
    );
    const response = await axios.get(
      `${API_BASE_URL}/students/dropdown-options`
    );
    console.log("Dropdown options response:", response.data);

    if (!response.data?.success || !response.data?.data) {
      throw new Error("Invalid response structure");
    }

    const { courses, grades, branches, slots, statuses } = response.data.data;
    return {
      courses: Array.isArray(courses) ? courses : [],
      grades: Array.isArray(grades) ? grades : [],
      branches: Array.isArray(branches) ? branches : [],
      slots: Array.isArray(slots) ? slots : [],
      statuses: Array.isArray(statuses) ? statuses : [],
    };
  }).catch((error) => {
    console.error("Error fetching dropdown options:", {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });
    return { courses: [], grades: [], branches: [], slots: [], statuses: [] };
  });
};

export const getAllStudents = async () => {
  return withRetry(async () => {
    console.log(`Fetching students: ${API_BASE_URL}/students`);
    const response = await axios.get(`${API_BASE_URL}/students`);
    console.log("Students response:", JSON.stringify(response.data, null, 2));

    const { data } = response.data;
    if (!Array.isArray(data)) {
      console.error("Expected array in response.data.data, got:", data);
      return [];
    }
    return data.map(mapStudentData);
  }).catch((error) => {
    console.error("Error fetching students:", {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });
    return [];
  });
};

export const searchStudents = async (query) => {
  return withRetry(async () => {
    console.log(
      `Searching students: ${API_BASE_URL}/students/search?query=${encodeURIComponent(
        query
      )}`
    );
    const response = await axios.get(`${API_BASE_URL}/students/search`, {
      params: { query },
    });
    console.log(
      "Search students response:",
      JSON.stringify(response.data, null, 2)
    );

    const { data } = response.data;
    if (!Array.isArray(data)) {
      console.error("Expected array in response.data.data, got:", data);
      return [];
    }
    return data.map(mapStudentData);
  }).catch((error) => {
    console.error("Error searching students:", {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });
    return [];
  });
};





export const createStudent = async (studentData) => {
  try {
    const requiredFields = [
      "first_name",
      "last_name",
      "email",
      "phn_num",
      "course",
      "grade",
      "branch",
      "student_no",
      "schedule_day",
      "schedule_time",
    ];

    const missingFields = requiredFields.filter((field) => !studentData[field]);
    if (missingFields.length > 0) {
      throw new Error(`Missing required fields: ${missingFields.join(", ")}`);
    }

    const formData = new FormData();
    formData.append("first_name", studentData.first_name.trim());
    formData.append("last_name", studentData.last_name.trim());
    formData.append("email", studentData.email.trim());
    formData.append("phn_num", studentData.phn_num.toString().trim());
    formData.append("course", studentData.course);
    formData.append("grade", studentData.grade);
    formData.append("branch", studentData.branch);
    formData.append("student_no", studentData.student_no.toString().trim());
    formData.append("schedule_day", studentData.schedule_day);
    formData.append("schedule_time", studentData.schedule_time);
    formData.append("status", studentData.status?.toLowerCase() || "active");

    if (studentData.salutation)
      formData.append("salutation", studentData.salutation);
    if (studentData.gender) {
      const genderFormatted =
        studentData.gender.charAt(0).toUpperCase() +
        studentData.gender.slice(1).toLowerCase();
      formData.append("gender", genderFormatted);
    }
    if (studentData.date_of_birth)
      formData.append("date_of_birth", studentData.date_of_birth);
    if (studentData.address) formData.append("address", studentData.address);
    if (studentData.ice_contact)
      formData.append("ice_contact", studentData.ice_contact.toString().trim());
    if (studentData.photoFile) {
      formData.append("photo", studentData.photoFile);
    } else if (studentData.photo_url) {
      formData.append("photo_url", studentData.photo_url);
    }

    console.log("Submitting student data:", studentData);

    const response = await axios.post(`${API_BASE_URL}/students`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    if (!response.data?.success || !response.data?.data) {
      // Server didn't return expected format
      console.error("Unexpected API response:", response.data);
      return {
        success: false,
        error: response.data?.error || "Unexpected server response",
      };
    }

    return {
      success: true,
      student: {
        id: response.data.data.user_id,
        ...mapStudentData(studentData),
        photo_url: studentData.photoFile
          ? `/Uploads/${studentData.photoFile.name}`
          : studentData.photo_url || "/default-avatar.png",
      },
    };
  } catch (error) {
    console.error("Error creating student:", {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });

    let errorMessage = "Failed to create student";

    if (error.response?.data?.error) {
      errorMessage = error.response.data.error;
      if (error.response.data.details) {
        errorMessage += `: ${
          Array.isArray(error.response.data.details)
            ? error.response.data.details.join(", ")
            : error.response.data.details
        }`;
      }
    } else if (error.message) {
      errorMessage = error.message;
    }

    return {
      success: false,
      error: errorMessage,
    };
  }
};








export const updateStudent = async (id, studentData) => {
  return withRetry(async () => {
    const formData = new FormData();
    const fields = [
      "salutation",
      "first_name",
      "last_name",
      "email",
      "phn_num",
      "ice_contact",
      "address",
      "gender",
      "date_of_birth",
      "student_no",
      "status",
      "course",
      "grade",
      "branch",
      "schedule_day",
      "schedule_time",
    ];

    fields.forEach((field) => {
      if (studentData[field] !== undefined) {
        formData.append(
          field,
          typeof studentData[field] === "string"
            ? studentData[field].trim()
            : studentData[field]
        );
      }
    });

    if (studentData.photoFile) {
      formData.append("photo", studentData.photoFile);
    } else if (studentData.photo_url) {
      formData.append("photo_url", studentData.photo_url);
    }

    console.log(
      `Updating student: ${API_BASE_URL}/students/${id}`,
      studentData
    );
    const response = await axios.put(
      `${API_BASE_URL}/students/${id}`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );

    return {
      success: true,
      student: {
        id,
        ...mapStudentData(studentData),
        ...response.data.data,
        photo_url: studentData.photoFile
          ? `/Uploads/${studentData.photoFile.name}`
          : studentData.photo_url ||
            response.data.data.photo_url ||
            "/default-avatar.png",
      },
    };
  }).catch((error) => {
    console.error("Error updating student:", {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });
    throw new Error(
      error.response?.data?.error || error.message || "Failed to update student"
    );
  });
};

export const deleteStudent = async (id) => {
  return withRetry(async () => {
    console.log(`Deleting student: ${API_BASE_URL}/students/${id}`);
    const response = await axios.delete(`${API_BASE_URL}/students/${id}`);
    console.log(
      "Delete student response:",
      JSON.stringify(response.data, null, 2)
    );
    return response.data;
  }).catch((error) => {
    console.error("Error deleting student:", {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });
    throw new Error(
      error.response?.data?.error || error.message || "Failed to delete student"
    );
  });
};

export const filterStudents = async (status) => {
  return withRetry(async () => {
    console.log(
      `Filtering students by status: ${API_BASE_URL}/students/filter/status?status=${encodeURIComponent(
        status
      )}`
    );
    const response = await axios.get(`${API_BASE_URL}/students/filter/status`, {
      params: { status },
    });
    console.log(
      "Filter students response:",
      JSON.stringify(response.data, null, 2)
    );

    const { data } = response.data;
    if (!Array.isArray(data)) {
      console.error("Expected array in response.data.data, got:", data);
      return [];
    }
    return data.map(mapStudentData);
  }).catch((error) => {
    console.error("Error filtering students by status:", {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });
    return [];
  });
};

export const filterStudentsByCourse = async (course) => {
  return withRetry(async () => {
    console.log(
      `Filtering students by course: ${API_BASE_URL}/students/filter/course?course=${encodeURIComponent(
        course
      )}`
    );
    const response = await axios.get(`${API_BASE_URL}/students/filter/course`, {
      params: { course },
    });
    console.log(
      "Filter by course response:",
      JSON.stringify(response.data, null, 2)
    );

    const { data } = response.data;
    if (!Array.isArray(data)) {
      console.error("Expected array in response.data.data, got:", data);
      return [];
    }
    return data.map(mapStudentData);
  }).catch((error) => {
    console.error("Error filtering students by course:", {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });
    return [];
  });
};

export const filterStudentsByPayment = async (hasPayment) => {
  return withRetry(async () => {
    console.log(
      `Filtering students by payment: ${API_BASE_URL}/students/filter/payment?hasPayment=${hasPayment}`
    );
    const response = await axios.get(
      `${API_BASE_URL}/students/filter/payment`,
      { params: { hasPayment } }
    );
    console.log(
      "Filter by payment response:",
      JSON.stringify(response.data, null, 2)
    );

    const { data } = response.data;
    if (!Array.isArray(data)) {
      console.error("Expected array in response.data.data, got:", data);
      return [];
    }
    return data.map(mapStudentData);
  }).catch((error) => {
    console.error("Error filtering students by payment:", {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });
    return [];
  });
};

export const addSlot = async (slotData) => {
  return withRetry(async () => {
    console.log(`Adding slot: ${API_BASE_URL}/slots`, slotData);
    const response = await axios.post(`${API_BASE_URL}/slots`, slotData);
    console.log("Add slot response:", JSON.stringify(response.data, null, 2));
    return response.data;
  }).catch((error) => {
    console.error("Error adding slot:", {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });
    throw new Error(
      error.response?.data?.error || error.message || "Failed to add slot"
    );
  });
};
