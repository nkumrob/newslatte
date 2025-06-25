'use client';

import { ColumnsBlock, ContentBlock } from '@/types/blocks';
import { Columns2, Columns3, Plus, Trash2 } from 'lucide-react';
import { BlockEditor } from '../index';
import { cn } from '@/lib/utils';

interface ColumnsBlockEditorProps {
  block: ColumnsBlock;
  onUpdate: (updates: Partial<ColumnsBlock>) => void;
}

export function ColumnsBlockEditor({ block, onUpdate }: ColumnsBlockEditorProps) {
  const updateColumn = (columnIndex: number, blocks: ContentBlock[]) => {
    const newColumns = [...block.columns];
    newColumns[columnIndex] = { ...newColumns[columnIndex], blocks };
    onUpdate({ columns: newColumns });
  };

  const addColumn = () => {
    if (block.columns.length < 4) {
      const newColumns = [...block.columns, { blocks: [], width: `${100 / (block.columns.length + 1)}%` }];
      // Recalculate widths
      const width = `${100 / newColumns.length}%`;
      newColumns.forEach(col => col.width = width);
      onUpdate({ columns: newColumns });
    }
  };

  const removeColumn = (index: number) => {
    if (block.columns.length > 1) {
      const newColumns = block.columns.filter((_, i) => i !== index);
      // Recalculate widths
      const width = `${100 / newColumns.length}%`;
      newColumns.forEach(col => col.width = width);
      onUpdate({ columns: newColumns });
    }
  };

  return (
    <div className="p-6">
      {/* Column controls */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-700">Columns:</label>
          <div className="flex gap-1">
            {[2, 3, 4].map((num) => (
              <button
                key={num}
                onClick={() => {
                  const newColumns = Array(num).fill(null).map((_, i) => 
                    block.columns[i] || { blocks: [], width: `${100 / num}%` }
                  );
                  onUpdate({ columns: newColumns });
                }}
                className={cn(
                  "p-2 rounded",
                  block.columns.length === num
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 hover:bg-gray-200"
                )}
                title={`${num} columns`}
              >
                {num === 2 && <Columns2 className="w-4 h-4" />}
                {num === 3 && <Columns3 className="w-4 h-4" />}
                {num === 4 && <div className="text-xs font-bold">4</div>}
              </button>
            ))}
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600">
            <input
              type="checkbox"
              checked={block.style?.stackOnMobile ?? true}
              onChange={(e) => onUpdate({ 
                style: { ...block.style, stackOnMobile: e.target.checked } 
              })}
              className="mr-1"
            />
            Stack on mobile
          </label>
        </div>
      </div>

      {/* Columns preview/editor */}
      <div 
        className="grid gap-4"
        style={{ 
          gridTemplateColumns: block.columns.map(col => col.width || `${100 / block.columns.length}%`).join(' '),
          gap: block.style?.gap || '24px'
        }}
      >
        {block.columns.map((column, index) => (
          <div 
            key={index} 
            className="relative border-2 border-dashed border-gray-300 rounded-lg p-4 min-h-[200px]"
          >
            {/* Column controls */}
            <div className="absolute top-2 right-2 opacity-0 hover:opacity-100 transition-opacity">
              {block.columns.length > 1 && (
                <button
                  onClick={() => removeColumn(index)}
                  className="p-1 text-red-600 hover:bg-red-50 rounded"
                  title="Remove column"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Column label */}
            <div className="text-xs text-gray-500 mb-2">Column {index + 1}</div>

            {/* Nested block editor */}
            <div className="space-y-2">
              <BlockEditor 
                blocks={column.blocks} 
                onChange={(blocks) => updateColumn(index, blocks)}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Gap control */}
      <div className="mt-4 grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Gap between columns</label>
          <input
            type="text"
            value={block.style?.gap || '24px'}
            onChange={(e) => onUpdate({ 
              style: { ...block.style, gap: e.target.value } 
            })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="24px"
          />
        </div>
      </div>
    </div>
  );
}