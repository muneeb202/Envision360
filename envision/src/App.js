import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import './App.css';
import Home from './Home';
import GetStarted from './GetStarted';
import Generate from './Generate';
import Blog from './Blog';
import AboutUs from './About';
import Profile from './Profile';
import Footer from './components/Footer';

function App() {
  // const location = useLocation()
  return (
    // <div className='body'>
    //   <Router>
    //     <Routes>
    //       <Route path="/" element={<Home />} />
    //       <Route path="/start" element={<GetStarted />} />
    //       <Route path='/generate' element={<Generate />} />
    //       <Route path='/blog' element={<Blog />} />
    //       <Route path='/aboutus' element={<AboutUs />} />
    //       <Route path='/profile' element={<Profile />} />
    //     </Routes>
    //     <Footer />
    //     {/* <Footer className={location.pathname === '/generate' && 'd-none'} /> */}
    //   </Router>
    // </div>
    <div className='body'>
      <Router>
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <Routes style={{ flex: 1 }}>
            <Route path="/" element={<Home />} />
            <Route path="/start" element={<GetStarted />} />
            <Route path='/generate' element={<Generate />} />
            <Route path='/blog' element={<Blog />} />
            <Route path='/aboutus' element={<AboutUs />} />
            <Route path='/profile' element={<Profile />} />
          </Routes>
          <Footer />
        </div>
      </Router>
    </div>
  );
}

export default App;
