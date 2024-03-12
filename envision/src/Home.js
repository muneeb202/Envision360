import './Home.css'
import Particles from 'react-tsparticles';
import { loadFull } from 'tsparticles';
import particlesConfig from "./config/particle-config";
import Navbar from './components/Navbar';
import { useSelector } from 'react-redux';

const Home = () => {
    const userData = useSelector((state) => state.user);
    console.log(userData)

    return (
        <>
            <div className='home-container'>
                <div className='home-sub-container' style={{ height: '100vh' }}>
                    <div className='image-container'>
                        <img src={`${process.env.PUBLIC_URL}/images/homebg.png`} alt='background' draggable='false' />
                    </div>
                    <Navbar />
                    <div className='row' style={{ width: '100vw', height: '75vh' }}>
                        <div className='home-header col-md-8'>
                            <div>
                                <h1>ENVISION360</h1>
                                <h2>Redefining Visual Perspectives</h2>
                            </div>
                        </div>
                        <div className=" col-md-4 particles-display d-none d-md-block">
                            <Particles
                                init={(main) => loadFull(main)}
                                options={particlesConfig}
                                width='30vw'
                                height='60vh'
                                style={{ position: 'absolute', right: '5vw', bottom: '20vh' }}
                            />
                        </div>
                    </div>
                </div>

            </div>
            {/* <Footer></Footer> */}
        </>
    );
}

export default Home;