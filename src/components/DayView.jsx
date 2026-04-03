import BlockSection from './BlockSection'

export default function DayView({ day }) {
  return (
    <div style={{ paddingTop: '8px' }}>
      {day.blocks.map(block => (
        <BlockSection key={block.id} block={block} />
      ))}
    </div>
  )
}
