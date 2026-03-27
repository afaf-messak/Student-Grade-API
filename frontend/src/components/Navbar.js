import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Navbar({ user, onLogout }) {
  const location = useLocation();

  const navLinks = [
    { to: '/students', label: ' Étudiants' },
    { to: '/subjects', label: ' Matières' },
    { to: '/grades',   label: ' Notes' },
  ];

  return (
    <nav style={styles.nav}>
      <div style={styles.brand}> Student Grade API</div>
      <div style={styles.links}>
        {navLinks.map(link => (
          <Link key={link.to} to={link.to} style={{
            ...styles.link,
            ...(location.pathname === link.to ? styles.activeLink : {})
          }}>
            {link.label}
          </Link>
        ))}
      </div>
      <div style={styles.user}>
        <span style={styles.userName}>👤 {user?.name}</span>
        <button style={styles.logout} onClick={onLogout}>Déconnexion</button>
      </div>
    </nav>
  );
}

const styles = {
  nav: { background: '#1a1a2e', display: 'flex', alignItems: 'center', padding: '0 24px', height: '60px', position: 'sticky', top: 0, zIndex: 100 },
  brand: { color: '#fff', fontWeight: 'bold', fontSize: '18px', marginRight: '32px', whiteSpace: 'nowrap' },
  links: { display: 'flex', gap: '4px', flex: 1 },
  link: { color: 'rgba(255,255,255,0.7)', textDecoration: 'none', padding: '8px 16px', borderRadius: '8px', fontSize: '14px', transition: 'all 0.2s' },
  activeLink: { background: '#3b5bdb', color: '#fff' },
  user: { display: 'flex', alignItems: 'center', gap: '12px' },
  userName: { color: 'rgba(255,255,255,0.8)', fontSize: '14px' },
  logout: { background: 'rgba(255,255,255,0.1)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)', padding: '6px 14px', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' }
};
