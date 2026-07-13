import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";

function Login() {

    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleLogin = async (e) => {

        e.preventDefault();

        setLoading(true);
        setError("");

        try {

            const res = await api.post("/auth/login", {
                email,
                password,
            });

            localStorage.setItem(
                "token",
                res.data.access_token
            );

            localStorage.setItem(
                "user",
                JSON.stringify(res.data.user)
            );

            navigate("/dashboard");

        } catch (err) {

            if (err.response) {
                setError(err.response.data.detail);
            } else {
                setError("Server not responding");
            }

        }

        setLoading(false);

    };

    return (

        <div className="min-h-screen flex items-center justify-center bg-zinc-950">

            <div className="w-[400px] bg-zinc-900 border border-zinc-800 rounded-2xl p-8 shadow-2xl">

                <h1 className="text-3xl font-bold mb-2">
                    Memory Album
                </h1>

                <p className="text-zinc-400 mb-8">
                    Login to continue
                </p>

                <form
                    onSubmit={handleLogin}
                    className="space-y-5"
                >

                    <input
                        type="email"
                        placeholder="Email"
                        className="w-full p-3 rounded-xl bg-zinc-800 outline-none"
                        value={email}
                        onChange={(e)=>setEmail(e.target.value)}
                    />

                    <input
                        type="password"
                        placeholder="Password"
                        className="w-full p-3 rounded-xl bg-zinc-800 outline-none"
                        value={password}
                        onChange={(e)=>setPassword(e.target.value)}
                    />

                    {
                        error &&
                        <p className="text-red-500 text-sm">
                            {error}
                        </p>
                    }

                    <button
                        className="w-full bg-blue-600 hover:bg-blue-700 transition p-3 rounded-xl font-semibold"
                    >

                        {
                            loading
                            ? "Logging in..."
                            : "Login"
                        }

                    </button>

                </form>

                <p className="text-center mt-6 text-zinc-400">

                    Don't have an account?

                    <Link
                        className="text-blue-500 ml-2"
                        to="/register"
                    >
                        Register
                    </Link>

                </p>

            </div>

        </div>

    );

}

export default Login;