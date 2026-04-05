import './VideoModal.css'

export default function VideoModal({ exercise, onClose }) {
  return (
    <div className="video-modal-backdrop" onClick={onClose}>
      <div className="video-modal" onClick={e => e.stopPropagation()}>
        <div className="video-modal-header">
          <span className="video-modal-title">{exercise.name}</span>
          <button className="video-modal-close" onClick={onClose}>✕</button>
        </div>
        {exercise.youtubeId ? (
          <div className="video-modal-embed">
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${exercise.youtubeId}?rel=0&modestbranding=1&autoplay=1`}
              title={`${exercise.name} demo`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        ) : (
          <div className="video-modal-no-video">
            <span>// NO VIDEO LOADED //</span>
            <span className="video-modal-hint">search: {exercise.searchHint}</span>
          </div>
        )}
      </div>
    </div>
  )
}
