'use client';

import { SocialBlock } from '@/types/blocks';
import { Facebook, Twitter, Instagram, Linkedin, Youtube, Music2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SocialBlockEditorProps {
  block: SocialBlock;
  onUpdate: (updates: Partial<SocialBlock>) => void;
}

const socialIcons = {
  facebook: Facebook,
  twitter: Twitter,
  instagram: Instagram,
  linkedin: Linkedin,
  youtube: Youtube,
  tiktok: Music2
};

export function SocialBlockEditor({ block, onUpdate }: SocialBlockEditorProps) {
  const iconSize = parseInt(block.style?.iconSize || '32px');
  
  return (
    <div className="p-6">
      {/* Social icons preview */}
      <div className={cn(
        "mb-6",
        block.style?.alignment === 'center' && 'text-center',
        block.style?.alignment === 'right' && 'text-right'
      )}>
        <div className="inline-flex" style={{ gap: block.style?.spacing || '16px' }}>
          {block.networks.map((network, index) => {
            const Icon = socialIcons[network.platform];
            return (
              <a
                key={index}
                href={network.url}
                className="transition-transform hover:scale-110"
                style={{ color: block.style?.iconColor || '#333333' }}
              >
                <Icon style={{ width: iconSize, height: iconSize }} />
              </a>
            );
          })}
        </div>
      </div>

      {/* Social settings */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Social Networks</label>
          <div className="space-y-2">
            {block.networks.map((network, index) => (
              <div key={index} className="flex items-center gap-2">
                <select
                  value={network.platform}
                  onChange={(e) => {
                    const newNetworks = [...block.networks];
                    newNetworks[index] = { ...network, platform: e.target.value as any };
                    onUpdate({ networks: newNetworks });
                  }}
                  className="px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="facebook">Facebook</option>
                  <option value="twitter">Twitter</option>
                  <option value="instagram">Instagram</option>
                  <option value="linkedin">LinkedIn</option>
                  <option value="youtube">YouTube</option>
                  <option value="tiktok">TikTok</option>
                </select>
                <input
                  type="url"
                  value={network.url}
                  onChange={(e) => {
                    const newNetworks = [...block.networks];
                    newNetworks[index] = { ...network, url: e.target.value };
                    onUpdate({ networks: newNetworks });
                  }}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="https://..."
                />
                <button
                  onClick={() => {
                    const newNetworks = block.networks.filter((_, i) => i !== index);
                    onUpdate({ networks: newNetworks });
                  }}
                  className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-md"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
          <button
            onClick={() => {
              onUpdate({ 
                networks: [...block.networks, { platform: 'facebook', url: '#' }] 
              });
            }}
            className="mt-2 text-sm text-blue-600 hover:text-blue-700"
          >
            + Add Network
          </button>
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Icon Size</label>
            <input
              type="text"
              value={block.style?.iconSize || '32px'}
              onChange={(e) => onUpdate({ 
                style: { ...block.style, iconSize: e.target.value } 
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="32px"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Spacing</label>
            <input
              type="text"
              value={block.style?.spacing || '16px'}
              onChange={(e) => onUpdate({ 
                style: { ...block.style, spacing: e.target.value } 
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="16px"
            />
          </div>
        </div>
      </div>
    </div>
  );
}