'use client';

import { VideoBlock } from '@/types/blocks';
import { Play, Video } from 'lucide-react';

interface VideoBlockEditorProps {
  block: VideoBlock;
  onUpdate: (updates: Partial<VideoBlock>) => void;
}

export function VideoBlockEditor({ block, onUpdate }: VideoBlockEditorProps) {
  return (
    <div className="p-6">
      {/* Video preview */}
      {block.thumbnail ? (
        <div className="relative rounded-lg overflow-hidden" style={{ borderRadius: block.style?.borderRadius }}>
          <img src={block.thumbnail} alt="Video thumbnail" className="w-full h-auto" />
          <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
            <div className="bg-white rounded-full p-4">
              <Play className="w-8 h-8 text-gray-900 ml-1" fill="currentColor" />
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-gray-100 rounded-lg flex items-center justify-center py-24">
          <div className="text-center">
            <Video className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600">Add video thumbnail</p>
          </div>
        </div>
      )}

      {/* Video settings */}
      <div className="mt-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Video URL</label>
          <input
            type="url"
            value={block.url}
            onChange={(e) => onUpdate({ url: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            placeholder="https://youtube.com/watch?v=..."
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Thumbnail Image URL</label>
          <input
            type="url"
            value={block.thumbnail}
            onChange={(e) => onUpdate({ thumbnail: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            placeholder="https://example.com/thumbnail.jpg"
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Platform</label>
            <select
              value={block.platform || 'youtube'}
              onChange={(e) => onUpdate({ platform: e.target.value as any })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="youtube">YouTube</option>
              <option value="vimeo">Vimeo</option>
              <option value="custom">Custom</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Aspect Ratio</label>
            <select
              value={block.style?.aspectRatio || '16:9'}
              onChange={(e) => onUpdate({ 
                style: { ...block.style, aspectRatio: e.target.value } 
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="16:9">16:9</option>
              <option value="4:3">4:3</option>
              <option value="1:1">1:1 (Square)</option>
              <option value="9:16">9:16 (Vertical)</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}