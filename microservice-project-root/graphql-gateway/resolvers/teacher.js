const axios = require("axios");
const baseURL = process.env.TEACHER_SERVICE_URL;

const teacherresolvers = {
  Query: {
    getTeachers: async (_, __, context) => {
      try {
        const res = await axios.get(`${baseURL}/all`, {
          headers: {
            Authorization: `Bearer ${context.token}`,
          },
        });
        return {
          error: null,
          Teachers: res.data,
        };
      } catch (err) {
        const errorMsg =
          err.response?.data?.error ||
          err.response?.data?.message ||
          err.message ||
          "Unknown error occurred";
        return {
          error: errorMsg,
          Teachers: [],
        };
      }
    },

    getTeacher: async (_, { id }) => {
      try {
        const res = await axios.get(`${baseURL}/${id}`, {
          headers: {
            Authorization: `Bearer ${context.token}`,
          },
        });
        return {
          error: null,
          Teacher: res.data,
        };
      } catch (err) {
        const errorMsg =
          err.response?.data?.error ||
          err.response?.data?.message ||
          err.message ||
          "Unknown error occurred";
        return {
          error: errorMsg,
          Teacher: null,
        };
      }
    },
  },

  Mutation: {
    teacherLogin: async (_, { email, password }) => {
      try {
        const res = await axios.post(`${baseURL}/login`, {
          email,
          password,
        });
        return {
          message: res.data.message,
          token: res.data.token,
          error: null,
        };
      } catch (err) {
        const errorMsg =
          err.response?.data?.error ||
          err.response?.data?.message ||
          err.message ||
          "Unknown error occurred";
        return {
          message: null,
          token: null,
          error: errorMsg,
        };
      }
    },

    createTeacher: async (_, args) => {
      try {
        const res = await axios.post(`${baseURL}/register`, args);
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

    updateTeacher: async (_, args, context) => {
      try {
        const { id, ...updateFields } = args;
        const res = await axios.put(`${baseURL}/${id}`, updateFields, {
          headers: {
            Authorization: `Bearer ${context.token}`,
          },
        });

        return {
          error: null,
          message: res.data.message,
          Teacher: res.data.teacher,
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
          Teacher: null,
        };
      }
    },

    deleteTeacher: async (_, { id }, context) => {
      try {
        const res = await axios.delete(`${baseURL}/${id}`, {
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

module.exports = teacherresolvers;
