const axios = require("axios");
const baseURL = process.env.COURSES_SERVICE_URL;

const courseResolvers = {
  Query: {
    getCoursess: async (_, __, context) => {
      try {
        const res = await axios.get(`${baseURL}/courses/`, {
          headers: {
            Authorization: `Bearer ${context.token}`,
          },
        });
        return {
          error: null,
          Coursess: res.data,
        };
      } catch (err) {
        const errorMsg =
          err.response?.data?.error ||
          err.response?.data?.message ||
          err.message ||
          "Unknown error occurred";
        return {
          error: errorMsg,
          Coursess: [],
        };
      }
    },

    getCourses: async (_, { id }, context) => {
      try {
        const res = await axios.get(`${baseURL}/courses/${id}`, {
          headers: {
            Authorization: `Bearer ${context.token}`,
          },
        });
        return {
          error: null,
          Courses: res.data,
        };
      } catch (err) {
        const errorMsg =
          err.response?.data?.error ||
          err.response?.data?.message ||
          err.message ||
          "Unknown error occurred";
        return {
          error: errorMsg,
          Courses: null,
        };
      }
    },

    getCoursesbyTeacherID: async (_, { id }, context) => {
      try {
        const res = await axios.get(`${baseURL}/courses/teacher/${id}`, {
          headers: {
            Authorization: `Bearer ${context.token}`,
          },
        });
        return {
          error: null,
          Coursess: res.data,
        };
      } catch (err) {
        const errorMsg =
          err.response?.data?.error ||
          err.response?.data?.message ||
          err.message ||
          "Unknown error occurred";
        return {
          error: errorMsg,
          Coursess: [],
        };
      }
    },

    getEnrollments: async (_, __, context) => {
      try {
        const res = await axios.get(`${baseURL}/enrollment/`, {
          headers: {
            Authorization: `Bearer ${context.token}`,
          },
        });
        return {
          error: null,
          Enrollments: res.data,
        };
      } catch (err) {
        const errorMsg =
          err.response?.data?.error ||
          err.response?.data?.message ||
          err.message ||
          "Unknown error occurred";
        return {
          error: errorMsg,
          Enrollments: [],
        };
      }
    },
    getEnrollmentbyCourseID: async (_, { id }, context) => {
      try {
        const res = await axios.get(`${baseURL}/enrollment/student/${id}`, {
          headers: {
            Authorization: `Bearer ${context.token}`,
          },
        });
        return {
          error: null,
          Enrollments: res.data,
        };
      } catch (err) {
        const errorMsg =
          err.response?.data?.error ||
          err.response?.data?.message ||
          err.message ||
          "Unknown error occurred";
        return {
          error: errorMsg,
          Enrollments: [],
        };
      }
    },
    getEnrollmentbyStudentID: async (_, { id }, context) => {
      try {
        const res = await axios.get(`${baseURL}/enrollment/course/${id}`, {
          headers: {
            Authorization: `Bearer ${context.token}`,
          },
        });
        return {
          error: null,
          Enrollments: res.data,
        };
      } catch (err) {
        const errorMsg =
          err.response?.data?.error ||
          err.response?.data?.message ||
          err.message ||
          "Unknown error occurred";
        return {
          error: errorMsg,
          Enrollments: [],
        };
      }
    },
  },

  Mutation: {
    addCourse: async (_, args, context) => {
      try {
        const res = await axios.post(`${baseURL}/courses/add`, args, {
          headers: {
            Authorization: `Bearer ${context.token}`,
          },
        });
        return {
          error: null,
          message: res.data.message,
          id: res.data._id,
        };
      } catch (err) {
        const errorMsg =
          err.response?.data?.error ||
          err.response?.data?.message ||
          err.message ||
          "Unknown error occurred";
        return {
          error: errorMsg,
          message: null,
          id: null,
        };
      }
    },

    updateCourses: async (_, args, context) => {
      try {
        const { id, ...updateFields } = args;
        const res = await axios.put(`${baseURL}/courses/${id}`, updateFields, {
          headers: {
            Authorization: `Bearer ${context.token}`,
          },
        });

        return {
          error: null,
          message: res.data.message,
          Courses: res.data.courses,
        };
      } catch (err) {
        const errorMsg =
          err.response?.data?.error ||
          err.response?.data?.message ||
          err.message ||
          "Unknown error occurred";
        return {
          error: errorMsg,
          message: null,
          Courses: null,
        };
      }
    },

    deleteCourses: async (_, { id }, context) => {
      try {
        const res = await axios.delete(`${baseURL}/courses/${id}`, {
          headers: {
            Authorization: `Bearer ${context.token}`,
          },
        });

        return {
          error: null,
          message: res.data,
        };
      } catch (err) {
        const errorMsg =
          err.response?.data?.error ||
          err.response?.data?.message ||
          err.message ||
          "Unknown error occurred";
        return {
          error: errorMsg,
          message: null,
        };
      }
    },

    addEntrollment: async (_, args, context) => {
      try {
        const res = await axios.post(`${baseURL}/enrollment/add`, args, {
          headers: {
            Authorization: `Bearer ${context.token}`,
          },
        });
        return {
          error: null,
          message: res.data.message,
          id: res.data._id,
        };
      } catch (err) {
        const errorMsg =
          err.response?.data?.error ||
          err.response?.data?.message ||
          err.message ||
          "Unknown error occurred";

        console.error("Axios error response:", err.response?.data);
        return {
          error: errorMsg,
          message: null,
          id: null,
        };
      }
    },

    updateEntrollment: async (_, args, context) => {
      try {
        const { id, ...updateFields } = args;
        const res = await axios.put(`${baseURL}/enrollment/${id}`, updateFields, {
          headers: {
            Authorization: `Bearer ${context.token}`,
          },
        });

        return {
          error: null,
          message: res.data.message,
          Enrollment: res.data.enrollment,
        };
      } catch (err) {
        const errorMsg =
          err.response?.data?.error ||
          err.response?.data?.message ||
          err.message ||
          "Unknown error occurred";
        return {
          error: errorMsg,
          message: null,
          Enrollment: null,
        };
      }
    },

    deleteEntrollment: async (_, { id }, context) => {
      try {
        const res = await axios.delete(`${baseURL}/enrollment/${id}`, {
          headers: {
            Authorization: `Bearer ${context.token}`,
          },
        });

        return {
          error: null,
          message: res.data,
        };
      } catch (err) {
        const errorMsg =
          err.response?.data?.error ||
          err.response?.data?.message ||
          err.message ||
          "Unknown error occurred";
        return {
          error: errorMsg,
          message: null,
        };
      }
    },
  },
};

module.exports = courseResolvers;
