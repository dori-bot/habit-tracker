import { useState } from 'react'
import { formatDate } from '../utils/storage'
import { getSubtasksForTask, getSubtaskProgress, toggleSubtask, addSubtask } from '../utils/subtaskStorage'
import type { Subtask } from '../utils/storage'
import './TaskList.css'

interface TaskListProps {
  selectedDate: Date
  tasks: string[]
  completedTasks: boolean[]
  onToggleTask: (index: number) => void
}

export default function TaskList({ 
  selectedDate, 
  tasks, 
  completedTasks, 
  onToggleTask 
}: TaskListProps) {
  const [subtasks, setSubtasks] = useState<{ [taskName: string]: Subtask[] }>(() => {
    const initial: { [taskName: string]: Subtask[] } = {}
    tasks.forEach(task => {
      initial[task] = getSubtasksForTask(task)
    })
    return initial
  })
  
  const [addingTo, setAddingTo] = useState<string | null>(null)
  const [newSubtaskText, setNewSubtaskText] = useState('')
  
  const dayKey = selectedDate.toISOString().split('T')[0]
  
  const handleToggleSubtask = (taskName: string, subtaskId: string, currentStatus: boolean) => {
    toggleSubtask(dayKey, taskName, subtaskId, !currentStatus)
    // Force re-render
    setSubtasks(prev => ({ ...prev }))
  }
  
  const handleAddSubtask = (taskName: string) => {
    if (newSubtaskText.trim()) {
      addSubtask(taskName, newSubtaskText.trim())
      setSubtasks(prev => ({
        ...prev,
        [taskName]: getSubtasksForTask(taskName)
      }))
      setNewSubtaskText('')
      setAddingTo(null)
    }
  }
  
  const completedCount = completedTasks.filter(Boolean).length
  const progressPercent = (completedCount / tasks.length) * 100

  return (
    <div className="tasks-wrapper">
      <p className="selected-date">{formatDate(selectedDate)}</p>
      
      <div className="task-list">
        {tasks.map((task, index) => {
          const taskSubtasks = subtasks[task] || []
          const subtaskProgress = getSubtaskProgress(dayKey, task)
          
          return (
            <div key={index} className="task-block">
              <div 
                className={`task-item ${completedTasks[index] ? 'completed' : ''}`}
              >
                <div 
                  className={`task-checkbox ${completedTasks[index] ? 'checked' : ''}`}
                  onClick={() => onToggleTask(index)}
                />
                <span className="task-label">{task}</span>
                <button 
                  className="add-subtask-btn"
                  onClick={() => setAddingTo(addingTo === task ? null : task)}
                  title="Add subtask"
                >
                  +
                </button>
              </div>
              
              {taskSubtasks.length > 0 && (
                <div className="subtask-list">
                  {taskSubtasks.map(subtask => (
                    <div key={subtask.id} className="subtask-item">
                      <div 
                        className={`subtask-checkbox ${subtaskProgress[subtask.id] ? 'checked' : ''}`}
                        onClick={() => handleToggleSubtask(task, subtask.id, subtaskProgress[subtask.id])}
                      />
                      <span className={subtaskProgress[subtask.id] ? 'subtask-done' : ''}>
                        {subtask.text}
                      </span>
                    </div>
                  ))}
                </div>
              )}
              
              {addingTo === task && (
                <div className="add-subtask-form">
                  <input
                    type="text"
                    value={newSubtaskText}
                    onChange={(e) => setNewSubtaskText(e.target.value)}
                    placeholder="New subtask..."
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleAddSubtask(task)
                      if (e.key === 'Escape') setAddingTo(null)
                    }}
                  />
                  <button onClick={() => handleAddSubtask(task)}>Add</button>
                  <button onClick={() => setAddingTo(null)}>Cancel</button>
                </div>
              )}
            </div>
          )
        })}
      </div>
      
      <div className="progress-bar-container">
        <div 
          className="progress-bar-fill" 
          style={{ height: `${progressPercent}%` }} 
        />
      </div>
    </div>
  )
}
