import background from './images/homebg.png'
import logo from './images/image.png'
import './Home.css'
import Particles from 'react-tsparticles';
import { loadFull } from 'tsparticles';
import particlesConfig from "./config/particle-config";


const Home = () => {
    return (
        <div className='home-container'>
            <div className='image-container'>
                <img src={background} alt='background'/>
            </div>
            <div className='home-navbar'>
                <img src={logo} className='logo' alt='logo'/>
                <div className='links'>
                    <a href='/start'>Get Started</a>
                    <a href='/aboutus'>About Us</a>
                    <a href='/blog'>Blog</a>
                    <a href='/generate'>Demo</a>
                </div>
            </div>
            <div className='header'>
                <h1>ENVISION360</h1>
                <h2>Redefining Visual Perspectives</h2>
            </div>
            <Particles
                init={(main) => loadFull(main)}
                options={particlesConfig}
                width='30vw'
                height='60vh'
                style={{position:'absolute', right:'5vw', bottom:'20vh'}}
            />
        </div>
    );
}

export default Home;