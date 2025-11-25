import { useState } from 'react';
import ImageZoom from '../ImageZoom/ImageZoom';
import './ApodDetailModal.css';

function ApodDetailModal({ apod, onClose }) {
  const [showZoom, setShowZoom] = useState(false);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>
        
        <div className="modal-body">
          <h2>{apod.title}</h2>
          <p className="modal-date">{apod.date}</p>
          
          {apod.mediaType === 'image' ? (
            <div className="modal-image-wrapper">
              <img src={apod.hdUrl || apod.url} alt={apod.title} className="modal-media" />
              <button 
                className="modal-zoom-btn"
                onClick={() => setShowZoom(true)}
                title="Zoom Image"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.35-4.35" />
                  <line x1="11" y1="8" x2="11" y2="14" />
                  <line x1="8" y1="11" x2="14" y2="11" />
                </svg>
                Zoom
              </button>
            </div>
          ) : (
            <iframe
              src={apod.url}
              title={apod.title}
              className="modal-media"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
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

      {showZoom && (
        <ImageZoom
          src={apod.hdUrl || apod.url}
          alt={apod.title}
          onClose={() => setShowZoom(false)}
        />
      )}
    </div>
  );
}

export default ApodDetailModal;
