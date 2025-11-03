import { LucideIcon } from 'lucide-react';

interface LeaderSummaryCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  color: string;
  bgColor: string;
  textColor: string;
}

export default function LeaderSummaryCard({
  title,
  value,
  icon: Icon,
  color,
  bgColor,
  textColor
}: LeaderSummaryCardProps) {
  return (
    <div className={`${bgColor} rounded-lg p-4 border border-gray-200 bg-slate-600`}>
      <div className="flex items-center justify-between">
        <div>
          <p className={`text-sm font-medium ${textColor}`}>
            {title}
          </p>
          <p className={`text-2xl font-bold ${textColor} mt-1`}>
            {value}
          </p>
        </div>
        <div className={`${color} p-2 rounded-lg`}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </div>
  );
}
