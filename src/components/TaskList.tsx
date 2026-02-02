import { formatDate } from '../utils/storage'
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
  const completedCount = completedTasks.filter(Boolean).length
  const progressPercent = (completedCount / tasks.length) * 100

  return (
    <div className="tasks-wrapper">
      <p className="selected-date">{formatDate(selectedDate)}</p>
      
      <div className="task-list">
        {tasks.map((task, index) => (
          <div 
            key={index} 
            className={`task-item ${completedTasks[index] ? 'completed' : ''}`}
          >
            <div 
              className={`task-checkbox ${completedTasks[index] ? 'checked' : ''}`}
              onClick={() => onToggleTask(index)}
            />
            <span className="task-label">{task}</span>
          </div>
        ))}
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
