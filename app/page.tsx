'use client';

import { useEffect, useState } from 'react';
import { NewsletterViewer } from '@/components/newsletter-viewer';
import { Newsletter } from '@/types/newsletter';

export default function Home() {
  const [newsletter, setNewsletter] = useState<Newsletter | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load sample newsletter data
    fetch('/sample-newsletter.json')
      .then(res => res.json())
      .then(data => {
        setNewsletter(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load newsletter:', err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading newsletter...</p>
        </div>
      </div>
    );
  }

  if (!newsletter) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">Failed to load newsletter</p>
        </div>
      </div>
    );
  }

  return (
    <NewsletterViewer 
      newsletter={newsletter} 
      onEdit={() => window.location.href = '/editor-v2'}
    />
  );
}
