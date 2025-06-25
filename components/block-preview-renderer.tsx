'use client';

import { ContentBlock } from '@/types/blocks';
import { Play } from 'lucide-react';

interface BlockPreviewRendererProps {
  block: ContentBlock;
  theme: {
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
  };
}

export function BlockPreviewRenderer({ block, theme }: BlockPreviewRendererProps) {
  switch (block.type) {
    case 'text':
      return (
        <div 
          style={{ padding: theme.spacing.element }}
          dangerouslySetInnerHTML={{ __html: block.content }}
        />
      );

    case 'heading':
      const HeadingTag = `h${block.level}` as keyof JSX.IntrinsicElements;
      return (
        <HeadingTag 
          style={{ 
            padding: theme.spacing.element,
            fontFamily: theme.fonts.heading,
            textAlign: block.style?.textAlign || 'left',
            color: block.style?.color || theme.colors.text
          }}
        >
          {block.content}
        </HeadingTag>
      );

    case 'image':
      return (
        <div 
          style={{ 
            padding: theme.spacing.element,
            textAlign: block.style?.alignment || 'center'
          }}
        >
          {block.link ? (
            <a href={block.link}>
              <img 
                src={block.src} 
                alt={block.alt}
                style={{
                  maxWidth: block.style?.maxWidth || '100%',
                  borderRadius: block.style?.borderRadius,
                  display: 'inline-block'
                }}
              />
            </a>
          ) : (
            <img 
              src={block.src} 
              alt={block.alt}
              style={{
                maxWidth: block.style?.maxWidth || '100%',
                borderRadius: block.style?.borderRadius,
                display: 'inline-block'
              }}
            />
          )}
        </div>
      );

    case 'button':
      return (
        <div 
          style={{ 
            textAlign: block.style?.alignment || 'center',
            padding: theme.spacing.element
          }}
        >
          <a 
            href={block.url}
            style={{
              backgroundColor: block.style?.backgroundColor || theme.colors.primary,
              color: block.style?.textColor || '#ffffff',
              padding: block.style?.padding || '12px 24px',
              borderRadius: block.style?.borderRadius || '24px',
              fontSize: block.style?.fontSize || '16px',
              fontWeight: block.style?.fontWeight || 'normal',
              textDecoration: 'none',
              display: block.style?.width === 'full' ? 'block' : 'inline-block',
              textAlign: 'center'
            }}
          >
            {block.text}
          </a>
        </div>
      );

    case 'divider':
      return (
        <div style={{ margin: block.style?.margin || theme.spacing.section }}>
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
      );

    case 'spacer':
      return <div style={{ height: block.height }} />;

    case 'product':
      const isHorizontal = block.style?.layout === 'horizontal';
      return (
        <div 
          style={{
            padding: block.style?.padding || theme.spacing.element,
            backgroundColor: block.style?.backgroundColor || '#f9f9f9',
            borderRadius: block.style?.borderRadius || '8px',
            margin: theme.spacing.element,
            display: isHorizontal ? 'flex' : 'block',
            flexDirection: block.style?.imagePosition === 'right' ? 'row-reverse' : 'row',
            gap: '16px'
          }}
        >
          <div style={{ flex: isHorizontal ? '0 0 33%' : '1' }}>
            <img 
              src={block.image} 
              alt={block.name}
              style={{ width: '100%', borderRadius: '8px' }}
            />
          </div>
          <div style={{ flex: '1' }}>
            <h3 style={{ marginBottom: '8px', fontFamily: theme.fonts.heading }}>
              {block.name}
            </h3>
            {block.description && (
              <p style={{ color: theme.colors.secondary, marginBottom: '8px' }}>
                {block.description}
              </p>
            )}
            {block.price && (
              <p style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '12px' }}>
                {block.price}
              </p>
            )}
            <a 
              href={block.link}
              style={{
                display: 'inline-block',
                backgroundColor: theme.colors.primary,
                color: 'white',
                padding: '8px 16px',
                borderRadius: '4px',
                textDecoration: 'none'
              }}
            >
              View Product
            </a>
          </div>
        </div>
      );

    case 'social':
      return (
        <div 
          style={{ 
            textAlign: block.style?.alignment || 'center',
            padding: theme.spacing.element
          }}
        >
          {/* Simplified social icons - in production would use actual icon fonts/SVGs */}
          <div style={{ display: 'inline-flex', gap: block.style?.spacing || '16px' }}>
            {block.networks.map((network, i) => (
              <a 
                key={i}
                href={network.url}
                style={{
                  color: block.style?.iconColor || theme.colors.text,
                  fontSize: block.style?.iconSize || '32px'
                }}
              >
                {network.platform[0].toUpperCase()}
              </a>
            ))}
          </div>
        </div>
      );

    case 'video':
      return (
        <div style={{ padding: theme.spacing.element }}>
          <div 
            style={{ 
              position: 'relative',
              borderRadius: block.style?.borderRadius || '8px',
              overflow: 'hidden'
            }}
          >
            <img src={block.thumbnail} alt="Video" style={{ width: '100%' }} />
            <div 
              style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'rgba(0,0,0,0.4)'
              }}
            >
              <div 
                style={{
                  backgroundColor: 'white',
                  borderRadius: '50%',
                  padding: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Play fill="black" color="black" />
              </div>
            </div>
          </div>
        </div>
      );

    case 'quote':
      return (
        <blockquote
          style={{
            borderLeftWidth: '4px',
            borderLeftStyle: 'solid',
            borderLeftColor: block.style?.borderLeftColor || theme.colors.primary,
            backgroundColor: block.style?.backgroundColor || '#f5f5f5',
            padding: block.style?.padding || '24px',
            margin: theme.spacing.element,
            fontSize: block.style?.fontSize || '18px',
            fontStyle: block.style?.fontStyle || 'italic',
            color: block.style?.color || theme.colors.secondary
          }}
        >
          <p style={{ marginBottom: '8px' }}>{block.content}</p>
          {block.author && (
            <footer style={{ fontSize: '14px', marginTop: '16px' }}>
              — {block.author}
            </footer>
          )}
        </blockquote>
      );

    case 'html':
      return (
        <div 
          style={{ padding: theme.spacing.element }}
          dangerouslySetInnerHTML={{ __html: block.content }}
        />
      );

    default:
      return null;
  }
}