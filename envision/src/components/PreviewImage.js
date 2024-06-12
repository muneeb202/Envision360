import React, { useEffect, useRef, useState } from 'react';
import './Viewer.css'
import * as PANOLENS from 'panolens';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Alert, Button, CircularProgress, Snackbar, TextField, ThemeProvider, createTheme } from '@mui/material';
import { Stage, Layer, Rect } from "react-konva";
import { height, width } from '@mui/system';

const theme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: 'rgb(255, 255, 255)',
        },
        secondary: {
            main: '#8331D6',
        },
        red: { main: '#FF5733' }
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
    const [loading, setLoading] = useState(false);
    const [adjust, setAdjust] = useState(false);
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
    const [prompt, setPrompt] = useState('');
    const [negPrompt, setNegPrompt] = useState('');

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

    const handleGapFilling = async () => {
        setRendering(true)
        setLoading(true)
        try {
            console.log('handleGapFilling')
            const response = await axios.post('http://localhost:8000/api/gap_filling/');
            console.log(response.data)
            setCompletedImage(response.data.recieved_image_url);
            setRendering(false)
            setLoading(false)
        } catch (error) {
            console.error('handleGapFilling:', error);
            setLoading(false)
        }
    };


    const closeError = () => {
        if (!loggedIn) {
            navigate('/start')
        }
        setMessage('')
    }

    const [newAnnotation, setNewAnnotation] = useState([]);

    const handleMouseDown = (event) => {
        if (newAnnotation.length === 0) {
            const { x, y } = event.target.getStage().getPointerPosition();
            setNewAnnotation([{ x, y, width: 0, height: 0, key: "0", }]);
        }
    };

    const handleMouseUp = (event) => {
        if (newAnnotation.length === 1) {
            const sx = newAnnotation[0].x;
            const sy = newAnnotation[0].y;
            const { x, y } = event.target.getStage().getPointerPosition();
            const annotationToAdd = {
                x: sx,
                y: sy,
                width: x - sx,
                height: y - sy,
                key: '0',
            };
            console.log(annotationToAdd)
            setNewAnnotation([annotationToAdd]);
            const minX = Math.min(sx, x)
            const minY = Math.min(sy, y)
            const maxX = Math.max(sx, x)
            const maxY = Math.max(sy, y)
            console.log("Top-left corner:", minX, minY);
            console.log("Bottom-right corner:", maxX, maxY);
            const ratio = dimensions.width / window.innerWidth;
            console.log('Scaled x: ', Math.round(minX * ratio), Math.round(maxX * ratio))
            if (Math.abs(annotationToAdd.width) > 20 && Math.abs(annotationToAdd.height) > 20)
                adjustImage(Math.round(minX * ratio), minY, Math.round(maxX * ratio), maxY)
        }
        setTimeout(() => setNewAnnotation([]), 1000)
    };

    const adjustImage = async (x1, y1, x2, y2) => {
        setLoading(true)
        axios.post('http://localhost:8000/api/adjust_image/', { x1, y1, x2, y2, prompt, negPrompt })
            .then((response) => {
                console.log(response)
                setCompletedImage(response.data.recieved_image_url);
                setTimeout(() => {
                    setLoading(false)
                }, 3000);
            })
            .catch((e) => {
                console.log(e)
                setLoading(false);
            })
    }


    const handleMouseMove = (event) => {
        if (newAnnotation.length === 1) {
            const sx = newAnnotation[0].x;
            const sy = newAnnotation[0].y;
            const { x, y } = event.target.getStage().getPointerPosition();
            const width = x - sx;
            const height = y - sy;
            setNewAnnotation([
                {
                    x: sx,
                    y: sy,
                    width: width,
                    height: height,
                    key: "0",
                },
            ]);
        }
    };

    const handleImageLoad = (event) => {
        const { naturalWidth, naturalHeight } = event.target;
        console.log(naturalHeight, naturalWidth)
        setDimensions({ width: naturalWidth, height: naturalHeight });
    };

    return (
        <>
            {loading ?
                <div className='d-flex justify-content-center align-items-center' style={{ height: '100vh', width: '99vw', backgroundColor: 'grey' }}>
                    <CircularProgress />
                </div>
                :
                <div className='image-viewer'>
                    {(!rendering && !adjust) &&
                        <ImageViewer src={'http://localhost:8000' + completedImage} />
                    }
                    {adjust &&
                        <>
                            {loading ?
                                <div className='d-flex justify-content-center align-items-center' style={{ height: '100vh', width: '99vw', backgroundColor: 'grey' }}>
                                    <CircularProgress />
                                </div>
                                :
                                <img id='image' src={'http://localhost:8000' + completedImage} draggable={false} onLoad={handleImageLoad} />
                            }
                            <Stage
                                onMouseDown={handleMouseDown}
                                onMouseUp={handleMouseUp}
                                onMouseMove={handleMouseMove}
                                width={window.innerWidth - 10}
                                height={window.innerHeight}
                            >
                                <Layer >
                                    {newAnnotation.map((value) => {
                                        return (
                                            <Rect
                                                x={value.x}
                                                y={value.y}
                                                width={value.width}
                                                height={value.height}
                                                fill="#6c696973"
                                                stroke="#b8b8b8"
                                            />
                                        );
                                    })}
                                </Layer>
                            </Stage>
                        </>
                    }
                    <div className='button-container'>
                        <ThemeProvider theme={theme}>
                            {!adjust ? <>
                                <TextField id="outlined-basic" label="Title" variant="outlined" onChange={(e) => setTitle(e.target.value)} />
                                <Button onClick={handleSave} variant='contained' color='success' sx={{ borderRadius: '20px', letterSpacing: '1px', padding: '10px 40px' }}>Save</Button>
                                <Button onClick={handleStitchImages} variant='contained' sx={{ borderRadius: '20px', letterSpacing: '1px', padding: '10px 40px', margin: '30px 0px' }}>Re-Render</Button>
                                <Button onClick={handleGapFilling} variant='contained' sx={{ borderRadius: '20px', letterSpacing: '1px', padding: '10px 40px' }}>Gap filling</Button>

                            </> : <>
                                <TextField label="Prompt" color="success" id="fullWidth" sx={{ margin: '30px 0px' }} />
                                <TextField label="Negative Prompt" color='red' id="fullWidth" />
                            </>}
                            <br />
                            <Button onClick={() => setAdjust(!adjust)} variant='contained' sx={{ borderRadius: '20px', letterSpacing: '1px', padding: '10px 40px' }}>{adjust ? 'Back' : 'Adjust Image'}</Button>

                        </ThemeProvider>
                    </div>
                </div>
            }
            <Snackbar
                open={message}
                autoHideDuration={3000}
                onClose={closeError}
            >
                <Alert onClose={closeError} severity="error" sx={{ fontSize: '17px', letterSpacing: '1px' }}>
                    {message}
                </Alert>
            </Snackbar>
        </>
    )
}

export default PreviewImage;
