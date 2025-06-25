'use client';

import { HtmlBlock } from '@/types/blocks';
import { Code } from 'lucide-react';

interface HtmlBlockEditorProps {
  block: HtmlBlock;
  onUpdate: (updates: Partial<HtmlBlock>) => void;
}

export function HtmlBlockEditor({ block, onUpdate }: HtmlBlockEditorProps) {
  return (
    <div className="p-6">
      <div className="mb-3 flex items-center gap-2 text-sm text-gray-600">
        <Code className="w-4 h-4" />
        <span>Custom HTML Block</span>
      </div>
      
      <textarea
        value={block.content}
        onChange={(e) => onUpdate({ content: e.target.value })}
        className="w-full px-3 py-2 border border-gray-300 rounded-md font-mono text-sm focus:ring-2 focus:ring-blue-500"
        rows={10}
        placeholder="<!-- Enter your HTML here -->"
      />
      
      <p className="mt-2 text-xs text-gray-500">
        Note: Be careful with custom HTML. Make sure it's valid and safe for email clients.
      </p>
    </div>
  );
}