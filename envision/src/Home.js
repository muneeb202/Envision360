import './Home.css'
import Particles from 'react-tsparticles';
import { loadFull } from 'tsparticles';
import particlesConfig from "./config/particle-config";
import { useState } from 'react';
import { Avatar, Drawer, Tooltip } from '@mui/material'


const Home = () => {

    const [sidebar, setSidebar] = useState(false);
    const user = localStorage.getItem('user');

    const userLogout = (e) => {
        e.preventDefault();
        localStorage.setItem('user', '');
        window.location.reload();
    }
    // const user = 'Ali'

    return (

        <div className='home-container'>
            <div className='image-container'>
                <img src={`${process.env.PUBLIC_URL}/images/homebg.png`} alt='background' draggable='false' />
            </div>
            <div className='home-navbar d-md-none'>
                <img src={`${process.env.PUBLIC_URL}/images/logo.png`} className='logo' alt='logo' draggable='false' />
                <div className='m-5' onClick={() => setSidebar(true)}><Tooltip title='Click to view more details'><i className="fa-solid fa-ellipsis-vertical" style={{ color: '#ffffff', fontSize: 'x-large' }}></i></Tooltip></div>
                <Drawer className='home-sidebar' open={sidebar} anchor='right' onClose={() => setSidebar(false)}>
                    <div className='sidebar'>
                        <div className='links'>
                            <ul class="navbar-nav" style={{ textAlign: 'center' }}>
                                <li class="nav-item">
                                    {user ? (
                                        <div style={{ marginBottom: '10px', display: 'flex', justifyContent: 'center' }}>
                                            <a href='/profile'><Avatar style={{ height: '80px', width: '80px', fontSize: 'x-large' }} sx={{ bgcolor: '#09687d' }}>{user.charAt(0).toUpperCase()}</Avatar></a>
                                        </div>
                                    ) :
                                        (
                                            <a class="nav-link" href='/start'>Get Started </a>
                                        )}
                                </li>
                                <li class="nav-item">
                                    <a class="nav-link" href='/aboutus'>About Us</a>
                                </li>
                                <li class="nav-item">
                                    <a class="nav-link" href='/blog'>Blog</a>
                                </li>
                                <li class="nav-item">
                                    <a class="nav-link demoButton" href='/generate'>{user ? 'Generate' : 'Demo'}</a>
                                </li>
                            </ul>

                            <div class="nav-item logout-button" style={{ marginLeft: '30px', position: 'absolute', bottom: '0', textAlign: 'center' }} >
                                {user && <a class="nav-link" href onClick={userLogout}>Logout</a>}
                            </div>
                        </div>
                    </div>
                </Drawer>
            </div>

            <div className='home-navbar d-none d-md-block'>
                <img src={`${process.env.PUBLIC_URL}/images/logo.png`} className='logo' alt='logo' draggable='false' />
                <div className='links'>
                    {user ? (
                        <div style={{ marginBottom: '10px', display: 'flex', justifyContent: 'center' }}>
                            <a href='/profile'><Avatar style={{ height: '80px', width: '80px', fontSize: 'x-large' }} sx={{ bgcolor: '#09687d' }}>{user.charAt(0).toUpperCase()}</Avatar></a>
                        </div>
                    ) :
                        (
                            <a class="nav-link" href='/start'>Get Started </a>
                        )}
                    <a href='/aboutus'>About Us</a>
                    <a href='/blog'>Blog</a>
                    <a class="demoButton" href='/generate'>{user ? 'Generate' : 'Demo'}</a>

                    <div class="logout-button" style={{ marginLeft: '30px', position: 'absolute', bottom: '0', textAlign: 'center' }} >
                        {user && <a href onClick={userLogout}>Logout</a>}
                    </div>
                </div>
            </div>

            <div className='header'>
                <h1>ENVISION360</h1>
                <h2>Redefining Visual Perspectives</h2>
            </div>
            <div className="particles-display">
                <Particles
                    init={(main) => loadFull(main)}
                    options={particlesConfig}
                    width='30vw'
                    height='60vh'
                    style={{ position: 'absolute', right: '5vw', bottom: '20vh' }}
                />
            </div>
        </div>
    );
}

export default Home;