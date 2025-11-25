import Header from './components/Layout/Header';
import Footer from './components/Layout/Footer';
import TodayApod from './components/Apod/TodayApod';
import DatePickerApod from './components/Apod/DatePickerApod';
import ApodGallery from './components/Apod/ApodGallery';
import ThemeToggle from './components/ThemeToggle/ThemeToggle';
import './App.css';

function App() {
  return (
    <div className="app">
      <ThemeToggle />
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
