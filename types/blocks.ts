import { CTA } from './newsletter';

export type BlockType = 
  | 'text'
  | 'heading'
  | 'image'
  | 'button'
  | 'divider'
  | 'spacer'
  | 'columns'
  | 'product'
  | 'social'
  | 'video'
  | 'quote'
  | 'html';

export interface BaseBlock {
  id: string;
  type: BlockType;
  order: number;
}

export interface TextBlock extends BaseBlock {
  type: 'text';
  content: string;
  style?: {
    fontSize?: string;
    fontFamily?: string;
    color?: string;
    lineHeight?: string;
    textAlign?: 'left' | 'center' | 'right';
  };
}

export interface HeadingBlock extends BaseBlock {
  type: 'heading';
  content: string;
  level: 1 | 2 | 3 | 4 | 5 | 6;
  style?: {
    fontSize?: string;
    fontFamily?: string;
    color?: string;
    textAlign?: 'left' | 'center' | 'right';
  };
}

export interface ImageBlock extends BaseBlock {
  type: 'image';
  src: string;
  alt: string;
  link?: string;
  style?: {
    width?: string;
    maxWidth?: string;
    alignment?: 'left' | 'center' | 'right';
    borderRadius?: string;
    padding?: string;
  };
}

export interface ButtonBlock extends BaseBlock {
  type: 'button';
  text: string;
  url: string;
  style?: {
    backgroundColor?: string;
    textColor?: string;
    borderRadius?: string;
    fontSize?: string;
    fontWeight?: string;
    padding?: string;
    alignment?: 'left' | 'center' | 'right';
    width?: 'auto' | 'full';
  };
}

export interface DividerBlock extends BaseBlock {
  type: 'divider';
  style?: {
    borderColor?: string;
    borderWidth?: string;
    borderStyle?: 'solid' | 'dashed' | 'dotted';
    margin?: string;
  };
}

export interface SpacerBlock extends BaseBlock {
  type: 'spacer';
  height: string;
}

export interface Column {
  blocks: ContentBlock[];
  width?: string;
}

export interface ColumnsBlock extends BaseBlock {
  type: 'columns';
  columns: Column[];
  style?: {
    gap?: string;
    stackOnMobile?: boolean;
  };
}

export interface ProductBlock extends BaseBlock {
  type: 'product';
  name: string;
  image: string;
  description?: string;
  price?: string;
  link: string;
  style?: {
    layout?: 'vertical' | 'horizontal';
    imagePosition?: 'left' | 'right' | 'top';
    backgroundColor?: string;
    borderRadius?: string;
    padding?: string;
  };
}

export interface SocialBlock extends BaseBlock {
  type: 'social';
  networks: {
    platform: 'facebook' | 'twitter' | 'instagram' | 'linkedin' | 'youtube' | 'tiktok';
    url: string;
    icon?: string;
  }[];
  style?: {
    iconSize?: string;
    iconColor?: string;
    alignment?: 'left' | 'center' | 'right';
    spacing?: string;
  };
}

export interface VideoBlock extends BaseBlock {
  type: 'video';
  url: string;
  thumbnail: string;
  platform?: 'youtube' | 'vimeo' | 'custom';
  style?: {
    aspectRatio?: string;
    borderRadius?: string;
  };
}

export interface QuoteBlock extends BaseBlock {
  type: 'quote';
  content: string;
  author?: string;
  style?: {
    fontSize?: string;
    fontStyle?: string;
    color?: string;
    borderLeftColor?: string;
    backgroundColor?: string;
    padding?: string;
  };
}

export interface HtmlBlock extends BaseBlock {
  type: 'html';
  content: string;
}

export type ContentBlock = 
  | TextBlock
  | HeadingBlock
  | ImageBlock
  | ButtonBlock
  | DividerBlock
  | SpacerBlock
  | ColumnsBlock
  | ProductBlock
  | SocialBlock
  | VideoBlock
  | QuoteBlock
  | HtmlBlock;