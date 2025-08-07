const express = require("express");
const router = express.Router();

const CoursesController = require("../controller/Courses.controller");
const CoursesDTO = require("../dto/coursesDTO");
const dtovalidate = require("../middelware/dtovalidate");
const jwtProtect = require("../middelware/jwt");
const authorizeRoles = require("../middelware/roalbaseProtection");

router.post(
  "/add",
  jwtProtect,
  authorizeRoles("Teacher"),
  dtovalidate(CoursesDTO),
  CoursesController.addCourses
);
router.get("/", jwtProtect, CoursesController.readallCourses);
router.get("/:id", jwtProtect, CoursesController.getCoursesbyID);
router.get("/teacher/:t_id", jwtProtect, CoursesController.getCoursesbyTeacherID);
router.put(
  "/:id",
  jwtProtect,
  authorizeRoles("Teacher"),
  dtovalidate(CoursesDTO),
  CoursesController.updateCourses
);
router.delete(
  "/:id",
  jwtProtect,
  authorizeRoles("Teacher"),
  CoursesController.deleteCourses
);

module.exports = router;
