/**
 * CommentTray.jsx
 * Expandable comment section rendered below each PostCard.
 * Shows existing comments and an input to add a new one.
 *
 * Props:
 *   - comments: Array<{ username, text }>
 *   - postId: string
 *   - onAddComment: (text: string) => void  — handled by PostsContext
 */
import React, { useState, useRef, useEffect } from 'react';
import { HiPaperAirplane } from 'react-icons/hi';
import styles from './CommentTray.module.css';

const CommentTray = ({ comments = [], postId, onAddComment }) => {
  const [text, setText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const inputRef = useRef(null);
  const listRef = useRef(null);

  // Auto-scroll to bottom when comments update
  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [comments.length]);

  // Focus the input when tray opens
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim() || submitting) return;

    setSubmitting(true);
    await onAddComment(text.trim());
    setText('');
    setSubmitting(false);
  };

  return (
    <div className={styles.tray} role="region" aria-label="Comments">
      {/* ── Comment List ── */}
      <div className={styles.commentList} ref={listRef}>
        {comments.length === 0 ? (
          <p className={styles.emptyMsg}>No comments yet. Be the first!</p>
        ) : (
          comments.map((c, idx) => (
            <div key={c._id ?? idx} className={styles.commentItem}>
              {/* Mini avatar */}
              <div className={styles.commentAvatar}>
                {(c.user?.username ?? c.username ?? '?').slice(0, 1).toUpperCase()}
              </div>
              <div className={styles.commentBody}>
                <span className={styles.commentUsername}>
                  {c.user?.username ?? c.username}
                </span>
                <p className={styles.commentText}>{c.text}</p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* ── Add Comment Input ── */}
      <form onSubmit={handleSubmit} className={styles.inputRow}>
        <input
          ref={inputRef}
          id={`comment-input-${postId}`}
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Write a comment…"
          className={styles.input}
          maxLength={300}
          aria-label="Write a comment"
        />
        <button
          id={`comment-submit-${postId}`}
          type="submit"
          className={styles.sendBtn}
          disabled={!text.trim() || submitting}
          aria-label="Post comment"
        >
          <HiPaperAirplane className={styles.sendIcon} />
        </button>
      </form>
    </div>
  );
};

export default CommentTray;
