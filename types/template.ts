export interface NewsletterTemplate {
  id: string;
  name: string;
  description: string;
  thumbnail?: string;
  newsletter: any; // Newsletter type
  category: 'promotional' | 'informational' | 'transactional' | 'custom';
  createdAt: Date;
  updatedAt: Date;
}

export interface TemplateCategory {
  id: string;
  name: string;
  description: string;
  templates: NewsletterTemplate[];
}