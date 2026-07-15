import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";

function AlbumDetails() {

    const { id } = useParams();

    const navigate = useNavigate();

    const [album, setAlbum] = useState(null);
    const [memories, setMemories] = useState([]);

    useEffect(() => {

        loadAlbum();
        loadMemories();

    }, []);

    const loadAlbum = async () => {

        try {

            const res = await api.get(`/album/${id}`);

            setAlbum(res.data);

        } catch (err) {

            console.log(err);

            alert("Album not found");

        }

    };

    const loadMemories = async () => {

        try {

            const res = await api.get(`/api/album/${id}`);

            console.log(res.data);

            setMemories(res.data);

        } catch (err) {

            console.log(err);

        }

    };
     
    const deleteMemory = async (memoryId) => {

    const confirmDelete = window.confirm(
        "Are you sure you want to delete this memory?"
    );

    if (!confirmDelete) return;

    try {

        await api.delete(`/api/memory/${memoryId}`);

        alert("Memory Deleted Successfully");

        loadMemories();

    } catch (err) {

        console.log(err);

        alert("Failed to delete memory");

    }

};

     const deleteAlbum = async () => {

    const confirmDelete = window.confirm(
        "Delete this album?"
    );

    if (!confirmDelete) return;

    try {

        await api.delete(`/album/${album.id}`);

        alert("Album Deleted Successfully");

        navigate("/dashboard");

    } catch (err) {

        console.log(err);

        alert("Failed to delete album");

    }

};

const copyPublicLink = () => {

    const link = `http://localhost:5173/public/${album.album_code}`;

    navigator.clipboard.writeText(link);

    alert("Public Link Copied!");

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

            <div className="flex justify-between items-center p-6 border-b border-zinc-800">

                <div>

                    <h1 className="text-3xl font-bold">
                        {album.name}
                    </h1>

                    <p className="text-zinc-400 mt-2">
                        Client : {album.client_name}
                    </p>

                    <p className="text-zinc-500">
                        Album Code : {album.album_code}
                    </p>
                     <img
                    src={`http://127.0.0.1:8000${album.qr}`}
                    alt="QR Code"
                    className="w-44 mt-4 rounded-xl bg-white p-2"
                   />  
                </div>

                <div className="flex gap-3">

                    <button
                        onClick={() => navigate(`/upload/${album.id}`)}
                        className="bg-blue-600 hover:bg-blue-700 px-5 py-2 rounded-xl"
                    >
                        Upload Memory
                    </button>

                    <button
                        onClick={() => navigate("/dashboard")}
                        className="bg-zinc-700 hover:bg-zinc-600 px-5 py-2 rounded-xl"
                    >
                        Back
                    </button>

                    <button
    onClick={deleteAlbum}
    className="bg-red-600 hover:bg-red-700 px-5 py-2 rounded-xl"
>
    Delete Album
</button>
                 <button
    onClick={copyPublicLink}
    className="bg-purple-600 hover:bg-purple-700 px-5 py-2 rounded-xl"
>
    Copy Public Link
</button>

                    <button
    onClick={() => navigate(`/ai-scan/${id}`)}
    className="bg-green-600 hover:bg-green-700 px-5 py-2 rounded-xl ml-3"
>
    AI Scan
</button>

                </div>

            </div>

            <div className="p-8">

                <h2 className="text-2xl font-bold mb-6">

                    Memories

                </h2>

                <div className="grid grid-cols-3 gap-6">

                    {

                        memories.map((memory) => (

                            <div
                                key={memory.id}
                                className="bg-zinc-900 rounded-2xl overflow-hidden"
                            >

                                <img
                                    src={memory.photo}
                                    alt={memory.title}
                                    className="w-full h-56 object-cover"
                                />

                                <div className="p-5">

                                    <h3 className="text-xl font-bold">

                                        {memory.title}

                                    </h3>

                                    <div className="flex gap-2 mt-4">

                                        <button
                                           onClick={() => window.open(memory.video, "_blank")}
                                           className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg"
                                        >
                                           Play Video
                                        </button>

                                        <button
                                        onClick={() => deleteMemory(memory.id)}
                                        className="bg-red-600 hover:bg-red-700px-4 py-2 rounded-lg"
                                        >
                                             Delete
                                        </button>

                                    </div>

                                </div>

                            </div>

                        ))

                    }

                    {

                        memories.length === 0 && (

                            <div className="text-zinc-400">

                                No Memories Found

                            </div>

                        )

                    }

                </div>

            </div>

        </div>

    );

}

export default AlbumDetails;