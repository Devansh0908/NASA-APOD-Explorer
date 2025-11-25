import { useState, useEffect, useCallback } from 'react';
import './Slideshow.css';

const Slideshow = ({ images, startIndex = 0, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(startIndex);
  const [isPlaying, setIsPlaying] = useState(false);
  const [interval, setIntervalValue] = useState(3000);

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  }, [images.length]);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  useEffect(() => {
    let timer;
    if (isPlaying) {
      timer = setInterval(goToNext, interval);
    }
    return () => clearInterval(timer);
  }, [isPlaying, interval, goToNext]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') goToNext();
      if (e.key === 'ArrowLeft') goToPrevious();
      if (e.key === ' ') {
        e.preventDefault();
        setIsPlaying(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, goToNext]);

  const currentImage = images[currentIndex];

  return (
    <div className="slideshow-overlay" onClick={onClose}>
      <div className="slideshow-container" onClick={(e) => e.stopPropagation()}>
        <div className="slideshow-controls-top">
          <div className="slideshow-counter">
            {currentIndex + 1} / {images.length}
          </div>
          <div className="slideshow-playback-controls">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className={isPlaying ? 'playing' : ''}
              title={isPlaying ? 'Pause (Space)' : 'Play (Space)'}
            >
              {isPlaying ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <rect x="6" y="4" width="4" height="16" />
                  <rect x="14" y="4" width="4" height="16" />
                </svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <polygon points="5 3 19 12 5 21 5 3" />
                </svg>
              )}
            </button>
            <select
              value={interval}
              onChange={(e) => setIntervalValue(Number(e.target.value))}
              title="Slideshow Speed"
            >
              <option value={2000}>Fast (2s)</option>
              <option value={3000}>Normal (3s)</option>
              <option value={5000}>Slow (5s)</option>
            </select>
          </div>
          <button onClick={onClose} className="slideshow-close" title="Close (Esc)">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <button onClick={goToPrevious} className="slideshow-nav slideshow-prev" title="Previous (←)">
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>

        <div className="slideshow-content">
          {currentImage.mediaType === 'video' ? (
            <div className="slideshow-video-wrapper">
              <iframe
                src={currentImage.url}
                title={currentImage.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
          ) : (
            <img
              src={currentImage.url}
              alt={currentImage.title}
              className="slideshow-image"
            />
          )}
          
          <div className="slideshow-info">
            <h3>{currentImage.title}</h3>
            <p className="slideshow-date">{currentImage.date}</p>
          </div>
        </div>

        <button onClick={goToNext} className="slideshow-nav slideshow-next" title="Next (→)">
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>

        <div className="slideshow-thumbnails">
          {images.map((img, index) => (
            <div
              key={img.date}
              className={`slideshow-thumbnail ${index === currentIndex ? 'active' : ''}`}
              onClick={() => goToSlide(index)}
              title={img.title}
            >
              <img src={img.url} alt={img.title} />
            </div>
          ))}
        </div>

        <div className="slideshow-hint">
          Use arrow keys to navigate • Space to play/pause • ESC to close
        </div>
      </div>
    </div>
  );
};

export default Slideshow;
