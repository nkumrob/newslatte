import { Newsletter, Section } from '@/types/newsletter';
import { ContentBlock, BlockType } from '@/types/blocks';
import { v4 as uuidv4 } from 'uuid';

export function convertNewsletterToBlocks(newsletter: Newsletter): ContentBlock[] {
  const blocks: ContentBlock[] = [];
  let order = 0;

  // Add hero images as image blocks
  newsletter.content.images
    .filter(img => img.type === 'hero')
    .forEach((image) => {
      blocks.push({
        id: uuidv4(),
        type: 'image',
        order: order++,
        src: image.url,
        alt: image.alt || '',
        style: {
          maxWidth: '100%',
          alignment: 'center'
        }
      });
    });

  // Add a spacer after hero images if they exist
  if (newsletter.content.images.filter(img => img.type === 'hero').length > 0) {
    blocks.push({
      id: uuidv4(),
      type: 'spacer',
      order: order++,
      height: '32px'
    });
  }

  // Convert sections to blocks
  newsletter.content.sections.forEach((section, index) => {
    // Add heading block
    blocks.push({
      id: uuidv4(),
      type: 'heading',
      order: order++,
      content: section.title,
      level: 2,
      style: {
        fontSize: '28px',
        textAlign: 'left'
      }
    });

    // Add text block if description exists
    if (section.description) {
      blocks.push({
        id: uuidv4(),
        type: 'text',
        order: order++,
        content: `<p>${section.description}</p>`,
        style: {
          fontSize: '16px',
          color: '#666666'
        }
      });
    }

    // Add button block if CTA exists
    if (section.cta) {
      blocks.push({
        id: uuidv4(),
        type: 'button',
        order: order++,
        text: section.cta.text,
        url: section.cta.url,
        style: {
          backgroundColor: '#000000',
          textColor: '#ffffff',
          borderRadius: '24px',
          fontSize: '16px',
          padding: '12px 24px',
          alignment: 'left'
        }
      });
    }

    // Add spacer between sections
    if (index < newsletter.content.sections.length - 1) {
      blocks.push({
        id: uuidv4(),
        type: 'spacer',
        order: order++,
        height: '48px'
      });
    }
  });

  // Add products if they exist
  if (newsletter.content.products.length > 0) {
    // Add divider before products
    blocks.push({
      id: uuidv4(),
      type: 'divider',
      order: order++,
      style: {
        borderColor: '#e5e5e5',
        borderWidth: '1px',
        borderStyle: 'solid',
        margin: '48px 0'
      }
    });

    // Add products heading
    blocks.push({
      id: uuidv4(),
      type: 'heading',
      order: order++,
      content: 'Featured Products',
      level: 2,
      style: {
        fontSize: '28px',
        textAlign: 'center'
      }
    });

    // Add product blocks
    newsletter.content.products.forEach((product) => {
      blocks.push({
        id: uuidv4(),
        type: 'product',
        order: order++,
        name: product.name,
        image: product.image,
        description: product.description || '',
        price: '', // Not in original data
        link: product.link || '#',
        style: {
          layout: 'vertical',
          backgroundColor: '#f9f9f9',
          borderRadius: '8px',
          padding: '16px'
        }
      });
    });
  }

  return blocks;
}

export function extractEmailMetadata(newsletter: Newsletter) {
  return {
    subject: newsletter.metadata.title,
    preheader: newsletter.metadata.subtitle,
    fromName: newsletter.metadata.brand,
    fromEmail: `newsletter@${newsletter.metadata.brand.toLowerCase().replace(/\s+/g, '')}.com`,
    replyTo: ''
  };
}