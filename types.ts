
export interface Project {
  id: string;
  title: string;
  description: string;
  category: 'Education' | 'Health' | 'Environment' | 'Disaster Relief' | 'Community';
  goal: number;
  currentAmount: number;
  imageUrl: string;
  createdAt: string;
}

export interface Campaign {
  id: string;
  title: string;
  description: string;
  goal: number;
  currentAmount: number;
  deadline: string;
  imageUrl: string;
  status: 'active' | 'completed' | 'urgent';
}

export interface Donation {
  id: string;
  projectId?: string;
  campaignId?: string;
  amount: number;
  donorName: string;
  donorEmail: string;
  date: string;
  message?: string;
  isAnonymous: boolean;
  paymentMethod?: string;
}

export interface NewsUpdate {
  id: string;
  title: string;
  content: string;
  author: string;
  date: string;
  imageUrl?: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  date: string;
  isRead: boolean;
}

export interface PaymentMethod {
  id: string;
  name: string;
  type: 'Credit Card' | 'PayPal' | 'Bank Transfer' | 'Crypto';
  isActive: boolean;
}

export interface SiteSettings {
  logoUrl: string;
  heroImageUrl: string;
  organizationName: string;
  primaryColor: string;
  heroTitle: string;
  heroSubtitle: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
}

export interface AppState {
  projects: Project[];
  campaigns: Campaign[];
  donations: Donation[];
  news: NewsUpdate[];
  messages: ContactMessage[];
  paymentMethods: PaymentMethod[];
  settings: SiteSettings;
}

export enum Page {
  HOME = 'home',
  ABOUT = 'about',
  PROJECTS = 'projects',
  CAMPAIGNS = 'campaigns',
  DONATE = 'donate',
  CONTACT = 'contact',
  ADMIN = 'admin'
}
