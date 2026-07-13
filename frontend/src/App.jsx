import { Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Albums from "./pages/Albums";
import UploadMemory from "./pages/UploadMemory";
import Scan from "./pages/Scan";
import PublicAlbum from "./pages/PublicAlbum";
import CreateAlbum from "./pages/CreateAlbum";
import AlbumDetails from "./pages/AlbumDetails";
import AIScan from "./pages/AIScan";

function App() {
    return (
        <Routes>

            <Route path="/" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route path="/dashboard" element={<Dashboard />} />

            <Route path="/albums" element={<Albums />} />

            <Route path="/create-album" element={<CreateAlbum />} />

            <Route path="/album/:id" element={<AlbumDetails />} />

            <Route path="/upload/:id" element={<UploadMemory />} />

            {/* QR Scanner */}
            <Route path="/scan" element={<Scan />} />

            {/* AI Photo Scan */}
            <Route path="/ai-scan/:id" element={<AIScan />} />

            {/* Public Album */}
            <Route path="/public/:albumCode" element={<PublicAlbum />} />

        </Routes>
    );
}

export default App;