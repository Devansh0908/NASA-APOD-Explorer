import { useState } from 'react';
import API_BASE_URL from '../../config/api';
import './DatePickerApod.css';

function DatePickerApod() {
  const [selectedDate, setSelectedDate] = useState('');
  const [apod, setApod] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

  const fetchApodByDate = async () => {
    if (!selectedDate) {
      setError('Please select a date');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_BASE_URL}/apod/by-date?date=${selectedDate}`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch APOD');
      }
      const data = await response.json();
      setApod(data);
    } catch (err) {
      setError(err.message);
      setApod(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="date-picker-apod">
      <h2>View Past APODs</h2>
      <div className="date-picker-controls">
        <input
          type="date"
          value={selectedDate}
          onChange={handleDateChange}
          max={new Date().toISOString().split('T')[0]}
          className="date-input"
        />
        <button onClick={fetchApodByDate} className="fetch-btn">
          Get APOD
        </button>
      </div>

      {loading && <div className="loading">Loading...</div>}
      {error && <div className="error">Error: {error}</div>}

      {apod && (
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
              allowFullScreen
            />
          )}
          
          <p className="apod-explanation">{apod.explanation}</p>
          
          {apod.copyright && (
            <p className="apod-copyright">© {apod.copyright}</p>
          )}
        </div>
      )}
    </div>
  );
}

export default DatePickerApod;
