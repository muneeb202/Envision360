import { Avatar, Badge, Box, Button, Card, CardContent, CardHeader, CardMedia, CircularProgress, Collapse, Dialog, IconButton, InputAdornment, List, ListItem, ListItemAvatar, ListItemText, Slide, TextField, ThemeProvider, Tooltip, createTheme } from '@mui/material';
import { forwardRef, useEffect, useState } from 'react';
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
    const [open, setOpen] = useState(false);
    const [comments, setComments] = useState([]);
    const [Showcomments, setShowComments] = useState(false);
    const [blogPosts, setBlogPosts] = useState([]);
    const [selectedPost, setSelectedPost] = useState(null);
    const [comment, setComment] = useState('');
    const [isLoading, setIsLoading] = useState(false)

    const likePost = async (post_id) => {
        try {
            const response = await axios.post('http://127.0.0.1:8000/api/update_likes/', {
                token: localStorage.getItem('user'),
                image_id: post_id,
            });

            setBlogPosts((blogPosts) => {
                return blogPosts.map((post) => {
                    if (post.id === post_id) {
                        return {
                            ...post,
                            liked_by_user: !post.liked_by_user,
                            likes: post.likes + (post.liked_by_user ? -1 : 1),
                        };
                    } else {
                        return post;
                    }
                });
            });

            if (selectedPost)
                setSelectedPost({
                    ...selectedPost,
                    liked_by_user: !selectedPost.liked_by_user,
                    likes: selectedPost.likes + (selectedPost.liked_by_user ? -1 : 1),
                })
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
                const response = await axios.get('http://127.0.0.1:8000/api/blogposts/', {
                    params: {
                        token: localStorage.getItem('user')
                    }
                });
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
        setIsLoading(true)
        try {
            const response = await axios.post(
                'http://127.0.0.1:8000/api/comment/',
                {
                    token: localStorage.getItem('user'),
                    image_id: selectedPost.id,
                    comment_description: comment,
                }
            );
            setComments([...comments, response.data['comment']])
            setComment('')
        } catch (error) {
            console.error('Error posting comment:', error.response.data);
        }
        setIsLoading(false)
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
            console.log(response.data)
        } catch (error) {
            console.error('Error fetching comments:', error);
        }
    };

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
        <div style={{ height: 'max-content', minHeight: '100vh' }}>
            <ThemeProvider theme={theme}>
                <div className='image-container'>
                    <img src={`${process.env.PUBLIC_URL}/images/blogbg.png`} alt='background' draggable='false' />
                </div>
                <a href='/'><img style={{ paddingTop: '10px' }} src={`${process.env.PUBLIC_URL}/images/newLogo.png`} className='logo' alt='background' draggable='false' /></a>
                <div className='d-flex flex-column align-items-center'>
                    {blogPosts.map((post, index) => (
                        <Card key={post.id} sx={{ width: '50vw', backgroundColor: '#000000b5', marginBottom: '50px' }} elevation={2}>
                            <CardHeader
                                avatar={<Tooltip title={post.username}><Avatar sx={{ bgcolor: stringToColor(post.username) }}>{post.username.charAt(0).toUpperCase()}</Avatar></Tooltip>}
                                action={
                                    <Badge badgeContent={post.likes} max={99}>
                                        <IconButton onClick={() => likePost(post.id)} >
                                            <i style={{ fontSize: '24px', color: 'red' }} className={post.liked_by_user ? "fas fa-heart" : "far fa-heart"}></i>
                                        </IconButton>
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
                                <IconButton onClick={() => handleOpenDialog(post)} sx={{ position: 'absolute', bottom: 10, right: 10, fontSize: 20 }}>
                                    <i className="fas fa-expand"></i>
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
                                    avatar={<Tooltip title={selectedPost.username}><Avatar sx={{ bgcolor: stringToColor(selectedPost.username) }}>{selectedPost.username.charAt(0).toUpperCase()}</Avatar></Tooltip>}
                                    action={
                                        <Badge badgeContent={selectedPost.likes} max={99}>
                                            <IconButton style={{ fontSize: '24px', color: 'red' }} onClick={() => likePost(selectedPost.id)}>
                                                <i className={selectedPost.liked_by_user ? "fas fa-heart" : "far fa-heart"}></i>
                                            </IconButton>
                                        </Badge>
                                    }
                                    title={selectedPost.title}
                                    subheader={selectedPost.created_date}
                                />
                                <CardMedia component='img' sx={{ maxHeight: '400px', maxWidth: '100%' }} draggable='false' src={'http://127.0.0.1:8000' + selectedPost.image} alt={selectedPost.title} />
                                <CardContent>
                                    <p style={{ fontWeight: '200' }}>{selectedPost.description}</p>
                                </CardContent>
                                <Button variant='contained' onClick={() => setShowComments(!Showcomments)} sx={{ width: '100%', backgroundColor: '#6666667d', letterSpacing: '2px' }}>{Showcomments ? 'Hide' : 'View'} Comments</Button>
                                <Collapse in={Showcomments} timeout="auto" unmountOnExit>
                                    <List dense={true} sx={{ bgcolor: '#66666630' }}>
                                        {Object.values(comments).map((comment, index) => (
                                            <ListItem key={comment.id}>
                                                <ListItemAvatar>
                                                    <Avatar sx={{ bgcolor: stringToColor(comment.username), height: '2vw', width: '2vw', fontSize: '15px' }}>
                                                        {comment.username.charAt(0).toUpperCase()}
                                                    </Avatar>
                                                </ListItemAvatar>
                                                <ListItemText primary={comment.description} secondary={comment.created_date.slice(0, 10)} />
                                            </ListItem>
                                        ))}
                                    </List>
                                    <TextField style={{ width: '100%' }}
                                        label="Add a comment"
                                        variant="outlined"
                                        value={comment}
                                        onChange={handleCommentChange}
                                        InputProps={{
                                            endAdornment:
                                                <InputAdornment position='end'>
                                                    {isLoading ? (
                                                        <CircularProgress />
                                                    ) : (
                                                        <IconButton onClick={postComment} disabled={comment.length === 0}>
                                                            <i className="fa-solid fa-paper-plane"></i>
                                                        </IconButton>
                                                    )}

                                                </InputAdornment>
                                        }}
                                    />
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