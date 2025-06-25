'use client';

import React, { useState, useCallback } from 'react';
import { Newsletter, Section, NewsletterImage, Product } from '@/types/newsletter';
import { cn } from '@/lib/utils';
import { 
  GripVertical, 
  Edit2, 
  Image as ImageIcon, 
  Trash2, 
  Plus,
  Save,
  Undo,
  Redo,
  Eye,
  EyeOff,
  Palette,
  Type as TypeIcon
} from 'lucide-react';

interface NewsletterEditorProps {
  initialNewsletter: Newsletter;
  onSave?: (newsletter: Newsletter) => void;
}

export function NewsletterEditor({ initialNewsletter, onSave }: NewsletterEditorProps) {
  const [newsletter, setNewsletter] = useState<Newsletter>(initialNewsletter);
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(true);
  const [history, setHistory] = useState<Newsletter[]>([initialNewsletter]);
  const [historyIndex, setHistoryIndex] = useState(0);

  // Add to history when changes are made
  const updateNewsletter = useCallback((updater: (prev: Newsletter) => Newsletter) => {
    setNewsletter(prev => {
      const updated = updater(prev);
      const newHistory = history.slice(0, historyIndex + 1);
      newHistory.push(updated);
      setHistory(newHistory);
      setHistoryIndex(newHistory.length - 1);
      return updated;
    });
  }, [history, historyIndex]);

  // Undo/Redo functionality
  const undo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setNewsletter(history[historyIndex - 1]);
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setNewsletter(history[historyIndex + 1]);
    }
  };

  // Update section text
  const updateSectionText = (index: number, field: keyof Section, value: string) => {
    updateNewsletter(prev => ({
      ...prev,
      content: {
        ...prev.content,
        sections: prev.content.sections.map((section, i) => 
          i === index ? { ...section, [field]: value } : section
        )
      }
    }));
  };

  // Update image
  const updateImage = (index: number, url: string) => {
    updateNewsletter(prev => ({
      ...prev,
      content: {
        ...prev.content,
        images: prev.content.images.map((img, i) => 
          i === index ? { ...img, url } : img
        )
      }
    }));
  };

  // Delete section
  const deleteSection = (index: number) => {
    updateNewsletter(prev => ({
      ...prev,
      content: {
        ...prev.content,
        sections: prev.content.sections.filter((_, i) => i !== index)
      }
    }));
  };

  // Add new section
  const addSection = () => {
    const newSection: Section = {
      title: 'New Section',
      type: 'headline',
      description: 'Enter your content here',
      cta: {
        text: 'Learn More',
        url: '#'
      }
    };
    
    updateNewsletter(prev => ({
      ...prev,
      content: {
        ...prev.content,
        sections: [...prev.content.sections, newSection]
      }
    }));
  };

  // Move section up/down
  const moveSection = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= newsletter.content.sections.length) return;

    updateNewsletter(prev => {
      const sections = [...prev.content.sections];
      [sections[index], sections[newIndex]] = [sections[newIndex], sections[index]];
      return {
        ...prev,
        content: {
          ...prev.content,
          sections
        }
      };
    });
  };

  const renderEditableSection = (section: Section, index: number) => {
    const isSelected = selectedElement === `section-${index}`;

    return (
      <div 
        key={index}
        className={cn(
          "relative group border-2 border-transparent hover:border-blue-300 transition-all",
          isSelected && "border-blue-500"
        )}
        onClick={() => setSelectedElement(`section-${index}`)}
      >
        {/* Section Controls */}
        <div className="absolute -left-12 top-0 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={(e) => {
              e.stopPropagation();
              moveSection(index, 'up');
            }}
            className="p-1 bg-white border rounded hover:bg-gray-100"
            disabled={index === 0}
          >
            <GripVertical className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              deleteSection(index);
            }}
            className="p-1 bg-white border rounded hover:bg-red-100 text-red-600"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        <div className="px-6 py-8">
          <input
            type="text"
            value={section.title}
            onChange={(e) => updateSectionText(index, 'title', e.target.value)}
            className="text-2xl font-semibold text-gray-900 mb-4 w-full border-b border-transparent hover:border-gray-300 focus:border-blue-500 focus:outline-none"
          />
          
          {section.description && (
            <textarea
              value={section.description}
              onChange={(e) => updateSectionText(index, 'description', e.target.value)}
              className="text-gray-600 mb-6 w-full resize-none border-b border-transparent hover:border-gray-300 focus:border-blue-500 focus:outline-none"
              rows={3}
            />
          )}
          
          {section.cta && (
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={section.cta.text}
                onChange={(e) => updateSectionText(index, 'cta', { ...section.cta!, text: e.target.value })}
                className="inline-block bg-black text-white px-6 py-3 rounded-full text-sm font-medium"
              />
              <input
                type="text"
                value={section.cta.url}
                onChange={(e) => updateSectionText(index, 'cta', { ...section.cta!, url: e.target.value })}
                className="text-sm text-gray-500 border-b border-gray-300 focus:border-blue-500 focus:outline-none"
                placeholder="URL"
              />
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderEditableImage = (image: NewsletterImage, index: number) => {
    const isSelected = selectedElement === `image-${index}`;

    return (
      <div 
        key={index}
        className={cn(
          "relative group border-2 border-transparent hover:border-blue-300 transition-all",
          isSelected && "border-blue-500"
        )}
        onClick={() => setSelectedElement(`image-${index}`)}
      >
        <img 
          src={image.url} 
          alt={image.alt || 'Newsletter image'} 
          className="w-full h-auto"
        />
        
        {/* Image overlay controls */}
        <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <button
            onClick={(e) => {
              e.stopPropagation();
              const newUrl = prompt('Enter new image URL:', image.url);
              if (newUrl) updateImage(index, newUrl);
            }}
            className="p-2 bg-white rounded-lg hover:bg-gray-100"
          >
            <ImageIcon className="w-5 h-5" />
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-lg font-semibold text-gray-900">
                Remix Editor
              </h1>
              <div className="flex items-center space-x-2">
                <button
                  onClick={undo}
                  disabled={historyIndex === 0}
                  className="p-2 hover:bg-gray-100 rounded disabled:opacity-50"
                >
                  <Undo className="w-4 h-4" />
                </button>
                <button
                  onClick={redo}
                  disabled={historyIndex === history.length - 1}
                  className="p-2 hover:bg-gray-100 rounded disabled:opacity-50"
                >
                  <Redo className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowPreview(!showPreview)}
                className="flex items-center space-x-2 px-3 py-2 hover:bg-gray-100 rounded"
              >
                {showPreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                <span>{showPreview ? 'Hide' : 'Show'} Preview</span>
              </button>
              
              <button
                onClick={() => onSave?.(newsletter)}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Save className="w-4 h-4" />
                <span>Save</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex h-[calc(100vh-64px)]">
        {/* Editor Panel */}
        <div className="flex-1 overflow-y-auto p-8">
          <div className="max-w-[600px] mx-auto bg-white shadow-lg">
            {/* Hero Images */}
            <div className="space-y-0">
              {newsletter.content.images
                .filter(img => img.type === 'hero')
                .map((image, index) => renderEditableImage(image, index))}
            </div>

            {/* Sections */}
            {newsletter.content.sections.map((section, index) => 
              renderEditableSection(section, index)
            )}

            {/* Add Section Button */}
            <div className="px-6 py-4">
              <button
                onClick={addSection}
                className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 flex items-center justify-center gap-2 text-gray-600"
              >
                <Plus className="w-5 h-5" />
                Add Section
              </button>
            </div>

            {/* Product Grid */}
            {newsletter.content.products.length > 0 && (
              <div className="px-6 py-8">
                <div className="grid grid-cols-2 gap-4">
                  {newsletter.content.products.map((product, index) => (
                    <div key={index} className="text-center group relative">
                      <div className="relative">
                        <img 
                          src={product.image} 
                          alt={product.name}
                          className="w-full h-auto mb-2"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <button className="p-2 bg-white rounded-lg hover:bg-gray-100">
                            <ImageIcon className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                      <input
                        type="text"
                        value={product.name}
                        onChange={(e) => {
                          const products = [...newsletter.content.products];
                          products[index] = { ...product, name: e.target.value };
                          updateNewsletter(prev => ({
                            ...prev,
                            content: { ...prev.content, products }
                          }));
                        }}
                        className="text-sm font-medium text-gray-700 text-center w-full border-b border-transparent hover:border-gray-300 focus:border-blue-500 focus:outline-none"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Preview Panel */}
        {showPreview && (
          <div className="w-96 border-l border-gray-200 bg-white overflow-y-auto">
            <div className="p-4">
              <h3 className="text-lg font-medium mb-4">Live Preview</h3>
              <div className="border rounded-lg overflow-hidden scale-75 origin-top">
                <div className="bg-white">
                  {/* Mini preview of the newsletter */}
                  <div className="text-xs">
                    {newsletter.content.images
                      .filter(img => img.type === 'hero')
                      .map((image, index) => (
                        <img key={index} src={image.url} alt="" className="w-full" />
                      ))}
                    
                    {newsletter.content.sections.map((section, index) => (
                      <div key={index} className="p-4">
                        <h4 className="font-semibold mb-2">{section.title}</h4>
                        {section.description && (
                          <p className="text-gray-600 mb-2">{section.description}</p>
                        )}
                        {section.cta && (
                          <button className="bg-black text-white px-3 py-1 rounded-full text-xs">
                            {section.cta.text}
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}