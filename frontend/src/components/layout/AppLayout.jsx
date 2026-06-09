/**
 * AppLayout.jsx
 * Main wrapper rendered for all authenticated pages.
 * Provides the sticky header and bottom navigation.
 */
import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { HiBell } from 'react-icons/hi';
import { useAuth } from '../../context/AuthContext';
import BottomNav from './BottomNav';
import styles from './AppLayout.module.css';

const AppLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Generate avatar initials from username
  const initials = user?.username
    ? user.username.slice(0, 2).toUpperCase()
    : 'U';

  return (
    <div className="app-container">
      {/* ── Top Header ── */}
      <header className={styles.header}>
        <h1 className={styles.logo}>Social</h1>
        <div className={styles.headerRight}>
          {/* Notification bell */}
          <button
            id="btn-notifications"
            className={styles.iconBtn}
            aria-label="Notifications"
          >
            <HiBell />
          </button>

          {/* Avatar / logout */}
          <button
            id="btn-avatar"
            className={styles.avatar}
            onClick={handleLogout}
            title={`Logged in as ${user?.username} — click to logout`}
            aria-label="User menu"
          >
            {initials}
          </button>
        </div>
      </header>

      {/* ── Page Content (rendered by child routes) ── */}
      <main className="page-body">
        <Outlet />
      </main>

      {/* ── Bottom Navigation ── */}
      <BottomNav />
    </div>
  );
};

export default AppLayout;
