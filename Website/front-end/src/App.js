import logo from './logo.svg';
import './styles/App.css';
import Header from "./components/Header";
import Overview from "./components/Overview";
import Evaluation from "./components/Evaluation";
import AboutUs from "./components/About-Us";
import HomePage from "./components/HomePage";
import Footer from "./components/Footer";
import 'leaflet/dist/leaflet.css';

function App() {
  return (
    <div className="App">
      <Header />
      <HomePage />
      <Overview />
      <Evaluation />
      <AboutUs />
      <Footer />
    </div>
  );
}

export default App;
