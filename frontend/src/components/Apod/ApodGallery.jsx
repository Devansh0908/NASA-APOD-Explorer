import { useState, useEffect, useRef, useCallback } from 'react';
import API_BASE_URL from '../../config/api';
import ApodDetailModal from './ApodDetailModal';
import Slideshow from '../Slideshow/Slideshow';
import ImageZoom from '../ImageZoom/ImageZoom';
import './ApodGallery.css';

function ApodGallery() {
  const [apods, setApods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedApod, setSelectedApod] = useState(null);
  const [daysToLoad, setDaysToLoad] = useState(10);
  const [hasMore, setHasMore] = useState(true);
  const [mediaFilter, setMediaFilter] = useState('all'); // 'all', 'image', 'video'
  const [showSlideshow, setShowSlideshow] = useState(false);
  const [slideshowStartIndex, setSlideshowStartIndex] = useState(0);
  const [zoomImage, setZoomImage] = useState(null);
  const observerTarget = useRef(null);

  useEffect(() => {
    fetchRecentApods();
  }, [daysToLoad]);

  const fetchRecentApods = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_BASE_URL}/apod/recent?days=${daysToLoad}`);
      if (!response.ok) {
        throw new Error('Failed to fetch recent APODs');
      }
      const data = await response.json();
      setApods(data);
      // Check if we've reached the limit (NASA APOD started in June 1995)
      if (data.length < daysToLoad) {
        setHasMore(false);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadMore = useCallback(() => {
    if (!loading && hasMore) {
      setDaysToLoad(prev => prev + 10);
    }
  }, [loading, hasMore]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          loadMore();
        }
      },
      { threshold: 0.1 }
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [loadMore, hasMore, loading]);

  const handleCardClick = (apod) => {
    setSelectedApod(apod);
  };

  const handleCloseModal = () => {
    setSelectedApod(null);
  };

  const handleImageZoom = (e, apod) => {
    e.stopPropagation();
    if (apod.mediaType === 'image') {
      setZoomImage(apod);
    }
  };

  const handleStartSlideshow = (startIndex) => {
    setSlideshowStartIndex(startIndex);
    setShowSlideshow(true);
  };

  const filteredApods = apods.filter(apod => {
    if (mediaFilter === 'all') return true;
    return apod.mediaType === mediaFilter;
  });

  if (loading && apods.length === 0) {
    return <div className="loading">Loading gallery...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  return (
    <div className="apod-gallery">
      <div className="gallery-header">
        <h2>Recent Gallery</h2>
        <div className="gallery-controls">
          <div className="media-filter">
            <button 
              className={mediaFilter === 'all' ? 'active' : ''}
              onClick={() => setMediaFilter('all')}
            >
              All ({apods.length})
            </button>
            <button 
              className={mediaFilter === 'image' ? 'active' : ''}
              onClick={() => setMediaFilter('image')}
            >
              Images ({apods.filter(a => a.mediaType === 'image').length})
            </button>
            <button 
              className={mediaFilter === 'video' ? 'active' : ''}
              onClick={() => setMediaFilter('video')}
            >
              Videos ({apods.filter(a => a.mediaType === 'video').length})
            </button>
          </div>
          <button 
            className="slideshow-btn"
            onClick={() => handleStartSlideshow(0)}
            disabled={filteredApods.length === 0}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
            Start Slideshow
          </button>
        </div>
      </div>

      <div className="gallery-grid">
        {filteredApods.map((apod, index) => (
          <div 
            key={apod.date} 
            className="gallery-card"
            onClick={() => handleCardClick(apod)}
          >
            {apod.mediaType === 'image' ? (
              <div className="gallery-image-wrapper">
                <img src={apod.url} alt={apod.title} className="gallery-thumbnail" />
                <div className="gallery-overlay">
                  <button 
                    className="zoom-btn"
                    onClick={(e) => handleImageZoom(e, apod)}
                    title="Zoom Image"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="11" cy="11" r="8" />
                      <path d="m21 21-4.35-4.35" />
                      <line x1="11" y1="8" x2="11" y2="14" />
                      <line x1="8" y1="11" x2="14" y2="11" />
                    </svg>
                  </button>
                  <button 
                    className="slideshow-from-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleStartSlideshow(filteredApods.findIndex(a => a.date === apod.date));
                    }}
                    title="Start Slideshow from Here"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <polygon points="5 3 19 12 5 21 5 3" />
                    </svg>
                  </button>
                </div>
              </div>
            ) : (
              <div className="gallery-video-placeholder">
                <svg width="60" height="60" viewBox="0 0 24 24" fill="currentColor">
                  <polygon points="5 3 19 12 5 21 5 3" />
                </svg>
                <span>Video</span>
              </div>
            )}
            <div className="gallery-card-info">
              <h3>{apod.title}</h3>
              <p className="gallery-date">{apod.date}</p>
            </div>
          </div>
        ))}
      </div>

      {hasMore && !loading && (
        <div ref={observerTarget} className="load-more-trigger">
          <div className="loading-spinner"></div>
        </div>
      )}

      {loading && apods.length > 0 && (
        <div className="loading-more">Loading more...</div>
      )}

      {!hasMore && (
        <div className="end-message">
          You've reached the beginning of NASA's APOD collection! 🚀
        </div>
      )}

      {selectedApod && (
        <ApodDetailModal apod={selectedApod} onClose={handleCloseModal} />
      )}

      {showSlideshow && (
        <Slideshow
          images={filteredApods}
          startIndex={slideshowStartIndex}
          onClose={() => setShowSlideshow(false)}
        />
      )}

      {zoomImage && (
        <ImageZoom
          src={zoomImage.hdUrl || zoomImage.url}
          alt={zoomImage.title}
          onClose={() => setZoomImage(null)}
        />
      )}
    </div>
  );
}

export default ApodGallery;
