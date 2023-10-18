import { Avatar, Badge, Box, Card, CardContent, CardHeader, CardMedia, IconButton, ThemeProvider, Typography, createTheme } from '@mui/material';
import background from './images/blogbg.png'
import logo from './images/image.png'
import { useState } from 'react';
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


const Blog = () => {

    const [likes, setLikes] = useState(Math.floor(Math.random() * 200));
    const [liked, setLiked] = useState(false);

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
                <Card sx={{width: '50vw', backgroundColor:'#000000b5'}} elevation={2}>
                    <CardHeader 
                        avatar={ <Avatar sx={{ bgcolor: red[500] }}>R</Avatar>}
                        action={
                            <Badge badgeContent={likes} max={99}>
                                <i style={{fontSize:'24px', color:'red'}} onClick={likePost} class={liked ? "fas fa-heart": "far fa-heart"}></i>
                            </Badge>
                        }
                        title='Eiffel Tower in the Night Sky'
                        subheader='October 17, 2023'
                    />
                    <Box sx={{display:'flex', position:'relative'}}>
                        <CardMedia component='img' sx={{maxHeight:'200px', maxWidth:'200px'}} src={eiffel} alt='eiffel'/>
                        <CardContent>
                            <p style={{fontWeight:'200'}}>Capturing the enchanting beauty of the Eiffel Tower against the night sky, where the city lights weave a mesmerizing tapestry. A breathtaking moment frozen in time. 🌃✨ #EiffelNights #CityscapeMagic #TravelDreams</p>
                        </CardContent>
                        <i class="fas fa-expand"></i>
                    </Box>
                </Card> <br/>

                
            </div>
        </ThemeProvider>
    )
}

export default Blog;