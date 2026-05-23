import PageTransition from '../components/layout/PageTransition';

export default function PostDetailPage() {
  return (
    <PageTransition>
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-bold font-[Outfit] mb-4">
            <span className="gradient-text">Experience</span>
          </h1>
          <p className="text-muted text-lg">Post detail view</p>
          <p className="text-faint text-sm mt-6">
            Full post detail page with image carousel, comments, and likes coming soon
          </p>
        </div>
      </div>
    </PageTransition>
  );
}
