import PageTransition from '../components/layout/PageTransition';

export default function CreatePostPage() {
  return (
    <PageTransition>
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-bold font-[Outfit] mb-4">
            <span className="gradient-text">Share</span>
          </h1>
          <p className="text-muted text-lg">Share your travel experience</p>
          <p className="text-faint text-sm mt-6">
            Full create post form with image upload coming soon
          </p>
        </div>
      </div>
    </PageTransition>
  );
}
