import background from './images/profilebg.png'
import logo from './images/image.png'
import { AppBar, Avatar, Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Drawer, IconButton, ImageList, ImageListItem, ImageListItemBar, InputBase, Popover, Snackbar, TextField, ThemeProvider, Toolbar, Tooltip, Typography, alpha, createTheme, styled, useMediaQuery } from '@mui/material'
import { green, red } from '@mui/material/colors';
import { useEffect, useRef, useState } from 'react';
import emptyAnimation from './images/empty.json'
import './Profile.css'
import Lottie, { LottieRefCurrentProps } from 'lottie-react';

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
        [theme.breakpoints.up('md')]: {
            width: '20ch',
            '&:focus': {
                width: '30ch',
            },
        },
        [theme.breakpoints.down('md')]: {
            width: '10ch',
            '&:focus': {
                width: '15ch',
            },
        },
    },
}));

const Profile = () => {
    const [sidebar, setSidebar] = useState(false);
    const [showDialog, setShowDialog] = useState(false);
    const [showFav, setShowFav] = useState(false);
    const [post, setPost] = useState({})
    const [showPosts, setShowPosts] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [message, setMessage] = useState('');
    const [selectedImageToDelete, setSelectedImageToDelete] = useState(null);
    const [filteredImages, setFilteredImages] = useState([]);
    const [open, setOpen] = useState(false);
    const animationRef = useRef();
    useEffect(() => {
        animationRef.current = <LottieRefCurrentProps />;
    }, []);
    const matchDownMd = useMediaQuery(theme.breakpoints.down('md'));
    const [anchorEl, setAnchorEl] = useState(null);
    const popOpen = Boolean(anchorEl);
    const [delanchorEl, setDelAnchorEl] = useState(null);
    const delpopOpen = Boolean(delanchorEl);

    const [images, setImages] = useState([
        {
            id: 0,
            src: 'canyon.jpg',
            title: 'Grand Canyon',
            date: '20th September 2023',
            posted: true,
            favourite: false
        },
        {
            id: 1,
            src: 'eiffel.png',
            title: 'Eiffel Tower',
            date: '3rd October 2023',
            posted: true,
            favourite: true
        },
        {
            id: 2,
            src: 'petra.jpg',
            title: 'Petra',
            date: '12th November 2023',
            posted: false,
            favourite: true
        },
        {
            id: 3,
            src: 'pyramids.png',
            title: 'Great Pyramids of Giza',
            date: '8th December 2023',
            posted: false,
            favourite: false
        },
        {
            id: 4,
            src: 'machu pichu.jpg',
            title: 'Machu Picchu',
            date: '5th January 2024',
            posted: false,
            favourite: false
        }
    ])

    const togglePosts = () => {
        setShowPosts(!showPosts)
        setShowFav(false);
    }

    const toggleFav = () => {
        setShowFav(!showFav)
        setShowPosts(false);
    }

    const filterImages = () => {
        const filtered = images.filter((image) => {
            if (showFav && image.favourite)
                return image.title.toLowerCase().includes(searchQuery.toLowerCase());
            else if (showFav)
                return false;

            if (showPosts && image.posted)
                return image.title.toLowerCase().includes(searchQuery.toLowerCase());
            else if (showPosts)
                return false;

            return image.title.toLowerCase().includes(searchQuery.toLowerCase());
        });
        setFilteredImages(filtered);
    }

    const favImage = (image) => {
        images[image.id].favourite = !images[image.id].favourite;
        filterImages();
    };

    const handleClose = () => setShowDialog(false)

    const handleOpen = (image) => {
        setShowDialog(true);
        setPost(image);
    }

    const handlePost = () => {
        images[post.id].posted = true;
        filterImages();
        setShowDialog(false);
        setMessage("Posted Image to Blog");
        setOpen(true);
    }

    const deleteImage = () => {
        const updatedImages = [...images.slice(undefined,selectedImageToDelete.id), ...images.slice(selectedImageToDelete.id + 1)];
        setImages(updatedImages.map((image, index) => ({...image, id:index})));
        setDelAnchorEl(null);
    }

    useEffect(() => {
        filterImages();
    }, [searchQuery, showFav, showPosts, images]);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleRemoveClose = () => {
        setAnchorEl(null);
    };

    const handleDeleteClose = () => {
        setDelAnchorEl(null);
    };

    const handleDelete = (image) => {
        images[image.id].posted = false;
        filterImages();
        setAnchorEl(null);
        setMessage("Deleted Image from Blog");
        setOpen(true);
    }

    const confirmDelete = (image, e) => {
        setDelAnchorEl(e.currentTarget)
        setSelectedImageToDelete(image)
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
            <Box sx={{ width: '90vw', paddingLeft: '10vw' }}>
                <AppBar position="static" sx={{ backgroundColor: 'transparent' }}>
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
                            sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block', }, letterSpacing: 2, fontWeight: 200 }}
                        >
                            Your {showPosts ? 'Blog Posts' : showFav ? 'Favourite Images' : '360\u00B0 Images'}
                        </Typography>
                        <IconButton onClick={togglePosts} sx={{ backgroundColor: showPosts ? '#ffffff38' : 'transparent' }}>
                            <Tooltip title={showPosts ? 'Show All' : 'Show Blog Posts'}><i className="fas fa-blog" /></Tooltip>
                        </IconButton>
                        <IconButton onClick={toggleFav}>
                            <Tooltip title={showFav ? 'Show All' : 'Show Favourites'}><i className={showFav ? "fas fa-star" : "far fa-star"} /></Tooltip>
                        </IconButton>
                        <Search>
                            <SearchIconWrapper>
                                <i className="fas fa-search"></i>
                            </SearchIconWrapper>
                            <StyledInputBase
                                placeholder="Search…"
                                inputProps={{ 'aria-label': 'search' }}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </Search>
                    </Toolbar>
                </AppBar>
                <br />
                <ImageList cols={matchDownMd ? 3 : 5} gap={8}>
                    {filteredImages.length === 0 ? (
                        <>
                            <ImageListItem cols={matchDownMd ? 3 : 5}>
                                <Lottie
                                    style={{ maxHeight: 300 }}
                                    lottieRef={animationRef}
                                    loop={false}
                                    onComplete={() => animationRef.current.goToAndPlay(162, true)}
                                    animationData={emptyAnimation}
                                />
                                <p className='empty'>You have no such images!</p>
                            </ImageListItem>
                        </>
                    ) : (
                        filteredImages.map((image, index) => (
                            <ImageListItem key={image.src} >
                                <img src={`${process.env.PUBLIC_URL}/images/${image.src}`} alt={image.title} />
                                <ImageListItemBar
                                    title={image.title}
                                    subtitle={image.date}
                                    actionIcon={
                                        image.posted ? <>
                                            <IconButton onClick={handleClick}>
                                                <Tooltip title='Remove from Blog'><i className="fa-solid fa-xmark"></i></Tooltip>
                                            </IconButton>
                                            <Popover open={popOpen} anchorEl={anchorEl} onClose={handleRemoveClose}>
                                                <div className='d-flex align-items-center confirmation'>
                                                    <p>Confirm</p>
                                                    <Button onClick={handleRemoveClose} sx={{ minWidth: 0 }}><i style={{ color: red[500], fontSize: 20 }} className="fa-solid fa-xmark"></i></Button>
                                                    <Button onClick={() => handleDelete(image)} sx={{ minWidth: 0 }}><i style={{ color: green[500], fontSize: 20 }} className="fa-solid fa-check"></i></Button>
                                                </div>
                                            </Popover>
                                        </>
                                            :
                                            <IconButton onClick={() => handleOpen(image)}>
                                                <Tooltip title='Post to Blog'><i className="fa-solid fa-cloud-arrow-up"></i></Tooltip>
                                            </IconButton>
                                    }
                                />
                                <IconButton sx={{position:'absolute'}} onClick={() => favImage(image)}>
                                    <i style={{ fontSize: 15 }} className={`${image.favourite ? 'fas' : 'far'} fa-star`} />
                                </IconButton>
                                <Tooltip title='Delete'><IconButton onClick={(e) => confirmDelete(image, e)} sx={{position:'absolute', right:0}}>
                                    <i style={{ fontSize: 15 }} class="fa-solid fa-trash"></i>
                                </IconButton></Tooltip>
                                <Popover id={index} open={delpopOpen} anchorEl={delanchorEl} onClose={handleDeleteClose}>
                                    <div className='d-flex align-items-center confirmation'>
                                        <p>Delete</p>
                                        <Button onClick={handleDeleteClose} sx={{ minWidth: 0 }}><i style={{ color: red[500], fontSize: 20 }} className="fa-solid fa-xmark"></i></Button>
                                        <Button onClick={() => deleteImage(image)} sx={{ minWidth: 0 }}><i style={{ color: green[500], fontSize: 20 }} className="fa-solid fa-check"></i></Button>
                                    </div>
                                </Popover>

                            </ImageListItem>
                        ))
                    )}
                </ImageList>
            </Box>
            <Dialog open={showDialog} onClose={handleClose} maxWidth='md'>
                <DialogTitle>{post.title}</DialogTitle>
                <DialogContent>
                    <img style={{ maxWidth: '100%', maxHeight: '60vh' }} src={`${process.env.PUBLIC_URL}/images/${post.src}`} alt={post.title} /><br /><br />
                    <TextField
                        autoFocus
                        multiline
                        label="Caption"
                        fullWidth
                        variant="standard"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={handlePost}>Post</Button>
                </DialogActions>
            </Dialog>
            <Snackbar
                open={open}
                autoHideDuration={6000}
                onClose={() => setOpen(false)}
                message={message}
                action={<IconButton onClick={() => setOpen(false)}><i style={{ color: 'gray' }} className="fa-solid fa-xmark"></i></IconButton>}
            />
        </ThemeProvider>
    )
}

export default Profile;