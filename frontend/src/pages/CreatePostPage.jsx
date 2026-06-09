/**
 * CreatePostPage.jsx
 * Full-screen dedicated page for creating a new post.
 *
 * Backend expects:  POST /api/posts/create-posts  (multipart/form-data)
 *   - caption  (text field, optional)
 *   - image    (file field, optional via multer)
 *
 * Validation: at least one of caption OR image file must be provided.
 * On success: prepends the new post to the feed and navigates back to /feed.
 */
import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { HiPhotograph, HiX, HiExclamationCircle, HiPaperAirplane } from 'react-icons/hi';
import { createPost } from '../api/posts';
import { usePosts } from '../context/PostsContext';
import { useAuth } from '../context/AuthContext';
import styles from './CreatePostPage.module.css';

const CreatePostPage = () => {
  const { user } = useAuth();
  const { prependPost } = usePosts();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [caption, setCaption]       = useState('');
  const [imageFile, setImageFile]   = useState(null);   // actual File object
  const [previewUrl, setPreviewUrl] = useState('');     // local object URL for preview
  const [error, setError]           = useState('');
  const [loading, setLoading]       = useState(false);

  // ── Handle file selection ──────────────────────────────────────────────
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    // Create a local preview URL so user sees the image immediately
    setPreviewUrl(URL.createObjectURL(file));
  };

  const clearImage = () => {
    setImageFile(null);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // ── Submit ──────────────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation: at least one of caption or image required
    if (!caption.trim() && !imageFile) {
      setError('Please add a caption or pick an image before posting.');
      return;
    }

    setLoading(true);
    try {
      // createPost() sends FormData with 'caption' + 'image' file to
      // POST /api/posts/create-posts (handled by multer on the backend)
      const { data } = await createPost({
        caption: caption.trim(),
        imageFile,
      });

      // Backend returns { message, post }
      const newPost = data?.post ?? data;
      prependPost(newPost);
      navigate('/feed');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create post. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDiscard = () => {
    if (caption.trim() || imageFile) {
      if (!window.confirm('Discard your post?')) return;
    }
    clearImage();
    navigate(-1);
  };

  // Avatar initials
  const initials = user?.username?.slice(0, 2).toUpperCase() ?? 'U';

  return (
    <div className={styles.page}>
      {/* ── Top Bar ── */}
      <div className={styles.topBar}>
        <button
          id="btn-discard-post"
          className={styles.discardBtn}
          onClick={handleDiscard}
          aria-label="Discard post"
        >
          <HiX />
        </button>
        <h2 className={styles.title}>Create Post</h2>
        <button
          id="btn-submit-post"
          className={styles.postBtn}
          onClick={handleSubmit}
          disabled={loading || (!caption.trim() && !imageFile)}
          aria-label="Publish post"
        >
          {loading ? '…' : <><HiPaperAirplane className={styles.sendIcon} /> Post</>}
        </button>
      </div>

      {/* Error Banner */}
      {error && (
        <div className={`error-banner ${styles.errorBanner}`} role="alert">
          <HiExclamationCircle size={16} />
          {error}
        </div>
      )}

      {/* ── Compose Area ── */}
      <div className={styles.compose}>
        {/* User Avatar */}
        <div className={styles.avatar}>{initials}</div>

        <div className={styles.composeRight}>
          <p className={styles.composeName}>{user?.username}</p>

          {/* Caption text area */}
          <textarea
            id="post-caption"
            className={styles.textarea}
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="What's on your mind?"
            rows={5}
            maxLength={1000}
            aria-label="Post caption"
          />

          {/* Image Preview */}
          {previewUrl && (
            <div className={styles.previewWrap}>
              <img
                src={previewUrl}
                alt="Preview"
                className={styles.preview}
              />
              <button
                className={styles.removeImageBtn}
                onClick={clearImage}
                aria-label="Remove image"
              >
                <HiX size={14} /> Remove
              </button>
            </div>
          )}

          {/* Character counter */}
          <p className={styles.charCount}>{caption.length} / 1000</p>
        </div>
      </div>

      {/* ── Toolbar ── */}
      <div className={styles.toolbar}>
        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          id="post-image-file"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          style={{ display: 'none' }}
          aria-label="Choose image"
        />

        <button
          id="btn-pick-image"
          className={`${styles.toolBtn} ${imageFile ? styles.toolBtnActive : ''}`}
          onClick={() => fileInputRef.current?.click()}
          aria-label="Attach image"
          title="Upload image"
        >
          <HiPhotograph className={styles.toolIcon} />
          <span>{imageFile ? imageFile.name.slice(0, 20) + '…' : 'Add Image'}</span>
        </button>
        <span className={styles.toolbarHint}>Caption or image required</span>
      </div>
    </div>
  );
};

export default CreatePostPage;
