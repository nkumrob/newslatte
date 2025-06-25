'use client';

import { ContentBlock } from '@/types/blocks';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Trash2, Copy, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { TextBlockEditor } from './blocks/text-block-editor';
import { HeadingBlockEditor } from './blocks/heading-block-editor';
import { ImageBlockEditor } from './blocks/image-block-editor';
import { ButtonBlockEditor } from './blocks/button-block-editor';
import { DividerBlockEditor } from './blocks/divider-block-editor';
import { SpacerBlockEditor } from './blocks/spacer-block-editor';
import { ProductBlockEditor } from './blocks/product-block-editor';
import { SocialBlockEditor } from './blocks/social-block-editor';
import { VideoBlockEditor } from './blocks/video-block-editor';
import { QuoteBlockEditor } from './blocks/quote-block-editor';
import { HtmlBlockEditor } from './blocks/html-block-editor';
import { ColumnsBlockEditor } from './blocks/columns-block-editor';
import { AddBlockMenu } from './add-block-menu';
import { BlockType } from '@/types/blocks';
import { useState } from 'react';

interface BlockRendererProps {
  block: ContentBlock;
  onUpdate: (updates: Partial<ContentBlock>) => void;
  onDelete: () => void;
  onDuplicate: () => void;
  onAddBlock: (type: BlockType) => void;
}

export function BlockRenderer({ block, onUpdate, onDelete, onDuplicate, onAddBlock }: BlockRendererProps) {
  const [showAddMenu, setShowAddMenu] = useState(false);
  
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: block.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const renderBlockEditor = () => {
    switch (block.type) {
      case 'text':
        return <TextBlockEditor block={block} onUpdate={onUpdate} />;
      case 'heading':
        return <HeadingBlockEditor block={block} onUpdate={onUpdate} />;
      case 'image':
        return <ImageBlockEditor block={block} onUpdate={onUpdate} />;
      case 'button':
        return <ButtonBlockEditor block={block} onUpdate={onUpdate} />;
      case 'divider':
        return <DividerBlockEditor block={block} onUpdate={onUpdate} />;
      case 'spacer':
        return <SpacerBlockEditor block={block} onUpdate={onUpdate} />;
      case 'product':
        return <ProductBlockEditor block={block} onUpdate={onUpdate} />;
      case 'social':
        return <SocialBlockEditor block={block} onUpdate={onUpdate} />;
      case 'video':
        return <VideoBlockEditor block={block} onUpdate={onUpdate} />;
      case 'quote':
        return <QuoteBlockEditor block={block} onUpdate={onUpdate} />;
      case 'html':
        return <HtmlBlockEditor block={block} onUpdate={onUpdate} />;
      case 'columns':
        return <ColumnsBlockEditor block={block} onUpdate={onUpdate} />;
      default:
        return <div>Unknown block type</div>;
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "relative group",
        isDragging && "opacity-50"
      )}
    >
      {/* Block wrapper */}
      <div className="relative">
        {/* Drag handle and controls */}
        <div className="absolute -left-12 top-4 opacity-0 group-hover:opacity-100 transition-opacity">
          <div
            {...attributes}
            {...listeners}
            className="cursor-move p-2 hover:bg-gray-100 rounded"
          >
            <GripVertical className="w-5 h-5 text-gray-400" />
          </div>
        </div>

        {/* Block controls */}
        <div className="absolute -right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
          <div className="flex flex-col gap-1">
            <button
              onClick={onDuplicate}
              className="p-2 bg-white shadow-sm border border-gray-200 rounded hover:bg-gray-50"
              title="Duplicate block"
            >
              <Copy className="w-4 h-4 text-gray-600" />
            </button>
            <button
              onClick={onDelete}
              className="p-2 bg-white shadow-sm border border-gray-200 rounded hover:bg-red-50"
              title="Delete block"
            >
              <Trash2 className="w-4 h-4 text-red-600" />
            </button>
          </div>
        </div>

        {/* Block content */}
        <div className="bg-white border-2 border-transparent hover:border-blue-300 rounded-lg transition-all">
          {renderBlockEditor()}
        </div>

        {/* Add block button */}
        <div 
          className="absolute left-1/2 -bottom-5 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
          onMouseEnter={() => setShowAddMenu(true)}
          onMouseLeave={() => setShowAddMenu(false)}
        >
          {showAddMenu ? (
            <AddBlockMenu onAdd={onAddBlock} />
          ) : (
            <button className="p-1 bg-blue-600 text-white rounded-full hover:bg-blue-700">
              <Plus className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}