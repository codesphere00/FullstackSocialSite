/**
 * PostFilters.jsx
 * Horizontal scrollable filter pill row: All Posts · For You · Most Liked · Most Commented
 */
import React from 'react';
import styles from './PostFilters.module.css';

const FILTERS = [
  { id: 'all',       label: 'All Post' },
  { id: 'foryou',    label: 'For You' },
  { id: 'liked',     label: 'Most Liked' },
  { id: 'commented', label: 'Most Commented' },
];

const PostFilters = ({ active, onChange }) => {
  return (
    <div className={styles.wrapper} role="tablist" aria-label="Post filters">
      {FILTERS.map(({ id, label }) => (
        <button
          key={id}
          id={`filter-${id}`}
          role="tab"
          aria-selected={active === id}
          className={`${styles.pill} ${active === id ? styles.active : ''}`}
          onClick={() => onChange(id)}
        >
          {label}
        </button>
      ))}
    </div>
  );
};

export default PostFilters;
