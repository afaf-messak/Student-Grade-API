const router = require('express').Router();
const ctrl = require('../controllers/gradeController');

router.post('/',                       ctrl.addGrade);
router.get('/bulletin/:studentId',     ctrl.getBulletin);
router.get('/subject/:subjectId',      ctrl.getGradesBySubject);
router.delete('/:id',                  ctrl.deleteGrade);

module.exports = router;
