/**
 * BottomNav.jsx
 * Fixed bottom navigation bar inspired by the TaskPlanet reference UI.
 * Tabs: Feed · Create · Profile
 */
import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { HiHome, HiPlusCircle, HiUser, HiChat } from 'react-icons/hi';
import styles from './BottomNav.module.css';

const NAV_ITEMS = [
  { to: '/feed',    icon: HiHome,       label: 'Feed'   },
  { to: '/profile', icon: HiUser,       label: 'Profile' },
  { to: '/create',  icon: HiPlusCircle, label: 'Post',  isCenter: true },
  { to: '/chat',    icon: HiChat,       label: 'Chat'   },
];

const BottomNav = () => {
  return (
    <nav className={styles.nav} aria-label="Main navigation">
      {NAV_ITEMS.map(({ to, icon: Icon, label, isCenter }) => (
        <NavLink
          key={to}
          to={to}
          id={`nav-${label.toLowerCase()}`}
          className={({ isActive }) =>
            `${styles.navItem} ${isCenter ? styles.centerItem : ''} ${isActive ? styles.active : ''}`
          }
        >
          <Icon className={styles.icon} />
          {!isCenter && <span className={styles.label}>{label}</span>}
        </NavLink>
      ))}
    </nav>
  );
};

export default BottomNav;
