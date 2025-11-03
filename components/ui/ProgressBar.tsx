interface ProgressBarProps {
  progress: number
  color: string
  level: string
}

export default function ProgressBar({ progress, color, level }: ProgressBarProps) {
  const getLevelColor = (level: string) => {
    const numLevel = Number.parseInt(level)
    switch (numLevel) {
      case 0:
        return "text-gray-600 bg-gray-100" // No familiarizado
      case 1:
        return "text-gray-600 bg-gray-100" // Comprendo
      case 2:
        return "text-green-700 bg-green-100" // En desarrollo
      case 3:
        return "text-green-700 bg-green-200" // Autónomo
      case 4:
        return "text-green-800 bg-green-300" // Promuevo
      case 5:
        return "text-green-900 bg-green-400" // Transformo
      default:
        return "text-gray-600 bg-gray-100"
    }
  }

  const getProgressColor = (level: string) => {
    const numLevel = Number.parseInt(level)
    switch (numLevel) {
      case 0:
        return "bg-gray-300" // No familiarizado
      case 1:
        return "bg-gray-400" // Comprendo
      case 2:
        return "bg-green-400" // En desarrollo
      case 3:
        return "bg-green-500" // Autónomo
      case 4:
        return "bg-green-600" // Promuevo
      case 5:
        return "bg-green-700" // Transformo
      default:
        return "bg-gray-300"
    }
  }

  const getLevelLabel = (level: string) => {
    const numLevel = Number.parseInt(level)
    switch (numLevel) {
      case 0:
        return "No familiarizado"
      case 1:
        return "Comprendo"
      case 2:
        return "En desarrollo"
      case 3:
        return "Autónomo"
      case 4:
        return "Promuevo"
      case 5:
        return "Transformo"
      default:
        return level
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-end">
        <span className={`text-xs px-2 py-1 rounded-full font-medium ${getLevelColor(level)}`}>
          {getLevelLabel(level)}
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(level)}`}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  )
}
