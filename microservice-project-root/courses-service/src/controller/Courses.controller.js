const Courses = require("../model/courses");
const { createConsumer } = require("../shared/event-bus/Consumer");
const { producer } = require("../shared/event-bus/producer");
const { v4: uuidv4 } = require("uuid");
const responseEmitter = require("../Service/event");
const { once } = require("events");

const pendingRequests = new Map();

(async () => {
  try {
    createConsumer("course-service", "teacherid.response", async (data) => {
      try {
        console.log("[Course Service] Raw message received:", data);
        const { correlationId, isValid, teacher_id } = data;

        // Resolve the pending promise if the correlationId exists
        if (pendingRequests.has(correlationId)) {
          const { resolve } = pendingRequests.get(correlationId);
          resolve({ isValid, teacher_id });
          pendingRequests.delete(correlationId);
        }

        console.log("[Course Service] Processed data:", data);
      } catch (parseError) {
        console.error(
          "[Course Service] Error parsing message:",
          parseError,
          "Raw data:",
          data
        );
      }
    });
  } catch (error) {
    console.error("[Course Service] Failed to setup consumer:", error);
  }
})();

// Function to wait for response with timeout
async function waitForResponse(correlationId, timeout = 5000) {
  return new Promise((resolve, reject) => {
    // Set timeout for the request
    const timer = setTimeout(() => {
      pendingRequests.delete(correlationId);
      reject(new Error("Timeout waiting for teacher validation"));
    }, timeout);

    // Store the resolver in the map
    pendingRequests.set(correlationId, {
      resolve: (value) => {
        clearTimeout(timer);
        resolve(value);
      },
      reject: (error) => {
        clearTimeout(timer);
        reject(error);
      },
    });
  });
}

const addCourses = async (req, res) => {
  const { teacher_id, name, description } = req.body;
  const correlationId = uuidv4();

  await producer.send({
    topic: "teacherid.check",
    messages: [{ value: JSON.stringify({ correlationId, teacher_id }) }],
  });

  let response = null;
  console.log("[Course Service] Waiting for correlationId:", correlationId);
  try {
    response = await waitForResponse(correlationId);
    console.log("Response:", response);

    if (!response.isValid) {
      return res.status(400).json({ error: "Invalid Teacher ID" });
    }

    // Continue with your logic...
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }

  console.log("Response:", response);
  if (!response.isValid) {
    return res.status(400).json({ error: "Invalid Teacher ID" });
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
};

const readallCourses = async (_req, res) => {
  const all = await Courses.find();
  res.status(200).json(all);
};

const getCoursesbyTeacherID = async (req, res) => {
  const teacherID = req.params.t_id;
  const courses = await Courses.find(teacherID);
  if (!courses) {
    return res.status(404).json({ message: "courses not found" });
  }
  return res.status(200).json(courses);
};

const getCoursesbyID = async (req, res) => {
  const CourseID = req.params.id;
  const courses = await Courses.find(CourseID);
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
