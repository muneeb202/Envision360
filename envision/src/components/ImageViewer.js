import React, { useEffect, useRef, useState } from 'react';
import './Viewer.css'
import * as PANOLENS from 'panolens';
import { useParams } from 'react-router-dom';
import CryptoJS from 'crypto-js';

const ImageViewer = () => {
    const {path} = useParams()
    const encryptionKey = 'WsOhEgwajsuZ3vZxESqRSxirE3KGSjJf';
    const decryptedPath = CryptoJS.AES.decrypt(decodeURIComponent(path), encryptionKey).toString(CryptoJS.enc.Utf8);

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
      const panorama = new PANOLENS.ImagePanorama(decryptedPath);
      viewer.add(panorama);
  
      // Clean up the viewer when the component is unmounted
      return () => {
        viewer.dispose();
      };
    }, [path]);
  
    return <div id='image-container' style={{ width: '100%', height: '100vh' }} />;
  };

  export default ImageViewer