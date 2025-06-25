'use client';

import { useEffect, useState } from 'react';
import { Newsletter } from '@/types/newsletter';
import { DraggableEditor } from '@/components/newsletter-editor-dnd';
import { NewsletterViewer } from '@/components/newsletter-viewer';
import { 
  Save, 
  Download, 
  Eye, 
  EyeOff, 
  Undo, 
  Redo,
  Code,
  FileText,
  Image as ImageIcon,
  FileDown,
  FolderOpen
} from 'lucide-react';
import { cn } from '@/lib/utils';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { TemplateManager } from '@/components/template-manager';

export default function EnhancedEditorPage() {
  const [newsletter, setNewsletter] = useState<Newsletter | null>(null);
  const [loading, setLoading] = useState(true);
  const [showPreview, setShowPreview] = useState(true);
  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop');
  const [history, setHistory] = useState<Newsletter[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [showTemplateManager, setShowTemplateManager] = useState(false);

  useEffect(() => {
    fetch('/sample-newsletter.json')
      .then(res => res.json())
      .then(data => {
        setNewsletter(data);
        setHistory([data]);
        setHistoryIndex(0);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load newsletter:', err);
        setLoading(false);
      });
  }, []);

  const updateNewsletter = (updated: Newsletter) => {
    setNewsletter(updated);
    
    // Add to history
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(updated);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

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

  const exportAsJSON = () => {
    if (!newsletter) return;
    
    const dataStr = JSON.stringify(newsletter, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `newsletter-remix-${Date.now()}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const exportAsHTML = () => {
    if (!newsletter) return;
    
    // Generate HTML
    const html = generateNewsletterHTML(newsletter);
    const dataUri = 'data:text/html;charset=utf-8,'+ encodeURIComponent(html);
    
    const exportFileDefaultName = `newsletter-${Date.now()}.html`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const exportAsPDF = async () => {
    if (!newsletter) return;
    
    // Create temporary container for PDF generation
    const container = document.createElement('div');
    container.style.position = 'absolute';
    container.style.left = '-9999px';
    container.style.width = '600px';
    container.innerHTML = generateNewsletterHTML(newsletter);
    document.body.appendChild(container);
    
    try {
      // Generate canvas from HTML
      const canvas = await html2canvas(container, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      });
      
      // Calculate PDF dimensions
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 297; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      
      // Create PDF
      const pdf = new jsPDF('p', 'mm', 'a4');
      let position = 0;
      
      // Add image to PDF, splitting across pages if needed
      pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
      
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      
      // Save PDF
      pdf.save(`newsletter-${Date.now()}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      // Clean up
      document.body.removeChild(container);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading editor...</p>
        </div>
      </div>
    );
  }

  if (!newsletter) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">Failed to load newsletter</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-semibold text-gray-900">
                Newsletter Remix Editor
              </h1>
              
              {/* Undo/Redo */}
              <div className="flex items-center space-x-1 border-l pl-4">
                <button
                  onClick={undo}
                  disabled={historyIndex <= 0}
                  className={cn(
                    "p-2 rounded hover:bg-gray-100",
                    historyIndex <= 0 && "opacity-50 cursor-not-allowed"
                  )}
                  title="Undo"
                >
                  <Undo className="w-4 h-4" />
                </button>
                <button
                  onClick={redo}
                  disabled={historyIndex >= history.length - 1}
                  className={cn(
                    "p-2 rounded hover:bg-gray-100",
                    historyIndex >= history.length - 1 && "opacity-50 cursor-not-allowed"
                  )}
                  title="Redo"
                >
                  <Redo className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Templates */}
              <button
                onClick={() => setShowTemplateManager(true)}
                className="flex items-center space-x-2 px-3 py-2 text-sm hover:bg-gray-100 rounded-lg"
              >
                <FolderOpen className="w-4 h-4" />
                <span>Templates</span>
              </button>

              {/* Preview Toggle */}
              <button
                onClick={() => setShowPreview(!showPreview)}
                className="flex items-center space-x-2 px-3 py-2 text-sm hover:bg-gray-100 rounded-lg"
              >
                {showPreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                <span>{showPreview ? 'Hide' : 'Show'} Preview</span>
              </button>
              
              {/* Export Options */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={exportAsJSON}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                  title="Export as JSON"
                >
                  <Code className="w-4 h-4" />
                </button>
                <button
                  onClick={exportAsHTML}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                  title="Export as HTML"
                >
                  <FileText className="w-4 h-4" />
                </button>
                <button
                  onClick={exportAsPDF}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                  title="Export as PDF"
                >
                  <FileDown className="w-4 h-4" />
                </button>
              </div>
              
              {/* Save Button */}
              <button
                onClick={() => alert('Saved! (In a real app, this would save to a database)')}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Save className="w-4 h-4" />
                <span>Save Changes</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex h-[calc(100vh-64px)]">
        {/* Editor Panel */}
        <div className={cn(
          "flex-1 overflow-y-auto bg-gray-50",
          showPreview ? "w-1/2" : "w-full"
        )}>
          <div className="p-8">
            {/* Newsletter Metadata */}
            <div className="max-w-[700px] mx-auto mb-8 bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-medium mb-4">Newsletter Details</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    value={newsletter.metadata.title}
                    onChange={(e) => updateNewsletter({
                      ...newsletter,
                      metadata: { ...newsletter.metadata, title: e.target.value }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Subtitle
                  </label>
                  <input
                    type="text"
                    value={newsletter.metadata.subtitle}
                    onChange={(e) => updateNewsletter({
                      ...newsletter,
                      metadata: { ...newsletter.metadata, subtitle: e.target.value }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Hero Images */}
            <div className="max-w-[700px] mx-auto mb-8">
              <h3 className="text-lg font-medium mb-4">Hero Images</h3>
              <div className="space-y-4">
                {newsletter.content.images
                  .filter(img => img.type === 'hero')
                  .map((image, index) => (
                    <div key={index} className="bg-white rounded-lg shadow-sm overflow-hidden">
                      <img 
                        src={image.url} 
                        alt={image.alt}
                        className="w-full h-auto"
                      />
                      <div className="p-4">
                        <input
                          type="text"
                          value={image.url}
                          onChange={(e) => {
                            const images = [...newsletter.content.images];
                            const heroIndex = newsletter.content.images.findIndex((img, i) => 
                              img.type === 'hero' && i === index
                            );
                            if (heroIndex !== -1) {
                              images[heroIndex] = { ...image, url: e.target.value };
                              updateNewsletter({
                                ...newsletter,
                                content: { ...newsletter.content, images }
                              });
                            }
                          }}
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Image URL"
                        />
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* Sections Editor */}
            <div className="mb-8">
              <h3 className="text-lg font-medium mb-4 max-w-[700px] mx-auto">Content Sections</h3>
              <DraggableEditor 
                newsletter={newsletter}
                onUpdate={updateNewsletter}
              />
            </div>
          </div>
        </div>

        {/* Preview Panel */}
        {showPreview && (
          <div className="w-1/2 border-l border-gray-200 bg-white overflow-hidden">
            <div className="h-full overflow-y-auto">
              <div className="p-4 bg-gray-100 border-b border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-gray-700">Live Preview</h3>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setPreviewMode('desktop')}
                      className={cn(
                        "px-3 py-1 text-xs rounded",
                        previewMode === 'desktop' 
                          ? "bg-gray-900 text-white" 
                          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                      )}
                    >
                      Desktop
                    </button>
                    <button
                      onClick={() => setPreviewMode('mobile')}
                      className={cn(
                        "px-3 py-1 text-xs rounded",
                        previewMode === 'mobile' 
                          ? "bg-gray-900 text-white" 
                          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                      )}
                    >
                      Mobile
                    </button>
                  </div>
                </div>
              </div>
              
              <div className={cn(
                "mx-auto transition-all duration-300",
                previewMode === 'mobile' ? "max-w-[375px]" : "max-w-[600px]"
              )}>
                <div className="bg-white shadow-lg">
                  {/* Email preview */}
                  <div className="border-b border-gray-200 p-4">
                    <div className="text-xs text-gray-500">From: {newsletter.metadata.brand}</div>
                    <div className="text-xs text-gray-500">Subject: {newsletter.metadata.title}</div>
                  </div>
                  
                  {/* Email content */}
                  <div>
                    {/* Hero images */}
                    {newsletter.content.images
                      .filter(img => img.type === 'hero')
                      .map((image, index) => (
                        <img 
                          key={index}
                          src={image.url} 
                          alt={image.alt}
                          className="w-full h-auto"
                        />
                      ))}
                    
                    {/* Sections */}
                    {newsletter.content.sections.map((section, index) => (
                      <div key={index} className="px-6 py-8">
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                          {section.title}
                        </h2>
                        {section.description && (
                          <p className="text-gray-600 mb-6">
                            {section.description}
                          </p>
                        )}
                        {section.cta && (
                          <a 
                            href={section.cta.url}
                            className="inline-block bg-black text-white px-6 py-3 rounded-full text-sm font-medium"
                          >
                            {section.cta.text}
                          </a>
                        )}
                      </div>
                    ))}
                    
                    {/* Products */}
                    {newsletter.content.products.length > 0 && (
                      <div className="px-6 py-8">
                        <div className="grid grid-cols-2 gap-4">
                          {newsletter.content.products.map((product, index) => (
                            <div key={index} className="text-center">
                              <img 
                                src={product.image} 
                                alt={product.name}
                                className="w-full h-auto mb-2"
                              />
                              <p className="text-sm font-medium text-gray-700">
                                {product.name}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Template Manager */}
      {showTemplateManager && (
        <TemplateManager
          newsletter={newsletter}
          onLoad={(loaded) => {
            updateNewsletter(loaded);
            setShowTemplateManager(false);
          }}
          onClose={() => setShowTemplateManager(false)}
        />
      )}
    </div>
  );
}

// Helper function to generate HTML
function generateNewsletterHTML(newsletter: Newsletter): string {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${newsletter.metadata.title}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 0; background: #f5f5f5; }
    .container { max-width: 600px; margin: 0 auto; background: white; }
    .header { padding: 20px; border-bottom: 1px solid #e5e5e5; }
    .section { padding: 32px 24px; }
    .section h2 { font-size: 24px; margin: 0 0 16px; }
    .section p { color: #666; line-height: 1.6; margin: 0 0 24px; }
    .button { display: inline-block; background: #000; color: white; padding: 12px 24px; border-radius: 24px; text-decoration: none; }
    .products { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; padding: 32px 24px; }
    .product { text-align: center; }
    .product img { width: 100%; height: auto; }
    .product p { margin: 8px 0 0; font-size: 14px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div style="font-size: 12px; color: #666;">From: ${newsletter.metadata.brand}</div>
      <div style="font-size: 12px; color: #666;">Subject: ${newsletter.metadata.title}</div>
    </div>
    
    ${newsletter.content.images
      .filter(img => img.type === 'hero')
      .map(img => `<img src="${img.url}" alt="${img.alt}" style="width: 100%; height: auto;">`)
      .join('')}
    
    ${newsletter.content.sections.map(section => `
      <div class="section">
        <h2>${section.title}</h2>
        ${section.description ? `<p>${section.description}</p>` : ''}
        ${section.cta ? `<a href="${section.cta.url}" class="button">${section.cta.text}</a>` : ''}
      </div>
    `).join('')}
    
    ${newsletter.content.products.length > 0 ? `
      <div class="products">
        ${newsletter.content.products.map(product => `
          <div class="product">
            <img src="${product.image}" alt="${product.name}">
            <p>${product.name}</p>
          </div>
        `).join('')}
      </div>
    ` : ''}
  </div>
</body>
</html>`;
}