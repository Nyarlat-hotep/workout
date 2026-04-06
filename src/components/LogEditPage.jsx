import { useState } from 'react'
import { ArrowLeft, Save } from 'lucide-react'
import { supabase } from '../lib/supabase'
import './LogEditPage.css'

export default function LogEditPage({ exerciseName, sets, onClose, onSaved }) {
  const [rows, setRows] = useState(sets.map(s => ({
    id: s.id,
    set_number: s.set_number,
    reps: s.reps ?? '',
    weight_lbs: s.weight_lbs ?? '',
  })))
  const [saving, setSaving] = useState(false)

  function update(index, field, value) {
    setRows(prev => prev.map((r, i) => i === index ? { ...r, [field]: value } : r))
  }

  async function handleSave() {
    setSaving(true)
    await Promise.all(rows.map(r =>
      supabase.from('workout_logs').update({
        reps: r.reps,
        weight_lbs: r.weight_lbs === '' ? null : Number(r.weight_lbs),
      }).eq('id', r.id)
    ))
    setSaving(false)
    onSaved()
  }

  return (
    <div className="log-edit-page">
      <div className="log-edit-header">
        <button className="log-edit-back" onClick={onClose}>
          <ArrowLeft size={18} strokeWidth={2} />
        </button>
        <span className="log-edit-title">{exerciseName}</span>
        <button className="log-edit-save" onClick={handleSave} disabled={saving}>
          <Save size={16} strokeWidth={2} />
          {saving ? 'Saving...' : 'Save'}
        </button>
      </div>

      <div className="log-edit-body">
        <div className="log-edit-table-header">
          <span>Set</span>
          <span>Reps</span>
          <span>Weight (lbs)</span>
        </div>
        {rows.map((row, i) => (
          <div key={row.id} className="log-edit-row">
            <span className="log-edit-set-num">{row.set_number}</span>
            <input
              className="log-edit-input"
              value={row.reps}
              onChange={e => update(i, 'reps', e.target.value)}
            />
            <input
              className="log-edit-input"
              type="number"
              value={row.weight_lbs}
              onChange={e => update(i, 'weight_lbs', e.target.value)}
              placeholder="—"
            />
          </div>
        ))}
      </div>
    </div>
  )
}
