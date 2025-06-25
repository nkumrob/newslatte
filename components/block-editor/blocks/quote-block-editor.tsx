'use client';

import { QuoteBlock } from '@/types/blocks';

interface QuoteBlockEditorProps {
  block: QuoteBlock;
  onUpdate: (updates: Partial<QuoteBlock>) => void;
}

export function QuoteBlockEditor({ block, onUpdate }: QuoteBlockEditorProps) {
  return (
    <div className="p-6">
      {/* Quote preview */}
      <blockquote
        className="border-l-4 pl-4"
        style={{
          borderLeftColor: block.style?.borderLeftColor || '#000000',
          backgroundColor: block.style?.backgroundColor || '#f5f5f5',
          padding: block.style?.padding || '24px',
          fontSize: block.style?.fontSize || '18px',
          fontStyle: block.style?.fontStyle || 'italic',
          color: block.style?.color || '#555555'
        }}
      >
        <p className="mb-2">{block.content}</p>
        {block.author && (
          <footer className="text-sm mt-4">— {block.author}</footer>
        )}
      </blockquote>

      {/* Quote settings */}
      <div className="mt-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Quote Text</label>
          <textarea
            value={block.content}
            onChange={(e) => onUpdate({ content: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            rows={3}
            placeholder="Enter your quote here..."
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Author (optional)</label>
          <input
            type="text"
            value={block.author || ''}
            onChange={(e) => onUpdate({ author: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            placeholder="John Doe"
          />
        </div>
      </div>
    </div>
  );
}