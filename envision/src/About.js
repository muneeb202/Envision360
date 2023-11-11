// About.js

import React from 'react';
import background from './images/AboutUsBg.png';
import logo from './images/Logo Small.png';
import introimage1 from './images/1.png';
import introimage2 from './images/2.png';
import introimage3 from './images/3.png';
import './About.css';

const AboutUs = () => {
    return (

        <div className='AboutUs-container'>
            <div className='image-container'>
                <img src={background} alt='background'/>
            </div>

            <div className='AboutUs-navbar'>
                <img src={logo} className='logo' alt='logo'/>
                <div className='links'>
                    <a href='/contactus' className='specific-link'>Contact Us</a>
                    <a href='/login' className='login-btn'>Log In</a>
                    <a href='/signup' className='signup-btn'>Sign Up</a>
                </div>
            </div>

            <div className='about-section'>
                <img src={introimage1} className='introimage1' alt='introimage1'/>
                <img src={introimage2} className='introimage2' alt='introimage2'/>
            </div>

            <div className='about-section'>
                    <img src={introimage3} className='introimage3' alt='introimage3'/>
                {/* <div className='introimage3-container'>
                </div> */}
                <div className='about-content'>
                    <h2>About Us</h2>
                    <p>
                        At Envision360, we are on a passionate journey to redefine the way we 
                        perceive and explore the visual world. Our team comprises visionaries, 
                        developers, and explorers who share a common belief: that immersive digital 
                        experiences should be accessible to all. Our story began with a desire to 
                        empower travel enthusiasts, educators, researchers, and urban planners with 
                        a versatile tool that seamlessly combines the marvel of wanderlust with the 
                        power of cutting-edge technology. We're here to transform passive viewing 
                        into an interactive and meaningful journey of discovery, transcending the 
                        boundaries of physical travel.
                    </p>
                </div>
            </div>


        </div>
    );
}

export default AboutUs;
