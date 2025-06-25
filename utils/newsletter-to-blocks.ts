import { Newsletter, Section } from '@/types/newsletter';
import { ContentBlock, BlockType } from '@/types/blocks';
import { v4 as uuidv4 } from 'uuid';

export function convertNewsletterToBlocks(newsletter: Newsletter): ContentBlock[] {
  const blocks: ContentBlock[] = [];
  let order = 0;

  // Nike newsletter specific layout structure:
  // 1. First hero image
  // 2. First section (with left-aligned content)
  // 3. Second hero image
  // 4. Second section (with left-aligned content)
  // 5. Product grid (2 columns)

  const heroImages = newsletter.content.images.filter(img => img.type === 'hero');
  const productImages = newsletter.content.images.filter(img => img.type === 'product');

  // Add first hero image
  if (heroImages[0]) {
    blocks.push({
      id: uuidv4(),
      type: 'image',
      order: order++,
      src: heroImages[0].url,
      alt: heroImages[0].alt || '',
      style: {
        maxWidth: '100%',
        alignment: 'center',
        padding: '0'
      }
    });
  }

  // Add first section (Elevate His Game)
  if (newsletter.content.sections[0]) {
    const section = newsletter.content.sections[0];
    
    // Section container with padding
    blocks.push({
      id: uuidv4(),
      type: 'spacer',
      order: order++,
      height: '2em'
    });

    blocks.push({
      id: uuidv4(),
      type: 'heading',
      order: order++,
      content: section.title,
      level: 2,
      style: {
        fontSize: '1.05em',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
        textAlign: 'left',
        color: '#2d4156',
        fontWeight: '400'
      }
    });

    if (section.description) {
      blocks.push({
        id: uuidv4(),
        type: 'text',
        order: order++,
        content: `<p>${section.description}</p>`,
        style: {
          fontSize: '0.9em',
          lineHeight: '1.5em',
          color: '#40505a',
          textAlign: 'left',
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
        }
      });
    }

    if (section.cta) {
      blocks.push({
        id: uuidv4(),
        type: 'button',
        order: order++,
        text: section.cta.text,
        url: section.cta.url,
        style: {
          backgroundColor: '#253b48',
          textColor: '#ffffff',
          borderRadius: '4px',
          fontSize: '0.82em',
          fontWeight: '400',
          padding: '1em 1.7em',
          alignment: 'left',
          width: 'auto',
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
        }
      });
    }

    blocks.push({
      id: uuidv4(),
      type: 'spacer',
      order: order++,
      height: '2.5em'
    });
  }

  // Add second hero image
  if (heroImages[1]) {
    blocks.push({
      id: uuidv4(),
      type: 'image',
      order: order++,
      src: heroImages[1].url,
      alt: heroImages[1].alt || '',
      style: {
        maxWidth: '100%',
        alignment: 'center',
        padding: '0'
      }
    });
  }

  // Add second section (Gift Card)
  if (newsletter.content.sections[1]) {
    const section = newsletter.content.sections[1];
    
    blocks.push({
      id: uuidv4(),
      type: 'spacer',
      order: order++,
      height: '2em'
    });

    blocks.push({
      id: uuidv4(),
      type: 'heading',
      order: order++,
      content: section.title,
      level: 2,
      style: {
        fontSize: '1.05em',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
        textAlign: 'left',
        color: '#2d4156',
        fontWeight: '400'
      }
    });

    if (section.description) {
      blocks.push({
        id: uuidv4(),
        type: 'text',
        order: order++,
        content: `<p>${section.description}</p>`,
        style: {
          fontSize: '0.9em',
          lineHeight: '1.5em',
          color: '#40505a',
          textAlign: 'left',
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
        }
      });
    }

    if (section.cta) {
      blocks.push({
        id: uuidv4(),
        type: 'button',
        order: order++,
        text: section.cta.text,
        url: section.cta.url,
        style: {
          backgroundColor: '#253b48',
          textColor: '#ffffff',
          borderRadius: '4px',
          fontSize: '0.82em',
          fontWeight: '400',
          padding: '1em 1.7em',
          alignment: 'left',
          width: 'auto',
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
        }
      });
    }
  }

  // Add products in a 2-column grid layout
  if (newsletter.content.products.length > 0) {
    blocks.push({
      id: uuidv4(),
      type: 'spacer',
      order: order++,
      height: '3em'
    });

    // Create a columns block for the product grid
    const productPairs: any[] = [];
    for (let i = 0; i < newsletter.content.products.length; i += 2) {
      const leftProduct = newsletter.content.products[i];
      const rightProduct = newsletter.content.products[i + 1];
      
      const columnBlocks: ContentBlock[] = [];
      
      // Left column
      columnBlocks.push({
        blocks: [{
          id: uuidv4(),
          type: 'image',
          order: 0,
          src: leftProduct.image,
          alt: leftProduct.name,
          link: leftProduct.link || '#',
          style: {
            maxWidth: '100%',
            alignment: 'center'
          }
        }, {
          id: uuidv4(),
          type: 'text',
          order: 1,
          content: `<p style="text-align: center; margin-top: 8px;">${leftProduct.name}</p>`,
          style: {
            fontSize: '0.9em',
            textAlign: 'center',
            color: '#2d4156',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
          }
        }],
        width: '50%'
      });
      
      // Right column (if exists)
      if (rightProduct) {
        columnBlocks.push({
          blocks: [{
            id: uuidv4(),
            type: 'image',
            order: 0,
            src: rightProduct.image,
            alt: rightProduct.name,
            link: rightProduct.link || '#',
            style: {
              maxWidth: '100%',
              alignment: 'center'
            }
          }, {
            id: uuidv4(),
            type: 'text',
            order: 1,
            content: `<p style="text-align: center; margin-top: 8px;">${rightProduct.name}</p>`,
            style: {
              fontSize: '14px',
              textAlign: 'center'
            }
          }],
          width: '50%'
        });
      }
      
      blocks.push({
        id: uuidv4(),
        type: 'columns',
        order: order++,
        columns: columnBlocks,
        style: {
          gap: '16px',
          stackOnMobile: true
        }
      });
      
      // Add spacing between product rows
      if (i + 2 < newsletter.content.products.length) {
        blocks.push({
          id: uuidv4(),
          type: 'spacer',
          order: order++,
          height: '1.5em'
        });
      }
    }
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