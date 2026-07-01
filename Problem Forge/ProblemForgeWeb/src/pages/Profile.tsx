import { useEffect, useMemo, useState } from "react";
import axios from "axios";

import {
    IconBrandGithub,
    IconBolt,
    IconCrown,
    IconEdit,
    IconMail,
    IconShieldCheckFilled,
    IconShieldLockFilled,
    IconStarFilled,
    IconUsers,
    IconUserPlus,
    IconArticle,
    IconLanguage,
} from "@tabler/icons-react";

const api = import.meta.env.VITE_BACKEND_URL;

const DEFAULT_PROFILE_PICTURE =
    "https://res.cloudinary.com/dlzi244at/image/upload/v1763367677/defaultPersonImage_exseqc.avif";

interface Subscription {
    plan: "free" | "premium";
    startedAt: string | null;
    expiresAt: string | null;
}

interface User {

    _id: string;

    username: string;

    email: string;

    bio: string;

    profilePicture: string;

    avatar?: string;

    githubId?: string;

    githubUsername?: string;

    subscription: Subscription;

    reputation: number;

    showReputation: boolean;

    isEmailVerified: boolean;

    twoStepVerification: boolean;

    totalPoints: number;

    experiencePoints: number;

    streaks: number;

    badgesCount: number;

    role: string;

    activityVisibility: string;

    authProvider: string;

    preferredLanguage: string;

    enableProblemTimer: boolean;

    followers: number;

    following: number;

    posts: number;

    createdAt: string;
}

export const Profile = () => {

    const [loading, setLoading] = useState(true);

    const [user, setUser] =
        useState<User | null>(null);

    const [error, setError] =
        useState("");

    useEffect(() => {

        const fetchProfile = async () => {

            try {

                const response =
                    await axios.get(
                        `${api}/users/me`,
                        {
                            withCredentials: true,
                        }
                    );

                setUser(
                    response.data.data
                );

            } catch (error: any) {

                setError(
                    error?.response?.data?.message ??
                    "Unable to load profile."
                );

            } finally {

                setLoading(false);

            }

        };

        fetchProfile();

    }, []);

    const avatar = useMemo(() => {

        if (!user) return "";

        return user.profilePicture !== DEFAULT_PROFILE_PICTURE
            ? user.profilePicture
            : user.avatar ?? user.profilePicture;

    }, [user]);

    const level = useMemo(() => {

        if (!user) return 1;

        return Math.floor(
            user.experiencePoints / 100
        ) + 1;

    }, [user]);

    const levelProgress = useMemo(() => {

        if (!user) return 0;

        return user.experiencePoints % 100;

    }, [user]);

    if (loading) {

        return (

            <div className="flex min-h-screen items-center justify-center bg-[#080808]">

                <div className="h-14 w-14 animate-spin rounded-full border-4 border-cyan-500 border-t-transparent" />

            </div>

        );

    }

    if (error) {

        return (

            <div className="flex min-h-screen items-center justify-center bg-[#080808]">

                <h1 className="text-red-400">

                    {error}

                </h1>

            </div>

        );

    }

    if (!user) return null;

    return (

        <div className="min-h-screen bg-[#080808]">

            <div className="mx-auto max-w-7xl px-5 py-8">

                {/* Top Profile Card */}

                <div className="overflow-hidden rounded-3xl border border-white/10 bg-[#111111]">
                    <div className="relative h-36 overflow-hidden">

                        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 via-sky-500/10 to-indigo-500/20" />

                        <div className="absolute -left-20 -top-20 h-72 w-72 rounded-full bg-cyan-500/20 blur-[120px]" />

                        <div className="absolute right-0 top-0 h-60 w-60 rounded-full bg-sky-500/15 blur-[120px]" />

                    </div>

                    <div className="relative px-8 pb-8">

                        <div className="-mt-16 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">

                            <div className="flex flex-col gap-6 sm:flex-row sm:items-end">

                                <div className="group relative">

                                    <img
                                        src={avatar}
                                        alt={user.username}
                                        className="h-32 w-32 rounded-3xl border-4 border-[#111111] object-cover shadow-[0_20px_60px_rgba(0,0,0,.45)] transition duration-300 group-hover:scale-[1.03]"
                                    />

                                    <div className="absolute inset-0 flex items-center justify-center rounded-3xl bg-black/50 opacity-0 transition group-hover:opacity-100">

                                        <IconEdit
                                            size={24}
                                            className="text-white"
                                        />

                                    </div>

                                </div>

                                <div>

                                    <div className="flex flex-wrap items-center gap-3">

                                        <h1 className="text-4xl font-black tracking-tight text-white">

                                            {user.username}

                                        </h1>

                                        <span
                                            className={`rounded-full px-3 py-1 text-xs font-semibold ${user.subscription.plan === "premium"
                                                    ? "border border-yellow-500/30 bg-yellow-500/10 text-yellow-300"
                                                    : "border border-cyan-500/30 bg-cyan-500/10 text-cyan-300"
                                                }`}
                                        >

                                            {user.subscription.plan === "premium"
                                                ? "Premium"
                                                : "Free"}

                                        </span>

                                    </div>

                                    <p className="mt-2 text-white/45">

                                        @{user.username}

                                    </p>

                                    <p className="mt-4 max-w-2xl leading-7 text-white/65">

                                        {user.bio?.trim()
                                            ? user.bio
                                            : "No bio has been added yet."}

                                    </p>

                                </div>

                            </div>

                            <button
                                className="inline-flex items-center gap-2 rounded-2xl border border-cyan-500/20 bg-cyan-500/10 px-6 py-3 font-medium text-cyan-300 transition hover:border-cyan-400/40 hover:bg-cyan-500/20"
                            >

                                <IconEdit
                                    size={18}
                                />

                                Edit Profile

                            </button>

                        </div>

                        <div className="mt-10 grid gap-6 lg:grid-cols-[340px_1fr]">

                            {/* Forge Rank */}

                            <div className="rounded-3xl border border-cyan-500/15 bg-cyan-500/[0.04] p-6">

                                <div className="flex items-center gap-2 text-cyan-300">

                                    <IconBolt
                                        size={18}
                                    />

                                    <span className="text-xs font-semibold uppercase tracking-[0.25em]">

                                        Forge Level

                                    </span>

                                </div>

                                <h2 className="mt-4 text-5xl font-black text-white">

                                    {level}

                                </h2>

                                <p className="mt-2 text-sm text-white/45">

                                    {user.experiencePoints} XP Earned

                                </p>

                                <div className="mt-6 h-3 overflow-hidden rounded-full bg-white/10">

                                    <div
                                        style={{
                                            width: `${levelProgress}%`,
                                        }}
                                        className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-sky-500 transition-all duration-500"
                                    />

                                </div>

                                <div className="mt-3 flex justify-between text-xs text-white/40">

                                    <span>

                                        {levelProgress}/100 XP

                                    </span>

                                    <span>

                                        Level {level + 1}

                                    </span>

                                </div>

                            </div>

                            {/* Quick Stats */}

                            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">

                                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition hover:border-cyan-500/30">

                                    <IconStarFilled
                                        size={20}
                                        className="text-yellow-400"
                                    />

                                    <h3 className="mt-5 text-3xl font-black text-white">

                                        {user.totalPoints}

                                    </h3>

                                    <p className="mt-1 text-sm text-white/45">

                                        Points

                                    </p>

                                </div>

                                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition hover:border-cyan-500/30">

                                    <IconBolt
                                        size={20}
                                        className="text-orange-400"
                                    />

                                    <h3 className="mt-5 text-3xl font-black text-white">

                                        {user.streaks}

                                    </h3>

                                    <p className="mt-1 text-sm text-white/45">

                                        Day Streak

                                    </p>

                                </div>

                                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition hover:border-cyan-500/30">

                                    <IconUsers
                                        size={20}
                                        className="text-cyan-400"
                                    />

                                    <h3 className="mt-5 text-3xl font-black text-white">

                                        {user.followers}

                                    </h3>

                                    <p className="mt-1 text-sm text-white/45">

                                        Followers

                                    </p>

                                </div>

                                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition hover:border-cyan-500/30">

                                    <IconUserPlus
                                        size={20}
                                        className="text-green-400"
                                    />

                                    <h3 className="mt-5 text-3xl font-black text-white">

                                        {user.following}

                                    </h3>

                                    <p className="mt-1 text-sm text-white/45">

                                        Following

                                    </p>

                                </div>

                            </div>

                        </div>

                    </div>

                    <div className="mt-8 grid gap-6 lg:grid-cols-2">

                        {/* About */}

                        <div className="rounded-3xl border border-white/10 bg-[#111111] p-6">

                            <div className="mb-5 flex items-center justify-between">

                                <h2 className="text-xl font-bold text-white">

                                    About

                                </h2>

                                <button className="rounded-xl border border-white/10 p-2 transition hover:border-cyan-500/30 hover:bg-cyan-500/10">

                                    <IconEdit
                                        size={18}
                                        className="text-cyan-300"
                                    />

                                </button>

                            </div>

                            <p className="leading-8 text-white/60">

                                {user.bio?.trim()
                                    ? user.bio
                                    : "No bio has been added yet. Tell everyone who you are and what technologies you love."}

                            </p>

                        </div>

                        {/* Account */}

                        <div className="rounded-3xl border border-white/10 bg-[#111111] p-6">

                            <h2 className="mb-6 text-xl font-bold text-white">

                                Account

                            </h2>

                            <div className="space-y-4">

                                <div className="flex items-center justify-between rounded-2xl bg-white/[0.03] px-5 py-4">

                                    <div className="flex items-center gap-3">

                                        <IconMail
                                            size={20}
                                            className="text-cyan-300"
                                        />

                                        <span className="text-white/55">

                                            Email

                                        </span>

                                    </div>

                                    <span className="text-sm text-white">

                                        {user.email}

                                    </span>

                                </div>

                                <div className="flex items-center justify-between rounded-2xl bg-white/[0.03] px-5 py-4">

                                    <div className="flex items-center gap-3">

                                        <IconShieldCheckFilled
                                            size={20}
                                            className={
                                                user.isEmailVerified
                                                    ? "text-green-400"
                                                    : "text-red-400"
                                            }
                                        />

                                        <span className="text-white/55">

                                            Email Verification

                                        </span>

                                    </div>

                                    <span
                                        className={
                                            user.isEmailVerified
                                                ? "font-semibold text-green-400"
                                                : "font-semibold text-red-400"
                                        }
                                    >

                                        {user.isEmailVerified
                                            ? "Verified"
                                            : "Not Verified"}

                                    </span>

                                </div>

                                <div className="flex items-center justify-between rounded-2xl bg-white/[0.03] px-5 py-4">

                                    <div className="flex items-center gap-3">

                                        <IconShieldLockFilled
                                            size={20}
                                            className="text-cyan-300"
                                        />

                                        <span className="text-white/55">

                                            Two-Factor Authentication

                                        </span>

                                    </div>

                                    <span className="text-white">

                                        {user.twoStepVerification
                                            ? "Enabled"
                                            : "Disabled"}

                                    </span>

                                </div>

                                <div className="flex items-center justify-between rounded-2xl bg-white/[0.03] px-5 py-4">

                                    <div className="flex items-center gap-3">

                                        <IconLanguage
                                            size={20}
                                            className="text-cyan-300"
                                        />

                                        <span className="text-white/55">

                                            Preferred Language

                                        </span>

                                    </div>

                                    <span className="capitalize text-white">

                                        {user.preferredLanguage}

                                    </span>

                                </div>

                                <div className="flex items-center justify-between rounded-2xl bg-white/[0.03] px-5 py-4">

                                    <span className="text-white/55">

                                        Authentication Provider

                                    </span>

                                    <span className="rounded-xl bg-cyan-500/10 px-3 py-1 text-sm capitalize text-cyan-300">

                                        {user.authProvider}

                                    </span>

                                </div>

                                <div className="flex items-center justify-between rounded-2xl bg-white/[0.03] px-5 py-4">

                                    <span className="text-white/55">

                                        Role

                                    </span>

                                    <span className="rounded-xl bg-purple-500/10 px-3 py-1 text-sm capitalize text-purple-300">

                                        {user.role}

                                    </span>

                                </div>

                            </div>

                        </div>

                    </div>

                    <div className="mt-8 grid gap-6 lg:grid-cols-2">

                        {/* Subscription */}

                        <div className="overflow-hidden rounded-3xl border border-white/10 bg-[#111111]">

                            <div className="relative overflow-hidden border-b border-white/10 p-6">

                                <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/10 via-orange-500/5 to-transparent" />

                                <div className="relative flex items-center justify-between">

                                    <div>

                                        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-yellow-400">

                                            Subscription

                                        </p>

                                        <h2 className="mt-2 text-2xl font-black text-white">

                                            {user.subscription.plan === "premium"
                                                ? "Premium Member"
                                                : "Free Plan"}

                                        </h2>

                                    </div>

                                    <div className="rounded-2xl bg-yellow-500/10 p-4">

                                        <IconCrown
                                            size={32}
                                            className="text-yellow-400"
                                        />

                                    </div>

                                </div>

                            </div>

                            <div className="space-y-4 p-6">

                                <div className="flex items-center justify-between rounded-2xl bg-white/[0.03] p-4">

                                    <span className="text-white/55">

                                        Current Plan

                                    </span>

                                    <span
                                        className={`rounded-xl px-3 py-1 text-sm font-semibold ${user.subscription.plan === "premium"
                                                ? "bg-yellow-500/10 text-yellow-300"
                                                : "bg-cyan-500/10 text-cyan-300"
                                            }`}
                                    >

                                        {user.subscription.plan}

                                    </span>

                                </div>

                                <div className="flex items-center justify-between rounded-2xl bg-white/[0.03] p-4">

                                    <span className="text-white/55">

                                        Started

                                    </span>

                                    <span className="text-white">

                                        {user.subscription.startedAt
                                            ? new Date(
                                                user.subscription.startedAt
                                            ).toLocaleDateString()
                                            : "Free Forever"}

                                    </span>

                                </div>

                                <div className="flex items-center justify-between rounded-2xl bg-white/[0.03] p-4">

                                    <span className="text-white/55">

                                        Expires

                                    </span>

                                    <span className="text-white">

                                        {user.subscription.expiresAt
                                            ? new Date(
                                                user.subscription.expiresAt
                                            ).toLocaleDateString()
                                            : "--"}

                                    </span>

                                </div>

                                {user.subscription.plan === "free" && (

                                    <button className="mt-2 w-full rounded-2xl bg-gradient-to-r from-cyan-500 to-sky-500 py-3 font-semibold text-white transition hover:scale-[1.02]">

                                        Upgrade to Premium

                                    </button>

                                )}

                            </div>

                        </div>

                        {/* GitHub */}

                        {user.githubId ? (

                            <div className="overflow-hidden rounded-3xl border border-white/10 bg-[#111111]">

                                <div className="relative overflow-hidden border-b border-white/10 p-6">

                                    <div className="absolute inset-0 bg-gradient-to-r from-white/5 via-transparent to-transparent" />

                                    <div className="relative flex items-center justify-between">

                                        <div>

                                            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/50">

                                                GitHub

                                            </p>

                                            <h2 className="mt-2 text-2xl font-black text-white">

                                                Connected

                                            </h2>

                                        </div>

                                        <div className="rounded-2xl bg-white/5 p-4">

                                            <IconBrandGithub
                                                size={32}
                                                className="text-white"
                                            />

                                        </div>

                                    </div>

                                </div>

                                <div className="space-y-4 p-6">

                                    <div className="rounded-2xl bg-white/[0.03] p-4">

                                        <p className="text-xs uppercase tracking-widest text-white/40">

                                            Username

                                        </p>

                                        <h3 className="mt-2 text-lg font-bold text-white">

                                            @{user.githubUsername}

                                        </h3>

                                    </div>

                                    <a
                                        href={`https://github.com/${user.githubUsername}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center justify-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] py-3 font-medium text-white transition hover:border-cyan-500/30 hover:bg-cyan-500/10 hover:text-cyan-300"
                                    >

                                        <IconBrandGithub
                                            size={20}
                                        />

                                        View GitHub Profile

                                    </a>

                                </div>

                            </div>

                        ) : (

                            <div className="overflow-hidden rounded-3xl border border-dashed border-white/10 bg-[#111111]">

                                <div className="flex h-full flex-col items-center justify-center p-10 text-center">

                                    <div className="rounded-3xl bg-white/5 p-5">

                                        <IconBrandGithub
                                            size={40}
                                            className="text-white/60"
                                        />

                                    </div>

                                    <h3 className="mt-6 text-2xl font-bold text-white">

                                        GitHub Not Connected

                                    </h3>

                                    <p className="mt-3 max-w-sm text-white/45">

                                        Connect your GitHub account to display
                                        your profile and unlock GitHub login.

                                    </p>

                                    <button className="mt-6 rounded-2xl border border-cyan-500/20 bg-cyan-500/10 px-6 py-3 font-medium text-cyan-300 transition hover:bg-cyan-500/20">

                                        Connect GitHub

                                    </button>

                                </div>

                            </div>

                        )}

                    </div>

                    {/* Bottom Cards */}

                    <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

                        {user.showReputation && (

                            <div className="group rounded-3xl border border-white/10 bg-[#111111] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-cyan-500/30">

                                <div className="flex items-center justify-between">

                                    <span className="text-white/45">

                                        Reputation

                                    </span>

                                    <div className="rounded-xl bg-cyan-500/10 p-2">

                                        <IconBolt
                                            size={18}
                                            className="text-cyan-300"
                                        />

                                    </div>

                                </div>

                                <h2 className="mt-5 text-4xl font-black text-white">

                                    {user.reputation}

                                </h2>

                            </div>

                        )}

                        <div className="group rounded-3xl border border-white/10 bg-[#111111] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-yellow-500/30">

                            <div className="flex items-center justify-between">

                                <span className="text-white/45">

                                    Badges

                                </span>

                                <div className="rounded-xl bg-yellow-500/10 p-2">

                                    <IconCrown
                                        size={18}
                                        className="text-yellow-300"
                                    />

                                </div>

                            </div>

                            <h2 className="mt-5 text-4xl font-black text-white">

                                {user.badgesCount}

                            </h2>

                        </div>

                        <div className="group rounded-3xl border border-white/10 bg-[#111111] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-purple-500/30">

                            <div className="flex items-center justify-between">

                                <span className="text-white/45">

                                    Posts

                                </span>

                                <div className="rounded-xl bg-purple-500/10 p-2">

                                    <IconArticle
                                        size={18}
                                        className="text-purple-300"
                                    />

                                </div>

                            </div>

                            <h2 className="mt-5 text-4xl font-black text-white">

                                {user.posts}

                            </h2>

                        </div>

                        <div className="group rounded-3xl border border-white/10 bg-[#111111] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-green-500/30">

                            <div className="flex items-center justify-between">

                                <span className="text-white/45">

                                    Status

                                </span>

                                <div className="rounded-xl bg-green-500/10 p-2">

                                    <IconShieldCheckFilled
                                        size={18}
                                        className="text-green-300"
                                    />

                                </div>

                            </div>

                            <div className="mt-5 space-y-3">

                                <div className="flex items-center justify-between">

                                    <span className="text-sm text-white/45">

                                        Visibility

                                    </span>

                                    <span className="rounded-lg bg-white/5 px-2 py-1 text-xs capitalize text-white">

                                        {user.activityVisibility}

                                    </span>

                                </div>

                                <div className="flex items-center justify-between">

                                    <span className="text-sm text-white/45">

                                        Problem Timer

                                    </span>

                                    <span
                                        className={`rounded-lg px-2 py-1 text-xs ${user.enableProblemTimer
                                                ? "bg-green-500/10 text-green-300"
                                                : "bg-red-500/10 text-red-300"
                                            }`}
                                    >

                                        {user.enableProblemTimer
                                            ? "Enabled"
                                            : "Disabled"}

                                    </span>

                                </div>

                            </div>

                        </div>

                    </div>

                                    {/* Bottom spacing */}

                <div className="h-10" />

            </div>

            {/* Background */}

            <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">

                <div className="absolute left-1/2 top-0 h-[550px] w-[550px] -translate-x-1/2 rounded-full bg-cyan-500/10 blur-[150px]" />

                <div className="absolute -left-44 top-1/3 h-80 w-80 rounded-full bg-sky-500/10 blur-[120px]" />

                <div className="absolute -right-44 bottom-0 h-80 w-80 rounded-full bg-indigo-500/10 blur-[120px]" />

                <div className="absolute bottom-1/3 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-cyan-400/5 blur-[140px]" />

            </div>

        </div>
    </div>
    );

};