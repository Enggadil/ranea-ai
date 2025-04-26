'use client';

export default function DemoPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8 bg-gray-100 text-center">
      <h2 className="text-4xl font-bold mb-6">Watch Ranea Demo</h2>
      <div className="w-full max-w-3xl aspect-video shadow-lg rounded-lg overflow-hidden">
        <iframe
          className="w-full h-full"
          src="https://www.youtube.com/embed/YOUR_VIDEO_ID"
          title="Ranea Demo Video"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    </main>
  );
}
