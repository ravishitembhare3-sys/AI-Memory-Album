import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

function PublicAlbum() {

    const { albumCode } = useParams();

    const [album, setAlbum] = useState(null);
    const [memories, setMemories] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        loadAlbum();
    }, []);

    const loadAlbum = async () => {

        try {

            const res = await api.get(`/public/${albumCode}`);

            setAlbum(res.data.album);

            setMemories(res.data.memories);

        } catch (err) {

            console.log(err);

            alert("Album Not Found");

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

                <p className="text-zinc-500">

                    Album Code : {album.album_code}

                </p>
            
            <button
    onClick={() => navigate(`/public-ai-scan/${album.album_code}`)}
    className="mt-5 bg-green-600 hover:bg-green-700 px-5 py-2 rounded-xl"
>
    🤖 AI Scan
</button>

            </div>

            <div className="p-8">

                <h2 className="text-2xl font-bold mb-6">

                    Memories

                </h2>

                <div className="grid grid-cols-3 gap-6">

                    {memories.map((memory) => (

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

                                <button
                                    onClick={() => window.open(memory.video, "_blank")}
                                    className="mt-4 bg-blue-600 hover:bg-blue-700 px-5 py-2 rounded-xl"
                                >

                                    ▶ Play Video

                                </button>

                            </div>

                        </div>

                    ))}

                    {memories.length === 0 && (

                        <div className="text-zinc-400">

                            No Memories Found

                        </div>

                    )}

                </div>

            </div>

        </div>

    );

}

export default PublicAlbum;