import './Generate.css'
import { Alert, Box, Button, ImageList, ImageListItem, LinearProgress, Snackbar, TextField, ThemeProvider, createTheme } from '@mui/material';
import React, { useRef, useState } from 'react';
import Particles from 'react-tsparticles';
import { loadFull } from 'tsparticles';
import particlesConfig2 from "./config/particle-config2";
import axios from 'axios';
import { useNavigate } from 'react-router-dom'
import Typewriter from 'typewriter-effect';
import Sidebar from './components/Sidebar';
import LoadingScreen from './components/LoadingScreen';
import PreviewImage from './components/PreviewImage';

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
    const [completedImage, setCompletedImage] = useState(null);
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [latitude, setLatitude] = useState('');
    const [longitude, setLongitude] = useState('');
    const [threshold, setThreshold] = useState(10)

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
    }

    const handleStitchImages = async () => {
        switch (generateType) {
            case 1:
            case 2:
                try {
                    const response = await axios.post('http://localhost:8000/api/web_scrape/', {
                        query: searchQuery,
                        latitude: latitude,
                        longitude: longitude,
                        generateType: generateType,
                        thresh: threshold,
                    }, {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                        },
                    });
                    console.log(response.data)
                    if (response.data.success) {
                        setCompletedImage(response.data.stitched_image_url);
                        setThreshold(Math.max(1, response.data['threshold'] - 1))
                    } else {
                        console.error('Image stitching failed:', response.data.message);
                        setIsLoading(false)
                    }
                } catch (error) {
                    setIsLoading(false)
                    console.error('Error setting location or coordinates:', error);
                }
                break;
            case 3:
                try {
                    console.log(selectedFiles)
                    const response = await axios.post('http://localhost:8000/api/stitch_images/', {
                        images: selectedFiles,
                        thresh: threshold
                    }, {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                        },
                    });
                    console.log(response.data)
                    if (response.data.success) {
                        setCompletedImage(response.data.stitched_image_url);
                        setThreshold(Math.max(1, response.data['threshold'] - 1))
                    } else {
                        console.error('Image stitching failed:', response.data.message);
                        setIsLoading(false)
                    }
                } catch (error) {
                    setIsLoading(false)
                    console.error('Error uploading images:', error);
                }
                break;
            default:
                break;
        }

    };


    const generateImage = async () => {
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
        await handleStitchImages();
    }

    return (
        <>
            {completedImage ? (
                <PreviewImage imagelist={selectedFiles} thresh={threshold} image={completedImage} />

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
                                    <Sidebar />
                                    <div className="container pt-3" style={{ minWidth: '100%', minHeight: '80vh' }}>
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
                                                <div className='generate-typewriter'>
                                                    <Typewriter
                                                        onInit={(typewriter) => {
                                                            typewriter.typeString('Create breathtaking 360-degree images effortlessly and craft your panoramic masterpiece.')
                                                                .start();
                                                        }}
                                                        options={{ delay: 30 }}
                                                    />
                                                </div>
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