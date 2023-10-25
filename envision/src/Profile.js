import background from './images/profilebg.png'
import logo from './images/image.png'
import { Avatar, Box, Button, Drawer, ThemeProvider, Tooltip, createTheme } from '@mui/material'
import { red } from '@mui/material/colors';
import { useState } from 'react';

const theme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: 'rgb(255, 255, 255)',
        },
        secondary: {
            main: '#8331D6',
        }
    },
    typography: {
        fontFamily: 'Poppins, sans-serif',
    }
});

const Profile = () => {
    const [sidebar, setSidebar] = useState(false);

    return(
        <ThemeProvider theme={theme}>
            <div className='image-container'>
                <img src={background} alt='background' draggable='false'/>
            </div>
            <div className='home-navbar'>
                <a href='/'><img src={logo} className='logo' alt='background' draggable='false'/></a>
                <div className='m-5' onClick={() => setSidebar(true)}><Tooltip title='Click to view more details'><Avatar sx={{ bgcolor: red[500] }}>R</Avatar></Tooltip></div>
                <Drawer open={sidebar} anchor='right' onClose={() => setSidebar(false)}>
                    <Box sx={{width:400}}>

                    </Box>
                </Drawer>
            </div>
        </ThemeProvider>
    )
}
 
export default Profile;