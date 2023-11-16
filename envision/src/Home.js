import background from './images/homebg.png'
import logo from './images/image.png'
import './Home.css'
import Particles from 'react-tsparticles';
import { loadFull } from 'tsparticles';
import particlesConfig from "./config/particle-config";


const Home = () => {
    const user = localStorage.getItem('user');

    const userLogout = (e) => {
        e.preventDefault();
        localStorage.setItem('user', '');
        window.location.reload();
    }


    return (

        <div className='home-container'>
            <div className='image-container'>
                <img src={background} alt='background' />
            </div>
            <nav class="navbar navbar-expand-lg navbar-dark ">
                <img src={logo} className='logo' alt='logo' />
                <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                </button>
                <div class="collapse navbar-collapse justify-content-end" id="navbarNav">
                    <div className='home-navbar'>
                        <div className='links'>
                            <ul class="navbar-nav">
                                <li class="nav-item">
                                    {user ? (
                                        <>
                                            <p>{user}</p>
                                            <a class="nav-link" onClick={userLogout}>Logout</a>
                                        </>
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
        </div>
    );
}

export default Home;