'use client';

import { HeadingBlock } from '@/types/blocks';
import { cn } from '@/lib/utils';

interface HeadingBlockEditorProps {
  block: HeadingBlock;
  onUpdate: (updates: Partial<HeadingBlock>) => void;
}

export function HeadingBlockEditor({ block, onUpdate }: HeadingBlockEditorProps) {
  const headingClass = {
    1: 'text-4xl',
    2: 'text-3xl',
    3: 'text-2xl',
    4: 'text-xl',
    5: 'text-lg',
    6: 'text-base'
  };

  return (
    <div className="p-6">
      <div className="flex items-center gap-4 mb-4">
        <label className="text-sm font-medium text-gray-700">Level:</label>
        <select
          value={block.level}
          onChange={(e) => onUpdate({ level: Number(e.target.value) as any })}
          className="px-3 py-1 border border-gray-300 rounded-md text-sm"
        >
          {[1, 2, 3, 4, 5, 6].map((level) => (
            <option key={level} value={level}>
              H{level}
            </option>
          ))}
        </select>
        
        <label className="text-sm font-medium text-gray-700">Align:</label>
        <select
          value={block.style?.textAlign || 'left'}
          onChange={(e) => onUpdate({ 
            style: { ...block.style, textAlign: e.target.value as any } 
          })}
          className="px-3 py-1 border border-gray-300 rounded-md text-sm"
        >
          <option value="left">Left</option>
          <option value="center">Center</option>
          <option value="right">Right</option>
        </select>
      </div>
      
      <input
        type="text"
        value={block.content}
        onChange={(e) => onUpdate({ content: e.target.value })}
        className={cn(
          "w-full font-bold bg-transparent border-b-2 border-transparent hover:border-gray-300 focus:border-blue-500 focus:outline-none transition-colors",
          headingClass[block.level],
          block.style?.textAlign === 'center' && 'text-center',
          block.style?.textAlign === 'right' && 'text-right'
        )}
        placeholder={`Heading ${block.level}`}
      />
    </div>
  );
}