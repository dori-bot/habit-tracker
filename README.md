# 60-Day Daily Commitment Tracker

A beautiful habit tracker to build lasting habits over 60 days. Track your daily commitments and watch your progress grow.

![Preview](preview.png)

## Features

- 📅 **60-day calendar view** - See your entire journey at a glance
- 🟠 **Progress visualization** - Orange fill shows partial completion
- 🟢 **Completion state** - Green when all tasks are done
- 📊 **Stats tracking** - Current streak and total completion
- 💾 **Local storage** - Your data persists across sessions
- 📱 **Responsive design** - Works on mobile and desktop

## Daily Tasks (Default)

1. Meditate for 10 min
2. Drink 8 glasses of water
3. Read 20 pages (non-fiction)
4. 30 minutes of physical activity
5. Journal one positive memory

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

## Tech Stack

- React 19 + TypeScript
- Vite
- CSS (no framework - pure CSS for easy customization)

## Customization

Edit `src/utils/storage.ts` to change the default tasks:

```typescript
export const DEFAULT_TASKS = [
  'Your task 1',
  'Your task 2',
  // ...
]
```

## License

MIT
