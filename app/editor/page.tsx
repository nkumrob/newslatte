'use client';

import { useEffect, useState } from 'react';
import { NewsletterEditor } from '@/components/newsletter-editor';
import { Newsletter } from '@/types/newsletter';
import { useRouter } from 'next/navigation';

export default function EditorPage() {
  const [newsletter, setNewsletter] = useState<Newsletter | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

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

  const handleSave = (updatedNewsletter: Newsletter) => {
    // In a real app, this would save to a database
    console.log('Saving newsletter:', updatedNewsletter);
    
    // For now, just download as JSON
    const dataStr = JSON.stringify(updatedNewsletter, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `newsletter-remix-${Date.now()}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    // Show success message
    alert('Newsletter saved! Downloaded as JSON file.');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading editor...</p>
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
    <NewsletterEditor 
      initialNewsletter={newsletter} 
      onSave={handleSave}
    />
  );
}