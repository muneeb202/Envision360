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

const PreviewImage = ({ image }) => {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('')
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
          setMessage('You must be logged in to save!')
      }));
  }

  return (
      <div className='image-viewer'>
          <ImageViewer src={image}/>
          <div className='button-container'>
              <ThemeProvider theme={theme}>
                  <TextField id="outlined-basic" label="Title" variant="outlined" onChange={(e) => setTitle(e.target.value)} />
                  <Button onClick={handleSave} variant='contained' color='success' sx={{ borderRadius: '20px', letterSpacing: '1px', padding: '10px 40px', margin: '30px 0px' }}>Save</Button>
                  <Button variant='contained' sx={{ borderRadius: '20px', letterSpacing: '1px', padding: '10px 40px' }}>Re-Render</Button>

                  <Snackbar
                      open={message}
                      autoHideDuration={3000}
                      onClose={() => navigate('/start')}
                  >
                      <Alert onClose={() => navigate('/start')} severity="error" sx={{ fontSize: '17px', letterSpacing: '1px' }}>
                          {message}
                      </Alert>
                  </Snackbar>
              </ThemeProvider>
          </div>
      </div>
  )
}

export default PreviewImage;
