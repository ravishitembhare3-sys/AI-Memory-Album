import { useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";
import Webcam from "react-webcam";
import { useRef } from "react";

function AIScan() {

    const { id } = useParams();

    const [photo, setPhoto] = useState(null);
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const webcamRef = useRef(null);
     

    const capture = async () => {

    const imageSrc = webcamRef.current.getScreenshot();

    const blob = await (await fetch(imageSrc)).blob();

    const file = new File(
        [blob],
        "capture.jpg",
        {
            type: "image/jpeg",
        }
    );

    scanPhoto(file);

};

    const scanPhoto = async (capturedPhoto = photo) => {

    if (!capturedPhoto) {
        alert("Capture a photo first");
        return;
    }

    const formData = new FormData();

    formData.append("album_id", id);
    formData.append("photo", capturedPhoto);

    try {

        setLoading(true);

        const res = await api.post(
            "/api/scan",
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            }
        );

        setResult(res.data);

    } catch (err) {

        console.log(err);

        alert("No Match Found");

    } finally {

        setLoading(false);

    }

};
    return (

        <div className="min-h-screen bg-zinc-950 text-white p-10">

            <h1 className="text-4xl font-bold mb-8">
                AI Memory Scan
            </h1>

            <Webcam
    ref={webcamRef}
    screenshotFormat="image/jpeg"
    className="rounded-xl w-[500px]"
/>

            <br />

            <button
    onClick={capture}
    className="bg-green-600 hover:bg-green-700 px-6 py-3 rounded-xl"
>
    {loading ? "Scanning..." : "Capture & Scan"}
</button>

            {result && (

                <div className="mt-10 bg-zinc-900 p-6 rounded-xl">

                    <h2 className="text-3xl font-bold">
                        {result.title}
                    </h2>

                    <p className="mt-2">
                        Match Score :
                        {" "}
                        {result.score.toFixed(2)}
                    </p>

                    
                    <video
                      src={result.video}
                      controls
                      autoPlay
                     className="w-full max-w-3xl mt-6 rounded-xl"
                    />

                </div>

            )}

        </div>

    );

}

export default AIScan;