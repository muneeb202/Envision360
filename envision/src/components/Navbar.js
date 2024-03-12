import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { setUserData } from '../redux/userSlice';
import axios from 'axios';
import { Avatar, Drawer, IconButton, Tooltip } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

const Navbar = () => {
    const navigate = useNavigate();
    const [sidebar, setSidebar] = useState(false);
    const [name, setName] = useState('');

    const dispatch = useDispatch()

    const userLogout = (e) => {
        e.preventDefault();
        localStorage.removeItem('user');
        window.location.reload();
    }

    const user = localStorage.getItem('user');

    useEffect(() => {
        const getUser = async () => {
            try {
                const response = await axios.post('http://localhost:8000/api/get_user/', { token: user })
                console.log(response)
                setName(response.data['name']);
                const userData = {
                    id: response.data.id,
                    name: response.data.name,
                    email: response.data.email,
                    joining: response.data.date_joined,
                  };
                  dispatch(setUserData(userData));
            }
            catch (e) {
                console.log(e);
            }
        }
        getUser();
    }, [])

    function stringToColor(string) {
        let hash = 0;
        let i;

        /* eslint-disable no-bitwise */
        for (i = 0; i < string.length; i += 1) {
            hash = string.charCodeAt(i) + ((hash << 5) - hash);
        }

        let color = '#';

        for (i = 0; i < 3; i += 1) {
            const value = (hash >> (i * 8)) & 0xff;
            color += `00${value.toString(16)}`.slice(-2);
        }
        return color
    }

    return (
        <div className='navbar'>
            <img src={`${process.env.PUBLIC_URL}/images/newLogo.png`} className='logo' alt='logo' draggable='false' />
            <div className=' d-none d-md-block'>
                <div className='links'>
                    {name ? (
                        <>
                            <a href='#' onClick={userLogout}>Logout</a>
                        </>
                    ) :
                        (
                            <a href='/start'>Get Started</a>
                        )}
                    <a href='/aboutus'>About Us</a>
                    <a href='/blog'>Blog</a>
                    <a className='demoButton' href='/generate'>{name ? 'Generate' : 'Demo'}</a>
                    {name && (
                        <Tooltip title='Click to view profile'>
                            <Link to='/profile'><Avatar sx={{ bgcolor: stringToColor(name), color: 'black' }}>{name.charAt(0).toUpperCase()}</Avatar></Link>
                        </Tooltip>
                    )}
                </div>
            </div>
            <div className='home-navbar d-md-none'>
                <Tooltip title='Click to view more details'>
                    <IconButton className='m-5' onClick={() => setSidebar(true)}><i className="fa-solid fa-bars-staggered" style={{ color: '#ffffff', fontSize: 'x-large' }}></i></IconButton>
                </Tooltip>
                <Drawer className='home-sidebar' open={sidebar} anchor='right' onClose={() => setSidebar(false)}>
                    <div className='sidebar'>
                        <div className='links'>
                            <ul className="navbar-nav" style={{ textAlign: 'center' }}>
                                <li className="nav-item">
                                    {name ? (
                                        <div style={{ marginBottom: '10px', display: 'flex', justifyContent: 'center' }}>
                                            <Tooltip title='Click to view profile'>
                                                <Link to='/profile'><Avatar style={{ height: '80px', width: '80px', fontSize: 'x-large' }} sx={{ bgcolor: stringToColor(name), color: 'black' }}>{name.charAt(0).toUpperCase()}</Avatar></Link>
                                            </Tooltip>
                                        </div>
                                    ) :
                                        (
                                            <Link to={'/start'} >Get Started</Link>
                                        )}
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link" href='/aboutus'>About Us</a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link" href='/blog'>Blog</a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link" href='/generate'>{user ? 'Generate' : 'Demo'}</a>
                                </li>
                            </ul>

                            <div className="nav-item logout-button" style={{ position: 'absolute', bottom: '0', textAlign: 'center' }} >
                                {user && <a className="nav-link" href onClick={userLogout}>Logout</a>}
                            </div>
                        </div>
                    </div>
                </Drawer>
            </div>
        </div>
    )
}

export default Navbar;