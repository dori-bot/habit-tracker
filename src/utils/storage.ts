export const DEFAULT_TASKS = [
  'Animation work',
  'Quran reading',
  'Exercise 30 mins',
  'Agent Startup work',
  'Review day with Ledori'
]

export interface DaysData {
  [key: string]: boolean[]
}

export interface DayInfo {
  date: Date
  dayName: string
  dayNumber: number
  monthName: string
  key: string
}

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

export function generateDays(startDate: Date, count: number = 60): DayInfo[] {
  const days: DayInfo[] = []
  
  for (let i = 0; i < count; i++) {
    const date = new Date(startDate)
    date.setDate(startDate.getDate() + i)
    days.push({
      date,
      dayName: DAY_NAMES[date.getDay()],
      dayNumber: date.getDate(),
      monthName: MONTH_NAMES[date.getMonth()],
      key: date.toISOString().split('T')[0]
    })
  }
  
  return days
}

export function getProgress(daysData: DaysData, dayKey: string): number {
  const dayData = daysData[dayKey]
  if (!dayData) return 0
  const completed = dayData.filter(Boolean).length
  return completed / DEFAULT_TASKS.length
}

export function formatDate(date: Date): string {
  const options: Intl.DateTimeFormatOptions = { 
    weekday: 'short', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  }
  return date.toLocaleDateString('en-US', options)
}

export function calculateStreak(startDate: Date, daysData: DaysData): number {
  const days = generateDays(startDate)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  let streak = 0
  
  // Count backwards from today
  for (let i = days.length - 1; i >= 0; i--) {
    const day = days[i]
    if (day.date > today) continue
    if (getProgress(daysData, day.key) === 1) {
      streak++
    } else {
      break
    }
  }
  
  return streak
}

export function calculateTotalComplete(startDate: Date, daysData: DaysData): number {
  const days = generateDays(startDate)
  return days.filter(day => getProgress(daysData, day.key) === 1).length
}
