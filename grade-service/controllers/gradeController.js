const Grade = require('../models/Grade');

exports.addGrade = async (req, res) => {
  try {
    const grade = await Grade.create(req.body);
    res.status(201).json(grade);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getBulletin = async (req, res) => {
  try {
    const grades = await Grade.find({ studentId: req.params.studentId });
    if (grades.length === 0)
      return res.json({ message: 'Aucune note trouvée', grades: [], average: 0 });

    const total = grades.reduce((sum, g) => sum + g.grade, 0);
    const average = parseFloat((total / grades.length).toFixed(2));

    res.json({
      studentId: req.params.studentId,
      grades,
      average,
      mention:
        average >= 16 ? 'Très Bien' :
        average >= 14 ? 'Bien' :
        average >= 12 ? 'Assez Bien' :
        average >= 10 ? 'Passable' : 'Insuffisant'
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getGradesBySubject = async (req, res) => {
  try {
    const grades = await Grade.find({ subjectId: req.params.subjectId });
    res.json(grades);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteGrade = async (req, res) => {
  try {
    await Grade.findByIdAndDelete(req.params.id);
    res.json({ message: 'Note supprimée' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
