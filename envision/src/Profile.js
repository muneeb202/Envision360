import background from './images/profilebg.png'
import logo from './images/image.png'
import { ThemeProvider, createTheme } from '@mui/material'

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

    return(
        <ThemeProvider theme={theme}>
            <div className='image-container'>
                <img src={background} alt='background' draggable='false'/>
            </div>
            <a href='/'><img src={logo} className='logo' alt='background' draggable='false'/></a>
            <div className='d-flex'>
                <div className='left-container'>

                </div>
                <div className='right-container'>

                </div>
            </div>
        </ThemeProvider>
    )
}
 
export default Profile;