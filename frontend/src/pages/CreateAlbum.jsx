import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function CreateAlbum() {

    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [clientName, setClientName] = useState("");
    const [loading, setLoading] = useState(false);

    const createAlbum = async (e) => {

        e.preventDefault();

        setLoading(true);

        try {

            await api.post("/album/create", {
                name: name,
                client_name: clientName,
            });

            alert("Album Created Successfully");

            navigate("/dashboard");

        } catch (err) {

            alert(err.response?.data?.detail || "Error creating album");

        }

        setLoading(false);

    };

    return (

        <div className="min-h-screen flex justify-center items-center bg-zinc-950">

            <form
                onSubmit={createAlbum}
                className="bg-zinc-900 p-8 rounded-2xl w-[450px] space-y-5"
            >

                <h1 className="text-3xl font-bold text-white">
                    Create Album
                </h1>

                <input
                    className="w-full p-3 rounded bg-zinc-800 text-white"
                    placeholder="Album Name"
                    value={name}
                    onChange={(e)=>setName(e.target.value)}
                />

                <input
                    className="w-full p-3 rounded bg-zinc-800 text-white"
                    placeholder="Client Name"
                    value={clientName}
                    onChange={(e)=>setClientName(e.target.value)}
                />

                <button
                    className="w-full bg-blue-600 py-3 rounded text-white"
                >
                    {loading ? "Creating..." : "Create Album"}
                </button>

            </form>

        </div>

    );

}

export default CreateAlbum;