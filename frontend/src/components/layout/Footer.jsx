import { Link } from 'react-router-dom';

const footerLinks = {
  explore: [
    { label: 'Adventure', to: '/explore?category=adventure' },
    { label: 'Nature', to: '/explore?category=nature' },
    { label: 'Hidden Gems', to: '/explore?category=hidden-gems' },
    { label: 'Cultural', to: '/explore?category=cultural-experience' },
    { label: 'Food', to: '/explore?category=food-experience' },
  ],
  categories: [
    { label: 'Solo Travel', to: '/explore?category=solo-travel' },
    { label: 'Nightlife', to: '/explore?category=nightlife' },
    { label: 'Spiritual', to: '/explore?category=spiritual' },
    { label: 'Budget Travel', to: '/explore?category=budget-travel' },
    { label: 'Peaceful', to: '/explore?category=peaceful' },
  ],
  company: [
    { label: 'About Velora', to: '#' },
    { label: 'Community', to: '#' },
    { label: 'Privacy Policy', to: '#' },
    { label: 'Terms of Use', to: '#' },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-card border-t border-line mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ─── Main Footer Grid ─── */}
        <div className="py-16 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-10 lg:gap-12">

          {/* Brand Column */}
          <div className="col-span-2 md:col-span-4 lg:col-span-2">
            <Link to="/" className="inline-flex items-center gap-2.5 mb-5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-accent to-violet flex items-center justify-center shadow-lg shadow-accent/20">
                <span className="text-white font-bold text-lg">V</span>
              </div>
              <span className="text-xl font-bold tracking-tight font-[Outfit] gradient-text">
                Velora
              </span>
            </Link>
            <p className="text-muted text-sm leading-relaxed max-w-sm">
              Discover the world through real travel experiences. Share your
              journeys, explore hidden gems, and connect with fellow travelers
              across the globe.
            </p>
            <div className="mt-6 flex items-center gap-3">
              <SocialIcon label="Twitter" path="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              <SocialIcon label="Instagram" path="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
              <SocialIcon label="GitHub" path="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
            </div>
          </div>

          {/* Explore Column */}
          <div>
            <h4 className="text-xs font-semibold text-foreground uppercase tracking-widest mb-5">
              Explore
            </h4>
            <ul className="space-y-3">
              {footerLinks.explore.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="text-sm text-muted hover:text-foreground transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories Column */}
          <div>
            <h4 className="text-xs font-semibold text-foreground uppercase tracking-widest mb-5">
              Categories
            </h4>
            <ul className="space-y-3">
              {footerLinks.categories.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="text-sm text-muted hover:text-foreground transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Column */}
          <div>
            <h4 className="text-xs font-semibold text-foreground uppercase tracking-widest mb-5">
              Company
            </h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="text-sm text-muted hover:text-foreground transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ─── Gradient Divider ─── */}
        <div className="h-px bg-gradient-to-r from-transparent via-line-light to-transparent" />

        {/* ─── Bottom Bar ─── */}
        <div className="py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-faint">
            © {new Date().getFullYear()} Velora. All rights reserved.
          </p>
          <p className="text-xs text-faint">
            Made with passion for travelers worldwide ✈️
          </p>
        </div>
      </div>
    </footer>
  );
}

function SocialIcon({ label, path }) {
  return (
    <a
      href="#"
      aria-label={label}
      className="w-9 h-9 rounded-xl bg-elevated border border-line hover:border-accent/50 flex items-center justify-center text-muted hover:text-foreground transition-all duration-200 hover:scale-105"
    >
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d={path} />
      </svg>
    </a>
  );
}
