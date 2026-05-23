import { lazy, Suspense } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import ProtectedRoute from './ProtectedRoute';
import Loader from '../components/ui/Loader';

// Lazy-loaded pages for code splitting
const LandingPage = lazy(() => import('../pages/LandingPage'));
const ExplorePage = lazy(() => import('../pages/ExplorePage'));
const PostDetailPage = lazy(() => import('../pages/PostDetailPage'));
const ProfilePage = lazy(() => import('../pages/ProfilePage'));
const LoginPage = lazy(() => import('../pages/LoginPage'));
const RegisterPage = lazy(() => import('../pages/RegisterPage'));
const SavedPage = lazy(() => import('../pages/SavedPage'));
const CreatePostPage = lazy(() => import('../pages/CreatePostPage'));

export default function AppRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Suspense fallback={<Loader fullScreen text="Loading page..." />}>
        <Routes location={location} key={location.pathname}>
          {/* Public routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/explore" element={<ExplorePage />} />
          <Route path="/post/:id" element={<PostDetailPage />} />
          <Route path="/profile/:id" element={<ProfilePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Protected routes — requires authentication */}
          <Route element={<ProtectedRoute />}>
            <Route path="/create" element={<CreatePostPage />} />
            <Route path="/saved" element={<SavedPage />} />
          </Route>
        </Routes>
      </Suspense>
    </AnimatePresence>
  );
}
