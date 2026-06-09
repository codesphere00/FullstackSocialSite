
import React from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';

import { AuthProvider, useAuth } from './context/AuthContext';
import { PostsProvider } from './context/PostsContext';

import AppLayout        from './components/layout/AppLayout';
import LoginPage        from './pages/LoginPage';
import SignupPage       from './pages/SignupPage';
import FeedPage         from './pages/FeedPage';
import CreatePostPage   from './pages/CreatePostPage';
import ProfilePage      from './pages/ProfilePage';
import ChatPage         from './pages/ChatPage';


const ProtectedRoute = ({ children }) => {
  const { isLoggedIn } = useAuth();
  return isLoggedIn ? children : <Navigate to="/login" replace />;
};


const PublicRoute = ({ children }) => {
  const { isLoggedIn } = useAuth();
  return isLoggedIn ? <Navigate to="/feed" replace /> : children;
};

const AppRoutes = () => (
  <Routes>
    <Route
      path="/login"
      element={
        <PublicRoute>
          <LoginPage />
        </PublicRoute>
      }
    />
    <Route
      path="/signup"
      element={
        <PublicRoute>
          <SignupPage />
        </PublicRoute>
      }
    />

    <Route
      element={
        <ProtectedRoute>
          <PostsProvider>
            <AppLayout />
          </PostsProvider>
        </ProtectedRoute>
      }
    >
      <Route path="/feed"    element={<FeedPage />} />
      <Route path="/create"  element={<CreatePostPage />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/chat"    element={<ChatPage />} />
    </Route>

    <Route path="/" element={<Navigate to="/feed" replace />} />

    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
);

const App = () => (
  <BrowserRouter>
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  </BrowserRouter>
);

export default App;
