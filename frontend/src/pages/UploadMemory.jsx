import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";

function UploadMemory() {

    const navigate = useNavigate();
    const { id } = useParams();

    const [title, setTitle] = useState("");
    const [photo, setPhoto] = useState(null);
    const [video, setVideo] = useState(null);
    const [loading, setLoading] = useState(false);

    const uploadMemory = async (e) => {

        e.preventDefault();

        if (!title || !photo || !video) {
            alert("Please fill all fields");
            return;
        }

        const formData = new FormData();

        formData.append("album_id", id);
        formData.append("title", title);
        formData.append("photo", photo);
        formData.append("video", video);

        try {

            setLoading(true);

            await api.post("/api/upload", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            alert("Memory Uploaded Successfully");

            navigate(`/album/${id}`);

        } catch (err) {

            console.log(err);

            alert(err.response?.data?.detail || "Upload Failed");

        }

        setLoading(false);

    };

    return (

        <div className="min-h-screen bg-zinc-950 flex justify-center items-center">

            <form
                onSubmit={uploadMemory}
                className="bg-zinc-900 p-8 rounded-2xl w-[500px] space-y-5"
            >

                <h1 className="text-3xl font-bold text-white">

                    Upload Memory

                </h1>

                <input
                    type="text"
                    placeholder="Memory Title"
                    className="w-full p-3 rounded bg-zinc-800 text-white"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />

                <div>

                    <label className="text-white">
                        Select Photo
                    </label>

                    <input
                        type="file"
                        accept="image/*"
                        className="w-full mt-2 text-white"
                        onChange={(e) => setPhoto(e.target.files[0])}
                    />

                </div>

                <div>

                    <label className="text-white">
                        Select Video
                    </label>

                    <input
                        type="file"
                        accept="video/*"
                        className="w-full mt-2 text-white"
                        onChange={(e) => setVideo(e.target.files[0])}
                    />

                </div>

                <button
                    className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded-xl text-white"
                >

                    {loading ? "Uploading..." : "Upload Memory"}

                </button>

            </form>

        </div>

    );

}

export default UploadMemory;