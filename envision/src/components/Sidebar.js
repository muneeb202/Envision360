import { Avatar, Drawer, IconButton, Tooltip } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

const Sidebar = () => {
    const [sidebar, setSidebar] = useState(false);
    const [user, setUser] = useState({ name: ' ', email: ' ' });
    const location = useLocation();

    const isActive = (path) => {
        return location.pathname === path ? 'active' : '';
    };

    useEffect(() => {
        const getUser = async () => {
            try {
                const response = await axios.post('http://localhost:8000/api/get_user/', { token: localStorage.getItem('user') })
                console.log(response)
                setUser(response.data);
            }
            catch (e) {
                console.log(e);
                setUser(null)
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
    const isNullOrUndefined = (value) => value === null || value === undefined;

    const formattedDate = !isNullOrUndefined(user) && !isNullOrUndefined(user.date_joined)
        ? new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(user.date_joined))
        : '';
    return (
        <div className='home-navbar d-flex justify-content-between'>
            <a href='/'><img style={{ paddingTop: '10px' }} src={`${process.env.PUBLIC_URL}/images/newLogo.png`} className='logo' alt='background' draggable='false' /></a>
            {user &&
                <>
                    <IconButton className='m-5' onClick={() => setSidebar(true)}><Tooltip title='Click to view more details'><Avatar sx={{ bgcolor: stringToColor(user.name) }}>{user.name.charAt(0).toUpperCase()}</Avatar></Tooltip></IconButton>
                    <Drawer className={`${location.pathname.slice(1)}-container`} open={sidebar} anchor='right' onClose={() => setSidebar(false)}>
                        <div className='sidebar '>
                            <Avatar sx={{ bgcolor: stringToColor(user.name), height: 100, width: 100, fontSize: 30 }}>{user.name.charAt(0).toUpperCase()}</Avatar><br />
                            <h4>{user.name.split(' ')
                                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                                .join(' ')}</h4><br />
                            <p>{user.email}</p>
                            <p><span>Joined: </span>{formattedDate}</p>
                            <br />
                            <Link to='/' className={isActive('/')}>Home</Link>
                            <Link to='/generate' className={isActive('/generate')}>Generate</Link>
                            <Link to='/blog' className={isActive('/blog')}>Blog</Link>
                            <Link to='/profile' className={isActive('/profile')}>Profile</Link>
                        </div>
                    </Drawer>
                </>
            }
        </div>
    )
}

export default Sidebar;