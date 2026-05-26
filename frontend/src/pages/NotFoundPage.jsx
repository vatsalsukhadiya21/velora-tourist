import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPinIcon } from '@heroicons/react/24/outline';
import PageTransition from '../components/layout/PageTransition';

export default function NotFoundPage() {
  return (
    <PageTransition>
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-lg"
        >
          <div className="w-20 h-20 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center mx-auto mb-8">
            <MapPinIcon className="w-9 h-9 text-accent" />
          </div>

          <h1 className="text-5xl sm:text-6xl font-bold font-[Outfit] gradient-text mb-4">
            404
          </h1>
          <h2 className="text-xl sm:text-2xl font-bold font-[Outfit] text-foreground mb-3">
            Page not found
          </h2>
          <p className="text-muted text-base leading-relaxed mb-10">
            The page you&apos;re looking for doesn&apos;t exist or may have been moved. 
            Let&apos;s get you back on track.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/explore" className="btn-primary text-base px-8 py-3">
              Explore Experiences
            </Link>
            <Link to="/" className="btn-secondary text-base px-8 py-3">
              Back to Home
            </Link>
          </div>
        </motion.div>
      </div>
    </PageTransition>
  );
}
