import './Generate.css'
import { Alert, Box, Button, IconButton, ImageList, ImageListItem, LinearProgress, Snackbar, TextField, ThemeProvider, createTheme, useThemeProps } from '@mui/material';
import React, { useRef, useState } from 'react';
import Particles from 'react-tsparticles';
import { loadFull } from 'tsparticles';
import particlesConfig2 from "./config/particle-config2";
import robotAnimation from './animations/robot.json';
import successAnimation from './animations/success.json';
import Lottie, { LottieRefCurrentProps } from 'lottie-react'
import axios from 'axios';
import { useNavigate } from 'react-router-dom'
import Typewriter from 'typewriter-effect';
import Sidebar from './components/Sidebar';

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

const MemoizedParticles = React.memo(({ options }) => (
    <Particles init={(main) => loadFull(main)} options={options} />
));

const ImageViewer = ({ image }) => {
    const [title, setTitle] = useState('');
    const navigate = useNavigate();

    const handleSave = async () => {
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
            console.log(error)
        }));
    }

    return (
        <div className='image-viewer'>
            <img src={URL.createObjectURL(image)} />
            <div className='button-container'>
                <ThemeProvider theme={theme}>
                    <TextField id="outlined-basic" label="Title" variant="outlined" onChange={(e) => setTitle(e.target.value)} />
                    <Button onClick={handleSave} variant='contained' color='success' sx={{ borderRadius: '20px', letterSpacing: '1px', padding: '10px 40px', margin: '30px 0px' }}>Save</Button>
                    <Button variant='contained' sx={{ borderRadius: '20px', letterSpacing: '1px', padding: '10px 40px' }}>Re-Render</Button>
                </ThemeProvider>
            </div>
        </div>
    )
}

function LoadingScreen(props) {
    const animationRef = useRef(<LottieRefCurrentProps />);
    const [buffer, setBuffer] = React.useState(10);
    const [progress, setProgress] = React.useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const progressRef = React.useRef(() => { });
    React.useEffect(() => {
        progressRef.current = () => {
            if (progress < 100) {
                const diff = Math.random() * 10;
                const diff2 = Math.random() * 10;
                setProgress(Math.min(progress + diff, 100));
                setBuffer(progress + diff + diff2);
            }
        };
    });
    const facts = [
        'The earliest known panorama was created in 1787 by Robert Barker, an Irish painter. It was a massive painting of Edinburgh, Scotland, that was displayed in a specially built rotunda.',
        'The word "panorama" comes from the Greek words "pan" (all) and "horama" (view).',
        '360-degree images are often used in virtual reality (VR) experiences to create a sense of immersion.',
        'Panoramas can be created using a variety of methods, including stitching together multiple photos, using a special 360-degree camera, or even using a smartphone app.',
        '360-degree images are not just for still photos. You can also create 360-degree videos that capture a full spherical view of a scene.',
        'The largest 360-degree photo ever taken was of Mont Blanc, the highest mountain in the Alps. The photo was created by stitching together over 70,000 individual images!',
        '360-degree images are being used in a variety of innovative ways, such as creating virtual tours of real estate properties, museums, and other locations.',
        'Google Street View is one of the most popular uses of 360-degree images. It allows you to explore cities and towns around the world from the comfort of your own home.',
        'Facebook also supports 360-degree images, so you can share your immersive photos and videos with your friends and family.',
        'The first 360-degree camera was invented in 1904 by Julius Neubronner, a German pharmacist.',
        'The first 360-degree video was shot in 1995 by the Fraunhofer Institute for Computer Graphics Research.',
        '360-degree images are sometimes called "equirectangular projections" because they are projected onto a sphere.',
    ]
    const [playSuccessAnimation, setPlaySuccessAnimation] = useState(false);

    React.useEffect(() => {
        const timerRef = { current: null }; // Create a ref to hold the timer

        if (props.loading) {
            timerRef.current = setInterval(() => {
                progressRef.current();

                if (progress >= 100) {
                    clearInterval(timerRef.current); // Use the ref value to clear the interval
                    setPlaySuccessAnimation(true);
                }
            }, 50);
        }

        return () => {
            clearInterval(timerRef.current); // Clear the interval using the ref value
        };
    }, [props.loading, progress]);

    const handleClick = () => {
        if (!isPlaying) {
            animationRef.current?.goToAndPlay(0, true);
            setIsPlaying(true);
        }
    };


    return (
        <div>
            {props.loading && (
                <div className={props.loading ? 'loading-screen active' : 'loading-screen'} onClick={handleClick}>
                    {playSuccessAnimation ? (
                        <Lottie
                            animationData={successAnimation}
                            loop={false}
                            style={{ width: 200, height: 200 }}
                            onComplete={props.completion}
                        />
                    ) : (
                        <Lottie
                            lottieRef={animationRef}
                            animationData={robotAnimation}
                            loop={false}
                            style={{ width: 200, height: 200 }}
                            onComplete={() => setIsPlaying(false)}
                        />
                    )}
                    <br />
                    <Box sx={{ width: '50%' }}>
                        <LinearProgress variant="buffer" value={progress} valueBuffer={buffer} />
                    </Box>
                    <br />
                    <p>
                        <Typewriter
                            options={{
                                strings: facts,
                                autoStart: true,
                                loop: true,
                                delay: 30,
                                deleteSpeed: 0,
                                pauseFor: 5000
                            }}
                        />
                    </p>
                </div>
            )}
        </div>
    )
}

const Generate = () => {
    const [generateType, setGenerateType] = useState(1);
    const [isDragging, setIsDragging] = useState(false);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [completedImage, setCompletedImage] = useState(null);
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [latitude, setLatitude] = useState('');
    const [longitude, setLongitude] = useState('');


    const handleDragEnter = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        setSelectedFiles((prevFiles) => [...prevFiles, ...e.dataTransfer.files]);
    };

    const handleFileInputChange = (e) => {
        setSelectedFiles((prevFiles) => [...prevFiles, ...e.target.files]);
    };

    const handleDelete = (index, e) => {
        e.stopPropagation();
        e.preventDefault();
        setSelectedFiles((prevFiles) => {
            const updatedFiles = [...prevFiles];
            updatedFiles.splice(index, 1);
            return updatedFiles;
        });
    }

    const handleCompletion = () => {
        console.log('completed');
        setCompletedImage(selectedFiles[0])
    }

    const generateImage = () => {
        switch (generateType) {
            case 1:
                if (!searchQuery) {
                    setMessage('Please enter a search query.');
                    setOpen(true);
                    return;
                }
                break;
            case 2:
                if (!latitude || !longitude) {
                    setMessage('Please enter both latitude and longitude.');
                    setOpen(true);
                    return;
                }
                break;
            case 3:
                if (selectedFiles.length === 0) {
                    setMessage('Must upload at least 1 image.');
                    setOpen(true);
                    return;
                }
                break;
            default:
                break;
        }
        setIsLoading(true);
    }

    return (
        <>
            {completedImage ? (
                <ImageViewer image={completedImage} />
            ) :
                (
                    <ThemeProvider theme={theme}>
                        <MemoizedParticles options={particlesConfig2} />

                        <LoadingScreen loading={isLoading} completion={handleCompletion} />
                        <div className='gen-container'>
                            <div className='image-container' >
                                <img src={`${process.env.PUBLIC_URL}/images/generatebg.png`} alt="background" draggable='false' />
                            </div>
                            <div className="overlay">
                                <div className="generate-container">
                                    <Sidebar/>
                                    <div className="container pt-3" style={{ minWidth: '100%', minHeight:'80vh'}}>
                                        <div className='row generate-row d-flex align-items-center h-100'>
                                            <div className='col-md-6 px-5  order-2 order-md-1'>
                                                <div className='generate-type'>
                                                    <button onClick={() => setGenerateType(1)} className={generateType === 1 ? 'active' : ''}>Location Search</button>
                                                    <button onClick={() => setGenerateType(2)} className={generateType === 2 ? 'active' : ''}>Coordinates</button>
                                                    <button onClick={() => setGenerateType(3)} className={generateType === 3 ? 'active' : ''}>Upload Images</button>
                                                </div>
                                                <div className='input-container'>

                                                    <div className='w-75'>
                                                        {generateType === 1 && (
                                                            <TextField
                                                                color='secondary'
                                                                fullWidth
                                                                multiline
                                                                maxRows={7}
                                                                label="Search Query"
                                                                variant="standard"
                                                                sx={{ color: 'white', letterSpacing: '2px' }}
                                                                value={searchQuery}
                                                                onChange={(e) => setSearchQuery(e.target.value)}
                                                            />
                                                        )}
                                                        {generateType === 2 && (
                                                            <>
                                                                <TextField
                                                                    color='secondary'
                                                                    type='number'
                                                                    fullWidth
                                                                    label="Latitude"
                                                                    variant="standard"
                                                                    sx={{ color: 'white', letterSpacing: '2px' }}
                                                                    value={latitude}
                                                                    onChange={(e) => setLatitude(e.target.value)}
                                                                />
                                                                <br /><br />
                                                                <TextField
                                                                    color='secondary'
                                                                    type='number'
                                                                    fullWidth
                                                                    label="Longitude"
                                                                    variant="standard"
                                                                    sx={{ color: 'white', letterSpacing: '2px' }}
                                                                    value={longitude}
                                                                    onChange={(e) => setLongitude(e.target.value)}
                                                                />
                                                            </>
                                                        )}
                                                    </div>

                                                    {generateType === 3 && (
                                                        <label
                                                            className={`drag-drop-box ${isDragging ? 'drag-over' : ''}`}
                                                            onDragEnter={handleDragEnter}
                                                            onDragOver={handleDragEnter}
                                                            onDragLeave={handleDragLeave}
                                                            onDrop={handleDrop}
                                                        >
                                                            {selectedFiles.length === 0 && (
                                                                <>Drag images here or click to upload</>
                                                            )}
                                                            <input
                                                                type="file"
                                                                className="file-input"
                                                                multiple
                                                                onChange={handleFileInputChange}
                                                            />

                                                            <ImageList className='image-list' cols={3} sx={{ marginBottom: '0', maxHeight: '350px', overflowY: 'auto' }}>
                                                                {selectedFiles.map((file, index) => (
                                                                    <ImageListItem className='image-item' key={index}>
                                                                        <img src={URL.createObjectURL(file)} alt={`uploaded-${index}`} draggable='false' />
                                                                        <i className="fas fa-times-circle delete-button" onClick={(e) => handleDelete(index, e)} style={{ color: 'white' }}></i>
                                                                    </ImageListItem>
                                                                ))}
                                                            </ImageList>
                                                        </label>
                                                    )}
                                                </div>
                                                <Button variant='contained' onClick={generateImage} color='secondary' sx={{ padding: '20px', margin: '0 10%', letterSpacing: '3px', fontSize: '18px', borderRadius: '50px', width: '80%' }}>Generate 360&deg; Image</Button>
                                            </div>
                                            <div className='col-md-6 ps-5  order-1 order-md-2'>
                                                <h1>Generate Image</h1>
                                                <p style={{ height: '48px' }}>
                                                    <Typewriter
                                                        onInit={(typewriter) => {
                                                            typewriter.typeString('Create breathtaking 360-degree images effortlessly and craft your panoramic masterpiece.')
                                                                .start();
                                                        }}
                                                        options={{ delay: 30 }}
                                                    />
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <Snackbar
                            open={open}
                            autoHideDuration={6000}
                            onClose={() => setOpen(false)}
                        >
                            <Alert onClose={() => setOpen(false)} severity="error" sx={{ fontSize: '17px', letterSpacing: '2px' }}>
                                {message}
                            </Alert>
                        </Snackbar>
                    </ThemeProvider>
                )}
        </>
    )
}

export default Generate;