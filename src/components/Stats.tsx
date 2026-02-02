import { calculateStreak, calculateTotalComplete } from '../utils/storage'
import type { DaysData } from '../utils/storage'
import './Stats.css'

interface StatsProps {
  startDate: Date
  daysData: DaysData
}

export default function Stats({ startDate, daysData }: StatsProps) {
  const streak = calculateStreak(startDate, daysData)
  const totalComplete = calculateTotalComplete(startDate, daysData)

  return (
    <div className="stats">
      <div className="stat-row">
        <span className="stat-label">Current Streak</span>
        <span className="stat-value streak-value">
          {streak} day{streak !== 1 ? 's' : ''}
        </span>
      </div>
      <div className="stat-row">
        <span className="stat-label">Total Complete</span>
        <span className="stat-value">{totalComplete}/60 days</span>
      </div>
    </div>
  )
}
