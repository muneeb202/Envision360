import React, { useEffect, useRef } from 'react';
import './Viewer.css'
import * as PANOLENS from 'panolens';

const ImageViewer = () => {
  const imageUrl = 'sphere.jpg'

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

export default ImageViewer;
