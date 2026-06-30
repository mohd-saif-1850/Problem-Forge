import { useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { FaGithub } from "react-icons/fa";

interface LoginPayload {
    email?: string;
    username?: string;
    password: string;
}

export const LoginPage = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const api = import.meta.env.VITE_BACKEND_URL

    const redirectTo =
        (location.state as { from?: string } | null)?.from || "/";

    const [formData, setFormData] = useState({
        identifier: "",
        password: "",
    });

    const [showPassword, setShowPassword] = useState(false);

    const [loading, setLoading] = useState(false);

    const [error, setError] = useState("");

    const payload: LoginPayload = useMemo(() => {
        const identifier = formData.identifier.trim();

        if (identifier.includes("@")) {
            return {
                email: identifier,
                password: formData.password,
            };
        }

        return {
            username: identifier,
            password: formData.password,
        };
    }, [formData]);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        setError("");

        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const loginWithGithub = () => {
        window.location.href =
            `${import.meta.env.VITE_BACKEND_URL}/oauth/github-login`;
    };

    const handleSubmit = async (
        e: React.SubmitEvent<HTMLFormElement>
    ) => {
        e.preventDefault();

        if (!formData.identifier.trim()) {
            return setError("Email or Username is required.");
        }

        if (!formData.password.trim()) {
            return setError("Password is required.");
        }

        try {
            setLoading(true);

            localStorage.setItem(
                "problemforge:twoStepIdentifier",
                formData.identifier
            );
            await axios.post(`${import.meta.env.VITE_BACKEND_URL}/users/login`, payload);
            navigate(redirectTo, {
                replace: true,
            });

            

        } catch (error: any) {

            setError(
                error?.response?.data?.message
            );

        } finally {

            setLoading(false);

        }
    };

    return (

        <div className="min-h-screen bg-[#080808] flex items-center justify-center px-4 py-8">

            <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">

                {/* LEFT SIDE */}

                <div className="hidden lg:flex flex-col justify-center">

                    <h1 className="text-6xl font-black leading-none">

                        <span className="text-white">
                            Problem
                        </span>

                        <span className="text-cyan-400">
                            Forge
                        </span>

                    </h1>

                    <p className="mt-6 text-lg text-white/60 max-w-md">

                        Solve challenging problems, improve your coding
                        skills, compete in contests and become a better
                        programmer every single day.

                    </p>

                    <div className="mt-10 space-y-5">

                        <div className="flex items-center gap-3">

                            <div className="h-2 w-2 rounded-full bg-cyan-400" />

                            <span className="text-white/70">

                                Thousands of coding problems

                            </span>

                        </div>

                        <div className="flex items-center gap-3">

                            <div className="h-2 w-2 rounded-full bg-cyan-400" />

                            <span className="text-white/70">

                                Weekly contests & leaderboards

                            </span>

                        </div>

                        <div className="flex items-center gap-3">

                            <div className="h-2 w-2 rounded-full bg-cyan-400" />

                            <span className="text-white/70">

                                Track your coding progress

                            </span>

                        </div>

                    </div>

                </div>

                {/* RIGHT SIDE */}

                <div className="flex justify-center">

                    <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-[#141414] p-6 lg:p-7 shadow-[0_20px_80px_rgba(0,0,0,.45)]">

                        {/* Mobile Logo */}

                        <div className="lg:hidden mb-8 text-center">

                            <h1 className="text-4xl font-black">

                                <span className="text-white">
                                    Problem
                                </span>

                                <span className="text-cyan-400">
                                    Forge
                                </span>

                            </h1>

                            <p className="mt-3 text-sm text-white/50">

                                Welcome back 👋

                            </p>

                        </div>

                        <h2 className="text-2xl font-semibold text-white">

                            Login

                        </h2>

                        <p className="mt-2 text-sm text-white/50">

                            Continue your coding journey.

                        </p>

                        <form
                            onSubmit={handleSubmit}
                            className="mt-8 space-y-5"
                        >
                            {/* Email / Username */}

                            <div>

                                <label className="mb-2 block text-sm font-medium text-white/70">
                                    Email or Username
                                </label>

                                <input
                                    type="text"
                                    name="identifier"
                                    value={formData.identifier}
                                    onChange={handleChange}
                                    autoComplete="username"
                                    placeholder="Enter your email or username"
                                    className="w-full rounded-xl border border-white/10 bg-[#0F0F0F] px-4 py-3 text-sm text-white placeholder:text-white/25 outline-none transition-all duration-300 focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20"
                                />

                            </div>

                            {/* Password */}

                            <div>

                                <label className="mb-2 block text-sm font-medium text-white/70">
                                    Password
                                </label>

                                <div className="relative">

                                    <input
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        autoComplete="current-password"
                                        placeholder="Enter your password"
                                        className="w-full rounded-xl border border-white/10 bg-[#0F0F0F] px-4 py-3 pr-12 text-sm text-white placeholder:text-white/25 outline-none transition-all duration-300 focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20"
                                    />

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowPassword((prev) => !prev)
                                        }
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 transition hover:text-cyan-400"
                                    >

                                        {showPassword ? (
                                            <EyeOff size={18} />
                                        ) : (
                                            <Eye size={18} />
                                        )}

                                    </button>

                                </div>

                            </div>

                            {error && (

                                <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">

                                    {error}

                                </div>

                            )}

                            <div className="flex items-center justify-end">

                                <Link
                                    to="/forgot-password"
                                    className="text-sm text-cyan-400 transition hover:text-cyan-300"
                                >
                                    Forgot Password?
                                </Link>

                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="group relative flex w-full items-center justify-center overflow-hidden rounded-xl border border-cyan-500/20 bg-cyan-500/10 py-3 text-sm font-semibold text-cyan-400 transition-all duration-300 hover:border-cyan-400/40 hover:bg-cyan-500/15 hover:text-cyan-300 hover:shadow-[0_0_25px_rgba(34,211,238,.18)] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
                            >

                                <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-700 group-hover:translate-x-full" />

                                <span className="relative z-10 flex items-center gap-2">

                                    {loading ? (
                                        <>
                                            <Loader2
                                                size={18}
                                                className="animate-spin"
                                            />

                                            Logging in...

                                        </>
                                    ) : (
                                        "Login"
                                    )}

                                </span>

                            </button>

                            <div className="relative py-2">

                                <div className="absolute left-0 top-1/2 h-px w-full bg-white/10" />

                                <span className="relative mx-auto flex w-fit bg-[#141414] px-3 text-xs uppercase tracking-[0.25em] text-white/30">
                                    OR
                                </span>

                            </div>

                            <button
                                type="button"
                                onClick={loginWithGithub}
                                className="group relative flex w-full items-center justify-center gap-3 overflow-hidden rounded-xl border border-white/10 bg-[#0F0F0F] py-3 text-sm font-medium text-white/80 transition-all duration-300 hover:border-cyan-500/30 hover:bg-cyan-500/5 hover:text-white hover:shadow-[0_0_20px_rgba(34,211,238,.12)]"
                            >

                                <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-700 group-hover:translate-x-full" />

                                <FaGithub
                                    size={18}
                                    className="relative z-10"
                                />

                                <span className="relative z-10">
                                    Continue with GitHub
                                </span>

                            </button>

                        </form>

                        <div className="mt-8">

                            <p className="text-center text-sm text-white/50">

                                Don't have an account?

                                <Link
                                    to="/register"
                                    className="ml-2 font-semibold text-cyan-400 transition hover:text-cyan-300"
                                >
                                    Create Account
                                </Link>

                            </p>

                        </div>

                    </div>

                </div>

            </div>

            {/* Background Glow */}

            <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">

                <div className="absolute left-1/2 top-0 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-cyan-500/10 blur-[140px]" />

                <div className="absolute -left-32 bottom-0 h-72 w-72 rounded-full bg-cyan-500/5 blur-[120px]" />

                <div className="absolute -right-32 top-1/4 h-72 w-72 rounded-full bg-cyan-500/5 blur-[120px]" />

            </div>

        </div>

    );
}