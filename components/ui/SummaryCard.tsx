import { Card, CardContent } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';

interface SummaryCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  bgColor: string;
  textColor: string;
  iconColor: string;
}

export default function SummaryCard({ 
  title, 
  value, 
  icon: Icon, 
  bgColor, 
  textColor, 
  iconColor 
}: SummaryCardProps) {
  return (
    <Card className={`${bgColor} border-0 shadow-lg`}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className={`text-xs font-medium ${textColor} mb-1`}>
              {title}
            </p>
            <p className={`text-xl font-bold ${textColor}`}>
              {value}
            </p>
          </div>
          <div className={`${iconColor} p-2 rounded-full`}>
            <Icon className="h-5 w-5 text-white" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
