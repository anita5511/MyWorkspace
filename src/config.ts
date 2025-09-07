
// workspace/src/config.ts
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:12000';


// App constants
export const APP_NAME = 'Swarup Workspace';

// Workspace Apps
export interface WorkspaceApp {
  id: string;
  name: string;
  description: string;
  icon: string;
  url: string;
  color: string;
}

export const WORKSPACE_APPS: WorkspaceApp[] = [
  {
    id: 'docs',
    name: 'Swarup Docs',
    description: 'Create and edit documents with real-time collaboration',
    icon: 'file-text',
    url: 'https://docs.swarupworkspace.com',
    color: '#4285F4'
  },
  {
    id: 'sheets',
    name: 'Swarup Sheets',
    description: 'Create and analyze spreadsheets with powerful formulas',
    icon: 'table',
    url: 'https://sheets.swarupworkspace.com',
    color: '#0F9D58'
  },
  {
    id: 'slides',
    name: 'Swarup Slides',
    description: 'Create beautiful presentations with dynamic content',
    icon: 'layout',
    url: 'https://slides.swarupworkspace.com',
    color: '#F4B400'
  },
  {
    id: 'mail',
    name: 'Swarup Mail',
    description: 'Powerful email client with intelligent features',
    icon: 'mail',
    url: 'https://mail.swarupworkspace.com',
    color: '#DB4437'
  },
  {
    id: 'chat',
    name: 'Swarup Chat',
    description: 'Team communication platform with channels and direct messages',
    icon: 'message-circle',
    url: 'https://chat.swarupworkspace.com',
    color: '#1E88E5'
  },
  {
    id: 'drive',
    name: 'Swarup Drive',
    description: 'Cloud storage for all your files with easy sharing',
    icon: 'hard-drive',
    url: 'https://swarupdrive.vercel.app/dashboard',
    color: '#FFC107'
  },
  {
    id: 'calendar',
    name: 'Swarup Calendar',
    description: 'Schedule meetings and manage events with team calendars',
    icon: 'calendar',
    url: 'https://calendar.swarupworkspace.com',
    color: '#8E24AA'
  },

  {
    id: 'codespace',
    name: 'Codespace',
    url: 'https://swarupcodespace.vercel.app',
    icon: 'code',
    color: '#10B981'
  },
  {
    id: 'podcastpro',
    name: 'PodcastPro',
    url: 'https://swarup-podcast.vercel.app',
    icon: 'mic',
    color: '#F59E0B'
  },

  {
    id: 'music',
    name: 'Swarup Music',
    route: '/music',       
    icon: 'music',
    url:  'https://swarupmusic.vercel.app/',
    color: '#10B981',
  },
  {
    id: 'play',
    name: 'Swarup Play',
    route: '/play', 
    icon: 'play-circle',
    url:  'https://swarupplay-play3.vercel.app',
    color: '#EF4444',
  },
];

// Pricing plans
export interface PricingPlan {
  id: string;
  name: string;
  price: number;
  frequency: string;
  description: string;
  features: string[];
  cta: string;
  popular?: boolean;
}

export const PRICING_PLANS: PricingPlan[] = [
  {
    id: 'basic',
    name: 'Basic',
    price: 0,
    frequency: 'month',
    description: 'Perfect for individuals and small projects',
    features: [
      '3 Workspace apps',
      '5GB storage',
      'Up to 10 users',
      'Basic support',
      'Limited collaboration features',
    ],
    cta: 'Start Free',
  },
  {
    id: 'business',
    name: 'Business',
    price: 12,
    frequency: 'month',
    description: 'Ideal for businesses and growing teams',
    features: [
      'All Workspace apps',
      '100GB storage per user',
      'Unlimited users',
      'Priority support',
      'Advanced collaboration',
      'Admin controls',
      'Security features',
    ],
    cta: 'Try Free for 30 Days',
    popular: true,
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 24,
    frequency: 'month',
    description: 'For organizations with advanced needs',
    features: [
      'All Workspace apps',
      'Unlimited storage',
      'Unlimited users',
      '24/7 premium support',
      'Advanced security controls',
      'Custom integrations',
      'API access',
      'Compliance monitoring',
    ],
    cta: 'Contact Sales',
  },
];

// Team members
export interface TeamMember {
  id: string;
  name: string;
  role: string;
  image: string;
  bio: string;
  social: {
    twitter?: string;
    linkedin?: string;
    github?: string;
  };
}

export const TEAM_MEMBERS: TeamMember[] = [
  {
    id: '1',
    name: 'Swarup Kotal',
    role: 'Founder & CEO',
    image: "/assets/swarup.jpg",
    bio: 'MTech IT student of IIIT Allahabad. Full Stack Web Developer, Passionate about creating AI tools that enhance productivity.',
    social: {
      twitter: 'https://twitter.com',
      linkedin: 'https://www.linkedin.com/in/swarup-kotal-4ab0502597jjnfjernflkerfrf',
      github: 'https://github.com/Worldikoswarup1',
    },
  },
  {
    id: '2',
    name: 'Priya Sharma',
    role: 'CTO',
    image: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
    bio: 'Tech genius with expertise in cloud infrastructure and scalable systems. Building the future of collaborative software.',
    social: {
      twitter: 'https://twitter.com/priyasharma',
      linkedin: 'https://linkedin.com/in/priyasharma',
      github: 'https://github.com/priyasharma',
    },
  },
  {
    id: '3',
    name: 'Raj Patel',
    role: 'Head of Product',
    image: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
    bio: 'Product visionary focused on creating intuitive user experiences. Always keeping users at the heart of every feature.',
    social: {
      twitter: 'https://twitter.com/rajpatel',
      linkedin: 'https://linkedin.com/in/rajpatel',
    },
  },
  {
    id: '4',
    name: 'Ananya Gupta',
    role: 'Lead Designer',
    image: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
    bio: 'Design expert with an eye for detail and passion for creating beautiful, functional interfaces that users love.',
    social: {
      twitter: 'https://twitter.com/ananyagupta',
      linkedin: 'https://linkedin.com/in/ananyagupta',
    },
  },
];
