import logo from './logo.svg';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; // Updated import for BrowserRouter
import './App.css';
import Home from './Home';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </Router>
  );
}

export default App;
