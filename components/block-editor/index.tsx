'use client';

import { useState } from 'react';
import { ContentBlock, BlockType } from '@/types/blocks';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { BlockRenderer } from './block-renderer';
import { AddBlockMenu } from './add-block-menu';
import { v4 as uuidv4 } from 'uuid';

interface BlockEditorProps {
  blocks: ContentBlock[];
  onChange: (blocks: ContentBlock[]) => void;
}

export function BlockEditor({ blocks, onChange }: BlockEditorProps) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = blocks.findIndex((block) => block.id === active.id);
      const newIndex = blocks.findIndex((block) => block.id === over.id);
      
      const newBlocks = arrayMove(blocks, oldIndex, newIndex);
      // Update order numbers
      const updatedBlocks = newBlocks.map((block, index) => ({
        ...block,
        order: index
      }));
      
      onChange(updatedBlocks);
    }
  };

  const addBlock = (type: BlockType, afterBlockId?: string) => {
    const newBlock = createBlock(type);
    
    if (afterBlockId) {
      const index = blocks.findIndex(b => b.id === afterBlockId);
      const newBlocks = [...blocks];
      newBlocks.splice(index + 1, 0, newBlock);
      // Update order numbers
      const updatedBlocks = newBlocks.map((block, index) => ({
        ...block,
        order: index
      }));
      onChange(updatedBlocks);
    } else {
      onChange([...blocks, { ...newBlock, order: blocks.length }]);
    }
  };

  const updateBlock = (blockId: string, updates: Partial<ContentBlock>) => {
    onChange(blocks.map(block => 
      block.id === blockId ? { ...block, ...updates } : block
    ));
  };

  const deleteBlock = (blockId: string) => {
    const newBlocks = blocks.filter(block => block.id !== blockId);
    // Update order numbers
    const updatedBlocks = newBlocks.map((block, index) => ({
      ...block,
      order: index
    }));
    onChange(updatedBlocks);
  };

  const duplicateBlock = (blockId: string) => {
    const blockIndex = blocks.findIndex(b => b.id === blockId);
    const blockToDuplicate = blocks[blockIndex];
    const newBlock = {
      ...blockToDuplicate,
      id: uuidv4(),
      order: blockIndex + 1
    };
    
    const newBlocks = [...blocks];
    newBlocks.splice(blockIndex + 1, 0, newBlock);
    // Update order numbers
    const updatedBlocks = newBlocks.map((block, index) => ({
      ...block,
      order: index
    }));
    onChange(updatedBlocks);
  };

  return (
    <div className="space-y-4">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={blocks.map(b => b.id)}
          strategy={verticalListSortingStrategy}
        >
          {blocks.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
              <p className="text-gray-500 mb-4">No blocks yet. Add your first block to get started.</p>
              <AddBlockMenu onAdd={(type) => addBlock(type)} />
            </div>
          ) : (
            <div className="space-y-4">
              {blocks.map((block) => (
                <BlockRenderer
                  key={block.id}
                  block={block}
                  onUpdate={(updates) => updateBlock(block.id, updates)}
                  onDelete={() => deleteBlock(block.id)}
                  onDuplicate={() => duplicateBlock(block.id)}
                  onAddBlock={(type) => addBlock(type, block.id)}
                />
              ))}
            </div>
          )}
        </SortableContext>
      </DndContext>
      
      {blocks.length > 0 && (
        <div className="flex justify-center pt-4">
          <AddBlockMenu onAdd={(type) => addBlock(type)} />
        </div>
      )}
    </div>
  );
}

function createBlock(type: BlockType): ContentBlock {
  const baseBlock = {
    id: uuidv4(),
    order: 0
  };

  switch (type) {
    case 'text':
      return {
        ...baseBlock,
        type: 'text',
        content: '<p>Enter your text here...</p>',
        style: {
          fontSize: '16px',
          color: '#333333',
          textAlign: 'left'
        }
      };
    
    case 'heading':
      return {
        ...baseBlock,
        type: 'heading',
        content: 'Heading',
        level: 2,
        style: {
          fontSize: '24px',
          color: '#111111',
          textAlign: 'left'
        }
      };
    
    case 'image':
      return {
        ...baseBlock,
        type: 'image',
        src: '',
        alt: '',
        style: {
          maxWidth: '100%',
          alignment: 'center'
        }
      };
    
    case 'button':
      return {
        ...baseBlock,
        type: 'button',
        text: 'Click Here',
        url: '#',
        style: {
          backgroundColor: '#000000',
          textColor: '#ffffff',
          borderRadius: '24px',
          fontSize: '16px',
          padding: '12px 24px',
          alignment: 'center'
        }
      };
    
    case 'divider':
      return {
        ...baseBlock,
        type: 'divider',
        style: {
          borderColor: '#e5e5e5',
          borderWidth: '1px',
          borderStyle: 'solid',
          margin: '32px 0'
        }
      };
    
    case 'spacer':
      return {
        ...baseBlock,
        type: 'spacer',
        height: '32px'
      };
    
    case 'columns':
      return {
        ...baseBlock,
        type: 'columns',
        columns: [
          { blocks: [], width: '50%' },
          { blocks: [], width: '50%' }
        ],
        style: {
          gap: '24px',
          stackOnMobile: true
        }
      };
    
    case 'product':
      return {
        ...baseBlock,
        type: 'product',
        name: 'Product Name',
        image: '',
        description: 'Product description',
        price: '$99.99',
        link: '#',
        style: {
          layout: 'vertical',
          backgroundColor: '#f9f9f9',
          borderRadius: '8px',
          padding: '16px'
        }
      };
    
    case 'social':
      return {
        ...baseBlock,
        type: 'social',
        networks: [
          { platform: 'facebook', url: '#' },
          { platform: 'twitter', url: '#' },
          { platform: 'instagram', url: '#' }
        ],
        style: {
          iconSize: '32px',
          iconColor: '#333333',
          alignment: 'center',
          spacing: '16px'
        }
      };
    
    case 'video':
      return {
        ...baseBlock,
        type: 'video',
        url: '',
        thumbnail: '',
        style: {
          aspectRatio: '16:9',
          borderRadius: '8px'
        }
      };
    
    case 'quote':
      return {
        ...baseBlock,
        type: 'quote',
        content: 'Your quote here...',
        author: 'Author Name',
        style: {
          fontSize: '18px',
          fontStyle: 'italic',
          color: '#555555',
          borderLeftColor: '#000000',
          backgroundColor: '#f5f5f5',
          padding: '24px'
        }
      };
    
    case 'html':
      return {
        ...baseBlock,
        type: 'html',
        content: '<!-- Custom HTML -->'
      };
    
    default:
      throw new Error(`Unknown block type: ${type}`);
  }
}