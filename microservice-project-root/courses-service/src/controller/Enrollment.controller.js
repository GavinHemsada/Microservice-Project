const Enrollment = require("../model/Enrollments");
const Courses = require("../model/courses");
const { createConsumer } = require("../shared/event-bus/Consumer");
const { producer } = require("../shared/event-bus/producer");
const { v4: uuidv4 } = require("uuid");

const responseResolversEnroll = new Map();

(async () => {
  try {
    createConsumer("course-service", "studentid.response", async (data) => {
      try {
        const { correlationId, isValid, student_id } = data;
        const resolver = responseResolversEnroll.get(correlationId);
        if (resolver) {
          resolver.resolve({ isValid, student_id });
          responseResolversEnroll.delete(correlationId);
        }
      } catch (parseError) {
        console.error("[Course Service] Error parsing message:", parseError);
      }
    });
  } catch (error) {
    console.error("[Course Service] Failed to setup consumer:", error);
  }
})();

const createEnrollment = async (req, res) => {
  const { student_id, course_id, enrollment_date } = req.body;
  const course = await Courses.findById(course_id);
  if (!course) return res.status(404).json({ message: "invalid course id" });

  const correlationId = uuidv4();
  await producer.send({
    topic: "studentid.check",
    messages: [{ value: JSON.stringify({ correlationId, student_id }) }],
  });

  const response = await new Promise((resolve, reject) => {
    responseResolversEnroll.set(correlationId, { resolve, reject });

    setTimeout(() => {
      if (responseResolversEnroll.has(correlationId)) {
        responseResolversEnroll.delete(correlationId);
        reject(new Error("Timeout waiting for student validation"));
      }
    }, 5000);
  }).catch((err) => {
    res.status(500).json({ error: err.message });
    return null;
  });

  if (!response) return;
  console.log("respons:", response);
  if (!response.isValid) {
    return res.status(400).json({ error: "Invalid student ID" });
  }

  const enrollment = new Enrollment({
    student_id,
    course_id,
    enrollment_date,
  });

  await enrollment.save();

  return res.status(201).json({
    message: "Enrollment successfully",
    _id: enrollment._id,
  });
};

const readallEnrollment = async (_req, res) => {
  const all = await Enrollment.find();
  res.status(200).json(all);
};

const getEnrollmentbyStudentID = async (req, res) => {
  const studentID = req.params.s_id;
  const enrollment = await Enrollment.find(studentID);
  if (!enrollment) {
    return res.status(404).json({ message: "Enrollment not found" });
  }
  return res.status(200).json(enrollment);
};

const getEnrollmentCourseID = async (req, res) => {
  const CourseID = req.params.c_id;
  const enrollment = await Enrollment.find(CourseID);
  if (!enrollment) {
    return res.status(404).json({ message: "Enrollment not found" });
  }
  return res.status(200).json(enrollment);
};

const updateEnrollment = async (req, res) => {
  try {
    const enrollmentid = req.params.id;
    const updates = req.body;

    const enrollment = await Enrollment.findByIdAndUpdate(
      enrollmentid,
      updates,
      {
        new: true,
      }
    );

    if (!enrollment) {
      return res.status(404).json({ error: "Enrollment not found" });
    }

    return res.status(200).json({ message: "Successful update!", enrollment });
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

const deleteEnrollment = async (req, res) => {
  try {
    const enrollmentid = req.params.id;

    const deletedenrollment = await Enrollment.findByIdAndDelete(enrollmentid);

    if (!deletedenrollment) {
      return res.status(404).json({ error: "Enrollment not found" });
    }

    return res.status(200).json({ message: "Enrollment deleted successfully" });
  } catch (error) {
    console.error("Delete error:", error);
    return res.status(500).json({ error: "Server error" });
  }
};

module.exports = {
  createEnrollment,
  readallEnrollment,
  getEnrollmentbyStudentID,
  getEnrollmentCourseID,
  updateEnrollment,
  deleteEnrollment,
};
