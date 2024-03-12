import { useEffect, useRef, useState } from 'react';
import robotAnimation from '../animations/robot.json';
import successAnimation from '../animations/success.json';
import Lottie from 'lottie-react'
import { Box, LinearProgress } from '@mui/material';
import Typewriter from 'typewriter-effect';


export default function LoadingScreen(props) {
    const animationRef = useRef(null);
    const [buffer, setBuffer] = useState(10);
    const [progress, setProgress] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const progressRef = useRef(() => { });
    useEffect(() => {
        progressRef.current = () => {
            if (progress < 90) {
                const diff = Math.random() * 10;
                const diff2 = Math.random() * 10;
                setProgress(Math.min(progress + diff, 100));
                setBuffer(progress + diff + diff2);
            }
        };
    });
    console.log(props)
    useEffect(() => {
        if (!props.generating) {
            console.log('finished')
            setProgress(100)
            setPlaySuccessAnimation(true);
        }
    }, [props.generating])
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

    useEffect(() => {
        const timerRef = { current: null }; // Create a ref to hold the timer

        if (props.loading) {
            timerRef.current = setInterval(() => {
                progressRef.current();

                if (progress >= 90) {
                    clearInterval(timerRef.current); // Use the ref value to clear the interval
                }
            }, 3000);
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
                    <div className='loading-typewriter'>
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
                    </div>
                </div>
            )}
        </div>
    )
}