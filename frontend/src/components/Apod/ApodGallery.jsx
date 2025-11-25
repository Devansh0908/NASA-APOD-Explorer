import { useState, useEffect } from 'react';
import API_BASE_URL from '../../config/api';
import ApodDetailModal from './ApodDetailModal';
import './ApodGallery.css';

function ApodGallery() {
  const [apods, setApods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedApod, setSelectedApod] = useState(null);

  useEffect(() => {
    fetchRecentApods();
  }, []);

  const fetchRecentApods = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_BASE_URL}/apod/recent?days=10`);
      if (!response.ok) {
        throw new Error('Failed to fetch recent APODs');
      }
      const data = await response.json();
      setApods(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCardClick = (apod) => {
    setSelectedApod(apod);
  };

  const handleCloseModal = () => {
    setSelectedApod(null);
  };

  if (loading) {
    return <div className="loading">Loading gallery...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  return (
    <div className="apod-gallery">
      <h2>Recent Gallery</h2>
      <div className="gallery-grid">
        {apods.map((apod) => (
          <div 
            key={apod.date} 
            className="gallery-card"
            onClick={() => handleCardClick(apod)}
          >
            {apod.mediaType === 'image' ? (
              <img src={apod.url} alt={apod.title} className="gallery-thumbnail" />
            ) : (
              <div className="gallery-video-placeholder">
                <span>▶ Video</span>
              </div>
            )}
            <div className="gallery-card-info">
              <h3>{apod.title}</h3>
              <p className="gallery-date">{apod.date}</p>
            </div>
          </div>
        ))}
      </div>

      {selectedApod && (
        <ApodDetailModal apod={selectedApod} onClose={handleCloseModal} />
      )}
    </div>
  );
}

export default ApodGallery;
