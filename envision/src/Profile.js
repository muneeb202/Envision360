import background from './images/profilebg.png'
import logo from './images/image.png'
import { AppBar, Avatar, Box, Button, Drawer, IconButton, ImageList, ImageListItem, ImageListItemBar, InputBase, ThemeProvider, Toolbar, Tooltip, Typography, alpha, createTheme, styled } from '@mui/material'
import { red } from '@mui/material/colors';
import { useState } from 'react';
import './Profile.css'

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

const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
        backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
        marginLeft: theme.spacing(1),
        width: 'auto',
    },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: 'inherit',
    '& .MuiInputBase-input': {
        padding: theme.spacing(1, 1, 1, 0),
        paddingLeft: `calc(1em + ${theme.spacing(4)})`,
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('sm')]: {
            width: '20ch',
            '&:focus': {
                width: '30ch',
            },
        },
    },
}));

const Profile = () => {
    const [sidebar, setSidebar] = useState(false);
    const [showFav, setShowFav] = useState(false);
    const [showPosts, setShowPosts] = useState(false);

    const images = [
        {
            src: 'canyon.jpg',
            title: 'Grand Canyon',
            date: '20th September 2023'
        },
        {
            src: 'eiffel.png',
            title: 'Eiffel Tower',
            date: '3rd October 2023'
        },
        {
            src: 'petra.jpg',
            title: 'Petra',
            date: '12th November 2023'
        },
        {
            src: 'pyramids.png',
            title: 'Great Pyramids of Giza',
            date: '8th December 2023'
        },
        {
            src: 'machu pichu.jpg',
            title: 'Machu Picchu',
            date: '5th January 2024'
        }
    ];

    const togglePosts = () =>{ 
        setShowPosts(!showPosts)
        setShowFav(false);
    } 

    const toggleFav = () =>{ 
        setShowFav(!showFav)
        setShowPosts(false);
    } 

    return (
        <ThemeProvider theme={theme}>
            <div className='image-container'>
                <img src={background} alt='background' draggable='false' />
            </div>
            <div className='home-navbar'>
                <a href='/'><img src={logo} className='logo' alt='background' draggable='false' /></a>
                <div className='m-5' onClick={() => setSidebar(true)}><Tooltip title='Click to view more details'><Avatar sx={{ bgcolor: red[500] }}>R</Avatar></Tooltip></div>
                <Drawer open={sidebar} anchor='right' onClose={() => setSidebar(false)}>
                    <div className='sidebar'>
                        <Avatar sx={{ bgcolor: red[500], height: 100, width: 100, fontSize: 30 }}>R</Avatar><br />
                        <h4>Ramon Sanchez</h4><br />
                        <p>ramon_sanchez@gmail.com</p>
                        <p><span>Joined: </span>20 October 2023</p>
                    </div>
                </Drawer>
            </div>
            <Box sx={{ width:'80vw', paddingLeft:'10vw' }}>
                    <AppBar position="static" sx={{backgroundColor:'transparent'}}>
                        <Toolbar>
                            <IconButton
                                size="large"
                                edge="start"
                                color="inherit"
                                aria-label="open drawer"
                                sx={{ mr: 2 }}
                            >
                                <i className="fas fa-images"></i>
                            </IconButton>
                            <Typography
                                variant="h6"
                                noWrap
                                component="div"
                                sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }}
                            >
                                Your {showPosts? 'Blog Posts' : showFav ? 'Favourite Images' : '360\u00B0 Images'}
                            </Typography>
                            <IconButton onClick={togglePosts} sx={{backgroundColor: showPosts ? '#ffffff38' : 'transparent'}}>
                                <Tooltip title={showPosts ? 'Show All' : 'Show Blog Posts'}><i className="fas fa-blog"/></Tooltip>
                            </IconButton>
                            <IconButton onClick={toggleFav}>
                                <Tooltip title={showFav ? 'Show All': 'Show Favourites'}><i className={showFav ? "fas fa-heart" :"far fa-heart"}/></Tooltip>
                            </IconButton>
                            <Search>
                                <SearchIconWrapper>
                                <i className="fas fa-search"></i>  
                                </SearchIconWrapper>
                                <StyledInputBase
                                    placeholder="Search…"
                                    inputProps={{ 'aria-label': 'search' }}
                                />
                            </Search>
                        </Toolbar>
                    </AppBar>
                    <br/>
                    <ImageList cols={3} gap={8}>
                        {images.map((image) => (
                            <ImageListItem key={image.src}>
                                <img src={`${process.env.PUBLIC_URL}/images/${image.src}`}/>
                                <ImageListItemBar
                                    title={image.title}
                                    subtitle={image.date}
                                    actionIcon={
                                        <IconButton>
                                            <i className="fas fa-expand"/>
                                        </IconButton>
                                    }
                                />
                            </ImageListItem>
                        ))}
                    </ImageList>
                </Box>
        </ThemeProvider>
    )
}

export default Profile;