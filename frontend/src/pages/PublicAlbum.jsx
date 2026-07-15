import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import Webcam from "react-webcam";
import api from "../services/api";

function PublicAlbum() {
    const { albumCode } = useParams();

    const [album, setAlbum] = useState(null);
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);

    const webcamRef = useRef(null);

    useEffect(() => {
        loadAlbum();
    }, []);

    const loadAlbum = async () => {
        try {
            const res = await api.get(`/public/${albumCode}`);
            setAlbum(res.data.album);
        } catch (err) {
            console.log(err);
            alert("Album Not Found");
        }
    };

    const scanPhoto = async () => {
        const imageSrc = webcamRef.current.getScreenshot();

        if (!imageSrc) {
            alert("Capture Failed");
            return;
        }

        const blob = await (await fetch(imageSrc)).blob();

        const formData = new FormData();
        formData.append("photo", blob, "scan.jpg");

        try {
            setLoading(true);

            const res = await api.post(
                `/api/scan/${albumCode}`,
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            setResult(res.data);

            window.location.href = `/watch?video=${encodeURIComponent(res.data.video)}`;

        } catch (err) {
            console.log(err);
            alert("No Match Found");
        } finally {
            setLoading(false);
        }
    };

    if (!album) {
        return (
            <div className="min-h-screen bg-zinc-950 text-white flex justify-center items-center">
                Loading...
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-zinc-950 text-white">

            <div className="border-b border-zinc-800 p-8">

                <h1 className="text-4xl font-bold">
                    {album.name}
                </h1>

                <p className="text-zinc-400 mt-2">
                    Client : {album.client_name}
                </p>

            </div>

            <div className="p-8">

                <h2 className="text-3xl font-bold mb-6">
                    Scan Your Photo
                </h2>

                <Webcam
                    ref={webcamRef}
                    screenshotFormat="image/jpeg"
                    className="rounded-xl w-[500px]"
                />

                <button
                    onClick={scanPhoto}
                    className="mt-5 bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-xl"
                >
                    {loading ? "Scanning..." : "Scan Photo"}
                </button>

            </div>

            {result && (

                <div className="p-8">

                    <h2 className="text-3xl font-bold mb-5">
                        Matched Memory
                    </h2>

                    <img
                        src={result.photo}
                        alt={result.title}
                        className="w-[450px] rounded-xl"
                    />

                    <video
                        controls
                        autoPlay
                        className="mt-5 w-[600px] rounded-xl"
                    >
                        <source src={result.video} type="video/mp4" />
                    </video>

                </div>

            )}

        </div>
    );
}

export default PublicAlbum;