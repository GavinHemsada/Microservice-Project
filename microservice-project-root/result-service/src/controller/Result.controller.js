const Result = require("../model/result");
const { createConsumer } = require("../shared/event-bus/Consumer");
const { producer } = require("../shared/event-bus/producer");
const { v4: uuidv4 } = require("uuid");

const responseResolversResult = new Map();

(async () => {
  try {
    createConsumer(
      "result-service-studentid-response",
      "studentid.response",
      async (data) => {
        try {
          const { correlationId, isValid, student_id } = data;
          console.log("catch data", data);
          const resolver = responseResolversResult.get(correlationId);
          if (resolver) {
            if (resolver.timeoutId) clearTimeout(resolver.timeoutId);
            resolver.resolve({ isValid, student_id });
            responseResolversResult.delete(correlationId);
          } else {
            console.log(
              "No resolver found for student correlationId (likely timed out or already handled):",
              correlationId
            );
          }
        } catch (parseError) {
          console.error("[result-service] Error parsing message:", parseError);
        }
      }
    );
  } catch (error) {
    console.error("[result-service] Failed to setup consumer:", error);
  }
})();

(async () => {
  try {
    createConsumer(
      "result-service-courseid-response",
      "courseid.response",
      async (data) => {
        try {
          const { correlationId2, isValid, course_id } = data;
          const resolver = responseResolversResult.get(correlationId2);
          if (resolver) {
            if (resolver.timeoutId) clearTimeout(resolver.timeoutId);
            resolver.resolve({ isValid, course_id });
            responseResolversResult.delete(correlationId2);
          } else {
            console.log(
              "No resolver found for course correlationId (likely timed out or already handled):",
              correlationId2
            );
          }
        } catch (parseError) {
          console.error("[result-service] Error parsing message:", parseError);
        }
      }
    );
  } catch (error) {
    console.error("[result-service] Failed to setup consumer:", error);
  }
})();

const addResult = async (req, res) => {
  try {
    const { student_id, course_id, marks, grade, semester } = req.body;
    const correlationId = uuidv4();
    const correlationId2 = uuidv4();

    const studentPromise = new Promise((resolve, reject) => {
      const entry = { resolve, reject, timeoutId: null };
      responseResolversResult.set(correlationId, entry);
      entry.timeoutId = setTimeout(() => {
        if (responseResolversResult.has(correlationId)) {
          responseResolversResult.delete(correlationId);
          reject(new Error("Timeout waiting for student validation"));
        }
      }, 5000);
    });

    const coursePromise = new Promise((resolve, reject) => {
      const entry = { resolve, reject, timeoutId: null };
      responseResolversResult.set(correlationId2, entry);
      entry.timeoutId = setTimeout(() => {
        if (responseResolversResult.has(correlationId2)) {
          responseResolversResult.delete(correlationId2);
          reject(new Error("Timeout waiting for course validation"));
        }
      }, 5000);
    });

    await producer.send({
      topic: "studentid.check",
      messages: [{ value: JSON.stringify({ correlationId, student_id }) }],
    });
    await producer.send({
      topic: "courseid.check",
      messages: [{ value: JSON.stringify({ correlationId2, course_id }) }],
    });

    console.log("waiting correlationId:", correlationId);
    console.log("waiting correlationId2:", correlationId2);

    const [studentResponse, courseResponse] = await Promise.all([
      studentPromise,
      coursePromise,
    ]);

    if (!studentResponse.isValid) {
      return res.status(400).json({ error: "Invalid student ID" });
    }
    if (!courseResponse.isValid) {
      return res.status(400).json({ error: "Invalid course ID" });
    }

    const result = new Result({
      student_id,
      course_id,
      marks,
      grade,
      semester,
    });

    await result.save();

    return res.status(201).json({
      message: "result successfully",
      _id: result._id,
    });
  } catch (err) {
    console.error("Add result error:", err);
    const isTimeout = /Timeout waiting for (student|course) validation/.test(
      String(err?.message)
    );
    return res.status(isTimeout ? 504 : 500).json({
      error: isTimeout ? "Validation timed out" : "Server error",
    });
  }
};

const readallResults = async (_req, res) => {
  const all = await Result.find();
  res.status(200).json(all);
};

const getResultbyStudentID = async (req, res) => {
  const studentID = req.params.s_id;
  const result = await Result.find({ student_id: studentID });
  if (!result) {
    return res.status(404).json({ message: "result not found" });
  }
  return res.status(200).json(result);
};

const getResultbyCourseID = async (req, res) => {
  const CourseID = req.params.c_id;
  const result = await Result.find({ course_id: CourseID });
  if (!result) {
    return res.status(404).json({ message: "result not found" });
  }
  return res.status(200).json(result);
};

const updateResult = async (req, res) => {
  try {
    const resultid = req.params.id;
    const updates = req.body;

    const result = await Result.findByIdAndUpdate(resultid, updates, {
      new: true,
    });

    if (!result) {
      return res.status(404).json({ error: "result not found" });
    }

    return res.status(200).json({ message: "Successful update!", result });
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

const deleteResult = async (req, res) => {
  try {
    const resultid = req.params.id;

    const deletedresult = await Result.findByIdAndDelete(resultid);

    if (!deletedresult) {
      return res.status(404).json({ error: "result not found" });
    }

    return res.status(200).json({ message: "result deleted successfully" });
  } catch (error) {
    console.error("Delete error:", error);
    return res.status(500).json({ error: "Server error" });
  }
};

module.exports = {
  addResult,
  readallResults,
  getResultbyCourseID,
  getResultbyStudentID,
  updateResult,
  deleteResult,
};
