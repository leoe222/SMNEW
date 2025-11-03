import type { LucideIcon } from "lucide-react"

interface SectionHeaderProps {
  icon: LucideIcon
  title: string
  subtitle: string
  iconColor?: string
}

export default function SectionHeader({ icon: Icon, title, subtitle, iconColor = "text-gray-700" }: SectionHeaderProps) {
  return (
    <div className="mb-6">
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-md bg-gray-100">
          <Icon className={`h-5 w-5 ${iconColor}`} />
        </div>
        <div>
          <h3 className="text-base font-semibold text-gray-800 leading-tight">{title}</h3>
          <p className="text-sm text-gray-500 mt-1 leading-snug max-w-prose">{subtitle}</p>
        </div>
      </div>
    </div>
  )
}
