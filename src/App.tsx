import { useState, useEffect, useCallback } from 'react'
import Calendar from './components/Calendar'
import TaskList from './components/TaskList'
import Stats from './components/Stats'
import { DEFAULT_TASKS } from './utils/storage'
import { getHabitData, saveHabitData, isSupabaseConfigured } from './utils/supabase'
import type { DaysData } from './utils/storage'
import './App.css'

const USER_ID = 'acorn'

function App() {
  const [selectedDate, setSelectedDate] = useState<Date>(() => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return today
  })
  
  const [startDate, setStartDate] = useState<Date>(() => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return today
  })

  const [daysData, setDaysData] = useState<DaysData>({})
  const [isLoading, setIsLoading] = useState(true)
  const [syncStatus, setSyncStatus] = useState<'loading' | 'synced' | 'local' | 'error'>('loading')

  useEffect(() => {
    async function loadData() {
      setIsLoading(true)
      
      if (isSupabaseConfigured()) {
        const cloudData = await getHabitData(USER_ID)
        if (cloudData) {
          setStartDate(new Date(cloudData.start_date))
          setDaysData(cloudData.days_data || {})
          setSyncStatus('synced')
          setIsLoading(false)
          return
        }
      }
      
      // Fallback to localStorage
      const saved = localStorage.getItem('habitTrackerData')
      if (saved) {
        const data = JSON.parse(saved)
        if (data.startDate) setStartDate(new Date(data.startDate))
        setDaysData(data.days || {})
      }
      
      setSyncStatus(isSupabaseConfigured() ? 'synced' : 'local')
      setIsLoading(false)
    }
    
    loadData()
  }, [])

  const saveData = useCallback(async (newDaysData: DaysData) => {
    localStorage.setItem('habitTrackerData', JSON.stringify({
      startDate: startDate.toISOString(),
      days: newDaysData
    }))
    
    if (isSupabaseConfigured()) {
      const success = await saveHabitData(USER_ID, startDate.toISOString(), newDaysData)
      setSyncStatus(success ? 'synced' : 'error')
    }
  }, [startDate])

  const toggleTask = useCallback((dayKey: string, taskIndex: number) => {
    setDaysData(prev => {
      const dayData = prev[dayKey] || DEFAULT_TASKS.map(() => false)
      const newDayData = [...dayData]
      newDayData[taskIndex] = !newDayData[taskIndex]
      const newDaysData = { ...prev, [dayKey]: newDayData }
      saveData(newDaysData)
      return newDaysData
    })
  }, [saveData])

  const selectedKey = selectedDate.toISOString().split('T')[0]
  const selectedTasks = daysData[selectedKey] || DEFAULT_TASKS.map(() => false)

  if (isLoading) {
    return (
      <div className="container">
        <h1>60-Day Daily Commitment Tracker</h1>
        <p className="subtitle">Loading...</p>
      </div>
    )
  }

  return (
    <div className="container">
      <h1>60-Day Daily Commitment Tracker</h1>
      <p className="subtitle">
        Build lasting habits, one day at a time
        <span className={`sync-status ${syncStatus}`}>
          {syncStatus === 'synced' && ' • ☁️ Synced'}
          {syncStatus === 'local' && ' • 💾 Local'}
          {syncStatus === 'error' && ' • ⚠️ Sync error'}
        </span>
      </p>
      
      <div className="main-content">
        <div className="calendar-section">
          <h2>The Next 60 Days</h2>
          <Calendar
            startDate={startDate}
            selectedDate={selectedDate}
            daysData={daysData}
            onSelectDate={setSelectedDate}
          />
        </div>
        
        <div className="tasks-section">
          <h2>Daily Tasks</h2>
          <TaskList
            selectedDate={selectedDate}
            tasks={DEFAULT_TASKS}
            completedTasks={selectedTasks}
            onToggleTask={(index) => toggleTask(selectedKey, index)}
          />
          <Stats
            startDate={startDate}
            daysData={daysData}
          />
        </div>
      </div>
    </div>
  )
}

export default App
