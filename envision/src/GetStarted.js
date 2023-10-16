// import Particles from "react-tsparticles";
// import { loadFull } from "tsparticles";
import particlesConfig3 from "./config/particle-config-3";
import background from './images/startbg.png'
import './GetStarted.css'

import { TextField, ThemeProvider, createTheme } from '@mui/material';
import React, { useRef } from "react";
import logo from './images/image.png'
import { useEffect, useState } from "react";
import { loadFull } from "tsparticles";
import Particles from "react-tsparticles";

const theme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: 'rgb(255, 255, 255)',
        },
        secondary: {
            main: 'rgba(25, 166, 197)',
        }
    },
    typography: {
        fontFamily: 'Poppins, sans-serif',
    }
});

const MemoizedParticles = React.memo(({ options }) => (
    <Particles init={(main) => loadFull(main)} options={options} />
));

const GetStarted = () => {
    

    const [showLogin, setShowLogin] = useState(true);


    const toggleLogin = () => {
        setShowLogin(true);
    };

    const toggleSignUp = () => {
        setShowLogin(false);
    };

    return (
        <ThemeProvider theme={theme}>
            <MemoizedParticles options={particlesConfig3} />
        <div className='started-container'>
            
            <div className='image-container'>
                <img src={background} />
            </div>
            <div className="overlay-started">
                <div className="content-container">
                    <div className='navbar'>
                    <a href='/'><img src={logo} className='logo' /></a>
                    </div>
                    <div className="container" style={{ marginLeft: '80px', marginRight: '80px', minWidth: '80%' }}>
                        <div className='row'>
                            <div className='col-md-6 socials-header'>
                                <h2 style={{ marginBottom: '30px' }}>Get Started</h2>
                                <button className="social-button">Sign In With <i className="fab fa-google"></i></button>
                                <button className="social-button">Sign In With <i className="fab fa-facebook"></i></button>
                            </div>
                                {showLogin ? (
                                    <div className="col-md-6 login-section">
                                        <h3 style={{ marginBottom: '30px' }}>LOGIN</h3>
                                        <form className="login-form">
                                            <div className="form-group">
                                            <TextField color='secondary'  fullWidth label="Userame" variant="standard" sx={{ color: 'white', letterSpacing: '2px' }} />
                                    
                                            </div>
                                            <div className="form-group">
                                            <TextField color='secondary'  fullWidth label="Password" variant="standard" sx={{ color: 'white', letterSpacing: '2px' }} />
                                        
                                            </div>
                                            <div className="forgot-password">
                                                <a href="#">Forgot Password?</a>
                                                <a href="#" style={{ float: 'right' }} onClick={toggleSignUp}>Not A Member Yet?</a>
                                            </div>
                                            <button type="submit" className="submit-button">Login</button>
                                        </form>
                                    </div>
                                ) : (
                                    <div className="col-md-6 signup-section">
                                        <h3 style={{ marginBottom: '30px' }}>SIGN UP</h3>
                                        <form className="login-form">
                                            <div className="form-group">
                                            <TextField color='secondary'  fullWidth label="Email" variant="standard" sx={{ color: 'white', letterSpacing: '2px' }} />
                                        
                                            </div>
                                            <div className="form-group">
                                            <TextField color='secondary' fullWidth label="Userame" variant="standard" sx={{ color: 'white', letterSpacing: '2px' }} />
                                        
                                            </div>
                                            <div className="form-group">
                                            <TextField color='secondary'  fullWidth label="Password" variant="standard" sx={{ color: 'white', letterSpacing: '2px' }} />
                                        
                                            </div>
                                            <div className="form-group">
                                            <TextField color='secondary'  fullWidth label="Re-enter Password" variant="standard" sx={{ color: 'white', letterSpacing: '2px' }} />
                                        
                                            </div>
                                            <div className="forgot-password">
                                                <a href="#" style={{ float: 'right' }} onClick={toggleLogin}>Already Have An Account?</a>
                                            </div>
                                            <button type="submit" className="submit-button">Sign Up</button>
                                        </form>
                                    </div>
                                )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </ThemeProvider>
    );
}

export default GetStarted;
