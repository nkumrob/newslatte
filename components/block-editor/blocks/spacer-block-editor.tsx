'use client';

import { SpacerBlock } from '@/types/blocks';

interface SpacerBlockEditorProps {
  block: SpacerBlock;
  onUpdate: (updates: Partial<SpacerBlock>) => void;
}

export function SpacerBlockEditor({ block, onUpdate }: SpacerBlockEditorProps) {
  const presets = ['8px', '16px', '24px', '32px', '48px', '64px'];
  
  return (
    <div className="p-6">
      {/* Spacer visualization */}
      <div 
        className="bg-blue-50 border-2 border-dashed border-blue-300 rounded flex items-center justify-center text-blue-600 text-sm font-medium"
        style={{ height: block.height }}
      >
        {block.height}
      </div>

      {/* Height settings */}
      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Height</label>
        <div className="flex gap-2 mb-3">
          {presets.map((height) => (
            <button
              key={height}
              onClick={() => onUpdate({ height })}
              className={`px-3 py-1 rounded-md text-sm ${
                block.height === height
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {height}
            </button>
          ))}
        </div>
        <input
          type="text"
          value={block.height}
          onChange={(e) => onUpdate({ height: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          placeholder="e.g., 32px, 2rem, 5vh"
        />
      </div>
    </div>
  );
}