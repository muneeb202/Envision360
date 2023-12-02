import { Avatar, Badge, Box, Button, Card, CardContent, CardHeader, CardMedia, Collapse, Dialog, IconButton, List, ListItem, ListItemAvatar, ListItemText, Slide, TextField, ThemeProvider, Tooltip, createTheme } from '@mui/material';
import { forwardRef, useEffect, useState } from 'react';
import { blue, purple, red } from '@mui/material/colors';
import './Blog.css'
import axios from 'axios';

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

    const [liked, setLiked] = useState([]);
    const [open, setOpen] = useState(false);
    const [comments, setComments] = useState([]);
    const [Showcomments, setShowComments] = useState(false);
    const [blogPosts, setBlogPosts] = useState([]);
    const [selectedPost, setSelectedPost] = useState(null);
    const [comment, setComment] = useState('');

    const likePost = async (post_id) => {
        try {
            const response = await axios.post('http://127.0.0.1:8000/api/update_likes/', {
                token: localStorage.getItem('user'),
                image_id: post_id,
            });
        } catch (error) {
            console.error('Error updating likes:', error);
        }
    };

    const handleClose = () => {
        setOpen(false);
    };

    useEffect(() => {
        const fetchBlogPosts = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:8000/api/blogposts/');
                setBlogPosts(response.data);
            } catch (error) {
                console.error('Error fetching blog posts:', error);
            }
        };

        fetchBlogPosts();
    }, []);

    const handleOpenDialog = (post) => {
        setSelectedPost(post);
        setOpen(true);
    };

    const handleCommentChange = (event) => {
        setComment(event.target.value);
    };

    const postComment = async () => {
        try {
            const response = await axios.post(
                'http://127.0.0.1:8000/api/comment/',
                {
                    token: localStorage.getItem('user'),
                    image_id: selectedPost.id,
                    comment_description: comment,
                }
            );
            console.log('Comment posted successfully:', response.data);
        } catch (error) {
            console.error('Error posting comment:', error.response.data);
        }
    };

    useEffect(() => {
        if (selectedPost) {
            fetchComments(selectedPost.id);
        }
    }, [selectedPost]);

    const fetchComments = async (post_id) => {
        try {
            const response = await axios.get('http://localhost:8000/api/comment/', {
                params: {
                    token: localStorage.getItem('user'),
                    post_id: post_id
                }
            });
            setComments(response.data);
        } catch (error) {
            console.error('Error fetching comments:', error);
        }
    };

    console.log(blogPosts)
    return (
        <div style={{ height: 'max-content', minHeight: '100vh' }}>
            <ThemeProvider theme={theme}>
                <div className='image-container'>
                    <img src={`${process.env.PUBLIC_URL}/images/blogbg.png`} alt='background' draggable='false' />
                </div>
                <a href='/'><img style={{ paddingTop: '10px' }} src={`${process.env.PUBLIC_URL}/images/newLogo.png`} className='logo' alt='background' draggable='false' /></a>
                <div className='d-flex flex-column align-items-center'>
                    {blogPosts.map((post) => (
                        <Card key={post.id} sx={{ width: '50vw', backgroundColor: '#000000b5' }} elevation={2}>
                            <CardHeader
                                avatar={<Tooltip title={post.username}><Avatar sx={{ bgcolor: red[500] }}>{post.username.charAt(0).toUpperCase()}</Avatar></Tooltip>}
                                action={
                                    <Badge badgeContent={post.likes} max={99}>
                                        <i style={{ fontSize: '24px', color: 'red' }} onClick={() => likePost(post.id)} class={post.liked_by_user ? "fas fa-heart" : "far fa-heart"}></i>
                                    </Badge>
                                }
                                title={post.title}
                                subheader={post.created_date}
                            />
                            <Box sx={{ display: 'flex', position: 'relative' }}>
                                <CardMedia component='img' sx={{ maxHeight: '200px', maxWidth: '200px' }} src={'http://127.0.0.1:8000' + post.image} draggable='false' alt={post.title} />
                                <CardContent>
                                    <p style={{ fontWeight: '200' }}>{post.description}</p>
                                </CardContent>
                                <IconButton sx={{ position: 'absolute', bottom: 10, right: 10, fontSize: 20 }}>
                                    <i onClick={() => handleOpenDialog(post)} className="fas fa-expand"></i>
                                </IconButton>
                            </Box>
                        </Card>
                    ))}
                    <Dialog
                        open={open}
                        TransitionComponent={Transition}
                        keepMounted
                        onClose={handleClose}
                        maxWidth='md'
                    >
                        {selectedPost && (
                            <Card elevation={2}>
                                <CardHeader
                                    avatar={<Tooltip title={selectedPost.username}><Avatar sx={{ bgcolor: red[500] }}>{selectedPost.username.charAt(0).toUpperCase()}</Avatar></Tooltip>}
                                    action={
                                        <Badge badgeContent={selectedPost.likes} max={99}>
                                            <IconButton style={{ fontSize: '24px', color: 'red' }} onClick={() => likePost(selectedPost.id)}>
                                                <i className={liked ? "fas fa-heart" : "far fa-heart"}></i>
                                            </IconButton>
                                        </Badge>
                                    }
                                    title={selectedPost.title}
                                    subheader={selectedPost.created_date}
                                />
                                <CardMedia component='img' sx={{ maxHeight: '300px', maxWidth: '100%' }} draggable='false' src={'http://127.0.0.1:8000' + selectedPost.image} alt={selectedPost.title} />
                                <CardContent>
                                    <p style={{ fontWeight: '200' }}>{selectedPost.description}</p>
                                </CardContent>
                                <TextField style={{ width: '100%' }} id="outlined-basic" label="Add a comment" variant="outlined" value={comment} onChange={handleCommentChange} />
                                <Button disabled={comment.length === 0} variant='contained' onClick={postComment} sx={{ width: '100%', backgroundColor: '#6666667d', letterSpacing: '2px' }}>Post Comment</Button>
                                <Button variant='contained' onClick={() => setShowComments(!Showcomments)} sx={{ width: '100%', backgroundColor: '#6666667d', letterSpacing: '2px' }}>{Showcomments ? 'Hide' : 'View'} Comments</Button>
                                <Collapse in={Showcomments} timeout="auto" unmountOnExit>
                                    <List dense={true} sx={{ bgcolor: '#66666630' }}>
                                        {Object.values(comments).map((comment, index) => (
                                            <ListItem key={comment.id}>
                                                <ListItemAvatar>
                                                    <Avatar sx={{ bgcolor: index % 2 === 0 ? blue[700] : purple[700], height: '2vw', width: '2vw', fontSize: '15px' }}>
                                                        {comment.username.charAt(0).toUpperCase()}
                                                    </Avatar>
                                                </ListItemAvatar>
                                                <ListItemText primary={comment.description} secondary={comment.created_date.slice(0, 10)} />
                                            </ListItem>
                                        ))}
                                    </List>
                                </Collapse>
                            </Card>
                        )}
                    </Dialog>

                </div>
            </ThemeProvider>
        </div>
    )
}

export default Blog;