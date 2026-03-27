import React, { useEffect, useState } from 'react';
import API from '../services/api';

export default function Subjects() {
  const [subjects, setSubjects] = useState([]);
  const [form, setForm] = useState({ name: '', coefficient: 1 });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');
  const [showForm, setShowForm] = useState(false);

  const fetchSubjects = async () => {
    try {
      const res = await API.get('/subjects');
      setSubjects(res.data);
    } catch (err) { console.error(err); }
  };

  useEffect(() => { fetchSubjects(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await API.post('/subjects', form);
      setMsg('✅ Matière ajoutée !');
      setForm({ name: '', coefficient: 1 });
      setShowForm(false);
      fetchSubjects();
    } catch (err) {
      setMsg('❌ ' + (err.response?.data?.message || 'Erreur'));
    } finally {
      setLoading(false);
      setTimeout(() => setMsg(''), 3000);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Supprimer cette matière ?')) return;
    try {
      await API.delete(`/subjects/${id}`);
      fetchSubjects();
    } catch (err) { alert('Erreur suppression'); }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}> Matières</h2>
        <button style={styles.addBtn} onClick={() => setShowForm(!showForm)}>
          {showForm ? '✕ Annuler' : '+ Ajouter'}
        </button>
      </div>

      {msg && <div style={styles.msg}>{msg}</div>}

      {showForm && (
        <div style={styles.formCard}>
          <h3 style={{ margin: '0 0 16px', color: '#333' }}>Nouvelle matière</h3>
          <form onSubmit={handleSubmit}>
            <input style={{ ...styles.input, width: '100%', boxSizing: 'border-box' }}
              placeholder="Nom de la matière (ex: Mathématiques)"
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })} required />
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <label style={{ color: '#555', fontSize: '14px' }}>Coefficient :</label>
              <input style={{ ...styles.input, width: '80px', marginBottom: 0 }}
                type="number" min="1" max="10"
                value={form.coefficient}
                onChange={e => setForm({ ...form, coefficient: Number(e.target.value) })} />
            </div>
            <button style={styles.btn} type="submit" disabled={loading}>
              {loading ? 'Ajout...' : 'Ajouter'}
            </button>
          </form>
        </div>
      )}

      <table style={styles.table}>
        <thead>
          <tr style={styles.thead}>
            <th style={styles.th}>Matière</th>
            <th style={styles.th}>Coefficient</th>
            <th style={styles.th}>Action</th>
          </tr>
        </thead>
        <tbody>
          {subjects.length === 0 && (
            <tr><td colSpan="3" style={{ textAlign: 'center', padding: '20px', color: '#999' }}>
              Aucune matière enregistrée.
            </td></tr>
          )}
          {subjects.map(s => (
            <tr key={s._id} style={styles.tr}>
              <td style={styles.td}>📖 {s.name}</td>
              <td style={styles.td}>
                <span style={styles.badge}>Coef. {s.coefficient}</span>
              </td>
              <td style={styles.td}>
                <button style={styles.delBtn} onClick={() => handleDelete(s._id)}>🗑️ Supprimer</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const styles = {
  container: { padding: '24px' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' },
  title: { margin: 0, color: '#1a1a2e' },
  addBtn: { background: '#3b5bdb', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontSize: '15px' },
  msg: { background: '#d3f9d8', color: '#2b8a3e', padding: '12px', borderRadius: '8px', marginBottom: '16px' },
  formCard: { background: '#fff', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 12px rgba(0,0,0,0.08)', marginBottom: '24px' },
  input: { padding: '10px 12px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '14px', marginBottom: '12px' },
  btn: { background: '#3b5bdb', color: '#fff', border: 'none', padding: '10px 24px', borderRadius: '8px', cursor: 'pointer', fontSize: '15px' },
  table: { width: '100%', borderCollapse: 'collapse', background: '#fff', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.07)' },
  thead: { background: '#3b5bdb' },
  th: { padding: '14px 16px', color: '#fff', textAlign: 'left', fontWeight: 600 },
  tr: { borderBottom: '1px solid #f0f0f0' },
  td: { padding: '14px 16px', color: '#333', fontSize: '14px' },
  badge: { background: '#e7f5ff', color: '#1864ab', padding: '4px 10px', borderRadius: '20px', fontSize: '13px', fontWeight: 600 },
  delBtn: { background: '#fff5f5', color: '#c92a2a', border: '1px solid #ffc9c9', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' }
};
