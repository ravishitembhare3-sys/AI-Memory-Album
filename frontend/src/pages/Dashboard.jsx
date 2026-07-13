import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function Dashboard() {

    const navigate = useNavigate();

    const user = JSON.parse(localStorage.getItem("user"));

    const [albums, setAlbums] = useState([]);

    useEffect(() => {
        loadAlbums();
    }, []);

    const loadAlbums = async () => {
        try {
            const res = await api.get("/album/my");
            setAlbums(res.data);
        } catch (err) {
            console.log(err);
        }
    };

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/");
    };

    return (
        <div className="min-h-screen bg-zinc-950 text-white">

            <div className="flex justify-between items-center p-6 border-b border-zinc-800">

                <div>
                    <h1 className="text-3xl font-bold">
                        Memory Album
                    </h1>

                    <p className="text-zinc-400">
                        Welcome {user?.name}
                    </p>
                </div>

                <div className="flex gap-3">

                    <button
                        onClick={() => navigate("/create-album")}
                        className="bg-blue-600 hover:bg-blue-700 px-5 py-2 rounded-xl"
                    >
                        + Create Album
                    </button>

                    <button
                        onClick={logout}
                        className="bg-red-600 hover:bg-red-700 px-5 py-2 rounded-xl"
                    >
                        Logout
                    </button>

                </div>

            </div>

            <div className="p-8">

                <h2 className="text-2xl font-bold mb-6">
                    My Albums
                </h2>

                <div className="grid grid-cols-3 gap-6">

                    {albums.map((album) => (

                        <div
                            key={album.id}
                            className="bg-zinc-900 rounded-2xl p-6"
                        >

                            <h3 className="text-xl font-bold">
                                {album.name}
                            </h3>

                            <p className="text-zinc-400 mt-2">
                                Client : {album.client_name}
                            </p>

                            <p className="text-zinc-500 mt-1">
                                Code : {album.album_code}
                            </p>

                            {album.qr_path && (
    <div className="mt-5">

        <img
            src={`http://localhost:8000${album.qr_path}`}
             alt="QR"
            className="w-32 h-32 rounded-lg bg-white p-2"
        />

        <a
            href={`http://localhost:8000${album.qr_path}`}
            download
            className="inline-block mt-3 bg-green-600 px-4 py-2 rounded-lg"
        >
            Download QR
        </a>

    </div>
)}

<button
    onClick={() => {
        navigator.clipboard.writeText(
            `http://localhost:5173/public/${album.album_code}`
        );
        alert("Public link copied!");
    }}
    className="mt-3 bg-purple-600 px-4 py-2 rounded-lg"
>
    Copy Public Link
</button>
                            <button
                                onClick={() => navigate(`/album/${album.id}`)}
                                className="mt-5 bg-blue-600 px-4 py-2 rounded-lg"
                            >
                                Open Album
                            </button>

                        </div>

                    ))}

                </div>

            </div>

        </div>
    );

}

export default Dashboard;