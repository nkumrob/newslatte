'use client';

import { TextBlock } from '@/types/blocks';
import { RichTextEditor } from '@/components/rich-text-editor';

interface TextBlockEditorProps {
  block: TextBlock;
  onUpdate: (updates: Partial<TextBlock>) => void;
}

export function TextBlockEditor({ block, onUpdate }: TextBlockEditorProps) {
  return (
    <div className="p-6">
      <RichTextEditor
        content={block.content}
        onChange={(content) => onUpdate({ content })}
        placeholder="Enter your text..."
      />
    </div>
  );
}