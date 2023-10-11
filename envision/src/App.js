import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Home from './Home';
import GetStarted from './GetStarted';

function App() {
  return (
    <div className='body'>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/GetStarted" element={<GetStarted />} />
        </Routes>
      </Router>
    </div>

  );
}

export default App;
