const express = require('express');
const router = express.Router();

const teacherController = require('../controller/Teacher.controller');
const teacherDTO = require('../dto/teacherDTO');
const dtovalidate = require('../middelware/dtovalidate')
const jwtProtect = require('../middelware/jwt')

router.post('/register', dtovalidate(teacherDTO), teacherController.createTeacher);
router.post('/login', teacherController.loginTeacher);
router.get('/all', jwtProtect, teacherController.readallTeacher);
router.get('/:id', jwtProtect, teacherController.teacherfindbyID);
router.put('/:id', jwtProtect, dtovalidate(teacherDTO), teacherController.updateTeacher);
router.delete('/:id', jwtProtect, teacherController.deleteTeacher);

module.exports = router;