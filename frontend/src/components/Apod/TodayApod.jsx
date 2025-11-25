import { useState, useEffect } from 'react';
import API_BASE_URL from '../../config/api';
import './TodayApod.css';

function TodayApod() {
  const [apod, setApod] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showFullExplanation, setShowFullExplanation] = useState(false);

  useEffect(() => {
    fetchTodayApod();
  }, []);

  const fetchTodayApod = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_BASE_URL}/apod/today`);
      if (!response.ok) {
        throw new Error('Failed to fetch today\'s APOD');
      }
      const data = await response.json();
      setApod(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading today's APOD...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  if (!apod) {
    return null;
  }

  const shortExplanation = apod.explanation.substring(0, 200);
  const needsToggle = apod.explanation.length > 200;

  return (
    <div className="today-apod">
      <h2>Today's Astronomy Picture</h2>
      <div className="apod-card">
        <h3>{apod.title}</h3>
        <p className="apod-date">{apod.date}</p>
        
        {apod.mediaType === 'image' ? (
          <img src={apod.url} alt={apod.title} className="apod-media" />
        ) : (
          <iframe
            src={apod.url}
            title={apod.title}
            className="apod-media"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        )}
        
        <div className="apod-explanation">
          <p>
            {showFullExplanation || !needsToggle ? apod.explanation : `${shortExplanation}...`}
          </p>
          {needsToggle && (
            <button 
              className="read-more-btn"
              onClick={() => setShowFullExplanation(!showFullExplanation)}
            >
              {showFullExplanation ? 'Show Less' : 'Read More'}
            </button>
          )}
        </div>

        {apod.copyright && (
          <p className="apod-copyright">© {apod.copyright}</p>
        )}
      </div>
    </div>
  );
}

export default TodayApod;
