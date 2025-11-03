import { Palette, Users, Trophy, LucideIcon } from 'lucide-react';

export interface Feature {
  title: string;
  icon: LucideIcon;
  color: string;
  description: string;
}

export const loginFeatures: Feature[] = [
  {
    title: 'Skills Design',
    icon: Palette,
    color: '#3B82F6',
    description: 'Diseña y desarrolla tus habilidades técnicas'
  },
  {
    title: 'Colaboración',
    icon: Users,
    color: '#10B981',
    description: 'Trabaja en equipo y comparte conocimientos'
  },
  {
    title: 'Gamificación',
    icon: Trophy,
    color: '#F59E0B',
    description: 'Convierte tu desarrollo en un juego'
  }
];
