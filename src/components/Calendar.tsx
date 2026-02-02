import { generateDays, getProgress } from '../utils/storage'
import type { DaysData, DayInfo } from '../utils/storage'
import './Calendar.css'

interface CalendarProps {
  startDate: Date
  selectedDate: Date
  daysData: DaysData
  onSelectDate: (date: Date) => void
}

function DayCell({ 
  day, 
  isSelected, 
  progress, 
  onClick 
}: { 
  day: DayInfo
  isSelected: boolean
  progress: number
  onClick: () => void
}) {
  const isComplete = progress === 1
  const isInProgress = progress > 0 && progress < 1
  
  let className = 'day-cell'
  if (isComplete) className += ' complete'
  if (isInProgress) className += ' in-progress'
  if (isSelected) className += ' selected'

  const fillHeight = isInProgress ? progress * 100 : 0
  // Calculate clip-path for inverted text (100% - fillHeight from top)
  const clipTop = 100 - fillHeight

  return (
    <div className={className} onClick={onClick}>
      <div 
        className="progress-fill" 
        style={{ height: `${fillHeight}%` }} 
      />
      {/* Normal text layer */}
      <div className="day-content">
        <span className="day-name">{day.dayName}</span>
        <span className="day-number">{day.dayNumber}</span>
        <span className="month-name">{day.monthName}</span>
      </div>
      {/* Inverted text layer - clips to show only where progress fill is */}
      {isInProgress && (
        <div 
          className="day-content-inverted"
          style={{ '--clip-top': `${clipTop}%` } as React.CSSProperties}
        >
          <span className="day-name">{day.dayName}</span>
          <span className="day-number">{day.dayNumber}</span>
          <span className="month-name">{day.monthName}</span>
        </div>
      )}
    </div>
  )
}

export default function Calendar({ 
  startDate, 
  selectedDate, 
  daysData, 
  onSelectDate 
}: CalendarProps) {
  const days = generateDays(startDate)
  const selectedKey = selectedDate.toISOString().split('T')[0]

  return (
    <div className="calendar-grid">
      {days.map(day => (
        <DayCell
          key={day.key}
          day={day}
          isSelected={day.key === selectedKey}
          progress={getProgress(daysData, day.key)}
          onClick={() => onSelectDate(day.date)}
        />
      ))}
    </div>
  )
}
