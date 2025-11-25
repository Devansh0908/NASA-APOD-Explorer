import Header from './components/Layout/Header';
import Footer from './components/Layout/Footer';
import TodayApod from './components/Apod/TodayApod';
import DatePickerApod from './components/Apod/DatePickerApod';
import ApodGallery from './components/Apod/ApodGallery';
import './App.css';

function App() {
  return (
    <div className="app">
      <Header />
      <main className="main-content">
        <TodayApod />
        <DatePickerApod />
        <ApodGallery />
      </main>
      <Footer />
    </div>
  );
}

export default App;
