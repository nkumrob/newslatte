export interface NewsletterMetadata {
  url: string;
  extraction_timestamp: string;
  brand: string;
  title: string;
  subtitle: string;
  date_sent: string;
}

export interface CTA {
  text: string;
  url: string;
}

export interface Section {
  title: string;
  type: 'headline' | 'text' | 'preview_text';
  description?: string;
  content?: string;
  cta?: CTA;
}

export interface NewsletterImage {
  url: string;
  alt: string;
  width?: string;
  type: 'hero' | 'product' | 'general' | 'preview';
}

export interface NewsletterLink {
  url: string;
  text: string;
  category: string;
  tracking?: Record<string, string>;
}

export interface Product {
  name: string;
  image: string;
  link: string;
  description?: string;
}

export interface NewsletterContent {
  sections: Section[];
  images: NewsletterImage[];
  links: NewsletterLink[];
  products: Product[];
  ctas: CTA[];
  raw_html?: string;
}

export interface NewsletterSummary {
  total_images: number;
  total_links: number;
  total_products: number;
  total_ctas: number;
  total_sections: number;
  extraction_method?: string;
}

export interface Newsletter {
  id?: string;
  metadata: NewsletterMetadata;
  content: NewsletterContent;
  summary: NewsletterSummary;
}

export interface Remix {
  id: string;
  newsletter_id: string;
  name: string;
  created_at: string;
  updated_at: string;
  changes: Change[];
  thumbnail?: string;
  content: NewsletterContent;
}

export interface Change {
  type: 'text' | 'image' | 'style' | 'structure';
  target: string;
  before: any;
  after: any;
  timestamp: string;
}