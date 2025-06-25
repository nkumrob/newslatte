'use client';

import React, { useState } from 'react';
import { Newsletter } from '@/types/newsletter';
import { cn } from '@/lib/utils';
import { Monitor, Smartphone, Type, Download, Edit } from 'lucide-react';

interface NewsletterViewerProps {
  newsletter: Newsletter;
  onEdit?: () => void;
}

type ViewMode = 'desktop' | 'mobile' | 'text';

export function NewsletterViewer({ newsletter, onEdit }: NewsletterViewerProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('desktop');

  const getViewWidth = () => {
    switch (viewMode) {
      case 'mobile':
        return 'max-w-[375px]';
      case 'text':
        return 'max-w-2xl';
      default:
        return 'max-w-[600px]';
    }
  };

  const renderHeroSection = () => {
    const heroImages = newsletter.content.images.filter(img => img.type === 'hero');
    
    return (
      <div className="space-y-0">
        {heroImages.map((image, index) => (
          <div key={index} className="w-full">
            <img 
              src={image.url} 
              alt={image.alt || 'Hero image'} 
              className="w-full h-auto"
            />
          </div>
        ))}
      </div>
    );
  };

  const renderSection = (section: any, index: number) => {
    return (
      <div key={index} className="px-6 py-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
          {section.title}
        </h2>
        {section.description && (
          <p className="text-gray-600 mb-6">
            {section.description}
          </p>
        )}
        {section.cta && (
          <a 
            href={section.cta.url}
            className="inline-block bg-black text-white px-6 py-3 rounded-full text-sm font-medium hover:bg-gray-800 transition-colors"
          >
            {section.cta.text}
          </a>
        )}
      </div>
    );
  };

  const renderProductGrid = () => {
    const products = newsletter.content.products;
    if (!products || products.length === 0) return null;

    return (
      <div className="px-6 py-8">
        <div className="grid grid-cols-2 gap-4">
          {products.map((product, index) => (
            <div key={index} className="text-center">
              <img 
                src={product.image} 
                alt={product.name}
                className="w-full h-auto mb-2"
              />
              <p className="text-sm font-medium text-gray-700">
                {product.name}
              </p>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderTextOnly = () => {
    return (
      <div className="prose prose-gray max-w-none p-8">
        <h1>{newsletter.metadata.title}</h1>
        <p className="lead">{newsletter.metadata.subtitle}</p>
        
        {newsletter.content.sections.map((section, index) => (
          <div key={index} className="my-6">
            <h2>{section.title}</h2>
            {section.description && <p>{section.description}</p>}
            {section.cta && (
              <p>
                <a href={section.cta.url}>
                  {section.cta.text} →
                </a>
              </p>
            )}
          </div>
        ))}
        
        {newsletter.content.products.length > 0 && (
          <div className="my-6">
            <h3>Products:</h3>
            <ul>
              {newsletter.content.products.map((product, index) => (
                <li key={index}>{product.name}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-lg font-semibold text-gray-900">
                {newsletter.metadata.brand} Newsletter
              </h1>
              <span className="text-sm text-gray-500">
                {new Date(newsletter.metadata.date_sent).toLocaleDateString()}
              </span>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* View Mode Selector */}
              <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('desktop')}
                  className={cn(
                    "p-2 rounded",
                    viewMode === 'desktop' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'
                  )}
                  title="Desktop view"
                >
                  <Monitor className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('mobile')}
                  className={cn(
                    "p-2 rounded",
                    viewMode === 'mobile' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'
                  )}
                  title="Mobile view"
                >
                  <Smartphone className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('text')}
                  className={cn(
                    "p-2 rounded",
                    viewMode === 'text' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'
                  )}
                  title="Text view"
                >
                  <Type className="w-4 h-4" />
                </button>
              </div>

              {/* Actions */}
              <div className="flex items-center space-x-2">
                <button className="p-2 hover:bg-gray-100 rounded">
                  <Download className="w-4 h-4" />
                </button>
                {onEdit && (
                  <button 
                    onClick={onEdit}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                    <span>Remix</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Newsletter Content */}
      <div className="py-8">
        <div className={cn("mx-auto bg-white shadow-lg", getViewWidth())}>
          {viewMode === 'text' ? (
            renderTextOnly()
          ) : (
            <>
              {/* Email Header */}
              <div className="border-b border-gray-200 p-4">
                <div className="text-xs text-gray-500">From: {newsletter.metadata.brand}</div>
                <div className="text-xs text-gray-500">Subject: {newsletter.metadata.title}</div>
              </div>

              {/* Email Body */}
              <div>
                {renderHeroSection()}
                
                {newsletter.content.sections.map((section, index) => 
                  renderSection(section, index)
                )}
                
                {renderProductGrid()}
                
                {/* Footer */}
                <div className="px-6 py-8 bg-gray-50 text-center">
                  <div className="text-xs text-gray-500 space-y-2">
                    <p>© {new Date().getFullYear()} {newsletter.metadata.brand}</p>
                    <div className="space-x-4">
                      <a href="#" className="hover:underline">Privacy Policy</a>
                      <a href="#" className="hover:underline">Unsubscribe</a>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Metadata Panel */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Newsletter Analytics</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div>
              <div className="text-2xl font-semibold text-gray-900">
                {newsletter.summary.total_images}
              </div>
              <div className="text-sm text-gray-500">Images</div>
            </div>
            <div>
              <div className="text-2xl font-semibold text-gray-900">
                {newsletter.summary.total_links}
              </div>
              <div className="text-sm text-gray-500">Links</div>
            </div>
            <div>
              <div className="text-2xl font-semibold text-gray-900">
                {newsletter.summary.total_products}
              </div>
              <div className="text-sm text-gray-500">Products</div>
            </div>
            <div>
              <div className="text-2xl font-semibold text-gray-900">
                {newsletter.summary.total_ctas}
              </div>
              <div className="text-sm text-gray-500">CTAs</div>
            </div>
            <div>
              <div className="text-2xl font-semibold text-gray-900">
                {newsletter.summary.total_sections}
              </div>
              <div className="text-sm text-gray-500">Sections</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}