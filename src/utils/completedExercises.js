const today = () => new Date().toISOString().split('T')[0]
const KEY = () => `completed_${today()}`

export function getCompleted() {
  try { return new Set(JSON.parse(localStorage.getItem(KEY()) ?? '[]')) }
  catch { return new Set() }
}

export function markCompleted(exerciseName) {
  const set = getCompleted()
  set.add(exerciseName)
  localStorage.setItem(KEY(), JSON.stringify([...set]))
}
