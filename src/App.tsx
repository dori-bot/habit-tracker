import { useState, useEffect } from 'react'
import Calendar from './components/Calendar'
import TaskList from './components/TaskList'
import Stats from './components/Stats'
import { DEFAULT_TASKS } from './utils/storage'
import type { DaysData } from './utils/storage'
import './App.css'

function App() {
  const [selectedDate, setSelectedDate] = useState<Date>(() => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return today
  })
  
  const [startDate] = useState<Date>(() => {
    const saved = localStorage.getItem('habitTrackerData')
    if (saved) {
      const data = JSON.parse(saved)
      if (data.startDate) {
        return new Date(data.startDate)
      }
    }
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return today
  })

  const [daysData, setDaysData] = useState<DaysData>(() => {
    const saved = localStorage.getItem('habitTrackerData')
    if (saved) {
      const data = JSON.parse(saved)
      return data.days || {}
    }
    return {}
  })

  // Save to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem('habitTrackerData', JSON.stringify({
      startDate: startDate.toISOString(),
      days: daysData
    }))
  }, [daysData, startDate])

  const toggleTask = (dayKey: string, taskIndex: number) => {
    setDaysData(prev => {
      const dayData = prev[dayKey] || DEFAULT_TASKS.map(() => false)
      const newDayData = [...dayData]
      newDayData[taskIndex] = !newDayData[taskIndex]
      return { ...prev, [dayKey]: newDayData }
    })
  }

  const selectedKey = selectedDate.toISOString().split('T')[0]
  const selectedTasks = daysData[selectedKey] || DEFAULT_TASKS.map(() => false)

  return (
    <div className="container">
      <h1>60-Day Daily Commitment Tracker</h1>
      <p className="subtitle">Build lasting habits, one day at a time</p>
      
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
