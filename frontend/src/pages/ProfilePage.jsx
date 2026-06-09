/**
 * ProfilePage.jsx
 * Displays the currently logged-in user's info.
 * Shows posts created by this user filtered from the feed.
 */
import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { HiLogout, HiPencil } from 'react-icons/hi';
import { useAuth } from '../context/AuthContext';
import { usePosts } from '../context/PostsContext';
import PostCard from '../components/feed/PostCard';
import styles from './ProfilePage.module.css';

const ProfilePage = () => {
  const { user, logout } = useAuth();
  const { posts, toggleLike, postComment } = usePosts();
  const navigate = useNavigate();

  // Filter only current user's posts
  const myPosts = useMemo(
    () => posts.filter((p) => p.user?.username === user?.username),
    [posts, user]
  );

  const initials = user?.username?.slice(0, 2).toUpperCase() ?? 'U';

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className={styles.page}>
      {/* ── Profile Header ── */}
      <div className={styles.header}>
        {/* Avatar */}
        <div className={styles.avatar}>{initials}</div>

        {/* Info */}
        <div className={styles.info}>
          <h2 className={styles.username}>{user?.username}</h2>
          <p className={styles.email}>{user?.email}</p>
          <div className={styles.stats}>
            <div className={styles.stat}>
              <span className={styles.statValue}>{myPosts.length}</span>
              <span className={styles.statLabel}>Posts</span>
            </div>
            <div className={styles.statDivider} />
            <div className={styles.stat}>
              <span className={styles.statValue}>
                {myPosts.reduce((acc, p) => acc + p.likes.length, 0)}
              </span>
              <span className={styles.statLabel}>Likes</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Action Buttons ── */}
      <div className={styles.actions}>
        <button
          id="btn-edit-profile"
          className={styles.editBtn}
          aria-label="Edit profile"
        >
          <HiPencil /> Edit Profile
        </button>
        <button
          id="btn-logout"
          className={styles.logoutBtn}
          onClick={handleLogout}
          aria-label="Log out"
        >
          <HiLogout /> Logout
        </button>
      </div>

      {/* ── Divider ── */}
      <div className={styles.sectionTitle}>My Posts</div>

      {/* ── User's Posts ── */}
      {myPosts.length === 0 ? (
        <div className={styles.empty}>
          <span>📝</span>
          <p>You haven't posted anything yet.</p>
        </div>
      ) : (
        <div className={styles.postsList}>
          {myPosts.map((post) => (
            <PostCard
              key={post._id}
              post={post}
              currentUser={user}
              onLike={() => toggleLike(post._id)}
              onComment={(text) => postComment(post._id, text)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
