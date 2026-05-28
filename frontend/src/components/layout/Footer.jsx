import { Link } from 'react-router-dom';
import PageContainer from './PageContainer';

const quickLinks = [
  { label: 'Feed', to: '/explore' },
  { label: 'Share a story', to: '/create' },
  { label: 'Saved', to: '/saved' },
];

export default function Footer() {
  return (
    <footer className="bg-card/50 border-t border-line mt-auto">
      <PageContainer size="full" className="py-8 sm:py-10">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-8">
          <div className="max-w-sm">
            <Link to="/" className="inline-flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent to-violet flex items-center justify-center">
                <span className="text-white font-bold text-sm">V</span>
              </div>
              <span className="text-lg font-bold font-[Outfit] gradient-text">Velora</span>
            </Link>
            <p className="text-muted text-sm leading-relaxed">
              A cinematic social platform for travelers and storytellers. Share journeys,
              discover places, and connect with explorers worldwide.
            </p>
          </div>

          <div className="flex gap-12 sm:gap-16">
            <div>
              <h4 className="text-[11px] font-semibold text-foreground uppercase tracking-wider mb-3">
                Explore
              </h4>
              <ul className="space-y-2">
                {quickLinks.map((link) => (
                  <li key={link.to}>
                    <Link
                      to={link.to}
                      className="text-sm text-muted hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-[11px] font-semibold text-foreground uppercase tracking-wider mb-3">
                Community
              </h4>
              <ul className="space-y-2 text-sm text-faint">
                <li>Built for storytellers</li>
                <li>Real travel experiences</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="h-px bg-gradient-to-r from-transparent via-line-light to-transparent my-6" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-faint">
          <p>© {new Date().getFullYear()} Velora. All rights reserved.</p>
          <p>Made for travelers worldwide</p>
        </div>
      </PageContainer>
    </footer>
  );
}
