import background from './images/generatebg.png'
import logo from './images/image.png'
import './Generate.css'
import { Button, ImageList, ImageListItem, TextField, ThemeProvider, createTheme, styled } from '@mui/material';
import React, { useState } from 'react';
import Particles from 'react-tsparticles';
import { loadFull } from 'tsparticles';
import particlesConfig2 from "./config/particle-config2";

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
            <div className='image-container'>
                <img src={background} />
            </div>
            <div className='overlay' />
            <div className='generate-container'>

                <a href='/'><img src={logo} className='logo' /></a>
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
                        <Button variant='contained' color='secondary' sx={{ padding: '20px', margin: '0 10%', letterSpacing: '3px', fontSize: '18px', borderRadius: '50px', width: '80%' }}>Generate 360&deg; Image</Button>
                    </div>
                    <div className='col-md-6 ps-5'>
                        <h1>Generate Image</h1>
                        <p>Create breathtaking 360-degree images effortlessly.</p>
                        <p>Explore real-time rendering and craft your panoramic masterpiece.</p>
                    </div>
                </div>
            </div>
        </ThemeProvider>
    )
}

export default Generate;