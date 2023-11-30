import './Home.css'
import Particles from 'react-tsparticles';
import { loadFull } from 'tsparticles';
import particlesConfig from "./config/particle-config";
import Footer from './components/Footer';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Avatar, Drawer, IconButton, Tooltip } from '@mui/material';
import { useNavigate } from 'react-router-dom';


const Home = () => {
    const user = localStorage.getItem('user');
    const navigate = useNavigate();
    console.log(user)
    const [name, setName] = useState('');
    const [sidebar, setSidebar] = useState(false);

    useEffect(() => {
        const getUser = async () => {
            try {
                const response = await axios.post('http://localhost:8000/api/get_user/', { token: user })
                console.log(response)
                setName(response.data['name']);
            }
            catch (e) {
                console.log(e);
            }
        }
        getUser();
    }, [])


    const userLogout = (e) => {
        e.preventDefault();
        localStorage.setItem('user', '');
        window.location.reload();
    }


    return (

        <div className='home-container'>
            <div className='image-container'>
                <img src={`${process.env.PUBLIC_URL}/images/homebg.png`} alt='background' draggable='false' />
            </div>
            <div className='navbar'>
                <img src={`${process.env.PUBLIC_URL}/images/Logo Small.png`} className='logo' alt='logo' draggable='false' />
                <div className=' d-none d-md-block'>
                <div className='links'>
                    {name ? (
                        <>
                            <a href='#' onClick={userLogout}>Logout</a>
                        </>
                    ) :
                        (
                            <a href='/start'>Get Started</a>
                        )}
                    <a href='/aboutus'>About Us</a>
                    <a href='/blog'>Blog</a>
                    <a className='demoButton' href='/generate'>{name ? 'Generate' : 'Demo'}</a>
                    {name && (
                        <Tooltip title='Click to view profile'> 
                            <IconButton onClick={() => navigate('/profile')}><Avatar sx={{ bgcolor: '#09687d' }}>{name.charAt(0).toUpperCase()}</Avatar></IconButton>
                        </Tooltip>
                    )}
                </div>
                </div>
                <div className='home-navbar d-md-none'>
                <Tooltip title='Click to view more details'> 
                    <IconButton className='m-5' onClick={() => setSidebar(true)}><i className="fa-solid fa-ellipsis-vertical" style={{ color: '#ffffff', fontSize: 'x-large' }}></i></IconButton>
                </Tooltip>
                    <Drawer className='home-sidebar' open={sidebar} anchor='right' onClose={() => setSidebar(false)}>
                        <div className='sidebar'>
                            <div className='links'>
                                <ul class="navbar-nav" style={{ textAlign: 'center' }}>
                                    <li class="nav-item">
                                        {name ? (
                                            <div style={{ marginBottom: '10px', display: 'flex', justifyContent: 'center' }}>
                                                <a href='/profile'><Avatar style={{ height: '80px', width: '80px', fontSize: 'x-large' }} sx={{ bgcolor: '#09687d' }}>{name.charAt(0).toUpperCase()}</Avatar></a>
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
                                        <a class="nav-link" href='/generate'>{user ? 'Generate' : 'Demo'}</a>
                                    </li>
                                </ul>

                                <div class="nav-item logout-button" style={{ marginLeft: '30px', position: 'absolute', bottom: '0', textAlign: 'center' }} >
                                    {user && <a class="nav-link" href onClick={userLogout}>Logout</a>}
                                </div>
                            </div>
                        </div>
                    </Drawer>
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
            <Footer top='85vh' />
        </div>

    );
}

export default Home;