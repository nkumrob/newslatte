'use client';

import { ImageBlock } from '@/types/blocks';
import { Image as ImageIcon, Upload, Link } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface ImageBlockEditorProps {
  block: ImageBlock;
  onUpdate: (updates: Partial<ImageBlock>) => void;
}

export function ImageBlockEditor({ block, onUpdate }: ImageBlockEditorProps) {
  const [showSettings, setShowSettings] = useState(!block.src);

  const handleImageUrl = (url: string) => {
    onUpdate({ src: url });
    if (url) setShowSettings(false);
  };

  return (
    <div className="p-6">
      {block.src ? (
        <div>
          <div className={cn(
            "relative group",
            block.style?.alignment === 'center' && 'mx-auto',
            block.style?.alignment === 'right' && 'ml-auto'
          )} style={{ maxWidth: block.style?.maxWidth || '100%' }}>
            <img
              src={block.src}
              alt={block.alt}
              className="w-full h-auto rounded-lg"
              style={{ borderRadius: block.style?.borderRadius }}
            />
            <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
              <button
                onClick={() => setShowSettings(true)}
                className="px-4 py-2 bg-white text-gray-800 rounded-md hover:bg-gray-100"
              >
                Change Image
              </button>
            </div>
          </div>
          
          {/* Image settings */}
          {showSettings && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                <input
                  type="url"
                  value={block.src}
                  onChange={(e) => handleImageUrl(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Alt Text</label>
                <input
                  type="text"
                  value={block.alt}
                  onChange={(e) => onUpdate({ alt: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  placeholder="Describe the image"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Link URL (optional)</label>
                <input
                  type="url"
                  value={block.link || ''}
                  onChange={(e) => onUpdate({ link: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  placeholder="https://example.com"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Alignment</label>
                  <select
                    value={block.style?.alignment || 'center'}
                    onChange={(e) => onUpdate({ 
                      style: { ...block.style, alignment: e.target.value as any } 
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="left">Left</option>
                    <option value="center">Center</option>
                    <option value="right">Right</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Max Width</label>
                  <input
                    type="text"
                    value={block.style?.maxWidth || '100%'}
                    onChange={(e) => onUpdate({ 
                      style: { ...block.style, maxWidth: e.target.value } 
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="100% or 600px"
                  />
                </div>
              </div>
              
              <button
                onClick={() => setShowSettings(false)}
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                Hide Settings
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 mb-4">Add an image to your newsletter</p>
          <div className="space-y-3">
            <input
              type="url"
              value={block.src}
              onChange={(e) => handleImageUrl(e.target.value)}
              className="w-full max-w-md mx-auto px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              placeholder="Enter image URL"
            />
            <p className="text-sm text-gray-500">or</p>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
              <Upload className="w-4 h-4 inline mr-2" />
              Upload Image
            </button>
          </div>
        </div>
      )}
    </div>
  );
}