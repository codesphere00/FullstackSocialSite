/**
 * LoginPage.jsx
 * Clean card-style login form.
 * On success: stores token via AuthContext → navigates to /feed.
 */
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { HiMail, HiLockClosed, HiExclamationCircle } from 'react-icons/hi';
import { loginUser } from '../api/auth';
import { useAuth } from '../context/AuthContext';
import styles from './AuthPage.module.css';

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError(''); // clear error on typing
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      setError('Please fill in all fields.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const { data } = await loginUser(form);
      // Backend returns flat: { _id, username, email, token }
      const { token, ...userData } = data;
      login(userData, token);
      navigate('/feed');
    } catch (err) {
      setError(
        err.response?.data?.message || 'Login failed. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.card}>
        {/* Logo / Brand */}
        <div className={styles.brand}>
          <div className={styles.brandIcon}>S</div>
          <h2 className={styles.brandName}>SocialFeed</h2>
          <p className={styles.brandSub}>Welcome back! Sign in to continue.</p>
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
            <label htmlFor="login-email" className={styles.label}>Email</label>
            <div className={styles.inputWrap}>
              <HiMail className={styles.inputIcon} />
              <input
                id="login-email"
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
            <label htmlFor="login-password" className={styles.label}>Password</label>
            <div className={styles.inputWrap}>
              <HiLockClosed className={styles.inputIcon} />
              <input
                id="login-password"
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Enter your password"
                className={styles.input}
                autoComplete="current-password"
                required
              />
            </div>
          </div>

          <button
            id="btn-login-submit"
            type="submit"
            className={styles.submitBtn}
            disabled={loading}
          >
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>

        <p className={styles.switchText}>
          Don't have an account?{' '}
          <Link to="/signup" className={styles.switchLink}>Sign up</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
