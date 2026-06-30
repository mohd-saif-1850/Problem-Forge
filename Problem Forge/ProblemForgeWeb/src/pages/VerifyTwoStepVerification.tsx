import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

const api = import.meta.env.VITE_BACKEND_URL;

export const VerifyTwoStepVerification = () => {

    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const identifierFromUrl = searchParams.get("identifier");

    const identifier =
        identifierFromUrl ??
        localStorage.getItem("problemforge:twoStepIdentifier");

    const [code, setCode] = useState<string[]>(
        ["", "", "", ""]
    );

    const [error, setError] = useState("");

    const [loading, setLoading] = useState(false);

    const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

    useEffect(() => {

        if (!identifier) {
            navigate("/login", {
                replace: true,
            });
        }

    }, [identifier, navigate]);

    const handleChange = (
        value: string,
        index: number
    ) => {

        value = value.toUpperCase();

        if (!/^[A-Z0-9]?$/.test(value)) {
            return;
        }

        const updatedCode = [...code];

        updatedCode[index] = value;

        setCode(updatedCode);

        if (value && index < 3) {
            inputRefs.current[index + 1]?.focus();
        }

    };

    const handleKeyDown = (
        e: React.KeyboardEvent<HTMLInputElement>,
        index: number
    ) => {

        if (
            e.key === "Backspace" &&
            !code[index] &&
            index > 0
        ) {

            inputRefs.current[index - 1]?.focus();

        }

        if (
            e.key === "ArrowLeft" &&
            index > 0
        ) {

            inputRefs.current[index - 1]?.focus();

        }

        if (
            e.key === "ArrowRight" &&
            index < 3
        ) {

            inputRefs.current[index + 1]?.focus();

        }

    };

    const handlePaste = (
        e: React.ClipboardEvent<HTMLInputElement>
    ) => {

        e.preventDefault();

        const pastedValue = e.clipboardData
            .getData("text")
            .replace(/\D/g, "")
            .slice(0, 4);

        if (!pastedValue) {
            return;
        }

        const updatedCode = [...code];

        pastedValue
            .split("")
            .forEach((digit, index) => {
                updatedCode[index] = digit;
            });

        setCode(updatedCode);

        inputRefs.current[
            Math.min(
                pastedValue.length,
                3
            )
        ]?.focus();

    };

    const handleSubmit = async (
        e: React.FormEvent<HTMLFormElement>
    ) => {

        e.preventDefault();

        setError("");

        const otp = code.join("");

        if (otp.length !== 4) {
            return setError(
                "Please enter the complete verification code."
            );
        }

        const payload = identifier?.includes("@")
            ? {
                email: identifier,
                code: otp,
            }
            : {
                username: identifier,
                code: otp,
            };

        try {

            setLoading(true);

            await axios.post(
                `${api}/users/verify-two-step-verification`,
                payload,
                {
                    withCredentials: true,
                }
            );

            localStorage.removeItem(
                "problemforge:twoStepIdentifier"
            );

            toast.success(
                "Successfully logged in."
            );

            navigate("/problems", {
                replace: true,
            });

        } catch (error: any) {

            setError(
                error.response?.data?.message ??
                "Verification failed."
            );

        } finally {

            setLoading(false);

        }

    };

    return (

        <div className="min-h-screen bg-[#080808] flex items-center justify-center px-4 py-8">

            <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">

                {/* LEFT SIDE */}

                <div className="hidden lg:flex flex-col">

                    <h1 className="text-6xl font-black">

                        <span className="text-white">
                            Problem
                        </span>

                        <span className="text-cyan-400">
                            Forge
                        </span>

                    </h1>

                    <p className="mt-6 text-white/60 text-lg max-w-md">

                        We've sent a verification code to your account.
                        Enter it below to continue securely.

                    </p>

                </div>

                {/* RIGHT SIDE */}

                <div className="flex justify-center">

                    <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-[#141414] p-6 lg:p-7 shadow-[0_20px_80px_rgba(0,0,0,.45)]">

                        <div className="lg:hidden mb-8 text-center">

                            <h1 className="text-4xl font-black">

                                <span className="text-white">
                                    Problem
                                </span>

                                <span className="text-cyan-400">
                                    Forge
                                </span>

                            </h1>

                        </div>

                        <h2 className="text-2xl font-semibold text-white">

                            Two-Step Verification

                        </h2>

                        <p className="mt-2 text-sm text-white/50">

                            Enter the 4-character verification code sent to your account.

                        </p>

                        <form
                            onSubmit={handleSubmit}
                            className="mt-8"
                        >

                            <div className="flex justify-between gap-2">

                                {code.map((digit, index) => (

                                    <input
                                        key={index}
                                        ref={(element) => {
                                            inputRefs.current[index] = element;
                                        }}
                                        type="text"
                                        autoCapitalize="characters"
                                        autoCorrect="off"
                                        spellCheck={false}
                                        maxLength={1}
                                        autoComplete="one-time-code"
                                        value={digit}
                                        onChange={(e) =>
                                            handleChange(
                                                e.target.value,
                                                index
                                            )
                                        }
                                        onKeyDown={(e) =>
                                            handleKeyDown(
                                                e,
                                                index
                                            )
                                        }
                                        onPaste={handlePaste}
                                        className="h-14 w-12 rounded-xl border border-white/10 bg-[#0F0F0F] text-center text-xl font-semibold text-white outline-none transition-all duration-300 focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 sm:h-16 sm:w-14 sm:text-2xl"
                                    />

                                ))}

                            </div>

                            {error && (

                                <div className="mt-5 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">

                                    {error}

                                </div>

                            )}

                            <button
                                type="submit"
                                disabled={loading}
                                className="group relative mt-6 flex w-full items-center justify-center overflow-hidden rounded-xl border border-cyan-500/20 bg-cyan-500/10 py-3 text-sm font-semibold text-cyan-400 transition-all duration-300 hover:border-cyan-400/40 hover:bg-cyan-500/15 hover:text-cyan-300 hover:shadow-[0_0_25px_rgba(34,211,238,.18)] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
                            >

                                <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full" />

                                <span className="relative z-10 flex items-center gap-2">

                                    {loading ? (

                                        <>

                                            <Loader2
                                                size={18}
                                                className="animate-spin"
                                            />

                                            Verifying...

                                        </>

                                    ) : (

                                        "Verify"

                                    )}

                                </span>

                            </button>


                            <div className="mt-6 flex items-center justify-between">

                                <button
                                    type="button"
                                    className="text-sm font-medium text-cyan-400 transition hover:text-cyan-300 disabled:cursor-not-allowed disabled:text-white/30"
                                >
                                    Resend Code
                                </button>

                                <span className="text-sm text-white/40">

                                    Expires in 05:00

                                </span>

                            </div>

                            <div className="mt-8 border-t border-white/10 pt-6">

                                <p className="text-center text-sm text-white/50">

                                    Wrong account?

                                    <Link
                                        to="/login"
                                        onClick={() =>
                                            localStorage.removeItem(
                                                "twoStepIdentifier"
                                            )
                                        }
                                        className="ml-2 font-semibold text-cyan-400 transition hover:text-cyan-300"
                                    >
                                        Back to Login
                                    </Link>

                                </p>

                            </div>

                        </form>

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
};