const express = require("express");
const router = express.Router();

const resultController = require("../controller/Result.controller");
const resultDTO = require("../dto/resultDTO");
const dtovalidate = require("../middelware/dtovalidate");
const jwtProtect = require("../middelware/jwt");
const authorizeRoles = require("../middelware/roalbaseProtection");

router.post(
  "/add",
  jwtProtect,
  authorizeRoles("Teacher"),
  dtovalidate(resultDTO),
  resultController.addResult
);
router.get("/", jwtProtect, resultController.updateResult);
router.get("/student/:s_id", jwtProtect, resultController.getResultbyStudentID);
router.get("/courses/:c_id", jwtProtect, resultController.getResultbyCourseID);
router.put(
  "/:id",
  jwtProtect,
  authorizeRoles("Teacher"),
  dtovalidate(resultDTO),
  resultController.updateResult
);
router.delete(
  "/:id",
  jwtProtect,
  authorizeRoles("Teacher"),
  resultController.deleteResult
);

module.exports = router;
