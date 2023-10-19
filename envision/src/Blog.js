import { Avatar, Badge, Box, Button, Card, CardContent, CardHeader, CardMedia, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton, Slide, ThemeProvider, Typography, createTheme } from '@mui/material';
import background from './images/blogbg.png'
import logo from './images/image.png'
import { forwardRef, useState } from 'react';
import eiffel from './images/eiffel.png'
import { red } from '@mui/material/colors';
import './Blog.css'

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

// Use card initially with just picture and description
// Use Dialog to display enlarged post with comments
// Use List for comments
// Use badge with heart icon for liking comments 
// Use table for displaying all posts
const Transition = forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const Blog = () => {

    const [likes, setLikes] = useState(Math.floor(Math.random() * 200));
    const [liked, setLiked] = useState(false);
    const [open, setOpen] = useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const likePost = () => {
        if (liked)
            setLikes(likes - 1);
        else
            setLikes(likes + 1);
        setLiked(!liked);
    }

    return (
        <ThemeProvider theme={theme}>
            <div className='image-container'>
                <img src={background} alt='background' />
            </div>
            <a href='/'><img src={logo} className='logo' alt='background' /></a>
            <div className='d-flex flex-column align-items-center'>
                <Card sx={{ width: '50vw', backgroundColor: '#000000b5' }} elevation={2}>
                    <CardHeader
                        avatar={<Avatar sx={{ bgcolor: red[500] }}>R</Avatar>}
                        action={
                            <Badge badgeContent={likes} max={99}>
                                <i style={{ fontSize: '24px', color: 'red' }} onClick={likePost} class={liked ? "fas fa-heart" : "far fa-heart"}></i>
                            </Badge>
                        }
                        title='Eiffel Tower in the Night Sky'
                        subheader='October 17, 2023'
                    />
                    <Box sx={{ display: 'flex', position: 'relative' }}>
                        <CardMedia component='img' sx={{ maxHeight: '200px', maxWidth: '200px' }} src={eiffel} alt='eiffel' />
                        <CardContent>
                            <p style={{ fontWeight: '200' }}>Capturing the enchanting beauty of the Eiffel Tower against the night sky, where the city lights weave a mesmerizing tapestry. A breathtaking moment frozen in time. 🌃✨ #EiffelNights #CityscapeMagic #TravelDreams</p>
                        </CardContent>
                        <i onClick={handleClickOpen} class="fas fa-expand"></i>
                    </Box>
                </Card> <br />
                <Dialog
                    open={open}
                    TransitionComponent={Transition}
                    keepMounted
                    onClose={handleClose}
                    maxWidth='md'
                >
                    <Card elevation={2}>
                        <CardHeader
                            avatar={<Avatar sx={{ bgcolor: red[500] }}>R</Avatar>}
                            action={
                                <Badge badgeContent={likes} max={99}>
                                    <i style={{ fontSize: '24px', color: 'red' }} onClick={likePost} class={liked ? "fas fa-heart" : "far fa-heart"}></i>
                                </Badge>
                            }
                            title='Eiffel Tower in the Night Sky'
                            subheader='October 17, 2023'
                        />
                        <CardMedia component='img' sx={{ maxHeight: '300px', maxWidth: '100%' }} src={eiffel} alt='eiffel' />
                        <CardContent>
                            <p style={{ fontWeight: '200' }}>Capturing the enchanting beauty of the Eiffel Tower against the night sky, where the city lights weave a mesmerizing tapestry. A breathtaking moment frozen in time. 🌃✨ #EiffelNights #CityscapeMagic #TravelDreams</p>
                        </CardContent>
                    </Card>
                </Dialog>

            </div>
        </ThemeProvider>
    )
}

export default Blog;