'use client';

import { useState, useEffect } from 'react';
import { Newsletter } from '@/types/newsletter';
import { NewsletterTemplate } from '@/types/template';
import { 
  Save, 
  FolderOpen, 
  X, 
  Trash2, 
  Grid,
  List,
  Search,
  Plus
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface TemplateManagerProps {
  newsletter: Newsletter;
  onLoad: (newsletter: Newsletter) => void;
  onClose: () => void;
}

export function TemplateManager({ newsletter, onLoad, onClose }: TemplateManagerProps) {
  const [templates, setTemplates] = useState<NewsletterTemplate[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [templateName, setTemplateName] = useState('');
  const [templateDescription, setTemplateDescription] = useState('');
  const [templateCategory, setTemplateCategory] = useState<NewsletterTemplate['category']>('custom');

  useEffect(() => {
    // Load templates from localStorage
    const savedTemplates = localStorage.getItem('newsletter-templates');
    if (savedTemplates) {
      setTemplates(JSON.parse(savedTemplates));
    }
  }, []);

  const saveTemplate = () => {
    if (!templateName.trim()) {
      alert('Please enter a template name');
      return;
    }

    const newTemplate: NewsletterTemplate = {
      id: Date.now().toString(),
      name: templateName,
      description: templateDescription,
      newsletter: newsletter,
      category: templateCategory,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const updatedTemplates = [...templates, newTemplate];
    setTemplates(updatedTemplates);
    localStorage.setItem('newsletter-templates', JSON.stringify(updatedTemplates));
    
    setShowSaveDialog(false);
    setTemplateName('');
    setTemplateDescription('');
    alert('Template saved successfully!');
  };

  const deleteTemplate = (id: string) => {
    if (confirm('Are you sure you want to delete this template?')) {
      const updatedTemplates = templates.filter(t => t.id !== id);
      setTemplates(updatedTemplates);
      localStorage.setItem('newsletter-templates', JSON.stringify(updatedTemplates));
    }
  };

  const loadTemplate = (template: NewsletterTemplate) => {
    if (confirm('Loading this template will replace your current design. Continue?')) {
      onLoad(template.newsletter);
      onClose();
    }
  };

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Newsletter Templates</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Toolbar */}
        <div className="border-b border-gray-200 px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search templates..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Category Filter */}
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Categories</option>
                <option value="promotional">Promotional</option>
                <option value="informational">Informational</option>
                <option value="transactional">Transactional</option>
                <option value="custom">Custom</option>
              </select>
            </div>

            <div className="flex items-center space-x-2">
              {/* View Mode */}
              <button
                onClick={() => setViewMode('grid')}
                className={cn(
                  "p-2 rounded",
                  viewMode === 'grid' ? "bg-gray-200" : "hover:bg-gray-100"
                )}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={cn(
                  "p-2 rounded",
                  viewMode === 'list' ? "bg-gray-200" : "hover:bg-gray-100"
                )}
              >
                <List className="w-4 h-4" />
              </button>

              {/* Save Current */}
              <button
                onClick={() => setShowSaveDialog(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Save className="w-4 h-4" />
                <span>Save Current</span>
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 200px)' }}>
          {filteredTemplates.length === 0 ? (
            <div className="text-center py-12">
              <FolderOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No templates found</p>
              <button
                onClick={() => setShowSaveDialog(true)}
                className="mt-4 text-blue-600 hover:text-blue-700"
              >
                Save your first template
              </button>
            </div>
          ) : (
            <div className={cn(
              viewMode === 'grid' 
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                : "space-y-2"
            )}>
              {filteredTemplates.map((template) => (
                <div
                  key={template.id}
                  className={cn(
                    "border border-gray-200 rounded-lg hover:shadow-lg transition-shadow cursor-pointer",
                    viewMode === 'grid' ? "p-4" : "p-3 flex items-center justify-between"
                  )}
                  onClick={() => loadTemplate(template)}
                >
                  {viewMode === 'grid' ? (
                    <div>
                      <div className="aspect-video bg-gray-100 rounded mb-3 flex items-center justify-center">
                        <Grid className="w-8 h-8 text-gray-400" />
                      </div>
                      <h3 className="font-medium text-gray-900 mb-1">{template.name}</h3>
                      <p className="text-sm text-gray-500 mb-2">{template.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                          {template.category}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteTemplate(template.id);
                          }}
                          className="p-1 hover:bg-red-50 rounded text-red-600"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center space-x-3">
                        <div className="w-16 h-12 bg-gray-100 rounded flex items-center justify-center">
                          <Grid className="w-6 h-6 text-gray-400" />
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">{template.name}</h3>
                          <p className="text-sm text-gray-500">{template.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                          {template.category}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteTemplate(template.id);
                          }}
                          className="p-1 hover:bg-red-50 rounded text-red-600"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Save Dialog */}
      {showSaveDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-[60] flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold mb-4">Save Template</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Template Name
                </label>
                <input
                  type="text"
                  value={templateName}
                  onChange={(e) => setTemplateName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="My Newsletter Template"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={templateDescription}
                  onChange={(e) => setTemplateDescription(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  placeholder="A brief description of this template..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  value={templateCategory}
                  onChange={(e) => setTemplateCategory(e.target.value as NewsletterTemplate['category'])}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="promotional">Promotional</option>
                  <option value="informational">Informational</option>
                  <option value="transactional">Transactional</option>
                  <option value="custom">Custom</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowSaveDialog(false)}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={saveTemplate}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Save Template
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}