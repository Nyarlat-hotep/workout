import { useState } from 'react'
import { supabase } from '../lib/supabase'
import DatePicker from './DatePicker'
import './LogModal.css'

function today() {
  return new Date().toISOString().split('T')[0]
}

export default function LogModal({ exercise, day, onClose, onSaved }) {
  const [date, setDate] = useState(today())
  const [rows, setRows] = useState(() =>
    Array.from({ length: exercise.sets }, (_, i) => ({
      set_number: i + 1,
      reps: exercise.reps,
      weight_lbs: '',
    }))
  )
  const [saving, setSaving] = useState(false)

  function updateRow(i, field, value) {
    setRows(prev => prev.map((r, idx) => idx === i ? { ...r, [field]: value } : r))
  }

  async function handleSave() {
    if (!date) return
    setSaving(true)
    const records = rows.map(r => ({
      exercise_name: exercise.name,
      day_number: day.day,
      day_label: day.label,
      set_number: r.set_number,
      reps: r.reps,
      weight_lbs: r.weight_lbs === '' ? null : parseFloat(r.weight_lbs),
      logged_date: date,
    }))
    const { error } = await supabase.from('workout_logs').insert(records)
    setSaving(false)
    if (error) { alert('Failed to save. Please try again.'); return }
    onSaved()
    onClose()
  }

  return (
    <div className="log-modal-backdrop" onClick={onClose}>
      <div className="log-modal" onClick={e => e.stopPropagation()}>
        <div className="log-modal-header">
          <span className="log-modal-title">Log — {exercise.name}</span>
          <button className="log-modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="log-modal-body">
          <div className="log-field">
            <label className="log-label">Date</label>
            <DatePicker value={date} onChange={setDate} />
          </div>

          <table className="log-table">
            <thead>
              <tr>
                <th>Set</th>
                <th>Reps</th>
                <th>Weight (lbs)</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={i}>
                  <td className="log-set-num">{row.set_number}</td>
                  <td>
                    <input
                      className="log-input"
                      type="text"
                      value={row.reps}
                      onChange={e => updateRow(i, 'reps', e.target.value)}
                    />
                  </td>
                  <td>
                    <input
                      className="log-input"
                      type="number"
                      placeholder="—"
                      value={row.weight_lbs}
                      onChange={e => updateRow(i, 'weight_lbs', e.target.value)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="log-modal-actions">
          <button className="log-btn log-btn--cancel" onClick={onClose}>Cancel</button>
          <button className="log-btn log-btn--save" onClick={handleSave} disabled={saving}>
            {saving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  )
}
