const router = require('express').Router();
const ctrl = require('../controllers/subjectController');

router.post('/',      ctrl.createSubject);
router.get('/',       ctrl.getAllSubjects);
router.delete('/:id', ctrl.deleteSubject);

module.exports = router;
