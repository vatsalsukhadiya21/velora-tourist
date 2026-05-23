import PageTransition from '../components/layout/PageTransition';

export default function SavedPage() {
  return (
    <PageTransition>
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-bold font-[Outfit] mb-4">
            <span className="gradient-text">Saved</span>
          </h1>
          <p className="text-muted text-lg">Your bookmarked experiences</p>
          <p className="text-faint text-sm mt-6">
            Full saved experiences page coming soon
          </p>
        </div>
      </div>
    </PageTransition>
  );
}
