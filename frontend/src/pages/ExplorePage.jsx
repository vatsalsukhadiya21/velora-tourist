import PageTransition from '../components/layout/PageTransition';

export default function ExplorePage() {
  return (
    <PageTransition>
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-bold font-[Outfit] mb-4">
            <span className="gradient-text">Explore</span>
          </h1>
          <p className="text-muted text-lg">
            Discover travel experiences from around the world
          </p>
          <p className="text-faint text-sm mt-6">
            Full explore page with masonry grid coming soon
          </p>
        </div>
      </div>
    </PageTransition>
  );
}
