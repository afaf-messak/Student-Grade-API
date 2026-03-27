import React, { useEffect, useState } from 'react';
import API from '../services/api';

export default function Grades() {
  const [students, setStudents] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [form, setForm] = useState({ studentId: '', subjectId: '', grade: '', semester: 'S1' });
  const [bulletin, setBulletin] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState('');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');
  const [tab, setTab] = useState('add');

  useEffect(() => {
    API.get('/students').then(r => setStudents(r.data)).catch(console.error);
    API.get('/subjects').then(r => setSubjects(r.data)).catch(console.error);
  }, []);

  const handleAddGrade = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await API.post('/grades', {
        studentId: form.studentId,
        subjectId: form.subjectId,
        grade: Number(form.grade),
        semester: form.semester
      });
      setMsg('✅ Note ajoutée avec succès !');
      setForm({ studentId: '', subjectId: '', grade: '', semester: 'S1' });
    } catch (err) {
      setMsg('❌ ' + (err.response?.data?.message || 'Erreur'));
    } finally {
      setLoading(false);
      setTimeout(() => setMsg(''), 3000);
    }
  };

  const handleBulletin = async () => {
    if (!selectedStudent) return;
    try {
      const res = await API.get(`/grades/bulletin/${selectedStudent}`);
      setBulletin(res.data);
    } catch (err) {
      alert('Erreur lors du chargement du bulletin');
    }
  };

  const getMentionColor = (mention) => {
    if (!mention) return '#888';
    if (mention === 'Très Bien') return '#2b8a3e';
    if (mention === 'Bien') return '#1864ab';
    if (mention === 'Assez Bien') return '#5f3dc4';
    if (mention === 'Passable') return '#e67700';
    return '#c92a2a';
  };

  const student = students.find(s => s._id === selectedStudent);

  return (
    <div style={styles.container}>
      <h2 style={styles.title}> Gestion des Notes</h2>

      <div style={styles.tabs}>
        <button style={tab === 'add' ? styles.tabActive : styles.tab} onClick={() => setTab('add')}>
          ➕ Ajouter une note
        </button>
        <button style={tab === 'bulletin' ? styles.tabActive : styles.tab} onClick={() => setTab('bulletin')}>
          📋 Consulter bulletin
        </button>
      </div>

      {tab === 'add' && (
        <div style={styles.card}>
          <h3 style={{ margin: '0 0 20px', color: '#333' }}>Ajouter une note</h3>
          {msg && <div style={styles.msg}>{msg}</div>}
          <form onSubmit={handleAddGrade}>
            <label style={styles.label}>Étudiant</label>
            <select style={styles.select} value={form.studentId}
              onChange={e => setForm({ ...form, studentId: e.target.value })} required>
              <option value="">-- Sélectionner un étudiant --</option>
              {students.map(s => (
                <option key={s._id} value={s._id}>{s.firstName} {s.lastName}</option>
              ))}
            </select>

            <label style={styles.label}>Matière</label>
            <select style={styles.select} value={form.subjectId}
              onChange={e => setForm({ ...form, subjectId: e.target.value })} required>
              <option value="">-- Sélectionner une matière --</option>
              {subjects.map(s => (
                <option key={s._id} value={s._id}>{s.name} (Coef. {s.coefficient})</option>
              ))}
            </select>

            <div style={styles.row}>
              <div style={{ flex: 1 }}>
                <label style={styles.label}>Note (0-20)</label>
                <input style={styles.input} type="number" min="0" max="20" step="0.5"
                  placeholder="Ex: 15.5" value={form.grade}
                  onChange={e => setForm({ ...form, grade: e.target.value })} required />
              </div>
              <div style={{ flex: 1 }}>
                <label style={styles.label}>Semestre</label>
                <select style={styles.select} value={form.semester}
                  onChange={e => setForm({ ...form, semester: e.target.value })}>
                  <option value="S1">Semestre 1</option>
                  <option value="S2">Semestre 2</option>
                </select>
              </div>
            </div>

            <button style={styles.btn} type="submit" disabled={loading}>
              {loading ? 'Ajout en cours...' : '✅ Ajouter la note'}
            </button>
          </form>
        </div>
      )}

      {tab === 'bulletin' && (
        <div>
          <div style={styles.card}>
            <h3 style={{ margin: '0 0 16px', color: '#333' }}>Sélectionner un étudiant</h3>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <select style={{ ...styles.select, flex: 1 }} value={selectedStudent}
                onChange={e => { setSelectedStudent(e.target.value); setBulletin(null); }}>
                <option value="">-- Sélectionner --</option>
                {students.map(s => (
                  <option key={s._id} value={s._id}>{s.firstName} {s.lastName}</option>
                ))}
              </select>
              <button style={styles.btn} onClick={handleBulletin} disabled={!selectedStudent}>
                📋 Voir le bulletin
              </button>
            </div>
          </div>

          {bulletin && (
            <div style={styles.bulletin}>
              <div style={styles.bulletinHeader}>
                <div>
                  <h3 style={{ margin: 0, color: '#fff' }}>
                    {student ? `${student.firstName} ${student.lastName}` : 'Étudiant'}
                  </h3>
                  <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: '14px' }}>Bulletin de notes</span>
                </div>
                <div style={styles.avgBadge}>
                  <div style={{ fontSize: '28px', fontWeight: 'bold' }}>{bulletin.average}/20</div>
                  <div style={{ fontSize: '13px', marginTop: '2px', color: getMentionColor(bulletin.mention), background: '#fff', padding: '2px 10px', borderRadius: '20px', fontWeight: 600 }}>
                    {bulletin.mention}
                  </div>
                </div>
              </div>

              {bulletin.grades && bulletin.grades.length > 0 ? (
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: '#f8f9fa' }}>
                      <th style={styles.bth}>Matière ID</th>
                      <th style={styles.bth}>Semestre</th>
                      <th style={styles.bth}>Note</th>
                      <th style={styles.bth}>Appréciation</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bulletin.grades.map((g, i) => (
                      <tr key={i} style={{ borderBottom: '1px solid #f0f0f0' }}>
                        <td style={styles.btd}>{g.subjectId}</td>
                        <td style={styles.btd}>{g.semester}</td>
                        <td style={styles.btd}>
                          <span style={{ fontWeight: 'bold', fontSize: '16px',
                            color: g.grade >= 10 ? '#2b8a3e' : '#c92a2a' }}>
                            {g.grade}/20
                          </span>
                        </td>
                        <td style={styles.btd}>
                          <span style={{
                            padding: '3px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 600,
                            background: g.grade >= 16 ? '#d3f9d8' : g.grade >= 12 ? '#e7f5ff' : g.grade >= 10 ? '#fff9db' : '#ffe3e3',
                            color: g.grade >= 16 ? '#2b8a3e' : g.grade >= 12 ? '#1864ab' : g.grade >= 10 ? '#e67700' : '#c92a2a'
                          }}>
                            {g.grade >= 16 ? 'Très Bien' : g.grade >= 14 ? 'Bien' : g.grade >= 12 ? 'Assez Bien' : g.grade >= 10 ? 'Passable' : 'Insuffisant'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p style={{ textAlign: 'center', color: '#999', padding: '20px' }}>Aucune note enregistrée.</p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

const styles = {
  container: { padding: '24px' },
  title: { margin: '0 0 20px', color: '#1a1a2e' },
  tabs: { display: 'flex', gap: '8px', marginBottom: '24px' },
  tab: { padding: '10px 20px', border: '2px solid #dee2e6', borderRadius: '8px', background: '#fff', cursor: 'pointer', fontSize: '14px', color: '#555' },
  tabActive: { padding: '10px 20px', border: '2px solid #3b5bdb', borderRadius: '8px', background: '#3b5bdb', cursor: 'pointer', fontSize: '14px', color: '#fff', fontWeight: 600 },
  card: { background: '#fff', padding: '24px', borderRadius: '12px', boxShadow: '0 2px 12px rgba(0,0,0,0.08)', marginBottom: '20px' },
  msg: { background: '#d3f9d8', color: '#2b8a3e', padding: '12px', borderRadius: '8px', marginBottom: '16px' },
  label: { display: 'block', marginBottom: '6px', color: '#555', fontSize: '14px', fontWeight: 600 },
  select: { width: '100%', padding: '10px 12px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '14px', marginBottom: '16px', boxSizing: 'border-box' },
  input: { width: '100%', padding: '10px 12px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '14px', marginBottom: '16px', boxSizing: 'border-box' },
  row: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' },
  btn: { background: '#3b5bdb', color: '#fff', border: 'none', padding: '12px 24px', borderRadius: '8px', cursor: 'pointer', fontSize: '15px', fontWeight: 600 },
  bulletin: { background: '#fff', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.08)' },
  bulletinHeader: { background: '#3b5bdb', padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  avgBadge: { textAlign: 'center', color: '#fff' },
  bth: { padding: '12px 16px', textAlign: 'left', color: '#555', fontSize: '13px', fontWeight: 600, borderBottom: '2px solid #e9ecef' },
  btd: { padding: '14px 16px', fontSize: '14px', color: '#333' }
};
