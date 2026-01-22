import { 
  Briefcase, 
  GraduationCap, 
  User, 
  Code, 
  Heart, 
  Wallet, 
  Users, 
  Home, 
  BookOpen, 
  Plane, 
  Settings 
} from 'lucide-react'

export const ALL_DOMAINS = [
  'work',
  'university',
  'personal',
  'coding',
  'health',
  'finance',
  'social',
  'home',
  'study',
  'travel',
  'administration'
] as const

export const DOMAIN_COLORS: Record<string, string> = {
  work: '#3B82F6',          // Blue
  university: '#A855F7',    // Purple
  personal: '#06B6D4',      // Cyan
  coding: '#64748B',        // Slate
  health: '#10B981',        // Green
  finance: '#F59E0B',       // Yellow/Amber
  social: '#F97316',        // Orange
  home: '#EF4444',          // Red
  study: '#6366F1',         // Indigo
  travel: '#0EA5E9',        // Sky
  administration: '#6B7280' // Gray
}

export const DOMAIN_ICONS = {
  work: Briefcase,
  university: GraduationCap,
  personal: User,
  coding: Code,
  health: Heart,
  finance: Wallet,
  social: Users,
  home: Home,
  study: BookOpen,
  travel: Plane,
  administration: Settings
}