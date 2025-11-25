import './ApodDetailModal.css';

function ApodDetailModal({ apod, onClose }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>
        
        <div className="modal-body">
          <h2>{apod.title}</h2>
          <p className="modal-date">{apod.date}</p>
          
          {apod.mediaType === 'image' ? (
            <img src={apod.hdUrl || apod.url} alt={apod.title} className="modal-media" />
          ) : (
            <iframe
              src={apod.url}
              title={apod.title}
              className="modal-media"
              frameBorder="0"
              allowFullScreen
            />
          )}
          
          <div className="modal-explanation">
            <h3>Explanation</h3>
            <p>{apod.explanation}</p>
          </div>
          
          <p className="modal-copyright">
            {apod.copyright ? `© ${apod.copyright}` : 'Public domain / not specified'}
          </p>
        </div>
      </div>
    </div>
  );
}

export default ApodDetailModal;
