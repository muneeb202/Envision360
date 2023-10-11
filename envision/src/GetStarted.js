import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";
import particlesConfig from "./config/particle-config";
import './GetStarted.css'
import React from "react";
import background from './images/homebg.png'
import logo from './images/image.png'


const GetStarted = () => {
    const particlesInit = async (main) => {
        await loadFull(main);
      };

    return (
        <div className='getStarted-container'>
            <div className='image-container'>
                <img src={background} />
            </div>
            <div className='navbar'>
                <img src={logo} className='logo' />
            </div>
            <div className='row'>
                <div className='col-md-6 socials-header'>
                    <h1>Get Started</h1>
                </div>
                <div className="col-md-6 login-section">
                    <h1>LOGIN</h1>
                </div>
            </div>
            
        </div>
    );
}

export default GetStarted;
