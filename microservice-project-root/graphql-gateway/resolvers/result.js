const axios = require("axios");
const baseURL = process.env.RESULT_SERVICE_URL;

const resultResolvers = {
  Query: {
    getResults: async (_, __, context) => {
      try {
        const res = await axios.get(`${baseURL}/`, {
          headers: {
            Authorization: `Bearer ${context.token}`,
          },
        });
        return {
          error: null,
          Results: res.data,
        };
      } catch (err) {
        const errorMsg =
          err.response?.data?.error ||
          err.response?.data?.message ||
          err.message ||
          "Unknown error occurred";
        return {
          error: errorMsg,
          Results: [],
        };
      }
    },

    getResultbyStudentID: async (_, { id }, context) => {
      try {
        const res = await axios.get(`${baseURL}/student/${id}`, {
          headers: {
            Authorization: `Bearer ${context.token}`,
          },
        });
        return {
          error: null,
          Results: res.data,
        };
      } catch (err) {
        const errorMsg =
          err.response?.data?.error ||
          err.response?.data?.message ||
          err.message ||
          "Unknown error occurred";
        return {
          error: errorMsg,
          Results: [],
        };
      }
    },

    getResultbyCourseID: async (_, { id }, context) => {
      try {
        const res = await axios.get(`${baseURL}/courses/${id}`, {
          headers: {
            Authorization: `Bearer ${context.token}`,
          },
        });
        return {
          error: null,
          Results: res.data,
        };
      } catch (err) {
        const errorMsg =
          err.response?.data?.error ||
          err.response?.data?.message ||
          err.message ||
          "Unknown error occurred";
        return {
          error: errorMsg,
          Results: [],
        };
      }
    },
  },

  Mutation: {
    addResult: async (_, args, context) => {
      try {
        const res = await axios.put(`${baseURL}/add`, args, {
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
        const detailsMessage = err.response?.data?.error?.details?.[0]?.message;
        const errorMsg =
          err.response?.data?.error ||
          err.response?.data?.message ||
          err.message ||
          "Unknown error occurred" ||
          detailsMessage;
        return {
          error: errorMsg,
          message: null,
          id: null,
        };
      }
    },

    updateResult: async (_, args, context) => {
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
          Result: res.data.result,
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
          Result: null,
        };
      }
    },

    deleteResult: async (_, { id }, context) => {
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

module.exports = resultResolvers;
