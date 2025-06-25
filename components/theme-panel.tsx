'use client';

import { useState } from 'react';
import { HexColorPicker } from 'react-colorful';
import { X, Palette, Type, Space, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Theme {
  colors: {
    primary: string;
    secondary: string;
    background: string;
    text: string;
    accent: string;
  };
  fonts: {
    heading: string;
    body: string;
  };
  spacing: {
    section: string;
    element: string;
  };
}

interface ThemePanelProps {
  theme: Theme;
  onChange: (theme: Theme) => void;
  onClose: () => void;
}

const fontOptions = [
  { label: 'System Default', value: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' },
  { label: 'Arial', value: 'Arial, sans-serif' },
  { label: 'Georgia', value: 'Georgia, serif' },
  { label: 'Times New Roman', value: '"Times New Roman", Times, serif' },
  { label: 'Courier', value: '"Courier New", Courier, monospace' },
  { label: 'Verdana', value: 'Verdana, Geneva, sans-serif' },
  { label: 'Helvetica', value: 'Helvetica, Arial, sans-serif' },
  { label: 'Garamond', value: 'Garamond, serif' },
  { label: 'Trebuchet MS', value: '"Trebuchet MS", sans-serif' },
  { label: 'Palatino', value: '"Palatino Linotype", "Book Antiqua", Palatino, serif' }
];

const spacingPresets = [
  { label: 'Compact', section: '24px', element: '12px' },
  { label: 'Normal', section: '32px', element: '16px' },
  { label: 'Comfortable', section: '48px', element: '24px' },
  { label: 'Spacious', section: '64px', element: '32px' }
];

const colorPresets = [
  {
    name: 'Classic',
    colors: {
      primary: '#000000',
      secondary: '#666666',
      background: '#ffffff',
      text: '#333333',
      accent: '#0066cc'
    }
  },
  {
    name: 'Modern Blue',
    colors: {
      primary: '#1a73e8',
      secondary: '#5f6368',
      background: '#ffffff',
      text: '#202124',
      accent: '#1967d2'
    }
  },
  {
    name: 'Warm Earth',
    colors: {
      primary: '#8b4513',
      secondary: '#a0522d',
      background: '#faf8f5',
      text: '#3e2723',
      accent: '#d2691e'
    }
  },
  {
    name: 'Dark Mode',
    colors: {
      primary: '#bb86fc',
      secondary: '#03dac6',
      background: '#121212',
      text: '#e1e1e1',
      accent: '#cf6679'
    }
  }
];

export function ThemePanel({ theme, onChange, onClose }: ThemePanelProps) {
  const [activeTab, setActiveTab] = useState<'colors' | 'fonts' | 'spacing'>('colors');
  const [activeColor, setActiveColor] = useState<keyof Theme['colors'] | null>(null);

  const updateColor = (colorKey: keyof Theme['colors'], value: string) => {
    onChange({
      ...theme,
      colors: {
        ...theme.colors,
        [colorKey]: value
      }
    });
  };

  const updateFont = (fontKey: keyof Theme['fonts'], value: string) => {
    onChange({
      ...theme,
      fonts: {
        ...theme.fonts,
        [fontKey]: value
      }
    });
  };

  const updateSpacing = (spacingKey: keyof Theme['spacing'], value: string) => {
    onChange({
      ...theme,
      spacing: {
        ...theme.spacing,
        [spacingKey]: value
      }
    });
  };

  const applyPreset = (preset: typeof colorPresets[0]) => {
    onChange({
      ...theme,
      colors: preset.colors
    });
  };

  const applySpacingPreset = (preset: typeof spacingPresets[0]) => {
    onChange({
      ...theme,
      spacing: {
        section: preset.section,
        element: preset.element
      }
    });
  };

  return (
    <div className="w-80 bg-white border-r border-gray-200 h-full overflow-y-auto">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Design Theme</h2>
        <button
          onClick={onClose}
          className="p-1 hover:bg-gray-100 rounded"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => setActiveTab('colors')}
          className={cn(
            "flex-1 py-3 text-sm font-medium border-b-2 transition-colors",
            activeTab === 'colors'
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-gray-600 hover:text-gray-900"
          )}
        >
          <Palette className="w-4 h-4 inline mr-1" />
          Colors
        </button>
        <button
          onClick={() => setActiveTab('fonts')}
          className={cn(
            "flex-1 py-3 text-sm font-medium border-b-2 transition-colors",
            activeTab === 'fonts'
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-gray-600 hover:text-gray-900"
          )}
        >
          <Type className="w-4 h-4 inline mr-1" />
          Typography
        </button>
        <button
          onClick={() => setActiveTab('spacing')}
          className={cn(
            "flex-1 py-3 text-sm font-medium border-b-2 transition-colors",
            activeTab === 'spacing'
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-gray-600 hover:text-gray-900"
          )}
        >
          <Space className="w-4 h-4 inline mr-1" />
          Spacing
        </button>
      </div>

      {/* Content */}
      <div className="p-4">
        {activeTab === 'colors' && (
          <div className="space-y-6">
            {/* Color Presets */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-3">Presets</h3>
              <div className="grid grid-cols-2 gap-2">
                {colorPresets.map((preset) => (
                  <button
                    key={preset.name}
                    onClick={() => applyPreset(preset)}
                    className="p-2 border border-gray-200 rounded-lg hover:border-gray-300 text-left"
                  >
                    <div className="flex gap-1 mb-1">
                      {Object.values(preset.colors).slice(0, 4).map((color, i) => (
                        <div
                          key={i}
                          className="w-6 h-6 rounded border border-gray-200"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                    <p className="text-xs text-gray-600">{preset.name}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Individual Colors */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-3">Custom Colors</h3>
              <div className="space-y-3">
                {Object.entries(theme.colors).map(([key, value]) => (
                  <div key={key}>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-sm capitalize text-gray-600">
                        {key}
                      </label>
                      <span className="text-xs text-gray-400">{value}</span>
                    </div>
                    <button
                      onClick={() => setActiveColor(activeColor === key ? null : key as keyof Theme['colors'])}
                      className="w-full h-10 rounded-lg border-2 border-gray-200 hover:border-gray-300 transition-colors"
                      style={{ backgroundColor: value }}
                    />
                    {activeColor === key && (
                      <div className="mt-3">
                        <HexColorPicker
                          color={value}
                          onChange={(color) => updateColor(key as keyof Theme['colors'], color)}
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'fonts' && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Heading Font
              </label>
              <select
                value={theme.fonts.heading}
                onChange={(e) => updateFont('heading', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                {fontOptions.map((font) => (
                  <option key={font.value} value={font.value}>
                    {font.label}
                  </option>
                ))}
              </select>
              <p 
                className="mt-2 text-lg font-bold"
                style={{ fontFamily: theme.fonts.heading }}
              >
                Heading Preview
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Body Font
              </label>
              <select
                value={theme.fonts.body}
                onChange={(e) => updateFont('body', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                {fontOptions.map((font) => (
                  <option key={font.value} value={font.value}>
                    {font.label}
                  </option>
                ))}
              </select>
              <p 
                className="mt-2 text-sm"
                style={{ fontFamily: theme.fonts.body }}
              >
                This is how your body text will look. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              </p>
            </div>
          </div>
        )}

        {activeTab === 'spacing' && (
          <div className="space-y-6">
            {/* Spacing Presets */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-3">Presets</h3>
              <div className="grid grid-cols-2 gap-2">
                {spacingPresets.map((preset) => (
                  <button
                    key={preset.label}
                    onClick={() => applySpacingPreset(preset)}
                    className={cn(
                      "p-3 border rounded-lg text-sm",
                      theme.spacing.section === preset.section && theme.spacing.element === preset.element
                        ? "border-blue-600 bg-blue-50 text-blue-600"
                        : "border-gray-200 hover:border-gray-300"
                    )}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Spacing */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-3">Custom Spacing</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">
                    Section Spacing
                  </label>
                  <input
                    type="text"
                    value={theme.spacing.section}
                    onChange={(e) => updateSpacing('section', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="32px"
                  />
                  <div 
                    className="mt-2 bg-gray-100 rounded"
                    style={{ height: theme.spacing.section }}
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-600 mb-1">
                    Element Spacing
                  </label>
                  <input
                    type="text"
                    value={theme.spacing.element}
                    onChange={(e) => updateSpacing('element', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="16px"
                  />
                  <div 
                    className="mt-2 bg-gray-100 rounded"
                    style={{ height: theme.spacing.element }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Reset Button */}
      <div className="p-4 border-t border-gray-200">
        <button
          onClick={() => {
            onChange({
              colors: colorPresets[0].colors,
              fonts: {
                heading: 'Georgia, serif',
                body: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
              },
              spacing: {
                section: '32px',
                element: '16px'
              }
            });
          }}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
        >
          <RefreshCw className="w-4 h-4" />
          Reset to Defaults
        </button>
      </div>
    </div>
  );
}