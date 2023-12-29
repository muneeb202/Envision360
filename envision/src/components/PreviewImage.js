import React, { useEffect, useRef, useState } from 'react';
import './Viewer.css'
import * as PANOLENS from 'panolens';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Alert, Button, Snackbar, TextField, ThemeProvider, createTheme } from '@mui/material';

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

const ImageViewer = (props) => {
    const imageUrl = props.src

    useEffect(() => {
        // Initialize Panolens viewer
        const img = document.getElementById('image-container')
        const viewer = new PANOLENS.Viewer({
            container: img,
            autoRotate: true,
            autoRotateSpeed: 0.3,
            controlBar: true,
            controlButtons: ['fullscreen'],
            cameraFov: 90
        });
        const panorama = new PANOLENS.ImagePanorama(imageUrl);
        viewer.add(panorama);

        // Clean up the viewer when the component is unmounted
        return () => {
            viewer.dispose();
        };
    }, [imageUrl]);

    return <div id='image-container' style={{ width: '100%', height: '100vh' }} />;
};

const PreviewImage = ({ imagelist, thresh, image }) => {
    const [title, setTitle] = useState('');
    const [message, setMessage] = useState('')
    const [completedImage, setCompletedImage] = useState(image);
    const navigate = useNavigate();
    const [threshold, setThreshold] = useState(thresh)
    const [rendering, setRendering] = useState(false)
    const [loggedIn, setLoggedIn] = useState(true)
    console.log(thresh)

    const handleSave = async () => {
        if (title.trim() === '') {
            setMessage('Image title cannot be empty!')
            return
        }
        await axios.post('http://localhost:8000/api/user_image/', {
            token: localStorage.getItem('user'),
            image: image,
            title: title
        }, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        }).then(() => {
            navigate('/profile')
        }).catch((error => {
            setLoggedIn(false)
            setMessage('You must be logged in to save!')
        }));
    }

    const handleStitchImages = async () => {
        try {
            console.log('sending', threshold)
            setRendering(true)
            const response = await axios.post('http://localhost:8000/api/stitch_images/', {
                images: imagelist,
                thresh: threshold,
                tester: 'testing'
            }, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            console.log(response.data)
            if (response.data.success) {
                setCompletedImage(response.data.stitched_image_url);
                setThreshold(Math.max(1, response.data['threshold'] - 1))
                setRendering(false)
            } else {
                setRendering(false)
                console.error('Image stitching failed:', response.data.message);
            }
        } catch (error) {
            setRendering(false)
            console.error('Error uploading images:', error);
        }
    };

    const closeError = () => {
        if (!loggedIn) {
            navigate('/start')
        }
        setMessage('')
    }


    return (
        <>
            <div className='image-viewer'>
                {!rendering &&
                    <ImageViewer src={'http://localhost:8000' + completedImage} />
                }
                <div className='button-container'>
                    <ThemeProvider theme={theme}>
                        <TextField id="outlined-basic" label="Title" variant="outlined" onChange={(e) => setTitle(e.target.value)} />
                        <Button onClick={handleSave} variant='contained' color='success' sx={{ borderRadius: '20px', letterSpacing: '1px', padding: '10px 40px', margin: '30px 0px' }}>Save</Button>
                        <Button onClick={handleStitchImages} variant='contained' sx={{ borderRadius: '20px', letterSpacing: '1px', padding: '10px 40px' }}>Re-Render</Button>

                        <Snackbar
                            open={message}
                            autoHideDuration={3000}
                            onClose={closeError}
                        >
                            <Alert onClose={closeError} severity="error" sx={{ fontSize: '17px', letterSpacing: '1px' }}>
                                {message}
                            </Alert>
                        </Snackbar>
                    </ThemeProvider>
                </div>
            </div>
        </>
    )
}

export default PreviewImage;
