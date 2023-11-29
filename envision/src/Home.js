import './Home.css'
import Particles from 'react-tsparticles';
import { loadFull } from 'tsparticles';
import particlesConfig from "./config/particle-config";
import Footer from './components/Footer';
import { useEffect, useState } from 'react';
import axios from 'axios';


const Home = () => {
    const user = localStorage.getItem('user');
    console.log(user)
    const [name , setName] = useState('');

    useEffect(() => {
        const getUser = async () => {
            try {
                const response = await axios.post('http://localhost:8000/api/get_user/', {token: user})
                console.log(response)
                setName(response.data['name']);
            }
            catch(e) {
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
            <nav class="navbar navbar-expand-lg navbar-dark ">
                <img src={`${process.env.PUBLIC_URL}/images/Logo Small.png`} className='logo' alt='logo' draggable='false' />
                <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                </button>
                <div class="collapse navbar-collapse justify-content-end" id="navbarNav">
                    <div className='home-navbar'>
                        <div className='links'>
                            <ul class="navbar-nav">
                                <li class="nav-item">
                                    {name ? (
                                        <>
                                            <p>{name}</p>
                                            <a class="nav-link" onClick={userLogout}>Logout</a>
                                        </>
                                    ) :
                                        (
                                            <a href='/start'>Get Started </a>
                                        )}
                                </li>
                                <li class="nav-item">
                                    <a href='/about'>About Us</a>
                                </li>
                                <li class="nav-item">
                                    <a href='/blog'>Blog</a>
                                </li>
                                <li class="nav-item">
                                    <a class="demoButton" href='/generate'>{user ? 'Generate' : 'Demo'}</a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </nav>

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
            <Footer top='85vh'/>
        </div>
    );
}

export default Home;