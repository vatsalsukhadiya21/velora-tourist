import { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bars3Icon,
  XMarkIcon,
  ArrowRightStartOnRectangleIcon,
} from '@heroicons/react/24/outline';
import { useAuth } from '../../hooks/useAuth';
import MobileMenu from './MobileMenu';
import Avatar from '../ui/Avatar';
import PageContainer from './PageContainer';
import { primaryNavItems, authNavItems } from '../../config/navigation';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { user, isAuthenticated, logout } = useAuth();
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setDropdownOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [dropdownOpen]);

  const desktopNav = [
    ...primaryNavItems,
    ...(isAuthenticated ? authNavItems : []),
  ];

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 120, damping: 20 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-surface/85 backdrop-blur-xl border-b border-line shadow-lg shadow-black/15'
            : 'bg-surface/40 backdrop-blur-md border-b border-transparent'
        }`}
      >
        <PageContainer size="full" className="!px-5 sm:!px-6 lg:!px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-2 group shrink-0">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent to-violet flex items-center justify-center shadow-md shadow-accent/20 group-hover:shadow-accent/30 transition-shadow">
                <span className="text-white font-bold text-sm">V</span>
              </div>
              <span className="text-lg font-bold tracking-tight font-[Outfit] hidden sm:inline">
                <span className="gradient-text">Velora</span>
              </span>
            </Link>

            <nav className="hidden md:flex items-center gap-0.5">
              {desktopNav.map(({ to, label }) => (
                <DesktopNavLink key={to} to={to} label={label} />
              ))}
            </nav>

            <div className="hidden md:flex items-center gap-2 shrink-0">
              {isAuthenticated ? (
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center gap-2 p-1 rounded-lg hover:bg-elevated transition-colors"
                    aria-label="Account menu"
                  >
                    <Avatar user={user} size="sm" />
                  </button>

                  <AnimatePresence>
                    {dropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.96 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 top-12 w-52 bg-card border border-line-light rounded-xl shadow-2xl shadow-black/50 overflow-hidden"
                      >
                        <div className="p-3 border-b border-line">
                          <p className="text-sm font-semibold text-foreground truncate">
                            {user?.displayName || user?.username}
                          </p>
                          <p className="text-xs text-muted truncate">@{user?.username}</p>
                        </div>
                        <div className="p-1.5">
                          <DropdownLink to={`/profile/${user?.id}`} label="My Profile" />
                        </div>
                        <div className="p-1.5 border-t border-line">
                          <button
                            onClick={logout}
                            className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-rose hover:bg-rose/10 rounded-lg transition-colors"
                          >
                            <ArrowRightStartOnRectangleIcon className="w-4 h-4" />
                            Sign Out
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="text-sm font-medium text-muted hover:text-foreground transition-colors px-3 py-2"
                  >
                    Sign In
                  </Link>
                  <Link to="/register" className="btn-primary text-sm !py-2 !px-4">
                    Join
                  </Link>
                </>
              )}
            </div>

            <button
              className="md:hidden p-2 rounded-lg hover:bg-elevated transition-colors text-muted"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? (
                <XMarkIcon className="w-6 h-6" />
              ) : (
                <Bars3Icon className="w-6 h-6" />
              )}
            </button>
          </div>
        </PageContainer>
      </motion.header>

      <AnimatePresence>
        {mobileOpen && <MobileMenu onClose={() => setMobileOpen(false)} />}
      </AnimatePresence>
    </>
  );
}

function DesktopNavLink({ to, label }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `relative px-3.5 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
          isActive
            ? 'text-foreground bg-elevated'
            : 'text-muted hover:text-foreground hover:bg-elevated/50'
        }`
      }
    >
      {({ isActive }) => (
        <>
          {label}
          {isActive && (
            <motion.div
              layoutId="navbar-indicator"
              className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-accent"
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            />
          )}
        </>
      )}
    </NavLink>
  );
}

function DropdownLink({ to, label }) {
  return (
    <Link
      to={to}
      className="flex items-center gap-2.5 px-3 py-2 text-sm text-foreground/80 hover:text-foreground hover:bg-elevated rounded-lg transition-colors"
    >
      {label}
    </Link>
  );
}
