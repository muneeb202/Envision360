// import Particles from "react-tsparticles";
// import { loadFull } from "tsparticles";
// import particlesConfig from "./config/particle-config";
// import background from './images/startbg.png'
import './GetStarted.css'
import React from "react";
import logo from './images/image.png'
import videoBackground from './images/space.mp4';
import { useEffect, useState } from "react";

const GetStarted = () => {
    // const particlesInit = async (main) => {
    //     await loadFull(main);
    // };

    const [showLogin, setShowLogin] = useState(true);

    useEffect(() => {
        const video = document.querySelector(".video-container video");
        if (video) {
            video.playbackRate = 0.5; // Adjust the playback rate as needed
        }
    }, []);

    const toggleLogin = () => {
        setShowLogin(true);
    };

    const toggleSignUp = () => {
        setShowLogin(false);
    };

    return (
        <div className='started-container'>
            <div className="video-container">
                <video autoPlay loop muted>
                    <source src={videoBackground} type="video/mp4" />
                </video>
            </div>
            {/* <div className='image-container'>
                <img src={background} />
            </div> */}
            <div className="overlay">
                <div className="content-container">
                    <div className='navbar'>
                        <img src={logo} alt="" className='logo' />
                    </div>
                    <div className="container" style={{ marginLeft: '80px', marginRight: '80px', minWidth: '80%' }}>
                        <div className='row'>
                            <div className='col-md-6 socials-header'>
                                <h3 style={{ marginBottom: '30px' }}>Get Started</h3>
                                <button className="social-button">Sign In With <i className="fab fa-google"></i></button>
                                <button className="social-button">Sign In With <i className="fab fa-facebook"></i></button>
                            </div>
                            <div className="col-md-6 login-section">
                                {showLogin ? (
                                    <>
                                        <h3 style={{ marginBottom: '30px' }}>LOGIN</h3>
                                        <form className="login-form">
                                            <div className="form-group">
                                                <input type="text" id="username" className="form-control" placeholder="Username" />
                                            </div>
                                            <div className="form-group">
                                                <input type="password" id="password" className="form-control" placeholder="Password" />
                                            </div>
                                            <div className="forgot-password">
                                                <a href="#">Forgot Password?</a>
                                                <a href="#" style={{ float: 'right' }} onClick={toggleSignUp}>Not A Member Yet?</a>
                                            </div>
                                            <button type="submit" className="submit-button">Login</button>
                                        </form>
                                    </>
                                ) : (
                                    <>
                                        <h3 style={{ marginBottom: '30px' }}>SIGN UP</h3>
                                        <form className="login-form">
                                            <div className="form-group">
                                                <input type="email" id="email" className="form-control" placeholder="Email" />
                                            </div>
                                            <div className="form-group">
                                                <input type="text" id="username" className="form-control" placeholder="Username" />
                                            </div>
                                            <div className="form-group">
                                                <input type="password" id="password" className="form-control" placeholder="Password" />
                                            </div>
                                            <div className="forgot-password">
                                                <a href="#" style={{ float: 'right' }} onClick={toggleLogin}>Already Have An Account?</a>
                                            </div>
                                            <button type="submit" className="submit-button">Sign Up</button>
                                        </form>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default GetStarted;
