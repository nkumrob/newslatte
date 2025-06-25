'use client';

import { ProductBlock } from '@/types/blocks';
import { Image as ImageIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProductBlockEditorProps {
  block: ProductBlock;
  onUpdate: (updates: Partial<ProductBlock>) => void;
}

export function ProductBlockEditor({ block, onUpdate }: ProductBlockEditorProps) {
  const isHorizontal = block.style?.layout === 'horizontal';
  const imagePosition = block.style?.imagePosition || 'top';

  return (
    <div className="p-6">
      {/* Product preview */}
      <div
        className={cn(
          "rounded-lg overflow-hidden",
          isHorizontal && "flex",
          imagePosition === 'right' && "flex-row-reverse"
        )}
        style={{
          backgroundColor: block.style?.backgroundColor || '#f9f9f9',
          padding: block.style?.padding || '16px'
        }}
      >
        <div className={cn(
          isHorizontal ? "w-1/3" : "w-full",
          "flex-shrink-0"
        )}>
          {block.image ? (
            <img
              src={block.image}
              alt={block.name}
              className="w-full h-auto rounded-lg"
            />
          ) : (
            <div className="bg-gray-200 rounded-lg flex items-center justify-center" style={{ aspectRatio: '1' }}>
              <ImageIcon className="w-12 h-12 text-gray-400" />
            </div>
          )}
        </div>
        
        <div className={cn(
          isHorizontal ? "flex-1 pl-4" : "mt-4"
        )}>
          <h3 className="text-lg font-semibold mb-2">{block.name}</h3>
          {block.description && (
            <p className="text-gray-600 mb-2">{block.description}</p>
          )}
          {block.price && (
            <p className="text-xl font-bold mb-3">{block.price}</p>
          )}
          <a
            href={block.link}
            className="inline-block bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800"
          >
            View Product
          </a>
        </div>
      </div>

      {/* Product settings */}
      <div className="mt-6 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
            <input
              type="text"
              value={block.name}
              onChange={(e) => onUpdate({ name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
            <input
              type="text"
              value={block.price || ''}
              onChange={(e) => onUpdate({ price: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              placeholder="$99.99"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea
            value={block.description || ''}
            onChange={(e) => onUpdate({ description: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            rows={2}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
            <input
              type="url"
              value={block.image}
              onChange={(e) => onUpdate({ image: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              placeholder="https://example.com/product.jpg"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Product Link</label>
            <input
              type="url"
              value={block.link}
              onChange={(e) => onUpdate({ link: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              placeholder="https://example.com/product"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Layout</label>
            <select
              value={block.style?.layout || 'vertical'}
              onChange={(e) => onUpdate({ 
                style: { ...block.style, layout: e.target.value as any } 
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="vertical">Vertical</option>
              <option value="horizontal">Horizontal</option>
            </select>
          </div>
          
          {isHorizontal && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Image Position</label>
              <select
                value={block.style?.imagePosition || 'left'}
                onChange={(e) => onUpdate({ 
                  style: { ...block.style, imagePosition: e.target.value as any } 
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="left">Left</option>
                <option value="right">Right</option>
              </select>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}