
import { Project, Donation, Campaign, NewsUpdate, ContactMessage } from './types';

export const INITIAL_PROJECTS: Project[] = [
  {
    id: 'p1',
    title: 'Clean Water for Rural Villages',
    description: 'Providing sustainable water filtration systems to communities in sub-Saharan Africa.',
    category: 'Environment',
    goal: 50000,
    currentAmount: 32500,
    imageUrl: 'https://images.unsplash.com/photo-1541544741938-0af808871cc0?auto=format&fit=crop&q=80&w=800',
    createdAt: new Date().toISOString(),
  }
];

export const INITIAL_CAMPAIGNS: Campaign[] = [
  {
    id: 'c1',
    title: 'Winter Survival Kits 2024',
    description: 'Help us provide blankets, heaters, and warm clothes to families in high-altitude regions.',
    goal: 15000,
    currentAmount: 8400,
    deadline: '2024-12-31',
    imageUrl: 'https://images.unsplash.com/photo-1473654729523-203e25dfda10?auto=format&fit=crop&q=80&w=800',
    status: 'urgent'
  },
  {
    id: 'c2',
    title: 'Back to School Drive',
    description: 'Providing school supplies and uniforms for 500 children in urban slums.',
    goal: 5000,
    currentAmount: 4900,
    deadline: '2024-09-01',
    imageUrl: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&q=80&w=800',
    status: 'active'
  }
];

export const INITIAL_NEWS: NewsUpdate[] = [
  {
    id: 'n1',
    title: 'Impact Report: Q3 2024',
    content: 'We are proud to share that over 12,000 lives have been touched this quarter through your generous support.',
    author: 'Admin',
    date: new Date().toISOString(),
    imageUrl: 'https://images.unsplash.com/photo-1531206715517-5c0ba140b2b8?auto=format&fit=crop&q=80&w=800'
  }
];

export const INITIAL_DONATIONS: Donation[] = [
  {
    id: 'd1',
    projectId: 'p1',
    amount: 500,
    donorName: 'Alice Johnson',
    donorEmail: 'alice@example.com',
    date: new Date().toISOString(),
    isAnonymous: false,
    message: 'Happy to support this vital cause!'
  }
];

export const INITIAL_MESSAGES: ContactMessage[] = [
  {
    id: 'm1',
    name: 'John Doe',
    email: 'john@example.com',
    subject: 'Corporate Partnership',
    message: 'I would like to discuss a potential CSR partnership with my company.',
    date: new Date().toISOString(),
    isRead: false
  }
];
