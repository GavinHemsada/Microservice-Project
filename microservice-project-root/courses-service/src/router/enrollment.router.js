const express = require("express");
const router = express.Router();

const EnrollmentController = require("../controller/Enrollment.controller");
const EnrollmentDTO = require("../dto/enrollmentDTO");
const dtovalidate = require("../middelware/dtovalidate");
const jwtProtect = require("../middelware/jwt");

router.post(
  "/add",
  jwtProtect,
  dtovalidate(EnrollmentDTO),
  EnrollmentController.createEnrollment
);
router.get("/", jwtProtect, EnrollmentController.readallEnrollment);
router.get("/student/:s_id", jwtProtect, EnrollmentController.getEnrollmentbyStudentID);
router.get("/course/:c_id", jwtProtect, EnrollmentController.getEnrollmentCourseID);
router.put(
  "/:id",
  jwtProtect,
  dtovalidate(EnrollmentDTO),
  EnrollmentController.updateEnrollment
);
router.delete("/:id", jwtProtect, EnrollmentController.deleteEnrollment);

module.exports = router;
