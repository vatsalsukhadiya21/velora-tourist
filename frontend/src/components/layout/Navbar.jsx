import { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bars3Icon,
  XMarkIcon,
  BookmarkIcon,
  PlusCircleIcon,
  ArrowRightStartOnRectangleIcon,
} from '@heroicons/react/24/outline';
import { useAuth } from '../../hooks/useAuth';
import MobileMenu from './MobileMenu';
import Avatar from '../ui/Avatar';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { user, isAuthenticated, logout } = useAuth();
  const location = useLocation();

  // Scroll detection for glassmorphism background
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setMobileOpen(false);
    setDropdownOpen(false);
  }, [location.pathname]);

  // Close dropdown on outside click
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

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 120, damping: 20 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'bg-surface/80 backdrop-blur-2xl border-b border-line shadow-lg shadow-black/20'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">

            {/* ─── Logo ─── */}
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-accent to-violet flex items-center justify-center shadow-lg shadow-accent/20 group-hover:shadow-accent/40 transition-shadow">
                <span className="text-white font-bold text-lg">V</span>
              </div>
              <span className="text-xl font-bold tracking-tight font-[Outfit]">
                <span className="gradient-text">Velora</span>
              </span>
            </Link>

            {/* ─── Desktop Navigation ─── */}
            <nav className="hidden md:flex items-center gap-1">
              <DesktopNavLink to="/explore" label="Explore" />
            </nav>

            {/* ─── Desktop Right Side ─── */}
            <div className="hidden md:flex items-center gap-3">
              {isAuthenticated ? (
                <>
                  {/* Share Button */}
                  <Link
                    to="/create"
                    className="btn-secondary flex items-center gap-2 text-sm !py-2 !px-4"
                  >
                    <PlusCircleIcon className="w-4 h-4" />
                    Share
                  </Link>

                  {/* Saved Link */}
                  <Link
                    to="/saved"
                    className="p-2.5 rounded-xl hover:bg-elevated transition-colors text-muted hover:text-foreground"
                  >
                    <BookmarkIcon className="w-5 h-5" />
                  </Link>

                  {/* ─── User Dropdown ─── */}
                  <div className="relative" ref={dropdownRef}>
                    <button
                      onClick={() => setDropdownOpen(!dropdownOpen)}
                      className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-elevated transition-colors"
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
                          className="absolute right-0 top-14 w-60 bg-card border border-line-light rounded-2xl shadow-2xl shadow-black/50 overflow-hidden"
                        >
                          {/* User Info */}
                          <div className="p-4 border-b border-line">
                            <p className="text-sm font-semibold text-foreground truncate">
                              {user?.displayName || user?.username}
                            </p>
                            <p className="text-xs text-muted truncate mt-0.5">
                              @{user?.username}
                            </p>
                          </div>

                          {/* Links */}
                          <div className="p-2">
                            <DropdownLink to={`/profile/${user?.id}`} label="My Profile" />
                            <DropdownLink to="/saved" label="Saved Experiences" />
                          </div>

                          {/* Logout */}
                          <div className="p-2 border-t border-line">
                            <button
                              onClick={logout}
                              className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-rose hover:bg-rose/10 rounded-xl transition-colors"
                            >
                              <ArrowRightStartOnRectangleIcon className="w-4 h-4" />
                              Sign Out
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="text-sm font-medium text-muted hover:text-foreground transition-colors px-4 py-2"
                  >
                    Sign In
                  </Link>
                  <Link to="/register" className="btn-primary text-sm !py-2.5 !px-5">
                    Join Velora
                  </Link>
                </>
              )}
            </div>

            {/* ─── Mobile Hamburger ─── */}
            <button
              className="md:hidden p-2 rounded-xl hover:bg-elevated transition-colors text-muted"
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
        </div>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && <MobileMenu onClose={() => setMobileOpen(false)} />}
      </AnimatePresence>
    </>
  );
}

/* ─── Sub-Components ─── */

function DesktopNavLink({ to, label }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `relative px-4 py-2 text-sm font-medium rounded-xl transition-all duration-200 ${
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
      className="flex items-center gap-3 px-3 py-2.5 text-sm text-foreground/80 hover:text-foreground hover:bg-elevated rounded-xl transition-colors"
    >
      {label}
    </Link>
  );
}

