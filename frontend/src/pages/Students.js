import React, { useEffect, useState } from 'react';
import API from '../services/api';

export default function Students() {
  const [students, setStudents] = useState([]);
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', birthDate: '' });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');
  const [showForm, setShowForm] = useState(false);

  const fetchStudents = async () => {
    try {
      const res = await API.get('/students');
      setStudents(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => { fetchStudents(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await API.post('/students', form);
      setMsg('✅ Étudiant ajouté avec succès !');
      setForm({ firstName: '', lastName: '', email: '', birthDate: '' });
      setShowForm(false);
      fetchStudents();
    } catch (err) {
      setMsg('❌ ' + (err.response?.data?.message || 'Erreur'));
    } finally {
      setLoading(false);
      setTimeout(() => setMsg(''), 3000);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Supprimer cet étudiant ?')) return;
    try {
      await API.delete(`/students/${id}`);
      fetchStudents();
    } catch (err) {
      alert('Erreur lors de la suppression');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>👨‍🎓 Étudiants</h2>
        <button style={styles.addBtn} onClick={() => setShowForm(!showForm)}>
          {showForm ? '✕ Annuler' : '+ Ajouter'}
        </button>
      </div>

      {msg && <div style={styles.msg}>{msg}</div>}

      {showForm && (
        <div style={styles.formCard}>
          <h3 style={{ margin: '0 0 16px', color: '#333' }}>Nouvel étudiant</h3>
          <form onSubmit={handleSubmit}>
            <div style={styles.row}>
              <input style={styles.input} placeholder="Prénom" value={form.firstName}
                onChange={e => setForm({ ...form, firstName: e.target.value })} required />
              <input style={styles.input} placeholder="Nom" value={form.lastName}
                onChange={e => setForm({ ...form, lastName: e.target.value })} required />
            </div>
            <input style={{ ...styles.input, width: '100%' }} placeholder="Email" type="email"
              value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
            <input style={{ ...styles.input, width: '100%' }} type="date" value={form.birthDate}
              onChange={e => setForm({ ...form, birthDate: e.target.value })} />
            <button style={styles.btn} type="submit" disabled={loading}>
              {loading ? 'Ajout...' : 'Ajouter'}
            </button>
          </form>
        </div>
      )}

      <div style={styles.grid}>
        {students.length === 0 && (
          <p style={{ color: '#999', gridColumn: '1/-1', textAlign: 'center' }}>Aucun étudiant enregistré.</p>
        )}
        {students.map(s => (
          <div key={s._id} style={styles.card}>
            <div style={styles.avatar}>{s.firstName[0]}{s.lastName[0]}</div>
            <div style={styles.info}>
              <strong>{s.firstName} {s.lastName}</strong>
              <span style={styles.email}>{s.email}</span>
              {s.birthDate && <span style={styles.meta}>{new Date(s.birthDate).toLocaleDateString('fr-FR')}</span>}
            </div>
            <button style={styles.delBtn} onClick={() => handleDelete(s._id)}>🗑️</button>
          </div>
        ))}
      </div>
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
  row: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' },
  input: { padding: '10px 12px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '14px', marginBottom: '12px' },
  btn: { background: '#3b5bdb', color: '#fff', border: 'none', padding: '10px 24px', borderRadius: '8px', cursor: 'pointer', fontSize: '15px' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' },
  card: { background: '#fff', borderRadius: '12px', padding: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.07)', display: 'flex', alignItems: 'center', gap: '14px' },
  avatar: { width: '48px', height: '48px', borderRadius: '50%', background: '#3b5bdb', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '18px', flexShrink: 0 },
  info: { flex: 1, display: 'flex', flexDirection: 'column', gap: '3px' },
  email: { color: '#666', fontSize: '13px' },
  meta: { color: '#999', fontSize: '12px' },
  delBtn: { background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px', padding: '4px' }
};
