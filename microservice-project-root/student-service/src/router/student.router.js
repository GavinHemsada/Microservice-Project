const express = require('express');
const router = express.Router();

const studentController = require('../controller/Student.controller');
const studentDTO = require('../dto/studentDTO');
const dtovalidate = require('../middelware/dtovalidate')
const jwtProtect = require('../middelware/jwt')

router.post('/register', dtovalidate(studentDTO), studentController.createStudent);
router.post('/login', studentController.loginStudent);
router.get('/all',jwtProtect, studentController.readallStudent);
router.get('/:id', jwtProtect, studentController.getStudentbyID);
router.put('/:id', jwtProtect, dtovalidate(studentDTO), studentController.updateStudent);
router.delete('/:id', jwtProtect, studentController.deleteStudent);

module.exports = router;