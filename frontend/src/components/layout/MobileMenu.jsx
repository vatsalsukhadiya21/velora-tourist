import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  XMarkIcon,
  BookmarkIcon,
  PlusCircleIcon,
  UserCircleIcon,
  GlobeAltIcon,
} from '@heroicons/react/24/outline';
import { useAuth } from '../../hooks/useAuth';

const menuVariants = {
  closed: { x: '100%' },
  open: { x: 0 },
};

const backdropVariants = {
  closed: { opacity: 0 },
  open: { opacity: 1 },
};

const itemVariants = {
  closed: { opacity: 0, x: 20 },
  open: (i) => ({
    opacity: 1,
    x: 0,
    transition: { delay: 0.1 + i * 0.05, duration: 0.3 },
  }),
};

export default function MobileMenu({ onClose }) {
  const { user, isAuthenticated, logout } = useAuth();

  const handleLogout = () => {
    logout();
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <motion.div
        variants={backdropVariants}
        initial="closed"
        animate="open"
        exit="closed"
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
      />

      {/* Slide-out Panel */}
      <motion.div
        variants={menuVariants}
        initial="closed"
        animate="open"
        exit="closed"
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        className="fixed top-0 right-0 bottom-0 w-80 max-w-[85vw] bg-card border-l border-line z-[70] flex flex-col"
      >
        {/* ─── Header ─── */}
        <div className="flex items-center justify-between p-6 border-b border-line">
          <span className="text-lg font-bold gradient-text font-[Outfit]">Velora</span>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-elevated transition-colors text-muted"
            aria-label="Close menu"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        {/* ─── User Card (if logged in) ─── */}
        {isAuthenticated && user && (
          <div className="p-6 border-b border-line">
            <div className="flex items-center gap-3">
              {user.avatarUrl ? (
                <img
                  src={user.avatarUrl}
                  alt={user.username}
                  className="w-11 h-11 rounded-xl object-cover"
                />
              ) : (
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-accent to-violet flex items-center justify-center">
                  <span className="text-white font-semibold text-lg">
                    {user.username?.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
              <div className="min-w-0">
                <p className="text-sm font-semibold text-foreground truncate">
                  {user.displayName || user.username}
                </p>
                <p className="text-xs text-muted truncate">@{user.username}</p>
              </div>
            </div>
          </div>
        )}

        {/* ─── Navigation Links ─── */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          <MobileNavLink
            to="/explore"
            label="Explore"
            icon={GlobeAltIcon}
            index={0}
            onClick={onClose}
          />

          {isAuthenticated && (
            <>
              <MobileNavLink
                to="/create"
                label="Share Experience"
                icon={PlusCircleIcon}
                index={1}
                onClick={onClose}
              />
              <MobileNavLink
                to="/saved"
                label="Saved Experiences"
                icon={BookmarkIcon}
                index={2}
                onClick={onClose}
              />
              <MobileNavLink
                to={`/profile/${user?.id}`}
                label="My Profile"
                icon={UserCircleIcon}
                index={3}
                onClick={onClose}
              />
            </>
          )}
        </nav>

        {/* ─── Bottom Auth Section ─── */}
        <div className="p-6 border-t border-line">
          {isAuthenticated ? (
            <button
              onClick={handleLogout}
              className="w-full py-3 text-sm font-medium text-rose bg-rose/10 hover:bg-rose/20 rounded-xl transition-colors"
            >
              Sign Out
            </button>
          ) : (
            <div className="space-y-3">
              <Link
                to="/login"
                onClick={onClose}
                className="block w-full text-center py-3 text-sm font-medium text-foreground bg-elevated hover:bg-elevated/80 rounded-xl transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                onClick={onClose}
                className="block w-full text-center btn-primary py-3 text-sm"
              >
                Join Velora
              </Link>
            </div>
          )}
        </div>
      </motion.div>
    </>
  );
}

function MobileNavLink({ to, label, icon: Icon, index, onClick }) {
  return (
    <motion.div
      custom={index}
      variants={itemVariants}
      initial="closed"
      animate="open"
    >
      <Link
        to={to}
        onClick={onClick}
        className="flex items-center gap-3 px-4 py-3.5 text-sm font-medium text-muted hover:text-foreground hover:bg-elevated rounded-xl transition-colors"
      >
        {Icon && <Icon className="w-5 h-5 flex-shrink-0" />}
        {label}
      </Link>
    </motion.div>
  );
}
