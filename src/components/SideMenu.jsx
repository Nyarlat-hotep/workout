import { X, ChevronRight, Grip } from 'lucide-react'
import './SideMenu.css'

const MENU_ITEMS = [
  {
    id: 'grip',
    icon: <Grip size={18} strokeWidth={1.75} />,
    label: 'GRIP TRAINING',
    sub: 'Hang strength · loaded grip · forearm',
  },
]

export default function SideMenu({ isOpen, onClose, onNavigate }) {
  return (
    <>
      <div className={`side-menu-overlay${isOpen ? ' open' : ''}`} onClick={onClose} />
      <div className={`side-menu${isOpen ? ' open' : ''}`}>
        <div className="side-menu-header">
          <span className="side-menu-title">MORE</span>
          <button className="side-menu-close" onClick={onClose}>
            <X size={18} strokeWidth={2} />
          </button>
        </div>
        <div className="side-menu-body">
          {MENU_ITEMS.map(item => (
            <button
              key={item.id}
              className="side-menu-item"
              onClick={() => { onNavigate(item.id); onClose() }}
            >
              <span className="side-menu-item-icon">{item.icon}</span>
              <span className="side-menu-item-text">
                <span className="side-menu-item-label">{item.label}</span>
                <span className="side-menu-item-sub">{item.sub}</span>
              </span>
              <ChevronRight size={16} strokeWidth={2} className="side-menu-item-arrow" />
            </button>
          ))}
        </div>
      </div>
    </>
  )
}
