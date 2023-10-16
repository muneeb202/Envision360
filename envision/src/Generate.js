import background from './images/generatebg.png'
import logo from './images/image.png'
import './Generate.css'
import { Box, Button, ImageList, ImageListItem, LinearProgress, TextField, ThemeProvider, createTheme } from '@mui/material';
import React, { useRef, useState } from 'react';
import Particles from 'react-tsparticles';
import { loadFull } from 'tsparticles';
import particlesConfig2 from "./config/particle-config2";
import robotAnimation from './images/robot.json';
import successAnimation from './images/success.json';
import Lottie, { LottieRefCurrentProps } from 'lottie-react'
import Typewriter from 'typewriter-effect';

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

const Generate = () => {
    const [generateType, setGenerateType] = useState(1);
    const [isDragging, setIsDragging] = useState(false);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [progress, setProgress] = React.useState(0);
    const [buffer, setBuffer] = React.useState(10);
    const animationRef = useRef(<LottieRefCurrentProps />);
    const [isPlaying, setIsPlaying] = useState(false);
    const [playSuccessAnimation, setPlaySuccessAnimation] = useState(false);
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

    const handleClick = () => {
        if (!isPlaying) {
            animationRef.current?.goToAndPlay(0, true);
            setIsPlaying(true);
        }
    };

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

    React.useEffect(() => {
        const timerRef = { current: null }; // Create a ref to hold the timer

        if (isLoading) {
            timerRef.current = setInterval(() => {
                progressRef.current();

                if (progress >= 100) {
                    clearInterval(timerRef.current); // Use the ref value to clear the interval
                    setPlaySuccessAnimation(true);
                }
            }, 1000);
        }

        return () => {
            clearInterval(timerRef.current); // Clear the interval using the ref value
        };
    }, [isLoading, progress]);

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

    return (
        <ThemeProvider theme={theme}>
            <MemoizedParticles options={particlesConfig2} />

            <div>
                {isLoading && (
                    <div className={isLoading ? 'loading-screen active' : 'loading-screen'} onClick={handleClick}>
                        {playSuccessAnimation ? (
                            <Lottie
                                animationData={successAnimation}
                                loop={false}
                                style={{ width: 200, height: 200 }}
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

            <div className='image-container'>
                <img src={background} alt='background'/>
            </div>
            <div className='overlay' />
            <div className='generate-container'>

                <a href='/'><img src={logo} className='logo' alt='background'/></a>
                <div className='row generate-row'>
                    <div className='col-md-6 px-5'>
                        <div className='generate-type'>
                            <button onClick={() => setGenerateType(1)} className={generateType === 1 ? 'active' : ''}>Location Search</button>
                            <button onClick={() => setGenerateType(2)} className={generateType === 2 ? 'active' : ''}>Coordinates</button>
                            <button onClick={() => setGenerateType(3)} className={generateType === 3 ? 'active' : ''}>Upload Images</button>
                        </div>
                        <div className='input-container'>

                            <div className='w-75'>
                                {generateType === 1 && (
                                    <TextField color='secondary' fullWidth multiline maxRows={7} label="Search Query" variant="standard" sx={{ color: 'white', letterSpacing: '2px' }} />
                                )}
                                {generateType === 2 && (
                                    <>
                                        <TextField color='secondary' type='number' fullWidth label="Latitude" variant="standard" sx={{ color: 'white', letterSpacing: '2px' }} />
                                        <br /><br />
                                        <TextField color='secondary' type='number' fullWidth label="Longitude" variant="standard" sx={{ color: 'white', letterSpacing: '2px' }} />
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
                        <Button variant='contained' onClick={() => setIsLoading(true)} color='secondary' sx={{ padding: '20px', margin: '0 10%', letterSpacing: '3px', fontSize: '18px', borderRadius: '50px', width: '80%' }}>Generate 360&deg; Image</Button>
                    </div>
                    <div className='col-md-6 ps-5'>
                        <h1>Generate Image</h1>
                        <p className='first'>Create breathtaking 360-degree images effortlessly.</p>
                        <p className='second'>Explore real-time rendering and craft your panoramic masterpiece.</p>
                    </div>
                </div>
            </div>
        </ThemeProvider>
    )
}

export default Generate;