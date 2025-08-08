const Courses = require("../model/courses");
const { createConsumer } = require("../shared/event-bus/Consumer");
const { producer } = require("../shared/event-bus/producer");
const { v4: uuidv4 } = require("uuid");

const responseResolversCourses = new Map();

(async () => {
  try {
    createConsumer(
      "course-service-teacherid-response",
      "teacherid.response",
      async (data) => {
        try {
          const { correlationId, isValid, teacher_id } = data;
          console.log("Received response for teacher validation:", data);
          const resolver = responseResolversCourses.get(correlationId);
          if (resolver) {
            if (resolver.timeoutId) clearTimeout(resolver.timeoutId);
            resolver.resolve({ isValid, teacher_id });
            responseResolversCourses.delete(correlationId);
          } else {
            console.log(
              "No resolver found for correlationId (likely timed out or already handled):",
              correlationId
            );
          }
        } catch (parseError) {
          console.error("[Course Service] Error parsing message:", parseError);
        }
      }
    );
  } catch (error) {
    console.error("[Course Service] Failed to setup consumer:", error);
  }
})();

const addCourses = async (req, res) => {
  try {
    const { teacher_id, name, description } = req.body;
    const correlationId = uuidv4();

    const responsePromise = new Promise((resolve, reject) => {
      console.log("Setting resolver for correlationId:", correlationId);
      const resolverEntry = { resolve, reject, timeoutId: null };
      responseResolversCourses.set(correlationId, resolverEntry);

      resolverEntry.timeoutId = setTimeout(() => {
        if (responseResolversCourses.has(correlationId)) {
          console.log("Timeout for correlationId:", correlationId);
          responseResolversCourses.delete(correlationId);
          reject(new Error("Timeout waiting for teacher validation"));
        }
      }, 5000);
    });

    await producer.send({
      topic: "teacherid.check",
      messages: [{ value: JSON.stringify({ correlationId, teacher_id }) }],
    });

    const response = await responsePromise;
    if (!response) return;
    console.log("response:", response);
    if (!response.isValid) {
      return res.status(400).json({ error: "Invalid teacher ID" });
    }

    const newCourse = new Courses({
      teacher_id: response.teacher_id,
      name,
      description,
    });

    await newCourse.save();

    return res.status(201).json({
      message: "Course created successfully",
      _id: newCourse._id,
    });
  } catch (err) {
    console.error("Add course error:", err);
    const isTimeout = /Timeout waiting for teacher validation/.test(
      String(err?.message)
    );
    return res.status(isTimeout ? 504 : 500).json({
      error: isTimeout ? "Teacher validation timed out" : "Server error",
    });
  }
};

const readallCourses = async (_req, res) => {
  const all = await Courses.find();
  res.status(200).json(all);
};

const getCoursesbyTeacherID = async (req, res) => {
  const teacherID = req.params.t_id;
  const courses = await Courses.find({ teacher_id: teacherID });
  if (!courses) {
    return res.status(404).json({ message: "courses not found" });
  }
  return res.status(200).json(courses);
};

const getCoursesbyID = async (req, res) => {
  const CourseID = req.params.id;
  const courses = await Courses.findById(CourseID);
  if (!courses) {
    return res.status(404).json({ message: "courses not found" });
  }
  return res.status(200).json(courses);
};

const updateCourses = async (req, res) => {
  try {
    const coursesid = req.params.id;
    const updates = req.body;

    const courses = await Courses.findByIdAndUpdate(coursesid, updates, {
      new: true,
    });

    if (!courses) {
      return res.status(404).json({ error: "courses not found" });
    }

    return res.status(200).json({ message: "Successful update!", courses });
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

const deleteCourses = async (req, res) => {
  try {
    const coursesid = req.params.id;

    const deletedcourses = await Courses.findByIdAndDelete(coursesid);

    if (!deletedcourses) {
      return res.status(404).json({ error: "courses not found" });
    }

    return res.status(200).json({ message: "courses deleted successfully" });
  } catch (error) {
    console.error("Delete error:", error);
    return res.status(500).json({ error: "Server error" });
  }
};

module.exports = {
  addCourses,
  readallCourses,
  getCoursesbyTeacherID,
  getCoursesbyID,
  updateCourses,
  deleteCourses,
};
