/**
 * PostCard.jsx
 * Renders a single post with:
 *   - Creator avatar, username, handle, and relative time
 *   - Post text content
 *   - Post image (if present)
 *   - Like, Comment, Share action row with counts
 *   - Expandable CommentTray
 *
 * Props:
 *   - post: Post object from DB
 *   - currentUser: logged-in user object
 *   - onLike: () => void
 *   - onComment: (text: string) => void
 */
import React, { useState } from 'react';
import { HiHeart, HiOutlineHeart, HiChat, HiShare } from 'react-icons/hi';
import CommentTray from '../comments/CommentTray';
import styles from './PostCard.module.css';

/** Format ISO date to a human-readable "X time ago" string */
const timeAgo = (dateStr) => {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1)  return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24)  return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
};

const PostCard = ({ post, currentUser, onLike, onComment }) => {
  const [showComments, setShowComments] = useState(false);

  // likes[] contains ObjectId strings – compare against user._id
  const isLiked = post.likes?.some(
    (id) => id === currentUser?._id || id?._id === currentUser?._id
  );
  const likeCount    = post.likes?.length ?? 0;
  const commentCount = post.comments?.length ?? 0;

  // Avatar initials from username
  const initials = post.user?.username?.slice(0, 2).toUpperCase() ?? 'U';

  return (
    <article className={styles.card}>
      {/* ── Card Header ── */}
      <div className={styles.header}>
        <div className={styles.userInfo}>
          {/* Avatar */}
          <div className={styles.avatar}>{initials}</div>

          <div className={styles.meta}>
            <div className={styles.nameRow}>
              <span className={styles.username}>{post.user?.username}</span>
              <span className={styles.handle}>@{post.user?.username?.toLowerCase()}</span>
            </div>
            <span className={styles.time}>
              {post.createdAt ? timeAgo(post.createdAt) : 'recently'}
            </span>
          </div>
        </div>

        {/* Follow button – UI only for this assignment */}
        <button
          id={`btn-follow-${post._id}`}
          className={styles.followBtn}
          aria-label={`Follow ${post.user?.username}`}
        >
          Follow
        </button>
      </div>

      {/* Post Text Content – field is 'caption' in the DB */}
      {post.caption && (
        <p className={styles.content}>{post.caption}</p>
      )}

      {/* Post Image – field is 'imageUrl' in the DB */}
      {post.imageUrl && (
        <div className={styles.imageWrap}>
          <img
            src={post.imageUrl}
            alt="Post attachment"
            className={styles.postImage}
            loading="lazy"
            onError={(e) => { e.currentTarget.style.display = 'none'; }}
          />
        </div>
      )}

      {/* ── Action Row ── */}
      <div className={styles.actions}>
        {/* Like */}
        <button
          id={`btn-like-${post._id}`}
          className={`${styles.actionBtn} ${isLiked ? styles.liked : ''}`}
          onClick={onLike}
          aria-label={isLiked ? 'Unlike post' : 'Like post'}
          aria-pressed={isLiked}
        >
          {isLiked ? (
            <HiHeart className={`${styles.actionIcon} ${styles.heartFilled}`} />
          ) : (
            <HiOutlineHeart className={styles.actionIcon} />
          )}
          <span>{likeCount}</span>
        </button>

        {/* Comment */}
        <button
          id={`btn-comment-${post._id}`}
          className={`${styles.actionBtn} ${showComments ? styles.commentActive : ''}`}
          onClick={() => setShowComments((v) => !v)}
          aria-label="Toggle comments"
          aria-expanded={showComments}
        >
          <HiChat className={styles.actionIcon} />
          <span>{commentCount}</span>
        </button>

        {/* Share – UI only */}
        <button
          id={`btn-share-${post._id}`}
          className={styles.actionBtn}
          aria-label="Share post"
        >
          <HiShare className={styles.actionIcon} />
          <span>0</span>
        </button>
      </div>

      {/* ── Comment Tray (expandable) ── */}
      {showComments && (
        <CommentTray
          comments={post.comments ?? []}
          postId={post._id}
          onAddComment={onComment}
        />
      )}
    </article>
  );
};

export default PostCard;
