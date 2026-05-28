import { motion } from 'framer-motion';
import { Link, NavLink } from 'react-router-dom';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../../hooks/useAuth';
import { primaryNavItems, authNavItems } from '../../config/navigation';

const menuVariants = {
  closed: { x: '100%' },
  open: { x: 0 },
};

const backdropVariants = {
  closed: { opacity: 0 },
  open: { opacity: 1 },
};

const itemVariants = {
  closed: { opacity: 0, x: 16 },
  open: (i) => ({
    opacity: 1,
    x: 0,
    transition: { delay: 0.05 + i * 0.04, duration: 0.25 },
  }),
};

export default function MobileMenu({ onClose }) {
  const { user, isAuthenticated, logout } = useAuth();

  const navItems = [
    ...primaryNavItems,
    ...(isAuthenticated ? authNavItems : []),
  ];

  const handleLogout = () => {
    logout();
    onClose();
  };

  return (
    <>
      <motion.div
        variants={backdropVariants}
        initial="closed"
        animate="open"
        exit="closed"
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
      />

      <motion.div
        variants={menuVariants}
        initial="closed"
        animate="open"
        exit="closed"
        transition={{ type: 'spring', damping: 32, stiffness: 320 }}
        className="fixed top-0 right-0 bottom-0 w-72 max-w-[88vw] bg-card border-l border-line z-[70] flex flex-col"
      >
        <div className="flex items-center justify-between px-4 py-3.5 border-b border-line">
          <span className="text-base font-bold gradient-text font-[Outfit]">Velora</span>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-elevated transition-colors text-muted"
            aria-label="Close menu"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        {isAuthenticated && user && (
          <div className="px-4 py-3 border-b border-line">
            <div className="flex items-center gap-3">
              {user.avatarUrl ? (
                <img
                  src={user.avatarUrl}
                  alt={user.username}
                  className="w-10 h-10 rounded-lg object-cover"
                />
              ) : (
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-accent to-violet flex items-center justify-center">
                  <span className="text-white font-semibold">
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

        <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
          {navItems.map((item, i) => (
            <motion.div key={item.to} custom={i} variants={itemVariants} initial="closed" animate="open">
              <NavLink
                to={item.to}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                    isActive
                      ? 'text-foreground bg-elevated'
                      : 'text-muted hover:text-foreground hover:bg-elevated/60'
                  }`
                }
              >
                {item.icon && <item.icon className="w-5 h-5 shrink-0" />}
                {item.label}
              </NavLink>
            </motion.div>
          ))}
          {isAuthenticated && (
            <motion.div custom={navItems.length} variants={itemVariants} initial="closed" animate="open">
              <NavLink
                to={`/profile/${user?.id}`}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                    isActive
                      ? 'text-foreground bg-elevated'
                      : 'text-muted hover:text-foreground hover:bg-elevated/60'
                  }`
                }
              >
                Profile
              </NavLink>
            </motion.div>
          )}
        </nav>

        <div className="p-4 border-t border-line">
          {isAuthenticated ? (
            <button
              onClick={handleLogout}
              className="w-full py-2.5 text-sm font-medium text-rose bg-rose/10 hover:bg-rose/20 rounded-lg transition-colors"
            >
              Sign Out
            </button>
          ) : (
            <div className="space-y-2">
              <Link
                to="/login"
                onClick={onClose}
                className="block w-full text-center py-2.5 text-sm font-medium text-foreground bg-elevated hover:bg-elevated/80 rounded-lg transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                onClick={onClose}
                className="block w-full text-center btn-primary py-2.5 text-sm"
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
