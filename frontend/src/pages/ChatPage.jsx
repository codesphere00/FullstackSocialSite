
import React from 'react';
import styles from './ChatPage.module.css';

const ChatPage = () => (
  <div className={styles.page}>
    <div className={styles.content}>
      <span className={styles.icon}>💬</span>
      <h2 className={styles.title}>Chat</h2>
      <p className={styles.subtitle}>Direct messaging coming soon!</p>
    </div>
  </div>
);

export default ChatPage;
