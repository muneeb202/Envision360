import particlesConfig3 from "./config/particle-config-3";
import './GetStarted.css'
import { Checkbox, FormControlLabel, IconButton, InputAdornment, TextField, ThemeProvider, createTheme } from '@mui/material';
import React, { useState } from "react";
import { loadFull } from "tsparticles";
import Particles from "react-tsparticles";
import axios from "axios"
import { useNavigate } from 'react-router-dom'
import LoadingBar from 'react-top-loading-bar'

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


    const [formData, setFormData] = useState({
        email: '',
        username: '',
        password: '',
        re_password: ''
    });

    const navigate = useNavigate();


    const [showLogin, setShowLogin] = useState(true);
    const [showEmail, setShowEmail] = useState(false);
    const [checkUsername, setCheckUsername] = useState(false);
    const [checkPassword, setCheckPassword] = useState(false);
    const [checkEmail, setCheckEmail] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showRePassword, setReShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [refresh, setRefresh] = useState(false)

    const toggleLogin = (e) => {
        e.preventDefault();
        setShowLogin(true);
        setShowEmail(false);
        setCheckUsername(false);
        setCheckPassword(false);
        setCheckEmail(false);
        setIsLoading(false);
        setRefresh(false)
    };

    const toggleSignUp = () => {
        setShowLogin(false);
        setCheckUsername(false);
        setCheckPassword(false);
        setCheckEmail(false);
        setIsLoading(false);
        setRefresh(false)
    };

    const toggleEnterEmail = () => {
        setShowLogin(true);
        setShowEmail(true);
        setCheckUsername(false);
        setCheckPassword(false);
        setCheckEmail(false);
        setIsLoading(false);
        setRefresh(false)
    };

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSignUpSubmit = async (e) => {
        e.preventDefault();
        setCheckPassword(false);
        setIsLoading(true);
        setProgress(progress + 10)
        if (formData.password !== formData.re_password) {
            setCheckPassword(true);
            return;
        }
        try {
            setProgress(progress + 30)
            const response = await axios.post('http://localhost:8000/api/create_user/', { ...formData, refresh: refresh });
            localStorage.setItem('user', response.data['user'])
            setProgress(progress + 50)
            navigate('/')

        } catch (error) {
            setCheckUsername(true);
            setProgress(0);
        } finally {
            setIsLoading(false);
            setProgress(0);
        }
    };

    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setProgress(progress + 10)
        try {
            setProgress(progress + 30)
            const response = await axios.post('http://localhost:8000/api/login/', { ...formData, refresh: refresh });
            localStorage.setItem('user', response.data['user'])
            setProgress(progress + 50)
            navigate('/')

        } catch (error) {
            setCheckUsername(true);
            setProgress(0);
        } finally {
            setIsLoading(false);
            setProgress(0);
        }
    };

    const handleEmailSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setProgress(progress + 50);
    };

    return (
        <ThemeProvider theme={theme}>
            <MemoizedParticles options={particlesConfig3} />
            <div className='started-container'>
                <div className='image-container'>
                    <img src={`${process.env.PUBLIC_URL}/images/startbg.png`} alt="background" draggable='false' />
                </div>
                <div className="overlay-started">
                    <div className="content-container">
                        <div className='navbar'>
                            <a href='/'><img src={`${process.env.PUBLIC_URL}/images/Logo Small.png`} className='logo' alt="Logo" draggable='false' /></a>
                        </div>
                        <div className="container" style={{ minWidth: '100%', height: '100vh' }}>
                            <div className='row getstarted-container d-flex align-items-center h-100'>
                                <div className='col-md-6 socials-header'>
                                    <h2 style={{ marginBottom: '30px' }}>Get Started</h2>
                                    <button className="social-button">Sign In With <i className="fab fa-google"></i></button>
                                    <button className="social-button">Sign In With <i className="fab fa-facebook"></i></button>
                                </div>
                                <div className="orClass">
                                    <p>OR</p>
                                </div>
                                {showLogin ? (
                                    <>
                                        {showEmail ? (
                                            <div className="showEmailClass col-md-6 d-flex flex-column justify-content-center">
                                                <form onSubmit={handleEmailSubmit}>
                                                    <div className="form-group">
                                                        <TextField required color='secondary' error={checkEmail} helperText={checkEmail ? 'enter valid email' : ''} fullWidth label="Enter Email" variant="standard" sx={{ color: 'white', letterSpacing: '2px' }} />

                                                    </div>
                                                    <div className="forgot-password">
                                                        <p style={{ float: 'right' }} onClick={toggleLogin}>Back</p>
                                                    </div>
                                                    <button type="submit" className="submit-button" disabled={isLoading}>Submit</button>
                                                    {isLoading && <LoadingBar color={'white'} progress={progress} onLoaderFinished={() => setProgress(0)} />}
                                                </form>
                                            </div>
                                        ) : (
                                            <div className="col-md-6 login-section">
                                                <h3 style={{ marginBottom: '30px' }}>LOGIN</h3>
                                                <form className="login-form" onSubmit={handleLoginSubmit}>
                                                    <div className="form-group">
                                                        <TextField required color='secondary' onChange={handleInputChange} name="username" fullWidth label="Username" variant="standard" sx={{ color: 'white', letterSpacing: '2px' }} />
                                                    </div>
                                                    <div className="form-group">
                                                        <TextField required color='secondary' error={checkUsername} helperText={checkUsername ? 'username or password invalid' : ''} onChange={handleInputChange} name="password" fullWidth label="Password" variant="standard" sx={{ color: 'white', letterSpacing: '2px' }} type={showPassword ? "text" : "password"}

                                                            InputProps={{
                                                                endAdornment: (
                                                                    <InputAdornment position="end">
                                                                        <IconButton
                                                                            aria-label="toggle password visibility"
                                                                            onClick={() => setShowPassword(!showPassword)}
                                                                            onMouseDown={() => setShowPassword(!showPassword)}
                                                                        >
                                                                            <i class={showPassword ? "far fa-eye" : "far fa-eye-slash"}></i>                                                              </IconButton>
                                                                    </InputAdornment>
                                                                )
                                                            }} />

                                                    </div>
                                                    <div className="form-group">
                                                        <FormControlLabel control={<Checkbox onChange={() => setRefresh(!refresh)} color="default" />} label="Remember Me" />
                                                    </div>
                                                    <div className="forgot-password d-flex justify-content-between">
                                                        <p onClick={toggleEnterEmail}>Forgot Password?</p>
                                                        <p onClick={toggleSignUp}>Not A Member Yet?</p>
                                                    </div>
                                                    <button type="submit" className="submit-button" disabled={isLoading}>Login</button>
                                                    {isLoading && <LoadingBar color={'white'} progress={progress} onLoaderFinished={() => setProgress(0)} />}
                                                </form>
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <div className="col-md-6 signup-section">
                                        <h3 style={{ marginBottom: '30px' }}>SIGN UP</h3>
                                        <form className="login-form" onSubmit={handleSignUpSubmit}>
                                            <div className="form-group">
                                                <TextField required onChange={handleInputChange} name="email" color='secondary' fullWidth label="Email" variant="standard" sx={{ color: 'white', letterSpacing: '2px' }} />

                                            </div>
                                            <div className="form-group">
                                                <TextField required error={checkUsername} helperText={checkUsername ? 'username already exists' : ''} onChange={handleInputChange} name="username" color='secondary' fullWidth label="Username" variant="standard" sx={{ color: 'white', letterSpacing: '2px' }} />
                                            </div>
                                            <div className="form-group">
                                                <TextField required onChange={handleInputChange} name="password" color='secondary' fullWidth label="Password" variant="standard" sx={{ color: 'white', letterSpacing: '2px' }} type={showPassword ? "text" : "password"}

                                                    InputProps={{
                                                        endAdornment: (
                                                            <InputAdornment position="end">
                                                                <IconButton
                                                                    aria-label="toggle password visibility"
                                                                    onClick={() => setShowPassword(!showPassword)}
                                                                    onMouseDown={() => setShowPassword(!showPassword)}
                                                                >
                                                                    <i class={showPassword ? "far fa-eye" : "far fa-eye-slash"}></i>                                                              </IconButton>
                                                            </InputAdornment>
                                                        )
                                                    }} />

                                            </div>
                                            <div className="form-group">
                                                <TextField
                                                    required
                                                    error={checkPassword}
                                                    helperText={checkPassword ? 'passwords do not match' : ''}
                                                    onChange={handleInputChange}
                                                    name="re_password"
                                                    color='secondary'
                                                    fullWidth label="Re-enter Password"
                                                    variant="standard" sx={{ color: 'white', letterSpacing: '2px' }}
                                                    type={showRePassword ? "text" : "password"}

                                                    InputProps={{
                                                        endAdornment: (
                                                            <InputAdornment position="end">
                                                                <IconButton
                                                                    aria-label="toggle password visibility"
                                                                    onClick={() => setReShowPassword(!showRePassword)}
                                                                    onMouseDown={() => setReShowPassword(!showRePassword)}
                                                                >
                                                                    <i class={showRePassword ? "far fa-eye" : "far fa-eye-slash"}></i>
                                                                </IconButton>
                                                            </InputAdornment>
                                                        )
                                                    }} />

                                            </div>
                                            <div className="form-group">
                                                <FormControlLabel control={<Checkbox onChange={() => setRefresh(!refresh)} color="default" />} label="Remember Me" />
                                            </div>
                                            <div className="forgot-password">
                                                <p style={{ float: 'right' }} onClick={toggleLogin}>Already Have An Account?</p>
                                            </div>
                                            <button type="submit" className="submit-button" disabled={isLoading}>Sign Up</button>
                                            {isLoading && <LoadingBar color={'white'} progress={progress} onLoaderFinished={() => setProgress(0)} />}
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
