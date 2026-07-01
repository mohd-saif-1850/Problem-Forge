import { useMemo, useState } from "react";
import type { SubmitEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { FaGithub } from "react-icons/fa";
import axios from "axios";
import { toast } from "sonner";

const api = import.meta.env.VITE_BACKEND_URL;

export const CreateAccount = () => {

    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);

    const [error, setError] = useState("");

    const [showPassword, setShowPassword] =
        useState(false);

    const [showConfirmPassword, setShowConfirmPassword] =
        useState(false);

    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const passwordStrength = useMemo(() => {

        let score = 0;

        if (formData.password.length >= 8) score++;

        if (/[A-Z]/.test(formData.password)) score++;

        if (/[a-z]/.test(formData.password)) score++;

        if (/\d/.test(formData.password)) score++;

        if (/[^A-Za-z0-9]/.test(formData.password)) score++;

        return score;

    }, [formData.password]);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {

        setError("");

        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));

    };

    const handleGithubSignup = () => {

        window.location.href =
            `${api}/oauth/github-login`;

    };

    const handleSubmit = async (
        e: SubmitEvent<HTMLFormElement>
    ) => {

        e.preventDefault();

        setError("");

        if (!formData.username.trim()) {
            return setError(
                "Username is required."
            );
        }

        if (!formData.email.trim()) {
            return setError(
                "Email is required."
            );
        }

        if (!formData.password.trim()) {
            return setError(
                "Password is required."
            );
        }

        if (
            formData.password !==
            formData.confirmPassword
        ) {
            return setError(
                "Passwords do not match."
            );
        }

        try {

            setLoading(true);

            const response = await axios.post(
                `${api}/users/register-email`,
                {
                    username: formData.username,
                    email: formData.email,
                    password: formData.password,
                }
            );

            localStorage.setItem(
                "problemforge:verifyEmail",
                formData.email
            );

            toast.success(
                response.data.message
            );

            navigate(
                "/verify-email-otp",
                {
                    replace: true,
                }
            );

        } catch (error: any) {

            setError(
                error?.response?.data?.message ??
                "Unable to create your account."
            );

        } finally {

            setLoading(false);

        }

    };

    return (

        <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#080808] px-4 py-8">

            <div className="grid w-full max-w-6xl grid-cols-1 gap-10 lg:grid-cols-2">

                {/* Left Side */}

                <div className="hidden flex-col justify-center lg:flex">

                    <h1 className="text-6xl font-black tracking-tight">

                        <span className="text-white">
                            Problem
                        </span>

                        <span className="text-cyan-400">
                            Forge
                        </span>

                    </h1>

                    <p className="mt-6 max-w-md text-lg leading-8 text-white/60">

                        Create your account and start solving
                        problems, participating in contests,
                        earning experience, and climbing the
                        leaderboard.

                    </p>

                </div>

                {/* Right Side */}

                <div className="flex items-center justify-center">

                    <div className="w-full max-w-md rounded-3xl border border-white/10 bg-[#111111]/90 p-6 backdrop-blur-xl sm:p-8">

                        <div className="mb-8 text-center lg:hidden">

                            <h1 className="text-4xl font-black">

                                <span className="text-white">
                                    Problem
                                </span>

                                <span className="text-cyan-400">
                                    Forge
                                </span>

                            </h1>

                        </div>

                        <h2 className="text-3xl font-bold text-white">

                            Create Account

                        </h2>

                        <p className="mt-2 text-sm text-white/50">

                            Join thousands of developers improving
                            their coding skills.

                        </p>

                        <form
                            onSubmit={handleSubmit}
                            className="mt-8 space-y-5"
                        >

                            <div>

                                <label className="mb-2 block text-sm font-medium text-white/70">

                                    Username

                                </label>

                                <input
                                    type="text"
                                    name="username"
                                    value={formData.username}
                                    onChange={handleChange}
                                    autoComplete="username"
                                    placeholder="Choose a username"
                                    className="w-full rounded-xl border border-white/10 bg-[#0F0F0F] px-4 py-3 text-white outline-none transition-all duration-200 placeholder:text-white/25 focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20"
                                />

                            </div>

                            <div>

                                <label className="mb-2 block text-sm font-medium text-white/70">

                                    Email

                                </label>

                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    autoComplete="email"
                                    placeholder="Enter your email"
                                    className="w-full rounded-xl border border-white/10 bg-[#0F0F0F] px-4 py-3 text-white outline-none transition-all duration-200 placeholder:text-white/25 focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20"
                                />

                            </div>

                            <div>

                                <label className="mb-2 block text-sm font-medium text-white/70">

                                    Password

                                </label>

                                <div className="relative">

                                    <input
                                        type={
                                            showPassword
                                                ? "text"
                                                : "password"
                                        }
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        autoComplete="new-password"
                                        placeholder="Create a password"
                                        className="w-full rounded-xl border border-white/10 bg-[#0F0F0F] px-4 py-3 pr-12 text-white outline-none transition-all duration-200 placeholder:text-white/25 focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20"
                                    />

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowPassword(
                                                !showPassword
                                            )
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

                                <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">

                                    <div
                                        style={{
                                            width: `${passwordStrength * 20}%`,
                                        }}
                                        className="h-full rounded-full bg-cyan-400 transition-all duration-300"
                                    />

                                </div>

                                <p className="mt-2 text-xs text-white/40">

                                    Use at least 8 characters with uppercase,
                                    lowercase, numbers, and symbols.

                                </p>

                            </div>

                            <div>

                                <label className="mb-2 block text-sm font-medium text-white/70">

                                    Confirm Password

                                </label>

                                <div className="relative">

                                    <input
                                        type={
                                            showConfirmPassword
                                                ? "text"
                                                : "password"
                                        }
                                        name="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        autoComplete="new-password"
                                        placeholder="Confirm your password"
                                        className="w-full rounded-xl border border-white/10 bg-[#0F0F0F] px-4 py-3 pr-12 text-white outline-none transition-all duration-200 placeholder:text-white/25 focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20"
                                    />

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowConfirmPassword(
                                                !showConfirmPassword
                                            )
                                        }
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 transition hover:text-cyan-400"
                                    >

                                        {showConfirmPassword ? (

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

                            <button
                                type="submit"
                                disabled={loading}
                                className="group relative flex w-full items-center justify-center overflow-hidden rounded-xl border border-cyan-500/20 bg-cyan-500/10 py-3 font-medium text-cyan-400 transition-all duration-300 hover:border-cyan-400/40 hover:bg-cyan-500/15 hover:text-cyan-300 hover:shadow-[0_0_25px_rgba(34,211,238,.18)] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
                            >

                                <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full" />

                                <span className="relative z-10 flex items-center gap-2">

                                    {loading ? (

                                        <>

                                            <Loader2
                                                size={18}
                                                className="animate-spin"
                                            />

                                            Creating Account...

                                        </>

                                    ) : (

                                        "Create Account"

                                    )}

                                </span>

                            </button>

                            <div className="relative py-2">

                                <div className="absolute inset-0 flex items-center">

                                    <div className="w-full border-t border-white/10" />

                                </div>

                                <div className="relative flex justify-center">

                                    <span className="bg-[#111111] px-4 text-xs uppercase tracking-widest text-white/40">

                                        Or continue with

                                    </span>

                                </div>

                            </div>

                            <button
                                type="button"
                                onClick={handleGithubSignup}
                                className="group relative flex w-full cursor-pointer items-center justify-center gap-3 overflow-hidden rounded-xl border border-white/10 bg-[#0F0F0F] py-3 text-sm font-medium text-white/70 transition-all duration-300 hover:border-cyan-500/40 hover:bg-cyan-500/5 hover:text-cyan-300"
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

                            <p className="pt-2 text-center text-sm text-white/50">

                                Already have an account?

                                <Link
                                    to="/login"
                                    className="ml-2 font-medium text-cyan-400 transition hover:text-cyan-300"
                                >

                                    Login

                                </Link>

                            </p>

                        </form>

                    </div>

                </div>


            </div>

            {/* Background Glow */}

            <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">

                <div className="absolute left-1/2 top-0 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-cyan-500/10 blur-[140px]" />

                <div className="absolute -left-40 bottom-0 h-80 w-80 rounded-full bg-cyan-500/5 blur-[120px]" />

                <div className="absolute -right-40 top-1/4 h-80 w-80 rounded-full bg-cyan-500/5 blur-[120px]" />

            </div>

        </div>

    );

};