/**
 * PostsContext.jsx
 * Global store for the posts feed.
 * Handles fetching, optimistic like/comment updates so the UI
 * reflects changes instantly without waiting for the server response.
 *
 * IMPORTANT – actual backend field names (different from initial assumptions):
 *   post.caption   (not post.content)
 *   post.imageUrl  (not post.image)
 *   post.likes     → array of ObjectId strings (NOT usernames)
 *   comment.user   → populated { _id, username } object (NOT comment.username)
 */
import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from 'react';
import { fetchPosts, likePost, addComment } from '../api/posts';
import { useAuth } from './AuthContext';

const PostsContext = createContext(null);

export const PostsProvider = ({ children }) => {
  const { isLoggedIn, user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ── Fetch all posts on mount (only if logged in) ──────────────────────
  const loadPosts = useCallback(async () => {
    if (!isLoggedIn) return;
    setLoading(true);
    setError(null);
    try {
      const { data } = await fetchPosts();
      // Backend returns: { message: "...", posts: [...] }
      const list = data?.posts ?? (Array.isArray(data) ? data : []);
      setPosts(list);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load posts');
    } finally {
      setLoading(false);
    }
  }, [isLoggedIn]);

  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  /**
   * Optimistic like toggle.
   * likes[] stores ObjectId strings, so we compare against user._id.
   * Immediately updates local state → calls API (PUT) in background.
   * Reverts on failure.
   */
  const toggleLike = useCallback(
    async (postId) => {
      if (!user) return;

      // Snapshot for rollback
      const previous = posts;

      // Optimistically update likes array using user _id
      setPosts((prev) =>
        prev.map((p) => {
          if (p._id !== postId) return p;
          const alreadyLiked = p.likes.some(
            (id) => id === user._id || id?._id === user._id
          );
          return {
            ...p,
            likes: alreadyLiked
              ? p.likes.filter((id) => id !== user._id && id?._id !== user._id)
              : [...p.likes, user._id],
          };
        })
      );

      try {
        await likePost(postId);
      } catch {
        // Revert on failure
        setPosts(previous);
      }
    },
    [posts, user]
  );

  /**
   * Optimistic comment add.
   * Backend comment shape: { user: { _id, username }, text }
   * We build a matching local comment so the UI renders correctly immediately.
   */
  const postComment = useCallback(
    async (postId, text) => {
      if (!user || !text.trim()) return;

      // Match the shape the backend returns after populate:
      // { user: { _id, username }, text }
      const newComment = {
        user: { _id: user._id, username: user.username },
        text: text.trim(),
        _id: `temp-${Date.now()}`, // temporary local id
      };

      // Optimistically append comment
      setPosts((prev) =>
        prev.map((p) =>
          p._id !== postId
            ? p
            : { ...p, comments: [...p.comments, newComment] }
        )
      );

      try {
        const { data } = await addComment(postId, { text: text.trim() });
        // Backend returns { message, commentsCount, comments }
        // Update the post's comments array with the server's authoritative list
        if (data?.comments) {
          setPosts((prev) =>
            prev.map((p) =>
              p._id !== postId ? p : { ...p, comments: data.comments }
            )
          );
        }
      } catch {
        // Revert optimistic comment on failure
        setPosts((prev) =>
          prev.map((p) =>
            p._id !== postId
              ? p
              : {
                  ...p,
                  comments: p.comments.filter((c) => c._id !== newComment._id),
                }
          )
        );
      }
    },
    [user]
  );

  /**
   * Prepend a newly created post to the top of the feed.
   * Called from CreatePostPage after successful API response.
   */
  const prependPost = useCallback((post) => {
    setPosts((prev) => [post, ...prev]);
  }, []);

  const value = {
    posts,
    loading,
    error,
    loadPosts,
    toggleLike,
    postComment,
    prependPost,
  };

  return (
    <PostsContext.Provider value={value}>{children}</PostsContext.Provider>
  );
};

/** Custom hook to consume posts context. */
export const usePosts = () => {
  const ctx = useContext(PostsContext);
  if (!ctx) throw new Error('usePosts must be used inside <PostsProvider>');
  return ctx;
};
