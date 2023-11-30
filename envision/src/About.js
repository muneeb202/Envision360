// About.js
import React from 'react';
import { Link } from 'react-router-dom';
// import Particles from 'react-particles-js';
import './About.css';

// const particlesOptions = {
//   particles: {
//     number: {
//       value: 50, // Adjust the number of particles
//       density: {
//         enable: true,
//         value_area: 800,
//       },
//     },
//     size: {
//       value: 3, // Adjust the size of particles
//     },
//     move: {
//       speed: 2, // Adjust the speed of particles
//     },
//   },
//   interactivity: {
//     events: {
//       onhover: {
//         enable: true,
//         mode: 'repulse',
//       },
//     },
//   },
// };



const AboutUs = () => {

  const scrollToTeamMembers = () => {
    const teamSection = document.querySelector('.team-section');
    if (teamSection) {
      teamSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const openEmailCompose = (email) => {
    window.open(`mailto:${email}`, '_blank');
  };

  const redirectToHome = () => {
    // Redirect to the homepage
    window.location.href = '/';
  };

  const redirectToLogin = () => {
    // Redirect to the Get Started
    window.location.href = '/start';
  };

  return (

    <div className='AboutUs-container'>
      <div className='image-container'>
        <img src={`${process.env.PUBLIC_URL}/images/aboutbg.png`} alt='background' />
      </div>
      <div className='d-flex justify-content-between'>
        <a href='/'><img src={`${process.env.PUBLIC_URL}/images/Logo Small.png`} className='logo' alt='background' draggable='false' /></a>
        <div className='home-navbar'>
          <div className='links'>
            <a href='/start'>Get Started</a>
            <a href='#' onClick={scrollToTeamMembers}> Contact Us </a>
          </div>
        </div>
      </div>


      <div className='about-section'>
        <img src={`${process.env.PUBLIC_URL}/images/1.png`} className='introimage1' alt='introimage1' />
        <img src={`${process.env.PUBLIC_URL}/images/2.png`} className='introimage2' alt='introimage2' />
      </div>

      <div className='about-section'>
        <img src={`${process.env.PUBLIC_URL}/images/3.png`} className='introimage3' alt='introimage3' />
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

      <div className='mission-section'>
        <div className='mission-content'>
          <h2>Our Mission</h2>
          <p>
            Our mission at Envision360 is crystal clear - to empower you to craft
            and explore captivating 360-degree panoramic views effortlessly. We aim
            to reshape the landscape of visual exploration, making it accessible to
            a diverse audience. We're here to bridge the gap between existing applications
            by offering user-friendly and versatile solutions that address their limitations.
            By harnessing the potential of AI, web scraping, and full-stack web development,
            we're committed to expanding your horizons, whether you're a budget-conscious
            traveller with a thirst for adventure, an educator seeking immersive teaching
            tools, a researcher in need of in-depth visuals, or an urban planner envisioning
            the future.
          </p>
        </div>
        <img src={`${process.env.PUBLIC_URL}/images/5.png`} className='introimage5' alt='introimage5' />
      </div>


      <div className='story-section'>
        <img src={`${process.env.PUBLIC_URL}/images/4.png`} className='introimage4' alt='introimage4' />
        <div className='story-content'>
          <h2>Our Story</h2>
          <p>
            Our story is one of innovation, curiosity, and the relentless pursuit of redefining
            visual perspectives. It all began with a simple yet profound question: How can we make
            the world's wonders accessible to everyone, regardless of their physical or financial
            limitations? The answer lay in the fusion of technology and imagination. We embarked on
            a journey to create Envision360, a web application that seamlessly combines artificial
            intelligence, web scraping, and full-stack web development. This was not just about creating
            another app but about changing the way we explore our world. Our story is a testament to the
            endless possibilities that come to life when visionaries and developers collaborate with the
            shared goal of making immersive digital experiences a reality for all.searcher in need of
            in-depth visuals, or an urban planner envisioning the future.
          </p>
        </div>
      </div>
      <div className='centered-heading'>
        <h1>Meet the Talented Team behind Envision360</h1>
      </div>
      <div className='team-section'>

        <div className=' team-member1' onClick={() => openEmailCompose('l202147@lhr.nu.edu.pk')}>
          <img src={`${process.env.PUBLIC_URL}/images/6.png`} alt='Team Member 1' />
          <div className='team-member-details'>
            <h2>Mohammad Muneeb Arshad</h2>
            <h3>BSCS 2020</h3>
            <p>
              <a href='#' onClick={(e) => { e.preventDefault(); openEmailCompose('l202147@lhr.nu.edu.pk'); }}>
                l202147@lhr.nu.edu.pk
              </a>
            </p>
          </div>
        </div>

        <div className='team-member2' onClick={() => openEmailCompose('l202154@lhr.nu.edu.pk')}>
          <div className='team-member-details'>
            <h2>Wajeeha Zulfiqar</h2>
            <h3>BSCS 2020</h3>
            <p>
              <a href='#' onClick={(e) => { e.preventDefault(); openEmailCompose('l202154@lhr.nu.edu.pk'); }}>
                l202154@lhr.nu.edu.pk
              </a>
            </p>
          </div>
          <img src={`${process.env.PUBLIC_URL}/images/7.png`} alt='Team Member 2' />
        </div>

        <div className='team-member3' onClick={() => openEmailCompose('l201164@lhr.nu.edu.pk')}>
          <img src={`${process.env.PUBLIC_URL}/images/8.png`} alt='Team Member 3' />
          <div className='team-member-details'>
            <h2>Abdul Rehman Sodais</h2>
            <h3>BSCS 2020</h3>
            <p>
              <a href='#' onClick={(e) => { e.preventDefault(); openEmailCompose('l201164@lhr.nu.edu.pk'); }}>
                l201164@lhr.nu.edu.pk
              </a>
            </p>
          </div>
        </div>
      </div>
      <br /><br /><br />
    </div>
  );
};

export default AboutUs;