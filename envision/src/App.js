import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Home from './Home';
import GetStarted from './GetStarted';
import Generate from './Generate';
import Blog from './Blog';
import Temp from './Temp';

function App() {
  return (
    <div className='body'>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/start" element={<GetStarted />} />
          <Route path='/generate' element={<Generate />} />
          <Route path='/blog' element={<Blog />} />
          <Route path='/temp' element={<Temp />} />
        </Routes>
      </Router>
    </div>

  );
}

export default App;
