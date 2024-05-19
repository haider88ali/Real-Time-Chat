const express = require('express');
const router = express.Router();
const employeesController =require('../controllers/Employee/EmployeeController');
 router.get('/', employeesController.getAllEmployees);
router.post('/create-employee', employeesController.createEmployee);

module.exports = router;