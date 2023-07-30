import './App.css';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { useEffect } from 'react';
import { Navbar } from './Components/Navbar';
import { Hero } from './Components/Hero';
import { Langkah } from './Components/Langkah';
import { Tentang } from './Components/Tentang';
import "bootstrap/dist/css/bootstrap.min.css";

function App() {

  useEffect(() => {
    AOS.init({
      once: true,
    });
  }, []);
  
  return (
    <div className="app">
      <header className="App-header">
        
      </header>
      <Navbar />
      <Hero />
      <Langkah />
      <Tentang />
      {/* <div id="preloader"></div>
      <a href="#" class="back-to-top d-flex align-items-center justify-content-center"><i class="bi bi-arrow-up-short"></i></a> */}
    </div>
  );
}

export default App;
