import React, { useEffect, useState } from 'react';
import API from '../services/api';

export default function Dashboard() {
  const [stats, setStats] = useState({ students: 0, subjects: 0 });

  useEffect(() => {
    Promise.all([
      API.get('/students').catch(() => ({ data: [] })),
      API.get('/subjects').catch(() => ({ data: [] }))
    ]).then(([s, sub]) => {
      setStats({ students: s.data.length, subjects: sub.data.length });
    });
  }, []);

  const cards = [
    { label: 'Étudiants inscrits', value: stats.students, color: '#3b5bdb' },
    { label: 'Matières disponibles', value: stats.subjects, color: '#0ca678' },
    { label: 'Services actifs', value: 3,  color: '#f76707' },
    { label: 'Base de données', value: 'MongoDB',  color: '#9c36b5', isText: true },
  ];

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Tableau de bord</h2>
      <div style={styles.grid}>
        {cards.map((card, i) => (
          <div key={i} style={{ ...styles.card, borderTop: `4px solid ${card.color}` }}>
            <div style={{ fontSize: '36px' }}>{card.icon}</div>
            <div style={{ ...styles.value, color: card.color }}>
              {card.isText ? card.value : card.value}
            </div>
            <div style={styles.cardLabel}>{card.label}</div>
          </div>
        ))}
      </div>

      <div style={styles.infoBox}>
        <h3 style={{ margin: '0 0 12px', color: '#1a1a2e' }}>Endpoints disponibles</h3>
        <div style={styles.endpoints}>
          {[
            { method: 'POST', path: '/auth/register', desc: 'Créer un compte' },
            { method: 'POST', path: '/auth/login',    desc: 'Se connecter' },
            { method: 'GET',  path: '/students',      desc: 'Liste des étudiants' },
            { method: 'POST', path: '/students',      desc: 'Créer un étudiant' },
            { method: 'GET',  path: '/subjects',      desc: 'Liste des matières' },
            { method: 'POST', path: '/grades',        desc: 'Ajouter une note' },
            { method: 'GET',  path: '/grades/bulletin/:id', desc: 'Consulter le bulletin' },
          ].map((ep, i) => (
            <div key={i} style={styles.endpoint}>
              <span style={{ ...styles.method, background: ep.method === 'GET' ? '#d3f9d8' : '#e7f5ff', color: ep.method === 'GET' ? '#2b8a3e' : '#1864ab' }}>
                {ep.method}
              </span>
              <code style={styles.path}>{ep.path}</code>
              <span style={styles.desc}>{ep.desc}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: { padding: '24px' },
  title: { margin: '0 0 24px', color: '#1a1a2e', fontSize: '22px' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' },
  card: { background: '#fff', borderRadius: '12px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.07)', textAlign: 'center' },
  value: { fontSize: '36px', fontWeight: 'bold', margin: '8px 0 4px' },
  cardLabel: { color: '#666', fontSize: '14px' },
  infoBox: { background: '#fff', borderRadius: '12px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.07)' },
  endpoints: { display: 'flex', flexDirection: 'column', gap: '8px' },
  endpoint: { display: 'flex', alignItems: 'center', gap: '12px', padding: '10px', background: '#f8f9fa', borderRadius: '8px' },
  method: { padding: '3px 10px', borderRadius: '6px', fontWeight: 700, fontSize: '12px', minWidth: '44px', textAlign: 'center' },
  path: { color: '#333', fontSize: '13px', flex: 1 },
  desc: { color: '#888', fontSize: '13px' }
};
