'use client';

import { useEffect, useState } from 'react';
import { Newsletter } from '@/types/newsletter';
import { ContentBlock } from '@/types/blocks';
import { BlockEditor } from '@/components/block-editor';
import { TemplateManager } from '@/components/template-manager';
import { ThemePanel } from '@/components/theme-panel';
import { BlockPreviewRenderer } from '@/components/block-preview-renderer';
import { convertNewsletterToBlocks, extractEmailMetadata } from '@/utils/newsletter-to-blocks';
import { 
  Save, 
  Eye, 
  EyeOff, 
  Undo, 
  Redo,
  Code,
  FileText,
  FileDown,
  FolderOpen,
  Palette,
  Settings,
  Mail,
  Smartphone,
  Monitor
} from 'lucide-react';
import { cn } from '@/lib/utils';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export default function AdvancedEditorPage() {
  const [newsletter, setNewsletter] = useState<Newsletter | null>(null);
  const [blocks, setBlocks] = useState<ContentBlock[]>([]);
  const [loading, setLoading] = useState(true);
  const [showPreview, setShowPreview] = useState(true);
  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile' | 'email'>('desktop');
  const [history, setHistory] = useState<ContentBlock[][]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [showTemplateManager, setShowTemplateManager] = useState(false);
  const [showThemePanel, setShowThemePanel] = useState(false);
  const [theme, setTheme] = useState({
    colors: {
      primary: '#000000',
      secondary: '#666666',
      background: '#ffffff',
      text: '#333333',
      accent: '#0066cc'
    },
    fonts: {
      heading: 'Georgia, serif',
      body: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    },
    spacing: {
      section: '32px',
      element: '16px'
    }
  });

  // Email metadata
  const [emailSettings, setEmailSettings] = useState({
    subject: '',
    preheader: '',
    fromName: '',
    fromEmail: '',
    replyTo: ''
  });

  useEffect(() => {
    // Load sample newsletter data
    console.log('Editor V3: Loading newsletter data...');
    fetch('/sample-newsletter.json')
      .then(res => res.json())
      .then(data => {
        console.log('Editor V3: Newsletter loaded, converting to blocks...');
        setNewsletter(data);
        
        // Convert newsletter to blocks
        const convertedBlocks = convertNewsletterToBlocks(data);
        setBlocks(convertedBlocks);
        
        // Extract email metadata
        const metadata = extractEmailMetadata(data);
        setEmailSettings(metadata);
        
        // Initialize history
        setHistory([convertedBlocks]);
        setHistoryIndex(0);
        
        setLoading(false);
        console.log('Editor V3: Initialized with', convertedBlocks.length, 'blocks');
      })
      .catch(err => {
        console.error('Failed to load newsletter:', err);
        setLoading(false);
        // Initialize with empty state on error
        setHistory([[]]);
        setHistoryIndex(0);
      });
  }, []);

  const updateBlocks = (newBlocks: ContentBlock[]) => {
    setBlocks(newBlocks);
    
    // Add to history
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newBlocks);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const undo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setBlocks(history[historyIndex - 1]);
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setBlocks(history[historyIndex + 1]);
    }
  };

  const exportAsJSON = () => {
    const data = {
      metadata: emailSettings,
      blocks,
      theme
    };
    
    const dataStr = JSON.stringify(data, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', `newsletter-${Date.now()}.json`);
    linkElement.click();
  };

  const exportAsHTML = () => {
    const html = generateNewsletterHTML();
    const dataUri = 'data:text/html;charset=utf-8,'+ encodeURIComponent(html);
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', `newsletter-${Date.now()}.html`);
    linkElement.click();
  };

  const exportAsPDF = async () => {
    const container = document.createElement('div');
    container.style.position = 'absolute';
    container.style.left = '-9999px';
    container.style.width = '600px';
    container.innerHTML = generateNewsletterHTML();
    document.body.appendChild(container);
    
    try {
      const canvas = await html2canvas(container, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      });
      
      const imgWidth = 210;
      const pageHeight = 297;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      
      const pdf = new jsPDF('p', 'mm', 'a4');
      let position = 0;
      
      pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
      
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      
      pdf.save(`newsletter-${Date.now()}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      document.body.removeChild(container);
    }
  };

  const generateNewsletterHTML = () => {
    // This would generate HTML from blocks with theme applied
    return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${emailSettings.subject || 'Newsletter'}</title>
  <style>
    body { 
      font-family: ${theme.fonts.body}; 
      margin: 0; 
      padding: 0; 
      background: ${theme.colors.background}; 
      color: ${theme.colors.text};
    }
    .container { max-width: 600px; margin: 0 auto; background: white; }
    h1, h2, h3, h4, h5, h6 { font-family: ${theme.fonts.heading}; }
    a { color: ${theme.colors.accent}; }
    .button { background: ${theme.colors.primary}; color: white; }
  </style>
</head>
<body>
  <div class="container">
    ${blocks.map(block => renderBlockAsHTML(block)).join('')}
  </div>
</body>
</html>`;
  };

  const renderBlockAsHTML = (block: ContentBlock): string => {
    try {
      // Simplified HTML rendering - would be expanded for each block type
      switch (block.type) {
        case 'text':
          return `<div style="padding: ${theme.spacing.element};">${block.content || ''}</div>`;
        case 'heading':
          const level = (block as any).level || 2;
          const content = (block as any).content || '';
          return `<h${level} style="padding: ${theme.spacing.element};">${content}</h${level}>`;
        case 'button':
          const buttonBlock = block as any;
          return `<div style="text-align: ${buttonBlock.style?.alignment || 'center'}; padding: ${theme.spacing.element};">
            <a href="${buttonBlock.url || '#'}" style="background: ${buttonBlock.style?.backgroundColor || theme.colors.primary}; color: ${buttonBlock.style?.textColor || '#fff'}; padding: ${buttonBlock.style?.padding || '12px 24px'}; border-radius: ${buttonBlock.style?.borderRadius || '4px'}; text-decoration: none; display: inline-block;">
              ${buttonBlock.text || 'Button'}
            </a>
          </div>`;
        default:
          return '';
      }
    } catch (error) {
      console.error('Error rendering block:', error);
      return '';
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-semibold text-gray-900">
                Advanced Newsletter Editor
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
              {/* Theme */}
              <button
                onClick={() => setShowThemePanel(!showThemePanel)}
                className="flex items-center space-x-2 px-3 py-2 text-sm hover:bg-gray-100 rounded-lg"
              >
                <Palette className="w-4 h-4" />
                <span>Theme</span>
              </button>

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
                onClick={() => alert('Saved!')}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
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
        {/* Theme Panel */}
        {showThemePanel && (
          <ThemePanel
            theme={theme}
            onChange={setTheme}
            onClose={() => setShowThemePanel(false)}
          />
        )}

        {/* Editor Panel */}
        <div className={cn(
          "flex-1 overflow-y-auto bg-gray-50",
          showPreview ? "w-1/2" : "w-full"
        )}>
          <div className="p-8 max-w-4xl mx-auto">
            {/* Email Settings */}
            <div className="mb-8 bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-medium mb-4 flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Email Settings
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Subject Line
                  </label>
                  <input
                    type="text"
                    value={emailSettings.subject}
                    onChange={(e) => setEmailSettings({...emailSettings, subject: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Your amazing newsletter"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Preheader Text
                  </label>
                  <input
                    type="text"
                    value={emailSettings.preheader}
                    onChange={(e) => setEmailSettings({...emailSettings, preheader: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Preview text that appears in inbox"
                  />
                </div>
              </div>
            </div>

            {/* Block Editor */}
            <BlockEditor blocks={blocks} onChange={updateBlocks} />
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
                        "p-2 rounded",
                        previewMode === 'desktop' 
                          ? "bg-gray-900 text-white" 
                          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                      )}
                      title="Desktop View"
                    >
                      <Monitor className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setPreviewMode('mobile')}
                      className={cn(
                        "p-2 rounded",
                        previewMode === 'mobile' 
                          ? "bg-gray-900 text-white" 
                          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                      )}
                      title="Mobile View"
                    >
                      <Smartphone className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setPreviewMode('email')}
                      className={cn(
                        "p-2 rounded",
                        previewMode === 'email' 
                          ? "bg-gray-900 text-white" 
                          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                      )}
                      title="Email Client View"
                    >
                      <Mail className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
              
              <div className={cn(
                "mx-auto transition-all duration-300 bg-white",
                previewMode === 'mobile' ? "max-w-[375px]" : "max-w-[600px]",
                previewMode === 'email' && "shadow-lg"
              )}>
                {previewMode === 'email' && (
                  <div className="border-b border-gray-200 p-4 bg-gray-50">
                    <div className="text-xs text-gray-500">From: {emailSettings.fromName || 'Your Brand'}</div>
                    <div className="text-xs text-gray-500">Subject: {emailSettings.subject || 'Newsletter'}</div>
                    {emailSettings.preheader && (
                      <div className="text-xs text-gray-400 mt-1">{emailSettings.preheader}</div>
                    )}
                  </div>
                )}
                
                <div 
                  className="p-8"
                  style={{ 
                    fontFamily: theme.fonts.body,
                    color: theme.colors.text,
                    backgroundColor: theme.colors.background
                  }}
                >
                  {blocks.length === 0 ? (
                    <div className="text-center py-12 text-gray-400">
                      <Mail className="w-12 h-12 mx-auto mb-4" />
                      <p>Add blocks to see preview</p>
                    </div>
                  ) : (
                    <div>
                      {blocks.map((block) => (
                        <BlockPreviewRenderer key={block.id} block={block} theme={theme} />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Template Manager */}
      {showTemplateManager && (
        <TemplateManager
          newsletter={{
            metadata: {
              url: '',
              extraction_timestamp: new Date().toISOString(),
              brand: 'Newsletter',
              title: emailSettings.subject || 'Newsletter',
              subtitle: emailSettings.preheader || '',
              date_sent: new Date().toISOString()
            },
            content: {
              sections: [],
              images: [],
              links: [],
              products: [],
              ctas: []
            },
            summary: {
              total_images: 0,
              total_links: 0,
              total_products: 0,
              total_ctas: 0,
              total_sections: 0
            }
          }}
          onLoad={(loaded) => {
            // Convert newsletter sections to blocks
            const convertedBlocks = convertNewsletterToBlocks(loaded);
            setBlocks(convertedBlocks);
            
            // Update email metadata
            const metadata = extractEmailMetadata(loaded);
            setEmailSettings(metadata);
            
            // Update history
            setHistory([convertedBlocks]);
            setHistoryIndex(0);
            
            setShowTemplateManager(false);
          }}
          onClose={() => setShowTemplateManager(false)}
        />
      )}
    </div>
  );
}