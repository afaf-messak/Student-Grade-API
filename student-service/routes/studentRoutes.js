const router = require('express').Router();
const ctrl = require('../controllers/studentController');

router.post('/',      ctrl.createStudent);
router.get('/',       ctrl.getAllStudents);
router.get('/:id',    ctrl.getStudent);
router.put('/:id',    ctrl.updateStudent);
router.delete('/:id', ctrl.deleteStudent);

module.exports = router;
