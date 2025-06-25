'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  Mail, 
  Edit, 
  Eye, 
  Download, 
  Palette,
  MousePointer,
  Save,
  Clock,
  Share2,
  Sparkles
} from 'lucide-react';

export default function LandingPage() {
  const [activeTab, setActiveTab] = useState<'viewer' | 'editor'>('viewer');

  const features = [
    {
      icon: <Eye className="w-6 h-6" />,
      title: "Multi-View Preview",
      description: "View newsletters in desktop, mobile, and text-only formats"
    },
    {
      icon: <MousePointer className="w-6 h-6" />,
      title: "Drag & Drop Editor",
      description: "Easily rearrange sections with intuitive drag and drop"
    },
    {
      icon: <Edit className="w-6 h-6" />,
      title: "Inline Editing",
      description: "Click any text or image to edit directly in the preview"
    },
    {
      icon: <Palette className="w-6 h-6" />,
      title: "Style Customization",
      description: "Customize colors, fonts, and spacing to match your brand"
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: "Version History",
      description: "Track changes with undo/redo and version control"
    },
    {
      icon: <Download className="w-6 h-6" />,
      title: "Export Options",
      description: "Export as HTML, JSON, or PDF for any platform"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-2">
              <Mail className="w-8 h-8 text-blue-600" />
              <h1 className="text-xl font-bold text-gray-900">Newsletter Remix</h1>
            </div>
            <nav className="flex items-center space-x-6">
              <Link href="/" className="text-gray-600 hover:text-gray-900">
                Viewer
              </Link>
              <Link href="/editor-v2" className="text-gray-600 hover:text-gray-900">
                Editor
              </Link>
              <Link href="/editor-v3" className="text-gray-600 hover:text-gray-900">
                Advanced Editor
              </Link>
              <Link 
                href="/editor-v3" 
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Get Started
              </Link>
            </nav>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h2 className="text-5xl font-bold text-gray-900 mb-6">
            View & Remix Email Newsletters
          </h2>
          <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
            Extract, view, and creatively remix email newsletters with our powerful editor. 
            Perfect for marketers, designers, and anyone who wants to learn from the best email campaigns.
          </p>
          
          <div className="flex items-center justify-center space-x-4">
            <Link 
              href="/"
              className="bg-white text-blue-600 border-2 border-blue-600 px-8 py-4 rounded-lg font-medium hover:bg-blue-50 transition-colors flex items-center space-x-2"
            >
              <Eye className="w-5 h-5" />
              <span>View Demo</span>
            </Link>
            <Link 
              href="/editor-v2"
              className="bg-blue-600 text-white px-8 py-4 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <Sparkles className="w-5 h-5" />
              <span>Start Remixing</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">
          Powerful Features for Newsletter Creation
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
              <div className="text-blue-600 mb-4">{feature.icon}</div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">
                {feature.title}
              </h4>
              <p className="text-gray-600">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Demo Section */}
      <div className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">
            See It In Action
          </h3>
          
          {/* Tab Navigation */}
          <div className="flex justify-center mb-8">
            <div className="bg-gray-100 rounded-lg p-1 flex">
              <button
                onClick={() => setActiveTab('viewer')}
                className={`px-6 py-2 rounded-md transition-all ${
                  activeTab === 'viewer' 
                    ? 'bg-white text-gray-900 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Newsletter Viewer
              </button>
              <button
                onClick={() => setActiveTab('editor')}
                className={`px-6 py-2 rounded-md transition-all ${
                  activeTab === 'editor' 
                    ? 'bg-white text-gray-900 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Remix Editor
              </button>
            </div>
          </div>

          {/* Demo Content */}
          <div className="bg-gray-50 rounded-xl p-8">
            {activeTab === 'viewer' ? (
              <div className="text-center">
                <h4 className="text-2xl font-semibold text-gray-900 mb-4">
                  Newsletter Viewer
                </h4>
                <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
                  View extracted newsletters in multiple formats. Toggle between desktop, 
                  mobile, and text-only views. Analyze engagement metrics and export in various formats.
                </p>
                <div className="bg-white rounded-lg shadow-lg p-4 max-w-4xl mx-auto">
                  <img 
                    src="/viewer-preview.png" 
                    alt="Newsletter Viewer Preview"
                    className="w-full h-auto rounded"
                    onError={(e) => {
                      e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="800" height="400" viewBox="0 0 800 400"%3E%3Crect width="800" height="400" fill="%23e5e7eb"/%3E%3Ctext x="400" y="200" font-family="Arial" font-size="24" fill="%236b7280" text-anchor="middle" dominant-baseline="middle"%3ENewsletter Viewer Preview%3C/text%3E%3C/svg%3E';
                    }}
                  />
                </div>
              </div>
            ) : (
              <div className="text-center">
                <h4 className="text-2xl font-semibold text-gray-900 mb-4">
                  Remix Editor
                </h4>
                <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
                  Drag and drop sections, edit text inline, replace images, and customize styles. 
                  Track changes with version history and export your remixed newsletters.
                </p>
                <div className="bg-white rounded-lg shadow-lg p-4 max-w-4xl mx-auto">
                  <img 
                    src="/editor-preview.png" 
                    alt="Remix Editor Preview"
                    className="w-full h-auto rounded"
                    onError={(e) => {
                      e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="800" height="400" viewBox="0 0 800 400"%3E%3Crect width="800" height="400" fill="%23e5e7eb"/%3E%3Ctext x="400" y="200" font-family="Arial" font-size="24" fill="%236b7280" text-anchor="middle" dominant-baseline="middle"%3ERemix Editor Preview%3C/text%3E%3C/svg%3E';
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 py-20">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h3 className="text-3xl font-bold text-white mb-6">
            Ready to Create Amazing Newsletters?
          </h3>
          <p className="text-xl text-blue-100 mb-8">
            Start viewing and remixing newsletters today. No credit card required.
          </p>
          <Link 
            href="/editor-v2"
            className="bg-white text-blue-600 px-8 py-4 rounded-lg font-medium hover:bg-gray-100 transition-colors inline-flex items-center space-x-2"
          >
            <Edit className="w-5 h-5" />
            <span>Start Remixing Now</span>
          </Link>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Mail className="w-6 h-6" />
              <span className="font-semibold">Newsletter Remix</span>
            </div>
            <div className="text-gray-400">
              © 2025 Newsletter Remix. Built with Next.js and Tailwind CSS.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}