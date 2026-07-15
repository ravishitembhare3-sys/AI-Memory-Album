import { useLocation } from "react-router-dom";
import { useEffect, useRef } from "react";

function WatchVideo() {

    const location = useLocation();

    const videoRef = useRef(null);

    const video = new URLSearchParams(location.search).get("video");

    useEffect(() => {

        if (videoRef.current) {

            videoRef.current.play();

        }

    }, []);

    return (

        <div className="min-h-screen bg-black flex items-center justify-center">

            <video
                ref={videoRef}
                src={video}
                controls
                autoPlay
                className="w-full h-screen object-contain"
            />

        </div>

    );

}

export default WatchVideo;