'use client';

import { DividerBlock } from '@/types/blocks';
import { HexColorPicker } from 'react-colorful';
import { useState } from 'react';
import { Palette } from 'lucide-react';

interface DividerBlockEditorProps {
  block: DividerBlock;
  onUpdate: (updates: Partial<DividerBlock>) => void;
}

export function DividerBlockEditor({ block, onUpdate }: DividerBlockEditorProps) {
  const [showColorPicker, setShowColorPicker] = useState(false);

  return (
    <div className="p-6">
      {/* Divider preview */}
      <div style={{ margin: block.style?.margin || '32px 0' }}>
        <hr
          style={{
            borderColor: block.style?.borderColor || '#e5e5e5',
            borderWidth: block.style?.borderWidth || '1px',
            borderStyle: block.style?.borderStyle || 'solid',
            borderTop: 'none',
            borderLeft: 'none',
            borderRight: 'none'
          }}
        />
      </div>

      {/* Divider settings */}
      <div className="mt-4 grid grid-cols-3 gap-4">
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
          <button
            onClick={() => setShowColorPicker(!showColorPicker)}
            className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50 w-full"
          >
            <div 
              className="w-6 h-6 rounded border border-gray-300"
              style={{ backgroundColor: block.style?.borderColor || '#e5e5e5' }}
            />
            <span className="text-sm">{block.style?.borderColor || '#e5e5e5'}</span>
            <Palette className="w-4 h-4 text-gray-500 ml-auto" />
          </button>
          {showColorPicker && (
            <div className="absolute top-full left-0 mt-2 z-50 bg-white p-3 rounded-lg shadow-xl border border-gray-200">
              <HexColorPicker 
                color={block.style?.borderColor || '#e5e5e5'} 
                onChange={(color) => onUpdate({ 
                  style: { ...block.style, borderColor: color } 
                })}
              />
              <button
                onClick={() => setShowColorPicker(false)}
                className="mt-3 text-sm text-gray-600 hover:text-gray-800"
              >
                Close
              </button>
            </div>
          )}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Style</label>
          <select
            value={block.style?.borderStyle || 'solid'}
            onChange={(e) => onUpdate({ 
              style: { ...block.style, borderStyle: e.target.value as any } 
            })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="solid">Solid</option>
            <option value="dashed">Dashed</option>
            <option value="dotted">Dotted</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Width</label>
          <input
            type="text"
            value={block.style?.borderWidth || '1px'}
            onChange={(e) => onUpdate({ 
              style: { ...block.style, borderWidth: e.target.value } 
            })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="1px"
          />
        </div>
      </div>
    </div>
  );
}