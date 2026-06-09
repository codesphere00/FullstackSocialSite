/**
 * PostList.jsx
 * Renders the list of PostCards using data from PostsContext.
 * Handles empty states and loading/error banners.
 *
 * Props:
 *   - posts: filtered array of posts to render
 */
import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { usePosts } from '../../context/PostsContext';
import PostCard from './PostCard';
import styles from './PostList.module.css';

const PostList = ({ posts }) => {
  const { user } = useAuth();
  const { toggleLike, postComment, loading, error } = usePosts();

  if (loading) {
    return (
      <div className="spinner-wrap">
        <div className="spinner" />
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '16px' }}>
        <div className="error-banner">{error}</div>
      </div>
    );
  }

  if (!posts || posts.length === 0) {
    return (
      <div className={styles.empty}>
        <span className={styles.emptyIcon}>📭</span>
        <p className={styles.emptyTitle}>No posts yet</p>
        <p className={styles.emptySubtitle}>Be the first to share something!</p>
      </div>
    );
  }

  return (
    <div className={styles.list}>
      {posts.map((post) => (
        <PostCard
          key={post._id}
          post={post}
          currentUser={user}
          onLike={() => toggleLike(post._id)}
          onComment={(text) => postComment(post._id, text)}
        />
      ))}
    </div>
  );
};

export default PostList;
