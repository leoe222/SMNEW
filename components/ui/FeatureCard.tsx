import { LucideIcon } from 'lucide-react';
import { Card, CardContent } from './card';

interface FeatureCardProps {
  title: string;
  icon: LucideIcon;
  color: string;
  description?: string;
}

const FeatureCard = ({ title, icon: Icon, color, description }: FeatureCardProps) => {
  return (
    <Card className="text-center hover:shadow-lg transition-shadow duration-200">
      <CardContent className="p-6">
        <div className="flex flex-col items-center space-y-4">
          <div 
            className="w-16 h-16 rounded-full flex items-center justify-center"
            style={{ backgroundColor: `${color}20`, border: `2px solid ${color}` }}
          >
            <Icon 
              size={32} 
              style={{ color }}
            />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {title}
            </h3>
            {description && (
              <p className="text-sm text-gray-600">
                {description}
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FeatureCard;
