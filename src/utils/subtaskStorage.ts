import { Subtask, DEFAULT_SUBTASKS, DEFAULT_TASKS } from './storage'

const SUBTASKS_KEY = 'habitTrackerSubtasks'

interface SubtaskData {
  tasks: { [taskName: string]: Subtask[] }
  progress: { [dayKey: string]: { [taskName: string]: { [subtaskId: string]: boolean } } }
}

function loadSubtaskData(): SubtaskData {
  const saved = localStorage.getItem(SUBTASKS_KEY)
  if (saved) {
    return JSON.parse(saved)
  }
  
  // Initialize with default subtasks
  const tasks: { [taskName: string]: Subtask[] } = {}
  Object.keys(DEFAULT_SUBTASKS).forEach(taskName => {
    tasks[taskName] = DEFAULT_SUBTASKS[taskName].map((text, i) => ({
      id: `${taskName}-${i}`,
      text,
      completed: false
    }))
  })
  
  return { tasks, progress: {} }
}

function saveSubtaskData(data: SubtaskData) {
  localStorage.setItem(SUBTASKS_KEY, JSON.stringify(data))
}

export function getSubtasksForTask(taskName: string): Subtask[] {
  const data = loadSubtaskData()
  return data.tasks[taskName] || []
}

export function addSubtask(taskName: string, text: string): string {
  const data = loadSubtaskData()
  if (!data.tasks[taskName]) {
    data.tasks[taskName] = []
  }
  const id = `${taskName}-${Date.now()}`
  data.tasks[taskName].push({ id, text, completed: false })
  saveSubtaskData(data)
  return id
}

export function getSubtaskProgress(dayKey: string, taskName: string): { [subtaskId: string]: boolean } {
  const data = loadSubtaskData()
  return data.progress[dayKey]?.[taskName] || {}
}

export function toggleSubtask(dayKey: string, taskName: string, subtaskId: string, completed: boolean) {
  const data = loadSubtaskData()
  if (!data.progress[dayKey]) {
    data.progress[dayKey] = {}
  }
  if (!data.progress[dayKey][taskName]) {
    data.progress[dayKey][taskName] = {}
  }
  data.progress[dayKey][taskName][subtaskId] = completed
  saveSubtaskData(data)
}
