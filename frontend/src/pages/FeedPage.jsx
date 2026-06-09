/**
 * FeedPage.jsx
 * Main social feed.
 * - Search bar at the top
 * - Filter tabs (All / For You / Most Liked / Most Commented)
 * - Scrollable list of PostCards
 * - Floating "+" FAB (navigates to /create)
 */
import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { HiSearch, HiPlus } from 'react-icons/hi';
import { usePosts } from '../context/PostsContext';
import PostFilters from '../components/feed/PostFilters';
import PostList from '../components/feed/PostList';
import styles from './FeedPage.module.css';

const FeedPage = () => {
  const { posts } = usePosts();
  const navigate = useNavigate();

  const [search, setSearch]     = useState('');
  const [activeFilter, setActiveFilter] = useState('all');

  /**
   * Derive displayed posts from the raw list by applying
   * the search query and the active filter tab.
   * useMemo ensures this only recalculates when deps change.
   */
  const displayedPosts = useMemo(() => {
    let result = [...posts];

    // ── Search filter ──
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.content?.toLowerCase().includes(q) ||
          p.user?.username?.toLowerCase().includes(q)
      );
    }

    // ── Tab filter ──
    switch (activeFilter) {
      case 'liked':
        result = [...result].sort((a, b) => b.likes.length - a.likes.length);
        break;
      case 'commented':
        result = [...result].sort(
          (a, b) => b.comments.length - a.comments.length
        );
        break;
      case 'foryou':
        // Shuffle for a "personalised" feel (you can replace with real logic)
        result = [...result].sort(() => Math.random() - 0.5);
        break;
      default:
        // 'all' – newest first (server returns newest first already)
        break;
    }

    return result;
  }, [posts, search, activeFilter]);

  return (
    <div className={styles.page}>
      {/* ── Search Bar ── */}
      <div className={styles.searchWrap}>
        <HiSearch className={styles.searchIcon} />
        <input
          id="feed-search"
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search posts, users…"
          className={styles.searchInput}
          aria-label="Search posts and users"
        />
      </div>

      {/* ── Filter Tabs ── */}
      <PostFilters active={activeFilter} onChange={setActiveFilter} />

      {/* ── Post List ── */}
      <PostList posts={displayedPosts} />

      {/* ── Floating Action Button ── */}
      <button
        id="fab-create-post"
        className={styles.fab}
        onClick={() => navigate('/create')}
        aria-label="Create a new post"
        title="Create Post"
      >
        <HiPlus className={styles.fabIcon} />
      </button>
    </div>
  );
};

export default FeedPage;
