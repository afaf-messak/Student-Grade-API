import React, { useState } from 'react';
import API from '../services/api';

export default function Register({ onLogin }) {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await API.post('/auth/register', form);
      const res = await API.post('/auth/login', { email: form.email, password: form.password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      onLogin(res.data.user);
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de la création');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}> Student Grade API</h1>
        <h2 style={styles.subtitle}>Créer un compte</h2>
        {error && <div style={styles.error}>{error}</div>}
        <form onSubmit={handleSubmit}>
          <input style={styles.input} type="text" placeholder="Nom complet"
            value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
          <input style={styles.input} type="email" placeholder="Email"
            value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
          <input style={styles.input} type="password" placeholder="Mot de passe"
            value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required />
          <button style={styles.button} type="submit" disabled={loading}>
            {loading ? 'Création...' : "S'inscrire"}
          </button>
        </form>
        <p style={styles.hint}>Déjà un compte ? <a href="/">Se connecter</a></p>
      </div>
    </div>
  );
}

const styles = {
  container: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f0f4ff' },
  card: { background: '#fff', padding: '40px', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', width: '100%', maxWidth: '400px' },
  title: { textAlign: 'center', color: '#3b5bdb', margin: '0 0 8px' },
  subtitle: { textAlign: 'center', color: '#555', fontWeight: 400, margin: '0 0 24px' },
  input: { width: '100%', padding: '12px', marginBottom: '14px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '15px', boxSizing: 'border-box' },
  button: { width: '100%', padding: '13px', background: '#3b5bdb', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '16px', cursor: 'pointer' },
  error: { background: '#ffe3e3', color: '#c92a2a', padding: '10px', borderRadius: '8px', marginBottom: '16px', textAlign: 'center' },
  hint: { textAlign: 'center', marginTop: '16px', color: '#666' }
};
