import { LucideIcon } from 'lucide-react';
import { ReactNode } from 'react';

interface CenteredContentProps {
  icon: LucideIcon;
  title: string;
  subtitle: string;
  children?: ReactNode;
  iconColor?: string;
  iconSize?: string;
}

export default function CenteredContent({ 
  icon: Icon, 
  title, 
  subtitle, 
  children,
  iconColor = "text-blue-600",
  iconSize = "h-24 w-24"
}: CenteredContentProps) {
  return (
    <div className="text-center py-12">
      <div className="flex justify-center mb-6">
        <Icon className={`${iconSize} ${iconColor}`} />
      </div>
      
      <h3 className="text-3xl font-bold text-gray-900 mb-2">
        {title}
      </h3>
      
      <p className="text-lg text-gray-600 mb-8">
        {subtitle}
      </p>
      
      {children}
    </div>
  );
}
