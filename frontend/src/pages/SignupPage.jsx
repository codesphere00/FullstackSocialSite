/**
 * SignupPage.jsx
 * Registration form with username, email, and password fields.
 */
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { HiUser, HiMail, HiLockClosed, HiExclamationCircle } from 'react-icons/hi';
import { signupUser } from '../api/auth';
import { useAuth } from '../context/AuthContext';
import styles from './AuthPage.module.css';

const SignupPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { username, email, password } = form;
    if (!username || !email || !password) {
      setError('All fields are required.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const { data } = await signupUser(form);
      // Backend returns flat: { _id, username, email, token }
      const { token, ...userData } = data;
      login(userData, token);
      navigate('/feed');
    } catch (err) {
      setError(
        err.response?.data?.message || 'Signup failed. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.card}>
        {/* Brand */}
        <div className={styles.brand}>
          <div className={styles.brandIcon}>S</div>
          <h2 className={styles.brandName}>SocialFeed</h2>
          <p className={styles.brandSub}>Create your account and start sharing.</p>
        </div>

        {/* Error Banner */}
        {error && (
          <div className="error-banner" role="alert">
            <HiExclamationCircle size={16} />
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className={styles.form} noValidate>
          <div className={styles.inputGroup}>
            <label htmlFor="signup-username" className={styles.label}>Username</label>
            <div className={styles.inputWrap}>
              <HiUser className={styles.inputIcon} />
              <input
                id="signup-username"
                type="text"
                name="username"
                value={form.username}
                onChange={handleChange}
                placeholder="Choose a username"
                className={styles.input}
                autoComplete="username"
                required
              />
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="signup-email" className={styles.label}>Email</label>
            <div className={styles.inputWrap}>
              <HiMail className={styles.inputIcon} />
              <input
                id="signup-email"
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className={styles.input}
                autoComplete="email"
                required
              />
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="signup-password" className={styles.label}>Password</label>
            <div className={styles.inputWrap}>
              <HiLockClosed className={styles.inputIcon} />
              <input
                id="signup-password"
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Min. 6 characters"
                className={styles.input}
                autoComplete="new-password"
                required
              />
            </div>
          </div>

          <button
            id="btn-signup-submit"
            type="submit"
            className={styles.submitBtn}
            disabled={loading}
          >
            {loading ? 'Creating account…' : 'Create Account'}
          </button>
        </form>

        <p className={styles.switchText}>
          Already have an account?{' '}
          <Link to="/login" className={styles.switchLink}>Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;
