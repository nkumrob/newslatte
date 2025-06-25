'use client';

import { BlockType } from '@/types/blocks';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import {
  Plus,
  Type,
  Heading1,
  Image,
  Square,
  Minus,
  Columns,
  ShoppingBag,
  Share2,
  Video,
  Quote,
  Code,
  Space
} from 'lucide-react';

interface AddBlockMenuProps {
  onAdd: (type: BlockType) => void;
}

const blockTypes = [
  { type: 'text' as BlockType, label: 'Text', icon: Type, category: 'Basic' },
  { type: 'heading' as BlockType, label: 'Heading', icon: Heading1, category: 'Basic' },
  { type: 'image' as BlockType, label: 'Image', icon: Image, category: 'Basic' },
  { type: 'button' as BlockType, label: 'Button', icon: Square, category: 'Basic' },
  { type: 'divider' as BlockType, label: 'Divider', icon: Minus, category: 'Basic' },
  { type: 'spacer' as BlockType, label: 'Spacer', icon: Space, category: 'Basic' },
  { type: 'columns' as BlockType, label: 'Columns', icon: Columns, category: 'Layout' },
  { type: 'product' as BlockType, label: 'Product', icon: ShoppingBag, category: 'Commerce' },
  { type: 'social' as BlockType, label: 'Social Links', icon: Share2, category: 'Social' },
  { type: 'video' as BlockType, label: 'Video', icon: Video, category: 'Media' },
  { type: 'quote' as BlockType, label: 'Quote', icon: Quote, category: 'Content' },
  { type: 'html' as BlockType, label: 'Custom HTML', icon: Code, category: 'Advanced' },
];

const categories = ['Basic', 'Layout', 'Commerce', 'Social', 'Media', 'Content', 'Advanced'];

export function AddBlockMenu({ onAdd }: AddBlockMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          <Plus className="w-4 h-4" />
          Add Block
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        {categories.map((category) => {
          const categoryBlocks = blockTypes.filter(b => b.category === category);
          if (categoryBlocks.length === 0) return null;
          
          return (
            <div key={category}>
              <DropdownMenuLabel>{category}</DropdownMenuLabel>
              {categoryBlocks.map((block) => {
                const Icon = block.icon;
                return (
                  <DropdownMenuItem
                    key={block.type}
                    onClick={() => onAdd(block.type)}
                    className="cursor-pointer"
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {block.label}
                  </DropdownMenuItem>
                );
              })}
              {category !== categories[categories.length - 1] && <DropdownMenuSeparator />}
            </div>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}