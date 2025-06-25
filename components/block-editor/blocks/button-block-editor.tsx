'use client';

import { ButtonBlock } from '@/types/blocks';
import { HexColorPicker } from 'react-colorful';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Palette } from 'lucide-react';

interface ButtonBlockEditorProps {
  block: ButtonBlock;
  onUpdate: (updates: Partial<ButtonBlock>) => void;
}

export function ButtonBlockEditor({ block, onUpdate }: ButtonBlockEditorProps) {
  const [showBgColorPicker, setShowBgColorPicker] = useState(false);
  const [showTextColorPicker, setShowTextColorPicker] = useState(false);

  const buttonStyle = {
    backgroundColor: block.style?.backgroundColor || '#000000',
    color: block.style?.textColor || '#ffffff',
    borderRadius: block.style?.borderRadius || '24px',
    fontSize: block.style?.fontSize || '16px',
    fontWeight: block.style?.fontWeight || 'normal',
    padding: block.style?.padding || '12px 24px',
    width: block.style?.width === 'full' ? '100%' : 'auto'
  };

  return (
    <div className="p-6">
      {/* Button preview */}
      <div className={cn(
        "mb-6",
        block.style?.alignment === 'center' && 'text-center',
        block.style?.alignment === 'right' && 'text-right'
      )}>
        <a
          href={block.url}
          className="inline-block transition-transform hover:scale-105"
          style={buttonStyle}
        >
          {block.text}
        </a>
      </div>

      {/* Button settings */}
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Button Text</label>
            <input
              type="text"
              value={block.text}
              onChange={(e) => onUpdate({ text: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Button URL</label>
            <input
              type="url"
              value={block.url}
              onChange={(e) => onUpdate({ url: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              placeholder="https://example.com"
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Width</label>
            <select
              value={block.style?.width || 'auto'}
              onChange={(e) => onUpdate({ 
                style: { ...block.style, width: e.target.value as any } 
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="auto">Auto</option>
              <option value="full">Full Width</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Border Radius</label>
            <input
              type="text"
              value={block.style?.borderRadius || '24px'}
              onChange={(e) => onUpdate({ 
                style: { ...block.style, borderRadius: e.target.value } 
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="24px"
            />
          </div>
        </div>

        {/* Color pickers */}
        <div className="flex gap-4">
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">Background Color</label>
            <button
              onClick={() => setShowBgColorPicker(!showBgColorPicker)}
              className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              <div 
                className="w-6 h-6 rounded border border-gray-300"
                style={{ backgroundColor: block.style?.backgroundColor || '#000000' }}
              />
              <span className="text-sm">{block.style?.backgroundColor || '#000000'}</span>
              <Palette className="w-4 h-4 text-gray-500" />
            </button>
            {showBgColorPicker && (
              <div className="absolute top-full left-0 mt-2 z-50 bg-white p-3 rounded-lg shadow-xl border border-gray-200">
                <HexColorPicker 
                  color={block.style?.backgroundColor || '#000000'} 
                  onChange={(color) => onUpdate({ 
                    style: { ...block.style, backgroundColor: color } 
                  })}
                />
                <button
                  onClick={() => setShowBgColorPicker(false)}
                  className="mt-3 text-sm text-gray-600 hover:text-gray-800"
                >
                  Close
                </button>
              </div>
            )}
          </div>
          
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">Text Color</label>
            <button
              onClick={() => setShowTextColorPicker(!showTextColorPicker)}
              className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              <div 
                className="w-6 h-6 rounded border border-gray-300"
                style={{ backgroundColor: block.style?.textColor || '#ffffff' }}
              />
              <span className="text-sm">{block.style?.textColor || '#ffffff'}</span>
              <Palette className="w-4 h-4 text-gray-500" />
            </button>
            {showTextColorPicker && (
              <div className="absolute top-full left-0 mt-2 z-50 bg-white p-3 rounded-lg shadow-xl border border-gray-200">
                <HexColorPicker 
                  color={block.style?.textColor || '#ffffff'} 
                  onChange={(color) => onUpdate({ 
                    style: { ...block.style, textColor: color } 
                  })}
                />
                <button
                  onClick={() => setShowTextColorPicker(false)}
                  className="mt-3 text-sm text-gray-600 hover:text-gray-800"
                >
                  Close
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}